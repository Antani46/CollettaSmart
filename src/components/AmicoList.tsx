'use client';

import { useState } from 'react';
import AmicoCard from './AmicoCard';
import AmicoDrawer from './AmicoDrawer';
import { Amico, QuoteCalcolate } from '@/lib/types';

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
      {/* Lista card */}
      <div className="space-y-2">
        {amiciConQuote.map((amico, index) => (
          <div key={amico.id} className="stagger-item">
            <AmicoCard
              nome={amico.nome}
              pagato={amico.pagato}
              quote={amico.quote}
              onClick={() => setSelectedAmico(amico)}
            />
          </div>
        ))}
      </div>

      {/* Drawer dettaglio */}
      {selectedAmico && (
        <AmicoDrawer
          nome={selectedAmico.nome}
          quote={selectedAmico.quote}
          pagato={selectedAmico.pagato}
          partecipaC1={selectedAmico.partecipaC1}
          partecipaC2={selectedAmico.partecipaC2}
          mangiaFegato={selectedAmico.mangiaFegato}
          isOpen={!!selectedAmico}
          onClose={() => setSelectedAmico(null)}
        />
      )}
    </>
  );
}
