// ============================================
// L'obolo dell'Arrosticino - Type Definitions
// ============================================

/** Rappresenta un amico/partecipante alle collette */
export interface Amico {
  id: string;
  nome: string;
  /** Partecipa alla Colletta 1 (Arrosticini) */
  partecipaC1: boolean;
  /** Partecipa alla Colletta 2 (Generale) */
  partecipaC2: boolean;
  /** Mangia arrosticini di fegato (rilevante solo per C1) */
  mangiaFegato: boolean;
  /** Contributo facoltativo Aiuto Furgone (€10 fisso) */
  aiutoFurgone?: boolean;
  /** Ha già pagato il suo totale */
  pagato: boolean;
}

/** Costi totali degli scontrini */
export interface CostiCollette {
  /** Scontrino arrosticini normali (C1) */
  costoNormali: number;
  /** Scontrino arrosticini fegato (C1) */
  costoFegato: number;
  /** Costo totale Colletta 2 */
  costoC2: number;
}

/** Quote calcolate per un singolo amico */
export interface QuoteCalcolate {
  /** Quota arrosticini normali (C1) */
  quotaNormali: number;
  /** Quota arrosticini fegato (C1) — solo per chi mangia fegato */
  quotaFegato: number;
  /** Quota Colletta 2 */
  quotaC2: number;
  /** Quota Aiuto Furgone (€10.00 se attivo, 0 altrimenti) */
  quotaFurgone: number;
  /** Totale da pagare (somma delle quote applicabili) */
  totaleAmico: number;
}

/** Struttura completa dei dati in Vercel KV */
export interface DatiColletta {
  costi: CostiCollette;
  amici: Amico[];
}

/** Riepilogo globale della raccolta */
export interface RiepilogoColletta {
  /** Totale già raccolto (somma totali degli amici che hanno pagato) */
  raccolto: number;
  /** Totale da raccogliere (somma totali di tutti gli amici) */
  totale: number;
  /** Quota principale raccolta (depurata dalla parte furgone) */
  raccoltoPrincipale: number;
  /** Quota furgone raccolta (solo dai paganti con aiutoFurgone === true) */
  raccoltoFurgone: number;
  /** Numero di amici che hanno pagato */
  pagati: number;
  /** Numero totale di amici */
  totaleAmici: number;
}
