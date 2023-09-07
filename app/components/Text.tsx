import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const textStyles = {
  h1: "text-opacity-90 text-5xl font-bold relative before:block before:absolute before:top-[-0.3em] before:left-0 before:w-[1.45ch] before:h-[0.35ch] mt-[0.5ch] before:bg-primary",
  p: "text-[16px]",
  label: "font-medium",
};

export type TextVariant = keyof typeof textStyles;

export function Text({
  children,
  variant,
  className,
  ...props
}: {
  children: ReactNode;
  variant: TextVariant;
} & JSX.IntrinsicElements["div"]) {
  return (
    <div className={twMerge(textStyles[variant], className)} {...props}>
      {children}
    </div>
  );
}
