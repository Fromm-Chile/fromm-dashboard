import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { Calendar } from "lucide-react";

type InputFechaProps = {
  label: string;
  obligatorio?: boolean;
  disabled?: boolean;
  value?: string | Date;
  onChange: (date: Date[]) => void;
};

export const InputFecha = ({
  label,
  obligatorio,
  disabled,
  onChange,
  value,
}: InputFechaProps) => {
  const customSpanishLocale: any = {
    weekdays: {
      shorthand: ["D", "L", "M", "M", "J", "V", "S"],
      longhand: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
    },
  };

  const dateFormat = "d/m/Y";

  return (
    <div className="flex flex-col mb-4">
      <p className="text-xs font-medium text-slate-500 mb-1">
        {label}
        {obligatorio && <span className="text-red-400">*</span>}
      </p>
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 bg-white w-[180px]">
        <Flatpickr
          disabled={disabled}
          placeholder="Select..."
          value={value}
          onChange={onChange}
          options={{
            dateFormat: dateFormat,
            locale: { ...Spanish, ...customSpanishLocale },
            disableMobile: true,
          }}
        />
        <Calendar size={16} className="text-slate-400" strokeWidth={1.75} />
      </div>
    </div>
  );
};
