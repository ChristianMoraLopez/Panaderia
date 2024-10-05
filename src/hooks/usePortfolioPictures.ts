import { useState, useEffect } from 'react';
import { createClient, Entry, EntrySkeletonType } from 'contentful';
import { ContentfulData } from '@/types/PortfolioContentFulTypes'; // Asegúrate de que esté el tipo correcto

const useContentfulData = (entryId: string) => {
  const [data, setData] = useState<ContentfulData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
    });

    const fetchData = async () => {
      try {
        // Obtiene la entrada de Contentful
        const entry: Entry<EntrySkeletonType> = await client.getEntry(entryId, {
          include: 2, // Ajusta el nivel de inclusión si es necesario
        });

        // Imprimir la entrada para verificar su estructura
        console.log(entry);

        if (!entry) throw new Error('No data returned from Contentful');

        // Procesar los datos de Contentful
        const contentfulData: ContentfulData = {
          metadata: {
            tags: entry.metadata?.tags?.map((tag) => tag.sys.id) || [],
          },
          sys: {
            space: entry.sys.space || {},
            id: entry.sys.id || '',
            type: entry.sys.type || '',
            createdAt: entry.sys.createdAt || '',
            updatedAt: entry.sys.updatedAt || '',
            environment: entry.sys.environment || {},
            revision: entry.sys.revision || 0,
            contentType: entry.sys.contentType || {},
            locale: entry.sys.locale || 'default-locale',
          },
          fields: entry.fields as ContentfulData['fields'], // Cast seguro
        };

        setData(contentfulData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entryId]);

  return { data, loading, error };
};

export default useContentfulData;
