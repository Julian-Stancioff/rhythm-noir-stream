import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search your music...",
  className = ''
}) => {
  const clearSearch = () => onChange('');

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-12 bg-input border border-border rounded-xl 
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   transition-all duration-200 ease-out"
        />
        
        {value && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 
                     text-muted-foreground hover:text-foreground 
                     transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Focus glow effect */}
      <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 pointer-events-none 
                    transition-opacity duration-200 peer-focus:opacity-100" />
    </div>
  );
};