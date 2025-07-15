import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork?: string;
}

interface PlayContext {
  type: 'playlist' | 'library';
  songs: Song[];
  currentIndex: number;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playContext: PlayContext | null;
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  playPause: () => void;
  setPlayContext: (context: PlayContext | null) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  playFromContext: (songs: Song[], index: number, type: 'playlist' | 'library') => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playContext, setPlayContext] = useState<PlayContext | null>(null);

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    if (!playContext || playContext.currentIndex >= playContext.songs.length - 1) return;
    
    const nextIndex = playContext.currentIndex + 1;
    const nextSong = playContext.songs[nextIndex];
    
    setCurrentSong(nextSong);
    setPlayContext({ ...playContext, currentIndex: nextIndex });
    setIsPlaying(true);
  };

  const reorderQueue = (fromIndex: number, toIndex: number) => {
    if (!playContext) return;
    
    const newSongs = [...playContext.songs];
    const [movedSong] = newSongs.splice(fromIndex, 1);
    newSongs.splice(toIndex, 0, movedSong);
    
    // Update indices if needed
    let newCurrentIndex = playContext.currentIndex;
    if (fromIndex <= playContext.currentIndex && toIndex > playContext.currentIndex) {
      newCurrentIndex--;
    } else if (fromIndex > playContext.currentIndex && toIndex <= playContext.currentIndex) {
      newCurrentIndex++;
    } else if (fromIndex === playContext.currentIndex) {
      newCurrentIndex = toIndex;
    }
    
    setPlayContext({ ...playContext, songs: newSongs, currentIndex: newCurrentIndex });
  };

  const skipToPrevious = () => {
    if (!playContext || playContext.currentIndex <= 0) return;
    
    const prevIndex = playContext.currentIndex - 1;
    const prevSong = playContext.songs[prevIndex];
    
    setCurrentSong(prevSong);
    setPlayContext({ ...playContext, currentIndex: prevIndex });
    setIsPlaying(true);
  };

  const playFromContext = (songs: Song[], index: number, type: 'playlist' | 'library') => {
    const song = songs[index];
    if (!song) return;
    
    setCurrentSong(song);
    setPlayContext({ type, songs, currentIndex: index });
    setIsPlaying(true);
  };

  const value: MusicContextType = {
    currentSong,
    isPlaying,
    playContext,
    setCurrentSong,
    setIsPlaying,
    playPause,
    setPlayContext,
    skipToNext,
    skipToPrevious,
    playFromContext,
    reorderQueue,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};