import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderClase from './components/HeaderClase';
import ObjetivosCard from './components/ObjetivosCard';
import ActividadItem from './components/ActividadItem';
import ForoInteractivo from './components/ForoInteractivo';
import './style.css';

export default function App() {
  const [modulos, setModulos] = useState([]);
  const [actividadesNube, setActividadesNube] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState(null);

  const [modulosDesbloqueados, setModulosDesbloqueados] = useState({ "01": true });

  const desbloquearSiguienteModulo = (numeroActual) => {
    const numeroSiguiente = String(parseInt(numeroActual, 10) + 1).padStart(2, '0');
    setModulosDesbloqueados((prev) => ({
      ...prev,
      [numeroSiguiente]: true
    }));
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
        setModulos(datosModulos.records || datosModulos.list || datosModulos.rows || []);

        if (respuestas[1] && respuestas[1].ok) {
          const datosActividades = await respuestas[1].json();
          setActividadesNube(datosActividades.records || datosActividades.list || datosActividades.rows || []);
        }

        setErrorServidor(null);
      } catch (error) {
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* BARRA DE MENÚ SIN ICONOS Y CON "SOBRE TU DOCENTE" */}
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

        <div className="contenedor-secundario" id="bitacora">
          {!cargando && modulos && modulos.length > 0 && modulos.map((item, index) => {
            const campos = item.fields || item;
            
            const numeroCrudo = campos.numero !== undefined ? campos.numero : (index + 1);
            const numMod = String(numeroCrudo).padStart(2, '0');
            
            const nomMod = campos.nombre || campos.Title || campos.title || "Módulo de Estudio";
            const descMod = campos.descripcion || campos.Description || campos.description || "Contenido técnico programado.";
            const analogiaMod = campos.analogia || campos.Analogia || "";
            const moduleId = item.id || campos.Id;

            const actividadesAsociadas = actividadesNube
              .map(act => ({ raw: act, campos: act.fields || act }))
              .filter(({ raw, campos: actCampos }) => {
                const modRelacionado = actCampos.modulo || actCampos.Modulos || actCampos.id_modulo || raw.modulo;
                if (!modRelacionado) return false;
                
                const matchId = String(modRelacionado) === String(moduleId);
                const matchNum = String(modRelacionado).padStart(2, '0') === numMod || String(modRelacionado) === String(numeroCrudo);
                const matchObj = typeof modRelacionado === 'object' && (modRelacionado.id === moduleId || modRelacionado.numero === numeroCrudo);

                return matchId || matchNum || matchObj;
              })
              .map(({ campos: actCampos }) => ({
                nombre: actCampos.nombre || actCampos.Nombre || "Actividad",
                descripcion: actCampos.instrucciones || actCampos.Instrucciones || actCampos.descripcion || "Sigue las instrucciones."
              }));

            return (
              <ActividadItem 
                key={moduleId || index}
                numeroModulo={numMod}
                nombreModulo={nomMod}
                descripcionModulo={descMod}
                analogiaModulo={analogiaMod}
                actividades={actividadesAsociadas}
                estaDesbloqueado={!!modulosDesbloqueados[numMod]}
                alCompletarModulo={desbloquearSiguienteModulo}
              />
            );
          })}
        </div>

        {/* CONTENEDOR DEL FORO CON SU ID DE ANCLAJE */}
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