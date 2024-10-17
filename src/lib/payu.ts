import crypto from 'crypto';

interface PayUConfirmation {
  merchant_id: string;
  state_pol: string;
  risk: string;
  response_code_pol: string;
  reference_sale: string;
  reference_pol: string;
  sign: string;
  extra1: string;
  extra2: string;
  payment_method: string;
  payment_method_type: string;
  installments_number: string;
  value: string;
  tax: string;
  additional_value: string;
  transaction_date: string;
  currency: string;
  email_buyer: string;
  cus: string;
  pse_bank: string;
  test: string;
  description: string;
  billing_address: string;
  shipping_address: string;
  phone: string;
  office_phone: string;
  account_number_ach: string;
  account_type_ach: string;
  administrative_fee: string;
  administrative_fee_base: string;
  administrative_fee_tax: string;
  airline_code: string;
  attempts: string;
  authorization_code: string;
  bank_id: string;
  billing_city: string;
  billing_country: string;
  commision_pol: string;
  commision_pol_currency: string;
  customer_number: string;
  date: string;
  error_code_bank: string;
  error_message_bank: string;
  exchange_rate: string;
  ip: string;
  nickname_buyer: string;
  nickname_seller: string;
  payment_method_id: string;
  payment_request_state: string;
  pseCycle: string;
  response_message_pol: string;
  transaction_bank_id: string;
  transaction_id: string;
  payment_method_name: string;
}

export function verifyPayuSignature(body: PayUConfirmation, receivedSignature: string): boolean {
  const apiKey = process.env.PAYU_API_KEY;
  
  if (!apiKey) {
    console.error('PAYU_API_KEY is not set');
    return false;
  }

  const signatureString = `${apiKey}~${body.merchant_id}~${body.reference_sale}~${body.value}~${body.currency}~${body.state_pol}`;
  
  const computedSignature = crypto
    .createHash('md5')
    .update(signatureString)
    .digest('hex');

  return computedSignature === receivedSignature;
}

export function parsePayuConfirmation(body: 
    Record<string, unknown> | Record<string, string | number | undefined>
): PayUConfirmation {
  // Asegúrate de que todos los campos necesarios estén presentes
  const requiredFields = [
    'merchant_id', 'state_pol', 'risk', 'response_code_pol', 'reference_sale',
    'reference_pol', 'sign', 'value', 'tax', 'transaction_date', 'currency',
    'email_buyer', 'payment_method', 'payment_method_type'
  ];

  for (const field of requiredFields) {
    if (!(field in body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Convierte y valida los campos
  return {
    merchant_id: String(body.merchant_id),
    state_pol: String(body.state_pol),
    risk: String(body.risk),
    response_code_pol: String(body.response_code_pol),
    reference_sale: String(body.reference_sale),
    reference_pol: String(body.reference_pol),
    sign: String(body.sign),
    extra1: String(body.extra1 || ''),
    extra2: String(body.extra2 || ''),
    payment_method: String(body.payment_method),
    payment_method_type: String(body.payment_method_type),
    installments_number: String(body.installments_number || ''),
    value: String(body.value),
    tax: String(body.tax),
    additional_value: String(body.additional_value || ''),
    transaction_date: String(body.transaction_date),
    currency: String(body.currency),
    email_buyer: String(body.email_buyer),
    cus: String(body.cus || ''),
    pse_bank: String(body.pse_bank || ''),
    test: String(body.test || ''),
    description: String(body.description || ''),
    billing_address: String(body.billing_address || ''),
    shipping_address: String(body.shipping_address || ''),
    phone: String(body.phone || ''),
    office_phone: String(body.office_phone || ''),
    account_number_ach: String(body.account_number_ach || ''),
    account_type_ach: String(body.account_type_ach || ''),
    administrative_fee: String(body.administrative_fee || ''),
    administrative_fee_base: String(body.administrative_fee_base || ''),
    administrative_fee_tax: String(body.administrative_fee_tax || ''),
    airline_code: String(body.airline_code || ''),
    attempts: String(body.attempts || ''),
    authorization_code: String(body.authorization_code || ''),
    bank_id: String(body.bank_id || ''),
    billing_city: String(body.billing_city || ''),
    billing_country: String(body.billing_country || ''),
    commision_pol: String(body.commision_pol || ''),
    commision_pol_currency: String(body.commision_pol_currency || ''),
    customer_number: String(body.customer_number || ''),
    date: String(body.date || ''),
    error_code_bank: String(body.error_code_bank || ''),
    error_message_bank: String(body.error_message_bank || ''),
    exchange_rate: String(body.exchange_rate || ''),
    ip: String(body.ip || ''),
    nickname_buyer: String(body.nickname_buyer || ''),
    nickname_seller: String(body.nickname_seller || ''),
    payment_method_id: String(body.payment_method_id || ''),
    payment_request_state: String(body.payment_request_state || ''),
    pseCycle: String(body.pseCycle || ''),
    response_message_pol: String(body.response_message_pol || ''),
    transaction_bank_id: String(body.transaction_bank_id || ''),
    transaction_id: String(body.transaction_id || ''),
    payment_method_name: String(body.payment_method_name || ''),
  };
}