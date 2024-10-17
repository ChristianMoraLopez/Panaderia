import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Loader2, CreditCard, User, Mail, Phone, Home, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCart, useCartMutations } from '@/store/Cart';
import { v4 as uuidv4 } from 'uuid';

const ShippingForm: React.FC = () => {
  const { user } = useAuth();
  const { clearCart } = useCartMutations();
  const router = useRouter();
  const { items, subTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    documentType: '',
    documentNumber: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push('/checkout');
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    const orderData = {
      amount: subTotal.toFixed(2),
      referenceCode: purchaseId,
      description: `Orden ${purchaseId}`,
      buyerEmail: formData.email,
      payerFullName: formData.fullName,
      billingAddress: formData.address,
      shippingAddress: formData.address,
      telephone: formData.phone,
      payerDocument: `${formData.documentType}${formData.documentNumber}`,
    };

    try {
      const response = await fetch('/api/generatePayuUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Error al generar el formulario de pago');
      }

      const data = await response.json();

      if (data.success && data.htmlForm) {
        // Insertar y enviar el formulario de PayU
        const formContainer = document.createElement('div');
        formContainer.innerHTML = data.htmlForm;
        document.body.appendChild(formContainer);
        const payuForm = formContainer.querySelector('form');
        if (payuForm) {
          clearCart();
          payuForm.submit();
        } else {
          throw new Error('No se pudo encontrar el formulario de PayU');
        }
      } else {
        throw new Error('Error al generar el formulario de pago de PayU');
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toast.error('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
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
          <h1 className="text-3xl font-bold text-amber-800 text-center mb-6">Información de Envío</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Nombre Completo" name="fullName" value={formData.fullName} onChange={handleChange} required icon={<User />} />
            <InputField label="Correo Electrónico" name="email" value={formData.email} onChange={handleChange} required type="email" icon={<Mail />} />
            <InputField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} required type="tel" icon={<Phone />} />
            <InputField label="Dirección" name="address" value={formData.address} onChange={handleChange} required icon={<Home />} />
            <InputField label="Ciudad" name="city" value={formData.city} onChange={handleChange} required icon={<MapPin />} />
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Tipo de Documento</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Selecciona un tipo</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PP">Pasaporte</option>
              </select>
            </div>
            <InputField label="Número de Documento" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 text-white py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceder al Pago
                </>
              )}
            </button>
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

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, required = false, icon }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-amber-700 mb-1">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-500">
          {icon}
        </div>
      )}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

export default ShippingForm;
