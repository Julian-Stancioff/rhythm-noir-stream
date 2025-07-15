import React from 'react';
import { Home, Search, Upload, Library, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'upload', label: 'Upload', icon: Upload, path: '/upload' },
  { id: 'library', label: 'Library', icon: Library, path: '/library' },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-screen-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                        }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200
                            ${isActive ? 'bg-primary/20 shadow-glow' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'animate-scale-in' : ''}`} />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};