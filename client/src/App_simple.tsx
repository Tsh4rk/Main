import React from 'react';

function App() {
  return (
    <div style={{ 
      backgroundColor: '#0A0A0A', 
      color: '#78DBE2', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'monospace'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🔒 CYBERSEC PORTFOLIO</h1>
        <p>Interactive Terminal Interface</p>
        <p>Server running at: <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer">http://localhost:5000</a></p>
      </div>
    </div>
  );
}

export default App;
