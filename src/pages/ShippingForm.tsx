import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Truck as TruckIcon, Cake as CakeIcon, User, Mail, Phone, Home, Building, MapPin, Flag, MapPinned, IdCard} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCart } from '@/store/Cart';
import { v4 as uuidv4 } from 'uuid';

// Define OrderItem interface
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

// Define OrderData interface
interface OrderData {
  purchaseId: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  orderDetails: OrderItem[];
  totalAmount: number;
}

const ShippingForm: React.FC = () => {
  const { user } = useAuth();
  const { items, subTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    idNumber: '', 
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

    if (subTotal <= 0) {
      toast.error('El total de la compra no es válido. Por favor, revisa tu carrito.');
      setIsSubmitting(false);
      return;
    }

    const purchaseId = uuidv4();

    // Prepare order data
    const orderData: OrderData = {
      purchaseId,
      ...formData,
      orderDetails: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: subTotal,
    };

    // Save order data to local storage or state management system
    localStorage.setItem('currentOrder', JSON.stringify(orderData));

    // Prepare data for PayU
    const payuData = {
      amount: subTotal.toFixed(2),
      referenceCode: purchaseId,
      description: `Compra en Mi Tienda - Ref: ${purchaseId}`,
      buyerEmail: formData.email,
      payerFullName: formData.fullName,
      billingAddress: `${formData.address1}, ${formData.address2 || ''}`,
      shippingAddress: `${formData.address1}, ${formData.address2 || ''}`,
      telephone: formData.phone,
      payerDocument: formData.idNumber,
    };

    try {
      const response = await fetch('/api/generatePayuUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payuData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate payment form');
      }

      const data = await response.json();

      if (data.success && data.htmlForm) {
        // Create a temporary div to hold the HTML form
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.htmlForm;
        
        // Find the form element
        const form = tempDiv.querySelector('form');
        
        if (form) {
          // Append the form to the body and submit it
          document.body.appendChild(form);
          form.submit();
        } else {
          throw new Error('Payment form not found in the response');
        }
      } else {
        throw new Error(data.error || 'Failed to generate payment form');
      }
    } catch (error) {
      console.error('Error generating payment form:', error);
      toast.error('Error al procesar el pago. Por favor, inténtelo de nuevo.');
      // Remove the saved order data if there's an error
      localStorage.removeItem('currentOrder');
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
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-amber-200"
        >
          <div className="flex items-center justify-center mb-8">
            <CakeIcon className="text-amber-600 w-16 h-16 mr-4" />
            <h1 className="text-4xl font-serif text-amber-800 text-center font-bold">Información de Envío</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                icon={<User className="text-amber-600" />}
              />
              <InputField
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                icon={<Mail className="text-amber-600" />}
              />
              <InputField
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                type="tel"
                icon={<Phone className="text-amber-600" />}
              />
              <InputField
                label="Cédula"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                icon={<IdCard className="text-amber-600" />}
              />
              <InputField
                label="Dirección Línea 1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                required
                icon={<Home className="text-amber-600" />}
              />
              <InputField
                label="Dirección Línea 2 (Opcional)"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                icon={<Building className="text-amber-600" />}
              />
              <InputField
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                icon={<MapPin className="text-amber-600" />}
              />
              <InputField
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                icon={<Flag className="text-amber-600" />}
              />
              <InputField
                label="Código Postal"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                icon={<MapPinned className="text-amber-600" />}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center text-lg shadow-lg"
              type="submit"
              disabled={isSubmitting}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
                  >
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
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
                    <TruckIcon className="mr-2 h-6 w-6" />
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
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        className={`block w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

export default ShippingForm;
