import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderClase from './components/HeaderClase';
import ObjetivosCard from './components/ObjetivosCard';
import ActividadItem from './components/ActividadItem';
import ForoInteractivo from './components/ForoInteractivo';
import DetalleModulo from './components/DetalleModulo';
import './style.css';

export default function App() {
  const [modulos, setModulos] = useState([]);
  const [actividadesNube, setActividadesNube] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState(null);

  // Inicializar estado desde localStorage si existe
  const [modulosDesbloqueados, setModulosDesbloqueados] = useState(() => {
    const guardado = localStorage.getItem('modulosDesbloqueados_delia');
    return guardado ? JSON.parse(guardado) : { "01": true };
  });

  const [progresoActividades, setProgresoActividades] = useState(() => {
    const guardado = localStorage.getItem('progresoActividades_delia');
    return guardado ? JSON.parse(guardado) : {};
  });

  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);

  // Guardar en localStorage cada vez que cambie el progreso o los desbloqueos
  useEffect(() => {
    localStorage.setItem('modulosDesbloqueados_delia', JSON.stringify(modulosDesbloqueados));
  }, [modulosDesbloqueados]);

  useEffect(() => {
    localStorage.setItem('progresoActividades_delia', JSON.stringify(progresoActividades));
  }, [progresoActividades]);

  const desbloquearSiguienteModulo = (numeroActual) => {
    const numeroSiguiente = String(parseInt(numeroActual, 10) + 1).padStart(2, '0');
    setModulosDesbloqueados((prev) => ({
      ...prev,
      [numeroSiguiente]: true
    }));
  };

  const manejarToggleActividadGlobal = (numMod, idxActividad, totalActividadesModulo) => {
    setProgresoActividades(prev => {
      const modActual = prev[numMod] || {};
      const nuevoEstadoMod = {
        ...modActual,
        [idxActividad]: !modActual[idxActividad]
      };

      const completadasCount = Object.values(nuevoEstadoMod).filter(Boolean).length;
      if (completadasCount === totalActividadesModulo) {
        desbloquearSiguienteModulo(numMod);
      }

      return {
        ...prev,
        [numMod]: nuevoEstadoMod
      };
    });
  };

  // Función para reiniciar todo el curso
  const reiniciarCurso = () => {
    if (window.confirm("¿Estás segura de que deseas reiniciar todo el progreso del curso? Se borrarán las actividades marcadas y los módulos desbloqueados.")) {
      localStorage.removeItem('modulosDesbloqueados_delia');
      localStorage.removeItem('progresoActividades_delia');
      setModulosDesbloqueados({ "01": true });
      setProgresoActividades({});
      setModuloSeleccionado(null);
    }
  };

  useEffect(() => {
    async function obtenerDatosDeNube() {
      const URL_MODULOS = import.meta.env.VITE_NOCODB_MODULOS_URL;
      const URL_ACTIVIDADES = import.meta.env.VITE_NOCODB_ACTIVIDADES_URL;
      const API_TOKEN = import.meta.env.VITE_API_TOKEN;

      try {
        const peticiones = [
          fetch(URL_MODULOS, { headers: { 'xc-token': API_TOKEN, 'Content-Type': 'application/json' } })
        ];
        
        if (URL_ACTIVIDADES) {
          peticiones.push(fetch(URL_ACTIVIDADES, { headers: { 'xc-token': API_TOKEN, 'Content-Type': 'application/json' } }));
        }

        const respuestas = await Promise.all(peticiones);
        const datosModulos = await respuestas[0].json();
        setModulos(datosModulos?.records || datosModulos?.list || datosModulos?.rows || []);

        if (respuestas[1] && respuestas[1].ok) {
          const datosActividades = await respuestas[1].json();
          setActividadesNube(datosActividades?.records || datosActividades?.list || datosActividades?.rows || []);
        }

        setErrorServidor(null);
      } catch (error) {
        console.error("Error conectando a NocoDB:", error);
        setErrorServidor('No se pudo establecer conexión completa con las tablas en la nube.');
      } finally {
        setCargando(false);
      }
    }

    obtenerDatosDeNube();
  }, []);

  const informacionDocente = {
    nombre: "Delia Camila López Pío",
    subtitulo: "Docente de Tecnología y Estudiante de Profesorado en Enseñanza Media",
    biografia: "Creo en el poder de la educación y en la capacidad de transformar el futuro. Mi vocación como docente nace del convencimiento de que, con la guía y el acompañamiento correcto, cada estudiante tiene el potencial de alcanzar sus sueños y dejar su propia huella en el entorno digital."
  };

  const competenciaCurso = [
    "Crea artículos y recursos digitales con una intención comunicativa clara, integrando metadatos técnicos y criterios de seguridad en dominios para garantizar la integridad, autoría y visibilidad ética de la información en la Web.",
    "Transicionar de la redacción lineal a una redacción estratégica digital. El estudiante comprende cómo viaja la información en la red, reconoce el funcionamiento de los motores de renderizado, protocolos HTTP/HTTPS, hosting y tipos de dominio para publicar de manera responsable y segura.",
    "Mitigación del déficit de atención, desinformación y vulnerabilidades como el phishing mediante la formación crítica en metadatos y análisis de autoridad en dominios."
  ];

  // FILTRO ESTRICTO Y PRECISO PARA NocoDB
  const obtenerActividadesDelModulo = (targetModuleId, targetNumMod, targetNumCrudo) => {
    if (!Array.isArray(actividadesNube)) return [];
    
    return actividadesNube.filter(act => {
      const camposAct = act?.fields || act || {};
      const modRelacionado = camposAct.modulo || camposAct.Modulos || camposAct.id_modulo || act?.modulo;
      
      if (!modRelacionado) return false;

      if (typeof modRelacionado === 'object') {
        const relId = String(modRelacionado.Id || modRelacionado.id || '');
        const relNum = String(modRelacionado.numero || '').padStart(2, '0');
        return relId === String(targetModuleId) || relNum === String(targetNumMod);
      }

      const strMod = String(modRelacionado).trim();
      const matchId = strMod === String(targetModuleId);
      const matchNumStr = strMod.padStart(2, '0') === String(targetNumMod).padStart(2, '0');

      return matchId || matchNumStr;
    });
  };

  const actividadesDelModuloSeleccionado = moduloSeleccionado 
    ? obtenerActividadesDelModulo(moduloSeleccionado.moduleId, moduloSeleccionado.numMod, moduloSeleccionado.numeroCrudo)
    : [];

  const manejarSiguienteModulo = () => {
    if (!moduloSeleccionado || !Array.isArray(modulos) || modulos.length === 0) return;

    const currentIndex = modulos.findIndex((item, index) => {
      const campos = item?.fields || item || {};
      const numMod = String(campos.numero !== undefined ? campos.numero : (index + 1)).padStart(2, '0');
      return numMod === moduloSeleccionado.numMod;
    });

    if (currentIndex !== -1 && currentIndex + 1 < modulos.length) {
      const siguienteItem = modulos[currentIndex + 1];
      const camposSig = siguienteItem?.fields || siguienteItem || {};
      const numeroCrudoSig = camposSig.numero !== undefined ? camposSig.numero : (currentIndex + 2);
      const numModSig = String(numeroCrudoSig).padStart(2, '0');

      desbloquearSiguienteModulo(moduloSeleccionado.numMod);

      setModuloSeleccionado({
        item: siguienteItem,
        moduleId: siguienteItem?.id || camposSig.Id,
        numMod: numModSig,
        numeroCrudo: numeroCrudoSig
      });
      // (Se eliminó window.scrollTo para evitar que la página brinque o se regrese al inicio)
    }
  };

  const totalModulosCount = modulos.length > 0 ? modulos.length : 1;
  const modulosCompletadosCount = Object.keys(modulosDesbloqueados).length - 1;
  const porcentajeProgreso = Math.min(Math.round((modulosCompletadosCount / totalModulosCount) * 100), 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="barra-menu">
        <ul className="menu-enlaces">
          <li className="enlace"><a href="#sobre-mi">Sobre tu docente</a></li>
          <li className="enlace"><a href="#competencia">Competencia</a></li>
          <li className="enlace"><a href="#bitacora">Bitácora</a></li>
          <li className="enlace"><a href="#foro">Foro</a></li>
        </ul>
      </nav>

      <HeaderClase 
        tituloCurso="Producción de Contenido Digital — Bachillerato en Computación" 
      />

      <main className="contenedor">
        <ObjetivosCard 
          identificador="sobre-mi"
          tituloSeccion={informacionDocente.nombre}
          subtitulo={informacionDocente.subtitulo}
          descripcion={informacionDocente.biografia}
        />

        <ObjetivosCard 
          identificador="competencia"
          tituloSeccion="Competencia del curso"
          puntosClave={competenciaCurso}
        />

        {/* BARRA DE ESTADO DEL PROGRESO GENERAL */}
        <div className="superior" style={{ padding: '20px', marginBottom: '25px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--azul-vibrante)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-chart-line" style={{ color: 'var(--azul-cian)' }}></i> Estado de Progreso de la Bitácora
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--verde-teal)', fontSize: '0.95rem' }}>
                {porcentajeProgreso}% Completado
              </span>
              <button 
                onClick={reiniciarCurso}
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Reiniciar todo el curso"
              >
                <i className="fa-solid fa-rotate-right"></i> Reiniciar Curso
              </button>
            </div>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${porcentajeProgreso}%`, 
                height: '100%', 
                background: 'var(--verde-teal)', 
                transition: 'width 0.4s ease' 
              }}
            ></div>
          </div>
        </div>

        <h1>Bitácora de Módulos Interactivos</h1>

        {cargando && (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--azul-cian)', fontWeight: 'bold' }}>
            <i className="fa-solid fa-spinner fa-spin"></i> Sincronizando datos protegidos desde la nube...
          </p>
        )}

        {errorServidor && (
          <div style={{ padding: '15px', background: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', color: '#b91c1c', margin: '20px 0' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>⚠️ Atención:</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>{errorServidor}</p>
          </div>
        )}

        {moduloSeleccionado ? (
          <div style={{ marginBottom: '30px' }}>
            <DetalleModulo 
              modulo={moduloSeleccionado.item}
              actividades={actividadesDelModuloSeleccionado}
              alVolver={() => setModuloSeleccionado(null)}
              onSiguienteModulo={manejarSiguienteModulo}
              actividadesHechas={progresoActividades}
              onToggleActividad={manejarToggleActividadGlobal}
              numeroModulo={moduloSeleccionado.numMod}
              onReiniciarCurso={reiniciarCurso}
            />
          </div>
        ) : (
          <div className="contenedor-secundario" id="bitacora">
            {!cargando && Array.isArray(modulos) && modulos.length > 0 && modulos.map((item, index) => {
              const campos = item?.fields || item || {};
              
              const numeroCrudo = campos.numero !== undefined ? campos.numero : (index + 1);
              const numMod = String(numeroCrudo).padStart(2, '0');
              
              const nomMod = campos.nombre || campos.Title || campos.title || "Módulo de Estudio";
              const descMod = campos.descripcion || campos.Description || campos.description || "Contenido técnico programado.";
              const analogiaMod = campos.analogia || campos.Analogia || "";
              const moduleId = item?.id || campos.Id;

              const actividadesAsociadas = obtenerActividadesDelModulo(moduleId, numMod, numeroCrudo);
              const totalActs = actividadesAsociadas.length > 0 ? actividadesAsociadas.length : 3;

              const modProgreso = progresoActividades[numMod] || {};
              const completadasCount = Object.values(modProgreso).filter(Boolean).length;
              const estaCompletadoCompletamente = completadasCount === totalActs;

              const estaDesbl = !!modulosDesbloqueados[numMod];

              return (
                <div 
                  key={moduleId || index} 
                  onClick={() => {
                    if (estaDesbl) {
                      setModuloSeleccionado({ item, moduleId, numMod, numeroCrudo });
                      // (Se eliminó window.scrollTo para conservar la posición del usuario)
                    }
                  }}
                  style={{ cursor: estaDesbl ? 'pointer' : 'not-allowed', width: '100%', maxWidth: '480px', flex: '1 1 320px' }}
                >
                  <ActividadItem 
                    numeroModulo={numMod}
                    nombreModulo={nomMod}
                    descripcionModulo={descMod}
                    analogiaModulo={analogiaMod}
                    estaDesbloqueado={estaDesbl}
                    estaCompletadoCompletamente={estaCompletadoCompletamente}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div id="foro">
          <ForoInteractivo />
        </div>
      </main>

      <footer>
        <p>Bitácora de clases - Redacción Digital - Proyecto</p>
        <p>Delia Camila López Pío - 2143225</p>
      </footer>
    </motion.div>
  );
}