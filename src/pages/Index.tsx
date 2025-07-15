import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Plus, Clock, Music, Shuffle, Repeat } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork?: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  totalDuration: number;
}

// Mock playlists data
const mockPlaylists: Playlist[] = [];

const Index: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // Check if a song was passed from the library
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const songData = searchParams.get('song');
    if (songData) {
      try {
        const song = JSON.parse(decodeURIComponent(songData));
        setCurrentSong(song);
        setIsPlaying(true);
        // Clean up URL
        window.history.replaceState({}, '', '/');
      } catch (error) {
        console.error('Error parsing song data:', error);
      }
    }
  }, [location]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Load playlists from localStorage
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Now Playing Section */}
        <div className="px-6 py-8">
          {currentSong ? (
            <div className="space-y-8">
              {/* Song Info */}
              <div className="text-center space-y-4">
                <div className="w-64 h-64 mx-auto bg-gradient-subtle rounded-2xl shadow-elegant flex items-center justify-center">
                  <Music className="w-24 h-24 text-muted-foreground" />
                </div>
                
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
                <button className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Shuffle className="w-6 h-6" />
                </button>
                <button className="p-3 text-foreground hover:scale-105 transition-transform">
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-4 bg-gradient-primary text-primary-foreground rounded-full shadow-glow hover:scale-105 transition-all duration-200"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </button>
                <button className="p-3 text-foreground hover:scale-105 transition-transform">
                  <SkipForward className="w-6 h-6" />
                </button>
                <button className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Repeat className="w-6 h-6" />
                </button>
              </div>

              {/* Queue Button */}
              <div className="flex justify-center">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Clock className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // Placeholder State
            <div className="text-center space-y-6 py-12">
              <div className="w-48 h-48 mx-auto bg-gradient-subtle rounded-2xl shadow-elegant flex items-center justify-center">
                <Music className="w-16 h-16 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Ready to Play</h2>
                <p className="text-muted-foreground">Select a song from your library to start listening</p>
              </div>
              <Link
                to="/library"
                className="inline-flex items-center px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow hover:scale-105 transition-all duration-200 font-medium"
              >
                <Music className="w-5 h-5 mr-2" />
                Browse Library
              </Link>
            </div>
          )}
        </div>

        {/* Playlists Section */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Playlists</h3>
            <Link
              to="/playlist/new"
              className="p-2 bg-gradient-primary text-primary-foreground rounded-lg shadow-glow hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          
          {playlists.length > 0 ? (
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="block p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{playlist.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {playlist.songs.length} songs • {formatDuration(playlist.totalDuration)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No playlists yet</p>
              <Link
                to="/playlist/new"
                className="inline-block px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg shadow-glow hover:scale-105 transition-all duration-200 font-medium"
              >
                Create Your First Playlist
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Index;