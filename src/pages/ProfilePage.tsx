import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useCart } from '@/store/Cart';
import Image from 'next/image';
import { Cake, Calendar, ShoppingBag, Coffee, Star, Award  } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';

type ContentfulLink = {
  type: "Link";
  linkType: "Entry";
  id: string;
};

type ContentfulEntry = {
  fields: {
    name: { 'en-US': string };
    description: { 'en-US': string };
    price: { 'en-US': number };
    quantity: { 'en-US': number };
    image: { 
      'en-US': {
        sys: {
          id: string;
        }
      } 
    };
  };
};

type HistoryItem = ContentfulLink | ContentfulEntry;

type PurchaseHistoryItem = {
  id: string;
  date: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  total: number;
};

const translations = {
  es: {
    loading: 'Horneando su perfil...',
    healthCorner: 'Mi Rincón Saludable',
    healthProfile: 'Perfil de Salud',
    name: 'Nombre',
    registryDate: 'Fecha de Registro',
    wellnessLevel: 'Nivel de Bienestar',
    healthyPurchases: 'Compras Saludables',
    dateNotAvailable: 'Fecha no disponible',
    guestTitle: 'Bienvenido, Invitado',
    guestMessage: 'Inicia sesión para acceder a todas las funciones de tu perfil saludable.',
    login: 'Iniciar Sesión',
    purchaseHistory: 'Historial de Compras Saludables',
    noPurchases: 'Aún no has realizado compras. ¡Es hora de endulzar tu día!',
    exploreMenu: 'Explorar Menú',
    purchaseDate: 'Compra del',
    quantity: 'Cantidad',
    unitPrice: 'Precio unitario',
    total: 'Total',
    purchaseTotal: 'Total de la compra',
    noDetails: 'No hay detalles disponibles para esta compra.',
    didYouKnow: '¿Sabías que...?',
    funFact: 'Nuestro pan integral más vendido, el Pan de Semillas, está elaborado con una mezcla de 7 granos diferentes para una nutrición óptima.',
    logout: 'Cerrar Sesión',
    healthLevels: {
      beginner: {
        level: 'Principiante Saludable',
        description: 'Estás comenzando tu viaje hacia una vida más saludable.'
      },
      enthusiast: {
        level: 'Entusiasta del Bienestar',
        description: 'Estás desarrollando hábitos saludables constantemente.'
      },
      adept: {
        level: 'Adepto del Equilibrio',
        description: 'Has demostrado un compromiso sólido con tu bienestar.'
      },
      master: {
        level: 'Maestro de la Nutrición',
        description: 'Tu dedicación a la alimentación saludable es admirable.'
      },
      guru: {
        level: 'Gurú del Estilo de Vida Saludable',
        description: '¡Eres un ejemplo a seguir en el camino del bienestar!'
      }
    }
  },
  en: {
    loading: 'Baking your profile...',
    healthCorner: 'My Health Corner',
    healthProfile: 'Health Profile',
    name: 'Name',
    registryDate: 'Registry Date',
    wellnessLevel: 'Wellness Level',
    healthyPurchases: 'Healthy Purchases',
    dateNotAvailable: 'Date not available',
    guestTitle: 'Welcome, Guest',
    guestMessage: 'Log in to access all features of your healthy profile.',
    login: 'Login',
    purchaseHistory: 'Healthy Purchase History',
    noPurchases: "You haven't made any purchases yet. Time to sweeten your day!",
    exploreMenu: 'Explore Menu',
    purchaseDate: 'Purchase from',
    quantity: 'Quantity',
    unitPrice: 'Unit price',
    total: 'Total',
    purchaseTotal: 'Purchase total',
    noDetails: 'No details available for this purchase.',
    didYouKnow: 'Did you know...?',
    funFact: 'Our bestselling whole grain bread, the Seed Bread, is made with a blend of 7 different grains for optimal nutrition.',
    logout: 'Logout',
    healthLevels: {
      beginner: {
        level: 'Health Beginner',
        description: "You're starting your journey towards a healthier life."
      },
      enthusiast: {
        level: 'Wellness Enthusiast',
        description: "You're consistently developing healthy habits."
      },
      adept: {
        level: 'Balance Adept',
        description: "You've shown a solid commitment to your wellness."
      },
      master: {
        level: 'Nutrition Master',
        description: 'Your dedication to healthy eating is admirable.'
      },
      guru: {
        level: 'Healthy Lifestyle Guru',
        description: "You're a role model on the path to wellness!"
      }
    }
  }
};

const Profile = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const { profile, loading: profileLoading, error, refetch } = useCustomerProfile(user?.email);
  const { count } = useCart();
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [healthLevel, setHealthLevel] = useState({ level: '', description: '' });
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  
  useEffect(() => {
    
  const getImageUrl = (imageId: string) => {
    if (!imageId) return '/placeholder-image.jpg';
    if (imageId.startsWith('http')) return imageId;
    if (imageId.startsWith('//')) return `https:${imageId}`;
    return `/images/${imageId}`; // Fallback to local images directory
  };

  const processContentfulHistory = () => {
    if (!profile || !profile.history) return [];
    
    try {
      return Object.entries(profile.history)
        .map(([key, value]) => {
          const historyItem = value as HistoryItem;
          if ('fields' in historyItem) {
            const quantity = historyItem.fields.quantity?.['en-US'] || 1;
            const price = historyItem.fields.price['en-US'];
            const imageId = historyItem.fields.image?.['en-US']?.sys?.id || '';
            
            return {
              id: key,
              date: new Date().toISOString(),
              items: [{
                id: parseInt(key),
                name: historyItem.fields.name['en-US'],
                price: price,
                quantity: quantity,
                image_url: getImageUrl(imageId)
              }],
              total: price * quantity
            };
          }
          return null;
        })
        .filter((item): item is PurchaseHistoryItem => item !== null);
    } catch (error) {
      console.error("Error processing Contentful history:", error);
      return [];
    }
  };
    
      const calculateHealthLevel = (purchases: number) => {
        setPurchaseCount(purchases);
        const t = translations[language].healthLevels;
        
        if (purchases < 20) {
          setHealthLevel(t.beginner);
        } else if (purchases < 40) {
          setHealthLevel(t.enthusiast);
        } else if (purchases < 70) {
          setHealthLevel(t.adept);
        } else if (purchases < 150) {
          setHealthLevel(t.master);
        } else {
          setHealthLevel(t.guru);
        }
      };
    const updatePurchaseHistory = async () => {
      if (!user) {
        setPurchaseHistory([]);
        calculateHealthLevel(0);
        return;
      }
      
      if (profile) {
        const contentfulHistory = processContentfulHistory();
        setPurchaseHistory(contentfulHistory);
        calculateHealthLevel(contentfulHistory.length);
      }
    };

    updatePurchaseHistory();
  }, [user, profile, refetch, language]); 

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = translations[language];

  if (authLoading || profileLoading) {
    return (
      <>
        <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
        <div className="max-w-md mx-auto mt-32 p-8 bg-[#926cad] rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white body-font">{t.loading}</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
        <div className="max-w-md mx-auto mt-32 p-8 bg-red-50 rounded-lg shadow-lg text-center">
          <p className="text-red-600 body-font">{error}</p>
        </div>
      </>
    );
  }

  const renderPurchaseHistory = () => {
    if (!purchaseHistory || purchaseHistory.length === 0) {
      return (
        <div className="bg-[#d1d451] p-8 rounded-lg text-center">
          <ShoppingBag className="w-12 h-12 text-white mx-auto mb-4" />
          <p className="text-white font-semibold body-font">{t.noPurchases}</p>
          <Link 
            href="/ProductGalleryPage" 
            className="mt-4 inline-block bg-[#926cad] hover:bg-[#7d5c94] text-white font-bold py-2 px-4 rounded transition duration-300 body-font"
          >
            {t.exploreMenu}
          </Link>
        </div>
      );
    }

    return purchaseHistory.map((purchase) => (
      <div key={purchase.id} className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-[#926cad] mb-2 sharp-font">
          {t.purchaseDate} {new Date(purchase.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
        </h3>
        {purchase.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 mb-2">
            {item.image_url && (
              <Image
                src={item.image_url}
                alt={item.name}
                width={50}
                height={50}
                className="rounded"
              />
            )}
            <div>
              <p className="font-medium sharp-font">{item.name}</p>
              <p className="text-sm text-gray-600 body-font">
                {t.quantity}: {item.quantity} - {t.unitPrice}: ${item.price.toFixed(2)} - 
                {t.total}: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <p className="text-right font-semibold body-font">{t.purchaseTotal}: ${purchase.total.toFixed(2)}</p>
      </div>
    ));
  };

  return (
    <>
      <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
      <div className="max-w-4xl mx-auto mt-32 p-8 bg-[#926cad] rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-white text-center title-font">{t.healthCorner}</h1>
        
        {user && profile ? (
          <div className="bg-white p-6 rounded-lg shadow-inner mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#926cad] flex items-center title-font">
              <Coffee className="w-6 h-6 mr-2 text-[#926cad]" />
              {t.healthProfile}
            </h2>
            <div className="space-y-3">
              <p className="flex items-center body-font">
                <Cake className="w-5 h-5 mr-2 text-[#926cad]" /> 
                <span className="font-medium text-black">{t.name}:</span> 
                <span className="ml-2 text-black">{profile.name} {profile.lastName}</span>
              </p>
              <p className="flex items-center body-font">
                <Calendar className="w-5 h-5 mr-2 text-[#926cad]" /> 
                <span className="font-medium text-black">{t.registryDate}:</span> 
                <span className="ml-2 text-black">
                  {profile.registry ? new Date(profile.registry).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US') : t.dateNotAvailable}
                </span>
              </p>
              <p className="flex items-center body-font">
                <Star className="w-5 h-5 mr-2 text-[#926cad]" /> 
                <span className="font-medium text-black">{t.wellnessLevel}:</span> 
                <span className="ml-2 text-black">{healthLevel.level}</span>
              </p>
              <p className="flex items-center body-font">
                <Award className="w-5 h-5 mr-2 text-[#926cad]" /> 
                <span className="font-medium text-black">{t.healthyPurchases}:</span> 
                <span className="ml-2 text-black">{purchaseCount}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-inner mb-6 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-[#926cad] title-font">{t.guestTitle}</h2>
            <p className="text-gray-600 mb-4 body-font">{t.guestMessage}</p>
            <Link 
              href="/login" 
              className="bg-[#d1d451] hover:bg-[#bfc048] text-white font-bold py-2 px-4 rounded transition duration-300 body-font"
            >
              {t.login}
            </Link>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-4 text-[#926cad] flex items-center title-font">
            <ShoppingBag className="w-6 h-6 mr-2 text-[#926cad]" />
            {t.purchaseHistory}
          </h2>
          {renderPurchaseHistory()}
        </div>
        
        <div className="mt-8 bg-[#b0c4cc] p-6 rounded-lg shadow-inner text-center">
          <h3 className="text-xl font-semibold text-[#926cad] mb-3 title-font">{t.didYouKnow}</h3>
          <p className="text-gray-700 body-font">{t.funFact}</p>
        </div>

        {user && (
          <div className="mt-8 text-center">
            <button
              onClick={logout}
              className="bg-[#d1d451] hover:bg-[#bfc048] text-white font-bold py-2 px-4 rounded transition duration-300 body-font"
            >
              {t.logout}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;