// Evaluator - Executa a AST do Portugol
// Interpreta e executa o código

import { NodeType } from './parser.js';
import { TokenType } from './lexer.js';

export class Evaluator {
  constructor(onWrite, onRead) {
    this.onWrite = onWrite; // Callback para escrever no console
    this.onRead = onRead;   // Callback para ler input (assíncrono)
    this.variables = new Map();
    this.isRunning = false;
  }

  async evaluate(ast) {
    this.variables.clear();
    this.isRunning = true;

    try {
      // Declarar variáveis
      for (const varDecl of ast.variables) {
        await this.evaluateNode(varDecl);
      }

      // Executar corpo do programa
      await this.evaluateNode(ast.body);
      
      return { success: true };
    } catch (error) {
      this.isRunning = false;
      return { success: false, error: error.message };
    }
  }

  async evaluateNode(node) {
    if (!this.isRunning) {
      throw new Error('Execução interrompida');
    }

    switch (node.type) {
      case NodeType.BLOCK:
        return await this.evaluateBlock(node);
      
      case NodeType.VAR_DECLARATION:
        return await this.evaluateVarDeclaration(node);
      
      case NodeType.ASSIGNMENT:
        return await this.evaluateAssignment(node);
      
      case NodeType.IF_STATEMENT:
        return await this.evaluateIfStatement(node);
      
      case NodeType.WHILE_STATEMENT:
        return await this.evaluateWhileStatement(node);
      
      case NodeType.FOR_STATEMENT:
        return await this.evaluateForStatement(node);
      
      case NodeType.REPEAT_STATEMENT:
        return await this.evaluateRepeatStatement(node);
      
      case NodeType.WRITE_STATEMENT:
        return await this.evaluateWriteStatement(node);
      
      case NodeType.READ_STATEMENT:
        return await this.evaluateReadStatement(node);
      
      case NodeType.BINARY_OP:
        return await this.evaluateBinaryOp(node);
      
      case NodeType.UNARY_OP:
        return await this.evaluateUnaryOp(node);
      
      case NodeType.NUMBER:
        return node.value;
      
      case NodeType.STRING:
        return node.value;
      
      case NodeType.BOOLEAN:
        return node.value;
      
      case NodeType.IDENTIFIER:
        return this.getVariable(node.name);
      
      case NodeType.ARRAY_ACCESS:
        return await this.evaluateArrayAccess(node);
      
      default:
        throw new Error(`Tipo de nó desconhecido: ${node.type}`);
    }
  }

  async evaluateBlock(node) {
    for (const statement of node.statements) {
      await this.evaluateNode(statement);
    }
  }

  async evaluateVarDeclaration(node) {
    if (node.isArray) {
      // Avaliar tamanho do array
      const start = await this.evaluateNode(node.arraySize.start);
      const end = await this.evaluateNode(node.arraySize.end);
      
      const size = Math.max(0, end - start + 1);
      const array = new Array(size).fill(this.getDefaultValue(node.varType));
      this.variables.set(node.name, { value: array, isArray: true, start, type: node.varType });
    } else {
      this.variables.set(node.name, { value: this.getDefaultValue(node.varType), isArray: false, type: node.varType });
    }
  }

  getDefaultValue(varType) {
    switch (varType) {
      case TokenType.INTEIRO:
      case TokenType.REAL:
        return 0;
      case TokenType.CARACTERE:
        return '';
      case TokenType.LOGICO:
        return false;
      default:
        return null;
    }
  }

  async evaluateAssignment(node) {
    const value = await this.evaluateNode(node.value);
    
    if (node.index !== null) {
      // Atribuição a array
      const index = await this.evaluateNode(node.index);
      const varData = this.variables.get(node.identifier);
      
      if (!varData) {
        throw new Error(`Variável '${node.identifier}' não declarada`);
      }
      
      if (!varData.isArray) {
        throw new Error(`'${node.identifier}' não é um vetor`);
      }
      
      const arrayIndex = index - varData.start;
      if (arrayIndex < 0 || arrayIndex >= varData.value.length) {
        throw new Error(`Índice ${index} fora dos limites do vetor '${node.identifier}'`);
      }
      
      varData.value[arrayIndex] = value;
    } else {
      // Atribuição simples
      if (!this.variables.has(node.identifier)) {
        throw new Error(`Variável '${node.identifier}' não declarada`);
      }
      
      this.variables.get(node.identifier).value = value;
    }
  }

  async evaluateIfStatement(node) {
    const condition = await this.evaluateNode(node.condition);
    
    if (condition) {
      await this.evaluateNode(node.thenBlock);
    } else if (node.elseBlock) {
      await this.evaluateNode(node.elseBlock);
    }
  }

  async evaluateWhileStatement(node) {
    while (await this.evaluateNode(node.condition)) {
      await this.evaluateNode(node.body);
    }
  }

  async evaluateForStatement(node) {
    const start = await this.evaluateNode(node.start);
    const end = await this.evaluateNode(node.end);
    const step = await this.evaluateNode(node.step);
    
    // Criar variável de controle se não existir
    if (!this.variables.has(node.variable)) {
      this.variables.set(node.variable, { value: start, isArray: false });
    } else {
      this.variables.get(node.variable).value = start;
    }
    
    if (step > 0) {
      for (let i = start; i <= end; i += step) {
        this.variables.get(node.variable).value = i;
        await this.evaluateNode(node.body);
      }
    } else {
      for (let i = start; i >= end; i += step) {
        this.variables.get(node.variable).value = i;
        await this.evaluateNode(node.body);
      }
    }
  }

  async evaluateRepeatStatement(node) {
    do {
      await this.evaluateNode(node.body);
    } while (!(await this.evaluateNode(node.condition)));
  }

  async evaluateWriteStatement(node) {
    const values = [];
    
    for (const expr of node.expressions) {
      const value = await this.evaluateNode(expr);
      values.push(String(value));
    }
    
    const output = values.join(' ');
    this.onWrite(output, node.newLine);
  }

  async evaluateReadStatement(node) {
    for (const target of node.targets) {
      const { identifier, index } = target;
      
      if (!this.variables.has(identifier)) {
        throw new Error(`Variável '${identifier}' não declarada`);
      }
      
      const actualIndex = index !== null ? await this.evaluateNode(index) : null;
      const prompt = index !== null 
        ? `Digite o valor para ${identifier}[${actualIndex}]: `
        : `Digite o valor para ${identifier}: `;
        
      let input = await this.onRead(prompt);
      const varData = this.variables.get(identifier);

      // Auto-preenchimento se o input estiver vazio
      if (input === null || input === undefined || input.trim() === '') {
        switch (varData.type) {
          case TokenType.INTEIRO:
            input = Math.floor(Math.random() * 10) + 1; // 1-10
            break;
          case TokenType.REAL:
            input = (Math.random() * 10).toFixed(2);
            break;
          case TokenType.CARACTERE:
            input = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
            break;
          case TokenType.LOGICO:
            input = Math.random() > 0.5 ? 'verdadeiro' : 'falso';
            break;
          default:
            input = '0';
        }
        this.onWrite(`[Sistema preencheu ${identifier}${index !== null ? `[${actualIndex}]` : ''} com: ${input}]`, true);
      }
      
      // Tentar converter para número se possível
      const numValue = Number(input);
      const value = (isNaN(numValue) || input === '' || typeof input !== 'string') ? input : numValue;

      if (index !== null) {
        // Atribuição a array
        if (!varData.isArray) {
          throw new Error(`'${identifier}' não é um vetor`);
        }
        
        const arrayIndex = actualIndex - varData.start;
        if (arrayIndex < 0 || arrayIndex >= varData.value.length) {
          throw new Error(`Índice ${actualIndex} fora dos limites do vetor '${identifier}'`);
        }
        
        varData.value[arrayIndex] = value;
      } else {
        // Atribuição simples
        varData.value = value;
      }
    }
  }

  async evaluateBinaryOp(node) {
    const left = await this.evaluateNode(node.left);
    const right = await this.evaluateNode(node.right);
    
    switch (node.operator) {
      case TokenType.MAIS:
        return left + right;
      case TokenType.MENOS:
        return left - right;
      case TokenType.MULTIPLICACAO:
        return left * right;
      case TokenType.DIVISAO:
        if (right === 0) throw new Error('Divisão por zero');
        return left / right;
      case TokenType.POTENCIA:
        return Math.pow(left, right);
      case TokenType.MOD:
        return left % right;
      case TokenType.IGUAL:
        return left === right;
      case TokenType.DIFERENTE:
        return left !== right;
      case TokenType.MAIOR:
        return left > right;
      case TokenType.MENOR:
        return left < right;
      case TokenType.MAIOR_IGUAL:
        return left >= right;
      case TokenType.MENOR_IGUAL:
        return left <= right;
      case TokenType.E:
        return left && right;
      case TokenType.OU:
        return left || right;
      default:
        throw new Error(`Operador binário desconhecido: ${node.operator}`);
    }
  }

  async evaluateUnaryOp(node) {
    const operand = await this.evaluateNode(node.operand);
    
    switch (node.operator) {
      case TokenType.MENOS:
        return -operand;
      case TokenType.NAO:
        return !operand;
      default:
        throw new Error(`Operador unário desconhecido: ${node.operator}`);
    }
  }

  async evaluateArrayAccess(node) {
    const varData = this.variables.get(node.name);
    
    if (!varData) {
      throw new Error(`Variável '${node.name}' não declarada`);
    }
    
    if (!varData.isArray) {
      throw new Error(`'${node.name}' não é um vetor`);
    }
    
    const index = await this.evaluateNode(node.index);
    const arrayIndex = index - varData.start;
    
    if (arrayIndex < 0 || arrayIndex >= varData.value.length) {
      throw new Error(`Índice ${index} fora dos limites do vetor '${node.name}'`);
    }
    
    return varData.value[arrayIndex];
  }

  getVariable(name) {
    const varData = this.variables.get(name);
    
    if (!varData) {
      throw new Error(`Variável '${name}' não declarada`);
    }
    
    return varData.value;
  }

  stop() {
    this.isRunning = false;
  }
}
