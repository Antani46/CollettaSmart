'use client';

import { CircleDollarSign } from 'lucide-react';

interface ProgressBarProps {
  raccolto: number;
  totale: number;
  pagati: number;
  totaleAmici: number;
}

export default function ProgressBar({ raccolto, totale, pagati, totaleAmici }: ProgressBarProps) {
  const percentuale = totale > 0 ? Math.min((raccolto / totale) * 100, 100) : 0;

  return (
    <div className="bg-celtic-forest/80 rounded-2xl border border-celtic-moss/50 p-5">
      {/* Titolo raccolta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="w-5 h-5 text-celtic-gold" />
          <span className="text-celtic-parchment/70 text-sm">Raccolta Totale</span>
        </div>
        <span className="text-celtic-parchment/50 text-xs">
          {pagati}/{totaleAmici} pagati
        </span>
      </div>

      {/* Importi */}
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-celtic-gold">
          €{raccolto.toFixed(2)}
        </span>
        <span className="text-celtic-parchment/40 text-lg">
          / €{totale.toFixed(2)}
        </span>
      </div>

      {/* Barra progresso */}
      <div className="relative h-3 bg-celtic-dark/60 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentuale}%`,
            background: 'linear-gradient(90deg, #8b6b4a, #c9a84c, #e8d48b)',
            boxShadow: percentuale > 0 ? '0 0 12px rgba(201, 168, 76, 0.5)' : 'none',
          }}
        />
      </div>

      {/* Percentuale */}
      <p className="text-right text-celtic-parchment/40 text-xs mt-1">
        {percentuale.toFixed(0)}%
      </p>
    </div>
  );
}
