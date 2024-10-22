import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/router';
import { ProductFields } from '@/types/ProductTypes';

// Definir el tipo para el item del carrito
interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

// Definir las props del modal
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductFields | null;
  language: 'es' | 'en';
  addToCart: (item: CartItem) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen,
  onClose, 
  product, 
  language, 
  addToCart 
}) => {
  const router = useRouter();

  if (!product) return null;

  const handleBuyNow = () => {
    addToCart({
      id: parseInt(product.image.sys.id),
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image?.fields?.file?.url || '/placeholder.jpg'
    });
    router.push('/CheckOut');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Section */}
              <div className="relative h-[400px] md:h-full">
                <Image
                  src={`https:${product.image.fields.file.url}`}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-8 bg-gradient-to-br from-[#B6D3D2] to-[#936DAD]">
                {/* Logo */}
                <div className="w-24 h-24 mb-6 mx-auto">
                  <Image
                    src="/api/placeholder/96/96"
                    alt="Logo"
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                    <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-white/90 text-lg leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      className="w-full bg-[#D1D550] hover:bg-[#C7CB4B] text-white py-4 px-6 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg transition-colors"
                    >
                      <ShoppingBag className="w-6 h-6" />
                      <span>{language === 'es' ? 'Comprar Ahora' : 'Buy Now'}</span>
                    </motion.button>
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