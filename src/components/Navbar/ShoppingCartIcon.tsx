import React from 'react';
import Basket from '@components/SVGIcons/Basket';

type ShoppingCartIconProps = {
  cartCount: number;
  name: string;
};

const ShoppingCartIcon = ({ cartCount, name }: ShoppingCartIconProps) => {
  const showCartCount = () => {
    if (!cartCount) {
      return `(0)`;
    }
    if (cartCount > 9) {
      return (
        <span>
          9<sup>+</sup>
        </span>
      );
    }
    return `(${cartCount})`;
  };

  return (
    <div className="p-0 container">
      <Basket />
      <div className="text">
        <span className="hidden sm:inline">{` ${name} `}</span>
        {showCartCount()}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
        }
        .text {
          margin-left: 0.5rem;
        }
        .text span {
          font-size: smaller;
        }
          
        .p-0 {
          padding: 0;
        }

        item {
        padding: 0;
        margin: 0;
        }
      `}</style>
    </div>
  );
};

export default ShoppingCartIcon;
