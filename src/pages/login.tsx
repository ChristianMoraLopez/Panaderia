// LoginPage.tsx
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
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      <div className="flex items-center justify-center min-h-screen bg-purple-600 body-font">
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
      <div className="flex items-center justify-center min-h-screen bg-purple-600 body-font">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white"
        >
          Redirecting to profile...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-start min-h-screen bg-[#936DAD] p-4 relative overflow-hidden body-font">
      {/* Background Image */}
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#884681]  opacity-70"></div>

      {/* Logo Background */}
      <Image
        src="/images/SVG/LogoTransparent.svg"
        alt="Logo"
        width={1000}
        height={1000}
        className="absolute top-4 right-4 z-10 opacity-30 hidden lg:block"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10 ml-4 sm:ml-8 md:ml-16 lg:ml-24"
      >
        <div className="bg-[#ece9c9] bg-opacity-90 w-96 h-min rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-8 pt-8 pb-6 bg-[#c4bd5c] flex items-center"
          >
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={120}
              height={120}
              className="mr-4"
            />
            <div className="h-32 w-px bg-[#976185] -mt-4 -mb-4 m-0"></div>

            <div className="flex-1 flex flex-col justify-center items-center">
              <h2 className="text-3xl font-extrabold text-white title-font">
                Welcome
              </h2>
              <div className="flex space-x-2 justify-center mt-2">
                {[0, 0.3, 0.6].map((delay, index) => (
                  <motion.div
                    key={index}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, delay, repeat: Infinity }}
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-[#936DAD]"
                        : index === 1
                        ? "bg-[#B6D3D2]"
                        : "bg-[#F3BEB6]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
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
              {/* Email Input */}
              <div className="m-0 p-0">
                <div className="m-0 p-0">
                  <label
                    htmlFor="email"
                    className="text-[#926cad] text-3xl  body-font mt-0 mb-0"
                  >
                    Email:
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
                      className="pl-10 bg-[#ECEACA] border-[#926cad] border-2 h-12 placeholder-[#926cad] focus:border-purple-500 text-xl focus:ring-purple-500 super-rounded body-font"
                      placeholder="Example@email.com"
                    />
                  </div>
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-red-500 text-sm body-font"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Input */}
              <div className="m-0 p-0">
                <div className="m-0 p-0">
                  <label
                    htmlFor="password"
                    className="text-[#926cad] text-3xl body-font mt-0 mb-0"
                  >
                    Password:
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
                      className="pl-10 bg-[#ECEACA] border-[#926cad] h-12  border-2  placeholder-[#926cad] focus:border-purple-500 text-xl focus:ring-purple-500 super-rounded body-font"
                      placeholder="********"
                    />
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-red-500 text-sm body-font"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex  p-0 justify-end">
                <Link
                  href="/reset-password"
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors body-font"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-[#B6D3D2] -my-4 hover:bg-[#a6c3c2] w-36 text-white font-bold py-2 super-rounded transition duration-300 flex items-center justify-center body-font"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Footer Register Link */}
          <div className="px-4 py-4 bg-[#ece9c9] bg-opacity-0">
            <p className=" text-center text-purple-800 body-font">
              New to our sweet family?{" "}
              <Link
                href="/RegisterPage"
                className="font-semibold text-[#D1D500] hover:text-purple-800 transition duration-300 title-font"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className=" mt-8 text-center"
        >
          <p className="text-white text-sm body-font">
            © 2024 Beev&lsquo;s Oven. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
