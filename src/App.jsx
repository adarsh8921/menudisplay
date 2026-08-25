import React, { useState, useEffect } from 'react';
import Model2KitchenBoard from './components/Model2KitchenBoard';
import Model3SideDishBoard from './components/Model3SideDishBoard';
import { Maximize2, Minimize2, LayoutGrid, Utensils } from 'lucide-react';

export default function App() {
  const [activeModel, setActiveModel] = useState('model2');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Model Switcher Bar - hidden in fullscreen mode */}
      {!isFullscreen && (
        <div className="model-switcher-bar">
          <div className="switcher-tabs-group">
            <button
              className={`switcher-btn ${activeModel === 'model2' ? 'active' : ''}`}
              onClick={() => setActiveModel('model2')}
            >
              <Utensils size={13} className="switcher-icon" />
              <span>Kitchen Board</span>
            </button>
            <button
              className={`switcher-btn ${activeModel === 'model3' ? 'active' : ''}`}
              onClick={() => setActiveModel('model3')}
            >
              <LayoutGrid size={13} className="switcher-icon" />
              <span>Side Dish Board</span>
            </button>
          </div>

          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <>
                <Minimize2 size={13} className="switcher-icon" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 size={13} className="switcher-icon" />
                <span>Full Screen</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Render Active Model Display */}
      <div className={`model-container-wrapper ${isFullscreen ? 'fullscreen-mode' : ''}`}>
        {activeModel === 'model2' && <Model2KitchenBoard />}
        {activeModel === 'model3' && <Model3SideDishBoard />}
      </div>
    </div>
  );
}
