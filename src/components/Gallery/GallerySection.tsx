import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';
import Header from '../ui/Header';
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

const GallerySection: React.FC<GallerySectionProps> = ({ language }) => {
  const { products, loading, error } = useProducts();
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 3));
    }
  }, [products]);

  const translations = {
    es: {
      title: "Destacados",
      loading: "Cargando...",
      error: "Error: "
    },
    en: {
      title: "Featured",
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
          
        </motion.div>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600 p-4 bg-red-100 rounded-lg body-font"
      >
        {translations[language].error} {error}
      </motion.div>
    );


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-0 body-font"
    >


<Header 
        title={translations[language].title}
        backgroundColor="bg-[#D0D450]"
        textColor="text-[#936cad]"
      />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {randomProducts.map((product, index) => {
            const imageUrl = product.image?.fields?.file?.url
              ? `https:${product.image.fields.file.url}`
              : '/placeholder.jpg';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Link href="/product">
                  <div className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
                    <div className="aspect-[3/4]"> {/* Set aspect ratio for more elongated images */}
                      <Image
                        src={imageUrl}
                        alt={language === 'es' ? product.name : product.name}
                        fill
                        className="object-cover transition-transform duration-300 transform group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold text-center px-4 drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 title-font">
                        {language === 'es' ? product.name : product.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default GallerySection;