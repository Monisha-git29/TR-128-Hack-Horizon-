import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isAnomaly = payload[0].payload.is_anomaly;
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isAnomaly ? 'var(--accent-danger)' : 'var(--border-color)'}`,
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: 'var(--glass-shadow)',
        backdropFilter: 'blur(10px)',
        color: '#fff'
      }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</p>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
          Price: <span style={{ color: 'var(--accent-primary)' }}>${payload[0].value.toFixed(2)}</span>
        </p>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          Volume: <span style={{ color: 'var(--accent-secondary)' }}>{payload[1]?.value.toFixed(4)}</span>
        </p>
        {isAnomaly && (
          <p style={{ margin: '8px 0 0 0', color: 'var(--accent-danger)', fontWeight: 'bold', fontSize: '0.85rem' }}>
            ⚠️ Anomaly Detected
          </p>
        )}
      </div>
    );
  }
  return null;
};

const ChartComponent = ({ data }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="var(--text-muted)" 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            minTickGap={30}
          />
          <YAxis 
            yAxisId="left" 
            domain={['auto', 'auto']} 
            stroke="var(--text-muted)" 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            tickFormatter={(val) => `$${val}`}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={['auto', 'auto']} 
            stroke="var(--text-muted)" 
            tickFormatter={(val) => val.toFixed(2)}
            hide={true} // hidden to keep UI clean, but scales volume
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
          
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="price" 
            stroke="var(--accent-primary)" 
            strokeWidth={3} 
            dot={false}
            animationDuration={300}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="volume" 
            stroke="var(--accent-secondary)" 
            strokeWidth={2} 
            dot={false}
            opacity={0.5}
            animationDuration={300}
          />

          {data.map((entry, index) => {
            if (entry.is_anomaly) {
              return (
                <ReferenceDot 
                  key={`anomaly-${index}`}
                  yAxisId="left"
                  x={entry.time}
                  y={entry.price}
                  r={6}
                  fill="var(--accent-danger)"
                  stroke="var(--bg-dark)"
                  strokeWidth={2}
                />
              )
            }
            return null;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
