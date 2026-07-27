// ============================================
// Home Page — L'obolo dell'Arrosticino
// ============================================

import { getDatiColletta } from '@/lib/kv';
import { calcolaQuoteAmico, calcolaRiepilogo } from '@/lib/calcoli';
import ProgressBar from '@/components/ProgressBar';
import AmicoList from '@/components/AmicoList';
import { TreePine, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { CostiCollette, Amico } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let costi: CostiCollette = { costoNormali: 0, costoFegato: 0, costoC2: 0 };
  let amici: Amico[] = [];
  let erroreDB = false;

  // Blocco try/catch obbligatorio per proteggere il render Server-Side
  try {
    const dati = await getDatiColletta();

    // Garanzia di gestione caso null / indefinito per i costi
    if (dati?.costi) {
      costi = {
        costoNormali: Number(dati.costi.costoNormali || 0),
        costoFegato: Number(dati.costi.costoFegato || 0),
        costoC2: Number(dati.costi.costoC2 || 0),
      };
    }

    // Garanzia di gestione caso null / indefinito per la lista amici
    if (Array.isArray(dati?.amici)) {
      amici = dati.amici;
    }
  } catch (error) {
    console.error('❌ Errore fatale caricamento dati nella Home:', error);
    erroreDB = true;
  }

  // Interfaccia di emergenza in caso di errore DB irrecuperabile (usando pattern visivi DRY)
  if (erroreDB) {
    return (
      <div className="page-container justify-center p-6 text-center">
        <div className="card-error animate-fade-in">
          <AlertTriangle className="w-12 h-12 text-celtic-red mx-auto mb-4 animate-bounce" />
          <h1 className="font-medieval text-2xl text-celtic-gold mb-2">
            Impossibile caricare i dati
          </h1>
          <p className="text-celtic-parchment/70 text-sm mb-6">
            Il custode sta riscontrando problemi di connessione con le antiche pergamene (Database Upstash non raggiungibile o in manutenzione).
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-celtic-gold/20 hover:bg-celtic-gold/30 text-celtic-gold border border-celtic-gold/40 rounded-xl font-bold transition-all text-sm"
          >
            <Shield className="w-4 h-4" />
            Verifica Accesso Custode
          </Link>
        </div>
      </div>
    );
  }

  // Calcoli di riepilogo protetti e pre-elaborazione delle quote
  const riepilogo = calcolaRiepilogo(amici, costi);
  const donatoriFurgone = amici.filter(u => u.pagato === true && u.aiutoFurgone === true);
  const amiciConQuote = amici.map((amico) => ({
    ...amico,
    quote: calcolaQuoteAmico(amico, costi, amici),
  }));

  return (
    <div className="page-container">
      {/* Contenitore Globale (Wrapper DRY) */}
      <div className="main-wrapper">
        
        {/* ===== HEADER ===== */}
        <header className="pt-6 pb-4 text-center relative">
          {/* Decorazione celtica */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-celtic-gold/20 rounded-full blur-xl" />
              <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-celtic-forest border-2 border-celtic-gold/30 shadow-lg">
                <TreePine className="w-7 h-7 text-celtic-gold" />
              </div>
            </div>
          </div>

          <h1 className="font-medieval text-3xl text-celtic-gold mb-1 animate-fade-in tracking-wide">
            Missione Arrosticini
          </h1>
          <p className="text-celtic-parchment/60 text-sm animate-fade-in delay-100">
            Montelago — Collette dei Sbandieratori
          </p>

          {/* Separatore celtico */}
          <div className="flex items-center justify-center gap-3 mt-4 animate-fade-in delay-200">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-celtic-gold/30" />
            <span className="text-celtic-gold/40 text-xs">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-celtic-gold/30" />
          </div>
        </header>

        {/* ===== CONTENUTO PRINCIPALE ===== */}
        <main className="w-full space-y-6">
          {/* Progress Bar con Hall of Fame */}
          <div className="w-full animate-fade-in delay-150">
            <ProgressBar
              raccolto={riepilogo.raccolto}
              totale={riepilogo.totale}
              pagati={riepilogo.pagati}
              totaleAmici={riepilogo.totaleAmici}
              donatoriFurgone={donatoriFurgone.map(u => u.nome)}
            />
          </div>

          {/* Lista Amici */}
          <div className="w-full animate-fade-in delay-250">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-medieval text-lg text-celtic-gold">
                La Compagnia
              </h2>
              <span className="text-celtic-parchment/50 text-xs font-medium">
                {amici.length} {amici.length === 1 ? 'compagno' : 'compagni'}
              </span>
            </div>

            {amici.length === 0 ? (
              <div className="card-empty">
                <TreePine className="w-10 h-10 text-celtic-moss mx-auto mb-3" />
                <p className="text-celtic-parchment/60 text-sm font-medium">
                  Nessun compagno ancora.
                </p>
                <p className="text-celtic-parchment/40 text-xs mt-1">
                  Il custode deve aggiungere i partecipanti.
                </p>
              </div>
            ) : (
              <AmicoList amiciConQuote={amiciConQuote} />
            )}
          </div>

          {/* Link Admin discreto */}
          <div className="text-center pt-4 pb-4 animate-fade-in delay-350">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-celtic-parchment/30 hover:text-celtic-parchment/60 text-xs transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Accesso Custode
            </Link>
          </div>
        </main>

      </div>
    </div>
  );
}
