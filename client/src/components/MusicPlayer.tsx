import { useState, useEffect, useRef } from "react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/blue.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7; // Set volume to 70%
    
    // Handle audio loading success
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });
    
    // Handle audio loading errors
    audioRef.current.addEventListener('error', (e) => {
      console.warn("Error loading audio file:", e);
      // Keep the player functional even if audio fails to load
    });
    
    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to toggle music play/pause
  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Create a user interaction promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            // Fallback for autoplay restrictions
            setIsPlaying(false);
          });
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      id="music-player"
      className="fixed bottom-5 right-5 z-40 bg-white/90 backdrop-blur-md shadow-lg rounded-full p-3 flex items-center gap-3 border border-gray-200 transition-all hover:shadow-xl"
    >
      <div className="hidden md:flex items-center gap-2">
        <div className={`w-8 h-8 bg-primary rounded-full flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
          <i className="ri-music-fill text-white"></i>
        </div>
        <div>
          <p className="text-xs font-medium">Yung Kai</p>
          <p className="text-xs text-gray-500">Blue</p>
        </div>
      </div>
      <button 
        onClick={toggleMusic} 
        disabled={!isLoaded}
        className={`w-10 h-10 ${isLoaded ? 'bg-primary hover:bg-primary/80' : 'bg-gray-400'} rounded-full flex items-center justify-center transition-all`}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {!isLoaded ? (
          <i className="ri-loader-2-fill animate-spin text-white text-xl"></i>
        ) : (
          <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill text-white text-xl`}></i>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
