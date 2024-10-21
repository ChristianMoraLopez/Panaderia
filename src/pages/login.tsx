import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Lock, MailIcon, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "@/hooks/authContentfulUser";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Button from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";

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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { user, loading, error, login } = useAuth();
  const { products } = useProducts();
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user && !loading) {
      router.push("/ProfilePage");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (products && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setRandomProduct(products[randomIndex]);
    }
  }, [products]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Correo electrónico inválido";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoggingIn(true);
      try {
        await login(email, password);
      } catch (err) {
        setErrors({
          ...errors,
          password: "Credenciales incorrectas. Inténtalo de nuevo.",
        });
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-600">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-32 w-32 border-t-4 border-b-4 border-white"
        ></motion.div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-600">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white"
        >
          Redirigiendo al perfil...
        </motion.p>
      </div>
    );
  }

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
            <div className="flex-1 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-extrabold text-white">Welcome</h2>
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
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-purple-800 font-semibold">
                  Correo Electrónico
                </label>
                <div className="mt-1 relative">
                  <MailIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-full"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-red-500 text-sm"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="text-purple-800 font-semibold">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                    size={18}
                  />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-purple-50 border-purple-300 focus:border-purple-500 focus:ring-purple-500 rounded-full"
                    placeholder="********"
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-red-500 text-sm"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full bg-[#B6D3D2] hover:bg-[#a6c3c2] text-white font-bold py-3 rounded-full transition duration-300 flex items-center justify-center"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          <div className="px-8 py-6 bg-gradient-to-t from-purple-100 to-white">
            <p className="text-center text-purple-800">
              ¿Nuevo en nuestra dulce familia?{" "}
              <Link
                href="/RegisterPage"
                className="font-semibold text-[#D1D500] hover:text-purple-800 transition duration-300"
              >
                Regístrate aquí
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

export default LoginPage;