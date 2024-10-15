import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCart, useCartMutations } from '@/store/Cart';
import { v4 as uuidv4 } from 'uuid';
import { Truck as TruckIcon, Cake as CakeIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Definir la interfaz OrderItem
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

// Definir la interfaz OrderData
interface OrderData {
  purchaseId: string;
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  orderDetails: OrderItem[];
  totalAmount: number;
}

const ShippingForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subTotal } = useCart();
  const { clearCart } = useCartMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Preparar los datos del pedido
    const orderData: OrderData = {
      purchaseId: uuidv4(),
      ...formData,
      orderDetails: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: subTotal,
    };

    try {
      const response = await fetch('/api/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Pedido completado con éxito', {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          duration: 5000,
        });

        clearCart();
        setTimeout(() => {
          router.push('/');
        }, 5000);
      } else {
        throw new Error(data.message || 'Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toast.error('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8"
        >
          <div className="flex items-center justify-center mb-8">
            <CakeIcon className="text-amber-600 w-12 h-12 mr-4" />
            <h1 className="text-3xl font-serif text-amber-800 text-center font-bold">Información de Envío</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                icon={<span className="text-amber-600">👤</span>}
              />
              <InputField
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                icon={<span className="text-amber-600">✉️</span>}
              />
              <InputField
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                type="tel"
                icon={<span className="text-amber-600">📞</span>}
              />
              <InputField
                label="Dirección Línea 1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                required
                icon={<span className="text-amber-600">🏠</span>}
              />
              <InputField
                label="Dirección Línea 2 (Opcional)"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                icon={<span className="text-amber-600">🏢</span>}
              />
              <InputField
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                icon={<span className="text-amber-600">🌆</span>}
              />
              <InputField
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                icon={<span className="text-amber-600">🏞️</span>}
              />
              <InputField
                label="Código Postal"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                icon={<span className="text-amber-600">📮</span>}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-amber-600 text-white py-4 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 flex items-center justify-center text-lg"
              type="submit"
              disabled={isSubmitting}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando pedido...
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <TruckIcon className="mr-2 h-5 w-5" />
                    Completar Pedido
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, required = false, type = 'text', icon }) => (
  <div className="relative">
    <label htmlFor={name} className="block text-sm font-medium text-amber-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

export default ShippingForm;
