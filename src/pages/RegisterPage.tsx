import React, { useState } from 'react';
import { useAuth } from '@hooks/authContentfulUser';
import { useRouter } from 'next/router';
import { Cake, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import  Button  from '@/components/ui/button';
import  Input  from '@/components/ui/Input';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    LastName: '',
    email: '',
    password: ''
  });
  const { registerUser, error } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      router.push('/ProfilePage');
    } catch (err) {
      // El error ya se maneja en el hook
    }
  };

  const inputFields = [
    { name: 'name', label: 'Nombre', icon: User },
    { name: 'lastName', label: 'Apellido', icon: User },
    { name: 'email', label: 'Correo Electrónico', icon: Mail },
    { name: 'password', label: 'Contraseña', icon: Lock },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <Cake className="mx-auto h-20 w-20 text-amber-700" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-800">
            Únete a nuestra dulce familia
          </h2>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {inputFields.map((field) => (
                <div key={field.name}>
                <label 
  htmlFor={field.name} 
  className="block text-base font-semibold text-amber-900"
>
  {field.label}
</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon className="h-5 w-5 text-amber-800" aria-hidden="true" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.name === 'password' ? 'password' : 'text'}
                      required
                      className="block w-full pl-10 bg-amber-50 border-amber-300 focus:ring-amber-500 focus:border-amber-500 rounded-md"
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}
              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-300 transform hover:scale-105"
                >
                  Hornea tu cuenta
                </Button>
              </div>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-amber-800">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/LoginPage" className="font-medium text-amber-600 hover:text-amber-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;