import { useEffect, useState } from 'react';
import { createClient } from 'contentful';
import { ProductFields, ContentfulProductEntry } from '@/types/ProductTypes';

// Configuración del cliente de Contentful
const client = createClient({
  space: 'tq4ckeil24qo',
  environment: 'master',
  accessToken: '1YhT6yLqrnyqL597WxZ6rEkc1griTNdrJuc1KhoQgDk',
});

// Hook para obtener los productos
export const useProducts = () => {
  const [products, setProducts] = useState<ProductFields[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Aquí usamos 'ContentfulUserEntry' que está definido en tus tipos
        const response = await client.getEntries<ContentfulProductEntry>({
          content_type: 'panaderaDeliciasProductos', // Tipo de contenido de productos
        });

        // Verifica si hay productos en la respuesta
        if (response.items.length > 0) {
          const fetchedProducts = response.items.map((item) => item.fields);
          setProducts(fetchedProducts);
        } else {
          setError('No se encontraron productos.');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error al obtener los productos: ${err.message}`);
        } else {
          setError('Error desconocido al obtener los productos');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // El hook se ejecuta solo una vez cuando se monta el componente

  return { products, loading, error };
};
