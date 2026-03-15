import { cn } from "@/_utils/utils";
import { Label } from "./Label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const Input = ({
  label,
  error,
  description,
  required,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="space-y-1 background-color">
      {label && <Label required={required}>{label}</Label>}

      <input
        required={required}
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm shadow-sm",
          error ? "border-red-500" : "border-gray-300",
          "focus:ring-blue-500 focus:border-blue-500",
          className,
        )}
        {...props}
      />

      {description && <p className="text-xs text-gray-500">{description}</p>}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
