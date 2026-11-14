import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForoInteractivo() {
  const [comentarios, setComentarios] = useState([]);
  const [autor, setAutor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const URL_FORO = import.meta.env.VITE_NOCODB_FORO_URL;
  const API_TOKEN = import.meta.env.VITE_API_TOKEN;

  // 1. READ (Leer comentarios desde NocoDB)
  const cargarForo = async () => {
    if (!URL_FORO) {
      setError("Falta definir VITE_NOCODB_FORO_URL en el archivo .env o en Vercel.");
      setCargando(false);
      return;
    }

    try {
      const respuesta = await fetch(URL_FORO, {
        method: 'GET',
        headers: {
          'xc-token': API_TOKEN,
          'Content-Type': 'application/json'
        }
      });

      if (!respuesta.ok) {
        throw new Error(`Error en el servidor: ${respuesta.status}`);
      }

      const datos = await respuesta.json();
      const registros = datos.records || datos.list || datos.rows || [];
      setComentarios(registros);
      setError(null);
    } catch (err) {
      console.error("Fallo al conectar con NocoDB (Foro):", err);
      setError("No se pudieron cargar los mensajes del foro.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarForo();
  }, []);

  // 2. CREATE (Enviar nuevo mensaje con la fecha y hora exacta DateTime)
  const enviarComentario = async (e) => {
    e.preventDefault();
    if (!autor.trim() || !mensaje.trim() || enviando) return;

    setEnviando(true);

    const fechaHoraExacta = new Date().toISOString();

    const cuerpoCreacion = {
      fields: {
        autor: autor.trim(),
        mensaje: mensaje.trim(),
        fecha: fechaHoraExacta
      }
    };

    try {
      const respuesta = await fetch(URL_FORO, {
        method: 'POST',
        headers: {
          'xc-token': API_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cuerpoCreacion)
      });

      if (!respuesta.ok) {
        const detalleError = await respuesta.text();
        console.error("Error en NocoDB:", detalleError);
        throw new Error("No se pudo guardar el registro.");
      }

      setAutor('');
      setMensaje('');
      await cargarForo();
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      alert("No se pudo enviar el mensaje. Revisa la consola (F12).");
    } finally {
      setEnviando(false);
    }
  };

  // 3. DELETE (Eliminar comentario)
  const eliminarComentario = async (idRegistro) => {
    if (!confirm("¿Deseas eliminar este comentario?")) return;

    try {
      const respuesta = await fetch(URL_FORO, {
        method: 'DELETE',
        headers: {
          'xc-token': API_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Id: idRegistro, id: idRegistro })
      });

      if (!respuesta.ok) {
        await fetch(`${URL_FORO}/${idRegistro}`, {
          method: 'DELETE',
          headers: {
            'xc-token': API_TOKEN,
            'Content-Type': 'application/json'
          }
        });
      }

      await cargarForo();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el registro.");
    }
  };

  return (
    <div className="superior" style={{ marginTop: '40px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
      <h2 style={{ color: 'var(--azul-cian, #1b6ca8)', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
        <i className="fa-solid fa-comments"></i> Foro de Discusión Estudiantil
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
        Comparte tus dudas, hallazgos o debate con tus compañeros sobre los temas de la bitácora digital.
      </p>

      {/* Formulario de envío con icono de FontAwesome en el botón */}
      <form onSubmit={enviarComentario} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
        <input 
          type="text" 
          placeholder="Tu Nombre o Usuario Estudiantil" 
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
          style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
        />
        <textarea 
          placeholder="Escribe tu aportación, duda o comentario constructivo..." 
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
          rows="3"
          style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'vertical' }}
        />
        <motion.button 
          type="submit" 
          disabled={enviando}
          style={{ 
            padding: '10px 20px', 
            background: enviando ? '#94a3b8' : 'var(--azul-cian, #1b6ca8)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            cursor: enviando ? 'not-allowed' : 'pointer', 
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          whileHover={{ scale: enviando ? 1 : 1.02 }}
          whileTap={{ scale: enviando ? 1 : 0.98 }}
        >
          <i className={enviando ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-paper-plane"}></i> 
          {enviando ? 'Publicando...' : 'Publicar en el Foro'}
        </motion.button>
      </form>

      {/* Visualización de datos */}
      <div className="lista-foro" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cargando && (
          <p style={{ color: '#64748b', textAlign: 'center' }}>
            <i className="fa-solid fa-spinner fa-spin"></i> Cargando aportaciones del foro...
          </p>
        )}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        {!cargando && !error && comentarios.length === 0 && (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>Aún no hay comentarios en el foro. ¡Sé el primero en participar!</p>
        )}

        <AnimatePresence>
          {!cargando && comentarios.map((item, index) => {
            const campos = item.fields || item;
            const idItem = campos.Id || campos.id || item.id || index;

            let fechaHoraMostrar = "Reciente";
            if (campos.fecha) {
              try {
                fechaHoraMostrar = new Date(campos.fecha).toLocaleString([], { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                });
              } catch (e) {
                fechaHoraMostrar = "";
              }
            }

            return (
              <motion.div 
                key={idItem}
                style={{ padding: '14px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', position: 'relative' }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: '#0f4c81', fontSize: '1rem' }}>
                    <i className="fa-solid fa-user-circle" style={{ marginRight: '6px' }}></i>
                    {campos.autor || 'Anónimo'}
                  </strong>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>
                      {fechaHoraMostrar}
                    </span>

                    {/* Botón Eliminar con icono de FontAwesome */}
                    <button 
                      onClick={() => eliminarComentario(idItem)}
                      style={{ background: 'transparent', border: 'none', color: '#1b1f3a', cursor: 'pointer', fontSize: '0.9rem' }}
                      title="Eliminar mensaje"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: '1.4' }}>{campos.mensaje}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}