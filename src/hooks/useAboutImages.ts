import { useEffect, useState } from 'react';
import { createClient } from 'contentful';
import { AboutUsPicturesEntry, AboutUsPicturesFields } from '@/types/ContentfulTypes';

// Configuración del cliente de Contentful
const client = createClient({
    space: 'lv8bddpr230t',
    environment: 'master', // defaults to 'master' if not set
    accessToken: 'S5jRiTGrscU4NII3MB37tNlMezYcnPsCGVJCtaiIZp8'
  });

  
export const useImages = () => {
  const [images, setImages] = useState<AboutUsPicturesFields[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await client.getEntries<AboutUsPicturesEntry>({
          content_type: 'aboutUsPictures',
          include: 2
        });

        console.log('Contentful Response:', response);

        if (response.items.length > 0) {
          const fetchedImages = response.items.map((item) => item.fields);
          setImages(fetchedImages);
        } else {
          setError('No se encontraron imágenes.');
        }
      } catch (err) {
        console.error('Error completo:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, loading, error };
};