import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Phone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar/Navbar';
import { ThemeProvider } from '@/context/ThemeContext';
import emailjs from 'emailjs-com';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { theme } = useTheme();

  useEffect(() => {
    emailjs.init("Jnf8lO1PjTKXLRo_g"); // Reemplaza con tu User ID de EmailJS
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await emailjs.send(
        "service_bxily4j", // Reemplaza con tu Service ID de EmailJS
        "template_kp91w9", // Reemplaza con tu Template ID de EmailJS
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: "ngomezz2003@outlook.com"
        }
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = `w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 ${
    theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
  }`;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Navbar />
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-12 text-center"
        >
          Contáctanos
        </motion.h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex-1 space-y-6"
          >
            <div className="relative">
              <User className={`absolute top-3 left-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`${inputStyle} pl-10`}
                required
              />
            </div>
            <div className="relative">
              <Mail className={`absolute top-3 left-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`${inputStyle} pl-10`}
                required
              />
            </div>
            <div className="relative">
              <MessageSquare className={`absolute top-3 left-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <textarea
                placeholder="Mensaje"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`${inputStyle} pl-10 h-32 resize-none`}
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 ${
                isSubmitting ? 'bg-gray-500' : 'bg-gold hover:bg-yellow-600'
              } text-white rounded-md transition-colors duration-300 flex items-center justify-center`}
            >
              <Send size={20} className="mr-2" />
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </motion.button>
            {submitStatus === 'success' && (
              <p className="text-green-500 text-center">Mensaje enviado con éxito!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-500 text-center">Error al enviar el mensaje. Por favor, intente nuevamente.</p>
            )}
          </motion.form>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Información de Contacto</h3>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gold" />
              <a
                href="https://wa.me/573023474626?text=Hola%20me%20gustaría%20preguntar%20por%20tus%20servicios%20de%20maquillaje"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors duration-300"
              >
                WhatsApp: +57 302 347 4626
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-gold" />
              <a
                href="nailto:mgomezz2003@outlook.com"
                className="hover:text-gold transition-colors duration-300"
              >
                ngomezz2003@outlook.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const ContactPageWithTheme: React.FC = () => (
  <ThemeProvider>
    <ContactPage />
  </ThemeProvider>
);

export default ContactPageWithTheme;