import { fakerPT_BR as faker } from '@faker-js/faker';
import { Pessoa, Empresa, CartaoCredito, ContaBancaria, Veiculo, ValidationRules } from '../types';
import { STATE_IE_CONFIGS, formatIE } from './validators';

// Database of realistic Brazilian state capitals and CEP matches
const ESTADOS_INFO = [
  { uf: 'AC', estado: 'Acre', cepMin: '69900-000', cepMax: '69999-999', capitais: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'] },
  { uf: 'AL', estado: 'Alagoas', cepMin: '57000-000', cepMax: '57999-999', capitais: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares'] },
  { uf: 'AP', estado: 'Amapá', cepMin: '68900-000', cepMax: '68999-999', capitais: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Porto Grande'] },
  { uf: 'AM', estado: 'Amazonas', cepMin: '69000-000', cepMax: '69899-999', capitais: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'] },
  { uf: 'BA', estado: 'Bahia', cepMin: '40000-000', cepMax: '48999-999', capitais: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Porto Seguro', 'Ilhéus'] },
  { uf: 'CE', estado: 'Ceará', cepMin: '60000-000', cepMax: '63999-999', capitais: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral', 'Maracanaú', 'Aquiraz'] },
  { uf: 'DF', estado: 'Distrito Federal', cepMin: '70000-000', cepMax: '73000-000', capitais: ['Brasília', 'Taguatinga', 'Ceilândia', 'Sobradinho', 'Guará', 'Águas Claras'] },
  { uf: 'ES', estado: 'Espírito Santo', cepMin: '29000-000', cepMax: '29999-999', capitais: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 'Guarapari'] },
  { uf: 'GO', estado: 'Goiás', cepMin: '72800-000', cepMax: '76799-999', capitais: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Caldas Novas'] },
  { uf: 'MA', estado: 'Maranhão', cepMin: '65000-000', cepMax: '65999-999', capitais: ['São Luís', 'Imperatriz', 'Timon', 'Caxias', 'Codó', 'Barreirinhas'] },
  { uf: 'MT', estado: 'Mato Grosso', cepMin: '78000-000', cepMax: '78899-999', capitais: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'] },
  { uf: 'MS', estado: 'Mato Grosso do Sul', cepMin: '79000-000', cepMax: '79999-999', capitais: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'] },
  { uf: 'MG', estado: 'Minas Gerais', cepMin: '30000-000', cepMax: '39999-999', capitais: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Ouro Preto', 'Poços de Caldas'] },
  { uf: 'PA', estado: 'Pará', cepMin: '66000-000', cepMax: '68899-999', capitais: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal', 'Parauapebas'] },
  { uf: 'PB', estado: 'Paraíba', cepMin: '58000-000', cepMax: '58999-999', capitais: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'] },
  { uf: 'PR', estado: 'Paraná', cepMin: '80000-000', cepMax: '87999-999', capitais: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'Foz do Iguaçu'] },
  { uf: 'PE', estado: 'Pernambuco', cepMin: '50000-000', cepMax: '56999-999', capitais: ['Recife', 'Olinda', 'Caruaru', 'Jaboatão dos Guararapes', 'Petrolina', 'Paulista'] },
  { uf: 'PI', estado: 'Piauí', cepMin: '64000-000', cepMax: '64999-999', capitais: ['Teresina', 'Parnaíba', 'Picos', 'Floriano', 'Piripiri'] },
  { uf: 'RJ', estado: 'Rio de Janeiro', cepMin: '20000-000', cepMax: '28999-999', capitais: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Petrópolis', 'Campos dos Goytacazes', 'Cabo Frio'] },
  { uf: 'RN', estado: 'Rio Grande do Norte', cepMin: '59000-000', cepMax: '59999-999', capitais: ['Natal', 'Mossoró', 'Parnamirim', 'Caicó', 'Macaíba'] },
  { uf: 'RS', estado: 'Rio Grande do Sul', cepMin: '90000-000', cepMax: '99999-999', capitais: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gramado'] },
  { uf: 'RO', estado: 'Rondônia', cepMin: '76800-000', cepMax: '76999-999', capitais: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Cacoal', 'Vilhena'] },
  { uf: 'RR', estado: 'Roraima', cepMin: '69300-000', cepMax: '69399-999', capitais: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Pacaraima', 'Cantá'] },
  { uf: 'SC', estado: 'Santa Catarina', cepMin: '88000-000', cepMax: '89999-999', capitais: ['Florianópolis', 'Joinville', 'Blumenau', 'Balneário Camboriú', 'Chapecó', 'Itajaí'] },
  { uf: 'SP', estado: 'São Paulo', cepMin: '01000-000', cepMax: '19999-999', capitais: ['São Paulo', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Ribeirão Preto', 'Santos', 'Sorocaba'] },
  { uf: 'SE', estado: 'Sergipe', cepMin: '49000-000', cepMax: '49999-999', capitais: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância'] },
  { uf: 'TO', estado: 'Tocantins', cepMin: '77000-000', cepMax: '77999-999', capitais: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins'] }
];

const DDD_LIST_POR_ESTADO: { [key: string]: number[] } = {
  AC: [68],
  AL: [82],
  AP: [96],
  AM: [92, 97],
  BA: [71, 73, 74, 75, 77],
  CE: [85, 88],
  DF: [61],
  ES: [27, 28],
  GO: [62, 64],
  MA: [98, 99],
  MT: [65, 66],
  MS: [67],
  MG: [31, 32, 33, 34, 35, 37, 38],
  PA: [91, 93, 94],
  PB: [83],
  PR: [41, 42, 43, 44, 45, 46],
  PE: [81, 87],
  PI: [86, 89],
  RJ: [21, 22, 24],
  RN: [84],
  RS: [51, 53, 54, 55],
  RO: [69],
  RR: [95],
  SC: [47, 48, 49],
  SP: [11, 12, 13, 14, 15, 16, 17, 18, 19],
  SE: [79],
  TO: [63]
};

export function getDddForCityAndState(city: string, stateUf: string): number {
  const uf = stateUf.toUpperCase();
  const normalizedCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  // Mapping for known cities in ESTADOS_INFO / user table
  if (uf === 'SP') {
    if (normalizedCity.includes('sao paulo') || normalizedCity.includes('guarulhos') || normalizedCity.includes('sao bernardo') || normalizedCity.includes('santo andre')) return 11;
    if (normalizedCity.includes('sao jose dos campos') || normalizedCity.includes('taubate') || normalizedCity.includes('jacarei')) return 12;
    if (normalizedCity.includes('santos') || normalizedCity.includes('sao vicente') || normalizedCity.includes('praia grande') || normalizedCity.includes('guaruja')) return 13;
    if (normalizedCity.includes('bauru') || normalizedCity.includes('marilia') || normalizedCity.includes('jau') || normalizedCity.includes('botucatu')) return 14;
    if (normalizedCity.includes('sorocaba') || normalizedCity.includes('itapetininga') || normalizedCity.includes('itapeva')) return 15;
    if (normalizedCity.includes('ribeirao preto') || normalizedCity.includes('franca') || normalizedCity.includes('araraquara') || normalizedCity.includes('sao carlos')) return 16;
    if (normalizedCity.includes('sao jose do rio preto') || normalizedCity.includes('catanduva') || normalizedCity.includes('barretos')) return 17;
    if (normalizedCity.includes('presidente prudente') || normalizedCity.includes('aracatuba') || normalizedCity.includes('birigui')) return 18;
    if (normalizedCity.includes('campinas') || normalizedCity.includes('piracicaba') || normalizedCity.includes('limeira') || normalizedCity.includes('americana')) return 19;
  }
  if (uf === 'RJ') {
    if (normalizedCity.includes('rio de janeiro') || normalizedCity.includes('niteroi') || normalizedCity.includes('sao goncalo') || normalizedCity.includes('duque de caxias')) return 21;
    if (normalizedCity.includes('campos dos goytacazes') || normalizedCity.includes('macae') || normalizedCity.includes('cabo frio')) return 22;
    if (normalizedCity.includes('petropolis') || normalizedCity.includes('volta redonda') || normalizedCity.includes('angra dos reis')) return 24;
  }
  if (uf === 'ES') {
    if (normalizedCity.includes('vitoria') || normalizedCity.includes('vila velha') || normalizedCity.includes('serra') || normalizedCity.includes('cariacica') || normalizedCity.includes('guarapari')) return 27;
    if (normalizedCity.includes('cachoeiro de itapemirim') || normalizedCity.includes('marataizes')) return 28;
  }
  if (uf === 'MG') {
    if (normalizedCity.includes('belo horizonte') || normalizedCity.includes('contagem') || normalizedCity.includes('betim') || normalizedCity.includes('ipatinga') || normalizedCity.includes('ouro preto')) return 31;
    if (normalizedCity.includes('juiz de fora') || normalizedCity.includes('barbacena') || normalizedCity.includes('sao joao del')) return 32;
    if (normalizedCity.includes('governador valadares') || normalizedCity.includes('teofilo otoni') || normalizedCity.includes('caratinga')) return 33;
    if (normalizedCity.includes('uberlandia') || normalizedCity.includes('uberaba') || normalizedCity.includes('patos de minas') || normalizedCity.includes('araguari')) return 34;
    if (normalizedCity.includes('pocos de caldas') || normalizedCity.includes('pouso alegre') || normalizedCity.includes('varginha')) return 35;
    if (normalizedCity.includes('divinopolis') || normalizedCity.includes('itauna') || normalizedCity.includes('nova serrana')) return 37;
    if (normalizedCity.includes('montes claros') || normalizedCity.includes('diamantina') || normalizedCity.includes('unai')) return 38;
  }
  if (uf === 'PR') {
    if (normalizedCity.includes('curitiba') || normalizedCity.includes('sao jose dos pinhais') || normalizedCity.includes('paranagua')) return 41;
    if (normalizedCity.includes('ponta grossa') || normalizedCity.includes('guarapuava') || normalizedCity.includes('irati')) return 42;
    if (normalizedCity.includes('londrina') || normalizedCity.includes('apucarana') || normalizedCity.includes('arapongas')) return 43;
    if (normalizedCity.includes('maringa') || normalizedCity.includes('campo mourao') || normalizedCity.includes('umuarama')) return 44;
    if (normalizedCity.includes('cascavel') || normalizedCity.includes('foz do iguacu') || normalizedCity.includes('toledo')) return 45;
    if (normalizedCity.includes('francisco beltrao') || normalizedCity.includes('pato branco')) return 46;
  }
  if (uf === 'SC') {
    if (normalizedCity.includes('joinville') || normalizedCity.includes('blumenau') || normalizedCity.includes('balneario camboriu') || normalizedCity.includes('itajai')) return 47;
    if (normalizedCity.includes('florianopolis') || normalizedCity.includes('criciuma') || normalizedCity.includes('palhoca')) return 48;
    if (normalizedCity.includes('chapeco') || normalizedCity.includes('lages') || normalizedCity.includes('concordia')) return 49;
  }
  if (uf === 'RS') {
    if (normalizedCity.includes('porto alegre') || normalizedCity.includes('canoas') || normalizedCity.includes('novo hamburgo') || normalizedCity.includes('santa cruz do sul')) return 51;
    if (normalizedCity.includes('pelotas') || normalizedCity.includes('rio grande') || normalizedCity.includes('bage')) return 53;
    if (normalizedCity.includes('caxias do sul') || normalizedCity.includes('passo fundo') || normalizedCity.includes('bento goncalves') || normalizedCity.includes('gramado')) return 54;
    if (normalizedCity.includes('santa maria') || normalizedCity.includes('uruguaiana') || normalizedCity.includes('santo angelo')) return 55;
  }
  if (uf === 'DF') {
    return 61;
  }
  if (uf === 'GO') {
    if (normalizedCity.includes('goiania') || normalizedCity.includes('aparecida de goiania') || normalizedCity.includes('anapolis')) return 62;
    if (normalizedCity.includes('luziania')) return 61; // Entorno of DF
    if (normalizedCity.includes('rio verde') || normalizedCity.includes('itumbiara') || normalizedCity.includes('catalao') || normalizedCity.includes('caldas novas')) return 64;
  }
  if (uf === 'MT') {
    if (normalizedCity.includes('cuiaba') || normalizedCity.includes('varzea grande') || normalizedCity.includes('caceres') || normalizedCity.includes('tangara da serra')) return 65;
    if (normalizedCity.includes('rondonopolis') || normalizedCity.includes('sinop') || normalizedCity.includes('sorriso')) return 66;
  }
  if (uf === 'MS') {
    return 67;
  }
  if (uf === 'RO') {
    return 69;
  }
  if (uf === 'AC') {
    return 68;
  }
  if (uf === 'AM') {
    if (normalizedCity.includes('tefe') || normalizedCity.includes('coari') || normalizedCity.includes('tabatinga')) return 97;
    return 92; // default/capitais
  }
  if (uf === 'RR') {
    return 95;
  }
  if (uf === 'PA') {
    if (normalizedCity.includes('belem') || normalizedCity.includes('ananindeua') || normalizedCity.includes('castanhal')) return 91;
    if (normalizedCity.includes('santarem') || normalizedCity.includes('altamira') || normalizedCity.includes('itaituba')) return 93;
    if (normalizedCity.includes('maraba') || normalizedCity.includes('parauapebas') || normalizedCity.includes('redencao')) return 94;
  }
  if (uf === 'AP') {
    return 96;
  }
  if (uf === 'TO') {
    return 63;
  }
  if (uf === 'BA') {
    if (normalizedCity.includes('salvador') || normalizedCity.includes('camacari') || normalizedCity.includes('lauro de freitas')) return 71;
    if (normalizedCity.includes('itabuna') || normalizedCity.includes('ilheus') || normalizedCity.includes('porto seguro') || normalizedCity.includes('jequie')) return 73;
    if (normalizedCity.includes('juazeiro') || normalizedCity.includes('jacobina') || normalizedCity.includes('senhor do bonfim')) return 74;
    if (normalizedCity.includes('feira de santana') || normalizedCity.includes('alagoinhas') || normalizedCity.includes('paulo afonso')) return 75;
    if (normalizedCity.includes('vitoria da conquista') || normalizedCity.includes('barreiras') || normalizedCity.includes('luis eduardo magalhaes')) return 77;
  }
  if (uf === 'SE') {
    return 79;
  }
  if (uf === 'AL') {
    return 82;
  }
  if (uf === 'PE') {
    if (normalizedCity.includes('petrolina') || normalizedCity.includes('garanhuns') || normalizedCity.includes('serra talhada')) return 87;
    return 81; // Recife and main metropolitan areas (Olinda, Paulista, Jaboatão, Caruaru)
  }
  if (uf === 'PB') {
    return 83;
  }
  if (uf === 'RN') {
    return 84;
  }
  if (uf === 'CE') {
    if (normalizedCity.includes('juazeiro do norte') || normalizedCity.includes('sobral') || normalizedCity.includes('crato')) return 88;
    return 85; // Fortaleza etc.
  }
  if (uf === 'PI') {
    if (normalizedCity.includes('picos') || normalizedCity.includes('floriano')) return 89;
    return 86; // Teresina etc.
  }
  if (uf === 'MA') {
    if (normalizedCity.includes('caxias') || normalizedCity.includes('codo') || normalizedCity.includes('balsas')) return 99;
    return 98; // São Luís, Imperatriz, Timon, Barreirinhas
  }

  // Fallback to random DDD of that state
  const ddds = DDD_LIST_POR_ESTADO[uf] || [11];
  return ddds[Math.floor(Math.random() * ddds.length)];
}

const BAIRROS_EXEMPLO = ['Centro', 'Jardins', 'Bela Vista', 'Copacabana', 'Ipanema', 'Savassi', 'Lourdes', 'Moinhos de Vento', 'Batel', 'Pinheiros', 'Meireles', 'Barra da Tijuca', 'Bom Fim', 'Gonzaga'];
const RUAS_EXEMPLO = ['Av. Paulista', 'Rua Augusta', 'Av. Atlântica', 'Rua da Bahia', 'Av. das Américas', 'Av. Bento Gonçalves', 'Rua XV de Novembro', 'Rua das Flores', 'Av. Getúlio Vargas', 'Av. Rio Branco'];

const BANCOS_LISTA = [
  { nome: 'Banco do Brasil S.A.', codigo: '001' },
  { nome: 'Banco Santander (Brasil) S.A.', codigo: '033' },
  { nome: 'Itaú Unibanco S.A.', codigo: '341' },
  { nome: 'Banco Bradesco S.A.', codigo: '237' },
  { nome: 'Caixa Econômica Federal', codigo: '104' },
  { nome: 'Banco Cooperativo Sicredi S.A.', codigo: '748' },
  { nome: 'Nu Pagamentos S.A. (Nubank)', codigo: '260' },
  { nome: 'Banco Inter S.A.', codigo: '077' }
];

const VEICULOS_MARCAS = [
  { marca: 'Chevrolet', modelos: ['Onix', 'Tracker', 'Cruze', 'S10', 'Spin', 'Montana'] },
  { marca: 'Fiat', modelos: ['Uno', 'Mobi', 'Argo', 'Toro', 'Pulse', 'Fastback', 'Cronos'] },
  { marca: 'Volkswagen', modelos: ['Gol', 'Polo', 'T-Cross', 'Virtus', 'Nivus', 'Saveiro', 'Taos'] },
  { marca: 'Toyota', modelos: ['Corolla', 'Hilux', 'Yaris', 'Corolla Cross', 'SW4'] },
  { marca: 'Hyundai', modelos: ['HB20', 'Creta', 'Tucson', 'HB20S', 'Azera'] },
  { marca: 'Honda', modelos: ['Civic', 'HR-V', 'City', 'WR-V', 'CR-V'] },
  { marca: 'Jeep', modelos: ['Renegade', 'Compass', 'Commander', 'Grand Cherokee'] }
];

const VEICULOS_CORES = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Bronze'];

const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Utility to helper format CPF
export function generateCPF(formatted: boolean = true): string {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  let d1 = n.reduce((acc, val, idx) => acc + val * (10 - idx), 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;

  const d1Array = [...n, d1];
  let d2 = d1Array.reduce((acc, val, idx) => acc + val * (11 - idx), 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;

  const digits = [...d1Array, d2].join('');
  if (formatted) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  return digits;
}

// Utility to helper format CNPJ
export function generateCNPJ(formatted: boolean = true, isAlphanumeric: boolean = false): string {
  let base: number[] = [];
  
  if (isAlphanumeric) {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTVWXYZ'; // Letters I, O, U are officially excluded by RFB (IN 2229/2024) to avoid visual confusion
    // Generate 12 alphanumeric characters and store their modulo-11 weight values
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      const char = chars[idx];
      const code = char.charCodeAt(0);
      base.push(code - 48); // both '0'-'9' (48-57) and 'A'-'Z' (65-90) subtracted by 48
    }
  } else {
    const n = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
    base = [...n, 0, 0, 0, 1]; // matrix suffix 0001
  }

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d1 = base.reduce((acc, val, idx) => acc + val * w1[idx], 0);
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;

  const d1Array = [...base, d1];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d2 = d1Array.reduce((acc, val, idx) => acc + val * w2[idx], 0);
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;

  // Reconstruct digits string
  const total = [...base, d1, d2];
  const digits = total.map((val, idx) => {
    // DV (last 2 digits) are strictly numeric
    if (idx >= 12) return String(val);
    
    // For original, strictly numeric
    if (!isAlphanumeric) return String(val);
    
    // Reverse subtraction to map number value back to character
    const charCode = val + 48;
    return String.fromCharCode(charCode);
  }).join('');

  if (formatted) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }
  return digits;
}

export function generateRG(formatted: boolean = true): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  if (formatted) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
  }
  return digits;
}

export function generateCreditCard(brandSelected: string = 'visa'): CartaoCredito {
  let prefix = '';
  let length = 16;
  const brand = brandSelected.toLowerCase();

  if (brand === 'visa') {
    prefix = '4';
  } else if (brand === 'mastercard') {
    const list = ['51', '52', '53', '54', '55'];
    prefix = list[Math.floor(Math.random() * list.length)];
  } else if (brand === 'amex') {
    const list = ['34', '37'];
    prefix = list[Math.floor(Math.random() * list.length)];
    length = 15;
  } else if (brand === 'elo') {
    const list = ['4011', '5041', '5067', '5090'];
    prefix = list[Math.floor(Math.random() * list.length)];
  } else {
    prefix = '4'; // fallback to visa
  }

  const numDigitsNeeded = length - prefix.length - 1;
  const body = Array.from({ length: numDigitsNeeded }, () => Math.floor(Math.random() * 10));
  const cardDigits = [...prefix.split('').map(Number), ...body];

  let sum = 0;
  for (let i = 0; i < cardDigits.length; i++) {
    let d = cardDigits[cardDigits.length - 1 - i];
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  const numStr = [...cardDigits, checkDigit].join('');

  let formattedNum = numStr;
  if (length === 16) {
    formattedNum = `${numStr.slice(0, 4)} ${numStr.slice(4, 8)} ${numStr.slice(8, 12)} ${numStr.slice(12)}`;
  } else {
    // Amex 4-6-5 format
    formattedNum = `${numStr.slice(0, 4)} ${numStr.slice(4, 10)} ${numStr.slice(10)}`;
  }

  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const year = String(new Date().getFullYear() + Math.floor(Math.random() * 8) + 1).slice(2);

  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const nomeTitular = `${firstname} ${lastname}`.toUpperCase();

  return {
    numero: formattedNum,
    bandeira: brandSelected.toUpperCase(),
    validade: `${month}/${year}`,
    cvv: Array.from({ length: length === 15 ? 4 : 3 }, () => Math.floor(Math.random() * 10)).join(''),
    nomeTitular
  };
}

export function getZodiacSign(day: number, month: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Áries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Touro';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gêmeos';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Câncer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leão';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpião';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitário';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricórnio';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquário';
  return 'Peixes';
}

function randomCepForState(stateUf: string): string {
  const info = ESTADOS_INFO.find(e => e.uf === stateUf) || ESTADOS_INFO[0];
  const minCode = parseInt(info.cepMin.replace('-', ''), 10);
  const maxCode = parseInt(info.cepMax.replace('-', ''), 10);
  const code = Math.floor(Math.random() * (maxCode - minCode)) + minCode;
  const rawCep = String(code).padStart(8, '0');
  return `${rawCep.slice(0, 5)}-${rawCep.slice(5)}`;
}

export function generatePessoa(genderPreference: 'M' | 'F' | 'A' = 'A', statePreference: string = 'A'): Pessoa {
  const genderKey = genderPreference === 'A' ? (Math.random() > 0.5 ? 'M' : 'F') : genderPreference;
  const fakerGender = genderKey === 'M' ? 'male' : 'female';

  const firstName = faker.person.firstName(fakerGender);
  const lastName = faker.person.lastName();
  const nome = `${firstName} ${lastName}`;

  // Clean email based on name
  const cleanFirst = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const cleanLast = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const providers = ['gmail.com', 'outlook.com', 'yahoo.com.br', 'uol.com.br', 'hotmail.com'];
  const p = providers[Math.floor(Math.random() * providers.length)];
  const email = `${cleanFirst}.${cleanLast}${Math.floor(Math.random() * 99)}@${p}`;

  // Date of birth
  const birthDate = faker.date.birthdate({ min: 18, max: 79, mode: 'age' });
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  const nascimentoStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

  const signo = getZodiacSign(day, month);

  // State selection
  const stateInfo = statePreference === 'A' 
    ? ESTADOS_INFO[Math.floor(Math.random() * ESTADOS_INFO.length)]
    : ESTADOS_INFO.find(e => e.uf === statePreference) || ESTADOS_INFO[0];

  const cidade = stateInfo.capitais[Math.floor(Math.random() * stateInfo.capitais.length)];
  const estado = stateInfo.estado;
  const cep = randomCepForState(stateInfo.uf);
  const bairro = BAIRROS_EXEMPLO[Math.floor(Math.random() * BAIRROS_EXEMPLO.length)];
  const endereco = RUAS_EXEMPLO[Math.floor(Math.random() * RUAS_EXEMPLO.length)];
  const numero = Math.floor(Math.random() * 1500) + 1;

  // Phone numbers - DD code match state preference, city-specific or random
  const ddd = getDddForCityAndState(cidade, stateInfo.uf);

  const celular = `(${ddd}) 9${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`;
  const telefone = `(${ddd}) ${Math.floor(Math.random() > 0.5 ? 3 : 2)}${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('')}-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`;

  // Bio-info
  const heightDbl = (Math.random() * (1.95 - 1.50) + 1.50).toFixed(2);
  const weightVal = Math.floor(Math.random() * (110 - 50) + 50);

  return {
    nome,
    cpf: generateCPF(true),
    rg: generateRG(true),
    email,
    nascimento: nascimentoStr,
    genero: genderKey === 'M' ? 'Masculino' : 'Feminino',
    celular,
    telefone,
    cep,
    endereco,
    numero,
    bairro,
    cidade,
    estado,
    signo,
    tipoSanguineo: TIPOS_SANGUINEOS[Math.floor(Math.random() * TIPOS_SANGUINEOS.length)],
    altura: `${heightDbl} m`,
    peso: `${weightVal} kg`
  };
}

export function generateEmpresa(statePreference: string = 'A', isAlphanumeric: boolean = false): Empresa {
  const suffixes = [' Ltda', ' S.A.', ' Tecnologia', ' Serviços de Internet', ' Consultoria', ' Comércio', ' Empreendimentos'];
  const randomWord1 = faker.company.buzzNoun();
  const randomWord2 = faker.company.buzzAdjective();
  const corporateName = `${randomWord1.charAt(0).toUpperCase() + randomWord1.slice(1)} ${randomWord2.charAt(0).toUpperCase() + randomWord2.slice(1)}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;

  const stateInfo = statePreference === 'A' 
    ? ESTADOS_INFO[Math.floor(Math.random() * ESTADOS_INFO.length)]
    : ESTADOS_INFO.find(e => e.uf === statePreference) || ESTADOS_INFO[0];

  const city = stateInfo.capitais[Math.floor(Math.random() * stateInfo.capitais.length)];
  const street = RUAS_EXEMPLO[Math.floor(Math.random() * RUAS_EXEMPLO.length)];
  const b = BAIRROS_EXEMPLO[Math.floor(Math.random() * BAIRROS_EXEMPLO.length)];
  const zip = randomCepForState(stateInfo.uf);

  // Phone code - city-specific or random
  const ddd = getDddForCityAndState(city, stateInfo.uf);
  const phone = `(${ddd}) 3${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('')}-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`;

  // Company Email
  const cleanCompName = randomWord1.toLowerCase().replace(/[^a-z]/g, '');
  const email = `contato@${cleanCompName}.com.br`;

  // Start date (between 1 and 35 years ago)
  const d = faker.date.past({ years: 35 });
  const startStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  return {
    nomeEmpresa: corporateName,
    cnpj: generateCNPJ(true, isAlphanumeric),
    telefone: phone,
    dataAbertura: startStr,
    cep: zip,
    endereco: `${street}, ${Math.floor(Math.random() * 3000) + 100}`,
    bairro: b,
    cidade: city,
    estado: stateInfo.estado,
    email,
    inscricaoEstadual: generateInscricaoEstadual(stateInfo.uf, true)
  };
}

export function generateContaBancaria(): ContaBancaria {
  const bank = BANCOS_LISTA[Math.floor(Math.random() * BANCOS_LISTA.length)];
  const agencia = String(Math.floor(Math.random() * 8999) + 1000);
  const conta = String(Math.floor(Math.random() * 899999) + 100000);
  const digito = String(Math.floor(Math.random() * 10));
  const types = ['Conta Corrente', 'Conta Poupança'];

  return {
    banco: `${bank.codigo} - ${bank.nome}`,
    agencia,
    conta,
    digito,
    tipo: types[Math.floor(Math.random() * types.length)]
  };
}

export function generateVeiculo(): Veiculo {
  const item = VEICULOS_MARCAS[Math.floor(Math.random() * VEICULOS_MARCAS.length)];
  const model = item.modelos[Math.floor(Math.random() * item.modelos.length)];
  const color = VEICULOS_CORES[Math.floor(Math.random() * VEICULOS_CORES.length)];

  // Plates formats: classic (AAA-9999) or Mercosul (AAA9A99)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getChar = () => chars[Math.floor(Math.random() * chars.length)];
  const getDigit = () => String(Math.floor(Math.random() * 10));

  let plate = '';
  if (Math.random() > 0.5) {
    // Classic AAA-1234
    plate = `${getChar()}${getChar()}${getChar()}-${getDigit()}${getDigit()}${getDigit()}${getDigit()}`;
  } else {
    // Mercosul AAA1A23
    plate = `${getChar()}${getChar()}${getChar()}${getDigit()}${getChar()}${getDigit()}${getDigit()}`;
  }

  // Chassi - 17 characters
  const chassiChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chassis = Array.from({ length: 17 }, () => chassiChars[Math.floor(Math.random() * chassiChars.length)]).join('');

  // Renavam - 11 digits
  const renavam = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');

  return {
    marca: item.marca,
    modelo: model,
    cor: color,
    placa: plate,
    chassis,
    renavam
  };
}

const FINANCE_CATEGORIES = ['Alimentação', 'Combustível', 'Assinaturas', 'Supermercado', 'Saúde', 'Lazer', 'Transferência', 'Educação', 'Vestuário'];
const FINANCE_METODOS = ['Pix', 'Cartão de Crédito', 'Boleto', 'Débito Automático', 'Dinheiro', 'Transferência TED'];
const SAUDE_ALERGIAS = ['Penicilina', 'Lactose', 'Glúten', 'Frutos do Mar', 'Ácaro', 'Dipirona', 'Corante Tartrazina', 'Nenhuma'];
const SAUDE_HISTORICOS = ['Hipertensão Arterial', 'Diabetes Tipo 2', 'Asma Moderada', 'Nódulo Tireoidiano', 'Sem Comorbidades', 'Arritmia Cardíaca', 'Hipotireoidismo'];
const SAUDE_ESPECIALIDADES = ['Cardiologia', 'Clínica Geral', 'Dermatologia', 'Neurologia', 'Ortopedia', 'Pediatria', 'Psiquiatria', 'Ginecologia'];

const PRODUTO_CATEGORIAS = ['Eletrônicos', 'Móveis', 'Vestuário', 'Esportes', 'Beleza & Saúde', 'Livros', 'Automotivo', 'Alimentos'];
const PRODUTO_NOMES: Record<string, string[]> = {
  'Eletrônicos': ['Smartphone Pro Max', 'Notebook Ultra Slim', 'Tablet 10 Polegadas', 'Smartwatch Sport', 'Fone de Ouvido Bluetooth', 'Carregador Rápido 20W'],
  'Móveis': ['Sofá 3 Lugares Suede', 'Mesa de Jantar Madeira', 'Cadeira Office Ergonômica', 'Guarda-Roupa Casal', 'Estante de Livros', 'Escrivaninha Compacta'],
  'Vestuário': ['Camiseta de Algodão', 'Calça Jeans Premium', 'Jaqueta Corta-Vento', 'Tênis Running Air', 'Meias Esportivas Pack 3x', 'Moletom Canguru'],
  'Esportes': ['Bola de Futebol Oficial', 'Tapete de Yoga Antiderrapante', 'Corda de Pular Ajustável', 'Garrafa Térmica Inox', 'Bicicleta Aro 29'],
  'Beleza & Saúde': ['Kit Skincare Hyaluronic', 'Sérum Hidratante Facial', 'Protetor Solar FPS 60', 'Secador de Cabelo Turbo', 'Perfume Âmbar 100ml'],
  'Livros': ['Clean Code', 'Arquitetura Limpa', 'O Programador Pragmático', 'Padrões de Projeto', 'Entendendo Algoritmos'],
  'Automotivo': ['Kit Capas de Banco', 'Pneu Aro 15 Premium', 'Suporte Celular Veicular', 'Carregador Veicular USB-C', 'Cera Automotiva Brilho'],
  'Alimentos': ['Café Gourmet Arábica', 'Chocolate Amargo 70%', 'Azeite de Oliva Extra Virgem', 'Granola Artesanal', 'Arroz Integral Pacote']
};

export function generateCNS(): string {
  const first = ['1', '2', '7', '8', '9'][Math.floor(Math.random() * 5)];
  const remain = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
  const raw = first + remain;
  return `${raw.slice(0, 3)} ${raw.slice(3, 7)} ${raw.slice(7, 11)} ${raw.slice(11)}`;
}

// Global generator dispatcher for Schema-based bulk creation
export function generateFieldData(type: string, rules?: ValidationRules): string | number {
  let val: string | number = '';

  // Safe default generation
  switch (type) {
    case 'nome':
      val = faker.person.fullName();
      break;
    case 'cpf':
      val = generateCPF(true);
      break;
    case 'rg':
      val = generateRG(true);
      break;
    case 'email':
      val = faker.internet.email();
      break;
    case 'nascimento': {
      const d = faker.date.birthdate({ min: 18, max: 75, mode: 'age' });
      val = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
      break;
    }
    case 'genero':
      val = Math.random() > 0.5 ? 'Masculino' : 'Feminino';
      break;
    case 'celular': {
      let ddd = [11, 21, 31, 51, 41, 61][Math.floor(Math.random() * 6)];
      if (rules?.stateUf && rules.stateUf !== 'A') {
        const stateInfo = ESTADOS_INFO.find(e => e.uf === rules.stateUf);
        if (stateInfo) {
          const city = stateInfo.capitais[Math.floor(Math.random() * stateInfo.capitais.length)];
          ddd = getDddForCityAndState(city, stateInfo.uf);
        }
      }
      val = `(${ddd}) 9${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`;
      break;
    }
    case 'telefone': {
      let ddd = [11, 21, 31, 51, 41, 61][Math.floor(Math.random() * 6)];
      if (rules?.stateUf && rules.stateUf !== 'A') {
        const stateInfo = ESTADOS_INFO.find(e => e.uf === rules.stateUf);
        if (stateInfo) {
          const city = stateInfo.capitais[Math.floor(Math.random() * stateInfo.capitais.length)];
          ddd = getDddForCityAndState(city, stateInfo.uf);
        }
      }
      val = `(${ddd}) 3${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('')}-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`;
      break;
    }
    case 'cep': {
      const state = ESTADOS_INFO[Math.floor(Math.random() * ESTADOS_INFO.length)];
      val = randomCepForState(state.uf);
      break;
    }
    case 'endereco':
      val = `${RUAS_EXEMPLO[Math.floor(Math.random() * RUAS_EXEMPLO.length)]}`;
      break;
    case 'numero': {
      const min = rules?.minNumber ?? 1;
      const max = rules?.maxNumber ?? 1999;
      val = Math.floor(Math.random() * (max - min + 1)) + min;
      break;
    }
    case 'bairro':
      val = BAIRROS_EXEMPLO[Math.floor(Math.random() * BAIRROS_EXEMPLO.length)];
      break;
    case 'cidade': {
      const state = ESTADOS_INFO[Math.floor(Math.random() * ESTADOS_INFO.length)];
      val = state.capitais[Math.floor(Math.random() * state.capitais.length)];
      break;
    }
    case 'estado':
      val = ESTADOS_INFO[Math.floor(Math.random() * ESTADOS_INFO.length)].estado;
      break;
    case 'signo':
      val = getZodiacSign(Math.floor(Math.random() * 28) + 1, Math.floor(Math.random() * 12) + 1);
      break;
    case 'tipoSanguineo':
    case 'saude_tipoSanguineo':
      val = TIPOS_SANGUINEOS[Math.floor(Math.random() * TIPOS_SANGUINEOS.length)];
      break;
    case 'cartao_numero':
      val = generateCreditCard('visa').numero;
      break;
    case 'cartao_bandeira':
      val = ['VISA', 'MASTERCARD', 'AMEX', 'ELO'][Math.floor(Math.random() * 4)];
      break;
    case 'cartao_validade': {
      const m = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const y = String(new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).slice(2);
      val = `${m}/${y}`;
      break;
    }
    case 'cartao_cvv':
      val = String(Math.floor(Math.random() * 899) + 100);
      break;
    case 'empresa_nome': {
      const randomWord1 = faker.company.buzzNoun();
      const randomWord2 = faker.company.buzzAdjective();
      val = `${randomWord1.charAt(0).toUpperCase() + randomWord1.slice(1)} ${randomWord2.charAt(0).toUpperCase() + randomWord2.slice(1)} Ltda`;
      break;
    }
    case 'empresa_cnpj':
      val = generateCNPJ(true);
      break;
    case 'empresa_cnpj_alfanumerico':
      val = generateCNPJ(true, true);
      break;
    case 'inscricao_estadual':
      val = generateInscricaoEstadual('A', true);
      break;
    case 'banco_nome':
      val = BANCOS_LISTA[Math.floor(Math.random() * BANCOS_LISTA.length)].nome;
      break;
    case 'banco_agencia':
      val = String(Math.floor(Math.random() * 8999) + 1000);
      break;
    case 'banco_conta':
      val = `${String(Math.floor(Math.random() * 899999) + 100000)}-${Math.floor(Math.random() * 10)}`;
      break;
    case 'veiculo_marca':
      val = VEICULOS_MARCAS[Math.floor(Math.random() * VEICULOS_MARCAS.length)].marca;
      break;
    case 'veiculo_modelo': {
      const item = VEICULOS_MARCAS[Math.floor(Math.random() * VEICULOS_MARCAS.length)];
      val = item.modelos[Math.floor(Math.random() * item.modelos.length)];
      break;
    }
    case 'veiculo_placa': {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const d = () => String(Math.floor(Math.random() * 10));
      val = `${chars[Math.floor(Math.random() * 26)]}${chars[Math.floor(Math.random() * 26)]}${chars[Math.floor(Math.random() * 26)]}${d()}${chars[Math.floor(Math.random() * 26)]}${d()}${d()}`;
      break;
    }
    case 'veiculo_cor':
      val = VEICULOS_CORES[Math.floor(Math.random() * VEICULOS_CORES.length)];
      break;
    case 'texto_paragrafo':
      val = faker.lorem.paragraph();
      break;
    case 'texto_frase':
      val = faker.lorem.sentence();
      break;

    // Financial
    case 'finance_transacao_id':
      val = `TX-${faker.string.alphanumeric({ length: 12, casing: 'upper' })}`;
      break;
    case 'finance_valor': {
      const min = rules?.minNumber ?? -100;
      const max = rules?.maxNumber ?? 4500;
      const num = Math.random() * (max - min) + min;
      val = `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      break;
    }
    case 'finance_data': {
      const pastDate = faker.date.recent({ days: 30 });
      val = `${String(pastDate.getDate()).padStart(2, '0')}/${String(pastDate.getMonth() + 1).padStart(2, '0')}/${pastDate.getFullYear()} ${String(pastDate.getHours()).padStart(2, '0')}:${String(pastDate.getMinutes()).padStart(2, '0')}`;
      break;
    }
    case 'finance_categoria':
      val = FINANCE_CATEGORIES[Math.floor(Math.random() * FINANCE_CATEGORIES.length)];
      break;
    case 'finance_metodo':
      val = FINANCE_METODOS[Math.floor(Math.random() * FINANCE_METODOS.length)];
      break;
    case 'finance_saldo': {
      const min = rules?.minNumber ?? 0;
      const max = rules?.maxNumber ?? 100000;
      const num = Math.random() * (max - min) + min;
      val = `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      break;
    }

    // Health
    case 'saude_cns':
      val = generateCNS();
      break;
    case 'saude_alergia':
      val = SAUDE_ALERGIAS[Math.floor(Math.random() * SAUDE_ALERGIAS.length)];
      break;
    case 'saude_historico':
      val = SAUDE_HISTORICOS[Math.floor(Math.random() * SAUDE_HISTORICOS.length)];
      break;
    case 'saude_pressao': {
      const sys = Math.floor(Math.random() * (140 - 110) + 110);
      const dia = Math.floor(Math.random() * (90 - 70) + 70);
      val = `${sys}x${dia}`;
      break;
    }
    case 'saude_especialidade':
      val = SAUDE_ESPECIALIDADES[Math.floor(Math.random() * SAUDE_ESPECIALIDADES.length)];
      break;

    // Product
    case 'produto_nome': {
      const cat = PRODUTO_CATEGORIAS[Math.floor(Math.random() * PRODUTO_CATEGORIAS.length)];
      const names = PRODUTO_NOMES[cat];
      val = names[Math.floor(Math.random() * names.length)];
      break;
    }
    case 'produto_categoria':
      val = PRODUTO_CATEGORIAS[Math.floor(Math.random() * PRODUTO_CATEGORIAS.length)];
      break;
    case 'produto_descricao':
      val = faker.commerce.productDescription();
      break;
    case 'produto_preco': {
      const min = rules?.minNumber ?? 5;
      const max = rules?.maxNumber ?? 1000;
      const num = Math.random() * (max - min) + min;
      val = `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      break;
    }
    case 'produto_sku':
      val = `SKU-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-${faker.string.alphanumeric({ length: 3, casing: 'upper' })}`;
      break;
    case 'produto_estoque': {
      const min = rules?.minNumber ?? 0;
      const max = rules?.maxNumber ?? 250;
      val = Math.floor(Math.random() * (max - min + 1)) + min;
      break;
    }

    default:
      val = '';
  }

  // Handle emailFormat rule
  if (rules?.emailFormat && typeof val === 'string' && !val.includes('@')) {
    const cleanStr = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase();
    val = `${cleanStr || 'contato'}@genero-ficticio.com`;
  }

  // Handle minLength rule
  if (rules?.minLength && typeof val === 'string') {
    while (val.length < rules.minLength) {
      val += Math.floor(Math.random() * 10);
    }
  }

  // Handle maxLength rule
  if (rules?.maxLength && typeof val === 'string') {
    val = val.slice(0, rules.maxLength);
  }

  // Handle customPrefix rule
  if (rules?.customPrefix) {
    val = `${rules.customPrefix}${val}`;
  }

  // Handle customSuffix rule
  if (rules?.customSuffix) {
    val = `${val}${rules.customSuffix}`;
  }

  return val;
}

export function generateInscricaoEstadual(uf: string, formatted: boolean = true): string {
  let activeUf = uf.toUpperCase();
  if (activeUf === 'A' || !STATE_IE_CONFIGS[activeUf]) {
    const keys = Object.keys(STATE_IE_CONFIGS);
    activeUf = keys[Math.floor(Math.random() * keys.length)];
  }

  const config = STATE_IE_CONFIGS[activeUf];
  const len = config.length;

  let base = '';
  if (config.startsWith && config.startsWith.length > 0) {
    const pref = config.startsWith[Math.floor(Math.random() * config.startsWith.length)];
    base += pref;
  }

  const dvCount = (activeUf === 'SP' || activeUf === 'MG' || activeUf === 'PR' || activeUf === 'DF' || activeUf === 'AC') ? 2 : 1;
  const baseDigitsCount = len - dvCount;

  while (base.length < baseDigitsCount) {
    base += Math.floor(Math.random() * 10);
  }

  if (activeUf === 'SP') {
    const d = Array.from(base).map(Number);
    const sum1 = d[0]*1 + d[1]*3 + d[2]*4 + d[3]*5 + d[4]*6 + d[5]*7 + d[6]*8 + d[7]*10;
    let dv1 = sum1 % 11;
    if (dv1 === 10) dv1 = 0;

    const ieArray = [...d.slice(0, 8), dv1, ...d.slice(8, 10)];
    const sum2 = ieArray[0]*3 + ieArray[1]*2 + ieArray[2]*10 + ieArray[3]*9 + ieArray[4]*8 + ieArray[5]*7 + ieArray[6]*6 + ieArray[7]*5 + ieArray[8]*4 + ieArray[9]*3 + ieArray[10]*2;
    let dv2 = sum2 % 11;
    if (dv2 === 10) dv2 = 0;

    const ieResult = [...ieArray, dv2].join('');
    return formatted ? formatIE(ieResult, 'SP') : ieResult;
  }

  if (activeUf === 'MG') {
    const d = Array.from(base).map(Number);
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

    const ieResult = [...d, dv1, dv2].join('');
    return formatted ? formatIE(ieResult, 'MG') : ieResult;
  }

  if (activeUf === 'PR') {
    const d = Array.from(base).map(Number);
    const sum1 = d[0]*3 + d[1]*2 + d[2]*7 + d[3]*6 + d[4]*5 + d[5]*4 + d[6]*3 + d[7]*2;
    const mod1 = sum1 % 11;
    const dv1 = mod1 < 2 ? 0 : 11 - mod1;

    const sum2 = d[0]*4 + d[1]*3 + d[2]*2 + d[3]*7 + d[4]*6 + d[5]*5 + d[6]*4 + d[7]*3 + dv1*2;
    const mod2 = sum2 % 11;
    const dv2 = mod2 < 2 ? 0 : 11 - mod2;

    const ieResult = [...d, dv1, dv2].join('');
    return formatted ? formatIE(ieResult, 'PR') : ieResult;
  }

  if (dvCount === 2) {
    const d = Array.from(base).map(Number);
    let sum1 = 0;
    let w1 = 2;
    for (let i = d.length - 1; i >= 0; i--) {
      sum1 += d[i] * w1;
      w1++;
      if (w1 > 9) w1 = 2;
    }
    const dv1 = (sum1 % 11) < 2 ? 0 : 11 - (sum1 % 11);

    const d2 = [...d, dv1];
    let sum2 = 0;
    let w2 = 2;
    for (let i = d2.length - 1; i >= 0; i--) {
      sum2 += d2[i] * w2;
      w2++;
      if (w2 > 9) w2 = 2;
    }
    const dv2 = (sum2 % 11) < 2 ? 0 : 11 - (sum2 % 11);

    const ieResult = [...d2, dv2].join('');
    return formatted ? formatIE(ieResult, activeUf) : ieResult;
  }

  const d = Array.from(base).map(Number);
  let sum = 0;
  let weight = 2;
  for (let i = d.length - 1; i >= 0; i--) {
    sum += d[i] * weight;
    weight++;
    if (weight > 9) weight = 2;
  }
  const mod = sum % 11;
  const dv = mod < 2 ? 0 : 11 - mod;

  const ieResult = [...d, dv].join('');
  return formatted ? formatIE(ieResult, activeUf) : ieResult;
}
