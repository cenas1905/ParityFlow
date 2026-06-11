import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
            {label}
            {hint && <span className="ml-2 text-xs text-zinc-500 font-normal">({hint})</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors ${
            fullWidth ? 'w-full' : ''
          } ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
