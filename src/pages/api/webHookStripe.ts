// webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { createClient } from 'contentful-management';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia"
});

const client = createClient({
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_MANAGMENT_TOKEN!
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updatePurchaseHistory(
    userEmail: string,
    items: Array<{
      name: string;
      price: number;
      description?: string;
      image_url?: string;
      quantity: number;
    }>,
    purchaseId: string
  ) {
    try {
      const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!);
      const environment = await space.getEnvironment('master');
  
      const entries = await environment.getEntries({
        content_type: 'user',
        'fields.email': userEmail.toLowerCase(),
        limit: 1
      });
  
      if (entries.items.length === 0) {
        throw new Error('User not found in Contentful');
      }
  
      const userEntry = entries.items[0];
      const history = userEntry.fields.history?.['en-US'] || {};
  
      for (const item of items) {
        history[`product_${purchaseId}`] = {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: purchaseId
          },
          fields: {
            name: { 'en-US': item.name },
            price: { 'en-US': item.price },
            description: { 'en-US': item.description || '' },
            registry: { 'en-US': new Date().toISOString() },
            image: {
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Asset',
                  id: item.image_url || ''
                }
              }
            },
            quantity: { 'en-US': item.quantity }
          }
        };
      }
  
      userEntry.fields.history = { 'en-US': history };
      const updatedEntry = await userEntry.update();
      await updatedEntry.publish();
      
      return true;
    } catch (error) {
      console.error('Error updating purchase history:', error);
      return false;
    }
  }
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product']
        });

        if (session.customer_email) {
            const items = lineItems.data.map(item => ({
                name: item.description || '',
                price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
                quantity: item.quantity || 1,
                description: (item.price?.product as Stripe.Product)?.description || undefined,
                image_url: (item.price?.product as Stripe.Product)?.images?.[0]
              }));

          await updatePurchaseHistory(
            session.customer_email,
            items,
            session.payment_intent as string
          );
        }
      } catch (err) {
        console.error('Error processing session items:', err);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}