'use client';

import { ChevronRight } from 'lucide-react';
import { Amico, CostiCollette } from '@/lib/types';
import { calcolaQuoteAmico } from '@/lib/calcoli';
import styles from './AmicoCard.module.css';

interface AmicoCardProps {
  amico: Amico;
  costi: CostiCollette;
  tuttiAmici: Amico[];
  onClick: () => void;
}

export default function AmicoCard({ amico, costi, tuttiAmici, onClick }: AmicoCardProps) {
  // Calcolo in tempo reale della quota (Single Source of Truth)
  const quote = calcolaQuoteAmico(amico, costi, tuttiAmici);
  return (
    <button onClick={onClick} className={styles.userCard}>
      {/* Avatar / Iniziale */}
      <div className={`${styles.avatar} ${amico.pagato ? styles.avatarPaid : styles.avatarUnpaid}`}>
        {amico.nome.charAt(0).toUpperCase()}
      </div>

      {/* Info Utente */}
      <div className={styles.userInfo}>
        <p className={styles.userName}>{amico.nome}</p>
        <p className={styles.userStatus}>
          {amico.pagato ? (
            <span className={styles.statusPaid}>✓ Pagato</span>
          ) : (
            <span className={styles.statusAmount}>€{quote.totaleAmico.toFixed(2)}</span>
          )}
        </p>
      </div>

      {/* Chevron Icon */}
      <ChevronRight className={styles.chevron} />
    </button>
  );
}
