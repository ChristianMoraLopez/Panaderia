import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Leaf, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Instagram, Facebook } from 'lucide-react';
import { useEffect } from 'react';





type Language = 'es' | 'en';

type TranslationValue = {
  title: string;
  description: string;
  icon: string;
};

type Translation = {
  title: string;
  subtitle: string;
  description: string;
  location: string;
  learnMore: string;
  values: TranslationValue[];
};

type Translations = {
  [key in Language]: Translation;
};

const translations: Translations = {
  es: {
    title: "Sobre",
    subtitle: "Nosotros",
    description: "Somos una empresa apasionada por ofrecer productos alimenticios saludables que cuidan de ti y de tu familia. Desde deliciosos postres hasta nutritivas comidas, nos especializamos en crear opciones que deleitan el paladar y nutren el cuerpo, sirviendo principalmente a nuestra comunidad en Florida, Estados Unidos.",
    location: "Ubicados con orgullo en Florida, EE.UU.",
    learnMore: "Conoce más sobre nuestra misión",
    values: [
      {
        title: "Salud",
        description: "Priorizamos ingredientes naturales y procesos que mantienen el valor nutricional de nuestros productos.",
        icon: "Leaf"
      },
      {
        title: "Sabor",
        description: "Creemos que la comida saludable puede ser deliciosa. Nuestros chefs se aseguran de que cada bocado sea una experiencia placentera.",
        icon: "Heart"
      },
      {
        title: "Comunidad",
        description: "Nos enorgullece servir a nuestra comunidad local en Florida, contribuyendo a un estilo de vida más saludable.",
        icon: "Leaf"
      }
    ]
  },
  en: {
    title: "About",
    subtitle: "Us",
    description: "We are a company passionate about offering healthy food products that take care of you and your family. From delicious desserts to nutritious meals, we specialize in creating options that delight the palate and nourish the body, primarily serving our community in Florida, United States.",
    location: "Proudly located in Florida, USA",
    learnMore: "Learn more about our mission",
    values: [
      {
        title: "Health",
        description: "We prioritize natural ingredients and processes that maintain the nutritional value of our products.",
        icon: "Leaf"
      },
      {
        title: "Flavor",
        description: "We believe that healthy food can be delicious. Our chefs ensure that every bite is a pleasant experience.",
        icon: "Heart"
      },
      {
        title: "Community",
        description: "We take pride in serving our local community in Florida, contributing to a healthier lifestyle.",
        icon: "Leaf"
      }
    ]
  }
};


// Define las diapositivas personalizadas
const slides = {
  es: [
    {
      image: "https://images.pexels.com/photos/2216350/pexels-photo-2216350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Asegúrate de tener estas imágenes
      title: "Nuestra Historia",
      description: "Comenzamos con un sueño de crear postres saludables y deliciosos",
      link: "/historia",
      color: "#F3BEB6"
    },
    {
      image: "https://images.pexels.com/photos/1587830/pexels-photo-1587830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Nuestro Proceso",
      description: "Elaboración artesanal con ingredientes naturales seleccionados",
      link: "/proceso",
      color: "#936DAD"
    },
    {
      image: "https://images.pexels.com/photos/35666/cooking-baby-only-kitchen.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Nuestra Misión",
      description: "Hacer la repostería saludable accesible para todos",
      link: "/mision",
      color: "#D1D550"
    }
  ],
  en: [
    {
      image: "https://images.pexels.com/photos/2216350/pexels-photo-2216350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Our Story",
      description: "We started with a dream of creating healthy and delicious desserts",
      link: "/story",
      color: "#F3BEB6"
    },
    {
      image: "https://images.pexels.com/photos/1587830/pexels-photo-1587830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Our Process",
      description: "Artisanal preparation with selected natural ingredients",
      link: "/process",
      color: "#936DAD"
    },
    {
      image: "https://images.pexels.com/photos/35666/cooking-baby-only-kitchen.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Our Mission",
      description: "Making healthy baking accessible to everyone",
      link: "/mission",
      color: "#D1D550"
    }
  ]
};

interface AboutUsPageProps {
    initialLanguage: Language;
  }
  
 
  const AboutUsPage: React.FC<AboutUsPageProps> = ({ initialLanguage = 'es' }) => {
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const [cartCount] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const toggleLanguage = () => {
      setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

  
    const t = translations[language];
    const currentSlides = slides[language];
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % currentSlides.length);
      }, 10000); // Cambia cada 5 segundos
  
      return () => clearInterval(timer);
    }, [currentSlides.length]);
  
    const handleSlideChange = (index: number) => {
      setCurrentSlide(index);
    };
  
    return (
      <div className="bg-gradient-to-br from-[#8D4C91] to-[#6A3B6E] min-h-screen text-white">
        <Navbar cartCount={cartCount} language={language} toggleLanguage={toggleLanguage} />


      {/* Main Slider Section */}
      <section className="h-screen relative overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentSlides[currentSlide].image}
              alt={currentSlides[currentSlide].title}
              layout="fill"
              objectFit="cover"
              quality={100}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70" />
          </motion.div>
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

        {/* Contenido central del slider */}
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
              {currentSlides[currentSlide].title}
            </motion.h2>
            <motion.p
              key={`description-${currentSlide}-${language}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-xl lg:text-2xl font-light mb-12 max-w-2xl mx-auto text-amber-50 drop-shadow"
            >
              {currentSlides[currentSlide].description}
            </motion.p>
           
          </div>
        </div>

        {/* Indicadores de diapositiva */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {currentSlides.map((slide, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSlideChange(index)}
              className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === index ? 'ring-2 ring-white ring-offset-2' : ''
              }`}
              style={{ backgroundColor: slide.color }}
            />
          ))}
        </div>
      </section>
  
        <header className="container mx-auto py-8">
          <Image
            src="/images/reshot-icon-bread white.png"
            alt="Company Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </header>
  
        <main className="container  mx-auto px-4 py-16">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-8 text-center text-[#D9D055]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t.title} <span className="text-white">{t.subtitle}</span>
          </motion.h1>
  
          <motion.p 
            className="text-xl mb-12 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t.description}
          </motion.p>
  
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {t.values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-6 rounded-lg text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                {value.icon === 'Leaf' && <Leaf className="mx-auto mb-4 text-[#D9D055]" size={40} />}
                {value.icon === 'Heart' && <Heart className="mx-auto mb-4 text-[#D9D055]" size={40} />}
                <h3 className="text-2xl font-semibold mb-2">{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
  
          <motion.div
            className="bg-[#D9D055] text-[#8D4C91] p-8 rounded-lg text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <MapPin className="mx-auto mb-4" size={40} />
            <p className="text-2xl font-semibold">{t.location}</p>
          </motion.div>
        </main>
  
        <footer className="container mx-auto py-8 text-center">
          <a href="#" className="inline-flex items-center text-[#D9D055] hover:underline">
            {t.learnMore} <ArrowRight className="ml-2" size={20} />
          </a>
        </footer>
      </div>
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
  
  export default AboutUsPage;