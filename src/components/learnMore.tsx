import React from 'react';
import Image from 'next/image';
import Header from './ui/Header';

interface LearnMoreProps {
  language: 'es' | 'en';
}

const LearnMore: React.FC<LearnMoreProps> = ({ language }) => {
  const translations = {
    es: {
      title: "Conócenos Más",
      videos: "Videos",
      recipes: "Recetas",
      beevs: "BeevsOven",
      seeMore: "Ver más",
    },
    en: {
      title: "Learn More About Us",
      videos: "Videos",
      recipes: "Recipes",
      beevs: "BeevsOven",
      seeMore: "See more",
    }
  };

  const t = translations[language];

  const cards = [
    { 
      title: t.videos, 
      image: '/images/galletas.jpg',
      link: 'https://www.instagram.com/beevsoven/profilecard/?igsh=MXhtN2djMnJtaHp2bA%3D%3D '
    },
    { 
      title: t.recipes, 
      image: '/images/postre.jpg',
      link: 'https://www.facebook.com/profile.php?id=61566798357587'
    },
    { 
      title: t.beevs, 
      image: '/images/beevsoven.jpg',
      link: 'https://www.tiktok.com/@beevsoven?_t=8qqYITEYSOx&_r=1'
    },
  ];

  return (
    <section className="bg-cream-100 py-16 body-font">
      <Header 
        title={translations[language].title}
        backgroundColor="bg-[#F3BEB6]"
        textColor="text-[#8D4C91]"
      />
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="relative h-64 md:h-80">
                <Image
                  src={card.image}
                  alt={card.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="title-font text-2xl font-bold text-[#8D4C91] mb-4">
                  {card.title}
                </h3>
                <a 
                  href={card.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="body-font bg-[#B6D3D2] hover:bg-[#9CC6C5] text-white font-bold py-3 px-6 rounded-full transition duration-300 inline-block text-center w-full"
                >
                  {t.seeMore}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnMore;