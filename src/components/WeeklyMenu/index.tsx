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
        return <div className="text-center py-6 body-font">{translations[language].loading}</div>;
    }

    if (error || !products || products.length === 0) {
        return <div className="text-center py-6 text-red-500 body-font">{translations[language].error}</div>;
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
                textColor="text-[#D9D055]"
            />
           
            {/* Content */}
            <div className="relative w-full" style={{ minHeight: '400px', height: 'calc(100vh - 200px)' }}>
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
                        width={800}
                        height={800}
                        className="absolute opacity-10 filter grayscale"
                        style={{
                            bottom: '0px',
                            left: '-200px',
                        }}
                    />
                </div>
                
                {/* Content wrapper */}
                <div className="absolute inset-0 mt-64 flex flex-col md:flex-row">
                    {/* Left side content */}
                    <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-end text-white">
                       
                    </div>

                    {/* Colored Circles as division */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-full md:top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 p-2">
                        {products.map((_, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-8 h-8 sm:w-8 sm:h-8 rounded-full cursor-pointer transition-all duration-300 ${
                                    currentIndex === index ? '' : ''
                                }`}
                                style={{ backgroundColor: colors[index % colors.length] }}
                            />
                        ))}
                    </div>

         {/* Right side content (description) */}
<div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex items-center">
    <div className="p-4 sm:p-6 rounded-lg text-white w-full">
        <ul className="text-lg sm:text-xl md:text-2xl body-font">
            {currentMenu.description.split(',').map((item, index) => (
                <li key={index} className="mb-3">{item.trim()}</li> 
            ))}
        </ul>
    </div>
</div>

                </div>
            </div>
        </div>
    );
};

export default WeeklyMenuItemSection;