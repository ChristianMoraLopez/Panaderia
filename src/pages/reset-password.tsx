import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/authContentfulUser';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, error, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      // El error ya está manejado en el hook useAuth
      console.error('Error al enviar el correo de restablecimiento:', error);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-start min-h-screen bg-[#936DAD] p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-600 opacity-70"></div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md z-10 ml-4 sm:ml-8 md:ml-16 lg:ml-24"
        >
          <div className="bg-[#ECEACA] bg-opacity-90 rounded-3xl shadow-2xl p-8 text-center">
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-[#936DAD] mb-4">
              ¡Correo Enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de restablecimiento de contraseña a tu correo electrónico. 
              Por favor revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#B6D3D2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a6c3c2] transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-start min-h-screen bg-[#936DAD] p-4 relative overflow-hidden">
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
        <div className="bg-[#ECEACA] bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-8 pt-8 pb-6 bg-[#D1D550] flex items-center"
          >
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mr-4"
            />
            <div className="h-12 w-px bg-white mx-4"></div>
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-white">Restablecer Contraseña</h2>
              <p className="text-white text-sm mt-2">
                Ingresa tu correo electrónico para recibir las instrucciones
              </p>
            </div>
          </motion.div>

          <div className="px-8 py-6">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-purple-800 font-semibold">
                  Correo Electrónico
                </label>
                <div className="mt-1 relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                    size={18}
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-full"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full bg-[#B6D3D2] hover:bg-[#a6c3c2] text-white font-bold py-3 rounded-full transition duration-300 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Instrucciones"
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          <div className="px-8 py-6 bg-gradient-to-t from-purple-100 to-white">
            <p className="text-center text-purple-800">
              <Link
                href="/login"
                className="font-semibold text-[#D1D500] hover:text-purple-800 transition duration-300"
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-white text-sm">
            © 2024 La Dulce Panadería. Todos los derechos reservados.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PasswordResetPage;