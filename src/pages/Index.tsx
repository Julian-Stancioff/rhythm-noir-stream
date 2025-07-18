import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Plus, Clock, Music, Shuffle, Repeat } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMusicContext } from '../contexts/MusicContext';
import waveformBackground from '../assets/waveform-background.png';

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
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } = useMusicContext();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);


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

  // Simple visible waveform bars
  const WaveformBar = ({ index }: { index: number }) => {
    const heights = [20, 40, 60, 80, 100, 120, 90, 70, 50, 30, 60, 110, 85, 45, 75, 95, 65, 35, 55, 105, 
                    80, 40, 70, 120, 60, 30, 90, 110, 50, 80, 100, 45, 75, 95, 65, 35, 85, 115, 55, 25];
    const height = heights[index % heights.length];
    
    return (
      <div
        style={{
          width: '6px',
          height: `${height}px`,
          backgroundColor: '#ff6b35',
          borderRadius: '3px',
          margin: '0 1px',
          animation: `pulse 2s ease-in-out infinite`,
          animationDelay: `${index * 0.1}s`
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-32">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-1 pb-3">
          <div className="text-center space-y-3">
            <div className="w-full h-40 mx-auto flex items-end justify-center px-8" style={{ backgroundColor: 'transparent' }}>
              {Array.from({ length: 40 }, (_, index) => (
                <WaveformBar key={index} index={index} />
              ))}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">House Share</h1>
              <p className="text-muted-foreground">Your personal music streaming hub</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                to="/library"
                className="flex items-center px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl shadow-glow hover:scale-105 transition-all duration-200 font-medium"
              >
                <Music className="w-5 h-5 mr-2" />
                Browse Library
              </Link>
              <Link
                to="/upload"
                className="flex items-center px-6 py-3 bg-card border border-border text-foreground rounded-xl hover:scale-105 transition-all duration-200 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload
              </Link>
            </div>
          </div>
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