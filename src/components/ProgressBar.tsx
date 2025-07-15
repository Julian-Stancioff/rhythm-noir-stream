import React, { useState, useRef, useEffect } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayProgress = isDragging ? dragPosition : progress;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedPosition = Math.max(0, Math.min(100, position));
    
    if (isDragging) {
      setDragPosition(clampedPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const newTime = (dragPosition / 100) * duration;
      onSeek(newTime);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragPosition, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="relative h-2 bg-progress-bg rounded-full cursor-pointer group shadow-progress"
        onMouseDown={handleMouseDown}
      >
        {/* Progress Fill */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-200 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
        
        {/* Progress Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-glow rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -translate-x-1/2"
          style={{ left: `${displayProgress}%` }}
        />
        
        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      
      {/* Time Display */}
      <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
        <span className="font-medium">
          {formatTime(isDragging ? (dragPosition / 100) * duration : currentTime)}
        </span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};