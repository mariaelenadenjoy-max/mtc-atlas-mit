
import React from 'react';
import { AcupuncturePoint } from '../types';
import { MERIDIANS } from '../constants';

interface PointCardProps {
  point: AcupuncturePoint;
  onClick: (point: AcupuncturePoint) => void;
}

const PointCard: React.FC<PointCardProps> = ({ point, onClick }) => {
  const meridianInfo = MERIDIANS.find(m => m.code === point.meridian);
  
  return (
    <div 
      onClick={() => onClick(point)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-200 overflow-hidden group flex flex-col h-full"
    >
      <div className={`h-2 ${meridianInfo?.color || 'bg-slate-400'}`}></div>
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{point.meridian} {point.id}</span>
          {point.category && (
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
              {point.category}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-brand transition-colors">
          {point.name} <span className="text-sm font-normal text-slate-400">({point.pinyin})</span>
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
          {point.location}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {point.indications.slice(0, 3).map((ind, idx) => (
            <span key={idx} className="text-[10px] bg-brand/5 text-brand px-2 py-0.5 rounded">
              {ind}
            </span>
          ))}
          {point.indications.length > 3 && (
            <span className="text-[10px] text-slate-400">+{point.indications.length - 3} más</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointCard;
