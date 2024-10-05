import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext'; // Ajusta la ruta según la ubicación de tu ThemeContext

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;