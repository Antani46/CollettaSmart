// ============================================
// L'obolo dell'Arrosticino - Data Access Layer
// ============================================
// Supporta sia @vercel/kv che @upstash/redis
// con gestione tollerante degli errori e fallback.
// ============================================

import { Redis } from '@upstash/redis';
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

/** Inizializzazione flessibile del client Redis (Upstash / Vercel KV) */
function getRedisClient(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_URL ||
    process.env.REDIS_URL;

  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

  // Se i valori sono mancanti o sono quelli di default del placeholder, restituisce null per attivare il fallback sicuro
  if (!url || !token || url.includes('your_kv_url_here') || token.includes('your_kv_token_here')) {
    return null;
  }

  try {
    return new Redis({ url, token });
  } catch (err) {
    console.warn('Impossibile inizializzare il client Redis:', err);
    return null;
  }
}

const redis = getRedisClient();

/**
 * Recupera tutti i dati della colletta (costi + amici).
 * Se Redis non è configurato o c'è un errore di connessione, restituisce i valori di default senza crashare.
 */
export async function getDatiColletta(): Promise<DatiColletta> {
  if (!redis) {
    console.warn('⚠️ Redis non configurato. Imposta KV_REST_API_URL / UPSTASH_REDIS_REST_URL nelle variabili ambiente.');
    return { costi: DEFAULT_COSTI, amici: [] };
  }

  try {
    const [costi, amici] = await Promise.all([
      redis.get<CostiCollette>(KV_COSTI),
      redis.get<Amico[]>(KV_AMICI),
    ]);

    return {
      costi: costi ?? DEFAULT_COSTI,
      amici: amici ?? [],
    };
  } catch (err) {
    console.error('⚠️ Errore di lettura da Redis/Upstash:', err);
    return { costi: DEFAULT_COSTI, amici: [] };
  }
}

/** Aggiorna i costi degli scontrini */
export async function setCosti(costi: CostiCollette): Promise<void> {
  if (!redis) {
    console.warn('⚠️ Impossibile salvare i costi: Redis non connesso.');
    return;
  }
  try {
    await redis.set(KV_COSTI, costi);
  } catch (err) {
    console.error('⚠️ Errore nel salvataggio dei costi su Redis:', err);
  }
}

/** Recupera la lista amici */
export async function getAmici(): Promise<Amico[]> {
  if (!redis) return [];
  try {
    const amici = await redis.get<Amico[]>(KV_AMICI);
    return amici ?? [];
  } catch (err) {
    console.error('⚠️ Errore lettura amici da Redis:', err);
    return [];
  }
}

/** Salva la lista amici completa */
export async function setAmici(amici: Amico[]): Promise<void> {
  if (!redis) {
    console.warn('⚠️ Impossibile salvare gli amici: Redis non connesso.');
    return;
  }
  try {
    await redis.set(KV_AMICI, amici);
  } catch (err) {
    console.error('⚠️ Errore salvataggio amici su Redis:', err);
  }
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
  const filtrati = amici.filter((a) => a.id !== id);
  await setAmici(filtrati);
}

/** Toggle dello stato pagamento di un amico */
export async function togglePagato(id: string): Promise<void> {
  const amici = await getAmici();
  const aggiornati = amici.map((a) =>
    a.id === id ? { ...a, pagato: !a.pagato } : a
  );
  await setAmici(aggiornati);
}
