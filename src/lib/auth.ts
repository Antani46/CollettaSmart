// ============================================
// L'obolo dell'Arrosticino - Autenticazione
// ============================================
// Gestione sessione admin con cookie HTTP-only.
// La password non viene MAI esposta al client.
// ============================================

import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SESSION_TOKEN = 'obolo-admin-authenticated';

/**
 * Verifica se la password fornita corrisponde a quella
 * nella variabile d'ambiente ADMIN_PASSWORD.
 * Eseguita SOLO server-side.
 */
export async function verificaPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD non configurata nelle variabili d\'ambiente!');
    return false;
  }
  return password === adminPassword;
}

/**
 * Crea un cookie HTTP-only per la sessione admin.
 * Il cookie è:
 * - httpOnly: non accessibile via JavaScript client-side
 * - secure: inviato solo su HTTPS (in produzione)
 * - sameSite: strict per prevenire CSRF
 * - maxAge: 24 ore
 */
export async function creaSessioneAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 ore
    path: '/',
  });
}

/**
 * Verifica se l'utente è autenticato come admin
 * controllando la presenza e validità del cookie.
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === SESSION_TOKEN;
}

/** Rimuove il cookie di sessione admin (logout) */
export async function rimuoviSessioneAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
