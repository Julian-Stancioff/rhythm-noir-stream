import React from 'react';
import { X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface PlaylistSelectorPopupProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
  onSelectPlaylist: (playlistId: string) => void;
  playlists: Playlist[];
}

export const PlaylistSelectorPopup: React.FC<PlaylistSelectorPopupProps> = ({
  song,
  isOpen,
  onClose,
  onSelectPlaylist,
  playlists
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-2xl border border-border p-6 m-4 w-full max-w-sm max-h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Add to Playlist</h3>
            <p className="text-sm text-muted-foreground truncate">{song.title}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <Button
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist.id)}
                variant="outline"
                className="w-full flex items-center gap-3 justify-start p-4 h-auto hover:bg-primary/5 hover:border-primary/20"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{playlist.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {playlist.songs.length} songs
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No playlists available</p>
              <p className="text-sm text-muted-foreground mt-1">Create a playlist first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};