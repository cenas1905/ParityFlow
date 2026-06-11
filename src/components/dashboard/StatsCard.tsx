import React from 'react';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
  valueClassName?: string;
}

export default function StatsCard({ title, value, subtitle, className = '', valueClassName = '' }: StatsCardProps) {
  return (
    <SpotlightCard className={`p-5 hover:border-white/10 transition-all duration-300 ${className}`}>
      <p className="text-sm text-zinc-400 mb-1">{title}</p>
      <p className={`text-3xl font-bold text-white ${valueClassName}`}>{value}</p>
      {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
    </SpotlightCard>
  );
}
