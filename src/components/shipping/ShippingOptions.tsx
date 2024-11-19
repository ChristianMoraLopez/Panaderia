import React, { useState, useEffect, useCallback } from "react";
import { Package, Loader2, CheckCircle, Info, AlertTriangle } from "lucide-react";
import {
  SHIPPING_CONSTANTS,
  calculateShippingDimensions,
  getServiceDescription,
  getServiceName,
  getEstimatedDeliveryDate,
  getFallbackShippingRates,
  type ShippingDimensions
} from "@/utils/shippingCalculations";
import { ShippingRate } from "@/types/shipping";

interface ShippingOptionsProps {
  destinationZip: string;
  itemCount: number;
  onSelectRate: (rate: ShippingRate) => void;
  selectedRate: ShippingRate | undefined;
}

interface USPSRateResponse {
  SKU: string;
  description: string;
  priceType: string;
  price: number;
  weight: number;
  mailClass: string;
  zone?: string;
  productName?: string;
  productDefinition?: string;
  commitment?: {
    scheduleDeliveryDate: string;
    name?: string;
    guaranteedDelivery?: boolean;
  };
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({
  destinationZip,
  itemCount,
  onSelectRate,
  selectedRate,
}) => {
  const [showDimensions, setShowDimensions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dimensions, setDimensions] = useState<ShippingDimensions | null>(null);

  // Función para añadir días a una fecha
  const addDays = (date: string, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString();
  };

  useEffect(() => {
    if (itemCount > 0) {
      const calculatedDimensions = calculateShippingDimensions(itemCount);
      setDimensions(calculatedDimensions);
    }
  }, [itemCount]);

  const formatRateResponse = useCallback((rate: USPSRateResponse, mailClass: string): ShippingRate => {
    // Añadir 2 días a la fecha de entrega estimada
    const deliveryDate = rate.commitment?.scheduleDeliveryDate || getEstimatedDeliveryDate(mailClass);
    const adjustedDeliveryDate = addDays(deliveryDate, 2);

    return {
      mailClass,
      productName: rate.productName || rate.description || getServiceName(mailClass),
      productDefinition: rate.productDefinition || getServiceDescription(mailClass),
      totalPrice: Number(rate.price) || 0,
      SKU: rate.SKU,
      zone: rate.zone,
      commitment: rate.commitment ? {
        name: rate.commitment.name || getServiceName(mailClass),
        scheduleDeliveryDate: adjustedDeliveryDate,
        guaranteedDelivery: Boolean(rate.commitment.guaranteedDelivery || mailClass === 'PRIORITY_MAIL_EXPRESS')
      } : {
        name: getServiceName(mailClass),
        scheduleDeliveryDate: adjustedDeliveryDate,
        guaranteedDelivery: mailClass === 'PRIORITY_MAIL_EXPRESS'
      }
    };
  }, []);

  const fetchShippingRates = useCallback(async (retryCount = 0) => {
    if (!dimensions) return;

    const fetchRateForMailClass = async (
      mailClass: string
    ): Promise<ShippingRate | null> => {
      try {
        const response = await fetch("/api/shipping-rates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originZIPCode: SHIPPING_CONSTANTS.ORIGIN_ZIP,
            destinationZIPCode: destinationZip,
            weight: dimensions.weight,
            length: dimensions.length,
            width: dimensions.width,
            height: dimensions.height,
            mailClass,
            processingCategory: SHIPPING_CONSTANTS.PROCESSING_CATEGORY,
            rateIndicator: SHIPPING_CONSTANTS.RATE_INDICATOR,
            destinationEntryFacilityType: SHIPPING_CONSTANTS.DESTINATION_ENTRY_FACILITY_TYPE,
            priceType: SHIPPING_CONSTANTS.PRICE_TYPE,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch rate for ${mailClass}`);
        }

        const data = await response.json();
        const rateResponse = data.rates?.[0];

        if (!rateResponse) {
          throw new Error(`No rate available for ${mailClass}`);
        }

        return formatRateResponse(rateResponse, mailClass);
      } catch (error) {
        console.warn(`Error fetching rate for ${mailClass}:`, error);
        return null;
      }
    };

    try {
      if (!destinationZip || !/^\d{5}$/.test(destinationZip)) {
        throw new Error("Please enter a valid 5-digit ZIP code");
      }

      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);

      const validRates: ShippingRate[] = [];
      const progressIncrement = 100 / SHIPPING_CONSTANTS.MAIL_CLASSES.length;

      // Hacer todas las llamadas en paralelo
      const results = await Promise.allSettled(
        SHIPPING_CONSTANTS.MAIL_CLASSES.map(mailClass => 
          fetchRateForMailClass(mailClass)
        )
      );

      // Procesar resultados
      results.forEach((result) => {
        setLoadingProgress((prev) => Math.min(prev + progressIncrement, 99));
        if (result.status === 'fulfilled' && result.value) {
          const rate = result.value;
          const isDuplicate = validRates.some(existingRate => 
            existingRate.mailClass === rate.mailClass
          );
          
          if (!isDuplicate) {
            validRates.push(rate);
          }
        }
      });

      setLoadingProgress(100);

      if (validRates.length > 0) {
        const uniqueRates = validRates
          .sort((a, b) => a.totalPrice - b.totalPrice)
          .filter((rate, index, self) => 
            index === self.findIndex(r => 
              r.mailClass === rate.mailClass || 
              (Math.abs(r.totalPrice - rate.totalPrice) < 0.01 && 
               r.productDefinition === rate.productDefinition)
            )
          );
        
        setRates(uniqueRates);
        setError(null);
      } else {
        if (retryCount < 2) {
          setIsRetrying(true);
          setTimeout(() => {
            fetchShippingRates(retryCount + 1);
          }, 100);
        } else {
          const fallbackRates = getFallbackShippingRates(dimensions);
          setRates(fallbackRates);
          setError(null);
        }
      }
    } catch (error) {
      console.error("Error fetching shipping rates:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      
      if (retryCount < 2) {
        setIsRetrying(true);
        setTimeout(() => {
          fetchShippingRates(retryCount + 1);
        }, 100);
      } else {
        const fallbackRates = getFallbackShippingRates(dimensions);
        setRates(fallbackRates);
        setError(null);
      }
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
      if (retryCount >= 2) {
        setIsRetrying(false);
      }
    }
  }, [destinationZip, dimensions, formatRateResponse]);

  // Efecto para iniciar la búsqueda de tarifas cuando tengamos dimensiones y código postal
  useEffect(() => {
    if (destinationZip && dimensions) {
      fetchShippingRates();
    }
  }, [fetchShippingRates, destinationZip, dimensions]);

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-2">
      <Loader2 className="w-8 h-8 animate-spin text-[#936DAD]" />
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-[#936DAD] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <p className="text-sm text-[#936DAD]">
        {isRetrying ? "Retrying... " : ""}
        Loading shipping rates ({Math.round(loadingProgress)}%)
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="p-4 bg-red-50 rounded-lg text-red-600">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5" />
        <span>{error}</span>
      </div>
      <p className="mt-2 text-sm">
        Please try again later or contact support if the problem persists.
      </p>
    </div>
  );

  const renderShippingOption = (rate: ShippingRate) => {
    const isSelected = selectedRate?.mailClass === rate.mailClass;
    return (
      <div
        key={rate.mailClass}
        onClick={() => onSelectRate(rate)}
        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
          isSelected
            ? "bg-[#936DAD] text-white shadow-lg"
            : "bg-white hover:bg-[#936DAD]/10 border border-[#936DAD]/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                isSelected ? "bg-white/20" : "bg-[#936DAD]/10"
              }`}
            >
              <Package
                className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#936DAD]"}`}
              />
            </div>
            <div>
              <h4
                className={`font-bold ${
                  isSelected ? "text-white" : "text-[#936DAD]"
                }`}
              >
                {rate.productName}
              </h4>
              {rate.commitment && (
                <div>
                  <p
                    className={`text-sm ${
                      isSelected ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    Delivery by{" "}
                    {new Date(rate.commitment.scheduleDeliveryDate).toLocaleDateString()}
                    {rate.commitment.guaranteedDelivery && " (Guaranteed)"}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isSelected ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    Includes 2 business days for order preparation
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`text-lg font-bold ${
                isSelected ? "text-white" : "text-[#936DAD]"
              }`}
            >
              ${rate.totalPrice.toFixed(2)}
            </span>
            {isSelected && (
              <CheckCircle className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
        {rate.productDefinition && (
          <p
            className={`mt-2 text-sm ${
              isSelected ? "text-white/70" : "text-gray-500"
            }`}
          >
            {rate.productDefinition}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#936DAD]">
          Select Shipping Method
        </h3>
        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className="text-[#936DAD] hover:text-[#8363A7] flex items-center space-x-1"
        >
          <Info size={16} />
          <span className="text-sm">Package Details</span>
        </button>
      </div>

      <div className="bg-[#936DAD]/10 p-3 rounded-lg text-sm">
        <p className="text-[#936DAD]">
          All delivery dates include 2 business days for order preparation
        </p>
      </div>

      {showDimensions && dimensions && (
        <div className="bg-[#936DAD]/10 p-4 rounded-lg text-sm space-y-2">
          <p className="text-[#936DAD]">
            Package Weight: {dimensions.weight} lbs ({itemCount} items)
          </p>
          <p className="text-[#936DAD]">
            Dimensions: {dimensions.length}&quot; × {dimensions.width}&quot; × {dimensions.height}&quot;
          </p>
        </div>
      )}

      {isLoading || initialLoading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : rates.length === 0 && !isRetrying ? (
        <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700 text-center">
          No shipping rates available for this destination
        </div>
      ) : (
        <div className="space-y-3">
          {rates.map(renderShippingOption)}
        </div>
      )}
    </div>
  );
};

export default ShippingOptions;