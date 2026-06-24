import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Files, Shield, Info, Database, ExternalLink } from 'lucide-react';
import Header from './components/Header';
import QuickGenerator from './components/QuickGenerator';
import BulkGenerator from './components/BulkGenerator';

export default function App() {
  const [activeMode, setActiveMode] = useState<'quick' | 'bulk'>('quick');

  return (
    <div className="min-h-screen bg-brand-cream text-brand-muted font-sans selection:bg-brand-sage-deep selection:text-white flex flex-col justify-between">
      
      {/* Header section */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Info Banner reference directly to 4Devs */}
        <div className="bg-gradient-to-br from-brand-sage-deep to-[#535747] text-white rounded-3xl p-6 shadow-sm border border-[#5c614f] relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-[0.06] scale-150 transform translate-x-12 -translate-y-8 pointer-events-none">
            <Database className="w-96 h-96" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-[#D4A373]" />
              <span className="text-white/90">Geração Teste de Alta Fidelidade</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans leading-[32px]">
              Gerador de Massa de Dados & Validadores de QA
            </h2>
            
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Inspirado na facilidade do clássico <span className="font-bold text-white">4Devs</span>, preparamos uma suite completa para desenvolvedores. Todos os dados fictícios como <strong>CPF</strong>, <strong>CNPJ</strong> e <strong>Cartões de Crédito</strong> são providos de algoritmos de checksum e dígitos verificadores idênticos aos oficiais para passar em todas as validações de input do seu frontend e backend.
            </p>
          </div>
        </div>

        {/* Dynamic Mode Toggles bar */}
        <div className="flex items-center justify-between bg-white border border-brand-beige-border p-2.5 rounded-2xl shadow-xs">
          
          <div className="flex items-center space-x-1.5 bg-brand-beige p-1 rounded-xl border border-brand-beige-border">
            <button
              onClick={() => setActiveMode('quick')}
              className={`flex items-center space-x-2 px-4.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'quick' 
                  ? 'bg-brand-sage-deep text-white shadow-xs' 
                  : 'text-brand-sage-light hover:text-brand-sage-deep'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Painel Individual</span>
            </button>
            
            <button
              id="bulk-mode-tab"
              onClick={() => setActiveMode('bulk')}
              className={`flex items-center space-x-2 px-4.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'bulk' 
                  ? 'bg-brand-sage-deep text-white shadow-xs' 
                  : 'text-brand-sage-light hover:text-brand-sage-deep'
              }`}
            >
              <Files className="h-3.5 w-3.5" />
              <span>Massa em Lote (JSON / CSV)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-2.5 text-brand-sage-light pr-2">
            <Shield className="h-4 w-4 text-brand-ochre" />
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none font-sans">
              Dados 100% Criptografados Localmente
            </span>
          </div>

        </div>

        {/* View Switch with animations */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeMode === 'quick' ? (
              <motion.div
                key="quick-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <QuickGenerator />
              </motion.div>
            ) : (
              <motion.div
                key="bulk-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <BulkGenerator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FAQ - Guidelines / Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-brand-beige-border rounded-3xl p-6 shadow-xs">
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-brand-sage-deep uppercase tracking-widest flex items-center gap-1.5 font-sans">
              <Info className="h-4 w-4 text-brand-sage-light" />
              Como utilizar as validações?
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Diferente de geradores comuns, nosso motor calcula os dígitos verificadores aplicando as regras da Receita Federal para <strong>CPF (Módulo 11)</strong> e <strong>CNPJ</strong>, garantindo integridade de validação matemática. Os cartões de crédito utilizam o algoritmo de <strong>Luhn (Módulo 10)</strong>, simulando emissores reais.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-brand-sage-deep uppercase tracking-widest flex items-center gap-1.5 font-sans">
              <Shield className="h-4 w-4 text-brand-sage-light" />
              Segurança e Privacidade dos Testes
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Todos os registros gerados são inteiramente ficcionais, montados dinamicamente com dados da biblioteca Faker e arrays locais filtrados. Nenhum dado é retirado de serviços governamentais ou cartórios reais. As contas de usuário e perfis de campos personalizados são persistidos exclusivamente no seu navegador (localStorage).
            </p>
          </div>
        </div>

      </main>

      {/* Styled human footer */}
      <footer className="border-t border-brand-beige-border bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-sage-light space-y-3 sm:space-y-0">
          <div className="space-y-1 text-center sm:text-left">
            <p>© 2026 Gerador de Massa de Teste • Geração realista para validação de software.</p>
            <p className="text-[11px] text-brand-sage-deep/80">
              Criado por <span className="font-bold text-brand-charcoal">Rodrigo Vargas QA Pleno</span> • IA: <span className="font-semibold text-brand-sage-deep">Gemini 3.5 Flash</span>
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.4devs.com.br/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-sage-deep font-semibold transition-colors flex items-center gap-1">
              Referência 4Devs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
