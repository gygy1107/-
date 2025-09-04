import React from 'react';
import type { Report } from '../types';

interface ReportDisplayProps {
  report: Report;
}

const ImageIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
);

const PlanIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12c0-5.25-4.25-9.5-9.5-9.5S2.5 6.75 2.5 12s4.25 9.5 9.5 9.5" /><path d="M12 2v10" /><path d="M12 12h-4" /><path d="M12 12h6.5" /><path d="m19 5-1.5 1.5" /></svg>
);

const IdeaIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18" /><path d="M12 3v18" /><path d="M12 21a6 6 0 0 1-6-6" /><path d="M12 21a6 6 0 0 0 6-6" /><path d="M12 3a6 6 0 0 1 6 6" /><path d="M12 3a6 6 0 0 0-6 6" /></svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);


export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  const handleDownload = () => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Garden Redesign Report</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; color: #1f2937; }
            .container { max-width: 800px; margin: 2rem auto; border: 1px solid #e5e7eb; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); background-color: white; border-radius: 0.75rem; }
            h1, h2, h3 { color: #111827; }
            h1 { text-align: center; font-size: 2.25rem; margin-bottom: 0.5rem; }
            h2 { color: #16a34a; text-align: center; font-size: 1.5rem; margin-top: 0; margin-bottom: 2rem; }
            h3 { border-bottom: 2px solid #d1d5db; padding-bottom: 0.5rem; margin-top: 2.5rem; font-size: 1.25rem; }
            img { max-width: 100%; height: auto; border-radius: 0.5rem; margin-top: 1rem; border: 1px solid #e5e7eb; }
            ul { list-style-type: none; padding-left: 0; }
            li { display: flex; align-items: flex-start; margin-bottom: 0.75rem; line-height: 1.6; }
            li::before { content: '✓'; color: #22c55e; font-size: 1.25rem; margin-right: 0.75rem; flex-shrink: 0; }
            .floor-plan-desc { white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; background-color: #f9fafb; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; margin-top: 1rem; font-size: 0.875rem; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your Redesign Report</h1>
            <h2>${report.styleName} Style</h2>
            
            <h3>New Look</h3>
            <img src="${report.redesignedImage}" alt="Redesigned Garden">
            
            <h3>Suggested Floor Plan</h3>
            <img src="${report.floorPlan}" alt="Floor Plan">
            <p class="floor-plan-desc">${report.floorPlanDescription.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            
            <h3>Professional Advice</h3>
            <ul>
                ${report.redesignAdvice.map(tip => `<li>${tip.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`).join('')}
            </ul>
        </div>
    </body>
    </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'garden-redesign-report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-8">
      <div className="relative p-6 sm:p-8">
        <button 
          onClick={handleDownload}
          className="absolute top-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          aria-label="Download Report"
        >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download
        </button>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Your Redesign Report</h2>
        <p className="text-center text-lg text-emerald-600 font-medium mb-8">{report.styleName} Style</p>

        <div className="space-y-10">
          
          {/* Redesigned Image Section */}
          <div>
            <div className="flex items-center mb-4">
              <ImageIcon className="w-7 h-7 text-emerald-500 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-700">New Look</h3>
            </div>
            <div className="rounded-lg overflow-hidden border-2 border-gray-200">
              <img src={report.redesignedImage} alt="Redesigned Garden" className="w-full h-auto object-cover" />
            </div>
          </div>

          {/* Floor Plan Section */}
          <div>
            <div className="flex items-center mb-4">
              <PlanIcon className="w-7 h-7 text-emerald-500 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-700">Suggested Floor Plan</h3>
            </div>
            <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={report.floorPlan} alt="Garden Floor Plan" className="w-full h-auto object-cover bg-white" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
              <p className="text-gray-600 whitespace-pre-wrap font-mono text-sm leading-relaxed">{report.floorPlanDescription}</p>
            </div>
          </div>

          {/* Redesign Advice Section */}
          <div>
            <div className="flex items-center mb-4">
              <IdeaIcon className="w-7 h-7 text-emerald-500 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-700">Professional Advice</h3>
            </div>
            <ul className="space-y-3">
              {report.redesignAdvice.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};