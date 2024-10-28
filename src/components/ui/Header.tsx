import React from 'react';
import styles from '@/styles/Header.module.css';


interface HeaderProps {
  title: string;
  backgroundColor: string;
  textColor: string;
}

const Header: React.FC<HeaderProps> = ({ title, backgroundColor, textColor }) => {
  return (
    <div className="relative mb-12 overflow-hidden min-h-[200px]">
      {/* Capa de fondo con color */}
      <div className={`absolute inset-0 ${backgroundColor}`} />
      
      {/* Capa de SVG */}
      <div 
        className={`absolute inset-0 ${styles.backgroundSvg}`}
        style={{
          backgroundImage: `url('/images/iconosheader.svg')`,
          opacity: 0.5,
        }}
      />
      
      {/* Contenido */}
      <div className="relative z-10 py-8 px-4 min-h-[200px] flex items-center justify-center">
        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center ${textColor} title-font`}>
          {title}
        </h2>
      </div>
    </div>
  );
};

export default Header;