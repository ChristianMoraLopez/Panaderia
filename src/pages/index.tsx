import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, MessageCircle,Instagram, Facebook, ShoppingCart } from 'lucide-react';
import WeeklyMenuItemSection from '@/components/WeeklyMenu';
import GallerySection from '@/components/Gallery/GallerySection';
import AboutUs from '@/components/AboutUs';
import { useProducts } from '@/hooks/useProducts';
import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer/Footer';
import LearnMore from '@/components/learnMore';

// Definimos un tipo para nuestras traducciones
type Translations = {
  [key: string]: {
    es: string;
    en: string;
  };
};

// Definición de tipos para las props de SocialButton
interface SocialButtonProps {
  Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  href: string;
}


// Objeto de traducciones
const translations: Translations = {
  orderNow: {
    es: "Ordenar Ahora",
    en: "Order Now"
  },
  ourSpecialties: {
    es: "Nuestras Especialidades",
    en: "Our Specialties"
  },
  dreamCakes: {
    es: "Pasteles de Ensueño",
    en: "Dream Cakes"
  },
  dreamCakesDesc: {
    es: "Creaciones únicas que deleitan todos los sentidos",
    en: "Unique creations that delight all senses"
  },
  specialtyCoffee: {
    es: "Café de Especialidad",
    en: "Specialty Coffee"
  },
  specialtyCoffeeDesc: {
    es: "Aromas intensos y sabores cuidadosamente seleccionados",
    en: "Intense aromas and carefully selected flavors"
  },
  artisanalBreads: {
    es: "Panes Artesanales",
    en: "Artisanal Breads"
  },
  artisanalBreadsDesc: {
    es: "Tradición y creatividad en cada hogaza",
    en: "Tradition and creativity in every loaf"
  },
  sweetDelights: {
    es: "Dulces Delicias",
    en: "Sweet Delights"
  },
  bakedWithPassion: {
    es: "Horneado con pasión desde 1995",
    en: "Baked with passion since 1995"
  },
  allRightsReserved: {
    es: "© 2024 Dulces Delicias Artesanales. Todos los derechos reservados.",
    en: "© 2024 Sweet Artisanal Delights. All rights reserved."
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

const LuxuryBakeryHomepage = () => {
  const { products, loading, error } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const productsSectionRef = useRef<HTMLElement | null>(null);
  const weeklyMenuSectionRef = useRef<HTMLElement | null>(null);
  const aboutUsSectionRef = useRef<HTMLElement | null>(null);
  const learnMoreSectionRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  
  const colors = ['#B7D3D3', '#8D4C91', '#F2BEB7', '#D0D450'];

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const handleNavigate = () => {
    router.push('/ProductGalleryPage');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  // Función helper para obtener la traducción
  const t = (key: string) => translations[key][language];

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#8D4C91]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Image src="/images/SVG/LogoWithOutLetters.svg" alt="Beev's oven" width={300} height={60} />
      </motion.div>
    </div>
  );
  if (error) return <div className="h-screen flex items-center justify-center bg-amber-50 text-red-600 text-xl">Error: {error}</div>;
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

  return (
    <div className="min-h-screen bg-amber-50 text-brown-900 overflow-hidden font-serif relative">
      <Navbar cartCount={cartCount} language={language} toggleLanguage={toggleLanguage} />

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
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-10 hidden sm:flex             ">
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
            <motion.button
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="px-8 py-4 bg-[#D0D450] text-[#7C428C] rounded-full text-lg font-semibold hover:bg-[#C8CC4A] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={handleNavigate}
            >
              <ShoppingCart className="inline-block mr-2 h-5 w-5" />
              {t('orderNow')}
            </motion.button>
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


      <main>
        <section ref={productsSectionRef} className=" bg-gradient-to-b from-brown-900 to-amber-900">
          <GallerySection onAddToCart={() => setCartCount(prevCount => prevCount + 1)} language={language} />
        </section>
        <section ref={weeklyMenuSectionRef} className="bg-brown-900 text-amber-100 py-12">
          <WeeklyMenuItemSection language={language} />
        </section>
        <section ref={aboutUsSectionRef} className="bg-amber-50 text-brown-900 py-12">
          <AboutUs language={language} />
        </section>

        <section ref={learnMoreSectionRef} className="bg-brown-900 text-amber-100 py-12">
          <LearnMore language={language} />
        </section>



      </main>

      <Footer language={language} />
    </div>
  );
};

export default LuxuryBakeryHomepage;