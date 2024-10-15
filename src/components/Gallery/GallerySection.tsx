import React from 'react';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';
import { Cake } from 'lucide-react';

// Define the Product type
interface Product {
  name: string;
  price: number;
  image: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

// Define the type for the onAddToCart function and include language
interface GallerySectionProps {
  onAddToCart: (product: Product) => void;
  language: 'es' | 'en';
}

const GallerySection: React.FC<GallerySectionProps> = ({ onAddToCart, language }) => {
  const { products, loading, error } = useProducts();

  // Translations
  const translations = {
    es: {
      title: "Nuestras Delicias",
      addToCart: "Añadir al Carrito",
      loading: "Cargando...",
      error: "Error: "
    },
    en: {
      title: "Our Delights",
      addToCart: "Add to Cart",
      loading: "Loading...",
      error: "Error: "
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Cake className="w-12 h-12 text-brown-500" />
        </motion.div>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600 p-4 bg-red-100 rounded-lg"
      >
        {translations[language].error} {error}
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-brown-800">
        {translations[language].title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product: Product, index: number) => {
          if (!product) return null;
          const imageUrl = product.image?.fields?.file?.url
            ? `https:${product.image.fields.file.url}`
            : '/placeholder.jpg';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={imageUrl}
                  alt={language === 'es' ? product.name : product.name}
                  width={500}
                  height={500}
                  className="w-full h-64 object-cover transition-transform duration-300 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {language === 'es' ? product.name : product.name}
                  </h3>
                  <p className="text-amber-200 font-medium">${product.price.toFixed(2)}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full py-2 px-4 bg-brown-600 text-white rounded-full font-medium hover:bg-brown-700 transition-colors duration-300"
                onClick={() => onAddToCart(product)}
              >
                {translations[language].addToCart}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GallerySection;