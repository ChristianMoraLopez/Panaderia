import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Coffee, Croissant, ChevronDown, Instagram, Facebook } from 'lucide-react';

import GallerySection from '@components/Gallery/GallerySection';
import Navbar from '@/components/Navbar/Navbar';

const backgroundImages = [
  '/images/luxury-pastry-1.jpg',
  '/images/luxury-pastry-2.jpg',
  '/images/luxury-pastry-3.jpg',
];

const LuxuryBakeryHomepage = () => {
  // Eliminar scrollY si no se usa, o utilizarlo como se muestra en la Opción B
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []); // backgroundImages.length ya no es necesario porque backgroundImages está fuera del componente

  return (
    <div className="min-h-screen bg-amber-50 text-brown-900 overflow-hidden font-serif relative">
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
            filter: 'brightness(0.6) sepia(0.2)',
          }}
        />
      </AnimatePresence>

      <Navbar />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/3144715980"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors duration-300"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      <main>
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center z-10">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-amber-100"
            >
              Arte en cada bocado
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto text-amber-50"
            >
              Descubre la exquisitez de nuestras creaciones artesanales, donde cada detalle es una obra maestra
            </motion.p>
            <div className="flex justify-center space-x-4">
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2 }}
                className="px-8 py-4 bg-amber-600 text-amber-50 rounded-full text-lg font-semibold hover:bg-amber-500 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Explorar Nuestro Menú
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.2 }}
                className="px-8 py-4 bg-amber-100 text-amber-900 rounded-full text-lg font-semibold hover:bg-amber-200 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Contáctanos
              </motion.button>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-10 h-10 text-amber-200 opacity-70" />
          </motion.div>
        </section>

        <section className="py-24 bg-gradient-to-b from-amber-900 to-brown-900">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-bold mb-16 text-center text-amber-300">Nuestras Especialidades</h3>
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
                  className="text-center bg-amber-100 rounded-lg p-8 shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Icon className="w-16 h-16 mx-auto mb-6 text-amber-600" />
                  <h4 className="text-2xl font-semibold mb-4 text-brown-800">{title}</h4>
                  <p className="text-brown-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-brown-900 to-amber-900">
          <GallerySection />
        </section>
      </main>

      <footer className="bg-brown-900 py-12 text-amber-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h5 className="text-2xl font-bold mb-4 text-amber-300">Dulces Delicias</h5>
              <p className="text-amber-200">Horneado con pasión desde 1995</p>
            </div>
            <div className="flex space-x-6">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/dulcesdelicias" },
                { Icon: Facebook, href: "https://www.facebook.com/dulcesdelicias" },
                { 
                  Icon: () => (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  ), 
                  href: "https://www.tiktok.com/@dulcesdelicias" 
                },
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-100 transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-amber-200">
            © 2024 Dulces Delicias Artesanales. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryBakeryHomepage;
