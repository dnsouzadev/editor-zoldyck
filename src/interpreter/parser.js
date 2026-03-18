// Parser - Análise Sintática do Portugol
// Converte tokens em AST (Abstract Syntax Tree)

import { TokenType } from './lexer.js';

// Tipos de nós da AST
export const NodeType = {
  PROGRAM: 'Program',
  VAR_DECLARATION: 'VarDeclaration',
  ASSIGNMENT: 'Assignment',
  BINARY_OP: 'BinaryOp',
  UNARY_OP: 'UnaryOp',
  NUMBER: 'Number',
  STRING: 'String',
  BOOLEAN: 'Boolean',
  IDENTIFIER: 'Identifier',
  IF_STATEMENT: 'IfStatement',
  WHILE_STATEMENT: 'WhileStatement',
  FOR_STATEMENT: 'ForStatement',
  REPEAT_STATEMENT: 'RepeatStatement',
  WRITE_STATEMENT: 'WriteStatement',
  READ_STATEMENT: 'ReadStatement',
  ARRAY_ACCESS: 'ArrayAccess',
  BLOCK: 'Block',
};

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
    this.currentToken = this.tokens[0];
  }

  advance() {
    this.position++;
    this.currentToken = this.position < this.tokens.length ? this.tokens[this.position] : this.tokens[this.tokens.length - 1];
  }

  expect(type) {
    if (this.currentToken.type !== type) {
      throw new Error(
        `Erro de sintaxe: esperado ${type}, encontrado ${this.currentToken.type} ` +
        `na linha ${this.currentToken.line}, coluna ${this.currentToken.column}`
      );
    }
    const token = this.currentToken;
    this.advance();
    return token;
  }

  match(...types) {
    return types.includes(this.currentToken.type);
  }

  // Programa principal
  parse() {
    const name = this.parseAlgorithmHeader();
    const variables = this.parseVariableDeclarations();
    const body = this.parseBody();
    
    return {
      type: NodeType.PROGRAM,
      name,
      variables,
      body,
    };
  }

  parseAlgorithmHeader() {
    this.expect(TokenType.ALGORITMO);
    const nameToken = this.expect(TokenType.STRING);
    return nameToken.value;
  }

  parseVariableDeclarations() {
    const variables = [];
    
    if (this.match(TokenType.VAR)) {
      this.advance();
      
      while (!this.match(TokenType.INICIO)) {
        const varDecl = this.parseVarDeclaration();
        variables.push(...varDecl);
      }
    }
    
    return variables;
  }

  parseVarDeclaration() {
    let varType = null;
    let isArray = false;
    let arraySize = null;
    const identifiers = [];

    // Sintaxe 1: tipo id1, id2... (ex: inteiro a, b, c)
    if (this.match(TokenType.INTEIRO, TokenType.REAL, TokenType.CARACTERE, TokenType.LOGICO, TokenType.VETOR)) {
      if (this.match(TokenType.VETOR)) {
        this.advance();
        this.expect(TokenType.ABRE_COLCHETE);
        const start = this.parseExpression();
        this.expect(TokenType.PONTO_PONTO);
        const end = this.parseExpression();
        this.expect(TokenType.FECHA_COLCHETE);
        this.expect(TokenType.DE);
        isArray = true;
        arraySize = { start, end };
      }
      
      varType = this.currentToken.type;
      this.advance();

      // Lista de identificadores
      identifiers.push(this.expect(TokenType.IDENTIFICADOR).value);
      while (this.match(TokenType.VIRGULA)) {
        this.advance();
        identifiers.push(this.expect(TokenType.IDENTIFICADOR).value);
      }
    } 
    // Sintaxe 2: id1, id2... : tipo (ex: a, b, c: inteiro)
    else {
      identifiers.push(this.expect(TokenType.IDENTIFICADOR).value);
      while (this.match(TokenType.VIRGULA)) {
        this.advance();
        identifiers.push(this.expect(TokenType.IDENTIFICADOR).value);
      }
      
      this.expect(TokenType.DOIS_PONTOS);
      
      if (this.match(TokenType.VETOR)) {
        this.advance();
        this.expect(TokenType.ABRE_COLCHETE);
        const start = this.parseExpression();
        this.expect(TokenType.PONTO_PONTO);
        const end = this.parseExpression();
        this.expect(TokenType.FECHA_COLCHETE);
        this.expect(TokenType.DE);
        isArray = true;
        arraySize = { start, end };
      }
      
      if (this.match(TokenType.INTEIRO, TokenType.REAL, TokenType.CARACTERE, TokenType.LOGICO)) {
        varType = this.currentToken.type;
        this.advance();
      } else {
        throw new Error(`Tipo de variável esperado na linha ${this.currentToken.line}`);
      }
    }
    
    // Criar declarações para cada identificador
    return identifiers.map(name => ({
      type: NodeType.VAR_DECLARATION,
      name,
      varType,
      isArray,
      arraySize,
    }));
  }

  parseBody() {
    let useBraces = false;
    if (this.match(TokenType.INICIO)) {
      this.advance();
      if (this.match(TokenType.ABRE_CHAVE)) {
        this.advance();
        useBraces = true;
      }
    } else if (this.match(TokenType.ABRE_CHAVE)) {
      this.advance();
      useBraces = true;
    } else {
      this.expect(TokenType.INICIO);
    }

    const statements = this.parseStatements();
    
    if (useBraces) {
      this.expect(TokenType.FECHA_CHAVE);
      if (this.match(TokenType.FIMALGORITMO)) {
        this.advance();
      }
    } else {
      if (this.match(TokenType.FIMALGORITMO)) {
        this.advance();
      } else {
        this.expect(TokenType.FIM);
        if (this.match(TokenType.ALGORITMO)) {
          this.advance();
        }
      }
    }
    
    return {
      type: NodeType.BLOCK,
      statements,
    };
  }

  parseStatements() {
    const statements = [];
    
    while (!this.match(TokenType.FIM, TokenType.FIMALGORITMO, TokenType.FIMSE, TokenType.SENAO, 
                        TokenType.FIMENQUANTO, TokenType.FIMPARA, TokenType.ATE, 
                        TokenType.FECHA_CHAVE, TokenType.EOF)) {
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      } else {
        throw new Error(
          `Comando inválido ou inesperado: '${this.currentToken.value || this.currentToken.type}' ` +
          `na linha ${this.currentToken.line}, coluna ${this.currentToken.column}`
        );
      }
    }
    
    return statements;
  }

  parseStatement() {
    // Atribuição
    if (this.match(TokenType.IDENTIFICADOR)) {
      return this.parseAssignment();
    }
    
    // Se/Então/Senão
    if (this.match(TokenType.SE)) {
      return this.parseIfStatement();
    }
    
    // Enquanto
    if (this.match(TokenType.ENQUANTO)) {
      return this.parseWhileStatement();
    }
    
    // Para
    if (this.match(TokenType.PARA)) {
      return this.parseForStatement();
    }
    
    // Repita
    if (this.match(TokenType.REPITA)) {
      return this.parseRepeatStatement();
    }
    
    // Escreva/Escreval
    if (this.match(TokenType.ESCREVA, TokenType.ESCREVAL)) {
      return this.parseWriteStatement();
    }
    
    // Leia
    if (this.match(TokenType.LEIA)) {
      return this.parseReadStatement();
    }
    
    return null;
  }

  parseAssignment() {
    const lvalue = this.parseLValue();
    this.expect(TokenType.ATRIBUICAO);
    const value = this.parseExpression();
    
    return {
      type: NodeType.ASSIGNMENT,
      identifier: lvalue.identifier,
      index: lvalue.index,
      value,
    };
  }

  parseLValue() {
    const identifier = this.expect(TokenType.IDENTIFICADOR).value;
    
    // Pode ser acesso a array
    let index = null;
    if (this.match(TokenType.ABRE_COLCHETE)) {
      this.advance();
      index = this.parseExpression();
      this.expect(TokenType.FECHA_COLCHETE);
    }
    
    return { identifier, index };
  }

  parseIfStatement() {
    this.expect(TokenType.SE);
    const condition = this.parseExpression();
    
    let useBraces = false;
    if (this.match(TokenType.ENTAO)) {
      this.advance();
      if (this.match(TokenType.ABRE_CHAVE)) {
        this.advance();
        useBraces = true;
      }
    } else if (this.match(TokenType.ABRE_CHAVE)) {
      this.advance();
      useBraces = true;
    } else {
      this.expect(TokenType.ENTAO);
    }
    
    const thenStatements = this.parseStatements();
    if (useBraces) {
      this.expect(TokenType.FECHA_CHAVE);
    }
    
    let elseBlock = null;
    if (this.match(TokenType.SENAO)) {
      this.advance();
      
      let useBracesElse = false;
      if (this.match(TokenType.ABRE_CHAVE)) {
        this.advance();
        useBracesElse = true;
      }
      
      const elseStatements = this.parseStatements();
      if (useBracesElse) {
        this.expect(TokenType.FECHA_CHAVE);
      }
      
      elseBlock = { type: NodeType.BLOCK, statements: elseStatements };
    }
    
    if (!useBraces) {
      this.expect(TokenType.FIMSE);
    } else if (this.match(TokenType.FIMSE)) {
      this.advance();
    }
    
    return {
      type: NodeType.IF_STATEMENT,
      condition,
      thenBlock: { type: NodeType.BLOCK, statements: thenStatements },
      elseBlock: elseBlock,
    };
  }

  parseWhileStatement() {
    this.expect(TokenType.ENQUANTO);
    const condition = this.parseExpression();
    
    let useBraces = false;
    if (this.match(TokenType.FACA)) {
      this.advance();
      if (this.match(TokenType.ABRE_CHAVE)) {
        this.advance();
        useBraces = true;
      }
    } else if (this.match(TokenType.ABRE_CHAVE)) {
      this.advance();
      useBraces = true;
    } else {
      this.expect(TokenType.FACA);
    }
    
    const body = this.parseStatements();
    
    if (useBraces) {
      this.expect(TokenType.FECHA_CHAVE);
      if (this.match(TokenType.FIMENQUANTO)) this.advance();
    } else {
      this.expect(TokenType.FIMENQUANTO);
    }
    
    return {
      type: NodeType.WHILE_STATEMENT,
      condition,
      body: { type: NodeType.BLOCK, statements: body },
    };
  }

  parseForStatement() {
    this.expect(TokenType.PARA);
    const variable = this.expect(TokenType.IDENTIFICADOR).value;
    this.expect(TokenType.DE);
    const start = this.parseExpression();
    this.expect(TokenType.ATE);
    const end = this.parseExpression();
    
    let step = { type: NodeType.NUMBER, value: 1 };
    if (this.match(TokenType.PASSO)) {
      this.advance();
      step = this.parseExpression();
    }
    
    let useBraces = false;
    if (this.match(TokenType.FACA)) {
      this.advance();
      if (this.match(TokenType.ABRE_CHAVE)) {
        this.advance();
        useBraces = true;
      }
    } else if (this.match(TokenType.ABRE_CHAVE)) {
      this.advance();
      useBraces = true;
    } else {
      this.expect(TokenType.FACA);
    }
    
    const body = this.parseStatements();
    
    if (useBraces) {
      this.expect(TokenType.FECHA_CHAVE);
      if (this.match(TokenType.FIMPARA)) this.advance();
    } else {
      this.expect(TokenType.FIMPARA);
    }
    
    return {
      type: NodeType.FOR_STATEMENT,
      variable,
      start,
      end,
      step,
      body: { type: NodeType.BLOCK, statements: body },
    };
  }

  parseRepeatStatement() {
    this.expect(TokenType.REPITA);
    
    let useBraces = false;
    if (this.match(TokenType.ABRE_CHAVE)) {
      this.advance();
      useBraces = true;
    }
    
    const body = this.parseStatements();
    
    if (useBraces) {
      this.expect(TokenType.FECHA_CHAVE);
    }
    
    this.expect(TokenType.ATE);
    const condition = this.parseExpression();
    
    return {
      type: NodeType.REPEAT_STATEMENT,
      condition,
      body: { type: NodeType.BLOCK, statements: body },
    };
  }

  parseWriteStatement() {
    const isWriteLine = this.currentToken.type === TokenType.ESCREVAL;
    this.advance();
    
    this.expect(TokenType.ABRE_PAREN);
    
    const expressions = [];
    if (!this.match(TokenType.FECHA_PAREN)) {
      expressions.push(this.parseExpression());
      
      while (this.match(TokenType.VIRGULA)) {
        this.advance();
        expressions.push(this.parseExpression());
      }
    }
    
    this.expect(TokenType.FECHA_PAREN);
    
    return {
      type: NodeType.WRITE_STATEMENT,
      expressions,
      newLine: isWriteLine,
    };
  }

  parseReadStatement() {
    this.expect(TokenType.LEIA);
    this.expect(TokenType.ABRE_PAREN);
    
    const targets = [];
    targets.push(this.parseLValue());
    
    while (this.match(TokenType.VIRGULA)) {
      this.advance();
      targets.push(this.parseLValue());
    }
    
    this.expect(TokenType.FECHA_PAREN);
    
    return {
      type: NodeType.READ_STATEMENT,
      targets,
    };
  }

  // Expressões com precedência de operadores
  parseExpression() {
    return this.parseLogicalOr();
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd();
    
    while (this.match(TokenType.OU)) {
      const operator = this.currentToken.type;
      this.advance();
      const right = this.parseLogicalAnd();
      left = { type: NodeType.BINARY_OP, operator, left, right };
    }
    
    return left;
  }

  parseLogicalAnd() {
    let left = this.parseRelational();
    
    while (this.match(TokenType.E)) {
      const operator = this.currentToken.type;
      this.advance();
      const right = this.parseRelational();
      left = { type: NodeType.BINARY_OP, operator, left, right };
    }
    
    return left;
  }

  parseRelational() {
    let left = this.parseAdditive();
    
    while (this.match(TokenType.IGUAL, TokenType.DIFERENTE, TokenType.MAIOR, 
                       TokenType.MENOR, TokenType.MAIOR_IGUAL, TokenType.MENOR_IGUAL)) {
      const operator = this.currentToken.type;
      this.advance();
      const right = this.parseAdditive();
      left = { type: NodeType.BINARY_OP, operator, left, right };
    }
    
    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    
    while (this.match(TokenType.MAIS, TokenType.MENOS)) {
      const operator = this.currentToken.type;
      this.advance();
      const right = this.parseMultiplicative();
      left = { type: NodeType.BINARY_OP, operator, left, right };
    }
    
    return left;
  }

  parseMultiplicative() {
    let left = this.parsePower();
    
    while (this.match(TokenType.MULTIPLICACAO, TokenType.DIVISAO, TokenType.MOD)) {
      const operator = this.currentToken.type;
      this.advance();
      const right = this.parsePower();
      left = { type: NodeType.BINARY_OP, operator, left, right };
    }
    
    return left;
  }

  parsePower() {
    let left = this.parseUnary();
    
    if (this.match(TokenType.POTENCIA)) {
      const operator = this.currentToken.type;
      this.advance();
      const right = this.parsePower(); // Associatividade à direita
      left = { type: NodeType.BINARY_OP, operator, left, right };
    }
    
    return left;
  }

  parseUnary() {
    if (this.match(TokenType.MENOS, TokenType.NAO)) {
      const operator = this.currentToken.type;
      this.advance();
      const operand = this.parseUnary();
      return { type: NodeType.UNARY_OP, operator, operand };
    }
    
    return this.parsePrimary();
  }

  parsePrimary() {
    // Número
    if (this.match(TokenType.NUMERO)) {
      const value = this.currentToken.value;
      this.advance();
      return { type: NodeType.NUMBER, value };
    }
    
    // String
    if (this.match(TokenType.STRING)) {
      const value = this.currentToken.value;
      this.advance();
      return { type: NodeType.STRING, value };
    }
    
    // Boolean
    if (this.match(TokenType.VERDADEIRO, TokenType.FALSO)) {
      const value = this.currentToken.type === TokenType.VERDADEIRO;
      this.advance();
      return { type: NodeType.BOOLEAN, value };
    }
    
    // Identificador ou acesso a array
    if (this.match(TokenType.IDENTIFICADOR)) {
      const name = this.currentToken.value;
      this.advance();
      
      if (this.match(TokenType.ABRE_COLCHETE)) {
        this.advance();
        const index = this.parseExpression();
        this.expect(TokenType.FECHA_COLCHETE);
        return { type: NodeType.ARRAY_ACCESS, name, index };
      }
      
      return { type: NodeType.IDENTIFIER, name };
    }
    
    // Expressão entre parênteses
    if (this.match(TokenType.ABRE_PAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.expect(TokenType.FECHA_PAREN);
      return expr;
    }
    
    throw new Error(
      `Expressão inesperada: ${this.currentToken.type} na linha ${this.currentToken.line}`
    );
  }
}
