
import React, { useState, useEffect } from 'react';
import { AcupuncturePoint } from '../types';
import { MERIDIANS } from '../constants';
import { generatePointDiagram } from '../services/geminiService';

interface PointDetailModalProps {
  point: AcupuncturePoint;
  onClose: () => void;
}

const PointDetailModal: React.FC<PointDetailModalProps> = ({ point, onClose }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const meridianInfo = MERIDIANS.find(m => m.code === point.meridian);

  useEffect(() => {
    const loadImage = async () => {
      if (point.staticImage) {
        setImageUrl(point.staticImage);
        return;
      }
      
      setLoadingImage(true);
      setImageError(false);
      try {
        const url = await generatePointDiagram(point);
        setImageUrl(url);
      } catch (err) {
        console.error(err);
        setImageError(true);
      } finally {
        setLoadingImage(false);
      }
    };

    loadImage();
  }, [point]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className={`p-6 md:p-8 flex justify-between items-center text-white ${meridianInfo?.color || 'bg-brand'}`}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest">{point.id}</span>
              <span className="text-sm font-bold opacity-80 uppercase tracking-tighter">{point.meridianName}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black">{point.name} <span className="font-light italic text-xl md:text-2xl ml-2 opacity-90">{point.pinyin}</span></h2>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 hover:bg-white/20 rounded-full transition-all flex items-center justify-center text-2xl border border-white/10"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar bg-slate-50/50">
          
          {/* Anatomical Image - Top Featured */}
          <div className="w-full bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl p-4 group">
            <div className="mb-4 flex items-center justify-between px-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand flex items-center gap-2">
                 <div className="w-2 h-2 bg-brand rounded-full"></div>
                 Vista Anatómica - Canal de Pulmón (Hand Taiyin)
              </h3>
              <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">Referencia de Meridianos</span>
            </div>
            {loadingImage ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <i className="fas fa-circle-notch fa-spin text-4xl text-brand mb-4"></i>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cargando Mapa...</p>
              </div>
            ) : imageError ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                <i className="fas fa-image text-6xl mb-4"></i>
                <p className="text-sm font-bold">Error en Imagen</p>
              </div>
            ) : imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Mapa del canal de pulmón" 
                className="w-full h-auto max-h-[500px] object-contain rounded-[1.5rem] mx-auto animate-in fade-in duration-1000" 
              />
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Column: Essential Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand flex items-center gap-2">
                   <div className="w-2 h-2 bg-brand rounded-full"></div>
                   1. Ubicación Anatómica
                </h3>
                <p className="text-slate-700 text-lg font-bold leading-tight tracking-tight italic">
                  "{point.location}"
                </p>
              </div>

              <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center gap-3">
                  <i className="fas fa-list-check"></i> 2. Indicaciones
                </h3>
                <div className="flex flex-wrap gap-2">
                  {point.indications.map((ind, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                      {ind}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-amber-50 p-8 rounded-[2rem] border border-amber-200">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-600 mb-4 flex items-center gap-3">
                  <i className="fas fa-shield-halved"></i> 3. Contraindicaciones
                </h3>
                <ul className="space-y-2">
                  {point.contraindications.map((c, i) => (
                    <li key={i} className="text-amber-950 text-sm font-bold leading-relaxed flex items-start gap-2">
                      <i className="fas fa-warning mt-1 text-amber-500"></i>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column: Advanced Info */}
            <div className="space-y-8">
              <div className="bg-brand/10 p-8 rounded-[2rem] border border-brand/20 space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand flex items-center gap-2">
                   <div className="w-2 h-2 bg-brand rounded-full"></div>
                   5. Acciones y Beneficios Energéticos
                </h3>
                <p className="text-slate-800 text-base leading-relaxed font-medium">
                  {point.benefits}
                </p>
              </div>

              <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-3">
                  <i className="fas fa-hand-holding-medical"></i> 4. Aplicaciones
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {point.applications}
                </p>
              </section>

              <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-3">
                  <i className="fas fa-syringe"></i> 6. Técnicas
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                  {point.techniques}
                </p>
              </section>

              <section className="bg-slate-900 p-8 rounded-[2rem] text-slate-400">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-4 flex items-center gap-3">
                  <i className="fas fa-circle-info"></i> 7. Observaciones
                </h3>
                <p className="text-sm font-medium leading-relaxed italic">
                  {point.observations}
                </p>
              </section>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center text-brand">
              <i className="fas fa-book-medical"></i>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-xs">
              MTC Atlas Medicina IT <br/> <span className="text-brand">Referencia Clínica Profesional</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-brand text-white rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand/30"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDetailModal;
