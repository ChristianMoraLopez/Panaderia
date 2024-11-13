import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart, useCartMutations, CartItemType } from '@/store/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface ExtendedCartItemType extends CartItemType {
  hash: string;
}

const CheckoutPage: React.FC = () => {
  const { items, itemsById, subTotal, count } = useCart();
  const { addToCart, removeFromCart } = useCartMutations();
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const router = useRouter();

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

      localStorage.setItem('currentPurchase', JSON.stringify({
        purchaseId,
        purchaseDate,
        items: extendedItems,
        subTotal,
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      }));

      setIsProcessing(false);
      toast.success(language === 'es' ? '¡Procesando tu pedido!' : 'Processing your order!', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

      router.push('/shipping');

    } catch (error) {
      setIsProcessing(false);
      toast.error(language === 'es' ? 'Hubo un error al procesar tu compra. Por favor, intenta de nuevo.' : 'There was an error processing your purchase. Please try again.', {
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

  const tax = subTotal * 0.06;
  const total = subTotal + tax;

  const getAbsoluteImageUrl = (url: string) => {
    return url.startsWith('//') ? `https:${url}` : url;
  };

  return (
    <>
      <Navbar cartCount={count} language={language} toggleLanguage={toggleLanguage} />
      <div className="min-h-screen bg-gradient-to-br from-[#FFFF] via-[#FFF8] to-[#FFFF] pt-24">
        <div className="container mx-auto px-4 py-12">
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-12 tracking-tighter text-[#936DAD] text-center drop-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {language === 'es' ? 'Tu Carrito' : 'Your Cart'}
          </motion.h1>
          {extendedItems.length === 0 ? (
            <EmptyCart language={language} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {extendedItems.map((item) => (
                    <CartItem
                      key={item.hash}
                      item={item}
                      handleQuantityChange={handleQuantityChange}
                      handleRemoveItem={handleRemoveItem}
                      getAbsoluteImageUrl={getAbsoluteImageUrl}
                      language={language}
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
                language={language}
              />
            </div>
          )}
        </div>
      </div>
      <Footer language={language} />
    </>
  );
};

const EmptyCart: React.FC<{ language: string }> = ({ language }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center text-[#936DAD] text-2xl"
  >
    <ShoppingCart size={80} className="mx-auto mb-6 text-[#936DAD]" />
    <p>{language === 'es' ? 'Tu carrito está vacío' : 'Your cart is empty'}</p>
  </motion.div>
);

interface CartItemProps {
  item: ExtendedCartItemType;
  handleQuantityChange: (item: ExtendedCartItemType, change: number) => void;
  handleRemoveItem: (itemId: number) => void;
  getAbsoluteImageUrl: (url: string) => string;
  language: string;
}

const CartItem: React.FC<CartItemProps> = ({ item, handleQuantityChange, handleRemoveItem, getAbsoluteImageUrl,  }) => (
  <motion.div
    key={item.hash}
    className="bg-white rounded-xl shadow-2xl p-6 mb-8 flex items-center group hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative h-24 w-24 mr-6">
      <Image
        src={getAbsoluteImageUrl(item.image_url)}
        alt={item.name}
        layout="fill"
        objectFit="cover"
        className="rounded-lg transition-transform duration-300 transform group-hover:scale-110"
      />
    </div>
    <div className="flex-grow">
      <h2 className="text-2xl font-serif font-bold text-[#936DAD] mb-2">{item.name}</h2>
      <p className="text-lg text-[#B6D3D2]">${item.price.toFixed(2)}</p>
    </div>
    <div className="flex items-center bg-[#F2BFBB]/20 rounded-full p-1">
      <QuantityButton onClick={() => handleQuantityChange(item, -1)} icon={<Minus size={20} />} />
      <span className="mx-4 font-bold text-xl text-[#936DAD]">{item.quantity}</span>
      <QuantityButton onClick={() => handleQuantityChange(item, 1)} icon={<Plus size={20} />} />
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
    className="p-2 rounded-full bg-[#B6D3D2] text-[#936DAD] hover:bg-[#D1D550] transition-colors duration-200"
  >
    {icon}
  </motion.button>
);

const RemoveButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="ml-6 p-3 text-[#F2BFBB] hover:text-[#936DAD] transition-colors duration-200"
  >
    <Trash2 size={24} />
  </motion.button>
);

interface OrderSummaryProps {
  subTotal: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  handleCheckout: () => Promise<void>;
  language: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subTotal, tax, total, isProcessing, handleCheckout, language }) => (
  <div className="lg:col-span-1">
    <motion.div
      className="bg-white rounded-xl shadow-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-3xl font-serif font-bold text-[#936DAD] mb-6">
        {language === 'es' ? 'Resumen de la Orden' : 'Order Summary'}
      </h2>
      <SummaryItem label={language === 'es' ? 'Subtotal' : 'Subtotal'} value={subTotal} />
      <SummaryItem label={language === 'es' ? 'Impuestos' : 'Taxes'} value={tax} />
      <SummaryItem label={language === 'es' ? 'Total' : 'Total'} value={total} isTotal />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-[#936DAD] text-white py-4 rounded-full font-bold text-xl hover:bg-[#8A5EA3] transition-colors duration-300 flex items-center justify-center shadow-lg"
        onClick={handleCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            {language === 'es' ? 'Procesando...' : 'Processing...'}
          </>
        ) : (
          language === 'es' ? 'Proceder al pago' : 'Proceed to payment'
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
  <div className={`flex justify-between ${isTotal ? 'text-2xl font-bold text-[#936DAD] mb-8' : 'text-xl mb-4 text-[#B6D3D2]'}`}>
    <span>{label}:</span>
    <span>${value.toFixed(2)}</span>
  </div>
);

export default CheckoutPage;