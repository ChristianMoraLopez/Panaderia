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
    setTimeout(() => setIsWinking(false), 500); // Duración de la animación
  };

  return (
    <footer className="bg-[#D0D450] text-white py-8 body-font">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-0">
          {/* Logo */}
          <div className="w-full md:w-1/4 flex justify-center md:justify-start">
            <div 
              className="cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
              onClick={handleLogoClick}
            >
              <Image
                src={isWinking ? "/images/SVG/LogoParpadeo.svg" : "/images/SVG/LogoOnPurple.svg"}
                alt="Beev's oven"
                width={300}
                height={60}
                className={`mb-4 ${isWinking ? 'animate-wink' : ''}`}
              />
            </div>
          </div>

          {/* Elementos centrales */}
          <div className="w-full md:w-1/4 flex flex-col md:flex-row">
            <div className="hidden md:block border-l border-purple-700 mx-4" />
            <div className="flex flex-col items-center md:items-start flex-grow">
              {/* Contacto */}
              <div className="flex flex-col items-center md:items-start gap-2 mb-4">
                <a href="tel:+17862800961" className="flex items-center text-base md:text-xl hover:text-[#8D4C91] transition duration-300 body-font">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-4" />
                  +1 (786) 280-0961
                </a>
                <a href="mailto:info@beevsoven.com" className="flex items-center text-base md:text-xl hover:text-[#8D4C91] transition duration-300 body-font">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-4" />
                  info@beevsoven.com
                </a>
              </div>

              <div className="border-b border-blue-700 w-full mb-4" />

              {/* Links de navegación */}
              <div className="flex flex-col items-center md:items-start mb-4 w-full">
                {['login', 'buy', 'about-us', 'Contact-Us'].map((key) => (
                  <Link key={key} href={`/${key.toLowerCase()}`} passHref>
                    <span className="flex items-center mb-2 text-sm md:text-base transition-all duration-300 ease-in-out hover:text-yellow-300 hover:scale-105 title-font">
                      <Image 
                        src={`/images/${key.toLowerCase()}.svg`} 
                        alt={t(key as keyof typeof translations.en)} 
                        width={20} 
                        height={20} 
                        className="mr-2" 
                      />
                      {t(key as keyof typeof translations.en)}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Redes sociales */}
              <div className="flex justify-center md:justify-start space-x-4 mb-4">
                {[
                  { href: "https://www.facebook.com/profile.php?id=61566809876928", Icon: Facebook },
                  { href: "https://www.instagram.com/beevsoven/profilecard/?igsh=MXhtN2djMnJtaHp2bA==", Icon: Instagram },
                  { 
                    href: "https://www.tiktok.com/@beevsoven?_t=8qekMoITjKc&_r=1", 
                    Icon: () => (
                      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
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
                    className="transition-all duration-300 ease-in-out hover:text-yellow-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                ))}
              </div>

              {/* @ handle */}
              <div className="text-center md:text-left text-sm md:text-base title-font">
                @beevs oven
              </div>
            </div>
            <div className="hidden md:block border-r border-purple-700 mx-4" />
          </div>

          {/* Espacio vacío */}
          <div className="hidden md:block w-1/4"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;