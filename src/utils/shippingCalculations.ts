// src/utils/shippingCalculations.ts
import { ShippingRate } from "@/types/shipping";



export interface ShippingDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export const SHIPPING_BOX_SIZES = [
  { length: 8, width: 6, height: 4, maxItems: 1 },    // Small box
  { length: 12, width: 9, height: 4, maxItems: 4 },   // Medium box
  { length: 14, width: 12, height: 4, maxItems: 8 },  // Large box
  { length: 16, width: 14, height: 6, maxItems: 15 }, // Extra large box
];

export const SHIPPING_CONSTANTS = {
  ORIGIN_ZIP: '33015',
  BASE_WEIGHT_PER_ITEM: 0.5, // Weight in pounds per item (cookies are light!)
  MIN_WEIGHT: 0.1, // Minimum weight in pounds
  COMPANY_NAME: 'Beevs Oven Bakery',
  PRICE_TYPE: 'RETAIL', 
  RATE_INDICATOR: 'SP',
  PROCESSING_CATEGORY: 'MACHINABLE',
  DESTINATION_ENTRY_FACILITY_TYPE: 'NONE',
  MAIL_CLASSES: [
    'PRIORITY_MAIL_EXPRESS',
    'PRIORITY_MAIL',
    'USPS_GROUND_ADVANTAGE',
    'FIRST-CLASS_PACKAGE_SERVICE'
  ]
};

export const calculateShippingDimensions = (itemCount: number): ShippingDimensions => {
  const appropriateBox = SHIPPING_BOX_SIZES.find(box => box.maxItems >= itemCount) 
    || SHIPPING_BOX_SIZES[SHIPPING_BOX_SIZES.length - 1];

  const calculatedWeight = itemCount * SHIPPING_CONSTANTS.BASE_WEIGHT_PER_ITEM;
  const weight = Math.max(calculatedWeight, SHIPPING_CONSTANTS.MIN_WEIGHT);

  return {
    ...appropriateBox,
    weight: Number(weight.toFixed(2))
  };
};

export const getServiceDescription = (mailClass: string): string => {
  switch (mailClass) {
    case 'PRIORITY_MAIL_EXPRESS':
      return 'Next Day to 2-Day Guarantee';
    case 'PRIORITY_MAIL':
      return '1-3 Business Days';
    case 'USPS_GROUND_ADVANTAGE':
      return '2-5 Business Days';
    case 'FIRST-CLASS_PACKAGE_SERVICE':
      return '2-5 Business Days';
    default:
      return 'Standard Shipping';
  }
};

export const getServiceName = (mailClass: string): string => {
  switch (mailClass) {
    case 'PRIORITY_MAIL_EXPRESS':
      return 'Express Delivery';
    case 'PRIORITY_MAIL':
      return 'Priority Delivery';
    case 'USPS_GROUND_ADVANTAGE':
      return 'Ground Advantage';
    case 'FIRST-CLASS_PACKAGE_SERVICE':
      return 'First Class Package';
    default:
      return 'Standard Delivery';
  }
};

export const getEstimatedDeliveryDate = (mailClass: string): string => {
  const today = new Date();
  let daysToAdd = 3;

  switch (mailClass) {
    case 'PRIORITY_MAIL_EXPRESS':
      daysToAdd = 1;
      break;
    case 'PRIORITY_MAIL':
      daysToAdd = 3;
      break;
    case 'USPS_GROUND_ADVANTAGE':
      daysToAdd = 5;
      break;
    case 'FIRST-CLASS_PACKAGE_SERVICE':
      daysToAdd = 5;
      break;
  }

  const deliveryDate = new Date(today);
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  return deliveryDate.toISOString();
};

export const getFallbackShippingRates = (dimensions: ShippingDimensions): ShippingRate[] => {
  const basePrice = Math.max(5.95, dimensions.weight * 2.5);
  const currentDate = new Date();
  
  return [
    {
      mailClass: 'PRIORITY_MAIL_EXPRESS',
      SKU: 'PME1',
      productName: 'Priority Mail Express',
      totalPrice: basePrice + 15,
      commitment: {
        name: 'Next Day Delivery',
        scheduleDeliveryDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        guaranteedDelivery: true
      },
      productDefinition: 'Overnight Delivery Guaranteed',
    },
    {
      mailClass: 'PRIORITY_MAIL',
      SKU: 'PM1',
      productName: 'Priority Mail',
      totalPrice: basePrice + 5,
      commitment: {
        name: 'Priority Service',
        scheduleDeliveryDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        guaranteedDelivery: false
      },
      productDefinition: '1-3 Business Days',
    },
    {
      mailClass: 'USPS_GROUND_ADVANTAGE',
      SKU: 'GA1',
      productName: 'USPS Ground Advantage',
      totalPrice: basePrice,
      commitment: {
        name: 'Ground Service',
        scheduleDeliveryDate: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        guaranteedDelivery: false
      },
      productDefinition: '2-5 Business Days',
    }
  ];
};