export interface Pessoa {
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  nascimento: string;
  genero: string;
  celular: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
  signo: string;
  tipoSanguineo: string;
  altura: string;
  peso: string;
}

export interface Empresa {
  nomeEmpresa: string;
  cnpj: string;
  telefone: string;
  dataAbertura: string;
  cep: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  email: string;
  inscricaoEstadual?: string;
}

export interface CartaoCredito {
  numero: string;
  bandeira: string;
  validade: string;
  cvv: string;
  nomeTitular: string;
}

export interface ContaBancaria {
  banco: string;
  agencia: string;
  conta: string;
  digito: string;
  tipo: string;
}

export interface Veiculo {
  marca: string;
  modelo: string;
  cor: string;
  placa: string;
  chassis: string;
  renavam: string;
}

export type GeneratorFieldType =
  | 'nome'
  | 'cpf'
  | 'rg'
  | 'email'
  | 'nascimento'
  | 'genero'
  | 'celular'
  | 'telefone'
  | 'cep'
  | 'endereco'
  | 'numero'
  | 'bairro'
  | 'cidade'
  | 'estado'
  | 'signo'
  | 'tipoSanguineo'
  | 'cartao_numero'
  | 'cartao_bandeira'
  | 'cartao_validade'
  | 'cartao_cvv'
  | 'empresa_nome'
  | 'empresa_cnpj'
  | 'empresa_cnpj_alfanumerico'
  | 'inscricao_estadual'
  | 'banco_nome'
  | 'banco_agencia'
  | 'banco_conta'
  | 'veiculo_marca'
  | 'veiculo_modelo'
  | 'veiculo_placa'
  | 'veiculo_cor'
  | 'texto_paragrafo'
  | 'texto_frase'
  | 'finance_transacao_id'
  | 'finance_valor'
  | 'finance_data'
  | 'finance_categoria'
  | 'finance_metodo'
  | 'finance_saldo'
  | 'saude_cns'
  | 'saude_alergia'
  | 'saude_historico'
  | 'saude_pressao'
  | 'saude_tipoSanguineo'
  | 'saude_especialidade'
  | 'produto_nome'
  | 'produto_categoria'
  | 'produto_descricao'
  | 'produto_preco'
  | 'produto_sku'
  | 'produto_estoque';

export interface ValidationRules {
  required?: boolean;
  emailFormat?: boolean;
  minNumber?: number;
  maxNumber?: number;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  customPrefix?: string;
  customSuffix?: string;
  cardBrand?: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'ALEATORIO';
  stateUf?: string;
  gender?: 'M' | 'F' | 'A';
}

export interface ColumnDefinition {
  id: string;
  name: string;
  type: GeneratorFieldType;
  validationRules?: ValidationRules;
}

export interface SavedProfile {
  id: string;
  name: string;
  columns: ColumnDefinition[];
  createdAt: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
}
