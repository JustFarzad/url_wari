import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import GalleryPage from "@/pages/GalleryPage";
import MemoriesPage from "@/pages/MemoriesPage";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import ImageModal from "./components/ImageModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    date?: string;
  } | null>(null);

  const openModal = (image: { src: string; title: string; date?: string }) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/gallery">
          <GalleryPage onImageClick={openModal} />
        </Route>
        <Route path="/memories" component={MemoriesPage} />
        <Route component={NotFound} />
      </Switch>
      <MusicPlayer />
      {isModalOpen && selectedImage && (
        <ImageModal
          image={selectedImage}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      <Toaster />
    </>
  );
}

export default App;
