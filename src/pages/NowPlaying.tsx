import React, { useState, useEffect } from 'react';
import { ChevronDown, Heart, Share, MoreHorizontal } from 'lucide-react';
import { ProgressBar } from '@/components/ProgressBar';
import { PlayerControls } from '@/components/PlayerControls';
import { useNavigate } from 'react-router-dom';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork?: string;
}

export const NowPlaying: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(45);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  
  // Mock current song
  const currentSong: Song = {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Waves',
    duration: 245
  };

  // Simulate time progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentSong.duration) {
            setIsPlaying(false);
            return currentSong.duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong.duration]);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    // Navigate to previous song
    console.log('Previous song');
  };

  const handleNext = () => {
    // Navigate to next song
    console.log('Next song');
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-foreground hover:bg-muted/50 
                   transition-all duration-200"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Now Playing</p>
        </div>
        
        <button className="p-2 rounded-lg text-foreground hover:bg-muted/50 
                         transition-all duration-200">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Artwork */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-80 h-80 bg-gradient-primary rounded-3xl shadow-glow mb-8 
                      overflow-hidden animate-scale-in">
          {currentSong.artwork ? (
            <img 
              src={currentSong.artwork} 
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-6xl">
                {currentSong.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar - Main Focus */}
        <div className="w-full max-w-sm mb-8">
          <ProgressBar
            currentTime={currentTime}
            duration={currentSong.duration}
            onSeek={handleSeek}
          />
        </div>

        {/* Song Info - Below Progress */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {currentSong.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {currentSong.artist}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-xl transition-all duration-200 hover:scale-105
                      ${isLiked 
                        ? 'text-primary bg-primary/20 shadow-glow' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button className="p-3 rounded-xl text-muted-foreground hover:text-foreground 
                           hover:bg-muted/50 transition-all duration-200 hover:scale-105">
            <Share className="w-6 h-6" />
          </button>
        </div>

        {/* Player Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onShuffle={() => console.log('Shuffle')}
          onRepeat={() => console.log('Repeat')}
          className="mb-8"
        />
      </div>
    </div>
  );
};