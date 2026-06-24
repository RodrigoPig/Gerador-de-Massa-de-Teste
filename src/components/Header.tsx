import React from 'react';
import { Database } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-brand-beige-border bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div id="header-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-sage-deep text-white rounded-xl shadow-xs flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-brand-charcoal flex items-center gap-1.5">
              Gerador de <span className="text-brand-sage-deep">Massa de Teste</span>
            </h1>
            <p className="text-xs text-brand-sage-light font-medium">Massa de dados brasileira robusta e realística para testes</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center space-x-4">
        </div>
      </div>
    </header>
  );
}
