import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface DietaryBadgesProps {
  nutritionalTable: {
    fields: {
      sugarFree?: boolean;
      glutenFree?: boolean;
      keto?: boolean;
      milkFree?: boolean;
    };
  };
}

const DietaryBadges: React.FC<DietaryBadgesProps> = ({ nutritionalTable }) => {
  if (!nutritionalTable) return null;

  const badges = [
    {
      id: 'sugarFree',
      show: nutritionalTable.fields.sugarFree,
      src: '/public/images/svg/sugarfree.svg',
      alt: 'Sugar Free',
      width: 600,
      height: 400,
    },
    {
      id: 'glutenFree',
      show: nutritionalTable.fields.glutenFree,
      src: '/images/svg/glutenfree.svg',
      alt: 'Gluten Free',
      width: 400,
      height: 400,
    },
    {
      id: 'keto',
      show: nutritionalTable.fields.keto,
      src: '/images/svg/keto.svg',
      alt: 'Keto',
      width: 400,
      height: 400,
    },
    {
      id: 'milkFree',
      show: nutritionalTable.fields.milkFree,
      src: '/images/svg/milkfree.svg',
      alt: 'Milk Free',
      width: 400,
      height: 400,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="flex justify-start my-2 sm:my-4 lg:my-6 ml-2 sm:ml-6 lg:ml-12 -space-x-4 lg:-space-x-4 p-1 bg-white/10 rounded-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {badges
        .filter(badge => badge.show)
        .map((badge) => (
          <motion.div
            key={badge.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            <div>
              <Image
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
              />
            </div>
          </motion.div>
        ))}
    </motion.div>
  );
};

export default DietaryBadges;