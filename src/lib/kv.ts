// ============================================
// L'obolo dell'Arrosticino - Data Access Layer
// ============================================
// File: src/lib/kv.ts
// Client ufficiale @upstash/redis con protezioni
// anti-crash su database vuoto (null handling).
// ============================================

import { Redis } from '@upstash/redis';
import { Amico, CostiCollette, DatiColletta } from './types';

// Istanza esplicita di Upstash Redis
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || 'https://proper-deer-190421.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || 'gQAAAAAAAufVAAIgcDE4OTdjOGE3ZmZhNWM0NDQ3YWZiZWE3ZGNiOTI3MjYyNg',
});

// Chiavi Redis
const KV_COSTI = 'colletta:costi';
const KV_AMICI = 'colletta:amici';

const DEFAULT_COSTI: CostiCollette = {
  costoNormali: 0,
  costoFegato: 0,
  costoC2: 0,
};

/**
 * Funzione di parsing sicura per dati provenienti da Redis.
 * Gestisce sia oggetti JSON già analizzati che stringhe JSON,
 * con fallback immediato se il valore è null o indefinito.
 */
function parseData<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) {
    return fallback;
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  if (typeof raw === 'object') {
    return raw as T;
  }
  return fallback;
}

/**
 * Recupera tutti i dati della colletta.
 * Se Redis restituisce null (DB vuoto), applica i valori di default.
 */
export async function getDatiColletta(): Promise<DatiColletta> {
  try {
    const [costiRaw, amiciRaw] = await Promise.all([
      redis.get(KV_COSTI),
      redis.get(KV_AMICI),
    ]);

    const costiParsed = parseData<CostiCollette>(costiRaw, DEFAULT_COSTI);
    const costi: CostiCollette = {
      costoNormali: Number(costiParsed?.costoNormali || 0),
      costoFegato: Number(costiParsed?.costoFegato || 0),
      costoC2: Number(costiParsed?.costoC2 || 0),
    };

    const amiciParsed = parseData<Amico[]>(amiciRaw, []);
    const amici: Amico[] = Array.isArray(amiciParsed) ? amiciParsed : [];

    return { costi, amici };
  } catch (err) {
    console.error('❌ [kv.ts] Errore critico in getDatiColletta:', err);
    return { costi: DEFAULT_COSTI, amici: [] };
  }
}

/** Salva i costi su Upstash Redis */
export async function setCosti(costi: CostiCollette): Promise<void> {
  try {
    await redis.set(KV_COSTI, costi);
  } catch (err) {
    console.error('❌ [kv.ts] Errore nel salvataggio costi:', err);
    throw err;
  }
}

/** Recupera la lista amici garantendo sempre un array [] */
export async function getAmici(): Promise<Amico[]> {
  try {
    const raw = await redis.get(KV_AMICI);
    const parsed = parseData<Amico[]>(raw, []);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('❌ [kv.ts] Errore in getAmici:', err);
    return [];
  }
}

/** Salva la lista amici su Upstash Redis */
export async function setAmici(amici: Amico[]): Promise<void> {
  try {
    await redis.set(KV_AMICI, amici);
  } catch (err) {
    console.error('❌ [kv.ts] Errore nel salvataggio amici:', err);
    throw err;
  }
}

/** Aggiunge un compagno alla colletta */
export async function aggiungiAmico(amico: Amico): Promise<void> {
  const amici = await getAmici();
  amici.push(amico);
  await setAmici(amici);
}

/** Rimuove un compagno tramite ID */
export async function rimuoviAmico(id: string): Promise<void> {
  const amici = await getAmici();
  const filtrati = amici.filter((a) => a.id !== id);
  await setAmici(filtrati);
}

/** Modifica lo stato di pagamento (pagato/non pagato) */
export async function togglePagato(id: string): Promise<void> {
  const amici = await getAmici();
  const aggiornati = amici.map((a) =>
    a.id === id ? { ...a, pagato: !a.pagato } : a
  );
  await setAmici(aggiornati);
}

/** Imposta la spunta di Aiuto Furgone per un compagno */
export async function impostaFurgone(id: string, attivo: boolean): Promise<void> {
  const amici = await getAmici();
  const aggiornati = amici.map((a) =>
    a.id === id ? { ...a, aiutoFurgone: attivo } : a
  );
  await setAmici(aggiornati);
}
