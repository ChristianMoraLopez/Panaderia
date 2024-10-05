import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MediaTypeFilterProps {
  activeMediaType: "all" | "images" | "videos";
  setActiveMediaType: (type: "all" | "images" | "videos") => void;
  theme: string;
}

const MediaTypeFilter: React.FC<MediaTypeFilterProps> = ({
  activeMediaType,
  setActiveMediaType,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMediaTypeClick = (type: "all" | "images" | "videos") => {
    setActiveMediaType(type);
    setIsOpen(false);
  };

  const getDisplayText = (type: "all" | "images" | "videos") => {
    switch (type) {
      case "all":
        return "Todos";
      case "images":
        return "Imágenes";
      case "videos":
        return "Videos";
    }
  };

  return (
    <div className="mb-8 px-4">
      {/* Mobile view */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className={`w-full py-3 px-5 flex justify-between items-center ${
            theme === "dark" 
              ? "bg-gray-800 text-white border border-gray-700" 
              : "bg-white text-gray-900 border border-gray-200"
          } rounded-lg shadow-sm hover:shadow-md transition-all duration-300`}
        >
          <span className="font-semibold">{getDisplayText(activeMediaType)}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 rounded-lg overflow-hidden shadow-lg"
            >
              {(["all", "images", "videos"] as const).map((type) => (
                <button
                  key={type}
                  className={`w-full py-3 px-5 text-left font-medium ${
                    activeMediaType === type
                      ? theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-900"
                      : theme === "dark"
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-700"
                  } hover:bg-opacity-90 transition-colors duration-200`}
                  onClick={() => handleMediaTypeClick(type)}
                >
                  {getDisplayText(type)}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop view */}
      <motion.div
        className="hidden md:flex justify-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {(["all", "images", "videos"] as const).map((type) => (
          <button
            key={type}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeMediaType === type
                ? `${theme === "dark" ? "bg-white text-gray-900" : "bg-gray-900 text-white"} shadow-md hover:shadow-lg transform hover:-translate-y-1`
                : theme === "dark"
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveMediaType(type)}
          >
            {getDisplayText(type)}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default MediaTypeFilter;