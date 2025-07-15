import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { SongCard } from '@/components/SongCard';
import { Music, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setCurrentSong(song);
    // Navigate to now playing screen
    window.location.href = '/now-playing';
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-40">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
              <p className="text-muted-foreground">
                {mockSongs.length} songs • {Math.floor(mockSongs.reduce((acc, song) => acc + song.duration, 0) / 60)} minutes
              </p>
            </div>
            
            <Link
              to="/upload"
              className="p-3 bg-gradient-primary text-primary-foreground rounded-xl 
                       shadow-glow hover:shadow-glow hover:scale-105 
                       transition-all duration-200"
            >
              <Plus className="w-6 h-6" />
            </Link>
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
              <SongCard
                key={song.id}
                song={song}
                isPlaying={isPlaying}
                isCurrentSong={currentSong?.id === song.id}
                onPlayPause={handlePlayPause}
                onSelect={handleSongSelect}
              />
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