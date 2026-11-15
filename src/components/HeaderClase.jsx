import React from 'react';
import { motion } from 'framer-motion';

export default function HeaderClase({ tituloCurso }) {
  return (
    <motion.header 
      className="header-clase"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: '#ffffff',
        padding: '40px 20px',
        borderBottom: '2px solid #E2E8F0',
        marginBottom: '30px'
      }}
    >
      <div className="contenedor" style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Subtítulo / Recurso didáctico */}
        <h3 style={{ 
          color: 'var(--azul-cian, #1B6CA8)', 
          fontSize: '1.2rem', 
          fontWeight: '600', 
          marginBottom: '15px' 
        }}>
          Recurso didáctico para Bachillerato en Computación
        </h3>

        {/* Descripción institucional */}
        <p style={{ 
          color: 'var(--texto-suave, #475569)', 
          fontSize: '1.05rem', 
          lineHeight: '1.6', 
          maxWidth: '900px',
          margin: 0 
        }}>
          Este plan acompaña a estudiantes de nivel medio a producir contenidos digitales claros, accesibles y responsables. A través de nueve módulos, se exploran la estructura de la Web, los dominios, los metadatos, la seguridad, la autoría, la redacción y la verificación de información.
        </p>

        {tituloCurso && (
          <div style={{ marginTop: '20px', display: 'inline-block', background: '#F1F5F9', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', color: '#334155', fontWeight: 'bold' }}>
            {tituloCurso}
          </div>
        )}
      </div>
    </motion.header>
  );
}