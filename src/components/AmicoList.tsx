'use client';

import { useState } from 'react';
import AmicoCard from './AmicoCard';
import AmicoDrawer from './AmicoDrawer';
import { Amico, QuoteCalcolate } from '@/lib/types';
import styles from './AmicoList.module.css';

interface AmicoConQuote extends Amico {
  quote: QuoteCalcolate;
}

interface AmicoListProps {
  amiciConQuote: AmicoConQuote[];
}

export default function AmicoList({ amiciConQuote }: AmicoListProps) {
  const [selectedAmico, setSelectedAmico] = useState<AmicoConQuote | null>(null);

  return (
    <>
      {/* Lista card semantica e organizzata */}
      <div className={styles.listContainer}>
        {amiciConQuote.map((amico) => (
          <div key={amico.id} className={styles.staggerItem}>
            <AmicoCard
              nome={amico.nome}
              pagato={amico.pagato}
              quote={amico.quote}
              onClick={() => setSelectedAmico(amico)}
            />
          </div>
        ))}
      </div>

      {/* Drawer dettaglio — key forzata per garantire il remount quando cambia utente */}
      {selectedAmico && (
        <AmicoDrawer
          key={selectedAmico.id}
          id={selectedAmico.id}
          nome={selectedAmico.nome}
          quote={selectedAmico.quote}
          pagato={selectedAmico.pagato}
          partecipaC1={selectedAmico.partecipaC1}
          partecipaC2={selectedAmico.partecipaC2}
          mangiaFegato={selectedAmico.mangiaFegato}
          aiutoFurgoneDB={selectedAmico.aiutoFurgone || false}
          isOpen={!!selectedAmico}
          onClose={() => setSelectedAmico(null)}
        />
      )}
    </>
  );
}
