import React from 'react';
import { Play, Pause, MoreHorizontal } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork?: string;
}

interface SongCardProps {
  song: Song;
  isPlaying?: boolean;
  isCurrentSong?: boolean;
  onPlayPause: (song: Song) => void;
  onSelect: (song: Song) => void;
  onMoreOptions?: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying = false,
  isCurrentSong = false,
  onPlayPause,
  onSelect,
  onMoreOptions
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ease-out
                ${isCurrentSong 
                  ? 'bg-gradient-card border border-primary/20 shadow-glow' 
                  : 'hover:bg-card/50'
                }`}
    >
      {/* Artwork / Play Button */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center
                      shadow-card overflow-hidden">
          {song.artwork ? (
            <img 
              src={song.artwork} 
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                {song.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Play/Pause Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause(song);
          }}
          className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {isPlaying && isCurrentSong ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Song Info */}
      <div 
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onMoreOptions ? onMoreOptions(song) : onSelect(song)}
      >
        <h3 className={`font-semibold truncate transition-colors duration-200
                      ${isCurrentSong ? 'text-primary' : 'text-foreground'}`}>
          {song.title}
        </h3>
      </div>

      {/* Controls - Always visible on mobile */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">
          {formatDuration(song.duration)}
        </span>
        
        {onMoreOptions && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMoreOptions(song);
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground 
                     hover:bg-muted/50 transition-all duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Playing indicator */}
      {isCurrentSong && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}
    </div>
  );
};