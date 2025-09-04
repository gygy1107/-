
import React from 'react';

const LeafIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 4 13V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a7 7 0 0 1-7 7h-1Z"></path>
    <path d="M12 22V11"></path>
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-4">
            <LeafIcon className="w-8 h-8 text-emerald-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Villa Garden AI Redesigner
            </h1>
        </div>
      </div>
    </header>
  );
};
