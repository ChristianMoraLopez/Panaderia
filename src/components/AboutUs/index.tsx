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
      location: "Ubicados en Florida, EE.UU."
    },
    en: {
      title: "About",
      subtitle: "Us",
      description: "We are a company specializing in healthy food products for people's well-being. We offer desserts and healthy food, catering to individuals in the United States, particularly in Florida.",
      location: "Located in Florida, USA"
    }
  };

  const t = translations[language];

  return (
    <div className="bg-[#8D4C91] text-[#D9D055] py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="w-full lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4">
              {t.title}
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6 md:mb-8">
              {t.subtitle}
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed">{t.description}</p>
            <div className="w-full sm:w-2/3 md:w-1/2 mx-auto lg:mx-0">
              <div className="bg-[#8D4C91] p-3 sm:p-4 rounded-lg border border-[#D9D055] text-center">
                <p className="text-base sm:text-lg font-medium">{t.location}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] aspect-square">
              <Image
                src="/images/SVG/LogoTransparent.svg"
                alt="Company Logo"
                layout="fill"
                objectFit="contain"
                className="opacity-20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;