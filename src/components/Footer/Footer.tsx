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
    <footer className="bg-[#D0D450] text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-start">
          {/* Logo a la izquierda */}
          <div className="w-1/4">
            <div 
              className="cursor-pointer transition-transform duration-500 ease-in-out hover:scale-105"
              onClick={handleLogoClick}
            >
              <Image
                src={isWinking ? "/images/SVG/LogoParpadeo.svg" : "/images/SVG/LogoOnPurple.svg"}
                alt="Beev's oven"
                width={500}
                height={100}
                className={`mb-4 ${isWinking ? 'animate-wink' : ''}`}
              />
            </div>
          </div>

          {/* Elementos centrales */}
          <div className="w-1/2 flex">
            <div className="border-l border-purple-700 mx-4" />
            <div className="flex flex-col items-center flex-grow">
              <div className="flex items-center mb-2">
              <a href="tel:+17862800961" className="flex items-center text-xl hover:text-[#8D4C91] transition duration-300">
                    <Phone className="w-6 h-6 mr-4" />
                    +1 (786) 280-0961
                  </a>
              </div>
              <div className="flex items-center mb-4">
              <a href="mailto:contacto@beevsoven.com" className="flex items-center text-xl hover:text-[#8D4C91] transition duration-300">
                    <Mail className="w-6 h-6 mr-4" />
                    contacto@beevsoven.com
                  </a>
              </div>

              <div className="border-b border-blue-700 w-full mb-4" />

              <div className="flex flex-col items-center mb-4">
                {['login', 'buy', 'about-us', 'ContactUs'].map((key) => (
                  <Link key={key} href={`/${key.toLowerCase()}`} passHref>
                    <span className="flex items-center mb-2 transition-all duration-300 ease-in-out hover:text-yellow-300 hover:scale-105">
                      <Image src={`/images/${key.toLowerCase()}.svg`} alt={t(key as keyof typeof translations.en)} width={24} height={24} className="mr-2" />
                      {t(key as keyof typeof translations.en)}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex justify-center space-x-4 mb-4">
                {[
                  { href: "https://www.facebook.com/profile.php?id=61566809876928", Icon: Facebook },
                  { href: "https://www.instagram.com/beevsoven/profilecard/?igsh=MXhtN2djMnJtaHp2bA==", Icon: Instagram },
                  { 
                    href: "https://www.tiktok.com/@beevsoven?_t=8qekMoITjKc&_r=1", 
                    Icon: () => (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                    )
                  }
                ].map(({ href, Icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="transition-all duration-300 ease-in-out hover:text-yellow-300 hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>

              <div className="text-center">
                @beevs oven
              </div>
            </div>
            <div className="border-r border-purple-700 mx-4" />
          </div>

          {/* Espacio vacío a la derecha */}
          <div className="w-1/4"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;