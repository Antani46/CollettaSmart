'use client';

import { useEffect, useRef } from 'react';
import { CircleDollarSign } from 'lucide-react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  raccolto: number;
  totale: number;
  raccoltoPrincipale: number;
  raccoltoFurgone: number;
  pagati: number;
  totaleAmici: number;
  donatoriFurgone?: string[];
}

const TARGET_FURGONE = 240;

export default function ProgressBar({
  raccolto,
  totale,
  raccoltoPrincipale,
  raccoltoFurgone,
  pagati,
  totaleAmici,
  donatoriFurgone,
}: ProgressBarProps) {
  // Barra principale: usa il totale puro passato dal backend (che ora è solo la somma degli scontrini)
  const totalePrincipale = totale;
  const percentuale = totalePrincipale > 0
    ? Math.min((raccoltoPrincipale / totalePrincipale) * 100, 100)
    : 0;

  // Barra furgone: target fisso €200
  const percentualeFurgone = Math.min((raccoltoFurgone / TARGET_FURGONE) * 100, 100);

  const fillRef = useRef<HTMLDivElement>(null);
  const fillFurgoneRef = useRef<HTMLDivElement>(null);

  // Aggiornamento DOM chirurgico per la larghezza senza sporcare il markup JSX con style={...}
  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.width = `${percentuale}%`;
    }
  }, [percentuale]);

  useEffect(() => {
    if (fillFurgoneRef.current) {
      fillFurgoneRef.current.style.width = `${percentualeFurgone}%`;
    }
  }, [percentualeFurgone]);

  return (
    <div className={styles.progressCard}>
      {/* ===== BARRA PRINCIPALE (cibo/evento) ===== */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <CircleDollarSign className={styles.icon} />
          <span className={styles.label}>Raccolta Totale</span>
        </div>
        <span className={styles.countText}>
          {pagati}/{totaleAmici} pagati
        </span>
      </div>

      {/* Importi principali (escluso furgone) */}
      <div className={styles.amountsRow}>
        <span className={styles.currentAmount}>
          €{raccoltoPrincipale.toFixed(2)}
        </span>
        <span className={styles.totalAmount}>
          / €{totalePrincipale > 0 ? totalePrincipale.toFixed(2) : totale.toFixed(2)}
        </span>
      </div>

      {/* Barra progresso principale — priva di stili inline nel JSX */}
      <div className={styles.track}>
        <div
          ref={fillRef}
          className={`${styles.fill} ${percentuale > 0 ? styles.fillActive : styles.fillEmpty}`}
        />
      </div>

      {/* Percentuale principale */}
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

          {/* ===== BARRA FURGONE ===== */}
          <div className={styles.furgoneBar}>
            <div className={styles.furgoneHeaderRow}>
              <span className={styles.furgoneLabel}>🚐 Obiettivo Noleggio Furgone</span>
              <span className={styles.furgoneCountText}>
                €{raccoltoFurgone.toFixed(2)} / €{TARGET_FURGONE}
              </span>
            </div>

            <div className={styles.furgoneTrack}>
              <div
                ref={fillFurgoneRef}
                className={`${styles.furguneFill} ${percentualeFurgone > 0 ? styles.furguneFillActive : ''}`}
              />
            </div>

            <p className={styles.furgonePercentage}>
              {percentualeFurgone.toFixed(0)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
