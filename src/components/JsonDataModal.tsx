import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';
import rawData from '../data/proyectos.json';

interface JsonDataModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const JsonDataModal: React.FC<JsonDataModalProps> = ({ abierto, onCerrar }) => {
  const [copiado, setCopiado] = useState<boolean>(false);

  if (!abierto) return null;

  const jsonString = JSON.stringify(rawData, null, 2);

  const handleCopiar = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDescargar = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'proyectos.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-black w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-black flex items-center justify-between bg-white select-none">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-black" />
            <span className="text-xs font-mono-code font-bold uppercase">
              proyectos.json
            </span>
            <span className="text-[10px] font-mono-code px-1.5 py-0.5 bg-neutral-100 text-neutral-600">
              {rawData.length} registros
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copiar-json"
              onClick={handleCopiar}
              className="px-2.5 py-1 text-xs font-mono-code border border-[#E5E5E5] hover:border-black transition-colors cursor-pointer flex items-center gap-1.5 text-black"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiado ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              id="btn-descargar-json"
              onClick={handleDescargar}
              className="px-2.5 py-1 text-xs font-mono-code bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </button>

            <button
              onClick={onCerrar}
              className="p-1 text-black hover:bg-black hover:text-white border border-black transition-colors cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#111111] text-[#E5E5E5] overflow-y-auto flex-1 font-mono-code text-xs leading-relaxed selection:bg-white selection:text-black">
          <pre>{jsonString}</pre>
        </div>
      </div>
    </div>
  );
};
