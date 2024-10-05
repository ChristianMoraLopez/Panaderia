import styles from './Testimonials.module.css';
import Image from 'next/image';




const testimonials = [
    {
      name: 'Ana García',
      photo: '/images/testimonial1.jpg',
      comment: '¡Increíble experiencia, el maquillaje fue perfecto para mi evento!'
    },
    // Más testimonios
  ];
  
  const TestimonialsPage = () => {
    return (
      <section>
        <h2>Testimonios</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, index) => (
            <div key={index} className={styles.testimonialCard}>
              <Image src={t.photo} alt={`Testimonio de ${t.name}`} />
              <h3>{t.name}</h3>
              <p>{t.comment}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default TestimonialsPage;
  