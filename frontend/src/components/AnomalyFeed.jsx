import React from 'react';
import { AlertCircle } from 'lucide-react';

const AnomalyFeed = ({ anomalies }) => {
  return (
    <div className="anomaly-list">
      {anomalies.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
          No anomalies detected yet. System is stable.
        </div>
      ) : (
        anomalies.map((anomaly, index) => (
          <div key={`alert-${anomaly.time}-${index}`} className="anomaly-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} color="var(--accent-danger)" />
              <span className="anomaly-time">{anomaly.time}</span>
            </div>
            <div className="anomaly-details">
              <span>Price: ${anomaly.price.toFixed(2)}</span>
              <span>Vol: {anomaly.volume.toFixed(4)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AnomalyFeed;
