import React from 'react';
import { motion } from 'framer-motion';

export default function ActividadItem({ 
  numeroModulo, 
  nombreModulo, 
  descripcionModulo, 
  analogiaModulo, 
  estaDesbloqueado, 
  estaCompletadoCompletamente 
}) {
  return (
    <motion.section 
      className={`modulo ${!estaDesbloqueado ? 'modulo-bloqueado' : ''} ${estaCompletadoCompletamente ? 'modulo-completado' : ''}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: estaDesbloqueado ? -4 : 0, transition: { duration: 0.2 } }}
    >
      <div className="num-modulo">
        <div className="num">
          <p>módulo</p>
          <p className="numero">{numeroModulo}</p>
        </div>
        <div className="bloque-titulo-modulo">
          <h2 className="name-modulo">{nombreModulo}</h2>
          <span className="insignia-bloqueo">
            {!estaDesbloqueado ? (
              <><i className="fa-solid fa-lock"></i> Bloqueado</>
            ) : estaCompletadoCompletamente ? (
              <><i className="fa-solid fa-circle-check"></i> Módulo Completado</>
            ) : (
              <><i className="fa-solid fa-lock-open"></i> En Progreso (Haz clic para ingresar)</>
            )}
          </span>
        </div>
      </div>

      <article>
        {descripcionModulo}
      </article>

      {analogiaModulodetalle => analogiaModulo && (
        <div style={{ 
          marginTop: '12px', 
          padding: '12px 15px', 
          background: 'rgba(15, 76, 129, 0.05)', 
          borderLeft: '4px solid var(--azul-cian, #1b6ca8)', 
          borderRadius: '4px',
          fontSize: '0.92rem',
          color: '#334155'
        }}>
          <strong><i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', marginRight: '6px' }}></i> Analogía Cotidiana:</strong> {analogiaModulo}
        </div>
      )}
    </motion.section>
  );
}