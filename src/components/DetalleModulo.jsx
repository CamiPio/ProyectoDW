import React from 'react';
import { motion } from 'framer-motion';
import RecursosModulo from './RecursosModulo';

export default function DetalleModulo({ 
  modulo, 
  actividades = [], 
  alVolver, 
  onSiguienteModulo, 
  actividadesHechas = {},
  onToggleActividad,
  numeroModulo,
  onReiniciarCurso
}) {
  const camposModulo = modulo.fields || modulo;
  const numMod = String(camposModulo.numero || numeroModulo || "01").padStart(2, '0');
  const nomMod = camposModulo.nombre || "Módulo de Estudio";
  const descMod = camposModulo.descripcion || "Contenido técnico programado.";
  const analogiaMod = camposModulo.analogia || "";

  const listaActividadesAMostrar = actividades.length > 0 ? actividades : [
    {
      nombre: "Activación de Presaberes: Lectura y Pirámide Invertida",
      instrucciones: "Se divide a los estudiantes en parejas. A la mitad se le entrega un artículo convencional y al resto maquetado con la técnica de Pirámide Invertida.",
      recurso_url: "#",
      recurso_nombre: "Artículo digital y Video Guía"
    },
    {
      nombre: "Construcción del Aprendizaje: Inspección y Consola F12",
      instrucciones: "Explicación del funcionamiento de internet y servidores mediante presentación. Uso de la consola de desarrollador (F12).",
      recurso_url: "https://concepto.de",
      recurso_nombre: "Sitio web de análisis (concepto.de)"
    },
    {
      nombre: "Consolidación del Aprendizaje: Optimización HTML en IDE",
      instrucciones: "Uso de Visual Studio Code para editar una página HTML, aplicando la técnica de pirámide invertida y etiquetas semánticas.",
      recurso_url: "https://view.genial.ly",
      recurso_nombre: "OVA Genially: HTML Elementos básicos"
    }
  ];

  const estadoModActual = actividadesHechas[numMod] || {};

  const todasCompletadas = listaActividadesAMostrar.length > 0 && 
    listaActividadesAMostrar.every((_, idx) => estadoModActual[idx] === true);

  const recursosExtraidos = [];
  listaActividadesAMostrar.forEach((act, idx) => {
    const camposAct = act.fields || act;
    const url = camposAct.recurso_url || camposAct.recursoUrl || camposAct.enlace || camposAct.url || camposAct.RecursoUrl;
    const nombreAct = camposAct.nombre || camposAct.Nombre || `Actividad ${idx + 1}`;
    const nombreRec = camposAct.recurso_nombre || camposAct.nombreRecurso || camposAct.recursoNombre || camposAct.nombre || "Material de apoyo";

    if (url && url.trim() !== "" && url !== "#") {
      recursosExtraidos.push({
        nombreActividad: nombreAct,
        nombreRecurso: nombreRec,
        url: url
      });
    }
  });

  return (
    <motion.div 
      className="superior"
      style={{ background: '#ffffff', border: '2px solid var(--azul-cian)', borderRadius: '16px', padding: '30px' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button 
          onClick={alVolver}
          style={{
            background: 'var(--azul-oscuro, #1F2937)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Volver a la Bitácora
        </button>

        {/* Botón para reiniciar el curso */}
        {onReiniciarCurso && (
          <button 
            onClick={onReiniciarCurso}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
            title="Reiniciar todo el progreso del curso"
          >
            <i className="fa-solid fa-rotate-right"></i> Reiniciar Curso
          </button>
        )}
      </div>

      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--azul-cian)', textTransform: 'uppercase' }}>
        Módulo {numMod}
      </span>
      <h2 style={{ color: 'var(--azul-vibrante, #072B8E)', fontSize: '1.8rem', margin: '8px 0 15px 0' }}>
        {nomMod}
      </h2>
      
      <p style={{ color: 'var(--texto-suave)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '20px' }}>
        {descMod}
      </p>

      {analogiaMod && (
        <div style={{ padding: '15px', background: 'rgba(8, 145, 178, 0.08)', borderLeft: '4px solid var(--azul-cian)', borderRadius: '6px', marginBottom: '25px' }}>
          <strong><i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', marginRight: '6px' }}></i> Analogía Cotidiana:</strong> {analogiaMod}
        </div>
      )}

      <h3 style={{ color: 'var(--texto-oscuro)', fontSize: '1.2rem', marginBottom: '15px', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>
        <i className="fa-solid fa-list-check" style={{ marginRight: '8px' }}></i> Secuencia de Actividades y Fases de Aprendizaje
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
        {listaActividadesAMostrar.map((act, idx) => {
          const camposAct = act.fields || act;
          const estaHecha = !!estadoModActual[idx];

          return (
            <div 
              key={idx} 
              onClick={() => onToggleActividad(numMod, idx, listaActividadesAMostrar.length)}
              style={{ 
                background: estaHecha ? 'rgba(13, 148, 136, 0.08)' : '#F8FAFC', 
                padding: '16px', 
                borderRadius: '10px', 
                border: `1px solid ${estaHecha ? 'var(--verde-teal, #0D9488)' : '#E2E8F0'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  checked={estaHecha} 
                  onChange={() => onToggleActividad(numMod, idx, listaActividadesAMostrar.length)}
                  style={{ marginTop: '4px', cursor: 'pointer', accentColor: 'var(--verde-teal)' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'var(--azul-vibrante)', fontSize: '1rem', marginBottom: '6px', textDecoration: estaHecha ? 'line-through' : 'none' }}>
                    {idx + 1}. {camposAct.nombre || camposAct.Nombre || "Actividad"}
                  </h4>
                  <p style={{ color: 'var(--texto-suave)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5', textDecoration: estaHecha ? 'line-through' : 'none', opacity: estaHecha ? 0.8 : 1 }}>
                    {camposAct.instrucciones || camposAct.Instrucciones || camposAct.descripcion || "Sigue las instrucciones correspondientes."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {todasCompletadas && onSiguienteModulo && (
        <motion.div 
          style={{ marginBottom: '25px', display: 'flex', justifyContent: 'flex-end' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={onSiguienteModulo}
            style={{
              background: 'var(--verde-teal, #0D9488)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 22px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}
          >
            Siguiente Módulo <i className="fa-solid fa-arrow-right"></i>
          </button>
        </motion.div>
      )}

      <RecursosModulo recursos={recursosExtraidos} />
    </motion.div>
  );
}