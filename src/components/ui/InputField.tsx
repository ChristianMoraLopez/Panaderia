import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
  verified?: boolean;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  type = 'text', 
  icon,
  error,
  verified,
  disabled = false
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        {icon && icon}
        <div className="relative flex-1">
          <label htmlFor={name} className="sr-only">{label}</label>
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            placeholder={label}
            className={`w-full bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-full 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              ${error ? 'border-2 border-red-500' : ''} 
              ${verified ? 'border-2 border-green-500' : ''}`}
          />
        </div>
        {verified && <CheckCircle className="w-5 h-5 text-green-500" />}
        {error && <AlertCircle className="w-5 h-5 text-red-500" />}
      </div>
      {error && (
        <p className="text-red-500 text-sm ml-8">{error}</p>
      )}
    </div>
  );
};

export default InputField;