import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function dirname(filePath: string) {
  return path.dirname(filePath);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple API route for checking server status
  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok", message: "For Warisha" });
  });

  // Serve the audio file with multiple paths for redundancy
  app.get("/blue.mp3", (_req, res) => {
    const filePath = path.join(__dirname, "..", "client", "public", "blue.mp3");
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "audio/mpeg");
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(404).send("Audio file not found");
    }
  });
  
  // Serve all audio files from the attached_assets directory
  app.get("/api/audio/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "..", "attached_assets", filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      console.log("Serving audio file from:", filePath);
      
      // Set appropriate headers for media streaming
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("Access-Control-Allow-Origin", "*");
      
      // Get file stats to set content length
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      // Simpler approach: just send the whole file regardless of range
      res.setHeader("Content-Length", fileSize);
      fs.createReadStream(filePath).pipe(res);
    } else {
      console.error("Audio file not found at path:", filePath);
      res.status(404).send("Audio file not found");
    }
  });
  
  // Get list of available audio files
  app.get("/api/audio-files", (_req, res) => {
    const directoryPath = path.join(__dirname, "..", "attached_assets");
    
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading audio directory:", err);
        return res.status(500).send("Error reading audio directory");
      }
      
      // Filter only the specific mp3 files we want and ensure they're not empty files
      const allowedSongs = [
        "Lovers Rock - TV Girl.mp3",
        "yung kai - blue (official music video) - yung kai.mp3",
        "Disco - Surf Curse.mp3",
        "east side - Lyn Lapid.mp3",
        "Flaming Hot Cheetos - Clairo.mp3",
        "Heavy - The Marías.mp3",
        "Meddle About - Chase Atlantic.mp3",
        "No One Noticed - The Marías.mp3",
        "R U Mine_ - Arctic Monkeys.mp3",
        "Shut up my moms calling.mp3",
        "SpotiDownloader.com - Louise - TV Girl.mp3",
        "Why'd You Only Call Me When You're High.mp3"
      ];
      
      const filteredFiles = files.filter(file => {
        // Check if file is in allowed list
        if (!allowedSongs.includes(file)) return false;
        
        // Check if file is not empty
        try {
          const stats = fs.statSync(path.join(directoryPath, file));
          return stats.size > 0;
        } catch (error) {
          console.error(`Error checking file size for ${file}:`, error);
          return false;
        }
      });
      
      res.json({
        audioFiles: filteredFiles.map(filename => {
          // Parse the filename to get a cleaner title and artist
          let title = filename.replace('.mp3', '');
          let artist = "Unknown Artist";
          
          if (title.includes(" - ")) {
            const parts = title.split(" - ");
            // Swap artist and title for correct display
            title = parts[0].trim();
            artist = parts.slice(1).join(" - ").trim();
            
            // Special case for filenames with additional info after artist
            if (artist.includes(" (") || artist.includes(" [")) {
              const artistParts = artist.split(/[ \(|\[]/);
              artist = artistParts[0].trim();
            }
          }
          
          // Special cases
          if (filename.includes("SpotiDownloader.com")) {
            title = title.replace("SpotiDownloader.com - ", "");
          }
          
          if (filename === "R U Mine_ - Arctic Monkeys.mp3") {
            title = "R U Mine?";
            artist = "Arctic Monkeys";
          }
          
          if (filename === "Shut up my moms calling.mp3") {
            artist = "Hotel Ugly";
          }
          
          return {
            filename,
            title,
            artist,
            url: `/api/audio/${encodeURIComponent(filename)}`
          };
        })
      });
    });
  });

  // Create a placeholder image SVG endpoint
  app.get("/placeholder-image.svg", (_req, res) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
      <rect width="300" height="400" fill="#f1f5f9" />
      <text x="150" y="200" font-family="Arial" font-size="20" text-anchor="middle" fill="#94a3b8">Add Photo</text>
      <path d="M150,130 C134.5,130 122,142.5 122,158 C122,173.5 134.5,186 150,186 C165.5,186 178,173.5 178,158 C178,142.5 165.5,130 150,130 Z M150,176 C140,176 132,168 132,158 C132,148 140,140 150,140 C160,140 168,148 168,158 C168,168 160,176 150,176 Z M194,270 L106,270 L106,258 C106,227.7 130.7,203 161,203 L139,203 C169.3,203 194,227.7 194,258 L194,270 Z" fill="#94a3b8" />
    </svg>`;
    
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  });

  // Create a heart icon SVG endpoint
  app.get("/heart.svg", (_req, res) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#FF6B8B" stroke="#FF6B8B"/>
    </svg>`;
    
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  });
  
  // Direct route to serve files from attached_assets (as a fallback)
  app.use('/attached_assets', (req, res, next) => {
    const filePath = path.join(__dirname, "..", "attached_assets", req.path);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      console.log("Serving asset file from:", filePath);
      
      // Set appropriate content type based on extension
      if (filePath.endsWith('.mp3')) {
        res.setHeader("Content-Type", "audio/mpeg");
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (filePath.endsWith('.png')) {
        res.setHeader("Content-Type", "image/png");
      }
      
      // CORS and caching headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=3600");
      
      // Send the file
      res.sendFile(filePath);
    } else {
      next();
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
