import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FeatureSpaceChart = ({ data }) => {
  const normalData = data.filter(d => !d.is_anomaly);
  const anomalyData = data.filter(d => d.is_anomaly);

  return (
    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
          <XAxis 
            type="number" 
            dataKey="price" 
            name="Price" 
            domain={['auto', 'auto']} 
            stroke="var(--text-muted)" 
            tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
            tickFormatter={(val) => `$${val}`}
          />
          <YAxis 
            type="number" 
            dataKey="volume" 
            name="Volume" 
            domain={['auto', 'auto']} 
            stroke="var(--text-muted)" 
            tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-color)', 
              borderRadius: '8px',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }} 
          />
          <Scatter name="Normal" data={normalData} fill="var(--accent-primary)" opacity={0.6} />
          <Scatter name="Anomaly" data={anomalyData} fill="var(--accent-danger)" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureSpaceChart;
