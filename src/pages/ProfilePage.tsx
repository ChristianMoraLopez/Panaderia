import React from 'react';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import Image from 'next/image';
import { Cake, Calendar, ShoppingBag, Coffee, Star } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';

interface HistoryItem {
  name: string;
  description: string;
  price: number;
  image?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  category: string;
}

const Profile = () => {
  const { user, loading: authLoading, logout } = useAuth(); // Añadido 'logout'
  const { profile, loading: profileLoading, error } = useCustomerProfile(user?.email);

  if (authLoading || profileLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto mt-32 p-8  bg-yellow-50 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700 mx-auto"></div>
          <p className="mt-4 text-yellow-800">Horneando su perfil...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto mt-32 p-8 bg-yellow-50 rounded-lg shadow-lg text-center">
          <Cake className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-yellow-800">No hay usuario autenticado. Por favor inicie sesión para disfrutar nuestras delicias.</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto mt-32 p-8 bg-red-50 rounded-lg shadow-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto mt-32 p-8 bg-yellow-50 rounded-lg shadow-lg text-center">
          <ShoppingBag className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-yellow-800">No se encontró el perfil del usuario. ¿Quizás es hora de hornear uno nuevo?</p>
        </div>
      </>
    );
  }

  const registryDate = profile.registry ? new Date(profile.registry) : null;
  const historyItem = profile.history && 'fields' in profile.history ? profile.history.fields as HistoryItem : null;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-32 p-8 bg-yellow-50 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-yellow-800 text-center">Mi Rincón Dulce</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-inner mb-6 border-2 border-yellow-200">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-700 flex items-center">
            <Coffee className="w-6 h-6 mr-2 text-yellow-600" />
            Perfil de Goloso
          </h2>
          <div className="space-y-3">
            <p className="flex items-center"><Cake className="w-5 h-5 mr-2 text-yellow-600" /> <span className="font-medium">Nombre:</span> <span className="ml-2">{profile.name} {profile.LastName}</span></p>
            <p className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-yellow-600" /> <span className="font-medium">Fecha de Registro:</span> <span className="ml-2">{registryDate ? registryDate.toLocaleDateString() : 'Fecha no disponible'}</span></p>
            <p className="flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-600" /> <span className="font-medium">Nivel de Dulzura:</span> <span className="ml-2">Aficionado al Azúcar</span></p>
          </div>
        </div>

        {historyItem ? (
          <div className="bg-white p-6 rounded-lg shadow-inner border-2 border-yellow-200">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-700 flex items-center">
              <ShoppingBag className="w-6 h-6 mr-2 text-yellow-600" />
              Último Antojo
            </h2>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {historyItem.image && (
                <div className="w-48 h-48 relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={`https:${historyItem.image.fields.file.url}`}
                    alt={historyItem.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-medium text-yellow-800 mb-2">{historyItem.name}</h3>
                <p className="text-gray-600 mb-2">{historyItem.description}</p>
                <p className="text-lg font-semibold text-yellow-700 mb-2">${historyItem.price.toFixed(2)}</p>
                <p className="inline-block bg-yellow-200 px-3 py-1 rounded-full text-sm text-yellow-800">{historyItem.category}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-inner text-center border-2 border-yellow-200">
            <ShoppingBag className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-yellow-800">Aún no has probado nuestras delicias. ¡Es hora de endulzar tu día!</p>
            <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Explorar Menú
            </button>
          </div>
        )}
        
        <div className="mt-8 bg-yellow-100 p-6 rounded-lg shadow-inner text-center">
          <h3 className="text-xl font-semibold text-yellow-800 mb-3">¿Sabías que...?</h3>
          <p className="text-yellow-700">Nuestro pan más vendido, el Brioche de Vainilla, tarda 6 horas en prepararse desde el amasado hasta el horneado.</p>
        </div>

        {/* Botón para cerrar sesión */}
        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
