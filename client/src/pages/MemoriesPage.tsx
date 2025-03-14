import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Memory {
  id: number;
  title: string;
  date: string;
  description: string;
  imageSrc?: string;
  color: string;
}

// Initial memories list
const initialMemories: Memory[] = [
  {
    id: 1,
    title: "Our First Meeting",
    date: "2022-01-15",
    description: "The day our paths crossed for the first time at the downtown café. You were reading your favorite book.",
    color: "primary",
  },
  {
    id: 2,
    title: "First Hike Together",
    date: "2022-03-08",
    description: "We conquered the mountain trail and watched the sunrise from the peak. Your smile was brighter than the sun.",
    color: "secondary",
  },
  {
    id: 3,
    title: "Beach Vacation",
    date: "2022-07-22",
    description: "Our week at the beach, building sandcastles and watching the stars. We promised to return every year.",
    color: "accent",
  },
  {
    id: 4,
    title: "Concert Night",
    date: "2022-09-30",
    description: "Dancing under the lights at your favorite band's concert. The night we decided this would be \"our song.\"",
    color: "primary",
  }
];

const MemoriesPage = () => {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [newMemory, setNewMemory] = useState({
    title: "",
    date: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemory.title || !newMemory.date || !newMemory.description) return;
    
    const colors = ["primary", "secondary", "accent"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setMemories([
      ...memories,
      {
        id: Date.now(),
        title: newMemory.title,
        date: newMemory.date,
        description: newMemory.description,
        color: randomColor,
      },
    ]);
    
    // Reset form
    setNewMemory({
      title: "",
      date: "",
      description: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMemory({
      ...newMemory,
      [name]: value,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">Our Memories</h1>
        <p className="text-gray-600 mb-8">Special moments and milestones we've shared together.</p>
        
        {/* Timeline */}
        <div className="relative mb-20">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-primary/20 transform md:translate-x-[-0.5px]"></div>
          
          {/* Timeline Events */}
          <div className="space-y-12">
            {memories.map((memory, index) => (
              <div key={memory.id} className="relative flex flex-col md:flex-row">
                {index % 2 === 0 ? (
                  <>
                    <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                      <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                        <h3 className={`text-xl font-playfair font-bold text-${memory.color} mb-2`}>{memory.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{formatDate(memory.date)}</p>
                        <p className="text-gray-700">{memory.description}</p>
                      </div>
                    </div>
                    <div className={`absolute left-[-8px] md:left-1/2 top-4 md:top-6 w-4 h-4 rounded-full bg-${memory.color} border-4 border-white z-10 transform md:translate-x-[-8px]`}></div>
                    <div className="md:w-1/2 md:pl-12 md:mt-16">
                      <div className="w-full max-w-[14rem] h-56 rounded-lg shadow-md overflow-hidden mx-auto md:ml-0">
                        {memory.imageSrc ? (
                          <img src={memory.imageSrc} alt={memory.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <i className="ri-image-line text-4xl text-gray-400"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 order-last md:order-first md:mt-16">
                      <div className="w-full max-w-[14rem] h-56 rounded-lg shadow-md overflow-hidden mx-auto md:ml-auto">
                        {memory.imageSrc ? (
                          <img src={memory.imageSrc} alt={memory.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <i className="ri-image-line text-4xl text-gray-400"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`absolute left-[-8px] md:left-1/2 top-4 md:top-6 w-4 h-4 rounded-full bg-${memory.color} border-4 border-white z-10 transform md:translate-x-[-8px]`}></div>
                    <div className="md:w-1/2 md:pl-12 md:text-left">
                      <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                        <h3 className={`text-xl font-playfair font-bold text-${memory.color} mb-2`}>{memory.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{formatDate(memory.date)}</p>
                        <p className="text-gray-700">{memory.description}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Add memory form */}
        <div className="mt-20 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">Add a New Memory</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="title" className="block text-gray-700 mb-2">Title</Label>
              <Input 
                id="title" 
                name="title"
                value={newMemory.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="What's this memory called?"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="date" className="block text-gray-700 mb-2">Date</Label>
              <Input 
                type="date" 
                id="date" 
                name="date"
                value={newMemory.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="description" className="block text-gray-700 mb-2">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={newMemory.description}
                onChange={handleChange}
                rows={4} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="Tell me about this special memory..."
                required
              />
            </div>
            <div className="mb-6">
              <Label className="block text-gray-700 mb-2">Add Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <i className="ri-image-add-line text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">Drag and drop or click to upload</p>
                <input type="file" className="hidden" id="memory-photo" />
                <Button 
                  type="button" 
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById('memory-photo')?.click()}
                >
                  Select File
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-all"
            >
              Save This Memory
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemoriesPage;
