import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Loader, Phone, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartMutations } from '@/store/Cart';
import Image from 'next/image';

interface PendingOrder {
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    description?: string;
    image_url: string;
  }>;
  amount: number;
}

const PaymentResponse = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'failure' | 'loading'>('loading');
  const { clearCart } = useCartMutations();
  const [processingOrder, setProcessingOrder] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handlePaymentResponse = async () => {
      if (!router.isReady || processingOrder) return;

      const { transactionState } = router.query;
      
      if (transactionState === '4') {
        setStatus('success');
        setShowConfetti(true);

        showConfetti && setTimeout(() => setShowConfetti(false), 5000);
        
        const pendingOrderString = localStorage.getItem('pendingOrder');
        
        if (pendingOrderString && !processingOrder) {
          setProcessingOrder(true);
          
          try {
            const pendingOrder: PendingOrder = JSON.parse(pendingOrderString);
            
            // Send email only
            const emailData = {
              fullName: pendingOrder.customerName,
              email: pendingOrder.customerEmail,
              phone: pendingOrder.shippingAddress.phone,
              address1: pendingOrder.shippingAddress.address,
              city: pendingOrder.shippingAddress.city,
              state: pendingOrder.shippingAddress.state,
              zipCode: pendingOrder.shippingAddress.zipCode,
              orderDetails: pendingOrder.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              totalAmount: pendingOrder.amount / 100
            };

            const emailResponse = await fetch('/api/sendMail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(emailData),
            });

            if (!emailResponse.ok) {
              throw new Error('Error al enviar el correo electrónico');
            }

            clearCart();
            localStorage.removeItem('pendingOrder');
            toast.success('¡Compra realizada con éxito!');
          } catch (error) {
            console.error('Error al procesar la respuesta del pago:', error);
            toast.error('Hubo un error al finalizar tu compra. Por favor, contacta con soporte.');
          }
        }
      } else if (transactionState === '6' || transactionState === '104') {
        setStatus('failure');
        toast.error('El pago no pudo ser procesado. Por favor, intenta nuevamente.');
      }
    };

    handlePaymentResponse();
  }, [router.isReady, router.query, clearCart, processingOrder]);

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-6"
            />
            <div className="flex space-x-2 justify-center mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-[#936DAD] to-[#B6D3D2]"
                />
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#936DAD] to-[#B6D3D2] mb-2 title-font">
                Processing Your Payment / Procesando tu Pago
              </h2>
              <p className="text-gray-600 mb-4 body-font">
                Please wait while we confirm your transaction...
                <br />
                Por favor espera mientras confirmamos tu transacción...
              </p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#ECEACA] to-white p-6 rounded-2xl text-left mb-6 shadow-lg"
            >
              <h3 className="font-semibold text-[#936DAD] mb-4 title-font">Next Steps / Próximos Pasos:</h3>
              <ul className="space-y-4 text-gray-700 body-font">
                {[
                  {
                    en: 'We are processing your payment and verifying the transaction.',
                    es: 'Estamos procesando tu pago y verificando la transacción.'
                  },
                  {
                    en: 'Once confirmed, you will receive an email with your order details.',
                    es: 'Una vez confirmado, recibirás un correo con los detalles de tu pedido.'
                  },
                  {
                    en: 'Need assistance? Contact us:',
                    es: '¿Necesitas ayuda? Contáctanos:'
                  }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-start space-y-1 flex-col body-font"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#936DAD] to-[#D1D550] mr-3" />
                      <span>{item.en}</span>
                    </div>
                    <div className="flex items-center ml-5">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#B6D3D2] to-[#D1D550] mr-3" />
                      <span className="text-gray-500">{item.es}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
  
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(147, 109, 173, 0.2)" }}
                href="mailto:info@beevsoven.com"
                className="flex items-center justify-center bg-gradient-to-r from-[#B6D3D2] to-[#936DAD] text-white py-3 px-6 rounded-full body-font hover:opacity-90 transition-all duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                info@beevsoven.com
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(182, 211, 210, 0.2)" }}
                href="tel:+17862800961"
                className="flex items-center justify-center bg-gradient-to-r from-[#936DAD] to-[#B6D3D2] text-white py-3 px-6 rounded-full body-font hover:opacity-90 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                +1 (786) 280-0961
              </motion.a>
            </div>
          </motion.div>
        )}

        {status === 'failure' && (
          <motion.div
            key="failure"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-6"
            />
            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#936DAD] mb-2 title-font">Pago Fallido</h2>
            <p className="text-gray-600 body-font">Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-6"
            />
            <Loader className="w-24 h-24 text-[#936DAD] mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 body-font">Procesando tu pago...</p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#936DAD] to-[#B6D3D2] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        {renderContent()}
        <AnimatePresence>
          {status !== 'loading' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full bg-[#D1D550] text-white py-4 rounded-full font-semibold hover:bg-[#C7CB4B] transition-colors duration-300 shadow-lg body-font"
              onClick={() => router.push('/')}
            >
              Volver a la página principal
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PaymentResponse;