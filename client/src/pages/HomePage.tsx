import { Link } from "wouter";

const HomePage = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FFC2D1]/30 to-[#8C52FF]/10 py-16 md:py-32">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 leading-tight mb-4">
              For <span className="text-primary">Warisha</span>, <br />
              With Love
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              A digital space to celebrate our memories and moments together.
            </p>
            <Link 
              href="/gallery" 
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full transition-all shadow-md"
            >
              View Our Gallery
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-64 h-80 md:w-80 md:h-96 rounded-lg shadow-xl overflow-hidden relative mx-auto rotate-3 animate-float">
              <img 
                src="/images/wari.jpg" 
                alt="Warisha" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 w-48 h-64 rounded-lg shadow-xl overflow-hidden rotate-[-5deg] hidden md:block">
              <img 
                src="/images/wari2.jpg" 
                alt="Warisha Portrait" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-16">Our Digital Love Story</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link to="/gallery" className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#FFC2D1]/20 rounded-full flex items-center justify-center">
                <i className="ri-gallery-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-playfair font-bold mb-4">Photo Gallery</h3>
              <p className="text-gray-600">A collection of our favorite moments captured in time.</p>
              <span className="inline-block mt-4 text-primary">Explore Gallery →</span>
            </Link>
            
            {/* Feature 2 */}
            <Link to="/collectibles" className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#8C52FF]/20 rounded-full flex items-center justify-center">
                <i className="ri-heart-3-line text-2xl text-[#8C52FF]"></i>
              </div>
              <h3 className="text-xl font-playfair font-bold mb-4">Collectibles</h3>
              <p className="text-gray-600">Special items and treasures we've collected and cherished.</p>
              <span className="inline-block mt-4 text-[#8C52FF]">View Collection →</span>
            </Link>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#66C7F4]/20 rounded-full flex items-center justify-center">
                <i className="ri-music-2-line text-2xl text-[#66C7F4]"></i>
              </div>
              <h3 className="text-xl font-playfair font-bold mb-4">Our Soundtrack</h3>
              <p className="text-gray-600">Listen to our special song while browsing our memories.</p>
              <button 
                className="inline-block mt-4 text-[#66C7F4]"
                onClick={() => {
                  // Find the audio element and play/pause it
                  const musicButton = document.querySelector('#music-player button');
                  if (musicButton) {
                    // Programmatically click the music player button
                    (musicButton as HTMLButtonElement).click();
                    
                    // Scroll to the music player to highlight it
                    const musicPlayer = document.getElementById('music-player');
                    if (musicPlayer) {
                      musicPlayer.classList.add('animate-bounce');
                      setTimeout(() => {
                        musicPlayer?.classList.remove('animate-bounce');
                      }, 1000);
                    }
                  }
                }}
              >
                Play Music →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-gradient-to-r from-[#8C52FF]/5 to-[#FF6B8B]/5">
        <div className="container mx-auto px-4 text-center">
          <i className="ri-double-quotes-l text-5xl text-primary/30 mb-6 inline-block"></i>
          <blockquote className="text-2xl md:text-3xl font-playfair italic text-gray-700 max-w-3xl mx-auto mb-8">
            "Every moment spent with you becomes a beautiful memory I cherish forever."
          </blockquote>
          <div className="h-1 w-24 bg-primary/30 mx-auto"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
