import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "@/lib/utils";

// Label Component
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-gray-900 dark:text-gray-100",
        error: "text-red-500 dark:text-red-400",
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

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  font?: "title" | "body" | "sharp" | "tight";
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, font, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant, font }), className)}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export default Label;