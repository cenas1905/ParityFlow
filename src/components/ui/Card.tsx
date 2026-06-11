import React from 'react';

export default function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}
