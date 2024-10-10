import React from 'react';
import { FileText, FileSpreadsheet, FileImage, Save, Send } from 'lucide-react';

interface FenceOrderProps {
  fenceConfig: any;
}

const FenceOrder: React.FC<FenceOrderProps> = ({ fenceConfig }) => {
  const calculateTotalLength = () => {
    if (!fenceConfig.layout || fenceConfig.layout.length < 2) return 0;
    let totalLength = 0;
    for (let i = 1; i < fenceConfig.layout.length; i++) {
      const dx = fenceConfig.layout[i].x - fenceConfig.layout[i - 1].x;
      const dy = fenceConfig.layout[i].y - fenceConfig.layout[i - 1].y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    return (totalLength * 0.2).toFixed(2); // Convert to meters
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Material List</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Color</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Panel</td>
              <td className="border p-2">{fenceConfig.panels[0]?.type || '-'}</td>
              <td className="border p-2">{fenceConfig.panels.length}</td>
              <td className="border p-2">{fenceConfig.panels[0]?.color || '-'}</td>
            </tr>
            <tr>
              <td className="border p-2">Post</td>
              <td className="border p-2">{fenceConfig.posts[0]?.type || '-'}</td>
              <td className="border p-2">{fenceConfig.posts.length}</td>
              <td className="border p-2">{fenceConfig.posts[0]?.color || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Fence Details</h3>
        <p>Total Length: {calculateTotalLength()} meters</p>
        <p>Number of Corners: {fenceConfig.layout ? fenceConfig.layout.length - 1 : 0}</p>
      </div>
      <div className="flex space-x-2">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <FileImage className="inline-block mr-2" size={18} />
          Export 3D Model
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          <FileSpreadsheet className="inline-block mr-2" size={18} />
          Export to Excel
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          <FileText className="inline-block mr-2" size={18} />
          Export to PDF
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
          <Save className="inline-block mr-2" size={18} />
          Save Design
        </button>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
          <Send className="inline-block mr-2" size={18} />
          Request Offer
        </button>
      </div>
    </div>
  );
};

export default FenceOrder;