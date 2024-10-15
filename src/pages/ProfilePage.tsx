import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useCart } from '@/store/Cart';
import Image from 'next/image';
import { Cake, Calendar, ShoppingBag, Coffee, Star } from 'lucide-react';
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
  const { profile, loading: profileLoading, error } = useCustomerProfile(user?.email);
  const { count } = useCart();
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);

  useEffect(() => {
    if (!user) {
      // Si el usuario no está autenticado, obtener el historial de compras de localStorage
      const localPurchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
      setPurchaseHistory(localPurchaseHistory);
    } else if (profile && profile.history) {
      // Si el usuario está autenticado, convertir el historial del perfil al formato PurchaseHistoryItem
      const profileHistory = Object.entries(profile.history).map(([key, value]) => {
        const historyItem = value as HistoryItem;
        if ('fields' in historyItem) {
          const quantity = historyItem.fields.quantity ? historyItem.fields.quantity['en-US'] : 1;
          const price = historyItem.fields.price['en-US'];
          console.log('IMAGE URL' + historyItem.fields.image['en-US'].sys.id);
          return {
            id: key,
            date: new Date().toISOString(), // Considera almacenar la fecha en Contentful
            items: [{
              id: parseInt(key),
              name: historyItem.fields.name['en-US'],
              price: price,
              quantity: quantity,
              image_url: historyItem.fields.image['en-US'].sys.id
              
            }],
            total: price * quantity
            
          };
        }
        return null;
      }).filter((item): item is PurchaseHistoryItem => item !== null);
      setPurchaseHistory(profileHistory);
   
    }
  }, [user, profile]);

  if (authLoading || profileLoading) {
    return (
      <>
        <Navbar cartCount={count} />
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
        <Navbar cartCount={count} />
        <div className="max-w-md mx-auto mt-32 p-8 bg-red-50 rounded-lg shadow-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </>
    );
  }

  const renderPurchaseHistory = () => {
    if (purchaseHistory.length === 0) {
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

    return purchaseHistory.map((purchase) => (
      <div key={purchase.id} className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Compra del {new Date(purchase.date).toLocaleDateString()}</h3>
        {purchase.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 mb-2">
            <Image
              src={`https://${item.image_url}`}
              
              alt={item.name}
              width={50}
              height={50}
              className="rounded"
            />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                Cantidad: {item.quantity} - Precio unitario: ${item.price.toFixed(2)} - 
                Total: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <p className="text-right font-semibold">Total de la compra: ${purchase.total.toFixed(2)}</p>
      </div>
    ));
  };

  return (
    <>
      <Navbar cartCount={count} />
      <div className="max-w-4xl mx-auto mt-32 p-8 bg-yellow-50 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-yellow-800 text-center">Mi Rincón Dulce</h1>
        
        {user && profile ? (
          <div className="bg-white p-6 rounded-lg shadow-inner mb-6 border-2 border-yellow-200">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-700 flex items-center">
              <Coffee className="w-6 h-6 mr-2 text-yellow-600" />
              Perfil de Goloso
            </h2>
            <div className="space-y-3">
              <p className="flex items-center"><Cake className="w-5 h-5 mr-2 text-yellow-600" /> <span className="font-medium">Nombre:</span> <span className="ml-2">{profile.name} {profile.LastName}</span></p>
              <p className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-yellow-600" /> <span className="font-medium">Fecha de Registro:</span> <span className="ml-2">{profile.registry ? new Date(profile.registry).toLocaleDateString() : 'Fecha no disponible'}</span></p>
              <p className="flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-600" /> <span className="font-medium">Nivel de Dulzura:</span> <span className="ml-2">Aficionado al Azúcar</span></p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-inner mb-6 border-2 border-yellow-200 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Bienvenido, Invitado</h2>
            <p className="text-yellow-600 mb-4">Inicia sesión para acceder a todas las funciones de tu perfil.</p>
            <Link href="/login" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Iniciar Sesión
            </Link>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-inner border-2 border-yellow-200">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-700 flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2 text-yellow-600" />
            Historial de Antojos
          </h2>
          {renderPurchaseHistory()}
        </div>
        
        <div className="mt-8 bg-yellow-100 p-6 rounded-lg shadow-inner text-center">
          <h3 className="text-xl font-semibold text-yellow-800 mb-3">¿Sabías que...?</h3>
          <p className="text-yellow-700">Nuestro pan más vendido, el Brioche de Vainilla, tarda 6 horas en prepararse desde el amasado hasta el horneado.</p>
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