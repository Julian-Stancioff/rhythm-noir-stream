import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Library } from "./pages/Library";
import { NowPlaying } from "./pages/NowPlaying";
import { Upload } from "./pages/Upload";
import { PlaylistEditor } from "./pages/PlaylistEditor";
import { BottomNavigation } from "./components/BottomNavigation";
import { MiniPlayer } from "./components/MiniPlayer";
import { MusicProvider } from "./contexts/MusicContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/now-playing" element={<NowPlaying />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/playlist/new" element={<PlaylistEditor />} />
              <Route path="/playlist/:playlistId" element={<PlaylistEditor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MiniPlayer />
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </MusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
