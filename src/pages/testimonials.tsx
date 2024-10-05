import React from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar/Navbar';
import { ThemeProvider } from '@/context/ThemeContext';

// Tipo para los testimonios
type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
};

// Lista de testimonios de ejemplo
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María González",
    role: "Diseñadora Gráfica",
    content: "El servicio que recibí superó todas mis expectativas. El equipo fue increíblemente profesional y atento a mis necesidades.",
    rating: 5,
  },
  {
    id: 2,
    name: "Juan Pérez",
    role: "Empresario",
    content: "Estoy muy impresionado con la calidad del trabajo. Definitivamente volveré a usar sus servicios en el futuro.",
    rating: 4,
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    role: "Desarrolladora Web",
    content: "La atención al detalle y la rapidez en la entrega fueron excepcionales. Recomiendo ampliamente sus servicios.",
    rating: 5,
  },
];

const TestimonialsPage: React.FC = () => {
  const { theme } = useTheme();

  const cardStyle = `bg-opacity-80 rounded-lg p-6 shadow-lg ${
    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
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
          Testimonios de Clientes
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cardStyle}
            >
              <div className="flex items-center mb-4">
                <User className="w-12 h-12 rounded-full bg-gold p-2 text-white mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-gold' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill={i < testimonial.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const TestimonialsPageWithTheme: React.FC = () => (
  <ThemeProvider>
    <TestimonialsPage />
  </ThemeProvider>
);

export default TestimonialsPageWithTheme;