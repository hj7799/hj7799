import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SwitchCamera, Zap, X, ZoomIn, ZoomOut } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onError: (error: string) => void;
  onExit: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onError, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(3);
  const [supportsZoom, setSupportsZoom] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      // Use 4:3 aspect ratio which matches most mobile sensors, providing the widest angle (unzoomed) view.
      // 16:9 often crops the top/bottom, making it look zoomed in.
      const isPortrait = window.innerHeight > window.innerWidth;
      
      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          // Requesting 4:3 aspect ratio (e.g. 1440x1920 or 1920x1440)
          width: { ideal: isPortrait ? 1440 : 1920 },
          height: { ideal: isPortrait ? 1920 : 1440 }
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);

        // Check for Zoom capabilities
        const track = stream.getVideoTracks()[0] as any;
        if (track.getCapabilities) {
          const capabilities = track.getCapabilities();
          if (capabilities.zoom) {
            setSupportsZoom(true);
            setMinZoom(capabilities.zoom.min);
            setMaxZoom(capabilities.zoom.max);
            setZoom(capabilities.zoom.min);
          } else {
            setSupportsZoom(false);
          }
        }
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setHasPermission(false);
      onError("Unable to access camera. Please allow permissions.");
    }
  }, [isFrontCamera, onError]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(event.target.value);
    setZoom(newZoom);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0] as any;
      if (track.applyConstraints) {
        track.applyConstraints({ advanced: [{ zoom: newZoom }] }).catch((e: any) => console.log(e));
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally if front camera to mirror user like a real mirror
        if (isFrontCamera) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
      }
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(prev => !prev);
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/80">
        <h2 className="text-xl font-bold mb-2">Camera Access Required</h2>
        <p>Please enable camera access in your browser settings to use the beauty filter.</p>
        <button onClick={onExit} className="mt-6 px-6 py-2 bg-white/10 rounded-full">Go Back</button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Video Viewport */}
      <div className="relative flex-1 overflow-hidden rounded-b-[2rem] bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
        />
        
        {/* Top Controls */}
        <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center z-20 pt-safe">
           {/* Exit Button */}
           <button 
             onClick={onExit}
             className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/60 transition-colors flex items-center space-x-2"
             aria-label="Exit Camera"
           >
             <X className="w-6 h-6" />
           </button>

           {/* Title Badge */}
           <div className="bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
             <span className="text-xs font-bold text-pink-300 tracking-widest uppercase">YouthLens</span>
           </div>
           
           {/* Placeholder for Flash/Settings */}
           <div className="bg-black/40 backdrop-blur-md p-3 rounded-full">
             <Zap className="w-6 h-6 text-yellow-400" />
           </div>
        </div>

        {/* Zoom Controls (Overlay above bottom bar) */}
        {supportsZoom && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4 px-10 z-20">
            <ZoomOut className="w-4 h-4 text-white/70" />
            <input 
              type="range" 
              min={minZoom} 
              max={maxZoom} 
              step="0.1" 
              value={zoom} 
              onChange={handleZoomChange}
              className="w-64 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <ZoomIn className="w-4 h-4 text-white/70" />
          </div>
        )}
      </div>

      {/* Bottom Controls Area */}
      <div className="bg-black pt-6 pb-10 px-8 flex items-center justify-between">
        
        {/* Left: Spacer / Gallery (Placeholder) */}
        <div className="w-14 flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-gray-800/50 border border-white/10" />
        </div>

        {/* Center: Shutter Button */}
        <div className="relative">
            <button 
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all active:scale-95 active:border-pink-500"
            aria-label="Take Photo"
            >
            <div className="w-16 h-16 bg-white rounded-full hover:bg-gray-100 transition-colors" />
            </button>
        </div>

        {/* Right: Switch Camera */}
        <div className="w-14 flex justify-center">
            <button 
            onClick={toggleCamera}
            className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:bg-gray-700 transition-all border border-white/10"
            aria-label="Switch Camera"
            >
            <SwitchCamera className="w-6 h-6" />
            </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      <style>{`
        .pt-safe {
          padding-top: env(safe-area-inset-top, 1rem);
        }
      `}</style>
    </div>
  );
};

export default CameraCapture;