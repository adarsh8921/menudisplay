import React from 'react';
import { ShoppingBag, Search, Utensils, RefreshCw } from 'lucide-react';
import { menuCategories } from '../data/menuData';

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  globalBase,
  setGlobalBase,
}) {
  return (
    <header className="header-wrapper">
      {/* Model 1 Restaurant Board Header Banner */}
      <div className="menu-header-board">
        <div className="brand-section">
          <div className="brand-logo-badge">
            <span className="jp">お食事</span>
            <span className="title">OUNG</span>
          </div>
          <div className="brand-text">
            <h1>
              MENU <span className="jp-subtitle">メニュー</span>
            </h1>
            <p>Authentic Japanese Rice Bowls, Curry, Creamy Udon & Flame-Grilled Yakitori</p>
          </div>
        </div>

        {/* Highlighted Banner Badge (ganti nasi ke mie + 10) */}
        <div className="swap-badge-banner">
          <RefreshCw size={24} color="#a81c1c" />
          <div className="swap-badge-text">
            <span className="line1">Option / 変更</span>
            <span className="line2">ganti nasi 🍚 ke mie 🍜 +10k</span>
          </div>
        </div>

        <div className="disclaimer-tag">* price in Thousand Rupiah (000 IDR)</div>
      </div>

      {/* Filter and Control Bar */}
      <div className="nav-control-bar">
        {/* Category Pills */}
        <div className="category-pills">
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.name}</span>
              {cat.japanese && <span style={{ opacity: 0.7, fontSize: '11px' }}>({cat.japanese})</span>}
            </button>
          ))}
        </div>

        {/* Search & Cart Trigger */}
        <div className="search-cart-group">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search food or drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="cart-toggle-btn" onClick={onOpenCart}>
            <ShoppingBag size={18} />
            <span>Order Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
