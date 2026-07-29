// ============================================
// L'obolo dell'Arrosticino - Logica Matematica
// ============================================
// Funzioni pure per il calcolo delle quote.
// Nessun side effect, nessuna dipendenza da DB.
// ============================================

import { Amico, CostiCollette, QuoteCalcolate, RiepilogoColletta } from './types';

export function calcolaQuoteAmico(
  amico: Amico,
  costi: CostiCollette,
  tuttiAmici: Amico[]
): QuoteCalcolate {
  // Conta i partecipanti per ogni divisione
  const partecipantiC1 = tuttiAmici.filter(a => a.partecipaC1).length;
  const partecipantiFegato = tuttiAmici.filter(a => a.partecipaC1 && a.mangiaFegato).length;
  const partecipantiC2 = tuttiAmici.filter(a => a.partecipaC2).length;

  // Calcola la quota Normali (solo se l'amico partecipa a C1)
  const quotaNormali = amico.partecipaC1 && partecipantiC1 > 0
    ? costi.costoNormali / partecipantiC1
    : 0;

  // Calcola la quota Fegato (solo se l'amico partecipa a C1 E mangia fegato)
  const quotaFegato = amico.partecipaC1 && amico.mangiaFegato && partecipantiFegato > 0
    ? costi.costoFegato / partecipantiFegato
    : 0;

  // Calcola la quota C2 (solo se l'amico partecipa a C2)
  const quotaC2 = amico.partecipaC2 && partecipantiC2 > 0
    ? costi.costoC2 / partecipantiC2
    : 0;

  // Calcola la quota Furgone (costo fisso di 10.00€ se aiutoFurgone è attivo)
  const quotaFurgone = amico.aiutoFurgone ? 10 : 0;

  // Il totale è la somma di tutte le quote applicabili
  const totaleAmico = quotaNormali + quotaFegato + quotaC2 + quotaFurgone;

  return {
    quotaNormali: arrotonda(quotaNormali),
    quotaFegato: arrotonda(quotaFegato),
    quotaC2: arrotonda(quotaC2),
    quotaFurgone: arrotonda(quotaFurgone),
    totaleAmico: arrotonda(totaleAmico),
  };
}

/**
 * Calcola il riepilogo globale della raccolta.
 * Somma i totali di ogni amico e confronta con chi ha pagato.
 */
export function calcolaRiepilogo(
  amici: Amico[],
  costi: CostiCollette
): RiepilogoColletta {
  let raccolto = 0;
  let totale = 0;
  let pagati = 0;

  for (const amico of amici) {
    const quote = calcolaQuoteAmico(amico, costi, amici);
    totale += quote.totaleAmico;
    if (amico.pagato) {
      raccolto += quote.totaleAmico;
      pagati++;
    }
  }

  return {
    raccolto: arrotonda(raccolto),
    totale: arrotonda(totale),
    pagati,
    totaleAmici: amici.length,
  };
}

/** Arrotonda a 2 decimali per evitare floating point hell */
function arrotonda(n: number): number {
  return Math.round(n * 100) / 100;
}
