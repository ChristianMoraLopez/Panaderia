import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {  MapPin, Leaf, Heart, MessageCircle, Star, Eye, Target, Shield, Smile,
  
 } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Instagram, Facebook } from 'lucide-react';
import { useEffect } from 'react';
import StorySection from '@/components/StoryModal';
import{useImages} from '@/hooks/useAboutImages';
import Footer from '@/components/Footer/Footer';




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
  beevsSection: {
    title: string;
    description1: string;
    description2: string;
    description3: string;
    highlight: string;
  }
  values2: TranslationValue[];
  slider: {
    title: string;
    subtitle: string;
  }
};

type Translations = {
  [key in Language]: Translation;
};

const translations: Translations = {
  es: {
    title: "Sobre",
    subtitle: "Nosotros",
    description: "Somos una compañía comprometida con la producción de alimentos saludables y nutritivos de consumo humano. Libres de aditivos, químicos, utilizando solamente productos que son beneficiosos para la salud y enseñando la manera de llevar un estilo de vida sin gluten, azúcar y aditivos, pero delicioso.",
    location: "Ubicados con orgullo en Florida, EE.UU.",
    learnMore: "Conoce más sobre nuestra misión",
    values: [
      {
        title: "Honestidad",
        description: "Mantenemos la transparencia y veracidad en todos nuestros procesos y relaciones.",
        icon: "Heart"
      },
      {
        title: "Responsabilidad",
        description: "Nos comprometemos con la calidad y el bienestar de nuestros clientes.",
        icon: "Shield"
      },
      {
        title: "Humildad",
        description: "Mantenemos una actitud de aprendizaje continuo y respeto hacia todos.",
        icon: "Smile"
      },
      {
        title: "Excelencia",
        description: "Buscamos la mejora continua en todos nuestros productos y servicios.",
        icon: "Star"
      },
      {
        title: "Transparencia",
        description: "Compartimos abiertamente nuestros procesos e ingredientes.",
        icon: "Eye"
      }
    ],
    beevsSection: {
      title: "Mi Historia",
      description1: "Hola, mi nombre es Belkis Escobar, y estoy emocionada de compartir con ustedes un capítulo de mi vida que me ha transformado de maneras que nunca imaginé. Como esposa, madre e hija y trabajadora bancaria, mi vida era ocupada, pero no fue hasta el 2022 que encontré mi verdadera vocación en la cocina con amor y pasión. Mi viaje comenzó con una llamada de atención. Después de ser diagnosticada con presión arterial alta y prediabetes, me encontré en una encrucijada. Con 237 libras, sabía que necesitaba hacer un cambio. No se trataba solo de números en una balanza; se trataba de recuperar mi salud y mi vida. Ese fue el punto de inflexión cuando decidí someterme a una cirugía de bypass gástrico. Después de la cirugía, perdí casi 100 libras, pero lo más importante fue que comencé a aprender sobre mi cuerpo y lo que realmente necesitaba. Descubrí que los dulces \"mis leales compañeros\" ahora eran mis enemigos. Fue desalentador darme cuenta de que muchos de mis postres favoritos podían sabotear mi nueva salud. Pero en lugar de sentirme derrotada, canalicé esa energía en la creación de versiones más saludables de los postres que amaba.",
      description2: "Cocinar siempre había sido una pasión para mí, pero ahora estaba impregnada de un propósito más profundo: nutrir no solo mi paladar, sino también la salud de mi familia. Comencé a experimentar en la cocina, reemplazando los azúcares refinados por edulcorantes naturales y refinando recetas para mantener la indulgencia sin la culpa. Con cada creación, sentía una oleada de alegría, sabiendo que no solo alimentaba a mi familia, sino que ponía amor en cada bocado. Cada receta se convirtió en una historia, una conexión con la cultura de mi familia. Reunía a mis seres queridos alrededor de la isla de la cocina compartiendo relatos de cómo mi abuela solía hornear o cómo mi madre preparaba comidas especiales para las celebraciones. Cada plato era un recuerdo, una forma de honrar a quienes vinieron antes que yo mientras abría el camino hacia un futuro más saludable. Ahora, disfruto del papel de narradora a través de la comida. He convertido mi pasión por la cocina en una experiencia alegre, creando comidas y postres saludables que reúnen a todos alrededor de la mesa. Mi historia es un recordatorio de que, a veces, los desafíos de la vida pueden llevar a hermosas transformaciones. Así que, abracemos cada sabor, cada momento y cada recuerdo compartido alrededor de una comida. Después de todo, las mejores recetas se sazonan con amor.",
      description3: "Desde siempre, mi cocina ha sido mi refugio. Entre el ruido de las ollas y los aromas, encontré paz. Pero no fue hasta que nació Beev's Oven que transformé mi pasión en algo más. Aquí es donde aprendí a combinar salud e indulgencia. En mi familia, los postres son más que dulces: son una tradición que conecta con el pasado y trae alegría. Siempre he estado orgullosa de ofrecer delicias caseras en nuestras reuniones, pero con el tiempo, me preocupé más por los ingredientes. Vi cómo lo que comemos afecta nuestra salud, y quise hacer la diferencia. Así nació Beev's Oven, con un compromiso claro: crear postres saludables y nutritivos. En Beev's Oven, no solo horneamos, creamos con amor. Cada receta es personalizada, desde opciones sin lácteos hasta sin gluten, porque todos merecen sentirse incluidos. Utilizo ingredientes naturales y de calidad, como harina de almendra, azúcar de coco orgánica y superalimentos. Cada bocado es una celebración de sabor y bienestar. Consulto regularmente con familias para entender sus necesidades, y la felicidad en sus rostros al disfrutar de un postre sin culpa no tiene precio. En Beev's Oven, salud y sabor están en perfecta armonía. Mi misión es demostrar que podemos disfrutar de placeres sin culpa. Con cada postre que preparo, cuido, conecto y construyo comunidad. Beev's Oven está aquí para compartir amor, un postre a la vez.",
      highlight: "Descubre mi historia"
    },
    values2:[
      {
        title: "Misión",
        description: "Nuestra misión es producir y entregar productos y alimentos de calidad e innovación, satisfaciendo de manera continua las necesidades de nuestros clientes, colaboradores y socios estratégicos. Nos comprometemos a mantener altos estándares de excelencia y a fomentar relaciones duraderas que impulsen el crecimiento mutuo.",
        icon: "Target"
      },
      {
        title: "Visión",
        description: "Ser la compañía productora más grande de la Florida en la producción de comida saludable de mayor aporte nutricional en alimentos terminados y deliciosos.",
        icon: "Eye"
      },
      {
        title: "Valores",
        description: "Honestidad, Responsabilidad, Humildad, Excelencia y Transparencia son los pilares que guían nuestro trabajo diario.",
        icon: "Star"
      }
    ],
    slider: {
      title: "Team Beev's",
      subtitle: "Conócenos un poco más"
    }
  },
  en: {
    title: "About",
    subtitle: "Us",
    description: "We are a company committed to producing healthy and nutritious foods for human consumption. Free from additives and chemicals, using only products that are beneficial to health and teaching how to maintain a gluten-free, sugar-free, and additive-free lifestyle that's still delicious.",
    location: "Proudly located in Florida, USA",
    learnMore: "Learn more about our mission",
    values: [
      {
        title: "Honesty",
        description: "We maintain transparency and truthfulness in all our processes and relationships.",
        icon: "Heart"
      },
      {
        title: "Responsibility",
        description: "We are committed to the quality and well-being of our customers.",
        icon: "Shield"
      },
      {
        title: "Humility",
        description: "We maintain an attitude of continuous learning and respect towards everyone.",
        icon: "Smile"
      },
      {
        title: "Excellence",
        description: "We seek continuous improvement in all our products and services.",
        icon: "Star"
      },
      {
        title: "Transparency",
        description: "We openly share our processes and ingredients.",
        icon: "Eye"
      }
    ],
    beevsSection: {
      title: "My Story",
      description1: "Hi, my name is Belkis Escobar, and I'm excited to share with you a chapter of my life that has transformed me in ways I never imagined. As a wife, mother, daughter, and bank worker, my life was busy, but it wasn't until 2022 that I found my true calling in cooking with love and passion. My journey began with a wake-up call. After being diagnosed with high blood pressure and prediabetes, I found myself at a crossroads. At 237 pounds, I knew I needed to make a change. It wasn't just about numbers on a scale; it was about reclaiming my health and my life. That was the turning point when I decided to undergo gastric bypass surgery. After the surgery, I lost almost 100 pounds, but most importantly, I began to learn about my body and what it really needed. I discovered that sweets, 'my loyal companions,' were now my enemies. It was disheartening to realize that many of my favorite desserts could sabotage my new health. But instead of feeling defeated, I channeled that energy into creating healthier versions of the desserts I loved.",
      description2: "Cooking had always been a passion for me, but now it was infused with a deeper purpose: to nourish not just my palate, but also my family's health. I began experimenting in the kitchen, replacing refined sugars with natural sweeteners and refining recipes to maintain indulgence without guilt. With each creation, I felt a surge of joy, knowing I was not just feeding my family, but putting love into every bite. Each recipe became a story, a connection to my family's culture. I would gather my loved ones around the kitchen island, sharing stories of how my grandmother used to bake or how my mother prepared special meals for celebrations. Each dish was a memory, a way to honor those who came before me while paving the way for a healthier future. Now, I enjoy the role of storyteller through food. I've turned my passion for cooking into a joyful experience, creating healthy meals and desserts that bring everyone together around the table. My story is a reminder that sometimes life's challenges can lead to beautiful transformations. So, let's embrace every flavor, every moment, and every memory shared around a meal. After all, the best recipes are seasoned with love.",
      description3: "My kitchen has always been my sanctuary. Among the noise of pots and aromas, I found peace. But it wasn't until Beev's Oven was born that I transformed my passion into something more. This is where I learned to combine health and indulgence. In my family, desserts are more than sweets: they're a tradition that connects with the past and brings joy. I've always been proud to offer homemade delights at our gatherings, but over time, I became more concerned about ingredients. I saw how what we eat affects our health, and I wanted to make a difference. That's how Beev's Oven was born, with a clear commitment: to create healthy and nutritious desserts. At Beev's Oven, we don't just bake, we create with love. Each recipe is personalized, from dairy-free to gluten-free options, because everyone deserves to feel included. I use natural, quality ingredients like almond flour, organic coconut sugar, and superfoods. Every bite is a celebration of flavor and wellness. I regularly consult with families to understand their needs, and the happiness on their faces when enjoying a guilt-free dessert is priceless. At Beev's Oven, health and flavor are in perfect harmony. My mission is to show that we can enjoy pleasures without guilt. With every dessert I prepare, I care, connect, and build community. Beev's Oven is here to share love, one dessert at a time.",
      highlight: "Discover my story"
    },
    values2:[
      {
        title: "Mission",
        description: "Our mission is to produce and deliver quality and innovative products and foods, continuously satisfying the needs of our customers, collaborators, and strategic partners. We are committed to maintaining high standards of excellence and fostering lasting relationships that drive mutual growth.",
        icon: "Target"
      },
      {
        title: "Vision",
        description: "To be Florida's largest producing company in the production of healthy food with the highest nutritional value in finished and delicious foods.",
        icon: "Eye"
      },
      {
        title: "Values",
        description: "Honesty, Responsibility, Humility, Excellence, and Transparency are the pillars that guide our daily work.",
        icon: "Star"
      }
    ],
    slider: {
      title: "Team Beev's",
      subtitle: "Get to know us a little better"
    }
  }
};

// Simplificamos las diapositivas para solo tener las imágenes
const slides = {
  es: [
    {
      image: "https://images.pexels.com/photos/2216350/pexels-photo-2216350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      color: "#F3BEB6"
    },
    {
      image: "https://images.pexels.com/photos/1587830/pexels-photo-1587830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      color: "#936DAD"
    },
    {
      image: "https://images.pexels.com/photos/35666/cooking-baby-only-kitchen.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      color: "#D1D550"
    }
  ],
  en: [
    {
      image: "https://images.pexels.com/photos/2216350/pexels-photo-2216350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      color: "#F3BEB6"
    },
    {
      image: "https://images.pexels.com/photos/1587830/pexels-photo-1587830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      color: "#936DAD"
    },
    {
      image: "https://images.pexels.com/photos/35666/cooking-baby-only-kitchen.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      color: "#D1D550"
    }
  ]
};

interface AboutUsPageProps {
    initialLanguage: Language;
  }
  
 
// Define los colores fijos fuera del componente
const SLIDE_COLORS = ['#F3BEB6', '#936DAD', '#D1D550'];

const AboutUsPage: React.FC<AboutUsPageProps> = ({ initialLanguage = 'es' }) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [cartCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images, loading } = useImages();
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };
  

  const t = translations[language];


  const currentSlides = React.useMemo(() => {
    if (images && images.length > 0) {
      return images.map((image, index) => {
        const imageUrl = image.imageAboutUs.fields.file.url;
        // Usa el color del arreglo según el índice, y si se acaban los colores, vuelve a empezar
        const slideColor = SLIDE_COLORS[index % SLIDE_COLORS.length];
        return {
          image: imageUrl ? `https:${imageUrl}` : '/fallback-image.jpg',
          color: slideColor
        };
      });
    }
    return slides[language];
  }, [images, language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % currentSlides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [currentSlides.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8D4C91] to-[#6A3B6E]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-[#8D4C91] to-[#6A3B6E] min-h-screen text-white">
      <Navbar cartCount={cartCount} language={language} toggleLanguage={toggleLanguage} />

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/17862800961?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20acerca%20de%20sus%20productos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-white/20 text-white p-4 rounded-full shadow-lg hover:bg-white/30 backdrop-blur-sm transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-12 h-12" />
      </motion.a>
      
      {/* Main Slider Section */}
      <section className="h-screen relative overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentSlides[currentSlide]?.image || '/fallback-image.jpg'}
              alt="Team Beev's"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70" />
          </motion.div>
        </AnimatePresence>


          {/* Social Media Buttons */}
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-10 hidden sm:flex">
            <SocialButton Icon={Instagram} href="https://www.instagram.com/beevsoven/profilecard/?igsh=MXhtN2djMnJtaHp2bA==" />
            <SocialButton Icon={Facebook} href="https://www.facebook.com/profile.php?id=61566809876928" />
            <SocialButton 
              Icon={() => (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              )} 
              href="https://www.tiktok.com/@beevsoven?_t=8qekMoITjKc&_r=1" 
            />
          </div>
  
          {/* Central Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10 px-4">
              <motion.h2
                key={`title-${currentSlide}-${language}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter text-amber-100 drop-shadow-lg title-font"
              >
                {translations[language].slider.title}
              </motion.h2>
              <motion.p
                key={`subtitle-${currentSlide}-${language}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl lg:text-2xl font-light mb-12 max-w-2xl mx-auto text-amber-50 drop-shadow body-font"
              >
                {translations[language].slider.subtitle}
              </motion.p>
            </div>
          </div>
  
          {/* Slider indicators */}
<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
  {currentSlides.map((slide, index) => {
    // Determina el color del botón y su estado activo
    const buttonColor = slide.color;
    const isActive = currentSlide === index;
    
    return (
      <motion.button
        key={index}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleSlideChange(index)}
        animate={{ 
          scale: isActive ? 1.1 : 1,
          opacity: isActive ? 1 : 0.6
        }}
        className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300
          ${isActive ? 'ring-2 ring-white ring-offset-2' : ''}
        `}
        style={{ 
          backgroundColor: buttonColor,
          boxShadow: isActive ? `0 0 10px ${buttonColor}` : 'none'
        }}
      />
    );
  })}
</div>
        </section>
  
        <header className="container mx-auto py-8">
          <Image
            src="/images/reshot-icon-bread white.png"
            alt="Company Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </header>
  
        <main className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-6xl md:text-7xl font-bold mb-8 text-center text-[#D9D055] title-font"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t.title} <span className="text-white title-font">{t.subtitle}</span>
        </motion.h1>

        <motion.p 
          className="text-xl mb-12 text-center max-w-3xl mx-auto body-font"
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
              {value.icon === 'MessageCircle' && <MessageCircle className="mx-auto mb-4 text-[#D9D055]" size={40} />}
              {value.icon === 'Star' && <Star className="mx-auto mb-4 text-[#D9D055]" size={40} />}
              {value.icon === 'Eye' && <Eye className="mx-auto mb-4 text-[#D9D055]" size={40} />}
              {value.icon === 'Target' && <Target className="mx-auto mb-4 text-[#D9D055]" size={40} />}
              {value.icon === 'Shield' && <Shield className="mx-auto mb-4 text-[#D9D055]" size={40} />}
              {value.icon === 'Smile' && <Smile className="mx-auto mb-4 text-[#D9D055]" size={40} />}
              
              <h3 className="text-2xl font-semibold mb-2 title-font">{value.title}</h3>
              <p className="body-font">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 mb-16">
         <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src={images?.[0]?.imageAboutUs.fields.file.url
                ? `https:${images[0].imageAboutUs.fields.file.url }`
                : slides[language][0].image}
              alt="Beevs Oven Bakery"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </motion.div>
          
          <StorySection translations={translations} language={language} />
        </div>


          {/* Sección corregida usando values2 */}
      <div className="grid md:grid-cols-3 gap-8 mt-14 mb-16">
        {t.values2.map((value, index) => (
          <motion.div
            key={index}
            className="bg-white/10 p-6 rounded-lg text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            {value.icon === 'Target' && <Target className="mx-auto mb-4 text-[#D9D055]" size={40} />}
            {value.icon === 'Eye' && <Eye className="mx-auto mb-4 text-[#D9D055]" size={40} />}
            {value.icon === 'Star' && <Star className="mx-auto mb-4 text-[#D9D055]" size={40} />}
          
            <h3 className="text-2xl font-semibold mb-2 title-font">{value.title}</h3>
            <p className="body-font">{value.description}</p>
          </motion.div>
        ))}
      </div>
      </div>

        <motion.div
          className="bg-[#D9D055] text-[#8D4C91] p-8 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <MapPin className="mx-auto mb-4" size={40} />
          <p className="text-2xl font-semibold title-font">{t.location}</p>
        </motion.div>
      </main>

      <Footer language={language} />
    </div>
  );
};

 // Definición de tipos para las props de SocialButton
 interface SocialButtonProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
}

// SocialButton with typography
const SocialButton: React.FC<SocialButtonProps> = ({ Icon, href }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors body-font"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon className="w-6 h-6 text-white" />
  </motion.a>
);

export default AboutUsPage;