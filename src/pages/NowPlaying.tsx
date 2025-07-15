import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Repeat, ArrowLeft, GripVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMusicContext } from '../contexts/MusicContext';
import { Button } from '@/components/ui/button';

export const NowPlaying: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSong, isPlaying, setIsPlaying, skipToNext, skipToPrevious, playContext, reorderQueue } = useMusicContext();
  const [showQueue, setShowQueue] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  const getUpcomingSongs = () => {
    if (!playContext || !currentSong) return [];
    
    const currentIndex = playContext.currentIndex;
    const nextSongs = playContext.songs.slice(currentIndex + 1, currentIndex + 6);
    return nextSongs;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || !playContext) return;
    
    const currentSongIndex = playContext.currentIndex;
    const actualFromIndex = currentSongIndex + 1 + draggedIndex;
    const actualToIndex = currentSongIndex + 1 + dropIndex;
    
    reorderQueue(actualFromIndex, actualToIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleBackNavigation = () => {
    // Check if there's a state indicating where we came from
    const previousPath = location.state?.from;
    
    if (previousPath) {
      navigate(previousPath);
    } else if (playContext) {
      // If we have a play context, go to the appropriate page
      if (playContext.type === 'playlist') {
        // Try to find the playlist ID from the current context
        navigate('/library'); // Fallback to library if no playlist ID
      } else {
        navigate('/library');
      }
    } else {
      // Default fallback
      navigate('/');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic waveform bars
  const WaveformBar = ({ index }: { index: number }) => {
    const delay = index * 0.1;
    const height = Math.random() * 40 + 10;
    
    return (
      <div
        className={`bg-gradient-primary rounded-full transition-all duration-300 ${
          isPlaying ? 'animate-pulse shadow-glow' : ''
        }`}
        style={{
          width: '4px',
          height: `${height}px`,
          animationDelay: `${delay}s`,
          filter: isPlaying ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none'
        }}
      />
    );
  };

  if (!currentSong) {
    return (
      <div className="min-h-screen bg-gradient-background pb-20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No song playing</h2>
            <p className="text-muted-foreground">Select a song from your library to start listening</p>
          </div>
          <Button
            onClick={() => navigate('/library')}
            className="bg-gradient-primary text-primary-foreground"
          >
            <Music className="w-5 h-5 mr-2" />
            Browse Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-40">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackNavigation}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-foreground">Now Playing</h1>
            </div>
          </div>
        </div>

        {/* Now Playing Section */}
        <div className="px-6 py-4">
          <div className="space-y-8">
            {/* Song Info */}
            <div className="text-center space-y-4">
              {/* Scrolling Title */}
              <div className="overflow-hidden w-full">
                <h1 className={`text-2xl font-bold text-foreground whitespace-nowrap ${
                  currentSong.title.length > 20 ? 'animate-scroll-text' : 'text-center'
                }`}>
                  {currentSong.title}
                </h1>
              </div>
            </div>

            {/* Waveform */}
            <div className="flex items-center justify-center space-x-1 h-16 px-4">
              {Array.from({ length: 40 }, (_, i) => (
                <WaveformBar key={i} index={i} />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="px-4">
              <div className="w-full bg-muted rounded-full h-1">
                <div 
                  className="bg-gradient-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: isPlaying ? '35%' : '0%' }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>1:23</span>
                <span>{formatTime(currentSong.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6">
              <button 
                onClick={skipToPrevious}
                className="p-3 text-foreground hover:scale-105 transition-transform"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-4 bg-gradient-primary text-primary-foreground rounded-full shadow-glow hover:scale-105 transition-all duration-200"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button 
                onClick={skipToNext}
                className="p-3 text-foreground hover:scale-105 transition-transform"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Repeat/Queue Button */}
            <div className="flex flex-col items-center">
              <button 
                onClick={toggleQueue}
                className={`p-2 transition-colors ${showQueue ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Repeat className="w-5 h-5" />
              </button>
              
              {/* Queue Display */}
              {showQueue && (
                <div className="mt-4 w-full max-w-sm bg-card/80 backdrop-blur-sm rounded-lg border border-border p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Up Next</h3>
                  {getUpcomingSongs().length > 0 ? (
                    <div className="space-y-2">
                      {getUpcomingSongs().map((song, index) => (
                        <div 
                          key={song.id} 
                          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing ${
                            draggedIndex === index ? 'opacity-50' : ''
                          }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <GripVertical className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No upcoming songs</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};