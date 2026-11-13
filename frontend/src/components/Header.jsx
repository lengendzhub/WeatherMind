import React, { useEffect, useState } from 'react';
import { CloudSun, Wifi, WifiOff, Clock, Award } from 'lucide-react';

export default function Header({ unit, setUnit, isOnline }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">
          <CloudSun size={32} color="#38bdf8" />
        </div>
        <div>
          <h1 className="brand-title">Travel Weather Planner</h1>
          <p className="brand-subtitle">AI Engineer Assessment • PM Accelerator</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Live Clock */}
        <div className="status-pill clock-pill" title="Local browser time">
          <Clock size={16} />
          <span>{time}</span>
        </div>

        {/* Online / Offline indicator */}
        <div className={`status-pill ${isOnline ? 'online-pill' : 'offline-pill'}`}>
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Celsius / Fahrenheit Toggle */}
        <div className="unit-toggle" role="group" aria-label="Temperature Unit">
          <button
            type="button"
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => setUnit('C')}
            aria-pressed={unit === 'C'}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => setUnit('F')}
            aria-pressed={unit === 'F'}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
