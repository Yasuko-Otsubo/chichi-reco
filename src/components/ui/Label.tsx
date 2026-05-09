import { cn } from "@/_utils/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = ({
  children,
  required,
  className,
  ...props
}: LabelProps) => {
  return (
    <label
      className={cn("block text-sm font-medium text-gray-900", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-ret-500 ">*</span>}
    </label>
  );
};
