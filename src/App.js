import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DrawingCanvas from './components/DrawingCanvas';
import Gallery from './components/Gallery';

function App() {
  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ color: '#FF69B4', textAlign: 'center' }}>✨ Cute Doodle Sticker Creator ✨</h1>
        <nav style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Link to="/" style={{ margin: '0 10px', color: '#FF69B4', textDecoration: 'none' }}>Draw</Link>
          <Link to="/gallery" style={{ margin: '0 10px', color: '#FF69B4', textDecoration: 'none' }}>Gallery</Link>
        </nav>
        <Routes>
          <Route path="/" element={<DrawingCanvas />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;