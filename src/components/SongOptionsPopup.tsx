import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork?: string;
}

interface SongOptionsPopupProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlaylist: () => void;
  onDelete: () => void;
}

export const SongOptionsPopup: React.FC<SongOptionsPopupProps> = ({
  song,
  isOpen,
  onClose,
  onAddToPlaylist,
  onDelete
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-2xl border border-border p-6 m-4 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">{song.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Button
            onClick={onAddToPlaylist}
            className="w-full flex items-center gap-3 justify-start bg-gradient-primary text-primary-foreground hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add to Playlist
          </Button>
          
          <Button
            onClick={onDelete}
            variant="outline"
            className="w-full flex items-center gap-3 justify-start border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive"
          >
            <Trash2 className="w-5 h-5" />
            Delete Song
          </Button>
        </div>
      </div>
    </div>
  );
};