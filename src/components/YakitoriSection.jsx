import React from 'react';
import { Plus } from 'lucide-react';
import { yakitoriItems } from '../data/menuData';

export default function YakitoriSection({ onAddToCart }) {
  return (
    <div className="section-block">
      <div className="section-header">
        <h2>
          <span>YAKITORI</span>
          <span className="jp">焼き鳥</span>
        </h2>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Authentic Flame-Grilled Skewers
        </span>
      </div>

      <div className="yakitori-grid">
        {yakitoriItems.map((yaki) => (
          <div key={yaki.id} className="yakitori-card">
            <div className="yakitori-icon">{yaki.icon}</div>
            <div className="yakitori-name">{yaki.name}</div>
            <div className="yakitori-jp">{yaki.japanese}</div>
            <div className="yakitori-price">{yaki.price}k</div>

            <button
              className="add-cart-btn"
              style={{ padding: '6px 10px', fontSize: '12px' }}
              onClick={() =>
                onAddToCart({
                  id: yaki.id,
                  name: `Yakitori - ${yaki.name}`,
                  price: yaki.price,
                  category: 'yakitori',
                })
              }
            >
              <Plus size={14} /> Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
