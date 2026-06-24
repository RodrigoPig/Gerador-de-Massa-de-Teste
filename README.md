# 🛠️ Gerador de Dados de Teste (Criado por Rodrigo Vargas QA Pleno • IA: Gemini 3.5 Flash)

Uma ferramenta web de alta fidelidade para desenvolvedores, QAs e analistas de sistemas, projetada para a **geração rápida e em lote de dados brasileiros fictícios** realistas, além de contar com um **validador matemático em tempo real** de documentos.

Este projeto foi otimizado para cenários reais de homologação e testes de estresse, oferecendo conformidade estrita com as regulamentações brasileiras mais recentes e mecanismos para testes de casos negativos.

---

## ✨ Principais Funcionalidades

### 1. 📂 Geração de Massa em Lote (Bulk Generator)
- **Geração Guiada & Coesa**: Crie conjuntos de dados estruturados e consistentes de:
  - **Pessoas**: Nome completo, CPF, RG, data de nascimento, gênero, celular, telefone fixo, CEP, endereço, bairro, cidade, estado (UF), signo, tipo sanguíneo, peso e altura.
  - **Empresas**: Razão social fictícia, CNPJ tradicional ou alfanumérico.
  - **Cartões de Crédito**: Número gerado de acordo com a regra de bandeiras, validade, CVV de segurança e marca do cartão.
  - **Contas Bancárias**: Nome do banco, código de agência e conta corrente correspondente.
  - **Veículos**: Marca, modelo, placa no padrão Mercosul e cor do veículo.
- **Exportação Multi-Formato**: Converta instantaneamente a massa gerada em formatos estruturados prontos para uso:
  - **JSON**: Formato ideal para APIs e bancos de dados NoSQL.
  - **CSV**: Pronto para importação direta no Excel, Google Sheets ou Pandas.
  - **SQL (INSERT)**: Instruções `INSERT INTO` estruturadas para alimentação rápida de bancos relacionais (PostgreSQL, MySQL, SQLite, etc.).

### 2. 🔠 Novo CNPJ Alfanumérico (RFB 2024/2025)
- Suporte total à **Instrução Normativa RFB 2.229/2024**, que introduz caracteres alfabéticos (de A a Z) no número base do CNPJ (exceto as letras *I*, *O* e *U* para evitar confusão visual).
- Algoritmo estendido do **Módulo 11** implementado para cálculo preciso dos dois últimos dígitos verificadores baseando-se na conversão alfanumérica de pesos oficiais.

### 3. 🔍 Validador Detalhado em Tempo Real
- Validação dinâmica enquanto digita, limpando automaticamente caracteres de máscara (`.`, `-`, `/`).
- Auditoria matemática de **CPF** e **CNPJ** (Tradicionais e Alfanuméricos), exibindo um relatório explícito de:
  - Comparação entre o **Dígito Verificador Informado** vs. **Dígito Verificador Calculado**.
  - Detecção imediata de sequências repetidas inválidas (Ex: `111.111.111-11`).

### 4. 🧪 Simulador de Massa de Teste Negativa
- Permite aos desenvolvedores forçar intencionalmente dados fora do padrão dentro do lote de geração (Ex: nomes contendo números, CPFs inválidos matematicamente, e-mails estruturalmente malformados).
- Ideal para testar a resiliência e as regras de sanitização do seu backend ou formulários de frontend.

---

## 🎨 Design e UI/UX

A interface foi projetada com foco em ergonomia e produtividade, utilizando a estética **Warm Sand & Sage Green Modernist**:
- **Cores Relaxantes**: Fundo suave e bordas bem definidas em tons orgânicos que previnem o cansaço visual.
- **Micro-interações Suaves**: Transições dinâmicas de abas e cópias de dados em um clique alimentadas por `motion` (Framer Motion).
- **Acessibilidade & Clareza**: Alto contraste em status de validação (Verde para sucesso, Vermelho para erros estruturados).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Gerenciador de pacotes `npm` (ou `yarn` / `pnpm`)

### Passo a Passo

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   cd NOME_DO_REPOSITORIO
   ```

2. **Instalar Dependências**:
   ```bash
   npm install
   ```

3. **Iniciar o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   *O projeto estará disponível por padrão em `http://localhost:3000` (ou na porta especificada pelo Vite).*

4. **Compilar para Produção (Build)**:
   ```bash
   npm run build
   ```
   *Isso criará uma pasta `dist` otimizada com arquivos estáticos prontos para deploy.*

---

## 📁 Estrutura de Pastas Simplificada

```text
├── src/
│   ├── components/
│   │   ├── BulkGenerator.tsx   # Painel de geração em lote de dados e exportação
│   │   ├── Header.tsx          # Cabeçalho da aplicação
│   │   └── TabSystem.tsx       # Alternância suave de abas (Gerador vs Validador)
│   ├── App.tsx                 # Entrada principal e estado das abas
│   ├── index.css               # Importação do Tailwind CSS v4 e fontes personalizadas
│   └── main.tsx                # Renderizador React 19 no DOM
├── index.html                  # Estrutura HTML base
├── metadata.json               # Configurações do ecossistema AI Studio
├── PROMPT.md                   # Especificações de escopo e algoritmos do sistema
└── package.json                # Gerenciador de dependências e scripts npm
```

---

## 📤 Como Subir o Projeto para o GitHub

Caso queira hospedar este código no seu GitHub pessoal, siga o guia abaixo:

### Passo 1: Exportar o Projeto do AI Studio
1. No painel superior direito do **Google AI Studio**, clique nas configurações ou no menu de compartilhamento.
2. Selecione a opção **Export to ZIP** ou **Export to GitHub**.
3. Se escolheu baixar o arquivo `.zip`, descompacte-o na sua máquina.

### Passo 2: Inicializar o Repositório e Fazer o Push
Se você descompactou o ZIP e quer usar a linha de comando:

1. Abra o terminal na raiz do projeto descompactado.
2. Inicialize o repositório git:
   ```bash
   git init
   ```
3. Adicione todos os arquivos ao controle de versão:
   ```bash
   git add .
   ```
4. Crie o primeiro commit:
   ```bash
   git commit -m "feat: setup inicial do Gerador e Validador de Dados Brasileiros"
   ```
5. Crie um repositório vazio no seu [GitHub](https://github.com/new).
6. Vincule o repositório local ao GitHub (substituindo pelo seu link):
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   ```
7. Envie os arquivos para o repositório remoto:
   ```bash
   git push -u origin main
   ```

---

## ⚖️ Licença

Este projeto está disponível sob a licença MIT. Sinta-se livre para usar, modificar e distribuir em seus projetos comerciais ou pessoais!
