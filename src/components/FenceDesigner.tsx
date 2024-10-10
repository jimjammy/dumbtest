import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Undo, Redo } from 'lucide-react';

interface FenceDesignerProps {
  fenceConfig: any;
  setFenceConfig: React.Dispatch<React.SetStateAction<any>>;
}

const FenceDesigner: React.FC<FenceDesignerProps> = ({ fenceConfig, setFenceConfig }) => {
  const [panelType, setPanelType] = useState('Mesh ST20');
  const [panelColor, setPanelColor] = useState('7037');
  const [postType, setPostType] = useState('60x40 Smart Fix');
  const [postColor, setPostColor] = useState('7037');
  const [isDrawing, setIsDrawing] = useState(false);
  const [layout, setLayout] = useState<{ x: number; y: number }[]>([]);
  const [history, setHistory] = useState<{ x: number; y: number }[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridSize = 20; // 20 pixels per meter
  const canvasWidth = 600;
  const canvasHeight = 400;

  useEffect(() => {
    drawGrid();
    drawLayout();
  }, [layout]);

  useEffect(() => {
    updateFenceConfig();
  }, [layout, panelType, panelColor, postType, postColor]);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = '#ddd';

    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  };

  const drawLayout = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    for (let i = 1; i < layout.length; i++) {
      ctx.beginPath();
      ctx.moveTo(layout[i - 1].x * gridSize, layout[i - 1].y * gridSize);
      ctx.lineTo(layout[i].x * gridSize, layout[i].y * gridSize);
      ctx.stroke();
    }

    // Draw measurements
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    for (let i = 1; i < layout.length; i++) {
      const dx = layout[i].x - layout[i - 1].x;
      const dy = layout[i].y - layout[i - 1].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const midX = (layout[i].x + layout[i - 1].x) / 2 * gridSize;
      const midY = (layout[i].y + layout[i - 1].y) / 2 * gridSize;
      ctx.fillText(`${distance.toFixed(2)}m`, midX, midY);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round((e.clientX - rect.left) / gridSize);
    const y = Math.round((e.clientY - rect.top) / gridSize);
    setLayout(prev => [...prev, { x, y }]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round((e.clientX - rect.left) / gridSize);
    const y = Math.round((e.clientY - rect.top) / gridSize);
    setLayout(prev => {
      const newLayout = [...prev];
      newLayout[newLayout.length - 1] = { x, y };
      return newLayout;
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), layout]);
    setHistoryIndex(prev => prev + 1);
  };

  const updateFenceConfig = () => {
    const panels = [];
    const posts = [];

    for (let i = 1; i < layout.length; i++) {
      const dx = layout[i].x - layout[i - 1].x;
      const dy = layout[i].y - layout[i - 1].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const panelCount = Math.round(distance / 1.5); // Assuming 1 panel is 1.5m

      for (let j = 0; j < panelCount; j++) {
        panels.push({ type: panelType, color: panelColor, width: 1500, height: 2200 });
      }
      posts.push({ type: postType, color: postColor, height: 2400 });
    }

    if (posts.length > 0) {
      posts.push({ type: postType, color: postColor, height: 2400 }); // Add final post
    }

    setFenceConfig({ panels, posts, layout });
  };

  const clearLayout = () => {
    setLayout([]);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setLayout(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setLayout(history[historyIndex + 1]);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Fence Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Panel Type</label>
            <select
              value={panelType}
              onChange={(e) => setPanelType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option>Mesh ST20</option>
              <option>Polycarbonate</option>
              <option>Full Steel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Panel Color</label>
            <select
              value={panelColor}
              onChange={(e) => setPanelColor(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="7037">7037</option>
              <option value="9005">9005</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Type</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option>60x40 Smart Fix</option>
              <option>80x80 Strong Fix</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Color</label>
            <select
              value={postColor}
              onChange={(e) => setPostColor(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="7037">7037</option>
              <option value="9005">9005</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              <Undo className="inline-block mr-2" size={18} />
              Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              <Redo className="inline-block mr-2" size={18} />
              Redo
            </button>
          </div>
          <button
            onClick={clearLayout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            <Trash2 className="inline-block mr-2" size={18} />
            Clear Layout
          </button>
        </div>
      </div>
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Fence Layout</h2>
        <div className="border-2 border-dashed border-gray-300 p-2">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="cursor-crosshair"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">Click and drag to draw the fence layout. Each grid square represents 1 meter.</p>
      </div>
    </div>
  );
};

export default FenceDesigner;