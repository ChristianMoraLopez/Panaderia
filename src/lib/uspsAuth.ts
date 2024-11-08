// lib/uspsAuth.ts
import { Buffer } from 'buffer';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getUSPSToken(): Promise<string> {
  const clientId = process.env.USPS_CONSUMER_KEY;
  const clientSecret = process.env.USPS_CONSUMER_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('USPS credentials not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch('https://api.usps.com/oauth2/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&scope=addresses'
    });

    if (!response.ok) {
      throw new Error(`Failed to obtain token: ${response.statusText}`);
    }

    const data: TokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error obtaining USPS token:', error);
    throw error;
  }
}