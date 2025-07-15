import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Timer } from 'lucide-react';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(42);
  const [duration] = useState(188);
  const [waveformOffset, setWaveformOffset] = useState(0);
  
  // Generate more waveform bars for continuous scrolling
  const [waveformBars] = useState(() => 
    Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2)
  );
  
  // Animate bars when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const timeInterval = setInterval(() => {
      setCurrentTime(prev => prev < duration ? prev + 1 : 0);
    }, 1000);

    // Animate waveform scrolling
    const waveformInterval = setInterval(() => {
      setWaveformOffset(prev => (prev + 1) % waveformBars.length);
    }, 100);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(waveformInterval);
    };
  }, [isPlaying, duration, waveformBars.length]);

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
        
        {/* Song Title - Scrolling Animation */}
        <div className="text-center mb-12 w-full max-w-sm overflow-hidden">
          <div className="animate-[scroll-title_12s_linear_infinite]">
            <h1 className="text-2xl font-semibold text-foreground whitespace-nowrap">
              Deep House Groove
            </h1>
          </div>
        </div>

        {/* Dynamic Scrolling Waveform */}
        <div className="w-full max-w-sm mb-8 overflow-hidden">
          <div 
            className="flex items-end justify-start gap-1 h-32 mb-4 transition-transform duration-75 ease-linear"
            style={{
              transform: `translateX(-${(waveformOffset * 6)}px)`,
              width: `${waveformBars.length * 6}px`
            }}
          >
            {[...waveformBars, ...waveformBars.slice(0, 20)].map((height, index) => {
              const adjustedIndex = index % waveformBars.length;
              const isActive = (adjustedIndex / waveformBars.length) * 100 <= progress;
              const intensity = Math.sin(Date.now() * 0.01 + index * 0.3) * 0.5 + 0.5;
              const glowIntensity = isPlaying && isActive ? intensity : 0;
              
              return (
                <div
                  key={`${adjustedIndex}-${Math.floor(index / waveformBars.length)}`}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isActive 
                      ? 'bg-primary' 
                      : 'bg-muted/60'
                  }`}
                  style={{
                    height: `${height * 100}%`,
                    boxShadow: isActive ? `0 0 ${8 + glowIntensity * 12}px hsl(var(--primary) / ${0.6 + glowIntensity * 0.4})` : 'none',
                    filter: isActive ? `brightness(${1 + glowIntensity * 0.5})` : 'none'
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

        {/* Queue Icon Button */}
        <div className="w-full max-w-sm flex justify-end">
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 
                           transition-all duration-200">
            <Timer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Index;