import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AboutUsProps {
  language: 'es' | 'en';
}

const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const translations = {
    es: {
      title: "Sobre",
      subtitle: "Nosotros",
      description: "Somos una empresa de productos alimenticios saludables para el cuidado de las personas, manejamos postres, comida saludable, para personas en Estados Unidos especialmente en la Florida.",
    },
    en: {
      title: "About",
      subtitle: "Us",
      description: "We are a company specializing in healthy food products for people's well-being. We offer desserts and healthy food, catering to individuals in the United States, particularly in Florida.",
    }
  };

  const t = translations[language];

  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="bg-[#936cad] py-12 sm:py-16 md:py-20 relative overflow-hidden body-font">
      {/* Animated dots */}
      <div className="absolute top-8 right-8 flex flex-col gap-4 z-20">
        <motion.div
          variants={dotVariants}
          animate="animate"
          className="w-4 h-4 rounded-full bg-[#f1bfb5]"
        />
        <motion.div
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
          className="w-4 h-4 rounded-full bg-[#d1d451]"
        />
        <motion.div
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 1 }}
          className="w-4 h-4 rounded-full bg-[#b0c4cc]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="w-full lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="title-font text-[#d1d451] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4">
              {t.title}
            </h1>
            <h2 className="title-font text-[#d1d451] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6 md:mb-8">
              {t.subtitle}
            </h2>
            <p className="body-font text-white text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl">
              {t.description}
            </p>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 flex justify-end"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
           <div className="absolute right-0 -top-24 -bottom-24">
              <div className="relative w-[500px] h-[500px]">
                <Image
                  src="/images/SVG/LogoTransparent.svg"
                  alt="Company Logo"
                  layout="fill"
                  objectFit="contain"
                  className="opacity-80 translate-x-44"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;