// types/usps.ts

export interface USPSShippingRequest {
    pricingOptions: Array<{
      priceType: 'RETAIL' | 'COMMERCIAL' | 'CONTRACT';
      paymentAccount?: {
        accountType: 'EPS' | 'PERMIT' | 'METER';
        accountNumber: string;
      };
    }>;
    originZIPCode: string;
    destinationZIPCode: string;
    destinationEntryFacilityType?: 'NONE' | 'DESTINATION_NETWORK_DISTRIBUTION_CENTER' | 'DESTINATION_SECTIONAL_CENTER_FACILITY' | 'DESTINATION_DELIVERY_UNIT' | 'DESTINATION_SERVICE_HUB';
    packageDescription: {
      mailClass: string[];
      weight: number;
      length: number;
      width: number;
      height: number;
      packageValue?: number;
      mailingDate?: string;
      extraServices?: Array<number>;
    };
    shippingFilter?: 'PRICE' | 'SERVICE_STANDARDS';
  }