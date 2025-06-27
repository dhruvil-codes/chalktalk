import React from 'react';

interface FormTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  showCharacterCount?: boolean;
}

export default function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  minLength,
  maxLength,
  rows = 4,
  showCharacterCount = false
}: FormTextareaProps) {
  const characterCount = value.length;
  const isMinLengthMet = !minLength || characterCount >= minLength;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical ${
          error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
      />
      {showCharacterCount && (
        <div className="flex justify-between items-center text-sm">
          <span className={`${isMinLengthMet ? 'text-green-600' : 'text-gray-500'}`}>
            {minLength && (
              <>
                {isMinLengthMet ? '✓' : ''} Minimum {minLength} characters
              </>
            )}
          </span>
          <span className="text-gray-500">
            {characterCount}{maxLength && `/${maxLength}`} characters
          </span>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}