export enum AppState {
  INTRO = 'INTRO',
  CAMERA = 'CAMERA',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface ProcessingResult {
  originalImage: string; // Base64
  processedImage: string; // Base64
}

export interface CameraError {
  title: string;
  message: string;
}