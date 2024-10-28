import React from 'react';

interface HeaderProps {
  title: string;
  backgroundColor: string; // Clase de Tailwind para el color de fondo
  textColor: string; // Clase de Tailwind para el color del texto
}

const Header: React.FC<HeaderProps> = ({ title, backgroundColor, textColor }) => {
  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Capa de fondo con color */}
      <div className={`absolute inset-0 ${backgroundColor}`} />
      
      {/* Capa de SVG */}
      <div 
        className="absolute inset-0 opacity-50 bg-cover sm:bg-contain" // Aplicamos bg-cover en móviles y bg-contain en sm o mayores
        style={{
          backgroundImage: `url('/images/iconosheader.svg')`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Contenido */}
      <div className="relative z-10 py-8 px-4">
        <h2
          className={`text-4xl font-bold text-center ${textColor}`}
        >
          {title}
        </h2>
      </div>
    </div>
  );
};

export default Header;
