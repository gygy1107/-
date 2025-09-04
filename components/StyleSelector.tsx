
import React from 'react';
import { GARDEN_STYLES } from '../constants';
import type { GardenStyle } from '../types';

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onStyleSelect: (styleId: string) => void;
}

const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);


export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onStyleSelect }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-1">2. Choose a Style</h2>
        <p className="text-sm text-gray-500 mb-4">Select the aesthetic you want for your garden.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GARDEN_STYLES.map((style: GardenStyle) => (
            <div
                key={style.id}
                onClick={() => onStyleSelect(style.id)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300
                ${selectedStyleId === style.id ? 'border-emerald-500 scale-105 shadow-lg' : 'border-transparent hover:border-emerald-300'}
                `}
            >
                <img src={style.imageUrl} alt={style.name} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <p className="absolute bottom-1 left-2 text-white text-sm font-semibold p-1">{style.name}</p>
                {selectedStyleId === style.id && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                        <CheckCircleIcon className="w-4 h-4" />
                    </div>
                )}
            </div>
            ))}
        </div>
    </div>
  );
};
