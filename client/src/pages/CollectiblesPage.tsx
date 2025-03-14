import React from 'react';
import { Badge } from "@/components/ui/badge";

const CollectiblesPage = () => {
  // Collection categories
  const categories = [
    { id: 1, name: "Keychains", count: 3, color: "primary" },
    { id: 2, name: "Bracelets", count: 2, color: "secondary" },
    { id: 3, name: "Digital Media", count: 5, color: "accent" },
    { id: 4, name: "Gaming", count: 3, color: "primary" },
    { id: 5, name: "Accessories", count: 2, color: "secondary" },
  ];

  // Featured collectibles
  const featuredCollectibles = [
    {
      id: 1,
      name: "Batman LEGO Keychain",
      description: "LEGO Batman figure keychain with detailed costume",
      category: "Keychains",
      imageSrc: "/placeholder-image.svg"
    },
    {
      id: 2,
      name: "Spider-Man Bracelet",
      description: "Red and black braided bracelet with Spider-Man logo",
      category: "Bracelets",
      imageSrc: "/placeholder-image.svg"
    },
    {
      id: 3,
      name: "Starbucks Bear Charm",
      description: "Starbucks bear barista collectible charm",
      category: "Keychains",
      imageSrc: "/placeholder-image.svg"
    },
    {
      id: 4,
      name: "Brookhaven Characters",
      description: "Digital collectible from the Brookhaven game",
      category: "Gaming",
      imageSrc: "/placeholder-image.svg"
    },
    {
      id: 5,
      name: "W Ring",
      description: "Stylish W letter ring in dark gray",
      category: "Accessories",
      imageSrc: "/placeholder-image.svg"
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">My Collectibles</h1>
        <p className="text-gray-600 mb-8">A showcase of the special items I've collected over time.</p>
        
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-playfair font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Badge 
                key={category.id} 
                variant="outline" 
                className={`px-4 py-2 bg-${category.color}/10 hover:bg-${category.color}/20 cursor-pointer transition-all`}
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Featured collectibles */}
        <div>
          <h2 className="text-2xl font-playfair font-semibold mb-6">Featured Collectibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCollectibles.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover-grow">
                <div className="h-48 bg-gray-100">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <i className="ri-image-line text-4xl text-gray-400"></i>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                  <Badge className="mb-2">{item.category}</Badge>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Wishlist */}
        <div className="mt-16">
          <h2 className="text-2xl font-playfair font-semibold mb-6">Collectible Wishlist</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="list-disc ml-6 space-y-2">
              <li className="text-gray-700">Limited Edition Spider-Man Figure</li>
              <li className="text-gray-700">My Hero Academia Collector's Edition</li>
              <li className="text-gray-700">Rare Starbucks Collection Bears</li>
              <li className="text-gray-700">Digital NFT Art Collection</li>
              <li className="text-gray-700">Matching Couple Keychains</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectiblesPage;