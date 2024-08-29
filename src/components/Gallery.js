import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    const savedStickers = JSON.parse(localStorage.getItem('stickers') || '[]');
    setStickers(savedStickers);
  }, []);

  return (
    <div>
      <h2 style={{ color: '#FF69B4', textAlign: 'center' }}>Sticker Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {stickers.map((sticker, index) => (
          <img
            key={index}
            src={sticker}
            alt={`Sticker ${index + 1}`}
            style={{ width: 100, height: 100, margin: 5, border: '2px solid #FF69B4', borderRadius: '5px' }}
          />
        ))}
      </div>
      {stickers.length === 0 && <p style={{ textAlign: 'center' }}>No stickers yet. Start drawing!</p>}
    </div>
  );
};

export default Gallery;