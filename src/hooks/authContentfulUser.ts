import { useState, useEffect } from 'react';
import { auth } from '@/lib/fireBase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile
} from 'firebase/auth';
import { createClient } from 'contentful-management';
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Usar el token de acceso desde la variable de entorno
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGMENT_TOKEN;
if (!accessToken) {
  throw new Error("Contentful access token is not defined in the environment variables.");
}

const client = createClient({
  accessToken // Ahora esto es seguro, ya que no puede ser undefined
});

interface UserData {
  name: string;
  LastName: string;
  email: string;
  password: string;
}

// Define la interfaz HistoryItem incluyendo fields
interface HistoryItem {
  sys: {
    type: 'Link';
    linkType: 'Entry';
    id: string;
  };
  fields?: { // Hacer fields opcional
    name?: { 'en-US': string };
    price?: { 'en-US': number };
    description?: { 'en-US': string };
    registry?: { 'en-US': string };
    image?: { 'en-US': { sys: { type: string; linkType: string; id: string } } }; // Añadir campo para la imagen
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log('Usuario autenticado:', userCredential.user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during login');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during logout');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async ({ name, LastName, email, password }: UserData) => {
    setLoading(true);
    try {
      const emailLowerCase = email.toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(auth, emailLowerCase, password);
      const user = userCredential.user;

      // Actualizar el perfil del usuario en Firebase con el nombre
      await updateProfile(user, {
        displayName: `${name} ${LastName}`
      });

      const space = await client.getSpace('tq4ckeil24qo');
      const environment = await space.getEnvironment('master');

      const entry = await environment.createEntry('panaderaDelicias', {
        fields: {
          name: { 'en-US': name },
          LastName: { 'en-US': LastName },
          email: { 'en-US': emailLowerCase },
          uid: { 'en-US': user.uid },
          registry: { 'en-US': new Date().toISOString() }
        }
      });
      await entry.publish();

      console.log('Usuario registrado y entrada creada en Contentful');
      console.log('Usuario registrado:', user);

      setUser(user);
      return user;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during registration');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseHistory = async (
    productId: string, 
    productDetails: { name: string; price: number; description: string; imageId: string } // Incluir imageId
  ) => {
    if (!user) {
      setError('No hay usuario autenticado');
      return;
    }

    if (typeof productId !== 'string' || productId.trim() === '') {
      setError('ID de producto inválido');
      return;
    }

    try {
      const space = await client.getSpace('tq4ckeil24qo');
      const environment = await space.getEnvironment('master');

      const entries = await environment.getEntries({
        content_type: 'panaderaDelicias',
        'fields.email': user.email?.toLowerCase(),
        limit: 1
      });

      if (entries.items.length === 0) {
        setError('No se encontró la entrada del usuario en Contentful');
        return;
      }

      const userEntry = entries.items[0];

      // Obtener el historial actual, o inicializar un objeto vacío si no existe
      const history: Record<string, HistoryItem> = userEntry.fields.history?.['en-US'] || {};

      // Verificar si el producto ya existe en el historial
      if (!history[`product_${productId}`]) {
        // Añadir el nuevo producto al historial
        history[`product_${productId}`] = {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: productId
          },
          fields: {
            name: { 'en-US': productDetails.name },
            price: { 'en-US': productDetails.price },
            description: { 'en-US': productDetails.description },
            registry: { 'en-US': new Date().toISOString() },
            image: { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: productDetails.imageId } } } // Añadir imagen al historial
          }
        };

        userEntry.fields.history = { 'en-US': history };

        const updatedUserEntry = await userEntry.update();
        await updatedUserEntry.publish();

        console.log('Historial de compras actualizado con éxito');
      } else {
        console.log('El producto ya existe en el historial');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error al actualizar el historial de compras: ${err.message}`);
      } else {
        setError('Error desconocido al actualizar el historial de compras');
      }
      console.error(err);
    }
  };

  return { user, loading, error, login, logout, registerUser, updatePurchaseHistory };
};
