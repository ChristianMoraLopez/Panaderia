import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 apiVersion: "2024-09-30.acacia"
});

export const config = {
 api: {
   bodyParser: false,
 },
};

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
   
   switch (event.type) {
    case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        try {
          // Obtener detalles de los items de la sesión
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          
            console.log('Items de la sesión:', lineItems.data);
            // Aquí puedes agregar lógica adicional para manejar la sesión completada
        } catch (err) {
        
            console.error('Error al obtener los items de la sesión:', err);
            }

     case 'payment_intent.succeeded':
       const paymentIntent = event.data.object as Stripe.PaymentIntent;
       console.log('Payment succeeded:', paymentIntent.id);
       // Aquí puedes agregar lógica adicional para pagos exitosos
       break;

     case 'payment_intent.payment_failed':
       const failedPayment = event.data.object as Stripe.PaymentIntent;
       console.log('Payment failed:', failedPayment.id);
       // Aquí puedes agregar lógica para manejar pagos fallidos
       break;

     default:
       console.log(`Evento no manejado: ${event.type}`);
   }

   res.json({ received: true });
 } catch (err) {
   console.error('Webhook error:', err);
   res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
 }
}