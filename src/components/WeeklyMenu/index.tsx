import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useWeeklyMenu';
import Header from '@/components/ui/Header';

interface WeeklyMenuItemProps {
    language: 'es' | 'en';
}

const WeeklyMenuItemSection: React.FC<WeeklyMenuItemProps> = ({ language }) => {
    const { products, loading, error } = useProducts();
    const [currentIndex, setCurrentIndex] = useState(0);

    const translations = {


        es: {

            title: "Menú Semanal",
            loading: "Cargando...",
            error: "Error al cargar el menú semanal",
            noMenu: "No hay menú semanal disponible"
        },
        en: {
            title: "Weekly Menu",
            loading: "Loading...",
            error: "Error loading weekly menu",
            noMenu: "No weekly menu available"
        }
    };

    const colors = ['#D0D450', '#8D4C91', '#F2BEB7'];

    useEffect(() => {
        if (products && products.length > 0) {
            setCurrentIndex(Math.floor(Math.random() * products.length));
        }
    }, [products]);

    if (loading) {
        return <div className="text-center py-6">{translations[language].loading}</div>;
    }

    if (error || !products || products.length === 0) {
        return <div className="text-center py-6 text-red-500">{translations[language].error}</div>;
    }



    const currentMenu = products[currentIndex];
    const imageUrl = currentMenu.image?.fields?.file?.url
        ? `https:${currentMenu.image.fields.file.url}`
        : '/placeholder.jpg';

    return (
        <div className="w-full mb-12">
          <Header 
        title={translations[language].title}
        backgroundColor="bg-[#8D4C91]"
        textColor="color-[#D9D055]"
      />

           
{/* Content */}
<div className="relative w-full" style={{ height: '600px' }}>
    <Image
        src={imageUrl}
        alt={currentMenu.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 transform hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
    
    {/* Watermark Logo */}
    <div className="absolute inset-0 overflow-hidden">
        <Image
            src="/images/SVG/LogoWithOutLetters.svg"
            alt="Watermark Logo"
            width={800}  // Ajusta este tamaño según necesites
            height={800} // Asegúrate de mantener la proporción
            className="absolute opacity-10 filter grayscale"
            style={{
                bottom: '0px',  // Distancia desde el borde inferior
                left: '-200px',    // Distancia desde el borde izquierdo
            }}
        />
    </div>
                
                {/* Left side content */}
                <div className="absolute top-0 left-0 bottom-0 w-1/2 p-8 flex flex-col justify-end text-white">
                    <h3 className="text-4xl font-bold mb-4">{currentMenu.title}</h3>
                    <p className="text-2xl font-semibold">
                        ${currentMenu.price.toFixed(2)}
                    </p>
                </div>

                {/* Colored Circles as division */}
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col space-y-2">
                    {products.map((_, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                                currentIndex === index ? 'ring-2 ring-white ring-offset-1' : ''
                            }`}
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                    ))}
                </div>

                {/* Right side content (description) */}
                <div className="absolute top-0 right-0 bottom-0 w-1/2 p-8 flex items-center">
                    <div className="bg-black/40 p-6 rounded-lg text-white">
                        <ul className="text-lg">
                            {currentMenu.description.split(',').map((item, index) => (
                                <li key={index} className="mb-2">{item.trim()}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyMenuItemSection;