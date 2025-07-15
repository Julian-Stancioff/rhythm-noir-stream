import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMusicContext } from '../contexts/MusicContext';

export const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, playPause, skipToNext, skipToPrevious } = useMusicContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentSong || location.pathname === '/now-playing') return null;

  const handleNavigateToPlayer = () => {
    navigate('/now-playing', { state: { from: location.pathname } });
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 safe-area-inset-bottom">
      <div className="mx-4 mb-2">
        <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-elegant overflow-hidden">
          {/* Animated waveform bar at top */}
          <div className="h-1 bg-gradient-primary opacity-60 animate-pulse"></div>
          
          <div className="flex items-center px-4 py-3 max-w-screen-sm mx-auto">
            {/* Song Info - Clickable area */}
            <div 
              className="flex-1 cursor-pointer overflow-hidden mr-3"
              onClick={handleNavigateToPlayer}
            >
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-foreground whitespace-nowrap animate-scroll-seamless">
                  {currentSong.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSong.artist}
                </p>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipToPrevious();
                }}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPause();
                }}
                className="p-2.5 bg-gradient-primary text-primary-foreground rounded-xl hover:scale-105 transition-all duration-200 shadow-glow"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipToNext();
                }}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="h-1 bg-muted/30">
            <div 
              className="h-full bg-gradient-primary transition-all duration-300 rounded-full"
              style={{ width: isPlaying ? '35%' : '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};