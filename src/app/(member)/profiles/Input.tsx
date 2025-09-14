type InputProps = {
  id: string;
  label: string;
  value: string;
  name: string;
  type?: string;
  inputMode?: "decimal";
  placeholder: string;
  disabled: boolean;
  required: boolean;
  onChange: (value: string) => void;
  list?: string;
  datalistOptions?: string[];
  className?: string;
};

export default function Input({
  id,
  label,
  value,
  name,
  type = "text",
  inputMode,
  placeholder,
  disabled = false,
  required = false,
  onChange,
  list,
  datalistOptions,
  className,
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="space-y-4 w-full max-w-[400px]">
        {label}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        list={list}
        onChange={(e) => onChange(e.target.value)}
        className={
          className ??
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        }
      />
      {list && datalistOptions && (
        <datalist id={list}>
          {datalistOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
    </div>
  );
}
