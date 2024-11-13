import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
interface AddressErrorPopupProps {
    isOpen: boolean;
    onClose: () => void;
    error: string;
  }
  
  const AddressErrorPopup: React.FC<AddressErrorPopupProps> = ({ isOpen, onClose, error }) => {
    // Definir el tipo para las sugerencias
    const suggestions: { [key: string]: string[] } = {
    'streetAddress': [
      'Include street number and name',
      'Spell out Street, Avenue, Boulevard, etc.',
      'Do not use special characters',
      'Example: 123 Main Street'
    ],
    'city': [
      'Enter the complete city name',
      'Check for spelling errors',
      'Do not include state or ZIP code',
      'Example: Miami'
    ],
    'state': [
      'Use the two-letter state code',
      'Must be a valid US state',
      'Example: FL for Florida'
    ],
    'zipCode': [
      'Must be exactly 5 digits',
      'Must be a valid US ZIP code',
      'Example: 33130'
    ]
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full relative z-50 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section with Error */}
            <div className="p-6 bg-red-50 border-b border-red-100">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="title-font text-xl font-semibold text-gray-900">
                    Address Validation Error
                  </h3>
                  <div className="mt-1 body-font text-sm text-red-600 break-words">
                    {error}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <h4 className="sharp-font text-lg font-medium text-gray-900">
                  Please ensure:
                </h4>
                <div className="space-y-3">
                  {Object.keys(suggestions).map(field => (
                    <motion.div
                      key={field}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <h5 className="tight-font font-medium text-gray-900 mb-2 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}:
                      </h5>
                      <ul className="space-y-1.5">
                        {suggestions[field].map((suggestion, index) => (
                          <li
                            key={index}
                            className="body-font text-sm text-gray-600 flex items-start"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#936DAD] mr-2 mt-1.5 flex-shrink-0" />
                            <span className="flex-1">
                              {suggestion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Button at Bottom */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-[#936DAD] text-white py-3 px-4 rounded-full sharp-font font-medium hover:bg-[#8363A7] transition-colors"
              >
                Got it, I&apos;ll fix it
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddressErrorPopup;