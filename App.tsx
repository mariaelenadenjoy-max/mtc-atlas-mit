
import React, { useState, useEffect } from 'react';
import { AcupuncturePoint } from './types';
import { INITIAL_POINTS, MERIDIANS } from './constants';
import { queryPointsBySymptom } from './services/geminiService';
import PointCard from './components/PointCard';
import PointDetailModal from './components/PointDetailModal';

const App: React.FC = () => {
  const [points, setPoints] = useState<AcupuncturePoint[]>(INITIAL_POINTS);
  const [selectedPoint, setSelectedPoint] = useState<AcupuncturePoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterMeridian, setFilterMeridian] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setPoints(INITIAL_POINTS);
      setExplanation(null);
      return;
    }

    setLoading(true);
    try {
      const result = await queryPointsBySymptom(searchQuery);
      
      const enrichedPoints: AcupuncturePoint[] = result.suggestedPoints.map((p: any) => ({
        id: p.id || 'N/A',
        name: p.name || 'Desconocido',
        pinyin: p.pinyin || '',
        meridian: p.id ? p.id.replace(/[0-9]/g, '') : 'UNK',
        meridianName: 'Sugerido por IA',
        location: p.location || 'Consultar manual',
        indications: p.indications || [],
        contraindications: p.contraindications || [],
        applications: p.applications || 'Tratamiento sintomático.',
        benefits: p.benefits || 'Punto relevante para la consulta.',
        techniques: p.techniques || 'Inserción según técnica estándar.',
        observations: p.observations || 'Sin observaciones adicionales.',
        category: 'Recomendado'
      }));

      setPoints(enrichedPoints);
      setExplanation(result.explanation);
    } catch (error) {
      console.error(error);
      alert("Error en el motor IA. Restaurando base de datos local.");
      setPoints(INITIAL_POINTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredPoints = filterMeridian 
    ? points.filter(p => p.meridian === filterMeridian)
    : points;

  return (
    <div className="min-h-screen meridian-bg flex flex-col">
      {/* Header / Search Hero */}
      <header className="bg-brand text-white pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
            <i className="fas fa-leaf text-emerald-400 text-sm"></i>
            <span className="text-xs font-semibold tracking-wider uppercase">Atlas MTC by Medicina IT</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            BBDD Profesional de Acupuntura
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Acceso completo a todos los meridianos. Identificación avanzada de puntos por IA y atlas anatómico integrado.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por síntoma (ej: tos) o punto (ej: LU7)..."
              className="w-full px-6 py-4 rounded-2xl text-slate-900 shadow-xl focus:ring-4 focus:ring-brand/50 outline-none pr-16 text-lg"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-brand hover:brightness-110 text-white px-5 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-search"></i>}
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 -mt-12 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Meridians Filter */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                Meridianos
                <button 
                  onClick={() => {setFilterMeridian(null); setPoints(INITIAL_POINTS);}}
                  className="text-[10px] text-brand hover:underline font-bold uppercase tracking-tighter"
                >
                  Ver Todo
                </button>
              </h3>
              <div className="space-y-2">
                {MERIDIANS.map(mer => (
                  <button
                    key={mer.code}
                    onClick={() => {
                      setFilterMeridian(mer.code === filterMeridian ? null : mer.code);
                      if (mer.code === 'LU') {
                        // Forzar carga de todos los puntos de pulmón de la base de datos
                        setPoints(INITIAL_POINTS);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      filterMeridian === mer.code 
                        ? 'bg-brand/5 text-brand ring-1 ring-brand/20' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${mer.color}`}></span>
                    {mer.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Points Grid */}
          <section className="lg:col-span-3">
            {explanation && (
              <div className="bg-brand/5 border border-brand/10 p-6 rounded-2xl mb-8 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-2 text-brand font-bold">
                  <i className="fas fa-magic"></i>
                  <span>Diagnóstico Sugerido</span>
                </div>
                <p className="text-brand/90 leading-relaxed italic">
                  "{explanation}"
                </p>
              </div>
            )}

            {filteredPoints.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPoints.map(point => (
                  <PointCard 
                    key={point.id} 
                    point={point} 
                    onClick={setSelectedPoint}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <i className="fas fa-search text-5xl text-slate-200 mb-4"></i>
                <h3 className="text-xl font-medium text-slate-400">Sin resultados específicos</h3>
                <button 
                  onClick={() => {setSearchQuery(''); setPoints(INITIAL_POINTS); setFilterMeridian(null);}}
                  className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors font-medium"
                >
                  Mostrar base de datos
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2024 Atlas MTC by Medicina IT. BBDD Completa de Acupuntura.</p>
      </footer>

      {/* Modal */}
      {selectedPoint && (
        <PointDetailModal 
          point={selectedPoint} 
          onClose={() => setSelectedPoint(null)} 
        />
      )}
    </div>
  );
};

export default App;
