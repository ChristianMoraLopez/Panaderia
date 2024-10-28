import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';
import Header from './ui/Header';

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

interface OurProductsProps {
  language: 'es' | 'en';
}

const OurProducts: React.FC<OurProductsProps> = ({ language }) => {
  const router = useRouter();
  const { products, loading, error } = useProducts();
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 8));
    }
  }, [products]);

  const translations = {
    es: {
      title: "Productos",
      loading: "Cargando...",
      error: "Error: ",
      buyButton: "Comprar"
    },
    en: {
      title: "Products",
      loading: "Loading...",
      error: "Error: ",
      buyButton: "Buy"
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
      </motion.div>
    </div>
  );

  if (error) return (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto max-w-7xl px-4">
        {randomProducts.map((product: Product, index: number) => {
          const imageUrl = product.image?.fields?.file?.url
            ? `https:${product.image.fields.file.url}`
            : '/placeholder.jpg';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col w-full"
            >
              <div className="flex flex-col w-full">
                <div className="relative overflow-hidden rounded-t-lg shadow-lg w-full h-[400px]">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 transform group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="bg-[#936cad] py-3 px-4 rounded-b-lg w-full h-[60px] flex items-center justify-center"> {/* Altura fija y flex para centrado */}
                  <h3 className="text-white text-lg font-bold text-center tracking-wide leading-tight line-clamp-2"> {/* Agregado line-clamp-2 y ajustado line-height */}
                    {product.name}
                  </h3>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/ProductGalleryPage')}
                className="w-full mt-6 px-8 py-3 bg-[#d1d451] text-[#936cad] font-bold rounded-full 
                          shadow-lg hover:shadow-xl transition-all duration-300 
                          transform hover:-translate-y-1"
              >
                {translations[language].buyButton}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default OurProducts;