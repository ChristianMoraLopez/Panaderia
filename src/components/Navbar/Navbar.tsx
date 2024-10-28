import React, { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Menu,
  X,
  LucideIcon,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/authContentfulUser";
import Basket from "../SVGIcons/Basket";

interface NavbarProps {
  cartCount: number;
  language: "es" | "en";
  toggleLanguage: () => void;
}

interface NavLinkProps {
  href: string;
  textES: string;
  textEN: string;
  icon: LucideIcon | string;
  onClick?: () => void;
}

const pageBackgrounds = {
  darkPages: ["/"],
  lightPages: ["/profile", "/login", "/CheckOut"],
  scrollTransitionPages: ["/ProductGalleryPage", "/AboutUs", "/ContactUsPage"]
};

const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  language,
  toggleLanguage,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { pathname } = useRouter();
  const { user } = useAuth();

  // Add animation trigger effect
  useEffect(() => {
    // Initial animation
    setIsAnimating(true);
    const initialTimer = setTimeout(() => setIsAnimating(false), 1000);

    // Set up periodic animation
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 20000); // Trigger every 20 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, []);

 

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

      if (pageBackgrounds.scrollTransitionPages.includes(pathname)) {
        setIsDarkBackground(currentScrollPos <= 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, pathname]);

  useEffect(() => {
    const setBackgroundByPage = () => {
      if (pageBackgrounds.darkPages.includes(pathname)) {
        setIsDarkBackground(true);
      } else if (pageBackgrounds.lightPages.includes(pathname)) {
        setIsDarkBackground(false);
      } else if (pageBackgrounds.scrollTransitionPages.includes(pathname)) {
        setIsDarkBackground(window.pageYOffset <= 100);
      } else {
        setIsDarkBackground(false);
      }
    };

    setBackgroundByPage();
  }, [pathname]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const NavLink: React.FC<NavLinkProps> = ({ href, textES, textEN, icon }) => {
    const isCustomIcon = typeof icon === 'string';
    const isActive = pathname === href;
    const isBuyLink = href === "/ProductGalleryPage";

    const getTextColor = () => {
      if (isBuyLink) {
        return isDarkBackground ? "text-white" : "text-black";
      }
      if (isActive) {
        return isDarkBackground ? "text-cream-100" : "text-brown-600";
      }
      return isDarkBackground ? "text-white" : "text-brown-800";
    };

    const hoverColor = isDarkBackground
      ? "group-hover:text-cream-100"
      : "group-hover:text-brown-600";

      return (
        <Link href={href} passHref>
          <span
            className={`group flex flex-col items-center justify-center px-2 py-2 text-sm md:text-base lg:text-lg font-semibold w-full md:w-28 lg:w-36 h-20 md:h-24
              transition-colors duration-300 cursor-pointer body-font`}
          >
          {isCustomIcon ? (
            <Image
              src={icon}
              alt={language === "es" ? textES : textEN}
              width={24}
              height={24}
              className="h-8 w-8 md:h-10 md:w-10 lg:h-8 lg:w-8 mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <Icon
              icon={icon as LucideIcon}
              className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300 text-brown-800"
            />
          )}
          <span 
            className={`text-center w-full truncate ${getTextColor()} ${isBuyLink ? '' : hoverColor} body-font`}
          >
            {language === "es" ? textES : textEN}
          </span>
        </span>
      </Link>
    );
  };

  const logoSrc = isDarkBackground
    ? "/images/reshot-icon-bread white.png"
    : "/images/SVG/LogoOnPurple.svg";

  // Add explicit dimensions for each logo variant
  const logoDimensions = {
    width: isDarkBackground ? 150 : 150, // Adjust these values as needed
    height: isDarkBackground ? 200 : 150,  // Adjust these values as needed
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out body-font
        ${isScrolled ? "bg-opacity-95 backdrop-blur-md" : "bg-opacity-0"}
        ${isDarkBackground ? "bg-brown-800" : "bg-cream-100"}
        ${visible ? "top-0" : "-top-36"}`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 xl:h-36">
          {/* Logo with animation and explicit dimensions */}
          <Link href="/" passHref>
            <span className="flex-shrink-0 flex items-center h-full">
              <Image
                className={`h-auto w-auto pt-16 transition-all duration-300
                  ${isAnimating ? 'animate-logo' : ''}
                `}
                src={logoSrc}
                alt="Beev's oven"
                width={logoDimensions.width}
                height={logoDimensions.height}
                style={{ 
                  objectFit: 'contain',
                  minWidth: `${logoDimensions.width}px`, // Add minimum width
                  minHeight: `${logoDimensions.height}px`, // Add minimum height
                }}
                priority // Add priority loading for logo
                sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, 150px"
              />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8">
            {user && (
                  <span
                  className={`title-font text-2xl font-bold px-8
                    ${isDarkBackground ? "text-white" : "text-brown-800"}
                    transition-colors duration-300`}
                >
                  {language === "es"
                    ? `Hola, ${user.displayName || user.email}`
                    : `Hello, ${user.displayName || user.email}`}
                </span>
            )}

<NavLink  
    href={user ? "/profile" : "/login"}
    textES={user ? "Perfil" : "Iniciar Sesión"}
    textEN={user ? "Profile" : "Login"}
    icon="/images/login.svg"
  />
            <NavLink
              href="/ProductGalleryPage"
              textES="Comprar"
              textEN="Buy"
              icon="/images/buy.svg"
            />
            <NavLink
              href="/AboutUs"
              textES="Sobre Nosotros"
              textEN="About Us"
              icon="/images/about-us.svg"
            />
            <NavLink
              href="/ContactUsPage"
              textES="Contáctanos"
              textEN="Contact Us"
              icon="/images/ContactUs.svg"
            />
           
            <div className="relative w-44 h-28 flex items-center justify-center">
              <Link href="/CheckOut">
                <span className="relative inline-block">
                  <Basket
                    className="h-16 w-16 mr-2 text-brown-800"
                  />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-3 py-2 text-base font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full body-font">
                      {cartCount}
                    </span>
                  )}
                </span>
              </Link>

              <button
                onClick={toggleLanguage}
                className={`flex items-center justify-center px-6 py-4 text-xl font-bold w-44 h-28 body-font
                    ${isDarkBackground ? "text-white hover:text-cream-100" : "text-brown-800 hover:text-brown-600"}
                    transition-colors duration-300`}
              >
                <Globe className="h-8 w-8 mr-3 text-brown-800" />
                {language === "es" ? "EN" : "ES"}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className={`flex items-center justify-center p-2 text-lg font-bold body-font
                  ${isDarkBackground ? "text-white hover:text-cream-100" : "text-brown-800 hover:text-brown-600"}
                  transition-colors duration-300`}
            >
              <Globe className="h-6 w-6 text-brown-800" />
            </button>
            <button
              onClick={toggleNav}
              className={`inline-flex items-center justify-center p-2 rounded-full
                  ${isDarkBackground ? "text-white hover:text-cream-100" : "text-brown-800 hover:text-brown-600"}
                  focus:outline-none transition-colors duration-300`}
            >
              <span className="sr-only">
                {language === "es" ? "Abrir menú principal" : "Open main menu"}
              </span>
              <Icon
                icon={isNavOpen ? X : Menu}
                className="h-6 w-6 text-brown-800"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden transition-all duration-300 ease-in-out body-font
            ${isNavOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
            overflow-hidden ${isDarkBackground ? "bg-brown-800" : "bg-cream-100"} bg-opacity-95 backdrop-blur-md`}
      >
        <div className="px-4 pt-2 pb-3 space-y-4 sm:px-3 flex flex-col items-center">
          {user && (
            <span className={`title-font text-2xl font-bold px-8 ${isDarkBackground ? "text-white" : "text-brown-800"}`}>
              {language === "es"
                ? `Hola, ${user.displayName || user.email}`
                : `Hello, ${user.displayName || user.email}`}
            </span>
          )}

<NavLink
    href={user ? "/profile" : "/login"}
    textES={user ? "Perfil" : "Iniciar Sesión"}
    textEN={user ? "Profile" : "Login"}
    icon="/images/login.svg"
  />
          <NavLink
            href="/ProductGalleryPage"
            textES="Comprar"
            textEN="Buy"
            icon="/images/buy.svg"
          />
          <NavLink
            href="/AboutUs"
            textES="Sobre Nosotros"
            textEN="About Us"
            icon="/images/about-us.svg"
          />
          <NavLink
            href="/ContactUsPage"
            textES="Contáctanos"
            textEN="Contact Us"
            icon="/images/ContactUs.svg"
          />
          <Link href="/CheckOut" passHref>
            <span className={`group flex flex-col items-center justify-center px-2 py-2 text-sm md:text-base lg:text-lg font-semibold w-full h-20 md:h-24 transition-colors duration-300`}>
              <Basket className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300 text-brown-800" />
              <span className={`text-center w-full truncate ${isDarkBackground ? "text-white hover:text-cream-100" : "text-brown-800 hover:text-brown-600"}`}>
                {language === "es" ? "Carrito" : "Cart"}
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;