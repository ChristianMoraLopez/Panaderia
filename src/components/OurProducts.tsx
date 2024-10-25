import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';
import { Cake, Cookie, Croissant, Coffee, Utensils } from 'lucide-react';

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
      setRandomProducts(shuffled.slice(0, 3));
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Cake className="w-12 h-12 text-[#936cad]" />
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

  const BackgroundIcons = () => (
    <>
      {[Cake, Cookie, Croissant, Coffee, Utensils].map((Icon, index) => (
        <Icon 
          key={index} 
          className="w-8 h-8 text-[#936cad] opacity-10" 
          style={{
            position: 'absolute',
            top: `${Math.random() * 500}%`,
            left: `${Math.random() * 200}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-0 body-font"
    >
      <div className="relative mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[#D0D450]"></div>
        <div className="relative z-10 py-6 px-4">
          <h2 className="text-4xl font-bold text-center text-[#936cad] relative z-20 title-font">
            {translations[language].title}
          </h2>
          <div className="absolute inset-0 z-10">
            {[...Array(50)].map((_, i) => (
              <BackgroundIcons key={i} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="group relative flex flex-col"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-64 object-cover transition-transform duration-300 transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Product Title Label */}
              <div className="mt-4 text-center">
                <h3 className="text-[#936cad] text-xl font-bold tracking-wide">
                  {product.name}
                </h3>
              </div>
              
              {/* Buy Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/ProductGalleryPage')}
                className="mt-4 px-8 py-3 bg-[#d1d451] text-[#936cad] font-bold rounded-full 
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