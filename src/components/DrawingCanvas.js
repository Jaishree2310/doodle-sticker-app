import React, { useRef, useState, useEffect } from 'react';

const brushTypes = {
  pen: { name: 'Pen', cursor: 'crosshair' },
  spray: { name: 'Spray', cursor: 'cell' },
  pencil: { name: 'Pencil', cursor: 'default' },
};

const frames = [
  { name: 'None', path: null },
  { name: 'Heart', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
  { name: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { name: 'Cloud', path: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z' },
];

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [brushType, setBrushType] = useState('pen');
  const [frame, setFrame] = useState(frames[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    setIsDrawing(true);
    draw(offsetX, offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const draw = (x, y) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    switch (brushType) {
      case 'pen':
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case 'spray':
        for (let i = 0; i < 20; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 2;
          const offsetY = (Math.random() - 0.5) * brushSize * 2;
          ctx.fillStyle = color;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;
      case 'pencil':
        ctx.globalAlpha = 0.2;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.globalAlpha = 1;
        break;
      default:
        break;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    return {
      offsetX: x - rect.left,
      offsetY: y - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const applyFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (frame.path) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      const path = new Path2D(frame.path);
      ctx.stroke(path);
      ctx.restore();
    }
  };

  const saveSticker = () => {
    applyFrame();
    const canvas = canvasRef.current;
    const stickerData = canvas.toDataURL();
    const stickers = JSON.parse(localStorage.getItem('stickers') || '[]');
    stickers.push(stickerData);
    localStorage.setItem('stickers', JSON.stringify(stickers));
    alert('Sticker saved successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '3px solid #FF69B4', borderRadius: '10px', cursor: brushTypes[brushType].cursor }}
        onMouseDown={startDrawing}
        onMouseMove={(e) => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const { offsetX, offsetY } = getCoordinates(touch);
          draw(offsetX, offsetY);
        }}
        onTouchEnd={stopDrawing}
      />
      <div style={{ marginTop: '20px' }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ marginRight: '10px' }} />
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          style={{ marginRight: '10px' }}
        />
        <select onChange={(e) => setBrushType(e.target.value)} style={{ marginRight: '10px' }}>
          {Object.entries(brushTypes).map(([type, { name }]) => (
            <option key={type} value={type}>{name}</option>
          ))}
        </select>
        <select onChange={(e) => setFrame(frames.find(f => f.name === e.target.value))} style={{ marginRight: '10px' }}>
          {frames.map((f) => (
            <option key={f.name} value={f.name}>{f.name}</option>
          ))}
        </select>
        <button onClick={clearCanvas} style={{ marginRight: '10px', background: '#FF69B4', border: 'none', padding: '5px 10px', borderRadius: '5px', color: 'white' }}>Clear</button>
        <button onClick={saveSticker} style={{ background: '#FF69B4', border: 'none', padding: '5px 10px', borderRadius: '5px', color: 'white' }}>Save Sticker</button>
      </div>
    </div>
  );
};

export default DrawingCanvas;