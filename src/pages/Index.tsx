import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(42);
  const [duration] = useState(188);
  
  // Animated waveform bars
  const [waveformBars] = useState(() => 
    Array.from({ length: 50 }, () => Math.random() * 0.8 + 0.2)
  );
  
  // Animate bars when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => prev < duration ? prev + 1 : 0);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Player Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        
        {/* Song Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Deep House Groove
          </h1>
          <p className="text-muted-foreground">
            Artist Name
          </p>
        </div>

        {/* Animated Waveform */}
        <div className="w-full max-w-sm mb-8">
          <div className="flex items-end justify-center gap-1 h-32 mb-4">
            {waveformBars.map((height, index) => {
              const isActive = (index / waveformBars.length) * 100 <= progress;
              const animationDelay = isPlaying ? `${index * 50}ms` : '0ms';
              
              return (
                <div
                  key={index}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary shadow-glow' 
                      : 'bg-muted'
                  }`}
                  style={{
                    height: `${height * 100}%`,
                    animationDelay,
                    animation: isPlaying && isActive ? 'pulse 1s ease-in-out infinite' : 'none'
                  }}
                />
              );
            })}
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-8 mb-12">
          <button className="p-3 rounded-xl text-foreground hover:bg-muted/50 transition-all duration-200">
            <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 rounded-full bg-gradient-primary text-primary-foreground 
                     shadow-glow hover:shadow-glow hover:scale-105 
                     transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            )}
          </button>
          
          <button className="p-3 rounded-xl text-foreground hover:bg-muted/50 transition-all duration-200">
            <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Queue Button */}
      <div className="p-6 pb-8">
        <button className="w-full flex items-center justify-center gap-3 py-4 px-6 
                         bg-card border border-border rounded-xl 
                         text-foreground hover:bg-muted/50 
                         transition-all duration-200 font-medium">
          <ListMusic className="w-5 h-5" />
          Queue
        </button>
      </div>
    </div>
  );
};
export default Index;