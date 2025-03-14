import { useRef } from "react";

// Placeholder gallery items - these will be replaced with real images
const galleryItems = Array(20).fill(null).map((_, index) => ({
  id: index + 1,
  title: `Photo ${index + 1}`,
  src: "",
}));

interface GalleryPageProps {
  onImageClick: (image: { src: string; title: string }) => void;
}

const GalleryPage = ({ onImageClick }: GalleryPageProps) => {
  // Reference to keep track of double-click timing
  const clickTimerRef = useRef<number | null>(null);

  const handleImageClick = (image: { src: string; title: string }) => {
    // If there's no src (placeholder), don't open modal
    if (!image.src) return;
    
    // Check if this is a double click
    if (clickTimerRef.current) {
      // Double click detected
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      onImageClick(image);
    } else {
      // First click - set timer
      clickTimerRef.current = window.setTimeout(() => {
        // Single click actions would go here
        clickTimerRef.current = null;
      }, 300); // 300ms threshold for double-click
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">Our Gallery</h1>
        <p className="text-gray-600 mb-8">A collection of our favorite moments together.</p>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              className="relative bg-white rounded-lg overflow-hidden shadow-md hover-grow cursor-pointer"
              onClick={() => handleImageClick({
                src: item.src || "/placeholder-image.svg", // Use real image or placeholder
                title: item.title
              })}
              onDoubleClick={() => {
                if (clickTimerRef.current) {
                  clearTimeout(clickTimerRef.current);
                  clickTimerRef.current = null;
                }
                onImageClick({
                  src: item.src || "/placeholder-image.svg",
                  title: item.title
                });
              }}
            >
              {item.src ? (
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full aspect-[3/4] object-cover"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <i className="ri-image-add-line text-4xl text-gray-400"></i>
                    <p className="text-gray-500 text-sm mt-2">Add Your Photo</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
