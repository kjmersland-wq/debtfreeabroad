import { baselines, type CountryCode } from "@/data/costBaselines";

export function CountrySelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: CountryCode;
  options: CountryCode[];
  onChange: (value: CountryCode) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value as CountryCode)}
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {baselines[c].name}
          </option>
        ))}
      </select>
    </div>
  );
}
