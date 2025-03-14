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
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element if it doesn't exist
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7; // Set volume to 70%
      
      // Setup event listeners
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log("Audio loaded successfully!");
        setIsLoaded(true);
        setAudioError(null);
      });
      
      audioRef.current.addEventListener('ended', () => {
        // Auto play next song when current one ends
        handleNextSong();
      });
      
      audioRef.current.addEventListener('error', (e) => {
        const error = e as ErrorEvent;
        console.warn("Error loading audio file:", error);
        setAudioError("Failed to load audio file. Please try again.");
        setIsLoaded(true); // Allow interaction even if audio fails to load
      });
    }
    
    // Cleanup function to remove event listeners
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

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
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.audioFiles || !Array.isArray(data.audioFiles)) {
          throw new Error('Expected audioFiles array in response');
        }
        
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
        setAudioError("Failed to load song list. Please reload the page.");
        setIsLoaded(true); // Allow interaction even if song list fails to load
      });
  }, []);

  // Load a song by URL
  const loadSong = (url: string) => {
    if (!audioRef.current) return;
    
    setIsLoaded(false);
    setAudioError(null);
    
    try {
      // If already playing, pause before changing song
      if (isPlaying) {
        audioRef.current.pause();
      }
      
      // First, test if the audio file is accessible
      fetch(url, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to access audio file: ${response.status}`);
          }
          
          // Update src and load if accessible
          audioRef.current!.src = url;
          audioRef.current!.load();
          
          // Set a timeout to make sure loading state shows for at least 500ms
          setTimeout(() => {
            // If it was playing, resume playing with new song
            if (isPlaying) {
              playCurrentSong();
            }
          }, 500);
        })
        .catch(error => {
          console.error("Error accessing audio file:", error);
          setAudioError("Can't access audio file. Please try again later.");
          setIsLoaded(true);
          
          // Try alternative direct audio loading as fallback
          const songFilename = url.split('/').pop();
          if (songFilename) {
            // Try with alternative URL pattern
            const alternativeUrl = `/attached_assets/${songFilename}`;
            console.log("Trying alternative URL:", alternativeUrl);
            
            audioRef.current!.src = alternativeUrl;
            audioRef.current!.load();
            
            // If it was playing, resume playing with new song
            if (isPlaying) {
              playCurrentSong();
            }
          }
        });
    } catch (err) {
      console.error("Error loading song:", err);
      setAudioError("Failed to load audio. Please try again.");
      setIsLoaded(true);
    }
  };

  // Play the current song
  const playCurrentSong = () => {
    if (!audioRef.current) return;
    
    setAudioError(null);
    
    try {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            setAudioError("Failed to play audio. Please try again.");
            setIsPlaying(false);
          });
      }
    } catch (err) {
      console.error("Exception playing audio:", err);
      setAudioError("Failed to play audio. Please try again.");
      setIsPlaying(false);
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
      
      {isExpanded && (
        <div className="p-3 max-h-48 overflow-y-auto">
          {audioError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-3">
              <p className="text-xs text-red-600">{audioError}</p>
              <button 
                className="text-xs text-primary mt-1 hover:underline"
                onClick={() => {
                  setAudioError(null);
                  if (songList.length > 0) {
                    loadSong(songList[currentSongIndex].url);
                  }
                }}
              >
                Try again
              </button>
            </div>
          )}
          
          {songList.length > 0 ? (
            <>
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
            </>
          ) : (
            <p className="text-xs text-gray-500 text-center py-3">
              No songs available. Please check your connection.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
