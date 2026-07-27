'use client';

import { useEffect, useState } from 'react';
import { X, CreditCard, Banknote } from 'lucide-react';
import { QuoteCalcolate } from '@/lib/types';

interface AmicoDrawerProps {
  nome: string;
  quote: QuoteCalcolate;
  pagato: boolean;
  partecipaC1: boolean;
  partecipaC2: boolean;
  mangiaFegato: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function AmicoDrawer({
  nome,
  quote,
  pagato,
  partecipaC1,
  partecipaC2,
  mangiaFegato,
  isOpen,
  onClose,
}: AmicoDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Deep link URLs dai environment variables passati come props
  const revolutUrl = `https://revolut.me/${process.env.NEXT_PUBLIC_REVOLUT_USERNAME || 'USERNAME'}/${quote.totaleAmico.toFixed(2)}`;
  const paypalUrl = `https://paypal.me/${process.env.NEXT_PUBLIC_PAYPAL_USERNAME || 'USERNAME'}/${quote.totaleAmico.toFixed(2)}`;

  useEffect(() => {
    if (isOpen) {
      // Piccolo delay per animazione
      requestAnimationFrame(() => setIsVisible(true));
      // Blocca scroll body
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-celtic-forest border-t border-celtic-gold/20 rounded-t-3xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-celtic-moss" />
        </div>

        <div className="px-5 pb-8 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-medieval text-xl text-celtic-gold">{nome}</h2>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  pagato
                    ? 'bg-celtic-green/20 text-green-300 border border-celtic-green/30'
                    : 'bg-celtic-red/20 text-red-300 border border-celtic-red/30'
                }`}
              >
                {pagato ? '✓ Pagato' : '✗ Non pagato'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-celtic-parchment/40 hover:text-celtic-parchment transition-colors rounded-full hover:bg-celtic-dark/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dettaglio Quote */}
          <div className="space-y-3 mb-6">
            <h3 className="text-celtic-parchment/50 text-xs uppercase tracking-wider">Dettaglio Quote</h3>
            
            {partecipaC1 && (
              <div className="bg-celtic-dark/40 rounded-xl p-4 space-y-2">
                <p className="text-celtic-parchment/60 text-sm font-medium">🍖 Colletta 1 — Arrosticini</p>
                <div className="flex justify-between items-center">
                  <span className="text-celtic-parchment/50 text-sm">Quota Normali</span>
                  <span className="text-celtic-parchment font-medium">€{quote.quotaNormali.toFixed(2)}</span>
                </div>
                {mangiaFegato && (
                  <div className="flex justify-between items-center">
                    <span className="text-celtic-parchment/50 text-sm">Quota Fegato</span>
                    <span className="text-celtic-parchment font-medium">€{quote.quotaFegato.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {partecipaC2 && (
              <div className="bg-celtic-dark/40 rounded-xl p-4">
                <p className="text-celtic-parchment/60 text-sm font-medium mb-2">🛍️ Colletta 2 — Generale</p>
                <div className="flex justify-between items-center">
                  <span className="text-celtic-parchment/50 text-sm">Quota</span>
                  <span className="text-celtic-parchment font-medium">€{quote.quotaC2.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Totale */}
            <div className="bg-celtic-gold/10 border border-celtic-gold/20 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-celtic-gold font-medium">Totale da pagare</span>
                <span className="text-2xl font-bold text-celtic-gold">€{quote.totaleAmico.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Pulsanti Pagamento */}
          {!pagato && quote.totaleAmico > 0 && (
            <div className="space-y-3">
              <h3 className="text-celtic-parchment/50 text-xs uppercase tracking-wider">Paga con</h3>
              
              <a
                href={revolutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#0075EB] rounded-xl text-white font-bold text-lg transition-all hover:bg-[#0066d1] active:scale-[0.98]"
              >
                <CreditCard className="w-5 h-5" />
                Paga con Revolut
              </a>

              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#003087] rounded-xl text-white font-bold text-lg transition-all hover:bg-[#002670] active:scale-[0.98]"
              >
                <Banknote className="w-5 h-5" />
                Paga con PayPal
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
