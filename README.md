# 📝 Editor Portugol Web

Editor e interpretador online de **Portugol** com funcionalidades de execução e exportação para imagem, PDF e Word. Desenvolvido para facilitar o aprendizado de lógica de programação e atender requisitos acadêmicos.

![Portugol Web Editor](https://img.shields.io/badge/React-19.2.4-blue) ![Vite](https://img.shields.io/badge/Vite-8.0-purple) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Funcionalidades

### ✏️ Editor de Código
- **Monaco Editor** (mesmo editor do VS Code)
- Syntax highlighting customizado para Portugol
- Numeração de linhas
- Auto-indentação
- Tema escuro profissional

### ▶️ Interpretador Portugol
Executa código Portugol completo diretamente no navegador:

- ✅ Declaração de variáveis (inteiro, real, caractere, logico)
- ✅ Vetores e matrizes
- ✅ Operadores aritméticos (+, -, *, /, ^, mod)
- ✅ Operadores relacionais (=, <>, >, <, >=, <=)
- ✅ Operadores lógicos (e, ou, nao)
- ✅ Estruturas condicionais (se...então...senão)
- ✅ Estruturas de repetição (enquanto, para, repita...até)
- ✅ Entrada/saída (leia, escreva, escreval)

### 📤 Exportação
Perfeito para entregar trabalhos no WebAcadêmico:

- **🖼️ PNG**: Captura visual do código formatado
- **📄 PDF**: Documento profissional com cabeçalho
- **📝 DOCX**: Arquivo Word editável

### 💾 Extras
- Persistência automática no navegador (localStorage)
- 7 exemplos prontos de código Portugol
- Console interativo com suporte a input
- Atalho Ctrl+Enter para executar
- Interface responsiva

## 🚀 Como Usar

### Instalação

```bash
# Clone ou baixe o repositório
cd portugol-web-editor

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

## 📚 Exemplo de Código Suportado

```portugol
algoritmo "Calculadora Simples"
var
   num1, num2, resultado: real
   operacao: caractere
inicio
   escreva("Digite o primeiro número: ")
   leia(num1)
   escreva("Digite o segundo número: ")
   leia(num2)
   escreva("Digite a operação (+, -, *, /): ")
   leia(operacao)
   
   se operacao = "+" entao
      resultado <- num1 + num2
   senao
      se operacao = "-" entao
         resultado <- num1 - num2
      senao
         se operacao = "*" entao
            resultado <- num1 * num2
         senao
            se operacao = "/" entao
               resultado <- num1 / num2
            fimse
         fimse
      fimse
   fimse
   
   escreval("Resultado: ", resultado)
fimalgoritmo
```

## 🛠️ Tecnologias

- **React 19** - Interface moderna
- **Vite 8** - Build ultrarrápido
- **Monaco Editor** - Editor profissional
- **html2canvas** - Captura de tela
- **jsPDF** - Geração de PDFs
- **docx** - Criação de documentos Word

## 📖 Sintaxe Portugol Suportada

### Palavras-chave
```
algoritmo, var, inicio, fim, fimalgoritmo
se, entao, senao, fimse
enquanto, faca, fimenquanto
para, de, ate, passo, fimpara
repita, fimrepita
escreva, escreval, leia
```

### Tipos de Dados
```
inteiro, real, caractere, logico
vetor[inicio..fim] de tipo
```

### Operadores
```
Aritméticos: +, -, *, /, ^, mod
Relacionais: =, <>, >, <, >=, <=
Lógicos: e, ou, nao
Atribuição: <-
```

## 💡 Dicas de Uso

1. **Executar código**: Clique em "▶ Executar" ou pressione `Ctrl+Enter`
2. **Input do usuário**: O console mostrará um campo de input quando `leia()` for chamado
3. **Exportar**: Clique em "📤 Exportar" e escolha o formato desejado
4. **Exemplos**: Clique em "📄 Exemplos" para carregar códigos prontos
5. **Salvar**: O código é salvo automaticamente no navegador

## 🎓 Casos de Uso

- Aprendizado de lógica de programação
- Prática de algoritmos em Portugol
- Entrega de trabalhos acadêmicos (formato imagem/PDF/Word)
- Testes rápidos de código sem instalar nada
- Compartilhar exemplos de código

## 🐛 Limitações Conhecidas

- Vetores multidimensionais: suporte básico
- Funções/procedimentos: não implementado (planejado)
- Comentários de bloco: apenas `//` suportado

## 📝 Licença

MIT License - Sinta-se livre para usar em projetos acadêmicos e pessoais!

## 🤝 Contribuições

Contribuições são bem-vindas! Algumas ideias:
- [ ] Suporte a funções e procedimentos
- [ ] Mais temas de cores
- [ ] Compartilhamento via URL
- [ ] Mais exemplos de código
- [ ] Depurador (debugger) visual

---

**Desenvolvido para facilitar o aprendizado de lógica de programação** 🚀
