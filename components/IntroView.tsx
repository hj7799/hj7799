import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface IntroViewProps {
  onStart: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 blur-lg opacity-75 rounded-2xl" />
          <div className="relative bg-gray-900 p-6 rounded-2xl border border-white/10 shadow-2xl">
             <Camera className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
            YouthLens AI
          </h1>
          <p className="text-gray-400 text-lg">
            Instantly look younger and slimmer with our advanced AI beauty filter.
          </p>
        </div>

        <button 
          onClick={onStart}
          className="group relative flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
        >
          <Sparkles className="w-5 h-5 mr-2 text-purple-600 group-hover:rotate-12 transition-transform" />
          <span>Start Camera</span>
        </button>
      </div>
      
      <div className="absolute bottom-8 text-xs text-gray-600 z-10">
        Powered by Google Gemini
      </div>
    </div>
  );
};

export default IntroView;