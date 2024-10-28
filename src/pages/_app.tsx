import '@/styles/globals.css';
import { AppProps } from 'next/app';
import CartProvider from '@/store/Cart';
import '@/styles/fonts.css'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;