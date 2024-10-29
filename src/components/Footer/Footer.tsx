import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  language: 'es' | 'en';
}

const translations = {
  es: {
    login: 'Iniciar Sesión',
    buy: 'Comprar',
    aboutUs: 'Sobre Nosotros',
    contactUs: 'Contáctanos',
  },
  en: {
    login: 'Login',
    buy: 'Buy',
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
  },
};

const Footer: React.FC<FooterProps> = ({ language }) => {
  const [isWinking, setIsWinking] = useState(false);

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  const handleLogoClick = () => {
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 500);
  };

  return (
    <footer className="bg-[#884393] text-white py-6 md:py-8 lg:py-10 body-font">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-8">
          {/* Logo - Ajustado para ser más responsivo */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center md:justify-start">
            <div 
              className="cursor-pointer transition-transform duration-500 ease-in-out hover:scale-110"
              onClick={handleLogoClick}
            >
              <Image
                src={isWinking ? "/images/SVG/LogoOnWhiteParpadeo.svg" : "/images/SVG/LogoOnWhite.svg"}
                alt="Beev's oven"
                width={500}
                height={500}
                className={`w-48 md:w-56 lg:w-96 ${isWinking ? 'animate-wink' : ''}`}
              />
            </div>
          </div>

          {/* Elementos centrales */}
          <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col md:flex-row">
            <div className="hidden md:block border-l-2 lg:border-l-4 border-[#d1d451] mx-4 lg:mx-6" />
            <div className="flex flex-col items-center md:items-start flex-grow">
              {/* Contacto - Tamaños de texto ajustados */}
              <div className="flex flex-col items-center md:items-start gap-3 mb-4">
                <a href="tel:+17862800961" className="flex items-center text-xl md:text-2xl lg:text-3xl text-white hover:text-yellow-300 transition duration-300 body-font">
                  <Phone className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
                  +1 (786) 280-0961
                </a>
                <a href="mailto:info@beevsoven.com" className="flex items-center text-xl md:text-2xl lg:text-3xl text-white hover:text-yellow-300 transition duration-300 body-font">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
                  info@beevsoven.com
                </a>
              </div>

              <div className="border-b-2 lg:border-b-4 border-[#b0c4cc] w-full mb-4" />

              {/* Links de navegación - Espaciado reducido */}
              <div className="flex flex-col items-center md:items-start mb-4 w-full">
                {['login', 'buy', 'about-us', 'Contact-Us'].map((key) => (
                  <Link key={key} href={`/${key.toLowerCase()}`} passHref>
                    <span className="flex items-center mb-2 text-lg md:text-xl lg:text-2xl text-white transition-all duration-300 ease-in-out hover:text-yellow-300 hover:scale-105 title-font">
                      <Image 
                        src={`/images/${key.toLowerCase()}.svg`} 
                        alt={t(key as keyof typeof translations.en)} 
                        width={24} 
                        height={24} 
                        className="mr-2" 
                      />
                      {t(key as keyof typeof translations.en)}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Redes sociales - Iconos más pequeños */}
              <div className="flex justify-center md:justify-start space-x-4 mb-4">
                {[
                  { href: "https://www.facebook.com/profile.php?id=61566809876928", Icon: Facebook },
                  { href: "https://www.instagram.com/beevsoven/profilecard/?igsh=MXhtN2djMnJtaHp2bA==", Icon: Instagram },
                  { 
                    href: "https://www.tiktok.com/@beevsoven?_t=8qekMoITjKc&_r=1", 
                    Icon: () => (
                      <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                    )
                  }
                ].map(({ href, Icon }) => (
                  <a 
                    key={href} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white transition-all duration-300 ease-in-out hover:text-yellow-300 hover:scale-110"
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                ))}
              </div>

              {/* @ handle - Tamaño de texto ajustado */}
              <div className="text-center md:text-left text-xl md:text-2xl lg:text-3xl text-white title-font">
                @beevs oven
              </div>
            </div>
            <div className="hidden md:block border-r-2 lg:border-r-4 border-[#d1d451] mx-4 lg:mx-6" />
          </div>

          {/* Espacio vacío ajustado */}
          <div className="hidden lg:block w-1/6"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;