import type { NextApiRequest, NextApiResponse } from 'next';

const USPS_API_BASE_URL = 'https://api.usps.com';

interface DomesticPrice {
  basePrice: number;
  totalPrice: number;
  zone?: number;
  commitmentDate?: string;
  deliveryDays?: number;
}

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    debug?: unknown;
  };
}

const logger = (requestId: string, message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}][${requestId}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DomesticPrice | ErrorResponse>
) {
  const requestId = Math.random().toString(36).substring(7);
  logger(requestId, '🟢 Starting domestic price request');

  if (req.method !== 'POST') {
    logger(requestId, '❌ Invalid method:', req.method);
    return res.status(405).json({
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST requests are allowed'
      }
    });
  }

  try {
    logger(requestId, '📥 Raw request body:', req.body);

    // Set default values for required fields that can be automatically determined
    const defaultedBody = {
      ...req.body,
      originZIPCode: req.body.originZIPCode || process.env.DEFAULT_ORIGIN_ZIP || '00000',
      mailClass: req.body.mailClass || 'USPS_GROUND_ADVANTAGE',
      processingCategory: req.body.processingCategory || 'MACHINABLE',
      rateIndicator: req.body.rateIndicator || 'SP',
      destinationEntryFacilityType: req.body.destinationEntryFacilityType || 'NONE',
      priceType: req.body.priceType || 'RETAIL'
    };

    // Validate required fields based on the Domestic Prices API requirements
    const requiredFields = [
      'originZIPCode',
      'destinationZIPCode',
      'weight',
      'length',
      'width',
      'height',
      'mailClass',
      'processingCategory',
      'rateIndicator',
      'destinationEntryFacilityType',
      'priceType'
    ];

    // Validate field types and ranges
    if (typeof defaultedBody.weight !== 'number' || defaultedBody.weight <= 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Weight must be a positive number'
        }
      });
    }

    if (!defaultedBody.destinationZIPCode?.match(/^\d{5}(?:[-\s]\d{4})?$/)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid destination ZIP code format'
        }
      });
    }

    for (const field of requiredFields) {
      if (!defaultedBody[field]) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: `Missing required field: ${field}`
          }
        });
      }
    }

    // Get OAuth token
    const tokenResponse = await fetch(`${USPS_API_BASE_URL}/oauth2/v3/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.USPS_CONSUMER_KEY || '',
        client_secret: process.env.USPS_CONSUMER_SECRET || '',
        scope: 'prices'
      }).toString()
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      logger(requestId, '❌ Token request failed:', tokenError);
      return res.status(tokenResponse.status).json({
        error: {
          code: 'AUTH_ERROR',
          message: 'Failed to authenticate with USPS API',
          debug: { tokenError }
        }
      });
    }

    const tokenData: { access_token: string } = await tokenResponse.json();
    logger(requestId, '✅ OAuth token obtained');

    // Prepare the request body for the Domestic Prices API
    const requestBody = {
      originZIPCode: defaultedBody.originZIPCode,
      destinationZIPCode: defaultedBody.destinationZIPCode,
      weight: parseFloat(defaultedBody.weight.toString()),
      length: parseFloat(defaultedBody.length.toString()),
      width: parseFloat(defaultedBody.width.toString()),
      height: parseFloat(defaultedBody.height.toString()),
      mailClass: defaultedBody.mailClass,
      processingCategory: defaultedBody.processingCategory,
      rateIndicator: defaultedBody.rateIndicator,
      destinationEntryFacilityType: defaultedBody.destinationEntryFacilityType,
      priceType: defaultedBody.priceType,
      mailingDate: defaultedBody.mailingDate || new Date().toISOString().split('T')[0]
    };

    logger(requestId, '📤 Request body:', requestBody);

    // Make the request to the Domestic Prices API
    const priceResponse = await fetch(`${USPS_API_BASE_URL}/prices/v3/base-rates/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Version': '3.4.11'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await priceResponse.text();
    logger(requestId, '📡 USPS API response status:', priceResponse.status);
    logger(requestId, '📥 USPS API response:', responseText);
  
    console.log("Shipping rates:", responseText);
  
    // If the response is not OK, handle the error
    if (!priceResponse.ok) {
      return res.status(priceResponse.status).json({
        error: {
          code: 'USPS_API_ERROR',
          message: 'Failed to get price from USPS API',
          debug: responseText
        }
      });
    }
  
    // Parse the response text to JSON
    const priceData = JSON.parse(responseText);
  
    // Structure the response in the desired format (if needed)
    const formattedResponse = {
      basePrice: priceData.basePrice,
      totalPrice: priceData.totalPrice,
      zone: priceData.zone,
      commitmentDate: priceData.commitmentDate,
      deliveryDays: priceData.deliveryDays,
      rates: priceData.rates // Ensure to include any relevant shipping rates
    };
  
    // Log successful processing
    logger(requestId, '✅ Successfully processed domestic price request');
  
    // Return the formatted response to the client
    return res.status(200).json(formattedResponse);
  
  } catch (error) {
    logger(requestId, '❌ Unhandled error:', error);
  
    // Handle errors by returning a 500 status with the error details
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while processing your request',
        debug: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : 'Unknown error'
      }
  
    });
  }
}