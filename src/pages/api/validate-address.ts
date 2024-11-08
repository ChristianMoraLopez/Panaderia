// pages/api/validate-address.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface USPSAddressResponse {
  address?: {
    streetAddress: string;
    city: string;
    state: string;
    ZIPCode: string;
    ZIPPlus4?: string;
  };
  error?: {
    message: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<USPSAddressResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    // Obtener token de OAuth 2.0
    const tokenResponse = await fetch('https://api.usps.com/oauth2/v3/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.USPS_CONSUMER_KEY || '',
        client_secret: process.env.USPS_CONSUMER_SECRET || '',
        scope: 'addresses'
      }).toString()
    });

    if (!tokenResponse.ok) {
      console.error('Token error:', await tokenResponse.text());
      throw new Error('Failed to obtain access token');
    }

    const tokenData = await tokenResponse.json();
    
    // Construir la URL con parámetros de consulta
    const params = new URLSearchParams({
      streetAddress: req.body.streetAddress,
      state: req.body.state,
      ...(req.body.city && { city: req.body.city }),
      ...(req.body.ZIPCode && { ZIPCode: req.body.ZIPCode }),
      ...(req.body.firm && { firm: req.body.firm }),
      ...(req.body.secondaryAddress && { secondaryAddress: req.body.secondaryAddress }),
      ...(req.body.urbanization && { urbanization: req.body.urbanization })
    });

    // Hacer la petición a la API de USPS
    const validateResponse = await fetch(
      `https://api.usps.com/addresses/v3/address?${params.toString()}`,
      {
        method: 'GET',  // La API usa GET según la documentación
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!validateResponse.ok) {
      const errorData = await validateResponse.json();
      console.error('USPS API Error:', errorData);
      
      if (validateResponse.status === 404) {
        return res.status(404).json({
          error: { message: 'Address not found or invalid' }
        });
      }

      return res.status(validateResponse.status).json({
        error: { 
          message: errorData.error?.message || 'Error validating address'
        }
      });
    }

    const data = await validateResponse.json();

    // Formatear la respuesta según la documentación
    const validatedAddress = {
      streetAddress: data.address.streetAddress,
      city: data.address.city,
      state: data.address.state,
      ZIPCode: data.address.ZIPCode,
      ...(data.address.ZIPPlus4 && { ZIPPlus4: data.address.ZIPPlus4 })
    };

    return res.status(200).json({ address: validatedAddress });
  } catch (error) {
    console.error('Address validation error:', error);
    return res.status(500).json({
      error: {
        message: 'Internal server error validating address'
      }
    });
  }
}