'use client';

import { ChevronRight } from 'lucide-react';
import { QuoteCalcolate } from '@/lib/types';

interface AmicoCardProps {
  nome: string;
  pagato: boolean;
  quote: QuoteCalcolate;
  onClick: () => void;
}

export default function AmicoCard({ nome, pagato, quote, onClick }: AmicoCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-celtic-forest/60 hover:bg-celtic-forest/90 border border-celtic-moss/30 hover:border-celtic-gold/20 rounded-xl transition-all active:scale-[0.98] group"
    >
      {/* Avatar/Iniziale */}
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-medieval text-lg ${
          pagato
            ? 'bg-celtic-green/20 text-green-300 border border-celtic-green/30'
            : 'bg-celtic-dark/60 text-celtic-parchment/60 border border-celtic-moss/50'
        }`}
      >
        {nome.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 text-left min-w-0">
        <p className="text-celtic-parchment font-medium truncate">{nome}</p>
        <p className="text-sm">
          {pagato ? (
            <span className="text-green-400/70">✓ Pagato</span>
          ) : (
            <span className="text-celtic-gold">€{quote.totaleAmico.toFixed(2)}</span>
          )}
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight className="flex-shrink-0 w-5 h-5 text-celtic-parchment/20 group-hover:text-celtic-gold/50 transition-colors" />
    </button>
  );
}
