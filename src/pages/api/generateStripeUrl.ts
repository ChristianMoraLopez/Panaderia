import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  image_url?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia"
});

// Función auxiliar para asegurar que las URLs de imágenes sean válidas
const getValidImageUrl = (url: string | undefined): string[] => {
  if (!url) return [];
  
  // Si la URL comienza con '//', añadir 'https:'
  if (url.startsWith('//')) {
    return [`https:${url}`];
  }
  
  // Si la URL ya tiene protocolo, usarla como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return [url];
  }
  
  // Si no tiene protocolo, añadir 'https://'
  return [`https://${url}`];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customerEmail, customerName, metadata } = req.body;

    // Validación de datos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items' });
    }

    // Crear los line items para Stripe con URLs válidas
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || undefined,
          images: getValidImageUrl(item.image_url),
        },
        unit_amount: Math.round(item.price * 100), // Convertir a centavos
      },
      quantity: item.quantity,
    }));

    console.log('Line items:', lineItems); // Para debugging

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500,
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      metadata: {
        ...metadata,
        customerName,
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe session creation error:', error);
    return res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment session'
    });
  }
}