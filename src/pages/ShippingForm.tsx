import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CreditCard, User, Mail, Phone, Home, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/authContentfulUser';
import { useCart } from '@/store/Cart';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';

interface Product {
  name: string;
  price: number;
  image: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

const ShippingForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { items, subTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products } = useProducts();
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);

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

  useEffect(() => {
    if (products && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setRandomProduct(products[randomIndex]);
    }
  }, [products]);

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
    
    // Crear el objeto de orden completo
    const orderData = {
      purchaseId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      orderDetails: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        description: item.description,
        image_url: item.image_url
      })),
      totalAmount: subTotal,
    };

    // Guardar la orden en localStorage
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));

    const payuData = {
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
        body: JSON.stringify(payuData),
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
    <div className="flex items-center justify-start min-h-screen bg-[#936DAD] p-4 relative overflow-hidden">
      <AnimatePresence>
        {randomProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={`https:${randomProduct.image.fields.file.url}`}
              alt={randomProduct.name}
              layout="fill"
              objectFit="cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-purple-600 opacity-70"></div>
      <Image
        src="/images/SVG/LogoTransparent.svg"
        alt="Logo"
        width={600}
        height={600}
        className="absolute top-4 right-4 z-10 opacity-30 hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10 ml-4 sm:ml-8 md:ml-16 lg:ml-24"
      >
        <motion.div 
          className="bg-[#ECEACA] bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-8 pt-8 pb-6 bg-[#D1D550] flex items-center justify-center"
          >
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mr-4"
            />
            <div className="h-12 w-px bg-white mx-4"></div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <motion.h2 
                className="text-3xl font-extrabold text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                Información de Envío
              </motion.h2>
            </div>
          </motion.div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Nombre Completo" name="fullName" value={formData.fullName} onChange={handleChange} required icon={<User />} />
              <InputField label="Correo Electrónico" name="email" value={formData.email} onChange={handleChange} required type="email" icon={<Mail />} />
              <InputField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} required type="tel" icon={<Phone />} />
              <InputField label="Dirección" name="address" value={formData.address} onChange={handleChange} required icon={<Home />} />
              <InputField label="Ciudad" name="city" value={formData.city} onChange={handleChange} required icon={<MapPin />} />
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">Tipo de Documento</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-full focus:ring-2 focus:ring-purple-500 bg-purple-50"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="NIT">NIT</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>
              <InputField label="Número de Documento" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required />
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#B6D3D2] hover:bg-[#a6c3c2] text-white font-bold py-3 rounded-full transition duration-300 flex items-center justify-center"
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
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
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

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, required = false, type = "text", icon }) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.1 }}
  >
    <label htmlFor={name} className="block text-sm font-semibold text-purple-800">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-purple-500" })}
        </div>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full pl-10 bg-purple-50 border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-full"
      />
    </div>
  </motion.div>
);

export default ShippingForm;