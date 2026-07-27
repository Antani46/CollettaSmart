// ============================================
// L'obolo dell'Arrosticino - Admin Page (Server Component)
// ============================================
// File: src/app/admin/page.tsx
// Riscritto con try/catch anti-crash e fallback
// sicuri per DB vuoto o irraggiungibile.
// ============================================

import { isAdmin } from '@/lib/auth';
import { getDatiColletta } from '@/lib/kv';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import { CostiCollette, Amico } from '@/lib/types';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const autenticato = await isAdmin();

  if (!autenticato) {
    return <AdminLogin />;
  }

  let costi: CostiCollette = { costoNormali: 0, costoFegato: 0, costoC2: 0 };
  let amici: Amico[] = [];
  let erroreDB = false;

  // Blocco try/catch obbligatorio per evitare crash del Server Component in Admin
  try {
    const dati = await getDatiColletta();

    // Protezione null / indefinito sui costi (default a 0)
    if (dati?.costi) {
      costi = {
        costoNormali: Number(dati.costi.costoNormali || 0),
        costoFegato: Number(dati.costi.costoFegato || 0),
        costoC2: Number(dati.costi.costoC2 || 0),
      };
    }

    // Protezione null / indefinito sulla lista amici (default a [])
    if (Array.isArray(dati?.amici)) {
      amici = dati.amici;
    }
  } catch (error) {
    console.error('❌ Errore critico caricamento dati in Admin:', error);
    erroreDB = true;
  }

  // Interfaccia di emergenza per il Custode in caso di errore DB
  if (erroreDB) {
    return (
      <div className="min-h-dvh bg-celtic-dark flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-celtic-forest/80 border-2 border-celtic-red/50 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
          <AlertTriangle className="w-12 h-12 text-celtic-red mx-auto mb-4 animate-bounce" />
          <h1 className="font-medieval text-2xl text-celtic-gold mb-2">
            Database Non Raggiungibile
          </h1>
          <p className="text-celtic-parchment/70 text-sm mb-6">
            Si è verificato un errore durante la comunicazione con Upstash Redis. Controlla le variabili d&apos;ambiente o lo stato del servizio.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-celtic-gold/20 hover:bg-celtic-gold/30 text-celtic-gold border border-celtic-gold/40 rounded-xl font-bold transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna all&apos;accampamento
          </Link>
        </div>
      </div>
    );
  }

  return <AdminDashboard costi={costi} amici={amici} />;
}
