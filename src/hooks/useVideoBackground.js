// src/hooks/useVideoBackground.js
import { useState, useRef } from 'react';

export const useVideoBackground = (videoSource) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleVideoError = (error) => {
    console.log('Video loading error:', error);
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setIsLoaded(true);
  };

  // Проверяем, существует ли источник видео
  const videoSourceExists = () => {
    try {
      const source = videoSource;
      return !!source;
    } catch (error) {
      console.log('Video source not found:', error);
      return false;
    }
  };

  return {
    videoRef,
    videoError: videoError || !videoSourceExists(),
    isLoaded,
    handleVideoError,
    handleVideoLoad
  };
};