# Prompt de Sistema / Especificação do Projeto: Gerador e Validador de Documentos Brasileiros (Inspirado no 4Devs)

Este documento descreve detalhadamente o escopo, as especificações técnicas, os algoritmos e a interface do usuário do projeto **Gerador de Dados de Teste (Gerador / Validador Multi-Documento)** atualizado, refletindo o escopo enxuto e refinado do sistema.

---

## 🚀 Visão Geral do Projeto

O **Gerador de Dados de Teste** é uma ferramenta web de alta fidelidade voltada a desenvolvedores, testadores de software (QA) e analistas que necessitam de dados sintéticos realistas no padrão brasileiro para homologação de sistemas.

### Principais Recursos:
1. **Geração Realista (Faker integrado)**: Gera conjuntos consistentes de pessoas (com nome, signo, tipo sanguíneo, altura, peso, e CEP válido), empresas, cartões de crédito, contas bancárias e veículos.
2. **Nova Regra do CNPJ Alfanumérico (Instrução Normativa RFB 2.229/2024)**: Geração e validação completas do novo padrão de identificação fiscal brasileiro que inclui letras de A a Z de forma transparente, calculando dígitos verificadores via Módulo 11 estendido.
3. **Validador de Tempo Real (Real-time Feedback)**: Painel de auditoria individual na aba "Validador de Documentos" que valida a integridade matemática de CPFs e CNPJs (tradicionais e alfanuméricos) com relatórios detalhados de Dígitos Calculados vs. Informados.
4. **Simulador de Massa de Teste Negativa (Dados Inválidos)**: Mecanismo integrado no gerador em lote que permite ao usuário forçar intencionalmente a geração de dados fora do padrão (ex: nomes com números, CPFs inválidos ou com dígitos repetidos, e-mails incorretos, etc.) para validar o tratamento de erros do frontend/backend sob teste.
5. **Exportação Multi-Formato**: Exportação instantânea da massa gerada para formatos estruturados amplamente utilizados: **JSON**, **CSV** e comandos de inserção **SQL (Insert)**.

---

## 🛠️ Especificações Técnicas e Arquitetura

- **Framework**: React 18+ com Vite, TypeScript.
- **Estilização**: Tailwind CSS (Utility-first classes).
- **Animações (Micro-interações)**: Framer Motion (`motion/react`) para transições suaves de abas e feedback visual.
- **Biblioteca de Ícones**: Lucide React.
- **Geração de Dados Fictícios**: `@faker-js/faker` pré-configurado com localização em português do Brasil (`fakerPT_BR`).

---

## 📉 Algoritmos e Regras de Negócio Core

### 1. Validação e Geração de CPF (Cadastro de Pessoas Físicas)
- **Tamanho**: Exatamente 11 dígitos numéricos após limpeza.
- **Rejeição**: CPFs com dígitos repetidos (ex: `111.111.111-11`) são invalidados instantaneamente.
- **Cálculo Matemática**: Módulo 11 com pesos decrescentes:
  - **DV1 (Dígito 9)**: Soma ponderada dos primeiros 9 dígitos com pesos de 10 a 2. O dígito é `11 - (soma % 11)`. Se o cálculo resultar em 10 ou 11, o DV é `0`.
  - **DV2 (Dígito 10)**: Soma ponderada de 10 primeiros dígitos (incluindo DV1) com pesos de 11 a 2. O dígito é `11 - (soma % 11)`. Se o cálculo resultar em 10 ou 11, o DV é `0`.

### 2. Validação e Geração de CNPJ (Nacional e Alfanumérico RFB 2024)
- **Tamanho**: Exatamente 14 caracteres.
- **Padrão Alfanumérico**: Baseado na IN RFB 2229/2024. Os primeiros 12 dígitos podem conter letras de A a Z (excluindo estritamente as letras **I, O, U** para eliminar dúvidas visuais com números).
- **Mapeamento de Caracteres**:
  - Para caracteres numéricos (`0`-`9`): Equivalente ao valor absoluto de `0` a `9` (ASCII valor - 48).
  - Para caracteres alfabéticos (`A`-`Z`): Equivalente ao valor ASCII do caractere menos 48 (por exemplo, `A` é ASCII 65, resultando em peso `17`; `B` é `18`, etc.).
- **Dígitos Verificadores (DV1 e DV2)**:
  - São estritamente numéricos nos últimos dois dígitos.
  - Calculados tradicionalmente no Módulo 11 com sequência de pesos repetitiva de 2 a 9 (multiplicadores `[5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]` para DV1 e `[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]` para DV2).

### 3. Validação de Cartões de Crédito (Algoritmo de Luhn / Módulo 10)
- **Tamanho**: Entre 12 e 19 dígitos numéricos.
- **Lógica**: Multiplica-se por 2 cada segundo dígito a partir da direita. Se o resultado for maior que 9, subtrai-se 9. Soma-se todos os dígitos e o resultado final deve ser múltiplo de 10 (`soma % 10 === 0`).
- **Detecção de Bandeira**:
  - `Visa`: Começa com `4`.
  - `Mastercard`: Começa com prefixos na faixa `51` a `55` ou `2221` a `2720`.
  - `Amex`: Começa com `34` ou `37`.
  - `Elo`: Correspondente a faixas específicas brasileiras como `5067`, `5090`, `6362`, `6363`.

---

## 🎨 Design do Painel do Usuário (UI/UX)

A interface utiliza uma estética **Warm Sand & Sage Green Modernist** para garantir relaxamento visual de desenvolvedores que passam horas testando integrações:

- **Abas do Painel**: Alterna de forma clara entre o **Painel Individual** (focado no Validador de Documentos rápido) e o gerador de **Massa em Lote (JSON / CSV)**.
- **Painel de Geração em Lote**:
  - **Criadores Rápidos**: Gerador guiado com templates rápidos para Pessoas, Empresas, Cartões, Bancos ou Veículos.
  - **Simulador de Erros (Massa Negativa)**: Caixa de ferramentas com seletores simples para injetar dados inconsistentes no lote de testes.
  - **Visualização de QA Integrada**: Tabela dinâmica de dados que exibe as linhas geradas com opções de paginação e cópia rápida de células.
  - **Painel de Exportação**: Abas interativas para visualizar e baixar a massa gerada nos formatos CSV, JSON e SQL Insert.
- **Validador de Documentos**:
  - Caixa de entrada inteligente que analisa e formata os dados à medida que são digitados.
  - Alerta dinâmico de status: Verde para documentos válidos matematicamente (com listagem detalhada de Dígito Calculado vs Dígito Informado); Vermelho para falha indicando de forma explícita o motivo da rejeição (Ex: *"Dígitos verificadores calculados não conferem"* ou *"Sequência de dígitos idênticos"*).

---

## 🎯 Manutenção do Escopo

Para manter o escopo enxuto, direto e focado no usuário, evite adicionar:
1. Construtores de esquemas customizados complexos na interface.
2. Módulos de salvamento e compartilhamento de perfis no servidor ou armazenamento local redundante.
3. Indicadores visuais redundantes ou dados de log fictícios que poluem as margens do sistema.
