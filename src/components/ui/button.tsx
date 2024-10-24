import React, { useState } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
      font: {
        title: "font-['Bohemian_Soul'] serif title-font",
        body: "font-['Edgecutting'] sans-serif body-font",
        sharp: "font-['Edgecutting_Sharp'] sans-serif sharp-font",
        tight: "font-['Edgecutting_Tight'] sans-serif tight-font"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      font: 'body'
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltipContent?: string;
  font?: "title" | "body" | "sharp" | "tight";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, font, asChild = false, tooltipContent, ...props }, ref) => {
    const Comp = asChild ? 'button' : 'button';
    const [visible, setVisible] = useState(false);

    // Define tooltip font based on button font or default to body
    const tooltipFont = font || 'body';
    const tooltipFontClass = `font-['${
      tooltipFont === 'title' ? 'Bohemian_Soul' :
      tooltipFont === 'sharp' ? 'Edgecutting_Sharp' :
      tooltipFont === 'tight' ? 'Edgecutting_Tight' :
      'Edgecutting'
    }'] ${tooltipFont}-font`;

    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, font, className }))}
          ref={ref}
          {...props}
        />
        {visible && tooltipContent && (
          <div className={cn(
            "absolute z-10 w-32 p-2 text-sm text-white bg-black rounded-md -translate-x-1/2 bottom-full left-1/2 mb-2",
            tooltipFontClass
          )}>
            {tooltipContent}
          </div>
        )}
      </div>
    );
  }
);

Button.displayName = 'Button';

export default Button;