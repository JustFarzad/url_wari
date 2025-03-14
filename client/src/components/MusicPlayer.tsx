import { useState, useEffect, useRef } from "react";

interface Song {
  title: string;
  artist: string;
  filename: string;
  url: string;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [songList, setSongList] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse song name to get artist and title
  const parseSongName = (filename: string): { artist: string; title: string } => {
    // Try to extract artist and title based on the common format "Artist - Title.mp3"
    const parts = filename.replace('.mp3', '').split(' - ');
    
    if (parts.length >= 2) {
      return {
        artist: parts[0].trim(),
        title: parts.slice(1).join(' - ').trim()
      };
    }
    
    // Fallback if no dash is found
    return {
      artist: "Unknown Artist",
      title: filename.replace('.mp3', '')
    };
  };

  // Fetch the list of available songs
  useEffect(() => {
    fetch('/api/audio-files')
      .then(response => response.json())
      .then(data => {
        const songs = data.audioFiles.map((song: any) => {
          const { artist, title } = parseSongName(song.filename);
          return {
            ...song,
            artist,
            title
          };
        });
        
        console.log("Available songs:", songs);
        setSongList(songs);
        
        // Start loading the first song
        if (songs.length > 0) {
          loadSong(songs[0].url);
        }
      })
      .catch(error => {
        console.error("Error fetching song list:", error);
        setIsLoaded(true); // Allow interaction even if song list fails to load
      });
  }, []);

  // Load a song by URL
  const loadSong = (url: string) => {
    if (audioRef.current) {
      // If already playing, pause before changing song
      if (isPlaying) {
        audioRef.current.pause();
      }
      
      // Create new audio element or update existing one
      audioRef.current.src = url;
      audioRef.current.load();
      
      // If it was playing, resume playing with new song
      if (isPlaying) {
        playCurrentSong();
      }
    } else {
      // Initialize audio element if it doesn't exist
      audioRef.current = new Audio(url);
      audioRef.current.volume = 0.7; // Set volume to 70%
      
      // Setup event listeners
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log("Audio loaded successfully!");
        setIsLoaded(true);
      });
      
      audioRef.current.addEventListener('ended', () => {
        // Auto play next song when current one ends
        handleNextSong();
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.warn("Error loading audio file:", e);
        setIsLoaded(true); // Allow interaction even if audio fails to load
      });
    }
  };

  // Play the current song
  const playCurrentSong = () => {
    if (!audioRef.current) return;
    
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playback started successfully
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    }
  };

  // Toggle play/pause
  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playCurrentSong();
    }
  };

  // Handle next song
  const handleNextSong = () => {
    if (songList.length === 0) return;
    
    const nextIndex = (currentSongIndex + 1) % songList.length;
    setCurrentSongIndex(nextIndex);
    loadSong(songList[nextIndex].url);
  };

  // Handle previous song
  const handlePrevSong = () => {
    if (songList.length === 0) return;
    
    const prevIndex = (currentSongIndex - 1 + songList.length) % songList.length;
    setCurrentSongIndex(prevIndex);
    loadSong(songList[prevIndex].url);
  };

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Current song information
  const currentSong = songList[currentSongIndex] || { title: "Loading...", artist: "Please wait", filename: "" };

  return (
    <div 
      id="music-player"
      className={`fixed bottom-5 right-5 z-40 bg-white/90 backdrop-blur-md shadow-lg ${isExpanded ? 'rounded-xl' : 'rounded-full'} 
        transition-all hover:shadow-xl border border-gray-200 overflow-hidden`}
    >
      <div className={`p-3 flex items-center gap-3 ${isExpanded ? 'border-b border-gray-200' : ''}`}>
        <button 
          onClick={toggleExpanded}
          className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label={isExpanded ? "Collapse player" : "Expand player"}
        >
          <i className={`ri-${isExpanded ? 'arrow-down-s-line' : 'arrow-up-s-line'} text-gray-600`}></i>
        </button>
        
        <div className={`flex items-center gap-2 ${isExpanded ? 'flex-1' : 'hidden md:flex'}`}>
          <div className={`w-8 h-8 bg-primary rounded-full flex-shrink-0 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
            <i className="ri-music-fill text-white"></i>
          </div>
          <div className="truncate">
            <p className="text-xs font-medium truncate">{currentSong.artist}</p>
            <p className="text-xs text-gray-500 truncate">{currentSong.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isExpanded && (
            <button 
              onClick={handlePrevSong}
              disabled={!isLoaded || songList.length <= 1}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Previous song"
            >
              <i className="ri-skip-back-fill text-primary text-lg"></i>
            </button>
          )}
          
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
          
          {isExpanded && (
            <button 
              onClick={handleNextSong}
              disabled={!isLoaded || songList.length <= 1}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Next song"
            >
              <i className="ri-skip-forward-fill text-primary text-lg"></i>
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && songList.length > 0 && (
        <div className="p-3 max-h-48 overflow-y-auto">
          <p className="text-xs font-medium text-gray-500 mb-2">PLAYLIST</p>
          <ul className="space-y-2">
            {songList.map((song, index) => (
              <li 
                key={song.filename} 
                className={`text-xs p-2 rounded-md cursor-pointer flex items-center gap-2 ${currentSongIndex === index ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setCurrentSongIndex(index);
                  loadSong(song.url);
                  if (!isPlaying) {
                    playCurrentSong();
                  }
                }}
              >
                {currentSongIndex === index && isPlaying ? (
                  <i className="ri-volume-up-line text-primary"></i>
                ) : (
                  <i className="ri-music-2-line text-gray-400"></i>
                )}
                <div className="flex-1 truncate">
                  <span className="font-medium block truncate">{song.title}</span>
                  <span className="text-gray-500 block truncate">{song.artist}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
