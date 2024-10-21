import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Leaf, Heart } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import { useState } from 'react';

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

interface AboutUsPageProps {
    initialLanguage: Language;
  }
  
  const AboutUsPage: React.FC<AboutUsPageProps> = ({ initialLanguage = 'es' }) => {
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const [cartCount] = useState(0);
  
    const toggleLanguage = () => {
      setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };
  
    const t = translations[language];
  
    return (
      <div className="bg-gradient-to-br pt-36 from-[#8D4C91] to-[#6A3B6E] min-h-screen text-white">
        <Navbar cartCount={cartCount} language={language} toggleLanguage={toggleLanguage} />
  
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
  
  export default AboutUsPage;