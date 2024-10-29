import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AboutUsProps {
  language: "es" | "en";
}

const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  const translations = {
    es: {
      title: "Sobre",
      subtitle: "Nosotros",
      description:
        "Somos una empresa de productos alimenticios saludables para el cuidado de las personas, manejamos postres, comida saludable, para personas en Estados Unidos especialmente en la Florida.",
      clickText: "Haz clic para saber más",
    },
    en: {
      title: "About",
      subtitle: "Us",
      description:
        "We are a company specializing in healthy food products for people's well-being. We offer desserts and healthy food, catering to individuals in the United States, particularly in Florida.",
      clickText: "Click to learn more",
    },
  };

  const t = translations[language];

  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Nueva animación para indicar que es clickeable
  const clickIndicatorVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="bg-[#936cad] py-16 h-[600px] relative overflow-hidden body-font">
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
      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="flex flex-col lg:flex-row items-center justify-center h-full pt-8">
          <motion.div
            className="w-full lg:w-1/2 lg:pr-8 mb-8 lg:mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="title-font text-[#d1d451] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-2">
              {t.title}
            </h1>

            {/* Link wrapper con indicador de click mejorado */}
            <div className="relative z-30">
              <Link
                href="/about-us"
                className="inline-block touch-manipulation relative"
                aria-label={t.clickText}
              >
                <motion.div
                  className="absolute -inset-4 bg-[#f1bfb5] rounded-lg md:hidden"
                  variants={clickIndicatorVariants}
                  initial="initial"
                  animate="animate"
                />
                <h2 className="title-font text-[#d1d451] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 group relative inline-block hover:text-[#f1bfb5] transition-colors">
                  {t.subtitle}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#f1bfb5] transition-all duration-300 group-hover:w-full"></span>
                  {/* Mobile touch feedback */}
                  <span className="absolute -inset-4 bg-[#f1bfb5] opacity-0 rounded-lg transition-opacity md:hidden active:opacity-20"></span>
                  {/* Desktop tooltip */}
                  <span className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-12 px-3 py-1 bg-[#f1bfb5] text-[#936cad] text-base rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {t.clickText}
                  </span>
                  {/* Nuevo indicador de click para desktop */}
                  <motion.div 
                    className="hidden md:block absolute -inset-2 border-2 border-[#f1bfb5] rounded-lg pointer-events-none"
                    variants={clickIndicatorVariants}
                    initial="initial"
                    animate="animate"
                  />
                </h2>
              </Link>
            </div>

            <p className="body-font text-white text-xl sm:text-2xl leading-relaxed max-w-2xl">
              {t.description}
            </p>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 flex justify-end"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute right-0 -top-12 -bottom-12 pointer-events-none">
              <div className="relative w-[600px] h-[600px]">
                <Image
                  src="/images/SVG/LogoTransparent.svg"
                  alt="Company Logo"
                  layout="fill"
                  objectFit="contain"
                  className="opacity-80 translate-x-36"
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