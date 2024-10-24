import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  isScrolled: boolean;
}
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="relative py-4"> {/* Removed sticky positioning */}
      {/* Mobile view */}
      <div className="md:hidden px-4">
        <button
          onClick={toggleMenu}
          className="w-full py-3 px-5 flex justify-between items-center bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          <span className="font-semibold">{activeCategory || "Todas las Categorías"}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute w-full left-0 mt-2 rounded-lg overflow-hidden shadow-lg bg-white z-20"
            >
              <button
                className={`w-full py-3 px-5 text-left font-medium ${
                  !activeCategory
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-700"
                } hover:bg-opacity-90 transition-colors duration-200`}
                onClick={() => handleCategoryClick(null)}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`w-full py-3 px-5 text-left font-medium ${
                    activeCategory === category
                      ? "bg-gray-100 text-gray-900"
                      : "bg-white text-gray-700"
                  } hover:bg-opacity-90 transition-colors duration-200`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop view */}
      <motion.div
        className="hidden md:flex justify-center flex-wrap gap-2 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            !activeCategory
              ? "bg-gray-900 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveCategory(null)}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeCategory === category
                ? "bg-gray-900 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryFilter;