// types/shipping.ts


export interface ShippingRate {
    mailClass: string;
    productName: string;
    totalPrice: number;
    commitment?: {
      name: string;
      scheduleDeliveryDate: string;
      guaranteedDelivery: boolean;
    };
    productDefinition?: string;
    zone?: string;
    SKU?: string;
    warnings?: Array<{
      warningCode: string;
      warningDescription: string;
    }>;
  }



export const AVAILABLE_MAIL_CLASSES = [
  'PRIORITY_MAIL_EXPRESS',
  'PRIORITY_MAIL',
  'USPS_GROUND_ADVANTAGE',
  'FIRST-CLASS_PACKAGE_SERVICE'
] as const;


export type MailClass = typeof AVAILABLE_MAIL_CLASSES[number];


export interface ShippingCommitment {
    name?: string;
    scheduleDeliveryDate: string;
    guaranteedDelivery?: boolean;
  }
  
  
export type ProcessingCategory = 
| 'LETTERS'
| 'FLATS'
| 'MACHINABLE'
| 'IRREGULAR'
| 'NON_MACHINABLE';

export type RateIndicator = 
| 'SP'  // Single Piece
| 'CP'  // Cubic Parcel
| 'FB'  // Flat Rate Box
| 'FE'  // Flat Rate Envelope
| 'PA'  // Priority Mail Express Single Piece
| 'PM'; // Large Flat Rate Box APO/FPO/DPO

export type DestinationEntryFacilityType = 
| 'NONE'
| 'DESTINATION_NETWORK_DISTRIBUTION_CENTER'
| 'DESTINATION_SECTIONAL_CENTER_FACILITY'
| 'DESTINATION_DELIVERY_UNIT'
| 'DESTINATION_SERVICE_HUB';

export type PriceType = 'RETAIL' | 'COMMERCIAL' | 'CONTRACT';

export interface ShippingRequest {
// Required base fields
originZIPCode: string;          // Format: ^\d{5}(?:[-\s]\d{4})?$
destinationZIPCode: string;     // Format: ^\d{5}(?:[-\s]\d{4})?$
weight: number;                 // Weight in pounds
length: number;                 // Length in inches
width: number;                  // Width in inches
height: number;                 // Height in inches
mailClass: MailClass;          // Mail service requested
processingCategory: ProcessingCategory;
rateIndicator: RateIndicator;
destinationEntryFacilityType: DestinationEntryFacilityType;
priceType: PriceType;

// Optional fields
mailingDate?: string;          // Format: YYYY-MM-DD, must be within next 7 days
accountType?: 'EPS' | 'PERMIT' | 'METER';
accountNumber?: string;        // Format: ^\d+$
}

// Constantes para los request
export const SHIPPING_CONSTANTS = {
PROCESSING_CATEGORY: 'MACHINABLE' as ProcessingCategory,
RATE_INDICATOR: 'SP' as RateIndicator,
DESTINATION_ENTRY_FACILITY_TYPE: 'NONE' as DestinationEntryFacilityType,
PRICE_TYPE: 'RETAIL' as PriceType,
ORIGIN_ZIP: '33015',
BASE_WEIGHT_PER_ITEM: 0.5, // Weight in pounds per item
MIN_WEIGHT: 0.1, // Minimum weight in pounds
};

// Helper function to validate ZIP codes
export const isValidZipCode = (zipCode: string): boolean => {
return /^\d{5}(?:[-\s]\d{4})?$/.test(zipCode);
};

// Helper function to format date for mailingDate
export const formatMailingDate = (date: Date): string => {
return date.toISOString().split('T')[0];
};

// Helper function to validate weight
export const isValidWeight = (weight: number): boolean => {
return weight > 0 && weight <= 70; // USPS max weight is 70 lbs
};