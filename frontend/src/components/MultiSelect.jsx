import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const MultiSelect = ({ options, selectedValues, onChange }) => {
  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <div
            key={option.value}
            onClick={() => toggleOption(option.value)}
            className={clsx(
              'relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center flex items-center justify-center min-h-[60px]',
              isSelected
                ? 'border-primary bg-primary text-white shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <span className="font-medium text-sm leading-tight z-10 relative">
              {option.label}
            </span>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-1 right-1 text-white bg-black/20 rounded-full p-0.5"
              >
                <Check size={12} strokeWidth={3} />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};
