// Lexer - Análise Léxica do Portugol
// Converte código fonte em tokens

const TokenType = {
  // Palavras-chave
  ALGORITMO: 'ALGORITMO',
  VAR: 'VAR',
  INICIO: 'INICIO',
  FIM: 'FIM',
  FIMALGORITMO: 'FIMALGORITMO',
  SE: 'SE',
  ENTAO: 'ENTAO',
  SENAO: 'SENAO',
  FIMSE: 'FIMSE',
  ENQUANTO: 'ENQUANTO',
  FACA: 'FACA',
  FIMENQUANTO: 'FIMENQUANTO',
  PARA: 'PARA',
  DE: 'DE',
  ATE: 'ATE',
  PASSO: 'PASSO',
  FIMPARA: 'FIMPARA',
  REPITA: 'REPITA',
  FIMREPITA: 'FIMREPITA',
  
  // Tipos
  INTEIRO: 'INTEIRO',
  REAL: 'REAL',
  CARACTERE: 'CARACTERE',
  LOGICO: 'LOGICO',
  VETOR: 'VETOR',
  
  // Funções built-in
  ESCREVA: 'ESCREVA',
  ESCREVAL: 'ESCREVAL',
  LEIA: 'LEIA',
  
  // Operadores lógicos
  E: 'E',
  OU: 'OU',
  NAO: 'NAO',
  
  // Literais e identificadores
  IDENTIFICADOR: 'IDENTIFICADOR',
  NUMERO: 'NUMERO',
  STRING: 'STRING',
  VERDADEIRO: 'VERDADEIRO',
  FALSO: 'FALSO',
  
  // Operadores
  ATRIBUICAO: 'ATRIBUICAO',  // <-
  MAIS: 'MAIS',               // +
  MENOS: 'MENOS',             // -
  MULTIPLICACAO: 'MULTIPLICACAO', // *
  DIVISAO: 'DIVISAO',         // /
  POTENCIA: 'POTENCIA',       // ^
  MOD: 'MOD',                 // mod ou %
  
  // Comparação
  IGUAL: 'IGUAL',             // =
  DIFERENTE: 'DIFERENTE',     // <>
  MAIOR: 'MAIOR',             // >
  MENOR: 'MENOR',             // <
  MAIOR_IGUAL: 'MAIOR_IGUAL', // >=
  MENOR_IGUAL: 'MENOR_IGUAL', // <=
  
  // Delimitadores
  ABRE_PAREN: 'ABRE_PAREN',   // (
  FECHA_PAREN: 'FECHA_PAREN', // )
  ABRE_COLCHETE: 'ABRE_COLCHETE', // [
  FECHA_COLCHETE: 'FECHA_COLCHETE', // ]
  ABRE_CHAVE: 'ABRE_CHAVE',     // {
  FECHA_CHAVE: 'FECHA_CHAVE',     // }
  VIRGULA: 'VIRGULA',         // ,
  DOIS_PONTOS: 'DOIS_PONTOS', // :
  PONTO_VIRGULA: 'PONTO_VIRGULA', // ;
  PONTO_PONTO: 'PONTO_PONTO', // ..
  
  // Especiais
  NOVA_LINHA: 'NOVA_LINHA',
  EOF: 'EOF',
};

const KEYWORDS = {
  'algoritmo': TokenType.ALGORITMO,
  'var': TokenType.VAR,
  'inicio': TokenType.INICIO,
  'fim': TokenType.FIM,
  'fimalgoritmo': TokenType.FIMALGORITMO,
  'se': TokenType.SE,
  'entao': TokenType.ENTAO,
  'então': TokenType.ENTAO,
  'senao': TokenType.SENAO,
  'senão': TokenType.SENAO,
  'fimse': TokenType.FIMSE,
  'enquanto': TokenType.ENQUANTO,
  'faca': TokenType.FACA,
  'faça': TokenType.FACA,
  'fimenquanto': TokenType.FIMENQUANTO,
  'para': TokenType.PARA,
  'de': TokenType.DE,
  'ate': TokenType.ATE,
  'até': TokenType.ATE,
  'passo': TokenType.PASSO,
  'fimpara': TokenType.FIMPARA,
  'repita': TokenType.REPITA,
  'fimrepita': TokenType.FIMREPITA,
  'inteiro': TokenType.INTEIRO,
  'real': TokenType.REAL,
  'caractere': TokenType.CARACTERE,
  'logico': TokenType.LOGICO,
  'lógico': TokenType.LOGICO,
  'vetor': TokenType.VETOR,
  'escreva': TokenType.ESCREVA,
  'escreval': TokenType.ESCREVAL,
  'leia': TokenType.LEIA,
  'e': TokenType.E,
  'ou': TokenType.OU,
  'nao': TokenType.NAO,
  'não': TokenType.NAO,
  'verdadeiro': TokenType.VERDADEIRO,
  'falso': TokenType.FALSO,
  'mod': TokenType.MOD,
};

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.currentChar = this.input[0];
  }

  advance() {
    if (this.currentChar === '\n') {
      this.line++;
      this.column = 0;
    }
    this.position++;
    this.column++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
  }

  peek(offset = 1) {
    const peekPos = this.position + offset;
    return peekPos < this.input.length ? this.input[peekPos] : null;
  }

  skipWhitespace() {
    while (this.currentChar && /[ \t\r]/.test(this.currentChar)) {
      this.advance();
    }
  }

  skipComment() {
    if (this.currentChar === '/' && this.peek() === '/') {
      while (this.currentChar && this.currentChar !== '\n') {
        this.advance();
      }
    }
  }

  readNumber() {
    let num = '';
    const startColumn = this.column;
    
    while (this.currentChar && /[0-9]/.test(this.currentChar)) {
      num += this.currentChar;
      this.advance();
    }
    
    if (this.currentChar === '.' && /[0-9]/.test(this.peek())) {
      num += this.currentChar;
      this.advance();
      while (this.currentChar && /[0-9]/.test(this.currentChar)) {
        num += this.currentChar;
        this.advance();
      }
    }
    
    return new Token(TokenType.NUMERO, parseFloat(num), this.line, startColumn);
  }

  readString() {
    let str = '';
    const startColumn = this.column;
    const quote = this.currentChar;
    this.advance(); // Skip opening quote
    
    while (this.currentChar && this.currentChar !== quote) {
      str += this.currentChar;
      this.advance();
    }
    
    if (this.currentChar === quote) {
      this.advance(); // Skip closing quote
    }
    
    return new Token(TokenType.STRING, str, this.line, startColumn);
  }

  readIdentifier() {
    let id = '';
    const startColumn = this.column;
    
    while (this.currentChar && /[a-záàâãéêíóôõúüçA-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ0-9_]/.test(this.currentChar)) {
      id += this.currentChar;
      this.advance();
    }
    
    const lowerID = id.toLowerCase();
    const type = KEYWORDS[lowerID] || TokenType.IDENTIFICADOR;
    
    return new Token(type, id, this.line, startColumn);
  }

  getNextToken() {
    while (this.currentChar) {
      const startColumn = this.column;

      // Whitespace
      if (/[ \t\r]/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      // Comentários
      if (this.currentChar === '/' && this.peek() === '/') {
        this.skipComment();
        continue;
      }

      // Nova linha
      if (this.currentChar === '\n') {
        this.advance();
        continue; // Ignorar nova linha por enquanto
      }

      // Números
      if (/[0-9]/.test(this.currentChar)) {
        return this.readNumber();
      }

      // Strings
      if (this.currentChar === '"' || this.currentChar === "'") {
        return this.readString();
      }

      // Identificadores e palavras-chave
      if (/[a-záàâãéêíóôõúüçA-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ_]/.test(this.currentChar)) {
        return this.readIdentifier();
      }

      // Atribuição <-
      if (this.currentChar === '<' && this.peek() === '-') {
        this.advance();
        this.advance();
        return new Token(TokenType.ATRIBUICAO, '<-', this.line, startColumn);
      }

      // Diferente <>
      if (this.currentChar === '<' && this.peek() === '>') {
        this.advance();
        this.advance();
        return new Token(TokenType.DIFERENTE, '<>', this.line, startColumn);
      }

      // Maior ou igual >=
      if (this.currentChar === '>' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(TokenType.MAIOR_IGUAL, '>=', this.line, startColumn);
      }

      // Menor ou igual <=
      if (this.currentChar === '<' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(TokenType.MENOR_IGUAL, '<=', this.line, startColumn);
      }

      // Ponto ponto ..
      if (this.currentChar === '.' && this.peek() === '.') {
        this.advance();
        this.advance();
        return new Token(TokenType.PONTO_PONTO, '..', this.line, startColumn);
      }

      // Operadores simples
      const singleChar = this.currentChar;
      this.advance();

      switch (singleChar) {
        case '+': return new Token(TokenType.MAIS, '+', this.line, startColumn);
        case '-': return new Token(TokenType.MENOS, '-', this.line, startColumn);
        case '*': return new Token(TokenType.MULTIPLICACAO, '*', this.line, startColumn);
        case '/': return new Token(TokenType.DIVISAO, '/', this.line, startColumn);
        case '^': return new Token(TokenType.POTENCIA, '^', this.line, startColumn);
        case '%': return new Token(TokenType.MOD, '%', this.line, startColumn);
        case '=': return new Token(TokenType.IGUAL, '=', this.line, startColumn);
        case '>': return new Token(TokenType.MAIOR, '>', this.line, startColumn);
        case '<': return new Token(TokenType.MENOR, '<', this.line, startColumn);
        case '(': return new Token(TokenType.ABRE_PAREN, '(', this.line, startColumn);
        case ')': return new Token(TokenType.FECHA_PAREN, ')', this.line, startColumn);
        case '[': return new Token(TokenType.ABRE_COLCHETE, '[', this.line, startColumn);
        case ']': return new Token(TokenType.FECHA_COLCHETE, ']', this.line, startColumn);
        case '{': return new Token(TokenType.ABRE_CHAVE, '{', this.line, startColumn);
        case '}': return new Token(TokenType.FECHA_CHAVE, '}', this.line, startColumn);
        case ',': return new Token(TokenType.VIRGULA, ',', this.line, startColumn);
        case ':': return new Token(TokenType.DOIS_PONTOS, ':', this.line, startColumn);
        case ';': return new Token(TokenType.PONTO_VIRGULA, ';', this.line, startColumn);
        default:
          throw new Error(`Caractere inesperado '${singleChar}' na linha ${this.line}, coluna ${startColumn}`);
      }
    }

    return new Token(TokenType.EOF, null, this.line, this.column);
  }

  tokenize() {
    const tokens = [];
    let token = this.getNextToken();
    
    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }
    
    tokens.push(token); // Add EOF
    return tokens;
  }
}

export { TokenType };
