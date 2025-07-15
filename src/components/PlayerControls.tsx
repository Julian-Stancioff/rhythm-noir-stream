import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  volume = 0.7,
  onVolumeChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center gap-6 ${className}`}>
      {/* Secondary Controls */}
      <div className="flex items-center gap-4">
        {onShuffle && (
          <button
            onClick={onShuffle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground 
                     hover:bg-muted/50 transition-all duration-200"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevious}
          className="p-3 rounded-xl text-foreground hover:bg-muted/50 
                   transition-all duration-200 hover:scale-105"
        >
          <SkipBack className="w-6 h-6" fill="currentColor" />
        </button>

        <button
          onClick={onPlayPause}
          className="p-4 rounded-full bg-gradient-primary text-primary-foreground 
                   shadow-glow hover:shadow-glow hover:scale-105 
                   transition-all duration-200 animate-glow-pulse"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-3 rounded-xl text-foreground hover:bg-muted/50 
                   transition-all duration-200 hover:scale-105"
        >
          <SkipForward className="w-6 h-6" fill="currentColor" />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center gap-4">
        {onRepeat && (
          <button
            onClick={onRepeat}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground 
                     hover:bg-muted/50 transition-all duration-200"
          >
            <Repeat className="w-5 h-5" />
          </button>
        )}
        
        {onVolumeChange && (
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-progress-bg rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                       [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary 
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};