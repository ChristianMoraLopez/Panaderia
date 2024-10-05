import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Coffee, Croissant, ChevronDown, Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';
import GallerySection from '@components/Gallery/GallerySection';
import Navbar from '@/components/Navbar/Navbar';

const LuxuryBakeryHomepage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    '/images/luxury-pastry-1.jpg',
    '/images/luxury-pastry-2.jpg',
    '/images/luxury-pastry-3.jpg',
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-beige-200 text-black overflow-hidden"> {/* Cambiado de bg-black a bg-beige-200 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5)', // Ajustado para un brillo más cálido
          }}
        />
      </AnimatePresence>

      <Navbar />

      <main>
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center z-10">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
            >
              Arte en cada bocado
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto"
            >
              Descubre la exquisitez de nuestras creaciones artesanales, donde cada detalle es una obra maestra
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="px-8 py-4 bg-gold-400 text-black rounded-full text-lg font-semibold hover:bg-gold-300 transition-colors"
            >
              Explorar Nuestro Menú
            </motion.button>
          </div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-10 h-10 text-black opacity-70" /> {/* Cambiado de text-white a text-black */}
          </motion.div>
        </section>

        <section className="py-24 bg-black bg-opacity-80">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-bold mb-16 text-center text-gold-400">Nuestras Especialidades</h3> {/* Ajustado a texto dorado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Cake, title: "Pasteles de Ensueño" },
                { icon: Coffee, title: "Café de Especialidad" },
                { icon: Croissant, title: "Panes Artesanales" },
              ].map(({ icon: Icon, title }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="text-center"
                >
                  <Icon className="w-16 h-16 mx-auto mb-6 text-gold-400" />
                  <h4 className="text-2xl font-semibold mb-4">{title}</h4>
                  <p className="text-gray-600"> {/* Cambiado de text-gray-400 a text-gray-600 */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-black bg-opacity-80">
          <GallerySection />
        </section>
      </main>

      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h5 className="text-2xl font-bold mb-4 text-gold-400">Dulces Delicias</h5> {/* Ajustado a texto dorado */}
              <p className="text-gray-400">Horneado con pasión desde 1995</p>
            </div>
            <div className="flex space-x-6">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-white hover:text-gold-400 transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-gray-400">
            © 2024 Dulces Delicias Artesanales. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryBakeryHomepage;
