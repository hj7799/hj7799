import React, { useState } from 'react';
import { Download, Share2, RefreshCw, Wand2, Eye } from 'lucide-react';

interface ResultViewProps {
  processedImage: string;
  originalImage: string;
  onRetake: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ processedImage, originalImage, onRetake }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `youthlens-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent">
        <button 
          onClick={onRetake}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <div className="px-3 py-1 bg-pink-500/20 backdrop-blur-md border border-pink-500/30 rounded-full">
            <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">AI Result</span>
        </div>
      </div>

      {/* Main Image Area */}
      <div 
        className="flex-1 relative overflow-hidden bg-gray-900"
        onMouseDown={() => setShowOriginal(true)}
        onMouseUp={() => setShowOriginal(false)}
        onTouchStart={() => setShowOriginal(true)}
        onTouchEnd={() => setShowOriginal(false)}
      >
         {/* Original Image Layer (Underneath) */}
         <img 
            src={`data:image/jpeg;base64,${originalImage}`} 
            alt="Original" 
            className="absolute inset-0 w-full h-full object-contain z-0 opacity-50 filter blur-sm scale-105" 
         />

        {/* Display Image */}
        <img 
          src={showOriginal ? `data:image/jpeg;base64,${originalImage}` : `data:image/jpeg;base64,${processedImage}`} 
          alt="Result" 
          className="absolute inset-0 w-full h-full object-cover md:object-contain z-10 transition-opacity duration-200"
        />

        {/* Comparison Hint */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <div className={`flex items-center space-x-2 bg-black/40 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 transition-opacity duration-300 ${showOriginal ? 'opacity-0' : 'opacity-100'}`}>
                <Eye className="w-4 h-4 text-white/80" />
                <span className="text-xs font-medium text-white/90">Hold to see original</span>
            </div>
        </div>
        
        {/* Original Indicator */}
        {showOriginal && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm pointer-events-none">
                <span className="text-white font-bold tracking-widest uppercase">Original</span>
            </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-gray-900 p-6 pb-8 rounded-t-3xl -mt-6 z-20 relative border-t border-gray-800">
        <div className="flex justify-between items-center space-x-4">
            <button className="flex-1 flex flex-col items-center justify-center space-y-1 p-2 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-6 h-6" />
                <span className="text-xs">Share</span>
            </button>

            <button 
                onClick={handleDownload}
                className="flex-1 h-14 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
            >
                <Download className="w-6 h-6 mr-2" />
                <span className="font-semibold">Save Photo</span>
            </button>

            <button className="flex-1 flex flex-col items-center justify-center space-y-1 p-2 text-pink-400 hover:text-pink-300 transition-colors">
                <Wand2 className="w-6 h-6" />
                <span className="text-xs">Edit</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultView;