import React from 'react';
import { motion } from 'framer-motion';

export default function RecursosModulo({ recursos = [] }) {
  return (
    <div style={{ marginTop: '25px', borderTop: '2px solid #E2E8F0', paddingTop: '20px' }}>
      <h3 style={{ color: 'var(--texto-oscuro, #0F172A)', fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fa-solid fa-folder-open" style={{ color: 'var(--azul-cian)' }}></i> Recursos y Enlaces del Módulo
      </h3>

      {(!recursos || recursos.length === 0) ? (
        <div style={{ padding: '12px', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', textAlign: 'center', color: '#64748B', fontStyle: 'italic', fontSize: '0.9rem' }}>
          No hay enlaces o recursos disponibles para este módulo.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {recursos.map((rec, idx) => (
            <a 
              key={idx}
              href={rec.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                background: '#ffffff',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
                maxWidth: '100%'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--azul-cian)', textTransform: 'uppercase' }}>
                  {rec.nombreActividad}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--azul-vibrante)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {rec.nombreRecurso}
                </span>
              </div>
              <i className="fa-solid fa-external-link-alt" style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: 'auto' }}></i>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}