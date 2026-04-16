import React from 'react';

const StatsCard = ({ data, metrics }) => {
  const ratio = metrics.totalPoints > 0 
    ? ((metrics.totalAnomalies / metrics.totalPoints) * 100).toFixed(2) 
    : 0;

  return (
    <div className="glass-card">
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-item">
          <span className="stat-label">Current BTC Price</span>
          <span className={`stat-value ${data.is_anomaly ? 'danger' : ''}`}>
            ${data.price ? data.price.toFixed(2) : '0.00'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Real-Time Volume</span>
          <span className="stat-value" style={{ color: 'var(--text-main)', textShadow: 'none', fontSize: '1.8rem' }}>
            {data.volume ? data.volume.toFixed(4) : '0.0000'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">System Health</span>
          <span className="stat-value" style={{ 
            color: data.is_anomaly ? 'var(--accent-danger)' : 'var(--accent-success)',
            textShadow: data.is_anomaly ? 'var(--glow-danger)' : 'none',
            fontSize: '1.8rem'
          }}>
            {data.is_anomaly ? 'ANOMALOUS' : 'SECURE'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Detection Latency</span>
          <span className="stat-value" style={{ color: 'var(--accent-primary)', fontSize: '1.8rem' }}>
            {metrics.latency} <span style={{fontSize: '1rem'}}>ms</span>
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Local Trend Tracker</span>
          <span className="stat-value" style={{ color: 'var(--accent-secondary)', fontSize: '1.8rem', textShadow: 'none' }}>
            {metrics.trend}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Anomaly Rate</span>
          <span className="stat-value" style={{ color: 'var(--text-muted)', fontSize: '1.8rem', textShadow: 'none' }}>
            {ratio}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
