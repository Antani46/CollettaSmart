'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/actions';
import { Shield, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="page-container justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-celtic-forest border-2 border-celtic-gold/30 mb-4">
            <Shield className="w-10 h-10 text-celtic-gold" />
          </div>
          <h1 className="font-medieval text-2xl text-celtic-gold mb-2">
            Accesso Custode
          </h1>
          <p className="text-celtic-parchment/60 text-sm">
            Solo i custodi del festival
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-celtic-gold/50" />
            <input
              type="password"
              name="password"
              required
              className="w-full pl-11 pr-4 py-4 bg-celtic-forest border border-celtic-moss rounded-xl text-celtic-parchment placeholder:text-celtic-parchment/30 focus:outline-none focus:border-celtic-gold/50 focus:ring-1 focus:ring-celtic-gold/30 transition-all text-lg"
            />
          </div>

          {state?.error && (
            <div className="bg-celtic-red/20 border border-celtic-red/40 rounded-xl p-3 text-center">
              <p className="text-red-300 text-sm">{state.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-gradient-to-r from-celtic-gold/80 to-celtic-gold rounded-xl text-celtic-dark font-bold text-lg transition-all hover:from-celtic-gold hover:to-celtic-gold-light active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-spin w-5 h-5 border-2 border-celtic-dark border-t-transparent rounded-full" />
                Verifico...
              </span>
            ) : (
              'Entra nel Cerchio'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
