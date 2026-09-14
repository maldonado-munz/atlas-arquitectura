/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { MapViewer } from './components/MapViewer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectsListDrawer } from './components/ProjectsListDrawer';
import { PROYECTOS_ARQUITECTURA } from './data/proyectos';
import { ProyectoArquitectura, FiltrosState, Idioma } from './types';

const FILTROS_INICIALES: FiltrosState = {
  busqueda: '',
  estilosSeleccionados: [],
  programasSeleccionados: [],
  arquitectoSeleccionado: '',
  paisSeleccionado: '',
  decadaSeleccionada: 'all',
  soloPritzker: false,
};

export default function App() {
  const [idioma, setIdioma] = useState<Idioma>(() => {
    try {
      const guardado = localStorage.getItem('atlas_idioma');
      return guardado === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  });

  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES);
  const [mostrarFiltros, setMostrarFiltros] = useState<boolean>(true);
  const [mostrarLista, setMostrarLista] = useState<boolean>(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] =
    useState<ProyectoArquitectura | null>(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState<boolean>(false);

  const handleCambiarIdioma = (nuevo: Idioma) => {
    setIdioma(nuevo);
    try {
      localStorage.setItem('atlas_idioma', nuevo);
    } catch {
      // Ignorar si localStorage no está disponible
    }
  };

  // Filtered projects computation
  const proyectosFiltrados = useMemo(() => {
    return PROYECTOS_ARQUITECTURA.filter((p) => {
      // Búsqueda por texto
      if (filtros.busqueda.trim() !== '') {
        const query = filtros.busqueda.toLowerCase();
        const coincideNombre = p.nombre_proyecto.toLowerCase().includes(query);
        const coincideArquitecto = p.arquitecto.toLowerCase().includes(query);
        const coincidePrincipal = (p.arquitecto_principal || '')
          .toLowerCase()
          .includes(query);
        const coincideCiudad = p.ciudad.toLowerCase().includes(query);
        const coincidePais = p.pais.toLowerCase().includes(query);
        const coincideEstilo = p.estilos.some((e) =>
          e.toLowerCase().includes(query)
        );
        const coincidePrograma = (p.programas || p.programa || []).some((prog) =>
          prog.toLowerCase().includes(query)
        );

        if (
          !coincideNombre &&
          !coincideArquitecto &&
          !coincidePrincipal &&
          !coincideCiudad &&
          !coincidePais &&
          !coincideEstilo &&
          !coincidePrograma
        ) {
          return false;
        }
      }

      // Filtro por estilos (selección múltiple: debe coincidir con alguno de los seleccionados)
      if (filtros.estilosSeleccionados.length > 0) {
        const coincideConAlgunEstilo = filtros.estilosSeleccionados.some((estilo) =>
          p.estilos.includes(estilo)
        );
        if (!coincideConAlgunEstilo) return false;
      }

      // Filtro por programa (selección múltiple: debe coincidir con alguno de los seleccionados)
      if (filtros.programasSeleccionados.length > 0) {
        const coincideConAlgunPrograma = filtros.programasSeleccionados.some(
          (prog) => (p.programas || p.programa || []).includes(prog)
        );
        if (!coincideConAlgunPrograma) return false;
      }

      // Filtro por arquitecto (usando el arquitecto principal o nombre completo)
      if (filtros.arquitectoSeleccionado) {
        const coincideArqPrincipal =
          p.arquitecto_principal === filtros.arquitectoSeleccionado;
        const coincideNombreCompleto =
          p.arquitecto === filtros.arquitectoSeleccionado ||
          p.arquitecto.includes(filtros.arquitectoSeleccionado);
        if (!coincideArqPrincipal && !coincideNombreCompleto) {
          return false;
        }
      }

      // Filtro por país
      if (filtros.paisSeleccionado && p.pais !== filtros.paisSeleccionado) {
        return false;
      }

      // Filtro solo Pritzker
      if (filtros.soloPritzker && p.ano_pritzker === null) {
        return false;
      }

      // Filtro por década (basado en año de inauguración)
      if (filtros.decadaSeleccionada !== 'all') {
        const anio = parseInt(p.ano_inauguracion, 10);
        const decada = parseInt(filtros.decadaSeleccionada, 10);
        if (decada === 2010) {
          if (isNaN(anio) || anio < 2010) return false;
        } else if (isNaN(anio) || anio < decada || anio >= decada + 10) {
          return false;
        }
      }

      return true;
    });
  }, [filtros]);

  // Index of selected project in current filtered set
  const indiceSeleccionado = useMemo(() => {
    if (!proyectoSeleccionado) return -1;
    return proyectosFiltrados.findIndex((p) => p.id === proyectoSeleccionado.id);
  }, [proyectoSeleccionado, proyectosFiltrados]);

  // Handlers for project navigation
  const navegarAnterior = useCallback(() => {
    if (proyectosFiltrados.length === 0) return;
    if (indiceSeleccionado <= 0) {
      setProyectoSeleccionado(
        proyectosFiltrados[proyectosFiltrados.length - 1]
      );
    } else {
      setProyectoSeleccionado(proyectosFiltrados[indiceSeleccionado - 1]);
    }
  }, [proyectosFiltrados, indiceSeleccionado]);

  const navegarSiguiente = useCallback(() => {
    if (proyectosFiltrados.length === 0) return;
    if (
      indiceSeleccionado === -1 ||
      indiceSeleccionado >= proyectosFiltrados.length - 1
    ) {
      setProyectoSeleccionado(proyectosFiltrados[0]);
    } else {
      setProyectoSeleccionado(proyectosFiltrados[indiceSeleccionado + 1]);
    }
  }, [proyectosFiltrados, indiceSeleccionado]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (proyectoSeleccionado) {
          setProyectoSeleccionado(null);
        } else if (mostrarLista) {
          setMostrarLista(false);
        }
      } else if (proyectoSeleccionado) {
        if (e.key === 'ArrowLeft') {
          navegarAnterior();
        } else if (e.key === 'ArrowRight') {
          navegarSiguiente();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    proyectoSeleccionado,
    mostrarLista,
    navegarAnterior,
    navegarSiguiente,
  ]);

  const handleActualizarFiltros = (nuevos: Partial<FiltrosState>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
  };

  const handleResetFiltros = () => {
    setFiltros(FILTROS_INICIALES);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAFAFA] text-[#111111]">
      {/* Top Header */}
      <Header
        totalProyectos={PROYECTOS_ARQUITECTURA.length}
        proyectosFiltrados={proyectosFiltrados.length}
        mostrarFiltros={mostrarFiltros}
        onToggleFiltros={() => setMostrarFiltros((prev) => !prev)}
        mostrarLista={mostrarLista}
        onToggleLista={() => setMostrarLista((prev) => !prev)}
        idioma={idioma}
        onCambiarIdioma={handleCambiarIdioma}
      />

      {/* Multi-criteria Filters Panel */}
      {mostrarFiltros && (
        <FiltersBar
          filtros={filtros}
          idioma={idioma}
          onActualizarFiltros={handleActualizarFiltros}
          onResetFiltros={handleResetFiltros}
          totalFiltrados={proyectosFiltrados.length}
        />
      )}

      {/* Main Map Canvas Area */}
      <main className="flex-1 relative overflow-hidden">
        <MapViewer
          proyectos={proyectosFiltrados}
          proyectoSeleccionado={proyectoSeleccionado}
          onSeleccionarProyecto={(p) => setProyectoSeleccionado(p)}
          onAbrirModalCompleto={(p) => {
            setProyectoSeleccionado(p);
            setModalDetalleAbierto(true);
          }}
          onAnterior={navegarAnterior}
          onSiguiente={navegarSiguiente}
          tieneAnterior={proyectosFiltrados.length > 1}
          tieneSiguiente={proyectosFiltrados.length > 1}
          idioma={idioma}
        />

        {/* Side Drawer with Catalogue of Projects */}
        <ProjectsListDrawer
          proyectos={proyectosFiltrados}
          proyectoSeleccionado={proyectoSeleccionado}
          onSeleccionarProyecto={(p) => setProyectoSeleccionado(p)}
          onAbrirDetalle={(p) => {
            setProyectoSeleccionado(p);
            setModalDetalleAbierto(true);
          }}
          abierto={mostrarLista}
          onCerrar={() => setMostrarLista(false)}
          idioma={idioma}
        />
      </main>

      {/* Project Detail Modal */}
      {modalDetalleAbierto && proyectoSeleccionado && (
        <ProjectDetailModal
          proyecto={proyectoSeleccionado}
          idioma={idioma}
          onCerrar={() => setModalDetalleAbierto(false)}
          onAnterior={navegarAnterior}
          onSiguiente={navegarSiguiente}
          tieneAnterior={proyectosFiltrados.length > 1}
          tieneSiguiente={proyectosFiltrados.length > 1}
        />
      )}
    </div>
  );
}
