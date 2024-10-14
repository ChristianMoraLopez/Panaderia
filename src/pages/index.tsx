import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Coffee, Croissant, Instagram, Facebook, ShoppingCart } from 'lucide-react';
import GallerySection from '@/components/Gallery/GallerySection';
import { useProducts } from '@/hooks/useProducts';
import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/router';

const LuxuryBakeryHomepage = () => {
  const { products, loading, error } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const productsSectionRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const handleSlideChange = (index : number) => {
    setCurrentSlide(index);
  };

  const handleNavigate = () => {
    router.push('/ProductGalleryPage'); // Aquí navegas a la página /gallery
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-amber-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Cake className="w-16 h-16 text-amber-600" />
      </motion.div>
    </div>
  );
  if (error) return <div className="h-screen flex items-center justify-center bg-amber-50 text-red-600 text-xl">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-amber-50 text-brown-900 overflow-hidden font-serif relative">
      <Navbar cartCount={cartCount} />

      {/* Main Slider Section */}
      <section className="h-screen relative overflow-hidden">
        <AnimatePresence initial={false}>
          {products && products[currentSlide] && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={`https:${products[currentSlide].image.fields.file.url}`}
                alt={products[currentSlide].name}
                layout="fill"
                objectFit="cover"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10 px-4">
            <motion.h2
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-amber-100 drop-shadow-lg"
            >
              {products && products[currentSlide] ? products[currentSlide].name : 'Arte en cada bocado'}
            </motion.h2>
            <motion.p
              key={`description-${currentSlide}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl lg:text-2xl font-light mb-12 max-w-2xl mx-auto text-amber-50 drop-shadow"
            >
              {products && products[currentSlide] ? products[currentSlide].description : 'Descubre la exquisitez de nuestras creaciones artesanales'}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="px-8 py-4 bg-amber-600 text-amber-50 rounded-full text-lg font-semibold hover:bg-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick= {handleNavigate}
            >
              <ShoppingCart className="inline-block mr-2 h-5 w-5" />
              Ordenar Ahora
            </motion.button>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {products && products.map((product, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSlideChange(index)}
              className={`w-24 h-16 rounded-lg overflow-hidden border-2 ${
                currentSlide === index ? 'border-amber-400 shadow-glow' : 'border-transparent'
              } cursor-pointer transition-all duration-300`}
            >
              <Image
                src={`https:${product.image.fields.file.url}`}
                alt={product.name}
                width={96}
                height={64}
                objectFit="cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <main>
        <section className="py-24 bg-gradient-to-b from-amber-900 to-brown-900">
          <div className="container mx-auto px-6">
            <h3 className="text-4xl font-bold mb-16 text-center text-amber-300 drop-shadow-lg">Nuestras Especialidades</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Cake, title: "Pasteles de Ensueño", description: "Creaciones únicas que deleitan todos los sentidos" },
                { icon: Coffee, title: "Café de Especialidad", description: "Aromas intensos y sabores cuidadosamente seleccionados" },
                { icon: Croissant, title: "Panes Artesanales", description: "Tradición y creatividad en cada hogaza" },
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Icon className="w-16 h-16 mx-auto mb-6 text-amber-600" />
                  <h4 className="text-2xl font-semibold mb-4 text-brown-800">{title}</h4>
                  <p className="text-brown-600">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={productsSectionRef} className="py-24 bg-gradient-to-b from-brown-900 to-amber-900">
          <GallerySection onAddToCart={() => setCartCount(prevCount => prevCount + 1)} />
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
                <motion.a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-100 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
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