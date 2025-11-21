import React from 'react';
import { Sparkles } from 'lucide-react';

const ProcessingView: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="z-10 flex flex-col items-center">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-600 blur-xl opacity-50 rounded-full animate-pulse" />
            <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-full border border-white/10">
                <Sparkles className="w-12 h-12 text-pink-300 animate-spin-slow" />
            </div>
        </div>
        
        <h2 className="mt-8 text-2xl font-light tracking-wide">
          Applying <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Magic</span>
        </h2>
        <p className="mt-2 text-white/50 text-sm animate-pulse">Sculpting face • Reducing age • Glowing skin</p>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingView;