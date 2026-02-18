type SelectTableProps = {
  label: string;
  selectOptions: any[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  disabled?: boolean;
};

export const SelectTable = ({
  label,
  selectOptions,
  onChange,
  value,
  disabled,
}: SelectTableProps) => {
  return (
    <div className="flex flex-col text-slate-600">
      <label htmlFor="filtro" className="text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>
      <select
        name=""
        id="filtro"
        className="w-[200px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-slate-400 transition-colors"
        onChange={onChange}
        value={value}
        disabled={disabled}
      >
        <option value="" className="text-gray-300">
          Select...
        </option>
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.texto}
          </option>
        ))}
      </select>
    </div>
  );
};
