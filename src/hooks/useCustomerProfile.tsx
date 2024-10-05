
import { useEffect, useState } from 'react';
import { createClient } from 'contentful';
import { UserFields } from '@/types/UserTypesContentful';

const client = createClient({
  space: 'tq4ckeil24qo',
  environment: 'master',
  accessToken: '1YhT6yLqrnyqL597WxZ6rEkc1griTNdrJuc1KhoQgDk',
});

export const useCustomerProfile = (email: string | null | undefined) => {
  const [profile, setProfile] = useState<UserFields | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) {
        setError('Email no proporcionado');
        setLoading(false);
        return;
      }

      try {
        const entries = await client.getEntries({
          content_type: 'panaderaDelicias',
          'fields.email': email,
          limit: 1
        });

        if (entries.items.length > 0) {
          setProfile(entries.items[0].fields as unknown as UserFields);
        } else {
          setError('No se encontró un perfil con ese email');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error al obtener el perfil del cliente: ${err.message}`);
        } else {
          setError('Error desconocido al obtener el perfil del cliente');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchProfile();
    }
  }, [email]);

  return { profile, loading, error };
};