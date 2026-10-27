import React, { useEffect, useState, useRef } from 'react';
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
  UtensilsCrossed,
  Pause,
  Play,
  Settings,
  X,
  Code2,
  Palette
} from 'lucide-react';

export default function Model2KitchenBoard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [nowDate, setNowDate] = useState(new Date());
  const [themeMode, setThemeMode] = useState('cream'); // 'cream' (default) | 'dark' | 'golden'
  const [sessionFilter, setSessionFilter] = useState('all'); // 'all' | 'now' | 'breakfast' | 'lunch' | 'evening-snacks'
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const scrollContainerRef = useRef(null);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('GRD5001');
  const [errorMsg, setErrorMsg] = useState('');

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

  async function loadData(code = null) {
    setLoading(true);
    setErrorMsg('');
    const res = await fetchKioskProducts(code);
    if (res.apiEndpoint) {
      setApiEndpoint(res.apiEndpoint);
    }
    if (res.success && res.categories.length > 0) {
      setCategories(res.categories);
    } else {
      setCategories([]);
      setErrorMsg(res.message || res.error || 'Products not found');
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (customCodeInput.trim()) {
      loadData(customCodeInput.trim().toUpperCase());
      setIsSettingsOpen(false);
    }
  };

  // Automatic GPU-accelerated ultra-smooth TV Horizontal Infinite Auto-Scroll (60+ FPS)
  useEffect(() => {
    if (!isAutoScroll || loading) return;

    let animationFrameId;
    let isPaused = false;
    let lastTime = performance.now();
    let scrollPos = 0;
    const container = scrollContainerRef.current;
    if (!container) return;

    const wrapper = container.querySelector('.marquee-wrapper');
    if (!wrapper) return;

    // Reset container.scrollLeft so native scroll does not interfere
    container.scrollLeft = 0;

    const onMouseEnter = () => { isPaused = true; };
    const onMouseLeave = () => { 
      isPaused = false; 
      lastTime = performance.now();
    };
    const onTouchStart = () => { isPaused = true; };
    const onTouchEnd = () => { 
      isPaused = false; 
      lastTime = performance.now();
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('touchstart', onTouchStart);
    container.addEventListener('touchend', onTouchEnd);

    // Speed in pixels per second: ~32px/s provides ultra-smooth, perfectly legible scrolling
    const pixelsPerSecond = 32;

    const scrollStep = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused && wrapper && delta > 0 && delta < 0.1) {
        scrollPos += pixelsPerSecond * delta;
        
        const firstSet = wrapper.children[0];
        if (firstSet) {
          const gapPx = window.innerWidth * 0.02; // 2vw gap
          const loopWidth = firstSet.offsetWidth + gapPx;
          
          if (loopWidth > 0 && scrollPos >= loopWidth) {
            scrollPos -= loopWidth;
          }
        }
        
        // GPU accelerated sub-pixel translation (hardware compositing)
        wrapper.style.transform = `translate3d(-${scrollPos.toFixed(2)}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mouseenter', onMouseEnter);
        container.removeEventListener('mouseleave', onMouseLeave);
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [isAutoScroll, loading, categories]);

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

        {/* Live TV Clock & Code / Settings Button */}
        <div className="m2-live-status-box">
          <div className="m2-time-badge">
            <span className="pulse-dot"></span>
            <Clock size={15} className="m2-badge-icon" />
            <span className="time-text">{currentTime || '12:00 PM'}</span>
          </div>

          <button 
            className="m2-code-open-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="Open Settings & Code Input"
          >
            <Code2 size={13} className="m2-badge-icon" />
            <span className="code-text-label">CODE: {apiEndpoint}</span>
            <Settings size={13} className="m2-badge-icon gear-icon" />
          </button>
        </div>
      </header>

      {/* Settings & Code Type Modal Screen */}
      {isSettingsOpen && (
        <div className="m2-modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div className="m2-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="m2-modal-header">
              <div className="m2-modal-title-wrap">
                <Settings size={20} className="modal-title-icon" />
                <h3>Display Settings & Configuration</h3>
              </div>
              <button 
                className="m2-modal-close-btn" 
                onClick={() => setIsSettingsOpen(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="m2-modal-body">
              {/* Option 1: Code Type Option First */}
              <div className="m2-settings-section">
                <label className="m2-section-label">
                  <Code2 size={15} className="section-label-icon" />
                  <span>Kiosk Code / API Endpoint</span>
                </label>
                <p className="m2-section-hint">Enter your store/kiosk code to load products (e.g. KSK1122, GRD5001)</p>
                <form onSubmit={handleApplyCode} className="m2-code-form">
                  <input
                    type="text"
                    className="m2-code-input"
                    placeholder={`Current: ${apiEndpoint}`}
                    value={customCodeInput}
                    onChange={(e) => setCustomCodeInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="m2-code-apply-btn">
                    Apply Code
                  </button>
                </form>
                <div className="m2-quick-codes">
                  <span className="quick-label">Presets:</span>
                  <button 
                    type="button" 
                    className={`quick-btn ${apiEndpoint === 'KSK1122' ? 'active' : ''}`}
                    onClick={() => { setCustomCodeInput('KSK1122'); loadData('KSK1122'); setIsSettingsOpen(false); }}
                  >
                    KSK1122
                  </button>
                  <button 
                    type="button" 
                    className={`quick-btn ${apiEndpoint === 'GRD5001' ? 'active' : ''}`}
                    onClick={() => { setCustomCodeInput('GRD5001'); loadData('GRD5001'); setIsSettingsOpen(false); }}
                  >
                    GRD5001
                  </button>
                </div>
              </div>

              {/* Option 2: Themes */}
              <div className="m2-settings-section">
                <label className="m2-section-label">
                  <Palette size={15} className="section-label-icon" />
                  <span>Display Theme</span>
                </label>
                <div className="m2-theme-options-grid">
                  <button
                    className={`modal-theme-card ${themeMode === 'cream' ? 'selected' : ''}`}
                    onClick={() => setThemeMode('cream')}
                  >
                    <Sun size={18} className="theme-card-icon" />
                    <span className="theme-card-title">Cream</span>
                    <span className="theme-card-desc">Warm editorial clean style</span>
                  </button>
                  <button
                    className={`modal-theme-card ${themeMode === 'dark' ? 'selected' : ''}`}
                    onClick={() => setThemeMode('dark')}
                  >
                    <Moon size={18} className="theme-card-icon" />
                    <span className="theme-card-title">Dark Mode</span>
                    <span className="theme-card-desc">Sleek high contrast TV look</span>
                  </button>
                  <button
                    className={`modal-theme-card ${themeMode === 'golden' ? 'selected' : ''}`}
                    onClick={() => setThemeMode('golden')}
                  >
                    <Sparkles size={18} className="theme-card-icon" />
                    <span className="theme-card-title">Golden Luxury</span>
                    <span className="theme-card-desc">Premium ambient amber gold</span>
                  </button>
                </div>
              </div>

              {/* Option 3: Auto-Scroll & More Options */}
              <div className="m2-settings-section">
                <label className="m2-section-label">
                  <Play size={15} className="section-label-icon" />
                  <span>Playback & Motion</span>
                </label>
                <div className="m2-toggle-row">
                  <div className="m2-toggle-info">
                    <span className="toggle-title">TV Auto-Scroll</span>
                    <span className="toggle-subtitle">Smooth horizontal ticker marquee scroll</span>
                  </div>
                  <button 
                    className={`m2-switch-btn ${isAutoScroll ? 'on' : 'off'}`}
                    onClick={() => setIsAutoScroll(!isAutoScroll)}
                  >
                    {isAutoScroll ? 'ENABLED' : 'PAUSED'}
                  </button>
                </div>
              </div>
            </div>

            <div className="m2-modal-footer">
              <span className="m2-active-status-tag">Connected: {apiEndpoint}</span>
              <button 
                className="m2-modal-done-btn"
                onClick={() => setIsSettingsOpen(false)}
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="m2-tv-body" ref={scrollContainerRef}>
        {loading ? (
          <div className="m2-loading-screen">
            <div className="spinner"></div>
            <p>CONNECTING TO RESTAURANT MENU FEED...</p>
          </div>
        ) : errorMsg ? (
          <div className="m2-loading-screen">
            <div className="m2-not-found-card">
              <UtensilsCrossed size={36} className="m2-not-found-icon" />
              <h3 className="m2-not-found-title">{errorMsg}</h3>
              <p className="m2-not-found-desc">Kiosk Code: <strong>{apiEndpoint}</strong></p>
              <button 
                className="m2-code-open-btn" 
                style={{ marginTop: '12px' }}
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings size={14} className="m2-badge-icon" />
                <span>Change Kiosk Code</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="marquee-wrapper" style={{ display: 'flex', gap: '2vw', height: '100%' }}>
            {/* First Set */}
            <div className="m2-categories-container">
              {categories.map((catGroup, catIdx) => (
                <section key={`set1-${catGroup.id}-${catIdx}`} className="m2-cat-section">
                  {catGroup.products.length > 0 && catGroup.name !== 'MENU ITEMS' && (
                    <div className="m2-cat-header">
                      <h2 className="m2-cat-name">
                        <UtensilsCrossed size={18} className="cat-icon-svg" />
                        {catGroup.name}
                      </h2>
                      <div className="m2-cat-divider"></div>
                      <span className="cat-count-badge">{catGroup.products.length} ITEMS</span>
                    </div>
                  )}

                  <div className="m2-tv-grid">
                    {catGroup.products.map((prod, idx) => {
                      const priceNum = parseFloat(prod.price.replace(/[^\d.]/g, '')) || 0;
                      const mrpNum = prod.mrp ? parseFloat(prod.mrp.replace(/[^\d.]/g, '')) : null;
                      const discount = mrpNum && mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
                      const timingInfo = checkTimingStatus(prod.timings);

                      return (
                        <div 
                          key={`set1-${prod.id}-${idx}`} 
                          className={`m2-tv-card ${timingInfo.isActive ? 'timing-active' : 'timing-scheduled'}`}
                        >
                          {/* Dynamic API & Feature Badges */}
                          {prod.badges && prod.badges.length > 0 ? (
                            <span className={`card-badge ${prod.badges[0].name.toLowerCase().includes('bestseller') ? 'bestseller' : 'special'}`}>
                              <Award size={11} className="badge-svg-icon" /> {prod.badges[0].name}
                            </span>
                          ) : (idx % catGroup.products.length) === 0 ? (
                            <span className="card-badge bestseller">
                              <Award size={11} className="badge-svg-icon" /> Chef's Pick
                            </span>
                          ) : (idx % catGroup.products.length) === 1 && discount > 0 ? (
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

            {/* Second Set (Duplicate for Marquee Loop) */}
            <div className="m2-categories-container" aria-hidden="true">
              {categories.map((catGroup, catIdx) => (
                <section key={`set2-${catGroup.id}-${catIdx}`} className="m2-cat-section">
                  {catGroup.products.length > 0 && catGroup.name !== 'MENU ITEMS' && (
                    <div className="m2-cat-header">
                      <h2 className="m2-cat-name">
                        <UtensilsCrossed size={18} className="cat-icon-svg" />
                        {catGroup.name}
                      </h2>
                      <div className="m2-cat-divider"></div>
                      <span className="cat-count-badge">{catGroup.products.length} ITEMS</span>
                    </div>
                  )}

                  <div className="m2-tv-grid">
                    {catGroup.products.map((prod, idx) => {
                      const priceNum = parseFloat(prod.price.replace(/[^\d.]/g, '')) || 0;
                      const mrpNum = prod.mrp ? parseFloat(prod.mrp.replace(/[^\d.]/g, '')) : null;
                      const discount = mrpNum && mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
                      const timingInfo = checkTimingStatus(prod.timings);

                      return (
                        <div 
                          key={`set2-${prod.id}-${idx}`} 
                          className={`m2-tv-card ${timingInfo.isActive ? 'timing-active' : 'timing-scheduled'}`}
                        >
                          {/* Dynamic API & Feature Badges */}
                          {prod.badges && prod.badges.length > 0 ? (
                            <span className={`card-badge ${prod.badges[0].name.toLowerCase().includes('bestseller') ? 'bestseller' : 'special'}`}>
                              <Award size={11} className="badge-svg-icon" /> {prod.badges[0].name}
                            </span>
                          ) : (idx % catGroup.products.length) === 0 ? (
                            <span className="card-badge bestseller">
                              <Award size={11} className="badge-svg-icon" /> Chef's Pick
                            </span>
                          ) : (idx % catGroup.products.length) === 1 && discount > 0 ? (
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
          </div>
        )}
      </main>

      {/* Down side banner showing single scrolling consumption notice */}
      <footer className="m2-tv-footer">
        <div className="m2-ticker-wrap">
          <div className="m2-ticker-move">
            <span className="ticker-item">
              <Clock size={18} className="ticker-svg" /> Consume the food within 2 Hours from the time of packing
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
