'use client';

import { useState } from 'react';
import AmicoCard from './AmicoCard';
import AmicoDrawer from './AmicoDrawer';
import { Amico, CostiCollette } from '@/lib/types';
import styles from './AmicoList.module.css';

interface AmicoListProps {
  amici: Amico[];
  costi: CostiCollette;
}

export default function AmicoList({ amici, costi }: AmicoListProps) {
  const [selectedAmico, setSelectedAmico] = useState<Amico | null>(null);

  // Ordinamento: non pagati in cima, poi pagati. Dentro ogni gruppo, A→Z.
  const amiciOrdinati = [...amici].sort((a, b) => {
    if (a.pagato !== b.pagato) return a.pagato ? 1 : -1;
    return a.nome.localeCompare(b.nome);
  });

  return (
    <>
      {/* Lista card semantica e organizzata */}
      <div className={styles.listContainer}>
        {amiciOrdinati.map((amico) => (
          <div key={amico.id} className={styles.staggerItem}>
            <AmicoCard
              amico={amico}
              costi={costi}
              tuttiAmici={amici}
              onClick={() => setSelectedAmico(amico)}
            />
          </div>
        ))}
      </div>

      {/* Drawer dettaglio — key forzata per garantire il remount quando cambia utente */}
      {selectedAmico && (
        <AmicoDrawer
          key={selectedAmico.id}
          amico={selectedAmico}
          costi={costi}
          tuttiAmici={amici}
          isOpen={!!selectedAmico}
          onClose={() => setSelectedAmico(null)}
        />
      )}
    </>
  );
}
