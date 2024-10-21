import React from 'react';
import { Cake, Cookie, Croissant, Coffee, Utensils } from 'lucide-react';

interface HeaderProps {
  title: string;
  backgroundColor: string;
  textColor: string;
}

const Header: React.FC<HeaderProps> = ({ title, backgroundColor, textColor }) => {
  const BackgroundIcons = () => (
    <>
      {[Cake, Cookie, Croissant, Coffee, Utensils].map((Icon, index) => (
        <Icon 
          key={index} 
          className={`w-8 h-8 ${textColor} opacity-10`}
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
    <div className="relative mb-12 overflow-hidden">
      <div className={`absolute inset-0 ${backgroundColor}`}></div>
      <div className="relative z-10 py-6 px-4">
        <h2 className={`text-4xl font-bold text-center ${textColor} relative z-20`}>
          {title}
        </h2>
        <div className="absolute inset-0 z-10">
          {[...Array(50)].map((_, i) => (
            <BackgroundIcons key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;