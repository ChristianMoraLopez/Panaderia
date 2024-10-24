import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "@/lib/utils";

// Input Component
const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-700",
        error: "border-red-500 dark:border-red-400",
      },
      font: {
        title: "font-['Bohemian_Soul'] serif title-font",
        body: "font-['Edgecutting'] sans-serif body-font",
        sharp: "font-['Edgecutting_Sharp'] sans-serif sharp-font",
        tight: "font-['Edgecutting_Tight'] sans-serif tight-font"
      }
    },
    defaultVariants: {
      variant: "default",
      font: "body"
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  font?: "title" | "body" | "sharp" | "tight";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, font, leftIcon, ...props }, ref) => {
    const placeholderFontClass = font === "title" ? "placeholder:title-font" :
                                font === "sharp" ? "placeholder:sharp-font" :
                                font === "tight" ? "placeholder:tight-font" :
                                "placeholder:body-font";

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant, font }),
            leftIcon ? "pl-10" : "",
            placeholderFontClass,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;