import React, { useEffect, useState } from 'react';
import { fetchKioskProducts } from '../services/apiService';
import { Sparkles, Leaf } from 'lucide-react';

export default function Model3SideDishBoard() {
  const [mainDishes, setMainDishes] = useState([]);
  const [bottomBarDishes, setBottomBarDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchKioskProducts();
      if (res.success && res.categories.length > 0) {
        // Flatten all API products from all categories
        const allProducts = [];
        res.categories.forEach((cat) => {
          if (Array.isArray(cat.products)) {
            cat.products.forEach((p) => allProducts.push(p));
          }
        });

        if (allProducts.length > 0) {
          // Split products between main grid and bottom footer bar
          if (allProducts.length > 4) {
            setMainDishes(allProducts.slice(0, Math.min(8, allProducts.length)));
            setBottomBarDishes(allProducts.slice(Math.min(8, allProducts.length) - 3, Math.min(8, allProducts.length)));
          } else {
            setMainDishes(allProducts);
            setBottomBarDishes(allProducts.slice(0, 3));
          }
        }
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="model3-frame">
      {/* Top Header */}
      <header className="m3-header">
        <div className="m3-brush-banner">
          <span>SIDE DISH BOARD</span>
        </div>
      </header>

      {/* Main Dishes Canvas Grid */}
      <main className="m3-landscape-grid-container">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#eb5a28', fontWeight: 800, padding: '30px' }}>
            LOADING PRODUCTS FROM API...
          </div>
        ) : (
          mainDishes.map((item, idx) => (
            <div key={item.id || idx} className="m3-item-card">
              <div className="m3-img-wrap">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="m3-png-img" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="m3-card-img-placeholder"
                  style={{ display: item.image ? 'none' : 'flex' }}
                >
                  <span>{item.name ? item.name.charAt(0) : 'P'}</span>
                </div>

                <span className="m3-price-badge">{item.price}</span>
                {idx % 2 === 1 && (
                  <span className="m3-new-star">
                    <Sparkles size={9} style={{ marginRight: '2px', verticalAlign: 'middle' }} />
                    NEW
                  </span>
                )}
              </div>

              <div className="m3-card-info">
                {item.category && <span className="m3-tag-raw">{item.category}</span>}
                <h3 className="m3-title">{item.name}</h3>
                {item.mrp && item.mrp !== item.price && (
                  <p className="m3-desc">MRP: {item.mrp}</p>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Bottom Red Banner Footer */}
      <footer className="m3-red-footer">
        <div className="m3-red-splash-bar">
          {bottomBarDishes.map((item, idx) => (
            <div key={item.id || idx} className="m3-bottom-dish">
              <div className="m3-img-wrap-small">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="m3-png-img-sm" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="m3-card-img-placeholder sm"
                  style={{ display: item.image ? 'none' : 'flex' }}
                >
                  <span>{item.name ? item.name.charAt(0) : 'P'}</span>
                </div>
                <span className="m3-price-badge sm">{item.price}</span>
              </div>
              <span className="m3-bottom-title">
                <Leaf size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="m3-disclaimer-tax">* Prices in Indian Rupee (₹) • All Taxes Included</div>
      </footer>
    </div>
  );
}
