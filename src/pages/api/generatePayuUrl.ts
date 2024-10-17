import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const API_KEY = '4Vj8eK4rloUd272L48hsrarnUA';
//const API_LOGIN = 'pRRXKOl8ikMmt9u';
const MERCHANT_ID = '508029';
const ACCOUNT_ID = '512321';
const PAYU_BASE_URL = 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/';




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log('Received request body:', req.body);

  try {
    const { 
      amount, 
      referenceCode, 
      description, 
      buyerEmail,
      payerFullName,
      billingAddress,
      shippingAddress,
      telephone,
      payerDocument
    } = req.body;

    // Validate input
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      console.error('Invalid amount:', amount);
      throw new Error(`Invalid amount: ${amount}. Must be a number greater than 0`);
    }
    if (!referenceCode || typeof referenceCode !== 'string' || referenceCode.trim() === '') {
      console.error('Invalid referenceCode:', referenceCode);
      throw new Error('Invalid referenceCode: Must be a non-empty string');
    }
    if (!description || !buyerEmail || !payerFullName || !billingAddress || !shippingAddress || !telephone || !payerDocument) {
      console.error('Missing required fields:', { description, buyerEmail, payerFullName, billingAddress, shippingAddress, telephone, payerDocument });
      throw new Error('Missing required fields');
    }

    console.log('Validated data:', { 
      amount, 
      referenceCode, 
      description, 
      buyerEmail,
      payerFullName,
      billingAddress,
      shippingAddress,
      telephone,
      payerDocument
    });

    const currency = 'COP';
    const test = process.env.NODE_ENV === 'production' ? '0' : '1';

    // Ensure amount is a string with two decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Calculate tax and taxReturnBase (example values, adjust as needed)
    const tax = Math.round(parseFloat(formattedAmount) * 0.19);
    const taxReturnBase = parseFloat(formattedAmount) - tax;

    // Generate signature
    const signature = crypto
      .createHash('md5')
      .update(`${API_KEY}~${MERCHANT_ID}~${referenceCode}~${formattedAmount}~${currency}`)
      .digest('hex');

    // Construct form data
    const formData = new URLSearchParams({
      merchantId: MERCHANT_ID,
      accountId: ACCOUNT_ID,
      description,
      referenceCode,
      amount: formattedAmount,
      tax: tax.toString(),
      taxReturnBase: taxReturnBase.toString(),
      currency,
      signature,
      test,
      buyerEmail,
      responseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-response`,
      confirmationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-confirmation`,
      payerFullName,
      billingAddress,
      shippingAddress,
      telephone,
      payerDocument,
    });

    console.log('Form data:', formData.toString());

    // Construct HTML form
    const htmlForm = `
      <form method="post" action="${PAYU_BASE_URL}">
        ${Array.from(formData.entries()).map(([key, value]) => 
          `<input name="${key}" type="hidden" value="${value}">`
        ).join('\n')}
        <input type="submit" value="Pagar con PayU">
      </form>
    `;

    res.status(200).json({ success: true, htmlForm });
  } catch (error: unknown) {
    console.error('Error generating PayU form:', error);
    
    let errorMessage = 'Failed to generate payment form';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    res.status(400).json({ success: false, error: errorMessage });
  }
}