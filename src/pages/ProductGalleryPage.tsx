import React, { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { ProductFields } from '@/types/ProductTypes';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag, Cake, Plus, Minus, MessageCircle, Instagram, Facebook } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import { useCart, useCartMutations } from '@/store/Cart';
import Footer from '@/components/Footer/Footer';
import ProductModal from '@/components/ProductModal';

// Definimos un tipo para nuestras traducciones
type Translations = {
  [key: string]: {
    es: string;
    en: string;
  };
};

// Objeto de traducciones
const translations: Translations = {

  makeOrder: {
    es: "Hacer Pedido",
    en: "Make Order"
  },

  orderNow: {
    es: "Ordenar Ahora",
    en: "Order Now"
  },
  artInEveryBite: {
    es: "Arte en cada bocado",
    en: "Art in every bite"
  },
  discoverExquisiteness: {
    es: "Descubre la exquisitez de nuestras creaciones artesanales",
    en: "Discover the exquisiteness of our artisanal creations"
  }
};

const ProductGalleryPage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<ProductFields[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { count } = useCart();
  const { addToCart } = useCartMutations();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [selectedProduct, setSelectedProduct] = useState<ProductFields | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
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

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const handleProductClick = (product : ProductFields) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Función helper para obtener la traducción
  const t = (key: string) => translations[key][language];

  const colors = ['#B7D3D3', '#8D4C91', '#F2BEB7', '#D0D450'];
  
  const cardColors = ['#936DAD', '#B6D3D2', '#D1D550'];

  return (
    <>
      <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/17862800961?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20acerca%20de%20sus%20productos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>

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
                alt={language === 'es' ? products[currentSlide].name : products[currentSlide].name}
                layout="fill"
                objectFit="cover"
                quality={100}
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70" />
              
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Media Buttons */}
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-10 hidden sm:flex">
          <SocialButton Icon={Instagram} href="https://www.instagram.com/beevsoven/profilecard/?igsh=MXhtN2djMnJtaHp2bA==" />
          <SocialButton Icon={Facebook} href="https://www.facebook.com/profile.php?id=61566809876928" />
          <SocialButton 
            Icon={() => (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            )} 
            href="https://www.tiktok.com/@beevsoven?_t=8qekMoITjKc&_r=1" 
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10 px-4">
            <motion.h2
              key={`title-${currentSlide}-${language}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-amber-100 drop-shadow-lg"
            >
              {products && products[currentSlide] 
                ? (language === 'es' ? products[currentSlide].name : products[currentSlide].name) 
                : t('artInEveryBite')}
            </motion.h2>
            <motion.p
              key={`description-${currentSlide}-${language}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl lg:text-2xl font-light mb-12 max-w-2xl mx-auto text-amber-50 drop-shadow"
            >
              {products && products[currentSlide] 
                ? (language === 'es' ? products[currentSlide].description : products[currentSlide].description) 
                : t('discoverExquisiteness')}
            </motion.p>
         
          </div>
        </div>

        {/* Colored Circles */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {products && products.map((_, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSlideChange(index)}
              className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === index ? 'ring-2 ring-white ring-offset-2' : ''
              }`}
              style={{ backgroundColor: colors[index % colors.length] }}
            />
          ))}
        </div>
      </section>

      {/* Main content */}
      <div className="min-h-screen  pt-20">
        <div className={`sticky top-20 z-10 bg-[#F2BFBB] transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}>
          <div className="container mx-auto px-4 py-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white px-8 py-4  text-2xl font-bold  transition-all duration-300 mb-8 mx-auto block"
            >
              <span className="bg-[#886AA6] px-4 py-2 rounded-full">
                {t('makeOrder')}
              </span>
            </motion.button>
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
                  const cardColor = cardColors[index % cardColors.length];
                  const isGreenCard = cardColor === '#D1D550';

                  return (
                    <motion.div
                      key={product.image.sys.id}
                      className="rounded-xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      style={{ backgroundColor: cardColor }}
                    >
                      <div className="relative h-80 hover:h-96 cursor-pointer"
                      
                      onClick={() => handleProductClick(product)}
                      >
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 transform group-hover:scale-110"
                        />
                        <div className="absolute top-0 right-0 bg-white text-[#936DAD] px-4 py-2 m-4 rounded-full text-sm font-bold shadow-lg">
                          {product.category}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                      </div>
                      <div className="p-8 text-white">
                        <h2 className="text-3xl font-serif font-bold mb-4 leading-tight">{product.name}</h2>
                        <p className="text-md mb-6">{product.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                          <div className="flex items-center bg-white/20 rounded-full p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-full bg-white/30 text-white shadow-md hover:bg-white/40 transition-colors duration-300"
                              onClick={() => handleQuantityChange(product.image.sys.id, -1)}
                            >
                              <Minus size={20} />
                            </motion.button>
                            <span className="mx-4 font-bold text-lg">{quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-full bg-white/30 text-white shadow-md hover:bg-white/40 transition-colors duration-300"
                              onClick={() => handleQuantityChange(product.image.sys.id, 1)}
                            >
                              <Plus size={20} />
                            </motion.button>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-full flex items-center justify-center px-6 py-3 rounded-full text-white transition-colors duration-300 shadow-lg text-lg font-semibold ${
                            isGreenCard ? 'bg-[#936DAD] hover:bg-[#8A5EA3]' : 'bg-[#D1D550] hover:bg-[#C7CB4B]'
                          }`}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag size={24} className="mr-3" />
                          {language === 'es' ? 'Agregar al carrito' : 'Add to cart'}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
        <Footer language={language} />
      <ProductModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  product={selectedProduct}
  language={language}
  addToCart={addToCart}
/>
        </div>
      </>
      
    );
  };

  
  
  // Definición de tipos para las props de SocialButton
  interface SocialButtonProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
  }
  
  
  // Componente SocialButton
  const SocialButton: React.FC<SocialButtonProps> = ({ Icon, href }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon className="w-6 h-6 text-white" />
    </motion.a>
  );
  
  export default ProductGalleryPage;
                              