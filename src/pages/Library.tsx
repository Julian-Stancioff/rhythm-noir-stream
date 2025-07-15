import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SongCard } from '@/components/SongCard';
import { Music, Plus, Check, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMusicContext } from '../contexts/MusicContext';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork?: string;
}

// Mock data for demonstration
const mockSongs: Song[] = [
  { id: '1', title: 'Midnight Dreams', artist: 'Luna Waves', duration: 245 },
  { id: '2', title: 'Electric Pulse', artist: 'Neon City', duration: 198 },
  { id: '3', title: 'Ocean Breeze', artist: 'Coastal Vibes', duration: 312 },
  { id: '4', title: 'Urban Nights', artist: 'City Lights', duration: 267 },
  { id: '5', title: 'Crystal Waters', artist: 'Ambient Waves', duration: 389 },
  { id: '6', title: 'Solar Flare', artist: 'Space Echo', duration: 201 },
  { id: '7', title: 'Forest Walk', artist: 'Nature Sounds', duration: 445 },
  { id: '8', title: 'Digital Love', artist: 'Cyber Hearts', duration: 234 },
];

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } = useMusicContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  
  const isSelectionMode = location.state?.selectionMode || false;
  const playlistId = location.state?.playlistId;
  const playlistName = location.state?.playlistName;

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return mockSongs;
    
    return mockSongs.filter(song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleSongSelect = (song: Song) => {
    if (isSelectionMode) {
      const newSelected = new Set(selectedSongs);
      if (newSelected.has(song.id)) {
        newSelected.delete(song.id);
      } else {
        newSelected.add(song.id);
      }
      setSelectedSongs(newSelected);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      // Navigate to homepage
      navigate('/');
    }
  };

  const handleAddToPlaylist = () => {
    const songsToAdd = mockSongs.filter(song => selectedSongs.has(song.id));
    if (playlistId === 'new') {
      navigate('/playlist/new', { 
        state: { 
          addedSongs: songsToAdd,
          playlistName: playlistName 
        } 
      });
    } else {
      navigate(`/playlist/${playlistId}`, { 
        state: { addedSongs: songsToAdd } 
      });
    }
  };

  const handleCancelSelection = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-40">
        <div className="p-6 pb-4">
          {isSelectionMode && (
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={handleCancelSelection}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleAddToPlaylist}
                disabled={selectedSongs.size === 0}
                className="flex items-center gap-2 bg-gradient-primary text-primary-foreground"
              >
                <Check className="w-4 h-4" />
                Add to Playlist ({selectedSongs.size})
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isSelectionMode ? 'Select Songs' : 'Your Library'}
              </h1>
              <p className="text-muted-foreground">
                {mockSongs.length} songs • {Math.floor(mockSongs.reduce((acc, song) => acc + song.duration, 0) / 60)} minutes
              </p>
            </div>
            
            {!isSelectionMode && (
              <Link
                to="/upload"
                className="p-3 bg-gradient-primary text-primary-foreground rounded-xl 
                         shadow-glow hover:shadow-glow hover:scale-105 
                         transition-all duration-200"
              >
                <Plus className="w-6 h-6" />
              </Link>
            )}
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search your music..."
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        {filteredSongs.length > 0 ? (
          <div className="space-y-2">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className={`relative ${
                  isSelectionMode && selectedSongs.has(song.id) 
                    ? 'ring-2 ring-primary bg-primary/5 rounded-lg' 
                    : ''
                }`}
              >
                {isSelectionMode && selectedSongs.has(song.id) && (
                  <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <SongCard
                  song={song}
                  isPlaying={isPlaying}
                  isCurrentSong={currentSong?.id === song.id}
                  onPlayPause={handlePlayPause}
                  onSelect={handleSongSelect}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No songs found' : 'No music yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery 
                ? `No songs match "${searchQuery}". Try a different search term.`
                : 'Start building your music library by uploading your favorite tracks.'
              }
            </p>
            {!searchQuery && (
              <Link
                to="/upload"
                className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl 
                         shadow-glow hover:shadow-glow hover:scale-105 
                         transition-all duration-200 font-medium"
              >
                Upload Your First Song
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};