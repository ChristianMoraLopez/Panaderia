import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader, Phone, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCartMutations } from '@/store/Cart';
import Image from 'next/image';

interface ProductDetails {
  name: string;
  price: number;
  description: string;
  imageId: string;
  quantity: number;
}

const PaymentResponse = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'failure' | 'loading'>('loading');
  const { user, updatePurchaseHistory } = useAuth();
  const { clearCart } = useCartMutations();
  const [emailSent, setEmailSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handlePaymentResponse = async () => {
      if (router.isReady) {
        const { transactionState } = router.query;
        
        if (transactionState === '4') {
          setStatus('success');
          setShowConfetti(true);
          const pendingOrderString = localStorage.getItem('pendingOrder');
          
          if (pendingOrderString && !emailSent) {
            const pendingOrder = JSON.parse(pendingOrderString);
            
            try {
              const completeAddress = `${pendingOrder.address || ''}, ${pendingOrder.city || ''}, ${pendingOrder.state || ''}, ${pendingOrder.zipCode || ''}`.trim();
              
              const emailResponse = await fetch('/api/sendMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...pendingOrder,
                  address: completeAddress
                }),
              });

              if (!emailResponse.ok) {
                throw new Error('Error al enviar el correo electrónico');
              }

              setEmailSent(true);

              if (user) {
                for (const item of pendingOrder.orderDetails) {
                  const productDetails: ProductDetails = {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    description: item.description,
                    imageId: item.image_url
                  };
                  await updatePurchaseHistory(pendingOrder.purchaseId, productDetails);
                }
              } else {
                const localPurchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
                localPurchaseHistory.push(pendingOrder);
                localStorage.setItem('purchaseHistory', JSON.stringify(localPurchaseHistory));
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
      }
    };

    handlePaymentResponse();
  }, [router.isReady, router.query, user, updatePurchaseHistory, clearCart, emailSent]);

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
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[#936DAD]"
              ></motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[#B6D3D2]"
              ></motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.6, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-[#F3BEB6]"
              ></motion.div>
            </div>
            
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative"
                >
                  <CheckCircle className="w-24 h-24 text-[#D1D550] mx-auto mb-4" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-[#936DAD] mb-2">¡Pago Exitoso!</h2>
              <p className="text-gray-600 mb-4">Gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#ECEACA] p-6 rounded-2xl text-left mb-6 shadow-lg"
            >
              <h3 className="font-semibold text-[#936DAD] mb-4">Próximos pasos:</h3>
              <ul className="space-y-4 text-gray-700">
                {['Recibirás un correo electrónico con la confirmación de tu pedido en breve.',
                  'Nos pondremos en contacto contigo para coordinar la entrega.',
                  'Si tienes alguna pregunta o necesitas gestionar el envío, contáctanos:'].map((text, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="flex items-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#D1D550] mr-3"></div>
                    {text}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="mailto:contacto@beevovenbakery.com"
                className="flex items-center justify-center bg-[#B6D3D2] text-white py-3 px-6 rounded-full"
              >
                <Mail className="w-5 h-5 mr-2" />
                contacto@beevovenbakery.com
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="tel:+17862800961"
                className="flex items-center justify-center bg-[#936DAD] text-white py-3 px-6 rounded-full"
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
            <h2 className="text-2xl font-bold text-[#936DAD] mb-2">Pago Fallido</h2>
            <p className="text-gray-600">Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
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
            <p className="text-gray-600">Procesando tu pago...</p>
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
              className="mt-8 w-full bg-[#D1D550] text-white py-4 rounded-full font-semibold hover:bg-[#C7CB4B] transition-colors duration-300 shadow-lg"
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