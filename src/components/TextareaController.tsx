import { Control, Controller } from "react-hook-form";

type TextareaControllerProps = {
  control: Control<any>;
  name: string;
  placeholder: string;
  error?: string;
  rows?: number;
};

export const TextareaController = ({
  control,
  name,
  placeholder,
  error,
  rows,
}: TextareaControllerProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="mb-4">
          <textarea
            {...field}
            placeholder={placeholder}
            className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus-visible:border-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-200 transition-colors"
            cols={40}
            rows={rows || 3}
            maxLength={2000}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      )}
    />
  );
};
