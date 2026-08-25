import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';

export default function MenuGrid({ items, onAddToCart }) {
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleVariantSelect = (itemId, option) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [itemId]: option,
    }));
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <h3>No menu items found</h3>
        <p>Try searching for another dish or selecting a different category.</p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {items.map((item) => {
        // Find currently selected variant option or fallback to default
        const activeOption =
          item.hasMeatOptions && item.options
            ? selectedVariants[item.id] || item.options[0]
            : null;

        const currentPrice = activeOption ? activeOption.price : item.basePrice;

        return (
          <div key={item.id} className="item-card">
            <div className="item-image-wrapper">
              <img src={item.image} alt={item.name} className="item-image" loading="lazy" />
              {item.tags && item.tags.length > 0 && (
                <span className="item-badge-pill">{item.tags[0]}</span>
              )}
            </div>

            <div className="item-content">
              <div className="item-header-row">
                <div className="item-title-group">
                  <h3>{item.name}</h3>
                  {item.japanese && <p className="item-japanese">{item.japanese}</p>}
                </div>
                <div className="item-price-tag">{currentPrice}k</div>
              </div>

              <p className="item-description">{item.description}</p>

              {/* Variant Selector for Meat Options (Chicken vs Beef etc) */}
              {item.hasMeatOptions && item.options && (
                <div className="variant-selector">
                  <p className="variant-label">Select Option / 選択:</p>
                  <div className="variant-options">
                    {item.options.map((opt, idx) => {
                      const isSelected = activeOption?.name === opt.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`variant-opt-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleVariantSelect(item.id, opt)}
                        >
                          <span>{opt.name}</span>
                          <span>{opt.price}k</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                className="add-cart-btn"
                onClick={() =>
                  onAddToCart({
                    id: `${item.id}-${activeOption ? activeOption.name : 'default'}`,
                    name: activeOption ? `${item.name} (${activeOption.name})` : item.name,
                    price: currentPrice,
                    category: item.category,
                  })
                }
              >
                <Plus size={16} />
                <span>Add to Order</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
