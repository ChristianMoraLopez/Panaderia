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
    <div className="bg-[#8D4C91] text-[#D9D055] py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 pr-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              {t.title}
            </h1>
            <h2 className="text-5xl md:text-6xl font-semibold mb-8">
              {t.subtitle}
            </h2>
            <p className="text-xl mb-8 leading-relaxed">{t.description}</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#8D4C91] p-4 rounded-lg border border-[#D9D055] text-center">
                <p className="text-lg font-medium">{t.location}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Image
              src="/images/SVG/LogoTransparent.svg"
              alt="Company Logo"
              width={500}
              height={500}
              className="opacity-20"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;