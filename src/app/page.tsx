import { getDatiColletta } from '@/lib/kv';
import { calcolaQuoteAmico, calcolaRiepilogo } from '@/lib/calcoli';
import ProgressBar from '@/components/ProgressBar';
import AmicoList from '@/components/AmicoList';
import { TreePine, Shield } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { costi, amici } = await getDatiColletta();
  const riepilogo = calcolaRiepilogo(amici, costi);

  // Pre-calcola le quote per ogni amico (server-side)
  const amiciConQuote = amici.map((amico) => ({
    ...amico,
    quote: calcolaQuoteAmico(amico, costi, amici),
  }));

  return (
    <div className="min-h-dvh bg-celtic-dark">
      {/* ===== HEADER ===== */}
      <header className="relative px-4 pt-8 pb-6 text-center">
        {/* Decorazione celtica */}
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="absolute inset-0 bg-celtic-gold/20 rounded-full blur-xl" />
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-celtic-forest border-2 border-celtic-gold/30">
              <TreePine className="w-8 h-8 text-celtic-gold" />
            </div>
          </div>
        </div>

        <h1 className="font-medieval text-2xl text-celtic-gold mb-1 animate-fade-in">
          L&apos;obolo dell&apos;Arrosticino
        </h1>
        <p className="text-celtic-parchment/50 text-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Festival Celtico — Collette della Compagnia
        </p>

        {/* Separatore celtico */}
        <div className="flex items-center justify-center gap-3 mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-celtic-gold/30" />
          <span className="text-celtic-gold/40 text-xs">✦</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-celtic-gold/30" />
        </div>
      </header>

      {/* ===== CONTENUTO PRINCIPALE ===== */}
      <main className="max-w-lg mx-auto px-4 pb-8 space-y-5">
        {/* Progress Bar */}
        <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <ProgressBar
            raccolto={riepilogo.raccolto}
            totale={riepilogo.totale}
            pagati={riepilogo.pagati}
            totaleAmici={riepilogo.totaleAmici}
          />
        </div>

        {/* Lista Amici */}
        <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-medieval text-lg text-celtic-gold">
              La Compagnia
            </h2>
            <span className="text-celtic-parchment/40 text-xs">
              {amici.length} {amici.length === 1 ? 'compagno' : 'compagni'}
            </span>
          </div>

          {amici.length === 0 ? (
            <div className="bg-celtic-forest/40 rounded-2xl border border-celtic-moss/30 p-8 text-center">
              <TreePine className="w-10 h-10 text-celtic-moss mx-auto mb-3" />
              <p className="text-celtic-parchment/40 text-sm">
                Nessun compagno ancora.
              </p>
              <p className="text-celtic-parchment/30 text-xs mt-1">
                Il custode deve aggiungere i partecipanti.
              </p>
            </div>
          ) : (
            <AmicoList amiciConQuote={amiciConQuote} />
          )}
        </div>

        {/* Link Admin discreto */}
        <div className="text-center pt-4 animate-fade-in" style={{ animationDelay: '0.35s' }}>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-celtic-parchment/20 hover:text-celtic-parchment/40 text-xs transition-colors"
          >
            <Shield className="w-3 h-3" />
            Accesso Custode
          </Link>
        </div>
      </main>
    </div>
  );
}
