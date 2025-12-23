import { cn } from "@/utils/utils";
import { Label } from "./Label";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const Textarea  = ({
  label,
  error,
  description,
  required,
  className,
  ...props
}: TextareaProps) => {
  return (
    <div className="space-y-1">
      {label && <Label required={required}>{label}</Label>}

      <textarea
        required={required}
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm shadow-sm",
          error ? "border-red-500" : "border-gray-300",
          "focus:ring-blue-500 focus:border-blue-500",
          className
        )}
        {...props}
      />

      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
