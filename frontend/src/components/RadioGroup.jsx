import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const RadioGroup = ({ options, value, onChange }) => {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            className={clsx(
              'relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className="flex items-center justify-between relative z-10">
              <span className={clsx('font-medium', isSelected ? 'text-primary' : 'text-gray-700')}>
                {option.label}
              </span>
              <div
                className={clsx(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                  isSelected ? 'border-primary' : 'border-gray-300'
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
