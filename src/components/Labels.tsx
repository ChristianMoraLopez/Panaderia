import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Labels = () => {
  const stickers = [
    '/images/SVG/STICKERS 1.svg',
    '/images/SVG/STICKERS 2.svg',
    '/images/SVG/STICKERS 3.svg',
    '/images/SVG/STICKERS 4.svg'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-[#f1bfb5] py-12 overflow-hidden relative">
      {/* Contenedor principal con animación */}
      <motion.div 
        className="max-w-[1400px] mx-auto px-2" // Contenedor más ancho y menos padding
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Grid de imágenes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4"> {/* Reducido el gap */}
          {stickers.map((sticker, index) => (
            <motion.div
              key={index}
              className="relative h-[300px] sm:h-[350px] lg:h-[400px]" // Altura fija más grande
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <Image
                src={sticker}
                alt={`Sticker ${index + 1}`}
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 scale-125" // Escalado base más grande
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decoración de fondo (opcional) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#936cad] opacity-5 rounded-full -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#d1d451] opacity-5 rounded-full translate-x-20 translate-y-20" />
      </div>
    </div>
  );
};

export default Labels;