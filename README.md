# Editor Zoldyck

Editor e interpretador online de **Portugol** com funcionalidades modernas de execução e exportação. Desenvolvido para facilitar o aprendizado de lógica de programação.

**Desenvolvido por:** Daniel Souza - Aluno do curso de Sistemas de Informação FeMASS/2026.1

![React](https://img.shields.io/badge/React-19.2.4-blue) ![Vite](https://img.shields.io/badge/Vite-8.0-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4.2-cyan) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Funcionalidades

### ✨ Interface Moderna
- **Tailwind CSS** - Design moderno e responsivo (tema brutalista)
- **Tema Claro/Escuro** - Alternar entre temas com um clique
- **Ícones Lucide** - Interface limpa e profissional
- **Monaco Editor** - Editor profissional (mesmo do VS Code)
- Syntax highlighting customizado para Portugol

### ⚙️ Interpretador Portugol Completo
Executa código Portugol diretamente no navegador:

- ✅ Variáveis (inteiro, real, caractere, logico)
- ✅ Vetores e matrizes
- ✅ Operadores aritméticos (+, -, *, /, ^, mod)
- ✅ Operadores relacionais (=, <>, >, <, >=, <=)
- ✅ Operadores lógicos (e, ou, nao)
- ✅ Estruturas condicionais (se...então...senão)
- ✅ Estruturas de repetição (enquanto, para, repita...até)
- ✅ Entrada/saída (leia, escreva, escreval)

### 📤 Exportação para Trabalhos Acadêmicos
Perfeito para entregar no WebAcadêmico:

- **PNG** - Captura visual do código formatado
- **PDF** - Documento profissional com cabeçalho
- **DOCX** - Arquivo Word editável

### 💾 Recursos Adicionais
- Persistência automática no navegador
- 7 exemplos prontos de código
- Console interativo com input do usuário
- Atalho Ctrl+Enter para executar
- Interface responsiva
- Lista de até 5 algoritmos para alternar rapidamente

## 🚀 Instalação e Uso

### Requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/dnsouzadev/editor-zoldyck
cd editor-zoldyck

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## 🎨 Tecnologias Utilizadas

- **React 19** - Biblioteca UI moderna
- **Vite 8** - Build tool ultrarrápido
- **Tailwind CSS 3** - Framework CSS utilitário
- **Monaco Editor** - Editor de código profissional
- **Lucide React** - Biblioteca de ícones
- **html2canvas** - Captura de tela
- **jsPDF** - Geração de PDFs
- **docx** - Criação de documentos Word

## 📖 Sintaxe Portugol Suportada

### Estrutura Básica
```portugol
algoritmo "Nome do Algoritmo"
var
   variavel: tipo
inicio
   // seu código aqui
fimalgoritmo
```

### Tipos de Dados
```
inteiro, real, caractere, logico
vetor[inicio..fim] de tipo
```

### Palavras-chave
```
algoritmo, var, inicio, fim, fimalgoritmo
se, entao, senao, fimse
enquanto, faca, fimenquanto
para, de, ate, passo, fimpara
repita, fimrepita
escreva, escreval, leia
```

### Operadores
```
Aritméticos: +, -, *, /, ^, mod
Relacionais: =, <>, >, <, >=, <=
Lógicos: e, ou, nao
Atribuição: <-
```

## 💡 Exemplo de Código

```portugol
algoritmo "Calculadora"
var
   n1, n2, resultado: real
   op: caractere
inicio
   escreva("Digite o primeiro número: ")
   leia(n1)
   escreva("Digite o segundo número: ")
   leia(n2)
   escreva("Digite a operação (+, -, *, /): ")
   leia(op)
   
   se op = "+" entao
      resultado <- n1 + n2
   senao
      se op = "-" entao
         resultado <- n1 - n2
      senao
         se op = "*" entao
            resultado <- n1 * n2
         senao
            resultado <- n1 / n2
         fimse
      fimse
   fimse
   
   escreval("Resultado: ", resultado)
fimalgoritmo
```

## 🎓 Casos de Uso

- 📚 Aprendizado de lógica de programação
- ✍️ Prática de algoritmos em Portugol
- 📝 Entrega de trabalhos acadêmicos
- 🧪 Testes rápidos sem instalação
- 🤝 Compartilhar exemplos de código

## ⌨️ Atalhos de Teclado

- `Ctrl + Enter` - Executar código
- Botão de tema - Alternar entre claro/escuro

## 🤝 Contribuições

Contribuições são bem-vindas! Algumas sugestões:
- [ ] Suporte a funções e procedimentos
- [ ] Mais exemplos de código
- [ ] Depurador visual
- [ ] Compartilhamento via URL
- [ ] Mais temas de cores

## 📄 Licença

MIT License - Livre para uso em projetos acadêmicos e pessoais.

---

**Editor Zoldyck** - Desenvolvido com ❤️ por Daniel Souza  
Sistemas de Informação - FeMASS/2026.1
