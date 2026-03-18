// Módulo principal do interpretador Portugol
// Combina Lexer, Parser e Evaluator

import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Evaluator } from './evaluator.js';
export { runVisualG } from './visualg/index.js';

export async function runPortugol(code, onWrite, onRead) {
  try {
    // Análise léxica
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    
    // Análise sintática
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    // Execução
    const evaluator = new Evaluator(onWrite, onRead);
    const result = await evaluator.evaluate(ast);
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export { Lexer } from './lexer.js';
export { Parser } from './parser.js';
export { Evaluator } from './evaluator.js';
