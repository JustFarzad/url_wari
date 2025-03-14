interface ImageModalProps {
  image: {
    src: string;
    title: string;
    date?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ image, isOpen, onClose }: ImageModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal when clicking outside the image container
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="max-w-5xl max-h-screen">
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="relative">
            <img 
              src={image.src} 
              alt={image.title} 
              className="max-h-[80vh] mx-auto"
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-md"
              aria-label="Close"
            >
              <i className="ri-close-line text-xl text-darkgray"></i>
            </button>
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-xl font-playfair font-medium text-darkgray">{image.title}</h3>
            {image.date && <p className="text-gray-500 text-sm">{image.date}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
