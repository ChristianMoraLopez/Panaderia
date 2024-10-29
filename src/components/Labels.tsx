import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Labels = () => {
  const stickers = [
    '/images/SVG/glutenfree.svg',
    '/images/SVG/keto.svg',
    '/images/SVG/milkfree.svg',
    '/images/SVG/sugarfree.svg'
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
    <div className="bg-[#f1bfb5] py-8 overflow-hidden relative">
      {/* Contenedor principal con animación */}
      <motion.div 
        className="max-w-[1200px] mx-auto px-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Grid de imágenes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {stickers.map((sticker, index) => (
            <motion.div
              key={index}
              className="relative h-[150px] sm:h-[200px] md:h-[250px]"
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
                className="transition-transform duration-300 scale-110"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decoración de fondo (opcional) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#936cad] opacity-5 rounded-full -translate-x-12 -translate-y-12" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#d1d451] opacity-5 rounded-full translate-x-16 translate-y-16" />
      </div>
    </div>
  );
};

export default Labels;