'use client';

import { useEffect, useRef } from 'react';
import { CircleDollarSign } from 'lucide-react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  raccolto: number;
  totale: number;
  pagati: number;
  totaleAmici: number;
  donatoriFurgone?: string[];
}

export default function ProgressBar({ raccolto, totale, pagati, totaleAmici, donatoriFurgone }: ProgressBarProps) {
  const percentuale = totale > 0 ? Math.min((raccolto / totale) * 100, 100) : 0;
  const fillRef = useRef<HTMLDivElement>(null);

  // Aggiornamento DOM chirurgico per la larghezza senza sporcare il markup JSX con style={...}
  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.width = `${percentuale}%`;
    }
  }, [percentuale]);

  return (
    <div className={styles.progressCard}>
      {/* Titolo raccolta */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <CircleDollarSign className={styles.icon} />
          <span className={styles.label}>Raccolta Totale</span>
        </div>
        <span className={styles.countText}>
          {pagati}/{totaleAmici} pagati
        </span>
      </div>

      {/* Importi */}
      <div className={styles.amountsRow}>
        <span className={styles.currentAmount}>
          €{raccolto.toFixed(2)}
        </span>
        <span className={styles.totalAmount}>
          / €{totale.toFixed(2)}
        </span>
      </div>

      {/* Barra progresso totalmente priva di stili inline nel JSX */}
      <div className={styles.track}>
        <div
          ref={fillRef}
          className={`${styles.fill} ${percentuale > 0 ? styles.fillActive : styles.fillEmpty}`}
        />
      </div>

      {/* Percentuale */}
      <p className={styles.percentageText}>
        {percentuale.toFixed(0)}%
      </p>

      {/* Hall of Fame — Eroi del Furgone */}
      {donatoriFurgone && donatoriFurgone.length > 0 && (
        <div className={styles.hallOfFame}>
          <p className={styles.hallOfFameTitle}>
            <span>✨</span> Eroi del Furgone <span>✨</span>
          </p>
          <div className={styles.heroesList}>
            {donatoriFurgone.map((nome, index) => (
              <span key={index} className={styles.heroItem}>
                <span className={styles.heroSparkle}>💖</span>
                {nome}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
