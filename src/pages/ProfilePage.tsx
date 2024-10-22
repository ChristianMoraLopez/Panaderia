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

const Profile = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const { profile, loading: profileLoading, error, refetch } = useCustomerProfile(user?.email);
  const { count } = useCart();
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [healthLevel, setHealthLevel] = useState({ level: 'Principiante Saludable', description: 'Estás comenzando tu viaje hacia una vida más saludable.' });
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const processContentfulHistory = () => {
    if (!profile || !profile.history) return [];
    
    try {
      return Object.entries(profile.history)
        .map(([key, value]) => {
          const historyItem = value as HistoryItem;
          if ('fields' in historyItem) {
            const quantity = historyItem.fields.quantity ? historyItem.fields.quantity['en-US'] : 1;
            const price = historyItem.fields.price['en-US'];
            const imageUrl = historyItem.fields.image && historyItem.fields.image['en-US'] ? 
              historyItem.fields.image['en-US'].sys.id : '';
            
            return {
              id: key,
              date: new Date().toISOString(),
              items: [{
                id: parseInt(key),
                name: historyItem.fields.name['en-US'],
                price: price,
                quantity: quantity,
                image_url: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl
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

  useEffect(() => {
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
  }, [user, profile, refetch]); 
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const calculateHealthLevel = (purchases: number) => {
    setPurchaseCount(purchases);
    if (purchases < 5) {
      setHealthLevel({ level: 'Principiante Saludable', description: 'Estás comenzando tu viaje hacia una vida más saludable.' });
    } else if (purchases < 10) {
      setHealthLevel({ level: 'Entusiasta del Bienestar', description: 'Estás desarrollando hábitos saludables constantemente.' });
    } else if (purchases < 20) {
      setHealthLevel({ level: 'Adepto del Equilibrio', description: 'Has demostrado un compromiso sólido con tu bienestar.' });
    } else if (purchases < 35) {
      setHealthLevel({ level: 'Maestro de la Nutrición', description: 'Tu dedicación a la alimentación saludable es admirable.' });
    } else {
      setHealthLevel({ level: 'Gurú del Estilo de Vida Saludable', description: '¡Eres un ejemplo a seguir en el camino del bienestar!' });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <>
         <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
        <div className="max-w-md mx-auto mt-32 p-8 bg-yellow-50 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700 mx-auto"></div>
          <p className="mt-4 text-yellow-800">Horneando su perfil...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
        <div className="max-w-md mx-auto mt-32 p-8 bg-red-50 rounded-lg shadow-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </>
    );
  }

  const renderPurchaseHistory = () => {
    if (!purchaseHistory || purchaseHistory.length === 0) {
      return (
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-800">Aún no has realizado compras. ¡Es hora de endulzar tu día!</p>
          <Link href="/GalleryPage" className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Explorar Menú
          </Link>
        </div>
      );
    }

    return purchaseHistory.map((purchase) => {
      if (!purchase || !purchase.items) {
        return null;
      }
      return (
        <div key={purchase.id} className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Compra del {new Date(purchase.date).toLocaleDateString()}</h3>
          {Array.isArray(purchase.items) && purchase.items.length > 0 ? (
            purchase.items.map((item) => {
              if (!item) return null;
              return (
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
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity} - Precio unitario: ${item.price.toFixed(2)} - 
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-yellow-600">No hay detalles disponibles para esta compra.</p>
          )}
          <p className="text-right font-semibold">Total de la compra: ${purchase.total.toFixed(2)}</p>
        </div>
      );
    });
  };
  return (
    <>
       <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
      <div className="max-w-4xl mx-auto mt-32 p-8 bg-green-50 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-green-800 text-center">Mi Rincón Saludable</h1>
        
        {user && profile ? (
          <div className="bg-white p-6 rounded-lg shadow-inner mb-6 border-2 border-green-200">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 flex items-center">
              <Coffee className="w-6 h-6 mr-2 text-green-600" />
              Perfil de Salud
            </h2>
            <div className="space-y-3">
              <p className="flex items-center"><Cake className="w-5 h-5 mr-2 text-green-600" /> <span className="font-medium">Nombre:</span> <span className="ml-2">{profile.name} {profile.lastName}</span></p>
              <p className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-green-600" /> <span className="font-medium">Fecha de Registro:</span> <span className="ml-2">{profile.registry ? new Date(profile.registry).toLocaleDateString() : 'Fecha no disponible'}</span></p>
              <p className="flex items-center"><Star className="w-5 h-5 mr-2 text-green-600" /> <span className="font-medium">Nivel de Bienestar:</span> <span className="ml-2">{healthLevel.level}</span></p>
              <p className="flex items-center"><Award className="w-5 h-5 mr-2 text-green-600" /> <span className="font-medium">Compras Saludables:</span> <span className="ml-2">{purchaseCount}</span></p>
            </div>
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <p className="text-green-700 italic">{healthLevel.description}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-inner mb-6 border-2 border-green-200 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Bienvenido, Invitado</h2>
            <p className="text-green-600 mb-4">Inicia sesión para acceder a todas las funciones de tu perfil saludable.</p>
            <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Iniciar Sesión
            </Link>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-inner border-2 border-green-200">
          <h2 className="text-2xl font-semibold mb-4 text-green-700 flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2 text-green-600" />
            Historial de Compras Saludables
          </h2>
          {renderPurchaseHistory()}
        </div>
        
        <div className="mt-8 bg-green-100 p-6 rounded-lg shadow-inner text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-3">¿Sabías que...?</h3>
          <p className="text-green-700">Nuestro pan integral más vendido, el Pan de Semillas, está elaborado con una mezcla de 7 granos diferentes para una nutrición óptima.</p>
        </div>

        {user && (
          <div className="mt-8 text-center">
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;