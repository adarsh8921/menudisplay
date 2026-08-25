import React, { useEffect, useState } from 'react';
import { fetchKioskProducts } from '../services/apiService';
import houseMasterLogo from '../assets/House Master logo_page-0001.png';
import houseMasterLogoBlack from '../assets/House Master logo_page black.png';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Flame, 
  Clock, 
  Radio, 
  Award, 
  Leaf, 
  Truck, 
  MapPin, 
  CheckCircle2,
  UtensilsCrossed
} from 'lucide-react';

export default function Model2KitchenBoard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [nowDate, setNowDate] = useState(new Date());
  const [themeMode, setThemeMode] = useState('cream'); // 'cream' (default) | 'dark' | 'golden'
  const [sessionFilter, setSessionFilter] = useState('all'); // 'all' | 'now' | 'breakfast' | 'lunch' | 'evening-snacks'

  // Live real-time clock for TV display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setNowDate(now);
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const [apiEndpoint, setApiEndpoint] = useState('GRD5001');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchKioskProducts();
      if (res.success && res.categories.length > 0) {
        setCategories(res.categories);
        if (res.apiEndpoint) {
          setApiEndpoint(res.apiEndpoint);
        }
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // Helper: check if a product timing is currently active based on start_time and end_time
  const checkTimingStatus = (timings) => {
    if (!timings || timings.length === 0) {
      return { isActive: true, isAllDay: true, label: 'All Day' };
    }

    const currentMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

    for (const t of timings) {
      if (!t.startTime) continue;

      const [sH, sM] = t.startTime.split(':').map(Number);
      let [eH, eM] = (t.endTime || '23:59:59').split(':').map(Number);

      // Handle 12-hour or midnight roll-over if needed (e.g. 00:00:00 as end of day or 03:45 as 15:45)
      let startTotal = sH * 60 + (sM || 0);
      let endTotal = eH * 60 + (eM || 0);

      // If end_time is "03:45:00" for lunch (meaning 3:45 PM / 15:45), normalize 12-hr format:
      if (endTotal < startTotal && endTotal !== 0) {
        if (eH < 12 && (t.sessionName === 'lunch' || t.sessionName === 'evening-snacks' || startTotal >= 720)) {
          endTotal += 12 * 60; // Convert 3:45 to 15:45
        }
      }
      if (endTotal === 0) {
        endTotal = 24 * 60; // 00:00:00 end means end of night
      }

      const isCurrent = currentMinutes >= startTotal && currentMinutes <= endTotal;
      if (isCurrent) {
        return { 
          isActive: true, 
          session: t.sessionName, 
          label: `Active Now (${t.sessionName.replace('-', ' ')})`,
          startTime: t.startTime,
          endTime: t.endTime 
        };
      }
    }

    // Not currently in active window
    const firstTiming = timings[0];
    return { 
      isActive: false, 
      session: firstTiming.sessionName,
      label: `${firstTiming.sessionName.replace('-', ' ')} (${firstTiming.startTime.slice(0,5)} - ${firstTiming.endTime.slice(0,5)})`,
      startTime: firstTiming.startTime,
      endTime: firstTiming.endTime
    };
  };

  // Use black/gold theme logo for dark and golden modes, standard logo for cream
  const currentLogo = (themeMode === 'dark' || themeMode === 'golden')
    ? houseMasterLogoBlack 
    : houseMasterLogo;

  return (
    <div className={`model2-tv-display theme-${themeMode}`}>
      {/* Top TV Header */}
      <header className="m2-tv-header">
        <div className="m2-brand-box">
          <div className="hm-logo-badge">
            <img
              src={currentLogo}
              alt="House Master Facility Management"
              className="hm-logo-img"
            />
          </div>
        </div>

        {/* Live TV Clock & API Info */}
        <div className="m2-live-status-box">
          <div className="m2-theme-controls">
            <span className="theme-label">Theme:</span>
            <button
              className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`}
              onClick={() => setThemeMode('dark')}
            >
              <Moon size={13} className="btn-icon" /> Dark
            </button>
            <button
              className={`theme-btn ${themeMode === 'cream' ? 'active' : ''}`}
              onClick={() => setThemeMode('cream')}
            >
              <Sun size={13} className="btn-icon" /> Cream
            </button>
            <button
              className={`theme-btn ${themeMode === 'golden' ? 'active' : ''}`}
              onClick={() => setThemeMode('golden')}
            >
              <Sparkles size={13} className="btn-icon" /> Gold
            </button>
          </div>

          <div className="m2-time-badge">
            <span className="pulse-dot"></span>
            <Clock size={15} className="m2-badge-icon" />
            <span className="time-text">{currentTime || '12:00 PM'}</span>
          </div>

          <div className="m2-api-badge">
            <Radio size={12} className="m2-badge-icon" />
            <span>LIVE API: {apiEndpoint}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="m2-tv-body">
        {loading ? (
          <div className="m2-loading-screen">
            <div className="spinner"></div>
            <p>CONNECTING TO RESTAURANT MENU FEED...</p>
          </div>
        ) : (
          <div className="m2-categories-container">
            {categories.map((catGroup) => (
              <section key={catGroup.id} className="m2-cat-section">
                <div className="m2-cat-header">
                  <h2 className="m2-cat-name">
                    <UtensilsCrossed size={18} className="cat-icon-svg" />
                    {catGroup.name}
                  </h2>
                  <div className="m2-cat-divider"></div>
                  <span className="cat-count-badge">{catGroup.products.length} ITEMS</span>
                </div>

                <div className="m2-tv-grid">
                  {catGroup.products.map((prod, idx) => {
                    const priceNum = parseFloat(prod.price.replace(/[^\d.]/g, '')) || 0;
                    const mrpNum = prod.mrp ? parseFloat(prod.mrp.replace(/[^\d.]/g, '')) : null;
                    const discount = mrpNum && mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
                    const timingInfo = checkTimingStatus(prod.timings);

                    return (
                      <div 
                        key={prod.id} 
                        className={`m2-tv-card ${timingInfo.isActive ? 'timing-active' : 'timing-scheduled'}`}
                      >
                        {/* Dynamic API & Feature Badges */}
                        {prod.badges && prod.badges.length > 0 ? (
                          <span className={`card-badge ${prod.badges[0].name.toLowerCase().includes('bestseller') ? 'bestseller' : 'special'}`}>
                            <Award size={11} className="badge-svg-icon" /> {prod.badges[0].name}
                          </span>
                        ) : idx === 0 ? (
                          <span className="card-badge bestseller">
                            <Award size={11} className="badge-svg-icon" /> Chef's Pick
                          </span>
                        ) : idx === 1 && discount > 0 ? (
                          <span className="card-badge special">
                            <Flame size={11} className="badge-svg-icon" /> Special {discount}% Off
                          </span>
                        ) : null}

                        {/* Timing Live Status Indicator */}
                        {prod.timings && prod.timings.length > 0 && (
                          <span className={`card-badge-timing ${timingInfo.isActive ? 'now-available' : 'upcoming'}`}>
                            {timingInfo.isActive ? '● ACTIVE NOW' : '🕒 SCHEDULED'}
                          </span>
                        )}

                        <div className="m2-card-img-wrap">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="m2-card-img"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className="m2-card-img-placeholder"
                            style={{ display: prod.image ? 'none' : 'flex' }}
                          >
                            <span>{prod.name.charAt(0)}</span>
                          </div>
                        </div>

                        <div className="m2-card-content">
                          <div className="m2-card-meta-row">
                            {/* Food Type Indicator Dot/Pill (Veg / Non Veg) */}
                            {prod.foodType && (
                              <span className={`m2-diet-badge ${prod.foodType.toLowerCase().includes('non') ? 'non-veg' : 'veg'}`}>
                                <span className="diet-dot"></span>
                                {prod.foodType}
                              </span>
                            )}

                            {/* Session Timing Pill with Start & End Time (e.g. 12:45 - 03:45) */}
                            {prod.timings && prod.timings.length > 0 ? (
                              <span className={`m2-timing-pill ${timingInfo.isActive ? 'active-window' : ''}`} title={`${prod.timings[0].startTime} to ${prod.timings[0].endTime}`}>
                                <Clock size={10} className="timing-icon" />
                                <span className="session-txt">{prod.timings[0].sessionName.replace('-', ' ')}</span>
                                <span className="time-range-txt">
                                  {prod.timings[0].startTime.slice(0, 5)} - {prod.timings[0].endTime.slice(0, 5)}
                                </span>
                              </span>
                            ) : (
                              <span className="m2-category-pill">{catGroup.name}</span>
                            )}
                          </div>

                          <h3 className="m2-card-title">{prod.name}</h3>

                          {/* Manufacturer / Subtitle if available */}
                          {prod.manufacturer && (
                            <span className="m2-mfr-subtitle">By {prod.manufacturer}</span>
                          )}

                          <div className="m2-card-price-row">
                            <div className="m2-price-wrap">
                              <span className="m2-price-currency">₹</span>
                              <span className="m2-price-main">{prod.price.replace(/[^\d.]/g, '')}</span>
                              {prod.unit && prod.unit !== 'PCS' && (
                                <span className="m2-unit-tag">/{prod.unit}</span>
                              )}
                            </div>
                            {mrpNum && mrpNum > priceNum && (
                              <div className="m2-mrp-group">
                                <span className="m2-mrp-old">₹{mrpNum}</span>
                                {discount > 0 && (
                                  <span className="m2-discount-tag">Save {discount}%</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Ticker marquee broadcast footer */}
      <footer className="m2-tv-footer">
        <div className="m2-ticker-wrap">
          <div className="m2-ticker-move">
            <span className="ticker-item">
              <Flame size={14} className="ticker-svg" /> TODAY'S SPECIAL: FRESH PREPARED CHEF DELIGHTS
            </span>
            <span className="ticker-sep">•</span>
            <span className="ticker-item">
              <Truck size={14} className="ticker-svg" /> AVAILABLE FOR DELIVERY ON GOFOOD & SWIGGY
            </span>
            <span className="ticker-sep">•</span>
            <span className="ticker-item">
              <Clock size={14} className="ticker-svg" /> OPEN DAILY: 7:30 AM — 11:00 PM
            </span>
            <span className="ticker-sep">•</span>
            <span className="ticker-item">
              <MapPin size={14} className="ticker-svg" /> VISIT US AT JL. JOHAR NO. 72
            </span>
            <span className="ticker-sep">•</span>
            <span className="ticker-item">
              <CheckCircle2 size={14} className="ticker-svg" /> ALL TAXES INCLUDED IN DISPLAYED PRICES
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
