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

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    required?: boolean;
    type?: string;
    icon?: React.ReactNode;
    }

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, required = false, type = 'text', icon }) => {

    return (
        <div className="flex items-center space-x-2">
            {icon && icon}
            <label htmlFor={name} className="sr-only">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={label}
                className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
        </div>
    );
}


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
    state: '', // Added for US
    zipCode: '', // Added for US
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
      toast.error('The cart total is invalid. Please check your cart.');
      setIsSubmitting(false);
      return;
    }

    const purchaseId = uuidv4();

    try {
      // Prepare order data for Stripe
      const stripeData = {
        amount: subTotal,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          description: item.description || '',
          image_url: item.image_url
        })),
        customerEmail: formData.email,
        customerName: formData.fullName,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        metadata: {
          purchaseId,
        }
      };

      // Store order data in localStorage
      localStorage.setItem('pendingOrder', JSON.stringify({
        purchaseId,
        ...stripeData,
        total: subTotal
      }));

      // Send request to create Stripe session
      const response = await fetch('/api/generateStripeUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stripeData),
      });

      if (!response.ok) {
        throw new Error('Error creating payment session');
      }

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Invalid response from payment server');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('There was an error processing your order. Please try again.');
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
                Shipping Information
              </motion.h2>
            </div>
          </motion.div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required icon={<User />} />
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} required type="email" icon={<Mail />} />
              <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required type="tel" icon={<Phone />} />
              <InputField label="Address" name="address" value={formData.address} onChange={handleChange} required icon={<Home />} />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} required icon={<MapPin />} />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} required />
              <InputField label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
              
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
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

export default ShippingForm;