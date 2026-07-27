'use client';

import { ChevronRight } from 'lucide-react';
import { QuoteCalcolate } from '@/lib/types';
import styles from './AmicoCard.module.css';

interface AmicoCardProps {
  nome: string;
  pagato: boolean;
  quote: QuoteCalcolate;
  onClick: () => void;
}

export default function AmicoCard({ nome, pagato, quote, onClick }: AmicoCardProps) {
  return (
    <button onClick={onClick} className={styles.userCard}>
      {/* Avatar / Iniziale */}
      <div className={`${styles.avatar} ${pagato ? styles.avatarPaid : styles.avatarUnpaid}`}>
        {nome.charAt(0).toUpperCase()}
      </div>

      {/* Info Utente */}
      <div className={styles.userInfo}>
        <p className={styles.userName}>{nome}</p>
        <p className={styles.userStatus}>
          {pagato ? (
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
