import { Control, Controller } from "react-hook-form";

type InputControllerProps = {
  control: Control<any>;
  name: string;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  type?: string;
};

export const InputController = ({
  control,
  name,
  placeholder,
  error,
  className,
  disabled,
  type = "text",
}: InputControllerProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`mb-4 ${className} ${disabled ? "opacity-50" : ""}`}>
          <input
            type={type}
            {...field}
            value={field.value || ""}
            onChange={field.onChange}
            placeholder={placeholder}
            className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus-visible:border-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-200 transition-colors"
            disabled={disabled}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      )}
    />
  );
};
