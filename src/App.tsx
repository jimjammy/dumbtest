import React, { useState } from 'react';
import { Fence, Grid, Layers, Box, Eye, FileText } from 'lucide-react';
import FenceDesigner from './components/FenceDesigner';
import FencePreview from './components/FencePreview';
import FenceOrder from './components/FenceOrder';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'preview' | 'order'>('design');
  const [fenceConfig, setFenceConfig] = useState({
    panels: [],
    posts: [],
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fence size={24} />
            <h1 className="text-xl font-bold">Safety Fence Configurator</h1>
          </div>
        </div>
      </header>
      <nav className="bg-white shadow">
        <div className="container mx-auto">
          <ul className="flex">
            <li className={`cursor-pointer p-4 ${activeTab === 'design' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('design')}>
              <Grid className="inline-block mr-2" size={18} />
              1. Design
            </li>
            <li className={`cursor-pointer p-4 ${activeTab === 'preview' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('preview')}>
              <Eye className="inline-block mr-2" size={18} />
              2. Preview
            </li>
            <li className={`cursor-pointer p-4 ${activeTab === 'order' ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab('order')}>
              <FileText className="inline-block mr-2" size={18} />
              3. Order
            </li>
          </ul>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4">
        {activeTab === 'design' && <FenceDesigner fenceConfig={fenceConfig} setFenceConfig={setFenceConfig} />}
        {activeTab === 'preview' && <FencePreview fenceConfig={fenceConfig} />}
        {activeTab === 'order' && <FenceOrder fenceConfig={fenceConfig} />}
      </main>
    </div>
  );
};

export default App;