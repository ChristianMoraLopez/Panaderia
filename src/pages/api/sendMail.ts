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

  // Construir la dirección completa
  const fullAddress = [
    orderData.address1,
    orderData.address2,
    orderData.city,
    orderData.state,
    orderData.zipCode
  ].filter(Boolean).join(', ');

  const orderItemsHtml = orderData.orderDetails.map((item: OrderItem) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #936DAD;">Detalles del pedido</h2>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #936DAD; margin-top: 0;">Información del cliente:</h3>
        <p><strong>Nombre:</strong> ${orderData.fullName}</p>
        <p><strong>Email:</strong> ${orderData.email}</p>
        <p><strong>Teléfono:</strong> ${orderData.phone}</p>
        <p><strong>Dirección completa:</strong> ${fullAddress}</p>
      </div>

      <h3 style="color: #936DAD;">Productos:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #936DAD; color: white;">
          <th style="padding: 8px; text-align: left;">Producto</th>
          <th style="padding: 8px; text-align: center;">Cantidad</th>
          <th style="padding: 8px; text-align: right;">Precio</th>
          <th style="padding: 8px; text-align: right;">Subtotal</th>
        </tr>
        ${orderItemsHtml}
        <tr style="background-color: #f9f9f9; font-weight: bold;">
          <td colspan="3" style="padding: 8px; text-align: right;">Total:</td>
          <td style="padding: 8px; text-align: right;">$${orderData.totalAmount.toFixed(2)}</td>
        </tr>
      </table>
    </div>
  `;

  try {
    // Enviar correo a la tienda
    await sendgrid.send({
      to: 'info@beevsoven.com',
      from: 'confirmation@beevsoven.com',
      subject: `Nuevo pedido de ${orderData.fullName}`,
      html: emailContent,
    });

    // Enviar correo al cliente
    await sendgrid.send({
      to: orderData.email,
      from: 'confirmation@beevsoven.com',
      subject: 'Confirmación de tu pedido en BeevsovenBakery',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #936DAD;">¡Gracias por tu pedido!</h2>
          <p>Hemos recibido tu pedido y lo estamos procesando. Aquí están los detalles:</p>
          ${emailContent}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
            <p>Email: info@beevsoven.com</p>
            <p>Teléfono: +1 (786) 280-0961</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    console.error('Error details:', error instanceof Error ? error.message : error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error al enviar el correo',
      details: error instanceof Error ? error.message : 'Error inesperado'
    });
  }
};

export default sendMail;