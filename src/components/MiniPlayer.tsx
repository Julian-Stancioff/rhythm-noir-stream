import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMusicContext } from '../contexts/MusicContext';

export const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, playPause } = useMusicContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentSong || location.pathname === '/now-playing') return null;

  const handleNavigateToPlayer = () => {
    navigate('/now-playing');
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center px-4 py-2 max-w-screen-sm mx-auto">
        {/* Song Info - Clickable area */}
        <div 
          className="flex-1 cursor-pointer overflow-hidden mr-3"
          onClick={handleNavigateToPlayer}
        >
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-foreground whitespace-nowrap animate-scroll-seamless">
              {currentSong.title}
            </p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playPause();
          }}
          className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all duration-200 shadow-glow"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};