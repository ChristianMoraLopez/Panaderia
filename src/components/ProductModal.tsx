import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ShoppingBag, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { useRouter } from "next/router";
import { ProductFields } from "@/types/ProductTypes";
import NutritionalTable from "./NutritionalTable";

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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden w-full max-w-[1800px] shadow-2xl body-font max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] h-full">
              {/* Image Section */}
              <div className="relative h-[300px] sm:h-[400px] md:h-[600px] lg:min-h-[900px] bg-gray-100">
                <Image
                  src={`https:${allImages[currentImageIndex].url}`}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />

                {/* Indicadores de imagen en la parte inferior */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {allImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index ? "bg-white" : "bg-white/50"
                      } transition-all duration-300`}
                    ></div>
                  ))}
                </div>
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
                    </button>

                    {/* Image indicators */}
                    <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                      {unitOptions.map((units) => (
                        <button
                          key={units}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnits(units);
                          }}
                          className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full ${
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
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
                </button>
                {/* Puntos de conexión */}

                <div className="absolute right-0 top-1/2 lg:translate-x-1/2 transform -translate-y-1/2 hidden md:flex flex-col gap-4 lg:gap-6 z-20">
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#884393] shadow-lg"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#f1bfb5] shadow-lg"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-[#d1d451] shadow-lg"></div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#ffff] to-[#fff9] min-h-[500px] lg:min-h-[800px]">
                <div className="h-full flex flex-col">
                  {/* Header with improved spacing and overflow handling */}
                  <div className="bg-[#936cad] p-3 sm:p-4 rounded-t-lg mb-4 sm:mb-8 overflow-hidden">
                    <h2 className="title-font text-3xl sm:text-5xl lg:text-[80px] font-bold text-[#b0c4cc] leading-tight break-words">
                      {product.name}
                    </h2>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                    {/* Left Column - Nutritional Table */}
                    <div className="flex flex-col">
                      {product.nutrutionalTable && (
                        <div className="transform scale-90 origin-top">
                          <NutritionalTable
                            product={product}
                            selectedUnits={selectedUnits}
                            language={language}
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Column - Badges, Description, and Purchase Options */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                      {/* Dietary Badges */}
                      {product.nutrutionalTable && (
                        <div className="flex justify-start my-4 sm:my-8 lg:my-12 ml-4 sm:ml-12 lg:ml-24  sm:-space-x-6 lg:-space-x-15 p-1 bg-white/10 rounded-lg">
                          {product.nutrutionalTable.fields.sugarFree && (
                            <div>
                              <Image
                                src="/images/svg/sugarfree.svg"
                                alt="Sugar Free"
                                width={600}
                                height={400}
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                              />
                            </div>
                          )}
                          {product.nutrutionalTable.fields.glutenFree && (
                            <div>
                              <Image
                                src="/images/svg/glutenfree.svg"
                                alt="Gluten Free"
                                width={400}
                                height={400}
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                              />
                            </div>
                          )}
                          {product.nutrutionalTable.fields.keto && (
                            <div>
                              <Image
                                src="/images/svg/keto.svg"
                                alt="Keto"
                                width={400}
                                height={400}
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                              />
                            </div>
                          )}
                          {product.nutrutionalTable.fields.milkFree && (
                            <div>
                              <Image
                                src="/images/svg/milkfree.svg"
                                alt="Milk Free"
                                width={400}
                                height={400}
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      {/* Description */}
                      <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                        {product.description}
                      </p>

                      {/* Units Selection */}
                      <div className="flex flex-wrap gap-2">
                        {unitOptions.map((units) => (
                          <button
                            key={units}
                            onClick={() => setSelectedUnits(units)}
                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full ${
                              selectedUnits === units
                                ? "bg-[#936cad] text-white"
                                : "bg-white/80 text-gray-800"
                            } hover:bg-[#936cad] hover:text-white transition-colors text-xs sm:text-sm font-semibold`}
                          >
                            {units} {language === "es" ? "Unidades" : "Units"}
                          </button>
                        ))}
                      </div>

                      {/* Price and Purchase Buttons */}
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="title-font text-2xl sm:text-3xl font-bold text-gray-800">
                            ${calculatePrice(product.price).toFixed(2)}
                          </span>
                          {product.giftBoxPrice && (
                            <span className="title-font text-lg sm:text-xl text-gray-600">
                              {t.giftBox}: $
                              {calculatePrice(product.giftBoxPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col  border-t-4 pt-4 border-[#b0c4cc] sm:flex-row gap-2 sm:gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBuyNow}
                            className="flex-1 bg-[#D1D550] hover:bg-[#C7CB4B] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span>{t.buyNow}</span>
                          </motion.button>

                          {product.giftBoxPrice && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleBuyNow}
                              className="flex-1 bg-[#D1D550] hover:bg-[#C7CB4B] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
                            >
                              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                              <span>{t.buyWithGiftBox}</span>
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Allergen Information */}
                      {product.allergenInfo && (
                        <div className="p-3 sm:p-4 ">
                          <p className="text-[#884393] text-sm sm:text-base">
                            {language === "es"
                              ? "Información de Alérgenos:"
                              : "Allergen Information:"}
                          </p>
                          <p className="text-gray-800 mt-2 text-sm sm:text-base">
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
