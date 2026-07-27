// ============================================
// L'obolo dell'Arrosticino - Data Access Layer
// ============================================
// Interfaccia con Vercel KV (Redis).
// Tutte le operazioni CRUD sui dati.
// ============================================

import { kv } from '@vercel/kv';
import { Amico, CostiCollette, DatiColletta } from './types';

// Chiavi Redis
const KV_COSTI = 'colletta:costi';
const KV_AMICI = 'colletta:amici';

/** Valori di default per i costi */
const DEFAULT_COSTI: CostiCollette = {
  costoNormali: 0,
  costoFegato: 0,
  costoC2: 0,
};

/**
 * Recupera tutti i dati della colletta (costi + amici).
 * Se non esistono dati, restituisce i valori di default.
 */
export async function getDatiColletta(): Promise<DatiColletta> {
  const [costi, amici] = await Promise.all([
    kv.get<CostiCollette>(KV_COSTI),
    kv.get<Amico[]>(KV_AMICI),
  ]);

  return {
    costi: costi ?? DEFAULT_COSTI,
    amici: amici ?? [],
  };
}

/** Aggiorna i costi degli scontrini */
export async function setCosti(costi: CostiCollette): Promise<void> {
  await kv.set(KV_COSTI, costi);
}

/** Recupera la lista amici */
export async function getAmici(): Promise<Amico[]> {
  const amici = await kv.get<Amico[]>(KV_AMICI);
  return amici ?? [];
}

/** Salva la lista amici completa */
export async function setAmici(amici: Amico[]): Promise<void> {
  await kv.set(KV_AMICI, amici);
}

/** Aggiunge un nuovo amico alla lista */
export async function aggiungiAmico(amico: Amico): Promise<void> {
  const amici = await getAmici();
  amici.push(amico);
  await setAmici(amici);
}

/** Rimuove un amico per ID */
export async function rimuoviAmico(id: string): Promise<void> {
  const amici = await getAmici();
  const filtrati = amici.filter(a => a.id !== id);
  await setAmici(filtrati);
}

/** Toggle dello stato pagamento di un amico */
export async function togglePagato(id: string): Promise<void> {
  const amici = await getAmici();
  const aggiornati = amici.map(a =>
    a.id === id ? { ...a, pagato: !a.pagato } : a
  );
  await setAmici(aggiornati);
}
