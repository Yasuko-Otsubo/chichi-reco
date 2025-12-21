import { cn } from "@/utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

export const Button = ({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button 
    className={cn(
      baseStyles,
      variants[variant],
      fullWidth && "w-full",
      className
    )}
    {...props}
    >
      {children}
    </button>
  );
};