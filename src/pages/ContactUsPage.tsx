import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Instagram, Facebook, Mail, Phone, Loader } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import  Input  from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import  Button  from '@/components/ui/button';
import toast from 'react-hot-toast';

const ContactUsPage: React.FC = () => {
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key: string): string => ({
    contactUs: language === 'es' ? 'Contáctanos' : 'Contact Us',
    followUs: language === 'es' ? 'Síguenos en' : 'Follow us on',
    callUs: language === 'es' ? 'Llámanos' : 'Call us',
    emailUs: language === 'es' ? 'Envíanos un correo' : 'Email us',
    messageUs: language === 'es' ? 'Envíanos un mensaje' : 'Message us',
    name: language === 'es' ? 'Nombre' : 'Name',
    email: language === 'es' ? 'Correo electrónico' : 'Email',
    subject: language === 'es' ? 'Asunto' : 'Subject',
    message: language === 'es' ? 'Mensaje' : 'Message',
    send: language === 'es' ? 'Enviar mensaje' : 'Send message',
    sending: language === 'es' ? 'Enviando...' : 'Sending...',
    writeUs: language === 'es' ? 'Escríbenos' : 'Write to us',
  })[key] || key;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          language === 'es' 
            ? '¡Mensaje enviado correctamente!' 
            : 'Message sent successfully!'
        );
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      toast.error(
        language === 'es'
          ? 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
          : 'Error sending message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar cartCount={0} language={language} toggleLanguage={toggleLanguage} />

      <div className="min-h-screen pt-36 bg-[#F2BFBB]">
        <main className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Información de contacto */}
              <div className="bg-[#936DAD] p-8 md:p-12 text-white">
                <div className="mb-8 relative w-[150px] h-[150px]">
                  <Image
                    src="/images/SVG/LogoOnPurple.svg"
                    alt="Beevsoven Logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <h2 className="text-4xl font-bold mb-8">{t('contactUs')}</h2>
                <div className="space-y-6">
                  <a href="tel:+17862800961" className="flex items-center text-xl hover:text-[#D1D550] transition duration-300">
                    <Phone className="w-6 h-6 mr-4" />
                    +1 (786) 280-0961
                  </a>
                  <a href="mailto:info@beevsoven.com" className="flex items-center text-xl hover:text-[#D1D550] transition duration-300">
                    <Mail className="w-6 h-6 mr-4" />
                    info@beevsoven.com
                  </a>
                  <a href="https://wa.me/17862800961" target="_blank" rel="noopener noreferrer" className="flex items-center text-xl hover:text-[#D1D550] transition duration-300">
                    <MessageCircle className="w-6 h-6 mr-4" />
                    {t('messageUs')}
                  </a>
                </div>

                {/* Redes sociales dentro del panel morado */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">{t('followUs')}</h3>
                  <div className="space-y-4">
                    <a href="https://www.instagram.com/beevsoven/profilecard/?igsh=MXhtN2djMnJtaHp2bA==" target="_blank" rel="noopener noreferrer" className="flex items-center text-xl hover:text-[#D1D550] transition duration-300">
                      <Instagram className="w-6 h-6 mr-4" />
                      Instagram
                    </a>
                    <a href="https://www.tiktok.com/@beevsoven?_t=8qekMoITjKc&_r=1" target="_blank" rel="noopener noreferrer" className="flex items-center text-xl hover:text-[#D1D550] transition duration-300">
                      <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                      TikTok
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61566809876928" target="_blank" rel="noopener noreferrer" className="flex items-center text-xl hover:text-[#D1D550] transition duration-300">
                      <Facebook className="w-6 h-6 mr-4" />
                      Facebook
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="p-8 md:p-12 bg-white">
                <h3 className="text-3xl font-bold text-[#936DAD] mb-8">{t('writeUs')}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('name')}
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-full bg-gray-50 border-gray-200 focus:border-[#936DAD] focus:ring-[#936DAD]"
                        placeholder={t('name')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('email')}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-full bg-gray-50 border-gray-200 focus:border-[#936DAD] focus:ring-[#936DAD]"
                        placeholder={t('email')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('subject')}
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-full bg-gray-50 border-gray-200 focus:border-[#936DAD] focus:ring-[#936DAD]"
                        placeholder={t('subject')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('message')}
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-3xl min-h-[150px] bg-gray-50 border-gray-200 focus:border-[#936DAD] focus:ring-[#936DAD]"
                        placeholder={t('message')}
                      />
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#D1D550] hover:bg-[#bfc048] text-white rounded-full py-3 px-6 font-semibold transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          {t('sending')}
                        </>
                      ) : (
                        t('send')
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer language={language} />
      </div>

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/17862800961?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20acerca%20de%20sus%20productos"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </>
  );
};

export default ContactUsPage;