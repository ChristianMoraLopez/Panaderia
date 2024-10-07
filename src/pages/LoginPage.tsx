import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CakeIcon, Lock, MailIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/authContentfulUser';
import { Alert, AlertDescription } from '@/components/ui/alert';
import  Button  from '@/components/ui/button';
import  Input  from '@/components/ui/Input';
import  Label  from '@/components/ui/Label';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const router = useRouter();
  const { user, loading, error, login } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push('/ProfilePage');
    }
  }, [user, loading, router]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Correo electrónico inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await login(email, password);
      } catch (err) {
        setErrors({ ...errors, password: 'Credenciales incorrectas. Inténtalo de nuevo.' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <p className="text-lg font-semibold text-amber-800">Redirigiendo al perfil...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-amber-300 to-amber-200">
            <CakeIcon className="w-20 h-20 mx-auto text-amber-700" />
            <h2 className="mt-4 text-3xl font-extrabold text-center text-amber-800">Dulce Bienvenida</h2>
          </div>
          
          <div className="px-8 py-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-amber-800 font-semibold">Correo Electrónico</label>
                <div className="mt-1 relative">
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-amber-50 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="text-amber-800 font-semibold">Contraseña</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" size={18} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-amber-50 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                    placeholder="********"
                  />
                </div>
                {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-full transition duration-300 transform hover:scale-105">
                Iniciar Sesión
              </Button>
            </form>
          </div>
          
          <div className="px-8 py-6 bg-gradient-to-t from-amber-100 to-white">
            <p className="text-center text-amber-800">
              ¿Nuevo en nuestra dulce familia?{' '}
              <Link href="/RegisterPage" className="font-semibold text-amber-600 hover:text-amber-800 transition duration-300">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-amber-800 text-sm">
            © 2024 La Dulce Panadería. Todos los derechos reservados.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;