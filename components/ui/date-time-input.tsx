import React from "react";
import { Input } from "./input";

interface DateTimeInputProps {
  epochValue: number;
  onChange: (value: number) => void;
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

export function DateTimeInput({
  epochValue,
  onChange,
  id,
  className,
  placeholder,
  disabled,
  required,
  label,
}: DateTimeInputProps) {
  // Convert epoch timestamp (seconds) to local datetime string
  const dateValue = epochValue ? new Date(epochValue * 1000) : new Date();

  // Format for datetime-local input (YYYY-MM-DDThh:mm)
  const formattedValue = new Date(
    dateValue.getTime() - dateValue.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the local datetime string from input
    const localDate = new Date(e.target.value);
    // Convert to UTC
    const utcTimestamp = Math.floor(localDate.getTime() / 1000);
    onChange(utcTimestamp);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          {label}
        </label>
      )}
      <Input
        id={id}
        type="datetime-local"
        value={formattedValue}
        onChange={handleChange}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
