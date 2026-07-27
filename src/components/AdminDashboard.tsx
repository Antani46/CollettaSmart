'use client';

import { useActionState, useTransition } from 'react';
import {
  aggiornaCostiAction,
  aggiungiAmicoAction,
  rimuoviAmicoAction,
  togglePagatoAction,
  logoutAction,
} from '@/app/actions';
import { calcolaQuoteAmico } from '@/lib/calcoli';
import { Amico, CostiCollette } from '@/lib/types';
import {
  LogOut,
  Receipt,
  UserPlus,
  Trash2,
  Users,
  Beef,
  CircleDollarSign,
  ShoppingBag,
} from 'lucide-react';

interface AdminDashboardProps {
  costi: CostiCollette;
  amici: Amico[];
}

export default function AdminDashboard({ costi, amici }: AdminDashboardProps) {
  const [costiState, costiAction, costiPending] = useActionState(aggiornaCostiAction, null);
  const [amicoState, amicoAction, amicoPending] = useActionState(aggiungiAmicoAction, null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-screen bg-celtic-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-celtic-dark/95 backdrop-blur-sm border-b border-celtic-moss/50 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="font-medieval text-xl text-celtic-gold">⚔️ Pannello Custode</h1>
          <button
            onClick={() => startTransition(() => logoutAction())}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-celtic-parchment/60 hover:text-celtic-red transition-colors rounded-lg hover:bg-celtic-red/10"
          >
            <LogOut className="w-4 h-4" />
            Esci
          </button>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ===== SEZIONE COSTI ===== */}
        <section className="bg-celtic-forest/80 rounded-2xl border border-celtic-moss/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-5 h-5 text-celtic-gold" />
            <h2 className="font-medieval text-lg text-celtic-gold">Scontrini</h2>
          </div>

          <form action={costiAction} className="space-y-3">
            {/* Arrosticini Normali */}
            <div>
              <label className="flex items-center gap-2 text-sm text-celtic-parchment/70 mb-1">
                <Beef className="w-4 h-4" />
                Arrosticini Normali (C1)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-celtic-gold/50 font-bold">€</span>
                <input
                  type="number"
                  name="costoNormali"
                  step="0.01"
                  min="0"
                  defaultValue={costi.costoNormali || ''}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-celtic-dark/50 border border-celtic-moss rounded-xl text-celtic-parchment placeholder:text-celtic-parchment/20 focus:outline-none focus:border-celtic-gold/50 transition-all"
                />
              </div>
            </div>

            {/* Arrosticini Fegato */}
            <div>
              <label className="flex items-center gap-2 text-sm text-celtic-parchment/70 mb-1">
                <Beef className="w-4 h-4 text-celtic-red" />
                Arrosticini Fegato (C1)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-celtic-gold/50 font-bold">€</span>
                <input
                  type="number"
                  name="costoFegato"
                  step="0.01"
                  min="0"
                  defaultValue={costi.costoFegato || ''}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-celtic-dark/50 border border-celtic-moss rounded-xl text-celtic-parchment placeholder:text-celtic-parchment/20 focus:outline-none focus:border-celtic-gold/50 transition-all"
                />
              </div>
            </div>

            {/* Colletta 2 */}
            <div>
              <label className="flex items-center gap-2 text-sm text-celtic-parchment/70 mb-1">
                <ShoppingBag className="w-4 h-4 text-celtic-green" />
                Colletta 2 — Generale
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-celtic-gold/50 font-bold">€</span>
                <input
                  type="number"
                  name="costoC2"
                  step="0.01"
                  min="0"
                  defaultValue={costi.costoC2 || ''}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-celtic-dark/50 border border-celtic-moss rounded-xl text-celtic-parchment placeholder:text-celtic-parchment/20 focus:outline-none focus:border-celtic-gold/50 transition-all"
                />
              </div>
            </div>

            {costiState?.success && (
              <div className="bg-celtic-green/20 border border-celtic-green/40 rounded-xl p-2 text-center">
                <p className="text-green-300 text-sm">✓ Scontrini aggiornati!</p>
              </div>
            )}
            {costiState?.error && (
              <div className="bg-celtic-red/20 border border-celtic-red/40 rounded-xl p-2 text-center">
                <p className="text-red-300 text-sm">{costiState.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={costiPending}
              className="w-full py-3 bg-gradient-to-r from-celtic-gold/70 to-celtic-gold/90 rounded-xl text-celtic-dark font-bold transition-all hover:from-celtic-gold/90 hover:to-celtic-gold active:scale-[0.98] disabled:opacity-50"
            >
              {costiPending ? 'Aggiorno...' : 'Aggiorna Scontrini'}
            </button>
          </form>
        </section>

        {/* ===== SEZIONE AGGIUNGI AMICO ===== */}
        <section className="bg-celtic-forest/80 rounded-2xl border border-celtic-moss/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-celtic-gold" />
            <h2 className="font-medieval text-lg text-celtic-gold">Nuovo Compagno</h2>
          </div>

          <form action={amicoAction} className="space-y-3">
            <input
              type="text"
              name="nome"
              placeholder="Nome del compagno..."
              required
              className="w-full px-4 py-3 bg-celtic-dark/50 border border-celtic-moss rounded-xl text-celtic-parchment placeholder:text-celtic-parchment/20 focus:outline-none focus:border-celtic-gold/50 transition-all"
            />

            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center gap-3 p-3 bg-celtic-dark/30 rounded-xl cursor-pointer hover:bg-celtic-dark/50 transition-colors">
                <input type="checkbox" name="partecipaC1" defaultChecked className="w-5 h-5 rounded accent-celtic-gold" />
                <span className="text-celtic-parchment text-sm">🍖 Partecipa Colletta 1 (Arrosticini)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-celtic-dark/30 rounded-xl cursor-pointer hover:bg-celtic-dark/50 transition-colors">
                <input type="checkbox" name="partecipaC2" defaultChecked className="w-5 h-5 rounded accent-celtic-gold" />
                <span className="text-celtic-parchment text-sm">🛍️ Partecipa Colletta 2 (Generale)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-celtic-dark/30 rounded-xl cursor-pointer hover:bg-celtic-dark/50 transition-colors">
                <input type="checkbox" name="mangiaFegato" className="w-5 h-5 rounded accent-celtic-gold" />
                <span className="text-celtic-parchment text-sm">🫀 Mangia Fegato</span>
              </label>
            </div>

            {amicoState?.success && (
              <div className="bg-celtic-green/20 border border-celtic-green/40 rounded-xl p-2 text-center">
                <p className="text-green-300 text-sm">✓ Compagno aggiunto!</p>
              </div>
            )}
            {amicoState?.error && (
              <div className="bg-celtic-red/20 border border-celtic-red/40 rounded-xl p-2 text-center">
                <p className="text-red-300 text-sm">{amicoState.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={amicoPending}
              className="w-full py-3 bg-gradient-to-r from-celtic-gold/70 to-celtic-gold/90 rounded-xl text-celtic-dark font-bold transition-all hover:from-celtic-gold/90 hover:to-celtic-gold active:scale-[0.98] disabled:opacity-50"
            >
              {amicoPending ? 'Aggiungo...' : 'Aggiungi Compagno'}
            </button>
          </form>
        </section>

        {/* ===== LISTA AMICI ===== */}
        <section className="bg-celtic-forest/80 rounded-2xl border border-celtic-moss/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-celtic-gold" />
            <h2 className="font-medieval text-lg text-celtic-gold">
              La Compagnia ({amici.length})
            </h2>
          </div>

          {amici.length === 0 ? (
            <p className="text-center text-celtic-parchment/40 py-8">
              Nessun compagno ancora. Aggiungi il primo!
            </p>
          ) : (
            <div className="space-y-2">
              {amici.map((amico) => {
                const quote = calcolaQuoteAmico(amico, costi, amici);
                return (
                  <div
                    key={amico.id}
                    className="flex items-center gap-3 p-3 bg-celtic-dark/30 rounded-xl"
                  >
                    {/* Toggle Pagato */}
                    <button
                      onClick={() => startTransition(() => togglePagatoAction(amico.id))}
                      disabled={isPending}
                      className={`flex-shrink-0 w-12 h-7 rounded-full transition-all relative ${
                        amico.pagato
                          ? 'bg-celtic-green'
                          : 'bg-celtic-dark/60 border border-celtic-moss'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${
                          amico.pagato ? 'left-[22px]' : 'left-0.5'
                        }`}
                      />
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-celtic-parchment font-medium truncate">
                        {amico.nome}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-celtic-parchment/50">
                        {amico.partecipaC1 && <span>🍖C1</span>}
                        {amico.partecipaC2 && <span>🛍️C2</span>}
                        {amico.mangiaFegato && <span>🫀Feg</span>}
                        <span className="text-celtic-gold">€{quote.totaleAmico.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Rimuovi */}
                    <button
                      onClick={() => {
                        if (confirm(`Rimuovere ${amico.nome} dalla compagnia?`)) {
                          startTransition(() => rimuoviAmicoAction(amico.id));
                        }
                      }}
                      disabled={isPending}
                      className="flex-shrink-0 p-2 text-celtic-parchment/30 hover:text-celtic-red transition-colors rounded-lg hover:bg-celtic-red/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Spacer for bottom safety */}
        <div className="h-8" />
      </main>
    </div>
  );
}
