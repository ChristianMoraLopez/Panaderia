import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewsProps {
  language: 'es' | 'en';
}

const Reviews: React.FC<ReviewsProps> = ({ language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mover reviews fuera del componente o usar useMemo
  const reviews = {
    es: [
      "Los mejores productos saludables que me he comido, la atención muy buena, la comida en perfectas condiciones, el envío fue muy rápido y puedo comer galletas sin preocuparme por las harinas añadidas",
      "Excelente servicio y productos de primera calidad. Los postres son deliciosos y realmente saludables. Mi familia está encantada con cada pedido que hacemos",
      "Me encanta que puedo disfrutar de dulces sin culpa. El sabor es increíble y la calidad del servicio es excepcional. Definitivamente recomendado"
    ],
    en: [
      "The best healthy products I've ever eaten, great service, food in perfect condition, delivery was very fast and I can eat cookies without worrying about added flours",
      "Excellent service and top quality products. The desserts are delicious and truly healthy. My family is delighted with every order we make",
      "I love that I can enjoy sweets without guilt. The taste is amazing and the service quality is exceptional. Definitely recommended"
    ]
  } as const;

  const colors = [
    { bg: '#f1bfb5', name: 'rosa' },
    { bg: '#936cad', name: 'morado' },
    { bg: '#b0c4cc', name: 'celeste' }
  ] as const;

  useEffect(() => {
    const reviewsLength = reviews[language].length;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviewsLength);
    }, 5000);

    // Limpiar el timer cuando el componente se desmonte o el language cambie
    return () => clearInterval(timer);
  }, [language]); // Ya no necesitamos reviews como dependencia porque usamos reviewsLength

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  } as const;

  return (
    <div className="relative w-full min-h-[700px] bg-amber-50">
      {/* Fondo con imagen */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/comentarios.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
          {/* Título a la izquierda */}
          <div className="md:w-1/3 mb-8 md:mb-0 md:pt-16 pr-12">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="title-font text-[#936cad] text-7xl md:text-8xl font-bold mb-2"
            >
              Reviews
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="title-font text-[#936cad] text-6xl md:text-7xl font-semibold"
            >
              Beev&apos;s
            </motion.h3>
          </div>

          {/* Review Card a la derecha */}
          <div className="md:w-1/2 relative">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="bg-white super-rounded p-8 shadow-xl min-h-[500px] flex items-center justify-center"
              >
                <p className="body-font text-[#936cad] text-3xl leading-relaxed">
                  {reviews[language][currentIndex]}
                </p>

                {/* Puntos indicadores */}
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-6">
                  {colors.map((color, index) => (
                    <motion.div
                      key={index}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${
                        currentIndex === index ? 'scale-125' : 'scale-100'
                      }`}
                      style={{ 
                        backgroundColor: color.bg,
                        boxShadow: currentIndex === index ? '0 0 15px rgba(0,0,0,0.3)' : 'none'
                      }}
                      whileHover={{ scale: 1.3 }}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;