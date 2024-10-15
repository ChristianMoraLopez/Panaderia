import { NextApiRequest, NextApiResponse } from 'next';
import sendgrid from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('SENDGRID_API_KEY is not set');
  process.exit(1);
}
sendgrid.setApiKey(apiKey);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  orderDetails: OrderItem[];
  totalAmount: number;
}

const sendMail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const orderData: OrderData = req.body;

  const orderItemsHtml = orderData.orderDetails.map((item: OrderItem) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const emailContent = `
    <h3>Detalles del pedido</h3>
    <p><strong>Nombre Completo:</strong> ${orderData.fullName}</p>
    <p><strong>Correo Electrónico:</strong> ${orderData.email}</p>
    <p><strong>Teléfono:</strong> ${orderData.phone}</p>
    <p><strong>Dirección 1:</strong> ${orderData.address1}</p>
    <p><strong>Dirección 2:</strong> ${orderData.address2 || 'N/A'}</p>
    <p><strong>Ciudad:</strong> ${orderData.city}</p>
    <p><strong>Estado:</strong> ${orderData.state}</p>
    <p><strong>Código Postal:</strong> ${orderData.zipCode}</p>
    <h4>Artículos del pedido:</h4>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Precio</th>
      </tr>
      ${orderItemsHtml}
    </table>
    <p><strong>Total:</strong> $${orderData.totalAmount.toFixed(2)}</p>
  `;

  const msg = {
    to: 'beevsovenbakery@outlook.com',
    from: 'beevsovenbakery@outlook.com', // Asegúrate de que este correo esté verificado en SendGrid
    subject: `Nuevo pedido de ${orderData.fullName}`,
    html: emailContent,
  };

  try {
    await sendgrid.send(msg);
    
    // Enviar correo al cliente
    const clientMsg = {
      to: [orderData.email, 'beevsovenbakery@outlook.com'],
      from: 'beevsovenbakery@outlook.com', // Asegúrate de que este correo esté verificado en SendGrid
      subject: 'Confirmación de tu pedido en BeevsovenBakery',
      html: `
        <h2>¡Gracias por tu pedido!</h2>
        <p>Hemos recibido tu pedido y lo estamos procesando. Aquí están los detalles:</p>
        ${emailContent}
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>¡Gracias por elegir BeevsovenBakery!</p>
      `,
    };
    
    await sendgrid.send(clientMsg);

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      return res.status(500).json({ success: false, error: 'Error al enviar el correo', details: error.message });
    } else {
      console.error('Error details:', error);
      return res.status(500).json({ success: false, error: 'Error inesperado' });
    }
  }
};

export default sendMail;
