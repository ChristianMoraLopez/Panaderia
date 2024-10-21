import React, { useState, useEffect } from 'react';
import { useAuth } from '@hooks/authContentfulUser';
import { useRouter } from 'next/router';
import { User, Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const { registerUser, error } = useAuth();
  const router = useRouter();
  const { products } = useProducts();
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setRandomProduct(products[randomIndex]);
    }
  }, [products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await registerUser(formData);
      router.push('/ProfilePage');
    } catch (err) {
      // El error ya se maneja en el hook
    } finally {
      setIsRegistering(false);
    }
  };

  const inputFields = [
    { name: 'name', label: 'Nombre', icon: User, placeholder: 'María' },
    { name: 'lastName', label: 'Apellido', icon: User, placeholder: 'González' },
    { name: 'email', label: 'Correo Electrónico', icon: Mail, placeholder: 'maria@ejemplo.com' },
    { name: 'password', label: 'Contraseña', icon: Lock, placeholder: '********' },
  ];

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
                Regístrate
              </motion.h2>
              <div className="flex space-x-2 justify-center mt-2">
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
            </div>
          </motion.div>

          <div className="px-8 py-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="space-y-4">
              {inputFields.map((field, index) => (
                <motion.div 
                  key={field.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <label 
                    htmlFor={field.name} 
                    className="block text-sm font-semibold text-purple-800"
                  >
                    {field.label}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon className="h-5 w-5 text-purple-500" aria-hidden="true" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.name === 'password' ? 'password' : 'text'}
                      required
                      className="block w-full pl-10 bg-purple-50 border-purple-300 focus:ring-purple-500 focus:border-purple-500 rounded-full"
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                    />
                  </div>
                </motion.div>
              ))}
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#B6D3D2] hover:bg-[#a6c3c2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Horneando tu cuenta...
                    </>
                  ) : (
                    "Hornea tu cuenta"
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-white text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-[#D1D500] hover:text-purple-800 transition duration-300">
              Inicia sesión aquí
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;