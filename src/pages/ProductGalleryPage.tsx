import React, { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { ProductFields } from '@/types/ProductTypes';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, Cake, Plus, Minus } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import { useCart, useCartMutations } from '@/store/Cart';

const ProductGalleryPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<ProductFields[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const {  count } = useCart();
  const { addToCart } = useCartMutations();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (products) {
      setFilteredProducts(
        activeCategory
          ? products.filter(product => product.category === activeCategory)
          : products
      );
    }
  }, [products, activeCategory]);

  const categories = Array.from(new Set(products?.map(product => product.category) || []));

  if (error) {
    return <div className="text-center text-red-700 mt-10">{error}</div>;
  }

  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };
  const handleAddToCart = (product: ProductFields) => {
    const quantity = quantities[product.image.sys.id] || 1;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: parseInt(product.image.sys.id),
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image?.fields?.file?.url || '/placeholder.jpg'
      });
    }
    setQuantities(prev => ({ ...prev, [product.image.sys.id]: 0 }));
  };

  return (
    <>
       <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 pt-20">
        <div className={`sticky top-20 z-10 bg-amber-100 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}>
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-5xl font-serif text-amber-800 text-center mb-8 font-bold shadow-text">Delicias de la Panadería</h1>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isScrolled={isScrolled}
    
            />
          </div>
        </div>
        
        <main className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Cake className="w-20 h-20 text-amber-600" />
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredProducts.map((product, index) => {
                  if (!product || !product.image.fields) return null;
                  const { image } = product;
                  const imageUrl = image?.fields?.file?.url
                    ? `https:${image.fields.file.url}`
                    : '/placeholder.jpg';
                  const quantity = quantities[product.image.sys.id] || 0;

                  return (
                    <motion.div
                      key={product.image.sys.id}
                      className="rounded-xl overflow-hidden shadow-2xl bg-white group hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="relative h-80">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 transform group-hover:scale-110"
                        />
                        <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-2 m-4 rounded-full text-sm font-bold shadow-lg">
                          {product.category}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                      </div>
                      <div className="p-8">
                        <h2 className="text-3xl font-serif font-bold text-amber-800 mb-4 leading-tight">{product.name}</h2>
                        <p className="text-md text-amber-700 mb-6">{product.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold text-amber-900">${product.price.toFixed(2)}</span>
                          <div className="flex items-center bg-amber-100 rounded-full p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-colors duration-300"
                              onClick={() => handleQuantityChange(product.image.sys.id, -1)}
                            >
                              <Minus size={20} />
                            </motion.button>
                            <span className="mx-4 font-bold text-lg text-amber-800">{quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-colors duration-300"
                              onClick={() => handleQuantityChange(product.image.sys.id, 1)}
                            >
                              <Plus size={20} />
                            </motion.button>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full flex items-center justify-center px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-300 shadow-lg text-lg font-semibold"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag size={24} className="mr-3" />
                          Agregar al carrito
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </>
  );
};

export default ProductGalleryPage;