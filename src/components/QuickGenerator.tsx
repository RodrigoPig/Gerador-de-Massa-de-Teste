import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Building2, ShieldCheck, AlertTriangle, Trash2, HelpCircle
} from 'lucide-react';
import { validateCPF, validateCNPJ } from '../utils/validators';

export default function QuickGenerator() {
  const [validationType, setValidationType] = useState<'cpf' | 'cnpj'>('cpf');
  const [validationInput, setValidationInput] = useState('');

  return (
    <div className="bg-white border border-brand-beige-border rounded-3xl p-6 shadow-xs">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b border-brand-beige-border">
        <div>
          <h2 className="text-lg font-semibold text-brand-charcoal tracking-tight flex items-center gap-2 font-sans">
            <ShieldCheck className="h-5 w-5 text-brand-sage-deep" />
            Validador de Documentos
          </h2>
          <p className="text-xs text-brand-sage-light font-medium">Valide CPFs e CNPJs (inclusive alfanuméricos).</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Validation Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl border border-brand-beige-border bg-brand-cream">
          <button
            onClick={() => { setValidationType('cpf'); setValidationInput(''); }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              validationType === 'cpf' ? 'bg-brand-sage-deep text-white shadow-xs' : 'text-brand-sage-light hover:text-brand-sage-deep'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Validar CPF</span>
          </button>

          <button
            onClick={() => { setValidationType('cnpj'); setValidationInput(''); }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              validationType === 'cnpj' ? 'bg-brand-sage-deep text-white shadow-xs' : 'text-brand-sage-light hover:text-brand-sage-deep'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Validar CNPJ</span>
          </button>
        </div>

        {/* Core Validator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Input Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-extrabold text-[#6B705C] uppercase tracking-wider font-sans">
                Insira o valor para validação:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
                  placeholder={
                    validationType === 'cpf' 
                      ? 'Ex: 123.456.789-00 ou 12345678900' 
                      : 'Ex: 12.345.678/0001-95 ou AA12BC34...-95'
                  }
                  className="w-full bg-brand-cream border border-brand-beige-border rounded-xl px-4 py-3.5 pr-12 text-sm font-semibold text-brand-charcoal focus:outline-none focus:border-brand-sage-deep focus:ring-1 focus:ring-brand-sage-deep/50 tracking-wide font-mono shadow-xs transition-all"
                />
                {validationInput && (
                  <button
                    onClick={() => setValidationInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-brand-beige/50 text-brand-sage-light hover:text-brand-ochre rounded-lg cursor-pointer transition-colors"
                    title="Limpar campo"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Validation Guides */}
            <div className="text-[11px] bg-brand-cream border border-brand-beige-border rounded-xl p-3.5 text-brand-sage-light leading-relaxed font-semibold">
              <span className="font-extrabold text-brand-sage-deep block mb-1">
                {validationType === 'cpf' ? '💡 Regras de Validação de CPF:' : '💡 Regras de Validação de CNPJ (IN RFB 2.229/2024):'}
              </span>
              {validationType === 'cpf' 
                ? 'O sistema realiza o cálculo dos 2 dígitos verificadores utilizando a regra do Módulo 11 (pesos de 2 a 11). CPFs de teste com todos os dígitos idênticos são rejeitados de antemão.'
                : 'Suporta o formato tradicional numérico e o novo formato alfanumérico. Converte os caracteres seguindo o padrão oficial da Receita Federal (onde A=17, ... Z=42, com exceção de I, O e U para evitar confusões visuais).'
              }
            </div>
          </div>

          {/* View Column (Results Card) */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {!validationInput.trim() ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-beige-border rounded-2xl bg-brand-cream/30 min-h-[220px]"
                >
                  <HelpCircle className="h-10 w-10 text-[#A5A58D] mb-3 stroke-1" />
                  <h4 className="text-xs font-extrabold text-brand-sage-deep uppercase tracking-widest mb-1.5">Aguardando Entrada</h4>
                  <p className="text-[11px] text-brand-sage-light max-w-xs leading-relaxed font-semibold">
                    Digite ou cole um documento na caixa de texto para visualizar em tempo real os relatórios e a integridade da assinatura.
                  </p>
                </motion.div>
              ) : (
                (() => {
                  const validationResult = 
                    validationType === 'cpf' ? validateCPF(validationInput) : validateCNPJ(validationInput);

                  return (
                    <motion.div
                      key="results-card"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className={`border p-5 rounded-2xl shadow-xs space-y-4 transition-all ${
                        validationResult.isValid 
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 shadow-emerald-50/50' 
                          : 'bg-rose-50/50 border-rose-200 text-rose-900 shadow-rose-50/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          validationResult.isValid ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}>
                          {validationResult.isValid ? <ShieldCheck className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-tight">
                            {validationResult.isValid ? 'Documento Válido' : 'Documento Inválido'}
                          </h3>
                          <p className="text-xs text-opacity-95 leading-relaxed mt-0.5 font-sans font-medium">
                            {validationResult.message}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-brand-beige-border/30 pt-4 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-brand-beige-border/10">
                          <span className="font-bold text-[#6B705C] uppercase tracking-wider text-[10px]">Tipo Detectado</span>
                          <span className="font-mono font-bold bg-white/60 px-2 py-0.5 rounded-md text-[11px]">
                            {validationResult.details?.type}
                          </span>
                        </div>

                        {validationResult.details?.type === 'CNPJ' && (
                          <div className="flex justify-between items-center py-1 border-b border-brand-beige-border/10">
                            <span className="font-bold text-[#6B705C] uppercase tracking-wider text-[10px]">Formato RFB</span>
                            <span className="font-semibold bg-white/60 px-2 py-0.5 rounded-md text-[11px]">
                              {validationResult.details?.format === 'numeric' ? 'Numérico Tradicional' : 'Alfanumérico (Novo Padrão)'}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-1 border-b border-brand-beige-border/10">
                          <span className="font-bold text-[#6B705C] uppercase tracking-wider text-[10px]">Conteúdo Limpo</span>
                          <span className="font-mono tracking-wider bg-white/60 px-2 py-0.5 rounded-md text-[11px] select-all">
                            {validationResult.details?.cleanedValue}
                          </span>
                        </div>

                        {validationResult.details?.actualCheckDigits && (
                          <div className="flex justify-between items-center py-1 border-b border-brand-beige-border/10">
                            <span className="font-bold text-[#6B705C] uppercase tracking-wider text-[10px]">Dígitos Verificadores</span>
                            <span className="font-mono font-bold bg-white/60 px-2 py-0.5 rounded-md text-[11px]">
                              Informado: <span className="font-extrabold">{validationResult.details.actualCheckDigits}</span>
                              {' • '}
                              Calculado: <span className="font-extrabold">{validationResult.details.computedCheckDigits}</span>
                            </span>
                          </div>
                        )}

                        {!validationResult.isValid && validationResult.details?.errorReason && (
                          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-[11px] text-rose-800 font-medium leading-relaxed mt-2 shadow-xs">
                            <span className="font-extrabold block text-rose-900 mb-0.5">Motivo da Rejeição:</span>
                            {validationResult.details.errorReason}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
