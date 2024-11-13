import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { CartItemType } from '@/store/Cart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia"
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      items, 
      customerEmail, 
      customerName, 
      metadata,
      tax,
      shipping
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items' });
    }

    // Create line items for products
    const lineItems = items.map((item: CartItemType) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || undefined,
          images: item.image_url ? [`https:${item.image_url}`] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add tax as a separate line item if exists
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sales Tax',
            description: '6% sales tax',
            images: undefined,
          },
          unit_amount: tax,
        },
        quantity: 1,
      });
    }

    // Add shipping as a separate line item
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: metadata.shippingMethod || 'Shipping',
            description: 'Shipping cost',
            images: undefined,
          },
          unit_amount: shipping,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-response?transactionState=4`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-response?transactionState=6`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      metadata: {
        ...metadata,
        customerName,
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