# 📖 Guia de Uso - Editor Zoldyck

## 🎨 Interface

### Alternando Temas
- Clique no ícone de **sol** (tema claro) ou **lua** (tema escuro) no canto superior direito
- A preferência é salva automaticamente no navegador

### Áreas Principais

1. **Editor de Código** (esquerda)
   - Digite ou cole seu código Portugol aqui
   - Syntax highlighting automático
   - Auto-save a cada mudança

2. **Console de Saída** (direita)
   - Exibe resultados da execução
   - Permite entrada de dados quando `leia()` é usado
   - Limpe com o botão "Limpar"

3. **Toolbar** (topo)
   - **Executar**: Roda o código (Ctrl+Enter)
   - **Limpar**: Limpa o console
   - **Exemplos**: Carrega códigos prontos
   - **Exportar**: Salva como PNG/PDF/DOCX
   - **Tema**: Alterna claro/escuro

## ⌨️ Atalhos

- `Ctrl + Enter` - Executar código
- `Ctrl + S` - Salvar (automático)

## 📝 Escrevendo Código Portugol

### Estrutura Básica

```portugol
algoritmo "Meu Programa"
var
   nome: caractere
   idade: inteiro
inicio
   escreva("Digite seu nome: ")
   leia(nome)
   escreval("Olá, ", nome, "!")
fimalgoritmo
```

### Declaração de Variáveis

```portugol
var
   numero: inteiro
   preco: real
   letra: caractere
   aprovado: logico
```

### Vetores

```portugol
var
   numeros: vetor[1..10] de inteiro
   nomes: vetor[1..5] de caractere
inicio
   numeros[1] <- 100
   leia(nomes[2])
fimalgoritmo
```

### Estruturas Condicionais

```portugol
se idade >= 18 entao
   escreval("Maior de idade")
senao
   escreval("Menor de idade")
fimse
```

### Estruturas de Repetição

**Enquanto:**
```portugol
enquanto contador <= 10 faca
   escreval(contador)
   contador <- contador + 1
fimenquanto
```

**Para:**
```portugol
para i de 1 ate 10 passo 1 faca
   escreval(i)
fimpara
```

**Repita:**
```portugol
repita
   escreva("Digite um número positivo: ")
   leia(numero)
ate numero > 0
```

## 📤 Exportando Seu Código

1. Clique em **Exportar**
2. Escolha o formato:
   - **PNG**: Imagem do código (ótimo para prints)
   - **PDF**: Documento formatado (recomendado para entregar)
   - **DOCX**: Word editável
3. Clique em **Exportar**
4. O arquivo será baixado automaticamente

### Para Entregar no WebAcadêmico

1. Escreva seu código
2. Clique em **Exportar** → **PDF**
3. O PDF incluirá:
   - Nome do algoritmo
   - Data de criação
   - Seu nome como desenvolvedor
   - Código formatado

## 🐛 Solucionando Problemas

### "Erro de sintaxe"
- Verifique se todas as palavras-chave estão corretas
- Confira se declarou todas as variáveis
- Certifique-se de que todo `se` tem `fimse`, todo `enquanto` tem `fimenquanto`, etc.

### "Variável não declarada"
- Declare todas as variáveis na seção `var`
- Verifique a grafia correta

### Input não aparece
- Certifique-se de usar `leia(variavel)`
- Digite o valor e pressione Enter

## 💡 Dicas

1. **Use os exemplos**: Clique em "Exemplos" para ver códigos funcionais
2. **Salve sempre**: O código é salvo automaticamente no navegador
3. **Teste incrementalmente**: Execute após cada mudança importante
4. **Comentários**: Use `//` para comentar seu código
5. **Indentação**: Use Tab para melhor legibilidade

## 📚 Exemplos Incluídos

1. **Hello World** - Programa básico
2. **Calculadora** - Operações matemáticas
3. **Tabuada** - Estrutura de repetição
4. **Par ou Ímpar** - Condicionais
5. **Média de Notas** - Cálculos e condições
6. **Vetores** - Trabalho com arrays
7. **Contagem** - Laços while

---

**Dúvidas?** Revise a sintaxe Portugol ou teste os exemplos incluídos!
