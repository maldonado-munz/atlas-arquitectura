import React from 'react';
import { X, MapPin, ArrowRight } from 'lucide-react';
import { ProyectoArquitectura, Idioma } from '../types';
import { I18N_TEXTS, traducirEstilo, traducirPrograma } from '../i18n';

interface ProjectsListDrawerProps {
  proyectos: ProyectoArquitectura[];
  proyectoSeleccionado: ProyectoArquitectura | null;
  onSeleccionarProyecto: (proyecto: ProyectoArquitectura) => void;
  onAbrirDetalle?: (proyecto: ProyectoArquitectura) => void;
  abierto: boolean;
  onCerrar: () => void;
  idioma: Idioma;
}

export const ProjectsListDrawer: React.FC<ProjectsListDrawerProps> = ({
  proyectos,
  proyectoSeleccionado,
  onSeleccionarProyecto,
  onAbrirDetalle,
  abierto,
  onCerrar,
  idioma,
}) => {
  if (!abierto) return null;
  const t = I18N_TEXTS[idioma];

  return (
    <aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-black z-[500] flex flex-col shadow-[-8px_0px_0px_rgba(0,0,0,0.15)] animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-black flex items-center justify-between bg-white select-none">
        <div>
          <div className="text-xs font-mono-code uppercase font-bold tracking-wider text-black">
            {t.catalogueTitle}
          </div>
          <p className="text-[11px] text-neutral-500">
            {proyectos.length} {t.worksCount}
          </p>
        </div>

        <button
          id="btn-cerrar-drawer-lista"
          onClick={onCerrar}
          className="p-1 text-black hover:bg-black hover:text-white border border-black transition-colors cursor-pointer"
          title={t.close}
          aria-label={t.close}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {proyectos.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 font-mono-code">
            {t.noResults}
          </div>
        ) : (
          proyectos.map((proyecto) => {
            const isSelected = proyectoSeleccionado?.id === proyecto.id;
            const arqPrincipal = proyecto.arquitecto_principal || proyecto.arquitecto;

            return (
              <div
                key={proyecto.id}
                onClick={() => {
                  onSeleccionarProyecto(proyecto);
                  if (window.innerWidth < 768) {
                    onCerrar();
                  }
                }}
                className={`p-4 transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                  isSelected ? 'bg-neutral-100 border-l-4 border-black' : 'hover:bg-[#F8F8F8]'
                }`}
              >
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-mono-code font-bold text-black uppercase">
                      {proyecto.ano_inauguracion}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-[10px] font-mono-code text-neutral-500 flex items-center gap-0.5 truncate">
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                      {proyecto.ciudad}, {proyecto.pais}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-black group-hover:underline line-clamp-1">
                    {proyecto.nombre_proyecto}
                  </h4>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[11px] text-neutral-600 truncate">
                      {arqPrincipal}
                    </p>
                    {proyecto.ano_pritzker && (
                      <span className="w-1.5 h-1.5 bg-black rotate-45 flex-shrink-0" title={`Pritzker ${proyecto.ano_pritzker}`} />
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-2 flex-wrap">
                    {/* Program pills */}
                    {(proyecto.programas || proyecto.programa || []).slice(0, 2).map((prog) => (
                      <span
                        key={prog}
                        className="text-[9px] font-mono-code px-1.5 py-0.2 bg-black text-white"
                      >
                        {traducirPrograma(prog, idioma)}
                      </span>
                    ))}

                    {/* Style pills */}
                    {proyecto.estilos && proyecto.estilos.slice(0, 2).map((st) => (
                      <span
                        key={st}
                        className="text-[9px] font-mono-code px-1.5 py-0.2 border border-neutral-200 text-neutral-600"
                      >
                        {traducirEstilo(st, idioma)}
                      </span>
                    ))}

                    {proyecto.estilos && proyecto.estilos.length > 2 && (
                      <span className="text-[9px] font-mono-code text-neutral-400">
                        +{proyecto.estilos.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="self-center flex items-center gap-1">
                  {onAbrirDetalle && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeleccionarProyecto(proyecto);
                        onAbrirDetalle(proyecto);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-mono-code px-2 py-1 bg-black text-white hover:bg-neutral-800 transition-opacity whitespace-nowrap"
                      title="Ver ficha completa"
                    >
                      {idioma === 'en' ? 'Dossier' : 'Ficha'}
                    </button>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-black p-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
