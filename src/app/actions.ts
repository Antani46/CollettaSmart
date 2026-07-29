'use server';

import { revalidatePath } from 'next/cache';
import {
  verificaPassword,
  creaSessioneAdmin,
  isAdmin,
  rimuoviSessioneAdmin,
} from '@/lib/auth';
import {
  getDatiColletta,
  setCosti,
  aggiungiAmico as kvAggiungiAmico,
  rimuoviAmico as kvRimuoviAmico,
  togglePagato as kvTogglePagato,
  impostaFurgone as kvImpostaFurgone,
} from '@/lib/kv';
import { Amico, CostiCollette } from '@/lib/types';

// ---------- AUTH ACTIONS ----------

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get('password') as string;

  if (!password) {
    return { error: 'Inserisci la password, viandante.' };
  }

  const valida = await verificaPassword(password);
  if (!valida) {
    return { error: 'Password errata. Il sentiero ti è precluso.' };
  }

  await creaSessioneAdmin();
  revalidatePath('/admin');
  return null;
}

export async function logoutAction(): Promise<void> {
  await rimuoviSessioneAdmin();
  revalidatePath('/admin');
}

// ---------- HELPER: verifica autenticazione ----------

async function requireAdmin(): Promise<boolean> {
  const autenticato = await isAdmin();
  if (!autenticato) {
    throw new Error('Non autorizzato. Accesso negato.');
  }
  return true;
}

// ---------- COSTI ACTIONS ----------

export async function aggiornaCostiAction(
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const costi: CostiCollette = {
      costoNormali: parseFloat(formData.get('costoNormali') as string) || 0,
      costoFegato: parseFloat(formData.get('costoFegato') as string) || 0,
      costoC2: parseFloat(formData.get('costoC2') as string) || 0,
    };

    await setCosti(costi);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ---------- AMICI ACTIONS ----------

export async function aggiungiAmicoAction(
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const nome = (formData.get('nome') as string)?.trim();
    if (!nome) {
      return { success: false, error: 'Il nome è obbligatorio.' };
    }

    const nuovoAmico: Amico = {
      id: crypto.randomUUID(),
      nome,
      partecipaC1: formData.get('partecipaC1') === 'on',
      partecipaC2: formData.get('partecipaC2') === 'on',
      mangiaFegato: formData.get('mangiaFegato') === 'on',
      pagato: false,
    };

    await kvAggiungiAmico(nuovoAmico);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function rimuoviAmicoAction(id: string): Promise<void> {
  await requireAdmin();
  await kvRimuoviAmico(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function togglePagatoAction(id: string): Promise<void> {
  await requireAdmin();
  await kvTogglePagato(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function impostaFurgoneAction(id: string, attivo: boolean): Promise<void> {
  await requireAdmin();
  await kvImpostaFurgone(id, attivo);
  revalidatePath('/');
  revalidatePath('/admin');
}
