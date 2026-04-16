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
            {anomaly.reason && (
              <div style={{ marginTop: '0.2rem', fontSize: '0.8rem', color: 'var(--accent-danger)', fontWeight: 'bold' }}>
                ↳ {anomaly.reason}
              </div>
            )}
            {anomaly.suggestion && (
              <div style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.75rem', 
                  color: 'var(--accent-primary)', 
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  padding: '8px',
                  borderRadius: '4px',
                  borderLeft: '2px solid var(--accent-primary)'
                }}>
                {anomaly.suggestion}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AnomalyFeed;
