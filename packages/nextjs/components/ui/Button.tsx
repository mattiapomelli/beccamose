import { ButtonHTMLAttributes, ReactNode, Ref, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  [
    "btn min-h-0 animate-none",
    "disabled:pointer-events-auto disabled:cursor-not-allowed disabled:active:transform-none",
    "focus:outline-none focus-visible:ring-4",
  ],
  {
    variants: {
      color: {
        primary: "btn-primary focus:ring-primary/30",
        secondary: "btn-secondary focus:ring-secondary/30",
        accent: "btn-accent focus:ring-accent/30",
        info: "btn-info focus:ring-info/30",
        success: "btn-success focus:ring-success/30",
        warning: "btn-warning focus:ring-warning/30",
        error: "btn-error focus:ring-error/30",
        neutral: "btn-neutral focus:ring-neutral/30",
      },
      size: {
        xs: "btn-xs h-8 min-w-[5.7rem] px-3.5",
        sm: "btn-sm h-9 min-w-[6.4125rem] px-4",
        md: "h-10 min-w-[7.125rem] px-5",
        lg: "btn-lg h-11 min-w-[7.8375rem] px-6",
      },
      variant: {
        solid: "",
        outline: "btn-outline",
        ghost: "btn-ghost disabled:bg-transparent disabled:text-opacity-30",
        link: "btn-link disabled:bg-transparent disabled:text-opacity-30",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "md",
      variant: "solid",
    },
  },
);

const textColorVariants = cva("", {
  variants: {
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
      neutral: "text-neutral",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export const Button = forwardRef(
  (
    { children, color, size, variant, block, disabled, loading, leftIcon, rightIcon, className, ...props }: ButtonProps,
    ref?: Ref<HTMLButtonElement>,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        disabled={disabled}
        className={twMerge(
          clsx(
            buttonVariants({ color, variant, size }),
            (variant === "ghost" || variant === "link") && textColorVariants({ color }),
            { "w-full": block },
            { "cursor-not-allowed pointer-events-auto": loading },
            { "gap-2": leftIcon || rightIcon },
            className,
          ),
        )}
      >
        {leftIcon}
        {loading && <span className="loading loading-spinner loading-sm"></span>}
        {!loading && children}
        {rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
