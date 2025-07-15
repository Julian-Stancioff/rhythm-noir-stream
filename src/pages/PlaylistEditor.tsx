import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Music, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SongCard } from '@/components/SongCard';
import { useMusicContext } from '../contexts/MusicContext';

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

export const PlaylistEditor: React.FC = () => {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const location = useLocation();
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying, playFromContext } = useMusicContext();
  const isNewPlaylist = !playlistId;
  
  const [playlistName, setPlaylistName] = useState('');
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    if (location.state?.addedSongs) {
      const addedSongs = location.state.addedSongs as Song[];
      const totalDuration = addedSongs.reduce((acc, song) => acc + song.duration, 0);
      
      if (isNewPlaylist) {
        const newPlaylist: Playlist = {
          id: Date.now().toString(),
          name: playlistName || 'New Playlist',
          songs: addedSongs,
          totalDuration
        };
        setPlaylist(newPlaylist);
        
        // Save to localStorage
        const existingPlaylists = JSON.parse(localStorage.getItem('playlists') || '[]');
        existingPlaylists.push(newPlaylist);
        localStorage.setItem('playlists', JSON.stringify(existingPlaylists));
      } else {
        // Update existing playlist
        const existingPlaylists = JSON.parse(localStorage.getItem('playlists') || '[]');
        const updatedPlaylists = existingPlaylists.map((p: Playlist) => 
          p.id === playlistId 
            ? { ...p, songs: [...p.songs, ...addedSongs], totalDuration: p.totalDuration + totalDuration }
            : p
        );
        localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
        
        const updatedPlaylist = updatedPlaylists.find((p: Playlist) => p.id === playlistId);
        setPlaylist(updatedPlaylist);
      }
    } else if (!isNewPlaylist) {
      // Load existing playlist
      const existingPlaylists = JSON.parse(localStorage.getItem('playlists') || '[]');
      const foundPlaylist = existingPlaylists.find((p: Playlist) => p.id === playlistId);
      if (foundPlaylist) {
        setPlaylist(foundPlaylist);
        setPlaylistName(foundPlaylist.name);
      }
    }
  }, [location.state, playlistId, isNewPlaylist, playlistName]);

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) return;
    
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: playlistName,
      songs: [],
      totalDuration: 0
    };
    
    setPlaylist(newPlaylist);
    
    // Save to localStorage
    const existingPlaylists = JSON.parse(localStorage.getItem('playlists') || '[]');
    existingPlaylists.push(newPlaylist);
    localStorage.setItem('playlists', JSON.stringify(existingPlaylists));
  };

  const handleAddSongs = () => {
    const targetPlaylistId = playlist?.id || 'new';
    navigate('/library', { 
      state: { 
        selectionMode: true, 
        playlistId: targetPlaylistId,
        playlistName: playlistName 
      } 
    });
  };

  const handlePlayPlaylist = () => {
    if (playlist && playlist.songs.length > 0) {
      playFromContext(playlist.songs, 0, 'playlist');
    }
  };

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleSongSelect = (song: Song) => {
    if (playlist) {
      const songIndex = playlist.songs.findIndex(s => s.id === song.id);
      if (songIndex !== -1) {
        playFromContext(playlist.songs, songIndex, 'playlist');
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-40">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {isNewPlaylist ? 'Create Playlist' : 'Edit Playlist'}
            </h1>
          </div>

          {!playlist ? (
            <div className="space-y-4">
              <Input
                placeholder="Enter playlist name..."
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="text-lg"
              />
              <Button
                onClick={handleCreatePlaylist}
                disabled={!playlistName.trim()}
                className="w-full bg-gradient-primary text-primary-foreground"
              >
                Create Playlist
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">{playlist.name}</h2>
              <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
                <span>{playlist.songs.length} songs</span>
                <span>{formatDuration(playlist.totalDuration)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePlayPlaylist}
                  disabled={playlist.songs.length === 0}
                  className="flex items-center gap-2 bg-gradient-primary text-primary-foreground"
                >
                  <Play className="w-4 h-4" />
                  Play
                </Button>
                <Button
                  onClick={handleAddSongs}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Songs
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {playlist && playlist.songs.length > 0 ? (
          <div className="space-y-2">
            {playlist.songs.map((song, index) => (
              <div key={`${song.id}-${index}`} className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-8">{index + 1}</span>
                <div className="flex-1">
                  <SongCard
                    song={song}
                    isPlaying={isPlaying}
                    isCurrentSong={currentSong?.id === song.id}
                    onPlayPause={handlePlayPause}
                    onSelect={handleSongSelect}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : playlist ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No songs yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Add some songs to your playlist to get started.
            </p>
            <Button
              onClick={handleAddSongs}
              className="flex items-center gap-2 bg-gradient-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              Add Songs
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};