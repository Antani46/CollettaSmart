// ============================================
// L'obolo dell'Arrosticino - Data Access Layer
// ============================================
// Connessione a Upstash Redis via @vercel/kv.
// Il client viene creato SOLO se le variabili
// d'ambiente contengono URL validi (https://).
// Se il DB è vuoto o irraggiungibile, ritorna
// dati di default senza mai crashare.
// ============================================

import { createClient, type VercelKV } from '@vercel/kv';
import { Amico, CostiCollette, DatiColletta } from './types';

// ---------- CLIENT REDIS (Lazy & Safe) ----------

let _kv: VercelKV | null = null;
let _kvInitialized = false;

/**
 * Ritorna il client KV, creandolo al primo accesso.
 * NON chiama createClient se le env vars sono mancanti
 * o contengono placeholder, evitando il crash fatale
 * di Upstash "invalid URL" a livello di module evaluation.
 */
function getKV(): VercelKV | null {
  if (_kvInitialized) return _kv;
  _kvInitialized = true;

  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  // Guard: verifica che URL e token esistano e siano URL reali
  if (!url || !token || !url.startsWith('https://')) {
    console.warn(
      '⚠️ [kv.ts] Redis non configurato.',
      'URL trovato:', url ? `"${url.substring(0, 20)}..."` : 'undefined',
      '| Token trovato:', token ? 'sì' : 'no'
    );
    return null;
  }

  try {
    _kv = createClient({ url, token });
    return _kv;
  } catch (err) {
    console.error('❌ [kv.ts] Errore creazione client Redis:', err);
    return null;
  }
}

// ---------- CHIAVI E DEFAULTS ----------

const KV_COSTI = 'colletta:costi';
const KV_AMICI = 'colletta:amici';

const DEFAULT_COSTI: CostiCollette = {
  costoNormali: 0,
  costoFegato: 0,
  costoC2: 0,
};

// ---------- READ ----------

/**
 * Recupera tutti i dati della colletta.
 * Se il DB è vuoto (primo avvio) o non raggiungibile,
 * ritorna SEMPRE dati di default validi — mai null, mai throw.
 */
export async function getDatiColletta(): Promise<DatiColletta> {
  const kv = getKV();
  if (!kv) {
    return { costi: DEFAULT_COSTI, amici: [] };
  }

  try {
    const [costiRaw, amiciRaw] = await Promise.all([
      kv.get(KV_COSTI),
      kv.get(KV_AMICI),
    ]);

    // Protezione null: se la chiave non esiste in Redis, kv.get ritorna null
    const costi: CostiCollette =
      costiRaw && typeof costiRaw === 'object'
        ? { ...DEFAULT_COSTI, ...(costiRaw as CostiCollette) }
        : DEFAULT_COSTI;

    const amici: Amico[] = Array.isArray(amiciRaw)
      ? (amiciRaw as Amico[])
      : [];

    return { costi, amici };
  } catch (err) {
    console.error('❌ [kv.ts] Errore lettura Redis:', err);
    return { costi: DEFAULT_COSTI, amici: [] };
  }
}

// ---------- WRITE ----------

export async function setCosti(costi: CostiCollette): Promise<void> {
  const kv = getKV();
  if (!kv) throw new Error('Redis non configurato. Imposta le variabili UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN.');
  await kv.set(KV_COSTI, JSON.stringify(costi));
}

export async function getAmici(): Promise<Amico[]> {
  const kv = getKV();
  if (!kv) return [];
  try {
    const raw = await kv.get(KV_AMICI);
    return Array.isArray(raw) ? (raw as Amico[]) : [];
  } catch {
    return [];
  }
}

export async function setAmici(amici: Amico[]): Promise<void> {
  const kv = getKV();
  if (!kv) throw new Error('Redis non configurato. Imposta le variabili UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN.');
  await kv.set(KV_AMICI, JSON.stringify(amici));
}

// ---------- OPERAZIONI COMPOSITE ----------

export async function aggiungiAmico(amico: Amico): Promise<void> {
  const amici = await getAmici();
  amici.push(amico);
  await setAmici(amici);
}

export async function rimuoviAmico(id: string): Promise<void> {
  const amici = await getAmici();
  const filtrati = amici.filter((a) => a.id !== id);
  await setAmici(filtrati);
}

export async function togglePagato(id: string): Promise<void> {
  const amici = await getAmici();
  const aggiornati = amici.map((a) =>
    a.id === id ? { ...a, pagato: !a.pagato } : a
  );
  await setAmici(aggiornati);
}
