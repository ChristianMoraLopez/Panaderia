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
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
          email: { 'en-US': email },
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

  return { user, loading, error, login, logout, registerUser };
};
