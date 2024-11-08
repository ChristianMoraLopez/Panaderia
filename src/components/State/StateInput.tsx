import React, { useState, useEffect, useRef } from 'react';
import { findStateMatches, StateCode } from '@components/shipping/stateUtils';
import { MapPin } from 'lucide-react';

interface StateInputProps {
  value: string;
  onChange: (value: string) => void;
  onStateSelect: (stateCode: StateCode) => void;  // Cambiado a StateCode
  error?: string;
  verified?: boolean;
  disabled?: boolean;
}

interface StateSuggestion {
  name: string;
  code: StateCode;  // Cambiado a StateCode
}

const StateInput: React.FC<StateInputProps> = ({
  value,
  onChange,
  onStateSelect,
  error,
  verified,
  disabled = false
}) => {
  const [suggestions, setSuggestions] = useState<StateSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    const matches = findStateMatches(newValue);
    setSuggestions(matches);
    setIsOpen(matches.length > 0);
  };

  const handleSuggestionClick = (suggestion: StateSuggestion) => {
    setInputValue(suggestion.code);
    onChange(suggestion.code);
    onStateSelect(suggestion.code);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
            disabled={disabled}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
            ${error ? 'border-red-500 focus:ring-red-200' : 
              verified ? 'border-green-500 focus:ring-green-200' : 
              'border-gray-300 focus:ring-purple-200'}`}
          placeholder="Enter state name or code"
        />
        {verified && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )}
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.code}
              className={`px-4 py-2 cursor-pointer hover:bg-purple-50
                ${index === 0 ? 'rounded-t-md' : ''}
                ${index === suggestions.length - 1 ? 'rounded-b-md' : ''}
              `}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="font-medium">{suggestion.code}</span>
              <span className="text-gray-600 ml-2">- {suggestion.name}</span>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default StateInput;