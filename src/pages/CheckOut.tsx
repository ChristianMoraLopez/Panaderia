import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart, useCartMutations, CartItemType } from '@/store/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

// Extendemos el tipo CartItemType para incluir un hash único
interface ExtendedCartItemType extends CartItemType {
  hash: string;
}

const CheckoutPage: React.FC = () => {
  const { items, itemsById, subTotal, count } = useCart();
  const { addToCart, removeFromCart} = useCartMutations();
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const router = useRouter();

  // Convertimos los items del carrito a ExtendedCartItemType con hash único
  const extendedItems: ExtendedCartItemType[] = items.map(item => ({
    ...item,
    hash: uuidv4()
  }));

  const handleQuantityChange = (item: ExtendedCartItemType, change: number) => {
    if (change > 0) {
      addToCart(item, 1);
    } else {
      removeFromCart(item.id);
    }
  };

  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const handleRemoveItem = (itemId: number) => {
    const item = itemsById[itemId];
    if (item) {
      for (let i = 0; i < item.quantity; i++) {
        removeFromCart(itemId);
      }
    }
  };
  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const purchaseId = uuidv4();
      const purchaseDate = new Date().toISOString();

      // Guardamos la información de la compra en el localStorage antes de limpiar el carrito
      localStorage.setItem('currentPurchase', JSON.stringify({
        purchaseId,
        purchaseDate,
        items: extendedItems,
        subTotal,
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      }));

      setIsProcessing(false);
      toast.success('¡Procesando tu pedido!', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

      // Redirigir al usuario al formulario de envío sin limpiar el carrito
      router.push('/shipping');

    } catch (error) {
      setIsProcessing(false);
      toast.error('Hubo un error al procesar tu compra. Por favor, intenta de nuevo.', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      console.error('Error en el checkout:', error);
    }
  };

  // Cálculo del impuesto y total
  const tax = subTotal * 0.1;
  const total = subTotal + tax;

  // Función para obtener URL absoluta de imágenes
  const getAbsoluteImageUrl = (url: string) => {
    return url.startsWith('//') ? `https:${url}` : url;
  };

  return (
    <>
       <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-serif text-amber-800 text-center mb-8 font-bold">Tu Carrito</h1>
          {extendedItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {extendedItems.map((item) => (
                    <CartItem
                      key={item.hash}
                      item={item}
                      handleQuantityChange={handleQuantityChange}
                      handleRemoveItem={handleRemoveItem}
                      getAbsoluteImageUrl={getAbsoluteImageUrl}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <OrderSummary
                subTotal={subTotal}
                tax={tax}
                total={total}
                isProcessing={isProcessing}
                handleCheckout={handleCheckout}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const EmptyCart: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center text-amber-700 text-xl"
  >
    <ShoppingCart size={64} className="mx-auto mb-4 text-amber-500" />
    <p>Tu carrito está vacío</p>
  </motion.div>
);

interface CartItemProps {
  item: ExtendedCartItemType;
  handleQuantityChange: (item: ExtendedCartItemType, change: number) => void;
  handleRemoveItem: (itemId: number) => void;
  getAbsoluteImageUrl: (url: string) => string;
}

const CartItem: React.FC<CartItemProps> = ({ item, handleQuantityChange, handleRemoveItem, getAbsoluteImageUrl }) => (
  <motion.div
    key={item.hash}
    className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Image
      src={getAbsoluteImageUrl(item.image_url)}
      alt={item.name}
      width={80}
      height={80}
      className="rounded-md mr-4 object-cover"
    />
    <div className="flex-grow">
      <h2 className="text-lg font-semibold text-amber-800">{item.name}</h2>
      <p className="text-amber-600">${item.price.toFixed(2)}</p>
    </div>
    <div className="flex items-center">
      <QuantityButton onClick={() => handleQuantityChange(item, -1)} icon={<Minus size={16} />} />
      <span className="mx-2 font-semibold">{item.quantity}</span>
      <QuantityButton onClick={() => handleQuantityChange(item, 1)} icon={<Plus size={16} />} />
    </div>
    <RemoveButton onClick={() => handleRemoveItem(item.id)} />
  </motion.div>
);

interface ButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
}

const QuantityButton: React.FC<ButtonProps> = ({ onClick, icon }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-1 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors duration-200"
  >
    {icon}
  </motion.button>
);

const RemoveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="ml-4 p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
  >
    <Trash2 size={20} />
  </motion.button>
);

interface OrderSummaryProps {
  subTotal: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  handleCheckout: () => Promise<void>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subTotal, tax, total, isProcessing, handleCheckout }) => (
  <div className="lg:col-span-1">
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold text-amber-800 mb-4">Resumen de la Orden</h2>
      <SummaryItem label="Subtotal" value={subTotal} />
      <SummaryItem label="Impuestos" value={tax} />
      <SummaryItem label="Total" value={total} isTotal />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-amber-600 text-white py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 flex items-center justify-center"
        onClick={handleCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          'Proceder al pago'
        )}
      </motion.button>
    </motion.div>
  </div>
);

interface SummaryItemProps {
  label: string;
  value: number;
  isTotal?: boolean;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, isTotal = false }) => (
  <div className={`flex justify-between ${isTotal ? 'text-xl font-bold text-amber-800 mb-6' : 'mb-2'}`}>
    <span>{label}:</span>
    <span>${value.toFixed(2)}</span>
  </div>
);

export default CheckoutPage;