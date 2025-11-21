import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import ProcessingView from './components/ProcessingView';
import ResultView from './components/ResultView';
import IntroView from './components/IntroView';
import { AppState, ProcessingResult } from './types';
import { processBeautyFilter } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCapture = async (imageSrc: string) => {
    try {
      setAppState(AppState.PROCESSING);
      // Remove data URL prefix to get raw base64
      const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
      
      const processedImageBase64 = await processBeautyFilter(base64Data);
      
      setResult({
        originalImage: base64Data,
        processedImage: processedImageBase64
      });
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error("Processing failed", error);
      setErrorMessage("The magic failed to apply. Please try again later or check your internet connection.");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setResult(null);
    setErrorMessage(null);
    setAppState(AppState.CAMERA);
  };

  const exitToHome = () => {
    setResult(null);
    setErrorMessage(null);
    setAppState(AppState.INTRO);
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden">
      
      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative">
        
        {appState === AppState.INTRO && (
          <IntroView onStart={() => setAppState(AppState.CAMERA)} />
        )}

        {appState === AppState.CAMERA && (
          <CameraCapture 
            onCapture={handleCapture} 
            onError={(msg) => {
              setErrorMessage(msg);
              setAppState(AppState.ERROR);
            }}
            onExit={exitToHome}
          />
        )}

        {appState === AppState.PROCESSING && (
          <ProcessingView />
        )}

        {appState === AppState.RESULT && result && (
          <ResultView 
            originalImage={result.originalImage} 
            processedImage={result.processedImage}
            onRetake={resetApp}
          />
        )}

        {appState === AppState.ERROR && (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-900 text-center">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
             </div>
             <h2 className="text-xl font-bold mb-2">Oops!</h2>
             <p className="text-gray-400 mb-8">{errorMessage || "Something went wrong."}</p>
             <div className="flex space-x-4">
                <button 
                    onClick={exitToHome}
                    className="px-6 py-3 border border-gray-600 rounded-full font-semibold text-gray-300 hover:bg-gray-800 transition-colors"
                >
                    Back Home
                </button>
                <button 
                    onClick={resetApp}
                    className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors"
                >
                    Try Again
                </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;