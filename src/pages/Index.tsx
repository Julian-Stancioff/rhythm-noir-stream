import React from 'react';
import { Music, Play, Upload, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/music-hero.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative w-full max-w-md mb-8">
          <img 
            src={heroImage} 
            alt="Music Waveform" 
            className="w-full h-48 object-cover rounded-2xl shadow-glow opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
        </div>
        
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Music,
            <span className="text-primary"> Reimagined</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-sm">
            Experience your favorite tracks with premium sound quality and intuitive controls
          </p>
        </div>

        <div className="space-y-4 w-full max-w-sm animate-scale-in">
          <Link
            to="/library"
            className="w-full flex items-center justify-center gap-3 py-4 px-6 
                     bg-gradient-primary text-primary-foreground rounded-xl 
                     shadow-glow hover:shadow-glow hover:scale-105 
                     transition-all duration-200 font-semibold"
          >
            <Music className="w-5 h-5" />
            Enter Your Library
          </Link>
          
          <Link
            to="/upload"
            className="w-full flex items-center justify-center gap-3 py-4 px-6 
                     bg-card border border-border text-foreground rounded-xl 
                     hover:bg-card/80 hover:scale-105 
                     transition-all duration-200 font-medium"
          >
            <Upload className="w-5 h-5" />
            Upload Music
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 max-w-xs opacity-60">
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Play className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">High Quality</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Headphones className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Premium Audio</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Music className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Your Collection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
