import React, { useEffect, useState } from 'react';
import { fetchKioskProducts } from '../services/apiService';
import { Utensils, Sparkles, ArrowRightLeft } from 'lucide-react';

export default function MenuBannerBoard() {
  const [topProducts, setTopProducts] = useState([]);
  const [middleProducts, setMiddleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchKioskProducts();
      if (res.success && res.categories.length > 0) {
        const allProducts = [];
        res.categories.forEach((cat) => {
          if (Array.isArray(cat.products)) {
            cat.products.forEach((p) => allProducts.push(p));
          }
        });

        if (allProducts.length > 0) {
          setTopProducts(allProducts.slice(0, 4));
          setMiddleProducts(allProducts.slice(4, 8));
        }
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="banner-frame">
      {/* Top Header: Logo + Menu Title + Swap Pill */}
      <header className="banner-header">
        <div className="brand-badge-container">
          <div className="logo-circle">
            <Utensils size={20} className="icon" />
            <span className="brand-name">OUNGKUSHIN</span>
          </div>
        </div>

        <div className="menu-title-block">
          <div className="menu-title-row">
            <span className="menu-title-text">JAPANESE MENU</span>
            <span className="menu-jp-text">メニュー</span>
          </div>
          <div className="swap-pill">
            <ArrowRightLeft size={12} style={{ marginRight: '3px' }} />
            <span>SWAP</span>
            <span className="highlight">RICE</span>
            <span>TO</span>
            <span className="highlight">NOODLES + ₹50</span>
          </div>
        </div>
      </header>

      {/* TOP ROW: ORIGINAL SERIES */}
      <section className="original-series-box">
        <div className="original-header">
          <span>ORIGINAL SERIES</span>
          <span className="jp">オリジナル</span>
        </div>

        <div className="original-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ffffff', fontWeight: 800 }}>
              LOADING PRODUCTS FROM API...
            </div>
          ) : (
            topProducts.map((prod, idx) => (
              <div key={prod.id || idx} className="original-item">
                <div className="img-bowl-wrapper">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="m1-card-img-placeholder"
                    style={{ display: prod.image ? 'none' : 'flex' }}
                  >
                    <span>{prod.name ? prod.name.charAt(0) : 'P'}</span>
                  </div>
                  {idx === 0 && <span className="value-tag">VALUE</span>}
                </div>
                <span className="original-item-title">{prod.name}</span>
                <span className="original-item-price">{prod.price}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MIDDLE ROW: API SERIES GRID */}
      <div className="middle-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#c0262b', fontWeight: 800 }}>
            LOADING...
          </div>
        ) : (
          middleProducts.map((prod, idx) => (
            <div key={prod.id || idx} className="series-card">
              <div className="section-title-outline">
                <span>{prod.name}</span>
              </div>
              <div className="img-bowl-wrapper small">
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="series-bowl-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className="m1-card-img-placeholder"
                  style={{ display: prod.image ? 'none' : 'flex' }}
                >
                  <span>{prod.name ? prod.name.charAt(0) : 'P'}</span>
                </div>
              </div>

              <div className="price-icon-list">
                <div className="price-icon-item">
                  <span className="price-num">{prod.price}</span>
                </div>
                {prod.mrp && prod.mrp !== prod.price && (
                  <div className="price-icon-item mrp-tag">
                    <span className="mrp-old">MRP {prod.mrp}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="disclaimer-bottom">* Prices in Indian Rupee (₹) • All Taxes Included</div>
    </div>
  );
}
