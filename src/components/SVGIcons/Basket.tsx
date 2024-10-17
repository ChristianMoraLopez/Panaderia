import React from 'react';



interface SVGIconProps {
  size?: string;
  color?: string;
  className?: string;
}



const Basket: React.FC<SVGIconProps> = ({ size = '34px', color = '#926cad',  className}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 110 110"
    width={size}
    height={size}
    className={className}
  >
    <circle fill={color} cx="55" cy="55" r="55" />
    <path
      fill="#fff"
      d="M27.92 35H82.24L88 76.64S88 86.11 79.52 88H31.36S23.68 86.11 23 79.79 27.92 35 27.92 35Z"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeMiterlimit="10"
      strokeWidth="4"
      d="M69.62 47V33.38a36.45 36.45 0 000-5.53 9.16 9.16 0 00-1.3-2.76 9.71 9.71 0 00-3.21-3.23 15.85 15.85 0 00-12.75-2.42 19.93 19.93 0 00-3.88 1.4 27 27 0 00-3.36 1.79c-3.32 2.18-4.39 6.21-4.39 9.68 0 2.61 0 5.23 0 7.84 0 2.27 0 4.54 0 6.82"
    />
  </svg>
);

export default Basket;