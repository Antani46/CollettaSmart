'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CreditCard, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuoteCalcolate } from '@/lib/types';
import styles from './AmicoDrawer.module.css';

interface AmicoDrawerProps {
  id: string;
  nome: string;
  quote: QuoteCalcolate;
  pagato: boolean;
  partecipaC1: boolean;
  partecipaC2: boolean;
  mangiaFegato: boolean;
  aiutoFurgoneDB: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function AmicoDrawer({
  id,
  nome,
  quote,
  pagato,
  partecipaC1,
  partecipaC2,
  mangiaFegato,
  aiutoFurgoneDB,
  isOpen,
  onClose,
}: AmicoDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [payingWith, setPayingWith] = useState<'revolut' | 'paypal' | null>(null);

  // Se l'utente ha GIÀ pagato con furgone (confermato nel DB), il toggle è fisso.
  // Se NON ha pagato, parte da false: la scelta è volontaria al momento del pagamento.
  const [aiutoFurgone, setAiutoFurgone] = useState(
    pagato ? aiutoFurgoneDB : false
  );

  // ===== SINGLE SOURCE OF TRUTH =====
  // quote.totaleAmico è la base PURA (cibo/evento, SENZA furgone).
  // Il totale visualizzato aggiunge +10 SOLO se il toggle locale è attivo.
  const totaleFinale = aiutoFurgone
    ? quote.totaleAmico + 10
    : quote.totaleAmico;

  // Deep link URLs con totaleFinale pre-compilato
  const revolutUrl = `https://revolut.me/${process.env.NEXT_PUBLIC_REVOLUT_USERNAME || ''}`;
  const paypalUrl = `https://paypal.me/${process.env.NEXT_PUBLIC_PAYPAL_USERNAME || 'USERNAME'}/${totaleFinale.toFixed(2)}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset completo dello stato locale quando cambia l'utente visualizzato
  useEffect(() => {
    setAiutoFurgone(pagato ? aiutoFurgoneDB : false);
    setPayingWith(null);
  }, [id, pagato, aiutoFurgoneDB]);

  // Gestione animazione di apertura
  useEffect(() => {
    if (isOpen && mounted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 15);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, mounted]);

  // Gestione rigorosa del Body Scroll (Scroll Lock con cleanup garantito)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Gestione pagamento con animazione "Heart Burst" condizionale
  const handlePayment = (url: string, method: 'revolut' | 'paypal') => {
    if (payingWith !== null) return;

    // SE aiutoFurgone è false: Nessuna animazione, redirect immediato
    // Su Mobile Safari, window.location.href è molto più sicuro per i gateway di pagamento
    if (!aiutoFurgone) {
      window.location.href = url;
      return;
    }

    // SE aiutoFurgone è true: Attiva l'animazione di ringraziamento
    setPayingWith(method);

    const scalar = 2;
    const heart = confetti.shapeFromText({ text: '❤️', scalar });

    confetti({
      shapes: [heart],
      scalar,
      particleCount: 35,
      spread: 80,
      origin: { y: 0.7 },
    });

    setTimeout(() => {
      confetti({
        shapes: [heart],
        scalar,
        particleCount: 25,
        spread: 110,
        origin: { y: 0.65 },
      });
    }, 250);

    setTimeout(() => {
      setPayingWith(null);
      // Su Safari, i pop-up scatenati dentro un setTimeout vengono brutalmente bloccati.
      // Il cambio di location (window.location.href) è invece sempre permesso ed
      // è perfetto per scatenare i deep link (es. app Revolut/PayPal).
      window.location.href = url;
    }, 1600);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      {/* Overlay / Backdrop fisso */}
      <div
        className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />

      {/* Contenitore Bottom Sheet fisso al Viewport */}
      <div
        className={`${styles.bottomSheetContainer} ${isVisible ? styles.sheetVisible : ''}`}
      >
        {/* Maniglia / Pill */}
        <div className={styles.handleWrapper}>
          <div className={styles.handle} />
        </div>

        {/* Contenuto scorrevole interno */}
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>{nome}</h2>
              <span
                className={`${styles.badge} ${
                  pagato ? styles.badgePaid : styles.badgeUnpaid
                }`}
              >
                {pagato ? '✓ Pagato' : '✗ Non pagato'}
              </span>
            </div>
            <button onClick={onClose} className={styles.closeButton} aria-label="Chiudi modale">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Dettaglio Quote */}
          <div>
            <h3 className={styles.sectionTitle}>Dettaglio Quote</h3>

            {partecipaC1 && (
              <div className={styles.quoteBox}>
                <p className={styles.quoteHeader}>🍖 Colletta Martedì</p>
                <div className={styles.quoteRow}>
                  <span className={styles.quoteLabel}>Quota Normali</span>
                  <span className={styles.quoteValue}>€{quote.quotaNormali.toFixed(2)}</span>
                </div>
                {mangiaFegato && (
                  <div className={styles.quoteRowBorder}>
                    <span className={styles.quoteLabel}>Quota Fegato</span>
                    <span className={styles.quoteValue}>€{quote.quotaFegato.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {partecipaC2 && (
              <div className={styles.quoteBox}>
                <p className={styles.quoteHeader}>🛍️ Colletta Venerdì</p>
                <div className={styles.quoteRow}>
                  <span className={styles.quoteLabel}>Quota</span>
                  <span className={styles.quoteValue}>€{quote.quotaC2.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Riga Furgone nel riepilogo (visibile solo quando la spunta è attiva) */}
            {aiutoFurgone && (
              <div className={styles.quoteBox}>
                <p className={styles.quoteHeader}>🚐 Supporto Logistico</p>
                <div className={styles.quoteRow}>
                  <span className={styles.quoteLabel}>Contributo Furgone</span>
                  <span className={styles.quoteValue}>€10.00</span>
                </div>
              </div>
            )}

            {/* UI del Toggle Volontario — SOLO per chi NON ha ancora pagato */}
            {!pagato && (
              <label className="flex items-center justify-between p-3.5 bg-celtic-forest/80 border border-celtic-gold/40 rounded-xl cursor-pointer hover:bg-celtic-forest transition-all mb-4 shadow-sm group">
                <span className="text-celtic-parchment text-sm font-medium group-hover:text-celtic-gold transition-colors pr-3">
                  Vuoi contribuire con 10€ per il noleggio del furgone? 🚐
                </span>
                <div className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={aiutoFurgone}
                    onChange={(e) => setAiutoFurgone(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-celtic-dark/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-celtic-parchment after:border-celtic-moss after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-celtic-gold peer-checked:after:bg-celtic-dark"></div>
                </div>
              </label>
            )}

            {/* Totale da pagare (dinamico, SSOT) */}
            <div className={styles.totalBox}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Totale da pagare</span>
                <span className={styles.totalValue}>€{totaleFinale.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Pulsanti Pagamento */}
          {!pagato && totaleFinale > 0 && (
            <div className={styles.buttonsContainer}>
              <h3 className={styles.sectionTitle}>Paga con</h3>

              <button
                type="button"
                onClick={() => handlePayment(revolutUrl, 'revolut')}
                disabled={payingWith !== null}
                className={`${styles.btnRevolut} ${payingWith === 'revolut' ? 'animate-pulse scale-[1.02]' : ''}`}
              >
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                <span>
                  {payingWith === 'revolut' ? '💖 Apertura in corso...' : 'Paga con Carta'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePayment(paypalUrl, 'paypal')}
                disabled={payingWith !== null}
                className={`${styles.btnPaypal} ${payingWith === 'paypal' ? 'animate-pulse scale-[1.02]' : ''}`}
              >
                <Banknote className="w-5 h-5 flex-shrink-0" />
                <span>
                  {payingWith === 'paypal' ? '💖 Apertura in corso...' : 'Paga con PayPal'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
