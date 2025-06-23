import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";

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
    <div className="flex flex-col mb-5">
      <p>
        {label}
        {obligatorio && <span>*</span>}
      </p>
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 bg-white w-[200px]">
        <Flatpickr
          disabled={disabled}
          placeholder="Ingresar"
          value={value}
          onChange={onChange}
          options={{
            dateFormat: dateFormat,
            locale: { ...Spanish, ...customSpanishLocale },
            disableMobile: true,
          }}
        />
        <img
          src="/icons/calendar.svg"
          alt="calendario"
          height={30}
          width={30}
        />
      </div>
    </div>
  );
};
