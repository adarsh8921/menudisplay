import React from 'react';
import { Plus } from 'lucide-react';
import { extraSides, minumanDrinks } from '../data/menuData';

export default function ExtrasSection({ onAddToCart }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
      {/* EXTRA SIDES */}
      <div className="section-block" style={{ marginBottom: 0 }}>
        <div className="section-header">
          <h2>
            <span>EXTRA</span>
            <span className="jp">エキストラ</span>
          </h2>
        </div>

        <div className="extras-grid">
          {extraSides.map((ext) => (
            <div
              key={ext.id}
              className="extra-chip"
              onClick={() =>
                onAddToCart({
                  id: ext.id,
                  name: `Extra - ${ext.name}`,
                  price: ext.price,
                  category: 'extra',
                })
              }
            >
              <div className="extra-info">
                <div className="name">{ext.name}</div>
                <div className="price">{ext.price}k</div>
              </div>
              <Plus size={16} color="var(--primary-red)" />
            </div>
          ))}
        </div>
      </div>

      {/* MINUMAN DRINKS */}
      <div className="section-block" style={{ marginBottom: 0 }}>
        <div className="section-header">
          <h2>
            <span>MINUMAN</span>
            <span className="jp">ドリンク</span>
          </h2>
        </div>

        <div className="extras-grid">
          {minumanDrinks.map((drk) => (
            <div
              key={drk.id}
              className="extra-chip"
              onClick={() =>
                onAddToCart({
                  id: drk.id,
                  name: drk.name,
                  price: drk.price,
                  category: 'minuman',
                })
              }
            >
              <div className="extra-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{drk.icon}</span>
                <div>
                  <div className="name">{drk.name}</div>
                  <div className="price">{drk.price}k</div>
                </div>
              </div>
              <Plus size={16} color="var(--primary-red)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
