import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ShoppingBag, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { useRouter } from "next/router";
import { ProductFields } from "@/types/ProductTypes";
import NutritionalTable from "./NutritionalTable";
import DietaryBadges from "./ProductModalComponents/DietaryBadges";

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductFields | null;
  language: "es" | "en";
  addToCart: (item: CartItem) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  language,
  addToCart,
}) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Initialize selectedUnits with a default value of 0
  const [selectedUnits, setSelectedUnits] = useState<number>(0);

  // Set the selectedUnits when product changes
  useEffect(() => {
    if (product) {
      setSelectedUnits(product.units);
    }
  }, [product]);

  // Return null if product is not available
  if (!product) return null;

  // Calculate unit options after we've confirmed product exists
  const unitOptions = [product.units, product.units * 2, product.units * 4].map(
    Math.round
  );

  // Función para calcular precios
  const calculatePrice = (basePrice: number): number => {
    return basePrice * (selectedUnits / product.units);
  };

  // Construir array de todas las imágenes
  const mainImage = { url: product.image.fields.file.url };
  const additionalImages =
    product.anotherImages?.map((img) => ({ url: img.fields.file.url })) || [];
  const allImages = [mainImage, ...additionalImages];

  const handleBuyNow = () => {
    addToCart({
      id: parseInt(product.image.sys.id),
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image?.fields?.file?.url || "/placeholder.jpg",
    });
    router.push("/CheckOut");
    onClose();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const translations = {
    es: {
      nutritionalInfo: "Información Nutricional",
      servingSize: "Tamaño de Porción",
      calories: "Calorías",
      fatCalories: "Calorías de Grasa",
      totalFat: "Grasa Total",
      cholesterol: "Colesterol",
      sodium: "Sodio",
      totalCarbs: "Carbohidratos Totales",
      protein: "Proteína",
      vitaminA: "Vitamina A",
      vitaminC: "Vitamina C",
      calcium: "Calcio",
      iron: "Hierro",

      buyNow: "Comprar Ahora",
      giftBox: "Caja Regalo",
      units: "Unidades",
      buyWithGiftBox: "Comprar con Caja Regalo",
    },
    en: {
      nutritionalInfo: "Nutritional Information",
      servingSize: "Serving Size",
      calories: "Calories",
      fatCalories: "Fat Calories",
      totalFat: "Total Fat",
      cholesterol: "Cholesterol",
      sodium: "Sodium",
      totalCarbs: "Total Carbohydrates",
      protein: "Protein",
      vitaminA: "Vitamin A",
      vitaminC: "Vitamin C",
      calcium: "Calcium",
      iron: "Iron",

      buyNow: "Buy Now",
      giftBox: "Gift Box",
      units: "Units",
      buyWithGiftBox: "Buy with Gift Box",
    },
  };

  const t = translations[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg sm:rounded-xl overflow-hidden w-full max-w-[1200px] shadow-xl body-font max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] h-full">
              {/* Image Section */}
              <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:min-h-[600px] bg-gray-100">
                <Image
                  src={`https:${allImages[currentImageIndex].url}`}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />

                {/* Indicadores de imagen en la parte inferior */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {allImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        currentImageIndex === index ? "bg-white" : "bg-white/50"
                      } transition-all duration-300`}
                    ></div>
                  ))}
                </div>
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
                    </button>

                    {/* Image indicators */}
                    <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                      {unitOptions.map((units) => (
                        <button
                          key={units}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnits(units);
                          }}
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full ${
                            selectedUnits === units
                              ? "bg-[#936cad] text-white"
                              : "bg-white/80 text-gray-800"
                          } hover:bg-[#936cad] hover:text-white transition-colors font-semibold`}
                        >
                          {units} {language === "es" ? "Unidades" : "Units"}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
                </button>
                
                {/* Puntos de conexión */}
                <div className="absolute right-0 top-1/2 lg:translate-x-1/2 transform -translate-y-1/2 hidden md:flex flex-col gap-2 lg:gap-3 z-20">
                  <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-[#884393] shadow-lg"></div>
                  <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-[#f1bfb5] shadow-lg"></div>
                  <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-[#d1d451] shadow-lg"></div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-[#ffff] to-[#fff9] min-h-[400px] lg:min-h-[600px]">
                <div className="h-full flex flex-col">
                  {/* Header with improved spacing and overflow handling */}
                  <div className="bg-[#936cad] p-2 sm:p-3 rounded-t-lg mb-3 sm:mb-4 overflow-hidden">
                    <h2 className="title-font text-2xl sm:text-3xl lg:text-5xl font-bold text-[#b0c4cc] leading-tight break-words">
                      {product.name}
                    </h2>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {/* Left Column - Nutritional Table */}
                    <div className="flex flex-col">
                      {product.nutrutionalTable && (
                        <div className="transform scale-85 origin-top">
                          <NutritionalTable
                            product={product}
                            selectedUnits={selectedUnits}
                            language={language}
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Column - Badges, Description, and Purchase Options */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Dietary Badges */}
{product.nutrutionalTable && (
  <DietaryBadges nutritionalTable={product.nutrutionalTable} />
)}
                      {/* Description */}
                      <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                        {product.description}
                      </p>

                      {/* Units Selection */}
                      <div className="flex flex-wrap gap-1">
                        {unitOptions.map((units) => (
                          <button
                            key={units}
                            onClick={() => setSelectedUnits(units)}
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                              selectedUnits === units
                                ? "bg-[#936cad] text-white"
                                : "bg-white/80 text-gray-800"
                            } hover:bg-[#936cad] hover:text-white transition-colors text-xs font-semibold`}
                          >
                            {units} {language === "es" ? "Unidades" : "Units"}
                          </button>
                        ))}
                      </div>

                      {/* Price and Purchase Buttons */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="title-font text-xl sm:text-2xl font-bold text-gray-800">
                            ${calculatePrice(product.price).toFixed(2)}
                          </span>
                          {product.giftBoxPrice && (
                            <span className="title-font text-base sm:text-lg text-gray-600">
                              {t.giftBox}: $
                              {calculatePrice(product.giftBoxPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col border-t-2 pt-2 border-[#b0c4cc] sm:flex-row gap-1 sm:gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBuyNow}
                            className="flex-1 bg-[#D1D550] hover:bg-[#C7CB4B] text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-1"
                          >
                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>{t.buyNow}</span>
                          </motion.button>

                          {product.giftBoxPrice && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleBuyNow}
                              className="flex-1 bg-[#D1D550] hover:bg-[#C7CB4B] text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-1"
                            >
                              <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>{t.buyWithGiftBox}</span>
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Allergen Information */}
                      {product.allergenInfo && (
                        <div className="p-2 sm:p-3">
                          <p className="text-[#884393] text-xs sm:text-sm">
                            {language === "es"
                              ? "Información de Alérgenos:"
                              : "Allergen Information:"}
                          </p>
                          <p className="text-gray-800 mt-1 text-xs sm:text-sm">
                            {product.allergenInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
