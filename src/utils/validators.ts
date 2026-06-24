// Brazilian document validators (CPF, CNPJ, and Credit Card) supporting standard & alphanumeric RFB rules

export interface ValidationResult {
  isValid: boolean;
  message: string;
  details?: {
    type: 'CPF' | 'CNPJ' | 'CARD' | 'IE';
    format: 'numeric' | 'alphanumeric' | 'unknown';
    cleanedValue: string;
    computedCheckDigits?: string;
    actualCheckDigits?: string;
    brand?: string;
    errorReason?: string;
    state?: string;
  };
}

/**
 * Validates CPF format and Check Digits (Modulo 11)
 */
export function validateCPF(rawCpf: string): ValidationResult {
  const cleaned = rawCpf.replace(/[^0-9]/g, '');
  
  if (cleaned.length !== 11) {
    return {
      isValid: false,
      message: 'CPF deve conter exatamente 11 dígitos.',
      details: {
        type: 'CPF',
        format: 'numeric',
        cleanedValue: cleaned,
        errorReason: 'Tamanho incorreto ou caracteres inválidos.'
      }
    };
  }

  // Reject sequence of identical digits (e.g., 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return {
      isValid: false,
      message: 'CPF inválido (dígitos repetidos).',
      details: {
        type: 'CPF',
        format: 'numeric',
        cleanedValue: cleaned,
        errorReason: 'Sequência de dígitos idênticos.'
      }
    };
  }

  const n = Array.from(cleaned).map(Number);
  
  // First digit
  let d1 = 0;
  for (let i = 0; i < 9; i++) {
    d1 += n[i] * (10 - i);
  }
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;

  // Second digit
  let d2 = 0;
  for (let i = 0; i < 10; i++) {
    d2 += n[i] * (11 - i);
  }
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;

  const actualDigits = `${n[9]}${n[10]}`;
  const computedDigits = `${d1}${d2}`;
  const isValid = actualDigits === computedDigits;

  return {
    isValid,
    message: isValid ? 'CPF é válido e consistente!' : 'CPF inválido (dígito verificador inconsistente).',
    details: {
      type: 'CPF',
      format: 'numeric',
      cleanedValue: cleaned,
      actualCheckDigits: actualDigits,
      computedCheckDigits: computedDigits,
      errorReason: isValid ? undefined : 'Dígitos verificadores informados não conferem com o cálculo do Módulo 11.'
    }
  };
}

/**
 * Validates CNPJ supporting traditional numeric and the new alphanumeric RFB standards (IN 2229/2024)
 */
export function validateCNPJ(rawCnpj: string): ValidationResult {
  // Strip periods, slashes, hyphens, and whitespace
  const cleaned = rawCnpj.trim().replace(/[\s./-]/g, '').toUpperCase();
  
  if (cleaned.length !== 14) {
    return {
      isValid: false,
      message: 'CNPJ deve conter exatamente 14 caracteres.',
      details: {
        type: 'CNPJ',
        format: 'unknown',
        cleanedValue: cleaned,
        errorReason: 'Tamanho incorreto.'
      }
    };
  }

  // Identify format type
  const isNumericOnly = /^[0-9]+$/.test(cleaned);
  const isAlphanumeric = /^[A-Z0-9]+$/.test(cleaned);

  if (!isAlphanumeric) {
    return {
      isValid: false,
      message: 'CNPJ possui caracteres especiais ou inválidos.',
      details: {
        type: 'CNPJ',
        format: 'unknown',
        cleanedValue: cleaned,
        errorReason: 'Caracteres não autorizados pela Receita Federal.'
      }
    };
  }

  // In CNPJ (alphanumeric or numeric), the last 2 digits (DV) are strictly numeric
  const dvPart = cleaned.slice(12);
  if (!/^[0-9]{2}$/.test(dvPart)) {
    return {
      isValid: false,
      message: 'Os dois últimos dígitos (verificadores) do CNPJ devem ser estritamente numéricos.',
      details: {
        type: 'CNPJ',
        format: isNumericOnly ? 'numeric' : 'alphanumeric',
        cleanedValue: cleaned,
        errorReason: 'Dígitos verificadores contêm letras.'
      }
    };
  }

  // Rule: Letters I, O, U are strictly excluded by RFB to avoid confusion
  const basePart = cleaned.slice(0, 12);
  const forbiddenMatch = /[IOU]/.exec(basePart);
  if (forbiddenMatch) {
    return {
      isValid: false,
      message: `CNPJ Alfanumérico inválido. Contém caractere proibido "${forbiddenMatch[0]}" (letras I, O, U são proibidas para evitar confusão visual).`,
      details: {
        type: 'CNPJ',
        format: 'alphanumeric',
        cleanedValue: cleaned,
        errorReason: 'Contém letra excluída (I, O ou U).'
      }
    };
  }

  // Reject sequence of identical numeric characters
  if (isNumericOnly && /^(\d)\1{13}$/.test(cleaned)) {
    return {
      isValid: false,
      message: 'CNPJ inválido (dígitos idênticos repetidos).',
      details: {
        type: 'CNPJ',
        format: 'numeric',
        cleanedValue: cleaned,
        errorReason: 'Sequência de dígitos idênticos.'
      }
    };
  }

  // Convert characters to values for calculation (charCode - 48 as in the RFB specification)
  // For '0'-'9': ASCII 48-57 -> 0-9
  // For 'A'-'Z': ASCII 65-90 -> 17-42
  const baseValues: number[] = [];
  for (let i = 0; i < 12; i++) {
    baseValues.push(basePart.charCodeAt(i) - 48);
  }

  // Multipliers/Weights for check digits
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d1 = baseValues.reduce((acc, val, idx) => acc + val * w1[idx], 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;

  const d1Values = [...baseValues, d1];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d2 = d1Values.reduce((acc, val, idx) => acc + val * w2[idx], 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;

  const actualDigits = dvPart;
  const computedDigits = `${d1}${d2}`;
  const isValid = actualDigits === computedDigits;

  return {
    isValid,
    message: isValid 
      ? `CNPJ ${isNumericOnly ? 'Numérico' : 'Alfanumérico'} é válido e consistente!`
      : 'CNPJ inválido (dígito verificador inconsistente).',
    details: {
      type: 'CNPJ',
      format: isNumericOnly ? 'numeric' : 'alphanumeric',
      cleanedValue: cleaned,
      actualCheckDigits: actualDigits,
      computedCheckDigits: computedDigits,
      errorReason: isValid ? undefined : 'Dígitos verificadores informados não correspondem ao cálculo do Módulo 11 da Receita Federal.'
    }
  };
}

/**
 * Validates Credit Cards using the Luhn Algorithm (Modulo 10) and detects its brand
 */
export function validateCreditCard(rawCard: string): ValidationResult {
  const cleaned = rawCard.replace(/[^0-9]/g, '');

  if (cleaned.length < 12 || cleaned.length > 19) {
    return {
      isValid: false,
      message: 'Número do cartão inválido (tamanho deve ser entre 12 e 19 dígitos).',
      details: {
        type: 'CARD',
        format: 'numeric',
        cleanedValue: cleaned,
        errorReason: 'Comprimento inválido.'
      }
    };
  }

  // Detect brand (Bandeira)
  let brand = 'Desconhecida';
  if (/^4/.test(cleaned)) {
    brand = 'Visa';
  } else if (/^(51|52|53|54|55|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleaned)) {
    brand = 'Mastercard';
  } else if (/^(34|37)/.test(cleaned)) {
    brand = 'Amex';
  } else if (/^(401178|401179|431274|438935|451416|457393|457631|457632|504175|506699|5067|509|627780|636297|636368)/.test(cleaned) || /^(5067|5090|6277|6362|6363)/.test(cleaned)) {
    brand = 'Elo';
  } else if (/^(6011|622|64|65)/.test(cleaned)) {
    brand = 'Discover';
  } else if (/^(301|305|36|38)/.test(cleaned)) {
    brand = 'Diners Club';
  }

  // Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = Number(cleaned.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const isValid = sum % 10 === 0;

  return {
    isValid,
    message: isValid 
      ? `Cartão de Crédito ${brand} é válido!` 
      : `Número de cartão ${brand} inválido pelo algoritmo de Luhn (checksum incorreto).`,
    details: {
      type: 'CARD',
      format: 'numeric',
      cleanedValue: cleaned,
      brand,
      errorReason: isValid ? undefined : 'Soma de verificação do Algoritmo de Luhn foi inconsistente.'
    }
  };
}

export interface StateIeConfig {
  uf: string;
  length: number;
  startsWith?: string[];
}

export const STATE_IE_CONFIGS: { [key: string]: StateIeConfig } = {
  AC: { uf: 'AC', length: 13, startsWith: ['01'] },
  AL: { uf: 'AL', length: 9, startsWith: ['24'] },
  AM: { uf: 'AM', length: 9 },
  AP: { uf: 'AP', length: 9, startsWith: ['03'] },
  BA: { uf: 'BA', length: 9 },
  CE: { uf: 'CE', length: 9 },
  DF: { uf: 'DF', length: 13, startsWith: ['07'] },
  ES: { uf: 'ES', length: 9 },
  GO: { uf: 'GO', length: 9, startsWith: ['10', '11', '20'] },
  MA: { uf: 'MA', length: 9, startsWith: ['12'] },
  MT: { uf: 'MT', length: 9 },
  MS: { uf: 'MS', length: 9, startsWith: ['28'] },
  MG: { uf: 'MG', length: 13 },
  PA: { uf: 'PA', length: 9, startsWith: ['15'] },
  PB: { uf: 'PB', length: 9 },
  PE: { uf: 'PE', length: 9 },
  PI: { uf: 'PI', length: 9, startsWith: ['19'] },
  PR: { uf: 'PR', length: 10 },
  RJ: { uf: 'RJ', length: 8 },
  RN: { uf: 'RN', length: 9, startsWith: ['20'] },
  RO: { uf: 'RO', length: 9 },
  RR: { uf: 'RR', length: 9, startsWith: ['24'] },
  RS: { uf: 'RS', length: 10 },
  SC: { uf: 'SC', length: 9 },
  SE: { uf: 'SE', length: 9 },
  SP: { uf: 'SP', length: 12 },
  TO: { uf: 'TO', length: 11, startsWith: ['29'] }
};

export function computeIECD(cleaned: string, uf: string): { computedDV: string, expectedLength: number, error?: string } {
  const activeUf = uf.toUpperCase();
  const config = STATE_IE_CONFIGS[activeUf];
  if (!config) {
    return { computedDV: '', expectedLength: 0, error: 'UF não reconhecida.' };
  }

  const len = config.length;
  
  if (activeUf === 'SP') {
    if (cleaned.length !== 12) return { computedDV: '', expectedLength: 12 };
    const d = Array.from(cleaned).map(Number);
    const sum1 = d[0]*1 + d[1]*3 + d[2]*4 + d[3]*5 + d[4]*6 + d[5]*7 + d[6]*8 + d[7]*10;
    let dv1 = sum1 % 11;
    if (dv1 === 10) dv1 = 0;
    
    // For SP verification, we must verify both DVs
    const sum2 = d[0]*3 + d[1]*2 + d[2]*10 + d[3]*9 + d[4]*8 + d[5]*7 + d[6]*6 + d[7]*5 + d[8]*4 + d[9]*3 + d[10]*2;
    let dv2 = sum2 % 11;
    if (dv2 === 10) dv2 = 0;

    return { computedDV: `${dv1}${dv2}`, expectedLength: 12 };
  }

  if (activeUf === 'RJ') {
    if (cleaned.length !== 8) return { computedDV: '', expectedLength: 8 };
    const d = Array.from(cleaned).map(Number);
    const sum = d[0]*2 + d[1]*7 + d[2]*6 + d[3]*5 + d[4]*4 + d[5]*3 + d[6]*2;
    const mod = sum % 11;
    const dv = mod < 2 ? 0 : 11 - mod;
    return { computedDV: String(dv), expectedLength: 8 };
  }

  if (activeUf === 'MG') {
    if (cleaned.length !== 13) return { computedDV: '', expectedLength: 13 };
    const d = Array.from(cleaned).map(Number);
    
    const temp = [d[0], d[1], 0, d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9], d[10]];
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    
    let sumProducts = 0;
    for (let i = 0; i < 12; i++) {
      const prod = temp[i] * weights[i];
      sumProducts += Math.floor(prod / 10) + (prod % 10);
    }
    const nextMultipleOf10 = Math.ceil(sumProducts / 10) * 10;
    const dv1 = nextMultipleOf10 - sumProducts;
    
    const sum2 = d[0]*3 + d[1]*2 + d[2]*11 + d[3]*10 + d[4]*9 + d[5]*8 + d[6]*7 + d[7]*6 + d[8]*5 + d[9]*4 + d[10]*3 + dv1*2;
    const mod2 = sum2 % 11;
    const dv2 = mod2 < 2 ? 0 : 11 - mod2;

    return { computedDV: `${dv1}${dv2}`, expectedLength: 13 };
  }

  if (activeUf === 'RS') {
    if (cleaned.length !== 10) return { computedDV: '', expectedLength: 10 };
    const d = Array.from(cleaned).map(Number);
    const sum = d[0]*2 + d[1]*9 + d[2]*8 + d[3]*7 + d[4]*6 + d[5]*5 + d[6]*4 + d[7]*3 + d[8]*2;
    const mod = sum % 11;
    let dv = 11 - mod;
    if (dv >= 10) dv = 0;
    return { computedDV: String(dv), expectedLength: 10 };
  }

  if (activeUf === 'PR') {
    if (cleaned.length !== 10) return { computedDV: '', expectedLength: 10 };
    const d = Array.from(cleaned).map(Number);
    
    const sum1 = d[0]*3 + d[1]*2 + d[2]*7 + d[3]*6 + d[4]*5 + d[5]*4 + d[6]*3 + d[7]*2;
    const mod1 = sum1 % 11;
    const dv1 = mod1 < 2 ? 0 : 11 - mod1;

    const sum2 = d[0]*4 + d[1]*3 + d[2]*2 + d[3]*7 + d[4]*6 + d[5]*5 + d[6]*4 + d[7]*3 + dv1*2;
    const mod2 = sum2 % 11;
    const dv2 = mod2 < 2 ? 0 : 11 - mod2;

    return { computedDV: `${dv1}${dv2}`, expectedLength: 10 };
  }

  if (cleaned.length !== len) {
    return { computedDV: '', expectedLength: len };
  }

  const d = Array.from(cleaned).map(Number);
  const baseLen = len - 1;
  let weight = 2;
  let sum = 0;
  for (let i = baseLen - 1; i >= 0; i--) {
    sum += d[i] * weight;
    weight++;
    if (weight > 9) weight = 2;
  }
  const mod = sum % 11;
  const dv = mod < 2 ? 0 : 11 - mod;

  return { computedDV: String(dv), expectedLength: len };
}

export function formatIE(rawIe: string, uf: string): string {
  const cleaned = rawIe.replace(/[^0-9]/g, '');
  const activeUf = uf.toUpperCase();

  if (activeUf === 'SP' && cleaned.length === 12) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}.${cleaned.slice(9, 12)}`;
  }
  if (activeUf === 'RJ' && cleaned.length === 8) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 7)}-${cleaned.slice(7)}`;
  }
  if (activeUf === 'MG' && cleaned.length === 13) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}/${cleaned.slice(9, 13)}`;
  }
  if (activeUf === 'RS' && cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}/${cleaned.slice(3, 10)}`;
  }
  if (activeUf === 'PR' && cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 8)}-${cleaned.slice(8, 10)}`;
  }
  if (activeUf === 'CE' && cleaned.length === 9) {
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
  }
  if (activeUf === 'BA' && cleaned.length === 9) {
    return `${cleaned.slice(0, 6)}-${cleaned.slice(6, 8)}${cleaned[8]}`;
  }
  if (activeUf === 'GO' && cleaned.length === 9) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned[8]}`;
  }
  if (activeUf === 'SC' && cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}`;
  }
  if (activeUf === 'DF' && cleaned.length === 13) {
    return `${cleaned.slice(0, 11)}-${cleaned.slice(11, 13)}`;
  }
  if (activeUf === 'PE' && cleaned.length === 9) {
    return `${cleaned.slice(0, 7)}-${cleaned.slice(7, 9)}`;
  }
  
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, cleaned.length - 1)}-${cleaned.slice(cleaned.length - 1)}`;
  }
  return cleaned;
}

export function validateInscricaoEstadual(rawIe: string, uf: string): ValidationResult {
  const cleaned = rawIe.replace(/[^0-9]/g, '');
  const activeUf = uf.toUpperCase();

  if (!STATE_IE_CONFIGS[activeUf]) {
    return {
      isValid: false,
      message: 'UF inválida ou não suportada para Inscrição Estadual.',
      details: {
        type: 'IE',
        format: 'unknown',
        cleanedValue: cleaned,
        errorReason: `UF "${uf}" não cadastrada.`
      }
    };
  }

  const config = STATE_IE_CONFIGS[activeUf];
  const expectedLen = config.length;

  if (cleaned.length !== expectedLen) {
    return {
      isValid: false,
      message: `Inscrição Estadual de ${activeUf} deve conter exatamente ${expectedLen} dígitos.`,
      details: {
        type: 'IE',
        format: 'numeric',
        cleanedValue: cleaned,
        errorReason: `Comprimento informado (${cleaned.length}) diferente do esperado (${expectedLen}).`
      }
    };
  }

  if (config.startsWith && config.startsWith.length > 0) {
    const ok = config.startsWith.some(pref => cleaned.startsWith(pref));
    if (!ok) {
      return {
        isValid: false,
        message: `Inscrição Estadual de ${activeUf} deve começar com ${config.startsWith.join(' ou ')}.`,
        details: {
          type: 'IE',
          format: 'numeric',
          cleanedValue: cleaned,
          errorReason: `Prefixo de estado inválido.`
        }
      };
    }
  }

  const { computedDV, error } = computeIECD(cleaned, activeUf);

  if (error) {
    return {
      isValid: false,
      message: `Erro ao validar: ${error}`,
      details: {
        type: 'IE',
        format: 'numeric',
        cleanedValue: cleaned,
        errorReason: error
      }
    };
  }

  const dvLen = computedDV.length;
  const actualDV = cleaned.slice(expectedLen - dvLen);
  const isValid = actualDV === computedDV;

  return {
    isValid,
    message: isValid 
      ? `Inscrição Estadual de ${activeUf} é válida e consistente!` 
      : `Inscrição Estadual de ${activeUf} inválida (dígitos verificadores inconsistentes).`,
    details: {
      type: 'IE',
      format: 'numeric',
      cleanedValue: cleaned,
      actualCheckDigits: actualDV,
      computedCheckDigits: computedDV,
      state: activeUf,
      errorReason: isValid ? undefined : `Dígitos verificadores calculados (${computedDV}) não conferem com o informado (${actualDV}).`
    }
  };
}
