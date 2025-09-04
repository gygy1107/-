
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md border border-gray-200 my-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Generating Your Report...</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
};
