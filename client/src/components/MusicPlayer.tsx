import { useState, useEffect, useRef } from "react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Use the API endpoint directly which has been confirmed working in the server logs
    audioRef.current = new Audio("/api/blue-audio");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7; // Set volume to 70%
    
    console.log("Loading audio directly from API endpoint");
    
    // Force setting loaded to true after a brief delay
    // This ensures the player is interactive even if the audio is still loading
    const loadingTimer = setTimeout(() => {
      setIsLoaded(true);
      console.log("Audio player ready to use");
    }, 2000);
    
    // Handle audio loading success
    audioRef.current.addEventListener('canplaythrough', () => {
      console.log("Audio loaded successfully!");
      setIsLoaded(true);
      clearTimeout(loadingTimer);
    });
    
    // Handle audio loading errors
    audioRef.current.addEventListener('error', (e) => {
      console.warn("Error loading audio file:", e);
      // Show the player anyway so user can still interact with it
      setIsLoaded(true);
    });
    
    // Clean up
    return () => {
      clearTimeout(loadingTimer);
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
