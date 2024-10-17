import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCartMutations } from '@/store/Cart';

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

  useEffect(() => {
    const handlePaymentResponse = async () => {
      if (router.isReady) {
        const { transactionState } = router.query;
        
        if (transactionState === '4') { // Transacción aprobada
          setStatus('success');
          const pendingOrderString = localStorage.getItem('pendingOrder');
          
          if (pendingOrderString) {
            const pendingOrder = JSON.parse(pendingOrderString);
            
            try {
              // Enviar correo electrónico
              const emailResponse = await fetch('/api/sendMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pendingOrder),
              });

              if (!emailResponse.ok) {
                throw new Error('Error al enviar el correo electrónico');
              }

              // Actualizar historial de compras
              if (user) {
                for (const item of pendingOrder.orderDetails) {
                  const productDetails: ProductDetails = {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    description: item.description || 'No description available',
                    imageId: item.image_url || '',
                  };
                  await updatePurchaseHistory(pendingOrder.purchaseId, productDetails);
                }
              } else {
                // Guardar en localStorage para usuarios no autenticados
                const localPurchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
                localPurchaseHistory.push(pendingOrder);
                localStorage.setItem('purchaseHistory', JSON.stringify(localPurchaseHistory));
              }

              // Limpiar el carrito y eliminar la orden pendiente
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
  }, [router.isReady, router.query, user, updatePurchaseHistory, clearCart]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600">Gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>
          </motion.div>
        );
      case 'failure':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Pago Fallido</h2>
            <p className="text-gray-600">Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
          </motion.div>
        );
      default:
        return (
          <div className="text-center">
            <Loader className="w-24 h-24 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Procesando tu pago...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {renderContent()}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 w-full bg-amber-500 text-white py-2 rounded-full font-semibold hover:bg-amber-600 transition-colors duration-300"
          onClick={() => router.push('/')}
        >
          Volver a la página principal
        </motion.button>
      </div>
    </div>
  );
};

export default PaymentResponse;