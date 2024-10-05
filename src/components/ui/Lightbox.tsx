import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Loader, Maximize2, Minimize2 } from "lucide-react";
import { ContentItem } from "@/types/PortfolioContentFulTypes";

interface LightboxProps {
  currentImage: number | null;
  filteredData: ContentItem[];
  closeLightbox: () => void;
  isClosing: boolean;
  nextImage: () => void;
  prevImage: () => void;
}

const isVideo = (url: string) => {
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
};

const Lightbox: React.FC<LightboxProps> = ({
  currentImage,
  filteredData,
  closeLightbox,
  isClosing,
  nextImage,
  prevImage,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  return (
    <AnimatePresence>
      {currentImage !== null && filteredData[currentImage] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 pointer-events-none z-20" // Añadido z-20
              >
                <motion.button
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-300 pointer-events-auto z-30" // Añadido z-30
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={36} />
                </motion.button>
                <motion.button
                  onClick={prevImage}
                  className="absolute left-4 md:left-6 top-1/2  text-white hover:text-gray-300 transition-colors duration-300 pointer-events-auto z-30" // Añadido z-30 y ajustado left
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={40} className="md:hidden" /> {/* Tamaño reducido en móviles */}
                  <ChevronLeft size={56} className="hidden md:block" /> {/* Tamaño completo en desktops */}
                </motion.button>
                <motion.button
                  onClick={nextImage}
                  className="absolute right-4 md:right-6 top-1/2  text-white hover:text-gray-300 transition-colors duration-300 pointer-events-auto z-30" // Añadido z-30 y ajustado right
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={40} className="md:hidden" /> {/* Tamaño reducido en móviles */}
                  <ChevronRight size={56} className="hidden md:block" /> {/* Tamaño completo en desktops */}
                </motion.button>
                <motion.button
                  onClick={toggleFullscreen}
                  className="absolute top-6 left-6 text-white hover:text-gray-300 transition-colors duration-300 pointer-events-auto z-30" // Añadido z-30
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isFullscreen ? <Minimize2 size={36} /> : <Maximize2 size={36} />}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-[90vw] h-[90vh] z-10" 
            >
            {isClosing ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-16 h-16 text-white animate-spin" />
              </div>
            ) : (
              <>
                {isVideo(filteredData[currentImage].fields?.file?.url || "") ? (
                  <video
                    src={`https:${filteredData[currentImage].fields?.file?.url}`}
                    className="w-full h-full object-contain z-10 pointer-events-none" 
                    controls
                    autoPlay
                    loop
                  />
                ) : (
                  <Image
                    src={`https:${filteredData[currentImage].fields?.file?.url}`}
                    alt={filteredData[currentImage].fields?.description?.toString() || "Default image description"}
                    layout="fill"
                    objectFit="contain"
                    className="transition-all duration-300 ease-in-out z-10 pointer-events-none" // Añadido z-10 y pointer-events-none
                  />
                )}
              </>
            )}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-6 left-6 right-6 bg-gradient-to-t from-black via-black to-transparent text-white p-6 rounded-xl backdrop-blur-sm z-20" // Añadido z-20
                >
                  <h3 className="text-2xl font-bold mb-3">
                    {typeof filteredData[currentImage].fields?.title === "string"
                      ? filteredData[currentImage].fields.title
                      : "Untitled"}
                  </h3>
                  <p className="text-lg">
                    {typeof filteredData[currentImage].fields?.description === "string"
                      ? filteredData[currentImage].fields.description
                      : "No description available"}
                  </p>
                  {isVideo(filteredData[currentImage].fields?.file?.url || "") && (
                    <span className="inline-block bg-red-600 text-white px-2 py-1 rounded-full text-sm mt-2">
                      Video
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
