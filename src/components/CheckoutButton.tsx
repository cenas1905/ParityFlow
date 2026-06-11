'use client';

import { useState } from 'react';

interface CheckoutButtonProps {
  endpoint: '/api/stripe/checkout' | '/api/portal';
  label: string;
  className?: string;
}

export default function CheckoutButton({ endpoint, label, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL provided by the server');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please check your Stripe keys or try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleAction}
        disabled={loading}
        className={`${className} disabled:opacity-50 flex items-center justify-center`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          label
        )}
      </button>
      
      {error && (
        <div className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg break-words w-full">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
