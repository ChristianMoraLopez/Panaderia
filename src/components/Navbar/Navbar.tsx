import React, { useState, useEffect } from 'react';
import Icon from '@/components/Icon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ShoppingCart, User, Coffee, Phone, Menu, X, Cake, LucideIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/authContentfulUser';

interface NavbarProps {
  cartCount: number;
}

interface NavLinkProps {
  href: string;
  text: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const { pathname } = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsScrolled(currentScrollPos > 10);

      if (window.innerWidth <= 768) {
        const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
        setVisible(isVisible);
        setPrevScrollPos(currentScrollPos);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    // Determinar si la página actual tiene fondo oscuro
    const darkBackgroundPages = ['/'];
    setIsDarkBackground(darkBackgroundPages.includes(pathname));
  }, [pathname]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const NavLink: React.FC<NavLinkProps> = ({ href, text, icon, onClick }) => (
    <Link href={href} passHref>
      <span
        className={`group flex flex-col items-center px-4 py-2 text-sm font-medium ${
          pathname === href ? 'text-brown-600' : 'text-brown-800 hover:text-brown-600'
        } transition-colors duration-300 cursor-pointer ${
          isDarkBackground ? 'text-white hover:text-cream-100' : ''
        }`}
        onClick={onClick}
      >
        <Icon
          icon={icon}
          className={`h-5 w-5 mb-1 group-hover:scale-110 transition-transform duration-300 ${
            pathname === href ? 'text-brown-600' : 
            isDarkBackground ? 'text-white' : 'text-brown-800'
          }`}
        />
        {text}
      </span>
    </Link>
  );

  const logoSrc = isDarkBackground
    ? "/images/reshot-icon-bread white.svg"
    : "/images/reshot-icon-bread.svg";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-opacity-95 backdrop-blur-md' : 'bg-opacity-0'
      } ${isDarkBackground ? 'bg-brown-800' : 'bg-cream-100'} ${visible ? 'top-0' : '-top-20'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" passHref>
            <span className="flex-shrink-0 flex items-center">
              <Image
                className="h-12 w-auto transition-opacity duration-300"
                src={logoSrc}
                alt="Logo"
                width={250}
                height={250}
              />
              <span className={`ml-2 text-2xl font-serif italic ${
                isDarkBackground ? 'text-white' : 'text-brown-800'
              } transition-colors duration-300`}>
                BEEV´S OVEN
              </span>
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <span className={`text-sm font-medium ${
                isDarkBackground ? 'text-white' : 'text-brown-800'
              } transition-colors duration-300`}>
                Hola, {user.displayName || user.email}
              </span>
            )}
            <NavLink href="/ProductGalleryPage" text="Delicias" icon={Cake} />
            <NavLink href="/CheckOut" text="Canasta" icon={ShoppingCart} />
            {user ? (
              <>
                <NavLink href="/ProfilePage" text="Mi Cuenta" icon={User} />
                <NavLink href="#" text="Cerrar Sesión" icon={LogOut} onClick={handleLogout} />
              </>
            ) : (
              <NavLink href="/LoginPage" text="Iniciar Sesión" icon={User} />
            )}
            <NavLink href="/about-us" text="Nuestra Historia" icon={Coffee} />
            <NavLink href="/contact" text="Contáctanos" icon={Phone} />
            <div className="relative">
              <Link href="/CheckOut">
                <span className="relative inline-block">
                  <ShoppingCart className={`h-6 w-6 ${
                    isDarkBackground ? 'text-white' : 'text-brown-800'
                  } transition-colors duration-300`} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </span>
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleNav}
              className={`inline-flex items-center justify-center p-2 rounded-full ${
                isDarkBackground 
                  ? 'border border-white text-white hover:text-cream-100 hover:border-cream-100'
                  : 'border border-brown-800 text-brown-800 hover:text-brown-600 hover:border-brown-600'
              } focus:outline-none transition-colors duration-300`}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Icon icon={isNavOpen ? X : Menu} className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isNavOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-cream-100 bg-opacity-95 backdrop-blur-md">
          {user && (
            <span className="block px-3 py-2 text-base font-medium text-brown-800">
              Hola, {user.displayName || user.email}
            </span>
          )}
          <NavLink href="/ProductGalleryPage" text="Delicias" icon={Cake} />
          <NavLink href="/CheckOut" text="Canasta" icon={ShoppingCart} />
          {user ? (
            <>
              <NavLink href="/ProfilePage" text="Mi Cuenta" icon={User} />
              <NavLink href="#" text="Cerrar Sesión" icon={LogOut} onClick={handleLogout} />
            </>
          ) : (
            <NavLink href="/LoginPage" text="Iniciar Sesión" icon={User} />
          )}
          <NavLink href="/about-us" text="Nuestra Historia" icon={Coffee} />
          <NavLink href="/contact" text="Contáctanos" icon={Phone} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;