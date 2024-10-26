import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Image from "next/image";

// Animation variants
const dotVariants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Types definitions
type Language = "es" | "en";

interface BeevsSection {
  title: string;
  description1: string;
  description2: string;
  description3: string;
  highlight: string;
}

interface TranslationContent {
  beevsSection: BeevsSection;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  learnMore: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  values2: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  slider: {
    title: string;
    subtitle: string;
  };
}

interface Translations {
  es: TranslationContent;
  en: TranslationContent;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: BeevsSection;
  language: Language;
}

interface StorySectionProps {
  translations: Translations;
  language: Language;
}

const StoryModal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const descriptions = [
    content.description1,
    content.description2,
    content.description3,
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed inset-4 md:inset-x-20 md:inset-y-10 bg-gradient-to-br from-[#8D4C91] to-[#6a3b6d] rounded-2xl p-6 md:p-8 z-50 overflow-y-auto shadow-2xl"
          >
            {/* Animated sparkles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: ["0%", "-100%"],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "100%",
                  }}
                >
                  <Sparkles className="text-white/20" size={24} />
                </motion.div>
              ))}
            </div>

            {/* Animated dots */}
            <div className="absolute top-8 right-8 flex flex-col gap-4 z-20">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={dotVariants}
                  animate="animate"
                  transition={{ delay: i * 0.5 }}
                  className={`w-4 h-4 rounded-full ${
                    i === 0
                      ? "bg-[#f1bfb5]"
                      : i === 1
                      ? "bg-[#d1d451]"
                      : "bg-[#b0c4cc]"
                  }`}
                />
              ))}
            </div>
                 {/* Background Image */}
          <div className="absolute bottom-0 left-0 w-1/3 h-auto -z-10">
            <Image
              src="/images/SVG/LogoOnWhite.svg"
              alt="Background"
              width={400}
                height={400}
              layout="responsive"
              objectFit="contain"
              className="opacity-10"
            />
          </div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm"
            >
              <X size={24} />
            </motion.button>

            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto space-y-8 text-white relative z-10"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-[#D9D055] title-font mb-6 tracking-tight"
              >
                {content.title}
              </motion.h2>

              <div className="space-y-8">
                {descriptions.map((description, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`transform transition-all duration-500 ${
                      activeIndex === index
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-70"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/15 transition-colors cursor-pointer border border-white/5 shadow-xl">
                      <p className="text-lg leading-relaxed body-font">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Decorative gradient orbs */}
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#D9D055] rounded-full blur-3xl opacity-20" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f1bfb5] rounded-full blur-3xl opacity-20" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const StorySection: React.FC<StorySectionProps> = ({
  translations,
  language,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const content = translations[language].beevsSection;

  return (
    <div className="container mx-auto px-4 mb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8D4C91]/10 to-transparent" />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Text Preview Section */}
        <motion.div
          variants={itemVariants}
          className="space-y-6 bg-white/5 p-8 rounded-2xl backdrop-blur-sm"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold text-[#D9D055] title-font tracking-tight"
          >
            {content.title}
          </motion.h2>

          {/* Preview text */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <p className="text-lg leading-relaxed body-font line-clamp-3 text-white/90">
              {content.description1.split(".").slice(0, 2).join(". ") + "..."}
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-block bg-[#D9D055] text-[#8D4C91] px-8 py-4 rounded-full font-semibold title-font hover:bg-[#c4bb4b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              {content.highlight}
              <Sparkles size={18} />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      <StoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={content}
        language={language}
      />
    </div>
  );
};

export default StorySection;