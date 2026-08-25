import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onClearCart }) {
  if (!isOpen) return null;

  const totalThousands = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--primary-red)" />
            <h2>Your Order Tray</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} strokeWidth={1} style={{ marginBottom: '12px' }} />
              <p>Your order tray is empty.</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Click "+ Add to Order" on any menu item.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.price}k each</p>
                </div>

                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span style={{ fontWeight: 700, padding: '0 6px', fontSize: '14px' }}>
                    {item.quantity}
                  </span>
                  <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Total Price:</span>
              <span style={{ color: '#ff5252' }}>
                Rp {totalThousands}.000 ({totalThousands}k)
              </span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                alert(`Order submitted! Total: Rp ${totalThousands}.000 IDR`);
                onClearCart();
                onClose();
              }}
            >
              Confirm Order & Send to Kitchen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
