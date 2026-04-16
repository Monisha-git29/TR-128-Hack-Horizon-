import React, { useState, useEffect, useRef } from 'react';
import { Activity, Radio, AlertTriangle } from 'lucide-react';
import ChartComponent from './components/ChartComponent';
import AnomalyFeed from './components/AnomalyFeed';
import StatsCard from './components/StatsCard';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [latestData, setLatestData] = useState({ price: 0, volume: 0 });
  const [dataHistory, setDataHistory] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  
  const ws = useRef(null);

  useEffect(() => {
    // Connect to FastAPI WebSocket
    ws.current = new WebSocket('ws://localhost:8000/ws');

    ws.current.onopen = () => {
      console.log("Connected to backend");
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // data format: { price, volume, is_anomaly, timestamp }
      
      const newPoint = {
        time: new Date(data.timestamp).toLocaleTimeString([], { hour12: false }),
        price: data.price,
        volume: data.volume,
        is_anomaly: data.is_anomaly
      };

      setLatestData(newPoint);

      setDataHistory(prev => {
        const next = [...prev, newPoint];
        // Keep last 100 points for smooth charting without lag
        if (next.length > 100) next.shift();
        return next;
      });

      if (data.is_anomaly) {
        setAnomalies(prev => {
          const newAnomalyList = [newPoint, ...prev];
          // Keep last 50 alerts
          if (newAnomalyList.length > 50) newAnomalyList.pop();
          return newAnomalyList;
        });
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected");
      setIsConnected(false);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <header>
        <div className="logo-section">
          <Activity size={32} color="var(--accent-primary)" />
          <h1>Nexus Anomaly Engine</h1>
        </div>
        <div className={`status-badge ${!isConnected ? 'disconnected' : ''}`}>
          <div className="status-dot"></div>
          {isConnected ? 'LIVE STREAM' : 'OFFLINE'}
        </div>
      </header>

      <main className="main-content">
        <StatsCard data={latestData} />
        
        <div className="glass-card">
          <div className="feed-header">
            <h3>Real-Time BTC/USDT Market Data</h3>
          </div>
          <ChartComponent data={dataHistory} />
        </div>
      </main>

      <aside className="sidebar">
        <div className="glass-card" style={{ height: '100%' }}>
          <div className="feed-header">
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <AlertTriangle size={20} color="var(--accent-danger)" />
              <h3 style={{color: 'var(--accent-danger)'}}>Anomaly Alerts Detect</h3>
            </div>
          </div>
          <AnomalyFeed anomalies={anomalies} />
        </div>
      </aside>
    </div>
  );
}

export default App;
