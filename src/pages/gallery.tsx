import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import useCombinedContentfulData from "@/hooks/useCombinedContentfulData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentItem } from "@/types/PortfolioContentFulTypes";
import Navbar from "@components/Navbar/Navbar";
import CategoryFilter from "@components/ui/CategoryFilter";
import MediaTypeFilter from "@components/ui/MediaTypeFilter";
import GalleryGrid from "@components/ui/GalleryGrid";
import Lightbox from "@components/ui/Lightbox";

const GalleryPage: React.FC = () => {
  const { theme } = useTheme();
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeMediaType, setActiveMediaType] = useState<"all" | "images" | "videos">("all");
  const { combinedData, loading, error } = useCombinedContentfulData();
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = Array.from(
    new Set(combinedData.map((img: ContentItem) => img.category))
  );

  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  const filteredData = combinedData.filter((item: ContentItem) => {
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const matchesMediaType = activeMediaType === "all" ||
      (activeMediaType === "videos" && isVideo(item.fields?.file?.url || "")) ||
      (activeMediaType === "images" && !isVideo(item.fields?.file?.url || ""));
    return matchesCategory && matchesMediaType;
  });

  const openLightbox = (index: number) => setCurrentImage(index);
  
  const closeLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setCurrentImage(null);
      setIsClosing(false);
    }, 500);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-b from-black via-blue-950 to-gray-900" : "bg-gradient-to-b from-gray-50 to-white"} text-gray-900 dark:text-gray-100 transition-colors duration-500`}>
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <AnimatePresence>
          <motion.h1
            className="text-6xl font-bold mb-16 text-center tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white hidden md:block"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Galería de Maquillaje
          </motion.h1>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            isScrolled={isScrolled}
            theme={theme}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <MediaTypeFilter
            activeMediaType={activeMediaType}
            setActiveMediaType={setActiveMediaType}
            theme={theme}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <GalleryGrid
            filteredData={filteredData}
            loading={loading}
            openLightbox={openLightbox}
            theme={theme}
          />
        </motion.div>

        <Lightbox
          currentImage={currentImage}
          filteredData={filteredData}
          closeLightbox={closeLightbox}
          isClosing={isClosing}
          nextImage={() => setCurrentImage((prev) => (prev === null ? 0 : (prev + 1) % filteredData.length))}
          prevImage={() => setCurrentImage((prev) => (prev === null ? 0 : (prev - 1 + filteredData.length) % filteredData.length))}
        />
      </div>
    </div>
  );
};

const GalleryWithThemeProvider: React.FC = () => (
  <ThemeProvider>
    <GalleryPage />
  </ThemeProvider>
);

export default GalleryWithThemeProvider;