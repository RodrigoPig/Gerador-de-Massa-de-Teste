import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, Plus, Trash, Download, FileJson, FileText, RefreshCw, AlertCircle, Save, FolderOpen, ChevronRight, Share2, Copy, Settings, Import, Check, AlertTriangle
} from 'lucide-react';
import { generateFieldData, generatePessoa, generateCreditCard, generateEmpresa, generateContaBancaria, generateVeiculo } from '../utils/generators';
import { ColumnDefinition, GeneratorFieldType, SavedProfile, UserSession, ValidationRules } from '../types';

interface BulkGeneratorProps {}

const DEFAULT_COLUMNS: ColumnDefinition[] = [
  { id: '1', name: 'Nome Completo', type: 'nome' },
  { id: '2', name: 'CPF de Teste', type: 'cpf' },
  { id: '3', name: 'E-mail', type: 'email' },
  { id: '4', name: 'Celular', type: 'celular' },
  { id: '5', name: 'Cidade', type: 'cidade' }
];

const FIELD_LABELS: Record<GeneratorFieldType, string> = {
  nome: 'Nome Completo',
  cpf: 'CPF',
  rg: 'RG',
  email: 'E-mail',
  nascimento: 'Data de Nascimento',
  genero: 'Gênero',
  celular: 'Celular',
  telefone: 'Telefone Fixo',
  cep: 'CEP',
  endereco: 'Logradouro',
  numero: 'Número Residencial',
  bairro: 'Bairro',
  cidade: 'Cidade',
  estado: 'Estado',
  tipoSanguineo: 'Tipo Sanguíneo',
  signo: 'Signo do Zodíaco',
  cartao_numero: 'Cartão: Número',
  cartao_bandeira: 'Cartão: Bandeira',
  cartao_validade: 'Cartão: Validade',
  cartao_cvv: 'Cartão: CVV',
  empresa_nome: 'Empresa: Razão Social',
  empresa_cnpj: 'Empresa: CNPJ',
  empresa_cnpj_alfanumerico: 'Empresa: CNPJ Alfanumérico',
  inscricao_estadual: 'Inscrição Estadual (IE)',
  banco_nome: 'Banco: Nome',
  banco_agencia: 'Banco: Agência',
  banco_conta: 'Banco: Conta',
  veiculo_marca: 'Veículo: Marca',
  veiculo_modelo: 'Veículo: Modelo',
  veiculo_placa: 'Veículo: Placa',
  veiculo_cor: 'Veículo: Cor',
  texto_paragrafo: 'Texto: Parágrafo',
  texto_frase: 'Texto: Frase',

  // Financial
  finance_transacao_id: 'Finanças: ID da Transação',
  finance_valor: 'Finanças: Valor da Transação',
  finance_data: 'Finanças: Data/Hora da Transação',
  finance_categoria: 'Finanças: Categoria da Despesa',
  finance_metodo: 'Finanças: Método de Pagamento',
  finance_saldo: 'Finanças: Saldo em Conta',

  // Health
  saude_cns: 'Saúde: Cartão do SUS (CNS)',
  saude_alergia: 'Saúde: Alergias',
  saude_historico: 'Saúde: Histórico Médico',
  saude_pressao: 'Saúde: Pressão Arterial',
  saude_tipoSanguineo: 'Saúde: Tipo Sanguíneo',
  saude_especialidade: 'Saúde: Especialidade Médica',

  // Product
  produto_nome: 'Produto: Nome comercial',
  produto_categoria: 'Produto: Categoria',
  produto_descricao: 'Produto: Descrição resumida',
  produto_preco: 'Produto: Preço final',
  produto_sku: 'Produto: Código de SKU',
  produto_estoque: 'Produto: Estoque disponível',
};

export default function BulkGenerator() {
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_COLUMNS);
  const [rowCount, setRowCount] = useState<number>(50);
  const [generatedData, setGeneratedData] = useState<Record<string, any>[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Profile states
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [shareInputCode, setShareInputCode] = useState('');
  const [profileActionMsg, setProfileActionMsg] = useState({ text: '', isError: false });

  // Columns & validation config state
  const [editingRulesColId, setEditingRulesColId] = useState<string | null>(null);
  const [colName, setColName] = useState('');
  const [colType, setColType] = useState<GeneratorFieldType>('nome');

  // Interactive Batch Preset States
  const [presetTab, setPresetTab] = useState<'pessoas' | 'empresas' | 'cartoes' | 'bancos' | 'veiculos'>('pessoas');
  const [personCount, setPersonCount] = useState<number>(100);
  const [personGender, setPersonGender] = useState<'A' | 'M' | 'F'>('A');
  const [personState, setPersonState] = useState<string>('A');

  const [companyCount, setCompanyCount] = useState<number>(50);
  const [companyState, setCompanyState] = useState<string>('A');
  const [companyCnpjType, setCompanyCnpjType] = useState<'numeric' | 'alphanumeric'>('numeric');

  const [cardCount, setCardCount] = useState<number>(50);
  const [cardBrandPreference, setCardBrandPreference] = useState<'ALEATORIO' | 'VISA' | 'MASTERCARD' | 'AMEX' | 'ELO'>('ALEATORIO');

  const [bankCount, setBankCount] = useState<number>(50);
  const [vehicleCount, setVehicleCount] = useState<number>(50);

  // Configuration of invalid data to simulate negative edge case testing
  const [invalidConfig, setInvalidConfig] = useState({
    nome: false,
    cpf: false,
    rg: false,
    email: false,
    cnpj: false,
    cartao: false,
    banco: false,
    veiculo: false,
  });

  // Trigger cohesive generator
  const triggerGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const results: Record<string, any>[] = [];
      for (let i = 0; i < rowCount; i++) {
        const row: Record<string, any> = {};
        
        // Compute shared contexts per-row based on rules or randomly if multiple match
        const firstCardCol = columns.find(c => c.type === 'cartao_numero' || c.type === 'cartao_bandeira');
        const cardBrandRule = firstCardCol?.validationRules?.cardBrand;
        const finalCardBrand = cardBrandRule && cardBrandRule !== 'ALEATORIO' 
          ? cardBrandRule.toLowerCase() 
          : ['visa', 'mastercard', 'amex', 'elo'][Math.floor(Math.random() * 4)];
        
        const card = generateCreditCard(finalCardBrand);
        
        const genderRule = columns.find(c => c.type === 'nome' || c.type === 'cpf')?.validationRules?.gender || 'A';
        const stateRule = columns.find(c => c.type === 'cep' || c.type === 'cidade' || c.type === 'estado')?.validationRules?.stateUf || 'A';
        const pessoa = generatePessoa(genderRule, stateRule);
        
        const hasAlphanumericCnpj = columns.some(c => c.type === 'empresa_cnpj_alfanumerico');
        const empresa = generateEmpresa(stateRule, hasAlphanumericCnpj);
        const conta = generateContaBancaria();
        const veiculo = generateVeiculo();

        columns.forEach(col => {
          let val: any = '';
          const rules = col.validationRules || {};

          // Align fields in the same row
          if (col.type === 'nome') {
            if (invalidConfig.nome) {
              const badNames = [`${pessoa.nome.split(' ')[0]}_123`, `J0hn D03!`, `TEST_USER_${Math.floor(Math.random() * 100)}`, `A`, `null`];
              val = badNames[Math.floor(Math.random() * badNames.length)];
            } else {
              val = pessoa.nome;
            }
          }
          else if (col.type === 'cpf') {
            if (invalidConfig.cpf) {
              const badCpfs = [`111.111.111-11`, `123.456.789-00`, `000.000.000-00`, `123.456.789-99`, `123.456.78`];
              val = badCpfs[Math.floor(Math.random() * badCpfs.length)];
            } else {
              val = pessoa.cpf;
            }
          }
          else if (col.type === 'rg') {
            if (invalidConfig.rg) {
              const badRgs = [`12.34A.567-X`, `RG_INVALIDO_99`, `000000000`, `1.2.3`];
              val = badRgs[Math.floor(Math.random() * badRgs.length)];
            } else {
              val = pessoa.rg;
            }
          }
          else if (col.type === 'email') {
            if (invalidConfig.email) {
              const badEmails = [`rodrigo.com`, `Rodrigo@teste`, `user@.com`, `@domain.com`, `semarrobateste.com`];
              val = badEmails[Math.floor(Math.random() * badEmails.length)];
            } else {
              val = pessoa.email;
            }
          }
          else if (col.type === 'nascimento') val = pessoa.nascimento;
          else if (col.type === 'genero') val = pessoa.genero;
          else if (col.type === 'celular') val = pessoa.celular;
          else if (col.type === 'telefone') val = pessoa.telefone;
          else if (col.type === 'cep') val = pessoa.cep;
          else if (col.type === 'endereco') val = pessoa.endereco;
          else if (col.type === 'numero') val = pessoa.numero;
          else if (col.type === 'bairro') val = pessoa.bairro;
          else if (col.type === 'cidade') val = pessoa.cidade;
          else if (col.type === 'estado') val = pessoa.estado;
          else if (col.type === 'signo') val = pessoa.signo;
          else if (col.type === 'tipoSanguineo' || col.type === 'saude_tipoSanguineo') val = pessoa.tipoSanguineo;
          else if (col.type === 'cartao_numero') {
            if (invalidConfig.cartao) {
              const badNums = ['1234 5678 1234 5678', '9999 9999 9999 9999', '1111 2222 3333 4444'];
              val = badNums[Math.floor(Math.random() * badNums.length)];
            } else {
              val = card.numero;
            }
          }
          else if (col.type === 'cartao_bandeira') val = card.bandeira;
          else if (col.type === 'cartao_validade') {
            if (invalidConfig.cartao) {
              const badValids = ['12/2012', '05/1999', '01/2021', '02/2020'];
              val = badValids[Math.floor(Math.random() * badValids.length)];
            } else {
              val = card.validade;
            }
          }
          else if (col.type === 'cartao_cvv') {
            if (invalidConfig.cartao) {
              val = '00';
            } else {
              val = card.cvv;
            }
          }
          else if (col.type === 'empresa_nome') val = empresa.nomeEmpresa;
          else if (col.type === 'empresa_cnpj' || col.type === 'empresa_cnpj_alfanumerico') {
            if (invalidConfig.cnpj) {
              const badCnpjs = [`00.000.000/0000-00`, `12.345.678/0001-99`, `99.999.999/9999-99`, `12.345.678/0001`];
              val = badCnpjs[Math.floor(Math.random() * badCnpjs.length)];
            } else {
              val = empresa.cnpj;
            }
          }
          else if (col.type === 'banco_nome') {
            if (invalidConfig.banco) {
              val = '999 - Banco Inexistente';
            } else {
              val = conta.banco;
            }
          }
          else if (col.type === 'banco_agencia') {
            if (invalidConfig.banco) {
              val = '0000';
            } else {
              val = conta.agencia;
            }
          }
          else if (col.type === 'banco_conta') {
            if (invalidConfig.banco) {
              val = '99999-';
            } else {
              val = `${conta.conta}-${conta.digito}`;
            }
          }
          else if (col.type === 'veiculo_marca') val = veiculo.marca;
          else if (col.type === 'veiculo_modelo') val = veiculo.modelo;
          else if (col.type === 'veiculo_placa') {
            if (invalidConfig.veiculo) {
              const badPlates = [`ABC-12`, `PLACA_INVALIDA`, `AAA-99999`, `1234-XYZ`];
              val = badPlates[Math.floor(Math.random() * badPlates.length)];
            } else {
              val = veiculo.placa;
            }
          }
          else if (col.type === 'veiculo_cor') val = veiculo.cor;
          else {
            val = generateFieldData(col.type, rules);
          }

          // Apply post-processing prefix / suffix from custom rules
          if (rules.customPrefix) val = `${rules.customPrefix}${val}`;
          if (rules.customSuffix) val = `${val}${rules.customSuffix}`;

          row[col.name] = val;
        });
        results.push(row);
      }
      setGeneratedData(results);
      setIsGenerating(false);
    }, 450);
  };

  const applyPersonPreset = () => {
    setIsGenerating(true);
    const pColumns: ColumnDefinition[] = [
      { id: 'p1', name: 'Nome Completo', type: 'nome', validationRules: { gender: personGender, stateUf: personState } },
      { id: 'p2', name: 'CPF de Teste', type: 'cpf', validationRules: { gender: personGender, stateUf: personState } },
      { id: 'p3', name: 'RG Emissor', type: 'rg' },
      { id: 'p4', name: 'Gênero', type: 'genero' },
      { id: 'p5', name: 'Data Nascimento', type: 'nascimento' },
      { id: 'p6', name: 'E-mail', type: 'email', validationRules: { emailFormat: true } },
      { id: 'p7', name: 'Celular', type: 'celular' },
      { id: 'p8', name: 'CEP', type: 'cep', validationRules: { stateUf: personState } },
      { id: 'p9', name: 'Cidade', type: 'cidade', validationRules: { stateUf: personState } },
      { id: 'p10', name: 'Estado', type: 'estado', validationRules: { stateUf: personState } }
    ];
    setColumns(pColumns);
    setRowCount(personCount);
    
    setTimeout(() => {
      const results: Record<string, any>[] = [];
      for (let i = 0; i < personCount; i++) {
        const row: Record<string, any> = {};
        const pObj = generatePessoa(personGender, personState);
        pColumns.forEach(col => {
          let val: any = '';
          if (col.type === 'nome') {
            if (invalidConfig.nome) {
              const badNames = [`${pObj.nome.split(' ')[0]}_123`, `J0hn D03!`, `TEST_USER_${Math.floor(Math.random() * 100)}`, `A`, `null`];
              val = badNames[Math.floor(Math.random() * badNames.length)];
            } else {
              val = pObj.nome;
            }
          }
          else if (col.type === 'cpf') {
            if (invalidConfig.cpf) {
              const badCpfs = [`111.111.111-11`, `123.456.789-00`, `000.000.000-00`, `123.456.789-99`, `123.456.78`];
              val = badCpfs[Math.floor(Math.random() * badCpfs.length)];
            } else {
              val = pObj.cpf;
            }
          }
          else if (col.type === 'rg') {
            if (invalidConfig.rg) {
              const badRgs = [`12.34A.567-X`, `RG_INVALIDO_99`, `000000000`, `1.2.3`];
              val = badRgs[Math.floor(Math.random() * badRgs.length)];
            } else {
              val = pObj.rg;
            }
          }
          else if (col.type === 'genero') val = pObj.genero;
          else if (col.type === 'nascimento') val = pObj.nascimento;
          else if (col.type === 'email') {
            if (invalidConfig.email) {
              const badEmails = [`rodrigo.com`, `Rodrigo@teste`, `user@.com`, `@domain.com`, `semarrobateste.com`];
              val = badEmails[Math.floor(Math.random() * badEmails.length)];
            } else {
              val = pObj.email;
            }
          }
          else if (col.type === 'celular') val = pObj.celular;
          else if (col.type === 'cep') val = pObj.cep;
          else if (col.type === 'cidade') val = pObj.cidade;
          else if (col.type === 'estado') val = pObj.estado;
          row[col.name] = val;
        });
        results.push(row);
      }
      setGeneratedData(results);
      setIsGenerating(false);
      setProfileActionMsg({ text: `Lote de ${personCount} Pessoas Físicas foi construído e populado!`, isError: false });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 4000);
    }, 450);
  };

  const applyCardPreset = () => {
    setIsGenerating(true);
    const cColumns: ColumnDefinition[] = [
      { id: 'c1', name: 'Cartão Criptografado', type: 'cartao_numero', validationRules: { cardBrand: cardBrandPreference } },
      { id: 'c2', name: 'Bandeira Oficial', type: 'cartao_bandeira', validationRules: { cardBrand: cardBrandPreference } },
      { id: 'c3', name: 'Validade do Cartão', type: 'cartao_validade' },
      { id: 'c4', name: 'Código CVV', type: 'cartao_cvv' },
      { id: 'c5', name: 'Nome do Titular', type: 'nome' }
    ];
    setColumns(cColumns);
    setRowCount(cardCount);
    
    setTimeout(() => {
      const results: Record<string, any>[] = [];
      for (let i = 0; i < cardCount; i++) {
        const row: Record<string, any> = {};
        const finalBrand = cardBrandPreference === 'ALEATORIO' 
          ? ['visa', 'mastercard', 'amex', 'elo'][Math.floor(Math.random() * 4)]
          : cardBrandPreference.toLowerCase();
          
        const cardObj = generateCreditCard(finalBrand);
        cColumns.forEach(col => {
          let val: any = '';
          if (col.type === 'cartao_numero') {
            if (invalidConfig.cartao) {
              const badNums = ['1234 5678 1234 5678', '9999 9999 9999 9999', '1111 2222 3333 4444'];
              val = badNums[Math.floor(Math.random() * badNums.length)];
            } else {
              val = cardObj.numero;
            }
          }
          else if (col.type === 'cartao_bandeira') val = cardObj.bandeira;
          else if (col.type === 'cartao_validade') {
            if (invalidConfig.cartao) {
              const badValids = ['12/2012', '05/1999', '01/2021', '02/2020'];
              val = badValids[Math.floor(Math.random() * badValids.length)];
            } else {
              val = cardObj.validade;
            }
          }
          else if (col.type === 'cartao_cvv') {
            if (invalidConfig.cartao) {
              val = '00';
            } else {
              val = cardObj.cvv;
            }
          }
          else if (col.type === 'nome') {
            if (invalidConfig.nome) {
              const badNames = [`${cardObj.nomeTitular.split(' ')[0]}_123`, `J0hn D03!`, `TEST_USER_${Math.floor(Math.random() * 100)}`, `A`, `null`];
              val = badNames[Math.floor(Math.random() * badNames.length)];
            } else {
              val = cardObj.nomeTitular;
            }
          }
          row[col.name] = val;
        });
        results.push(row);
      }
      setGeneratedData(results);
      setIsGenerating(false);
      setProfileActionMsg({ text: `Lote de ${cardCount} Cartões (${cardBrandPreference === 'ALEATORIO' ? 'Diferentes bandeiras' : 'Bandeira ' + cardBrandPreference}) foi construído e populado!`, isError: false });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 4000);
    }, 450);
  };

  const applyCompanyPreset = () => {
    setIsGenerating(true);
    const cnpjColType = companyCnpjType === 'alphanumeric' ? 'empresa_cnpj_alfanumerico' : 'empresa_cnpj';
    const coColumns: ColumnDefinition[] = [
      { id: 'co1', name: 'Razão Social', type: 'empresa_nome', validationRules: { stateUf: companyState } },
      { id: 'co2', name: companyCnpjType === 'alphanumeric' ? 'CNPJ Alfanumérico' : 'CNPJ', type: cnpjColType, validationRules: { stateUf: companyState } },
      { id: 'co3', name: 'Telefone Comercial', type: 'telefone' },
      { id: 'co4', name: 'E-mail Comercial', type: 'email' },
      { id: 'co5', name: 'CEP', type: 'cep', validationRules: { stateUf: companyState } },
      { id: 'co6', name: 'Endereço', type: 'endereco' },
      { id: 'co7', name: 'Bairro', type: 'bairro' },
      { id: 'co8', name: 'Cidade', type: 'cidade', validationRules: { stateUf: companyState } },
      { id: 'co9', name: 'Estado', type: 'estado', validationRules: { stateUf: companyState } }
    ];
    setColumns(coColumns);
    setRowCount(companyCount);

    setTimeout(() => {
      const results: Record<string, any>[] = [];
      for (let i = 0; i < companyCount; i++) {
        const row: Record<string, any> = {};
        const companyObj = generateEmpresa(companyState, companyCnpjType === 'alphanumeric');
        coColumns.forEach(col => {
          let val: any = '';
          if (col.type === 'empresa_nome') val = companyObj.nomeEmpresa;
          else if (col.type === 'empresa_cnpj' || col.type === 'empresa_cnpj_alfanumerico') {
            if (invalidConfig.cnpj) {
              const badCnpjs = [`00.000.000/0000-00`, `12.345.678/0001-99`, `99.999.999/9999-99`, `12.345.678/0001`];
              val = badCnpjs[Math.floor(Math.random() * badCnpjs.length)];
            } else {
              val = companyObj.cnpj;
            }
          }
          else if (col.type === 'telefone') val = companyObj.telefone;
          else if (col.type === 'email') {
            if (invalidConfig.email) {
              const badEmails = [`rodrigo.com`, `Rodrigo@teste`, `user@.com`, `@domain.com`, `semarrobateste.com`];
              val = badEmails[Math.floor(Math.random() * badEmails.length)];
            } else {
              val = companyObj.email;
            }
          }
          else if (col.type === 'cep') val = companyObj.cep;
          else if (col.type === 'endereco') val = companyObj.endereco;
          else if (col.type === 'bairro') val = companyObj.bairro;
          else if (col.type === 'cidade') val = companyObj.cidade;
          else if (col.type === 'estado') val = companyObj.estado;
          row[col.name] = val;
        });
        results.push(row);
      }
      setGeneratedData(results);
      setIsGenerating(false);
      setProfileActionMsg({ text: `Lote de ${companyCount} Empresas (Massa de CNPJ) foi construído e populado!`, isError: false });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 4000);
    }, 450);
  };

  const applyBankPreset = () => {
    setIsGenerating(true);
    const baColumns: ColumnDefinition[] = [
      { id: 'ba1', name: 'Nome Titular', type: 'nome' },
      { id: 'ba2', name: 'Banco Parceiro', type: 'banco_nome' },
      { id: 'ba3', name: 'Agência', type: 'banco_agencia' },
      { id: 'ba4', name: 'Conta Corrente', type: 'banco_conta' }
    ];
    setColumns(baColumns);
    setRowCount(bankCount);

    setTimeout(() => {
      const results: Record<string, any>[] = [];
      for (let i = 0; i < bankCount; i++) {
        const row: Record<string, any> = {};
        const bankObj = generateContaBancaria();
        const firstPerson = generatePessoa('A', 'A');
        baColumns.forEach(col => {
          let val: any = '';
          if (col.type === 'banco_nome') {
            if (invalidConfig.banco) {
              val = '999 - Banco Inexistente';
            } else {
              val = bankObj.banco;
            }
          }
          else if (col.type === 'banco_agencia') {
            if (invalidConfig.banco) {
              val = '0000';
            } else {
              val = bankObj.agencia;
            }
          }
          else if (col.type === 'banco_conta') {
            if (invalidConfig.banco) {
              val = '99999-';
            } else {
              val = `${bankObj.conta}-${bankObj.digito}`;
            }
          }
          else if (col.type === 'nome') {
            if (invalidConfig.nome) {
              const badNames = [`${firstPerson.nome.split(' ')[0]}_123`, `J0hn D03!`, `TEST_USER_${Math.floor(Math.random() * 100)}`, `A`, `null`];
              val = badNames[Math.floor(Math.random() * badNames.length)];
            } else {
              val = firstPerson.nome;
            }
          }
          row[col.name] = val;
        });
        results.push(row);
      }
      setGeneratedData(results);
      setIsGenerating(false);
      setProfileActionMsg({ text: `Lote de ${bankCount} Contas Bancárias foi construído e populado!`, isError: false });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 4000);
    }, 450);
  };

  const applyVehiclePreset = () => {
    setIsGenerating(true);
    const veColumns: ColumnDefinition[] = [
      { id: 've1', name: 'Marca do Veículo', type: 'veiculo_marca' },
      { id: 've2', name: 'Modelo do Veículo', type: 'veiculo_modelo' },
      { id: 've3', name: 'Cor Predominante', type: 'veiculo_cor' },
      { id: 've4', name: 'Placa Gerada', type: 'veiculo_placa' }
    ];
    setColumns(veColumns);
    setRowCount(vehicleCount);

    setTimeout(() => {
      const results: Record<string, any>[] = [];
      for (let i = 0; i < vehicleCount; i++) {
        const row: Record<string, any> = {};
        const vehicleObj = generateVeiculo();
        veColumns.forEach(col => {
          let val: any = '';
          if (col.type === 'veiculo_marca') val = vehicleObj.marca;
          else if (col.type === 'veiculo_modelo') val = vehicleObj.modelo;
          else if (col.type === 'veiculo_cor') val = vehicleObj.cor;
          else if (col.type === 'veiculo_placa') {
            if (invalidConfig.veiculo) {
              const badPlates = [`ABC-12`, `PLACA_INVALIDA`, `AAA-99999`, `1234-XYZ`];
              val = badPlates[Math.floor(Math.random() * badPlates.length)];
            } else {
              val = vehicleObj.placa;
            }
          }
          row[col.name] = val;
        });
        results.push(row);
      }
      setGeneratedData(results);
      setIsGenerating(false);
      setProfileActionMsg({ text: `Lote de ${vehicleCount} Veículos foi construído e populado!`, isError: false });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 4000);
    }, 450);
  };

  useEffect(() => {
    triggerGenerate();
  }, [rowCount, invalidConfig]);

  // Load saved user Profiles
  const loadProfiles = () => {
    const storedProfilesRaw = localStorage.getItem('mock_generator_global_profiles');
    if (storedProfilesRaw) {
      setProfiles(JSON.parse(storedProfilesRaw));
    } else {
      setProfiles([]);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;

    // Check unique header name
    const alreadyExists = columns.some(c => c.name.toLowerCase() === colName.trim().toLowerCase());
    if (alreadyExists) {
      setProfileActionMsg({ text: 'Já existe uma coluna com este nome de cabeçalho.', isError: true });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 2500);
      return;
    }

    const newCol: ColumnDefinition = {
      id: Date.now().toString(),
      name: colName.trim(),
      type: colType,
      validationRules: {}
    };

    setColumns([...columns, newCol]);
    setColName('');
  };

  const handleRemoveColumn = (id: string) => {
    // Keep at least one column
    if (columns.length <= 1) {
      setProfileActionMsg({ text: 'A tabela de teste precisa de pelo menos uma coluna.', isError: true });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 2500);
      return;
    }
    if (editingRulesColId === id) {
      setEditingRulesColId(null);
    }
    setColumns(columns.filter(c => c.id !== id));
  };

  const handleUpdateValidationRules = (colId: string, rules: ValidationRules) => {
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, validationRules: rules } : c));
  };

  // Profile saving handler logic
  const handleSaveProfile = () => {
    if (!newProfileName.trim()) {
      setProfileActionMsg({ text: 'Digite o nome do perfil de teste.', isError: true });
      return;
    }

    const newProfile: SavedProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      columns,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    const updatedProfiles = [...profiles, newProfile];

    localStorage.setItem('mock_generator_global_profiles', JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
    setNewProfileName('');
    setProfileActionMsg({ text: 'Perfil de colunas e regras salvo com sucesso!', isError: false });
    setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 2500);
  };

  const handleApplyProfile = (profile: SavedProfile) => {
    setColumns(profile.columns);
    setProfileActionMsg({ text: `Perfil "${profile.name}" aplicado!`, isError: false });
    setTimeout(() => {
      setProfileActionMsg({ text: '', isError: false });
      // Trigger a raw regenerate using active columns
      const results: Record<string, any>[] = [];
      for (let i = 0; i < rowCount; i++) {
        const row: Record<string, any> = {};
        profile.columns.forEach(col => {
          row[col.name] = generateFieldData(col.type, col.validationRules);
        });
        results.push(row);
      }
      setGeneratedData(results);
    }, 1000);
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedProfiles = profiles.filter(p => p.id !== id);

    localStorage.setItem('mock_generator_global_profiles', JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
    setProfileActionMsg({ text: 'Perfil excluído.', isError: false });
    setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 1500);
  };

  // Shared Profile Import & Export
  const handleShareProfileCode = (profile: SavedProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const payload = JSON.stringify({
        name: profile.name,
        columns: profile.columns
      });
      const encoded = btoa(encodeURIComponent(payload));
      navigator.clipboard.writeText(encoded);
      setProfileActionMsg({ text: `Código do perfil "${profile.name}" copiado! Compartilhe com outros usuários.`, isError: false });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 3500);
    } catch {
      setProfileActionMsg({ text: 'Erro ao gerar o código do perfil.', isError: true });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 2000);
    }
  };

  const handleImportProfileCode = () => {
    if (!shareInputCode.trim()) {
      setProfileActionMsg({ text: 'Cole o código no campo de importação.', isError: true });
      return;
    }
    try {
      const decoded = decodeURIComponent(atob(shareInputCode.trim()));
      const parsed = JSON.parse(decoded);
      if (!parsed.name || !Array.isArray(parsed.columns)) {
        throw new Error('Incompatível');
      }

      const importedProfile: SavedProfile = {
        id: Date.now().toString(),
        name: `${parsed.name} (Compartilhado)`,
        columns: parsed.columns,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };

      const updatedProfiles = [...profiles, importedProfile];

      localStorage.setItem('mock_generator_global_profiles', JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      setShareInputCode('');
      setProfileActionMsg({ text: `Perfil "${parsed.name}" importado e carregado!`, isError: false });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 3000);
    } catch {
      setProfileActionMsg({ text: 'Código de compartilhamento inválido.', isError: true });
      setTimeout(() => setProfileActionMsg({ text: '', isError: false }), 2500);
    }
  };

  // File download formatting
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `massa_dados_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    if (generatedData.length === 0) return;
    const headers = columns.map(c => c.name);
    
    const escape = (val: any) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headerRow = headers.map(escape).join(',');
    const bodyRows = generatedData.map(row => 
      headers.map(header => escape(row[header])).join(',')
    );

    const csvContent = '\uFEFF' + [headerRow, ...bodyRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `massa_dados_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportTXT = () => {
    if (generatedData.length === 0) return;
    const headers = columns.map(c => c.name);
    
    let txtContent = "";
    txtContent += "==================================================================\n";
    txtContent += "MASSA DE GERAÇÃO EM LOTE - GERADOR DE TESTES\n";
    txtContent += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
    txtContent += `Total de Registros: ${generatedData.length}\n`;
    txtContent += "==================================================================\n\n";

    generatedData.forEach((row, idx) => {
      txtContent += `[REGISTRO #${idx + 1}]\n`;
      headers.forEach(header => {
        txtContent += `  ${header}: ${row[header] ?? ''}\n`;
      });
      txtContent += "------------------------------------------------------------------\n";
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `massa_dados_${Date.now()}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  // Cell and dataset validation
  const validateCell = (value: any, col: ColumnDefinition): string | null => {
    const rules = col.validationRules;
    if (!rules) return null;
    const strVal = String(value ?? '');

    if (rules.required && !strVal) {
      return 'Obrigatório';
    }
    if (rules.emailFormat && strVal) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
        return 'E-mail inválido';
      }
    }
    if (rules.minLength !== undefined && strVal.length < rules.minLength) {
      return `Mín. de ${rules.minLength} letras`;
    }
    if (rules.maxLength !== undefined && strVal.length > rules.maxLength) {
      return `Máx. de ${rules.maxLength} letras`;
    }
    if (rules.customPrefix && !strVal.startsWith(rules.customPrefix)) {
      return `Inicia com "${rules.customPrefix}"`;
    }
    if (rules.customSuffix && !strVal.endsWith(rules.customSuffix)) {
      return `Termina com "${rules.customSuffix}"`;
    }
    if (rules.minNumber !== undefined || rules.maxNumber !== undefined) {
      const clean = strVal.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
      const num = parseFloat(clean);
      if (!isNaN(num)) {
        if (rules.minNumber !== undefined && num < rules.minNumber) {
          return `Mínimo R$ ${rules.minNumber}`;
        }
        if (rules.maxNumber !== undefined && num > rules.maxNumber) {
          return `Máximo R$ ${rules.maxNumber}`;
        }
      }
    }
    if (rules.regex) {
      try {
        const rx = new RegExp(rules.regex);
        if (!rx.test(strVal)) {
          return 'Viola formato Regex';
        }
      } catch {
        // Safe check
      }
    }
    return null;
  };

  const getValidationFailures = () => {
    const list: { rowIndex: number; colName: string; error: string }[] = [];
    generatedData.forEach((row, idx) => {
      columns.forEach(col => {
        const err = validateCell(row[col.name], col);
        if (err) {
          list.push({ rowIndex: idx + 1, colName: col.name, error: err });
        }
      });
    });
    return list;
  };

  const failures = getValidationFailures();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* COLUMN BUILDER LEFT PANEL */}
      <div className="lg:col-span-5 space-y-6">

        {/* Lote Presets Container */}
        <div className="bg-white border border-brand-beige-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal tracking-tight flex items-center gap-2 font-sans">
                <FileSpreadsheet className="h-4.5 w-4.5 text-brand-sage-deep" />
                Criadores Rápidos de Lote
              </h3>
              <p className="text-xs text-brand-sage-light font-medium mt-0.5">
                Monte instantaneamente uma massa regulada de pessoas ou cartões de crédito.
              </p>
            </div>
          </div>

          {/* Quick tab toggle */}
          <div className="flex flex-wrap gap-1 p-1 bg-brand-cream border border-brand-beige-border rounded-xl">
            <button
              type="button"
              onClick={() => setPresetTab('pessoas')}
              className={`flex-1 min-w-[70px] py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                presetTab === 'pessoas'
                  ? 'bg-brand-sage-deep text-white shadow-xs animate-none'
                  : 'text-brand-sage-light hover:text-brand-sage-deep'
              }`}
            >
              Pessoas
            </button>
            <button
              type="button"
              onClick={() => setPresetTab('empresas')}
              className={`flex-1 min-w-[70px] py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                presetTab === 'empresas'
                  ? 'bg-brand-sage-deep text-white shadow-xs animate-none'
                  : 'text-brand-sage-light hover:text-brand-sage-deep'
              }`}
            >
              Empresas
            </button>
            <button
              type="button"
              onClick={() => setPresetTab('cartoes')}
              className={`flex-1 min-w-[70px] py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                presetTab === 'cartoes'
                  ? 'bg-brand-sage-deep text-white shadow-xs animate-none'
                  : 'text-brand-sage-light hover:text-brand-sage-deep'
              }`}
            >
              Cartões
            </button>
            <button
              type="button"
              onClick={() => setPresetTab('bancos')}
              className={`flex-1 min-w-[70px] py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                presetTab === 'bancos'
                  ? 'bg-brand-sage-deep text-white shadow-xs animate-none'
                  : 'text-brand-sage-light hover:text-brand-sage-deep'
              }`}
            >
              Bancos
            </button>
            <button
              type="button"
              onClick={() => setPresetTab('veiculos')}
              className={`flex-1 min-w-[70px] py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                presetTab === 'veiculos'
                  ? 'bg-brand-sage-deep text-white shadow-xs animate-none'
                  : 'text-brand-sage-light hover:text-brand-sage-deep'
              }`}
            >
              Veículos
            </button>
          </div>

          <div className="pt-2">
            {presetTab === 'pessoas' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                      Quantidade
                    </label>
                    <select
                      value={personCount}
                      onChange={(e) => setPersonCount(Number(e.target.value))}
                      className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                    >
                      <option value="10">10 Pessoas</option>
                      <option value="50">50 Pessoas</option>
                      <option value="100">100 Pessoas</option>
                      <option value="250">250 Pessoas</option>
                      <option value="500">500 Pessoas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                      Gênero
                    </label>
                    <select
                      value={personGender}
                      onChange={(e) => setPersonGender(e.target.value as any)}
                      className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                    >
                      <option value="A">Misturado (Ambos)</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                    Região / UF de Origem
                  </label>
                  <select
                    value={personState}
                    onChange={(e) => setPersonState(e.target.value)}
                    className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                  >
                    <option value="A">Todos os Estados (Aleatório)</option>
                    <option value="AC">Acre (AC)</option>
                    <option value="AL">Alagoas (AL)</option>
                    <option value="AP">Amapá (AP)</option>
                    <option value="AM">Amazonas (AM)</option>
                    <option value="BA">Bahia (BA)</option>
                    <option value="CE">Ceará (CE)</option>
                    <option value="DF">Distrito Federal (DF)</option>
                    <option value="ES">Espírito Santo (ES)</option>
                    <option value="GO">Goiás (GO)</option>
                    <option value="MA">Maranhão (MA)</option>
                    <option value="MT">Mato Grosso (MT)</option>
                    <option value="MS">Mato Grosso do Sul (MS)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                    <option value="PA">Pará (PA)</option>
                    <option value="PB">Paraíba (PB)</option>
                    <option value="PR">Paraná (PR)</option>
                    <option value="PE">Pernambuco (PE)</option>
                    <option value="PI">Piauí (PI)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="RN">Rio Grande do Norte (RN)</option>
                    <option value="RS">Rio Grande do Sul (RS)</option>
                    <option value="RO">Rondônia (RO)</option>
                    <option value="RR">Roraima (RR)</option>
                    <option value="SC">Santa Catarina (SC)</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="SE">Sergipe (SE)</option>
                    <option value="TO">Tocantins (TO)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={applyPersonPreset}
                  className="w-full py-2.5 bg-brand-sage-deep hover:bg-[#525646] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Gerar Lote de {personCount} Pessoas Físicas</span>
                </button>
              </div>
            ) : presetTab === 'empresas' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                      Quantidade
                    </label>
                    <select
                      value={companyCount}
                      onChange={(e) => setCompanyCount(Number(e.target.value))}
                      className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                    >
                      <option value="10">10 Empresas</option>
                      <option value="50">50 Empresas</option>
                      <option value="100">100 Empresas</option>
                      <option value="250">250 Empresas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                      Região / Origem
                    </label>
                    <select
                      value={companyState}
                      onChange={(e) => setCompanyState(e.target.value)}
                      className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                    >
                      <option value="A">Todos os Estados</option>
                      <option value="AC">Acre (AC)</option>
                      <option value="AL">Alagoas (AL)</option>
                      <option value="AP">Amapá (AP)</option>
                      <option value="AM">Amazonas (AM)</option>
                      <option value="BA">Bahia (BA)</option>
                      <option value="CE">Ceará (CE)</option>
                      <option value="DF">Distrito Federal (DF)</option>
                      <option value="ES">Espírito Santo (ES)</option>
                      <option value="GO">Goiás (GO)</option>
                      <option value="MA">Maranhão (MA)</option>
                      <option value="MT">Mato Grosso (MT)</option>
                      <option value="MS">Mato Grosso do Sul (MS)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="PA">Pará (PA)</option>
                      <option value="PB">Paraíba (PB)</option>
                      <option value="PR">Paraná (PR)</option>
                      <option value="PE">Pernambuco (PE)</option>
                      <option value="PI">Piauí (PI)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                      <option value="RN">Rio Grande do Norte (RN)</option>
                      <option value="RS">Rio Grande do Sul (RS)</option>
                      <option value="RO">Rondônia (RO)</option>
                      <option value="RR">Roraima (RR)</option>
                      <option value="SC">Santa Catarina (SC)</option>
                      <option value="SP">São Paulo (SP)</option>
                      <option value="SE">Sergipe (SE)</option>
                      <option value="TO">Tocantins (TO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                      Formato de CNPJ
                    </label>
                    <select
                      value={companyCnpjType}
                      onChange={(e) => setCompanyCnpjType(e.target.value as 'numeric' | 'alphanumeric')}
                      className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                    >
                      <option value="numeric">Tradicional (Numérico)</option>
                      <option value="alphanumeric">Alfanumérico (RFB)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-brand-cream p-3 rounded-2xl border border-brand-beige-border/60 text-[11px] text-brand-muted leading-relaxed">
                  <span className="font-bold text-[#6B705C] block mb-0.5">Nota de Conformidade:</span>
                  Os CNPJs gerados contêm dígitos verificadores válidos e endereço corporativo fictício gerado de acordo com a região escolhida.
                </div>

                <button
                  type="button"
                  onClick={applyCompanyPreset}
                  className="w-full py-2.5 bg-brand-sage-deep hover:bg-[#525646] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Gerar Lote de {companyCount} Empresas (CNPJ)</span>
                </button>
              </div>
            ) : presetTab === 'cartoes' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                      Quantidade
                    </label>
                    <select
                      value={cardCount}
                      onChange={(e) => setCardCount(Number(e.target.value))}
                      className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                    >
                      <option value="10">10 Cartões</option>
                      <option value="50">50 Cartões</option>
                      <option value="100">100 Cartões</option>
                      <option value="200">200 Cartões</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                      Bandeiras
                    </label>
                    <select
                      value={cardBrandPreference}
                      onChange={(e) => setCardBrandPreference(e.target.value as any)}
                      className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                    >
                      <option value="ALEATORIO">Bandeiras diferentes (misto)</option>
                      <option value="VISA">Visa apenas (bandeiras iguais)</option>
                      <option value="MASTERCARD">Mastercard apenas (bandeiras iguais)</option>
                      <option value="AMEX">Amex apenas (bandeiras iguais)</option>
                      <option value="ELO">Elo apenas (bandeiras iguais)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-brand-cream p-3 rounded-2xl border border-brand-beige-border/60 text-[11px] text-brand-muted leading-relaxed">
                  <span className="font-bold text-[#6B705C] block mb-0.5">Nota de Integridade:</span>
                  Os cartões gerados serão congruentes (a bandeira selecionada criará números válidos de acordo com seu respectivo bin e dígito de Luhn).
                </div>

                <button
                  type="button"
                  onClick={applyCardPreset}
                  className="w-full py-2.5 bg-brand-sage-deep hover:bg-[#525646] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Gerar Lote de {cardCount} Cartões</span>
                </button>
              </div>
            ) : presetTab === 'bancos' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                    Quantidade de Contas
                  </label>
                  <select
                    value={bankCount}
                    onChange={(e) => setBankCount(Number(e.target.value))}
                    className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                  >
                    <option value="10">10 Contas</option>
                    <option value="50">50 Contas</option>
                    <option value="100">100 Contas</option>
                    <option value="200">200 Contas</option>
                  </select>
                </div>

                <div className="bg-brand-cream p-3 rounded-2xl border border-brand-beige-border/60 text-[11px] text-brand-muted leading-relaxed">
                  <span className="font-bold text-[#6B705C] block mb-0.5 font-sans">Dados Congruentes:</span>
                  Cada registro do lote incluirá o Nome do Titular vinculado a um Banco de compensação homologado, número de Agência e número de Conta com dígito verificador real.
                </div>

                <button
                  type="button"
                  onClick={applyBankPreset}
                  className="w-full py-2.5 bg-brand-sage-deep hover:bg-[#525646] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Gerar Lote de {bankCount} Contas Bancárias</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#6B705C] uppercase tracking-widest mb-1 font-sans">
                    Quantidade de Veículos
                  </label>
                  <select
                    value={vehicleCount}
                    onChange={(e) => setVehicleCount(Number(e.target.value))}
                    className="w-full bg-brand-cream text-xs px-2.5 py-1.5 border border-brand-beige-border rounded-xl focus:border-brand-sage-deep focus:outline-none text-brand-charcoal cursor-pointer"
                  >
                    <option value="10">10 Veículos</option>
                    <option value="50">50 Veículos</option>
                    <option value="100">100 Veículos</option>
                    <option value="200">200 Veículos</option>
                  </select>
                </div>

                <div className="bg-brand-cream p-3 rounded-2xl border border-brand-beige-border/60 text-[11px] text-brand-muted leading-relaxed">
                  <span className="font-bold text-[#6B705C] block mb-0.5 font-sans">Atributos de Frota:</span>
                  Cria uma massa coerente de veículos, incluindo Marca, Modelo nacional, Cor e Placa mercosul congruente.
                </div>

                <button
                  type="button"
                  onClick={applyVehiclePreset}
                  className="w-full py-2.5 bg-brand-sage-deep hover:bg-[#525646] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Gerar Lote de {vehicleCount} Veículos</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Simulador de Massa de Teste Negativa (Dados Inválidos) */}
        <div className="bg-white border border-brand-beige-border rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Massa Negativa</span>
              <h3 className="text-base font-semibold text-brand-charcoal tracking-tight flex items-center gap-2 font-sans">
                <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                Opções de Dados Inválidos
              </h3>
            </div>
            <p className="text-xs text-brand-sage-light font-medium mt-1">
              Selecione quais dados devem ser gerados fora do padrão (inválidos) para testes de cenários alternativos e validação de erros na sua aplicação.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pt-1">
            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.nome}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, nome: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors">Nomes de Pessoa</span>
                <span className="text-[9px] text-[#8C907E] font-medium block">Ex: Lucas_123, null, J0hn!</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.cpf}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, cpf: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors">CPFs Inválidos</span>
                <span className="text-[9px] text-[#8C907E] font-medium block">Ex: 111.111.111-11, dig incorretos</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.rg}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, rg: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors">RGs Inválidos</span>
                <span className="text-[9px] text-[#8C907E] font-medium block">Ex: 12.34A.567-X, incompleto</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.email}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, email: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors font-sans">E-mails Inválidos</span>
                <span className="text-[9px] text-[#8C907E] font-medium block leading-tight">Ex: rodrigo.com, Rodrigo@teste</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.cnpj}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, cnpj: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors">CNPJs Inválidos (Empresas)</span>
                <span className="text-[9px] text-[#8C907E] font-medium block">Ex: 00.000.000/0000-00, inválido</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.cartao}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, cartao: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors">Cartões Inválidos</span>
                <span className="text-[9px] text-[#8C907E] font-medium block">Ex: Luhn inválido, validade vencida</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.banco}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, banco: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors">Bancos Inválidos</span>
                <span className="text-[9px] text-[#8C907E] font-medium block">Ex: Banco 999, agência 0000, conta s/ dig</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 bg-brand-cream/60 rounded-xl border border-brand-beige-border/50 hover:bg-red-50/30 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={invalidConfig.veiculo}
                onChange={(e) => setInvalidConfig({ ...invalidConfig, veiculo: e.target.checked })}
                className="mt-0.5 rounded border-brand-beige-border text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <span className="text-[11px] font-bold text-brand-charcoal block group-hover:text-red-700 transition-colors">Veículos / Placas Fora</span>
                <span className="text-[9px] text-[#8C907E] font-medium block">Ex: PLACA_INVALIDA, ABC-12</span>
              </div>
            </label>
          </div>

          <div className="flex justify-between items-center bg-red-50/40 p-2.5 px-3 rounded-xl border border-red-100/50 text-[10px] text-red-800 leading-normal">
            <span className="font-semibold">⚠️ Ao marcar qualquer opção de dados inválidos acima, o gerador substituirá os valores corretos destes campos por registros inválidos de teste ao criar ou recriar novos lotes.</span>
          </div>
        </div>




      </div>

      {/* PREVIEW AND EXPORT TABLE RIGHT PANEL */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-brand-beige-border rounded-3xl p-6 shadow-xs flex flex-col h-full space-y-5">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-brand-beige-border">
            <div>
              <h3 className="text-base font-semibold text-brand-charcoal tracking-tight flex items-center gap-2 font-sans">
                <FileSpreadsheet className="h-4.5 w-4.5 text-brand-sage-deep" />
                Massa de Dados Gerada
              </h3>
              <p className="text-xs text-brand-sage-light font-medium mt-0.5">Previsualize e exporte a lista de teste gerada.</p>
            </div>

            {/* Select count */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#6B705C]">Registros:</span>
              <select
                value={rowCount}
                onChange={(e) => setRowCount(Number(e.target.value))}
                className="bg-brand-cream border border-brand-beige-border text-xs font-extrabold text-[#6B705C] rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="10">10 Linhas</option>
                <option value="50">50 Linhas</option>
                <option value="100">100 Linhas</option>
                <option value="250">250 Linhas</option>
                <option value="500">500 Linhas</option>
              </select>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="flex flex-wrap gap-2.5 items-center justify-between">
            <button
              onClick={triggerGenerate}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-white text-brand-sage-deep border border-brand-beige-border rounded-xl hover:bg-brand-cream shadow-xs transition-all cursor-pointer"
              disabled={isGenerating}
            >
              <RefreshCw className={`h-3.5 w-3.5 text-[#6B705C] ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerar Lote</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-brand-ochre hover:bg-[#b08254] text-white rounded-xl shadow-xs transition-colors cursor-pointer border border-transparent"
                title="Exportar para formato Planilha do Excel (.csv)"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-brand-cream text-[#6B705C] hover:bg-brand-beige border border-brand-beige-border rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Exportar para formato objeto estruturado (.json)"
              >
                <FileJson className="h-3.5 w-3.5" />
                <span>Exportar JSON</span>
              </button>

              <button
                type="button"
                onClick={handleExportTXT}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-white text-[#6B705C] hover:bg-brand-cream border border-brand-beige-border rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Exportar para formato Bloco de Notas (.txt)"
              >
                <FileText className="h-3.5 w-3.5 text-brand-sage-deep" />
                <span>Exportar TXT</span>
              </button>
            </div>
          </div>

          {/* Alert banner for failed QA validation rules */}
          {failures.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-800">Alertas de Validação de QA ({failures.length})</h5>
                  <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed font-semibold">
                    A massa gerada contém inconsistências teóricas com suas regras personalizadas (por exemplo, tamanho estrito ou preços).
                  </p>
                </div>
              </div>
              <button
                onClick={triggerGenerate}
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Re-gerar Lote</span>
              </button>
            </div>
          )}

          {/* Interactive Grid Table Preview */}
          <div className="relative flex-1 min-h-[300px] border border-brand-beige-border rounded-2xl bg-brand-cream/30 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-brand-cream/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-3"
                >
                  <RefreshCw className="h-8 w-8 text-[#6B705C] animate-spin" />
                  <p className="text-xs font-bold text-brand-sage-deep">Gerando registros fictícios estruturados...</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[430px] shadow-inner-tablet">
              {generatedData.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-cream text-[#6B705C] font-extrabold border-b border-brand-beige-border">
                      <th className="px-4 py-3 text-[10px] uppercase font-mono w-14 text-center">Nº</th>
                      {columns.map(col => (
                        <th key={col.id} className="px-4 py-3 font-bold whitespace-nowrap min-w-[140px]">
                          {col.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedData.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-b border-brand-beige-border text-brand-charcoal transition-colors ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-brand-cream/20'
                        } hover:bg-brand-beige/20`}
                      >
                        <td className="px-4 py-2.5 text-center font-mono text-[#A5A58D] font-bold">{idx + 1}</td>
                        {columns.map(col => {
                          const cellVal = row[col.name];
                          const errorMsg = validateCell(cellVal, col);
                          
                          return (
                            <td 
                              key={col.id} 
                              className={`px-4 py-2.5 font-sans whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px] relative group ${
                                errorMsg ? 'bg-red-50/50 text-red-900' : ''
                              }`}
                            >
                              <span className="block truncate">{String(cellVal ?? '')}</span>
                              {errorMsg && (
                                <span 
                                  className="absolute right-1 top-1.5 cursor-help text-[8px] bg-red-100 text-red-700 font-extrabold px-1 rounded-sm shadow-xs select-none max-w-[90px] truncate" 
                                  title={errorMsg}
                                >
                                  {errorMsg}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-brand-sage-light py-16 space-y-2">
                  <FileSpreadsheet className="h-10 w-10 text-brand-beige-border" />
                  <p className="text-xs font-medium">Nenhum dado gerado.</p>
                </div>
              )}
            </div>
            
            {/* Table Row info indicator */}
            <div className="bg-brand-beige/50 px-4 py-2.5 text-[10px] text-brand-sage-deep font-bold font-sans border-t border-brand-beige-border flex justify-between items-center">
              <span>Exibindo lote de {generatedData.length} registros fictícios integrados</span>
              <span className="font-mono text-[#A5A58D]">Faker + Algoritmos de Checksum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
