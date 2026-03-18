import { Editor as MonacoEditor, loader } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeProvider';

export default function Editor({ code, onChange, onRunShortcut }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const runShortcutRef = useRef(onRunShortcut);
  const { theme } = useTheme();

  useEffect(() => {
    runShortcutRef.current = onRunShortcut;
  }, [onRunShortcut]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.register({ id: 'portugol' });

    monaco.languages.setMonarchTokensProvider('portugol', {
      keywords: [
        'algoritmo', 'programa', 'var', 'inicio', 'fim', 'fimalgoritmo',
        'funcao', 'função', 'fimfuncao', 'fimfunção', 'procedimento', 'fimprocedimento',
        'se', 'entao', 'então', 'senao', 'senão', 'fimse',
        'enquanto', 'faca', 'faça', 'fimenquanto',
        'para', 'de', 'ate', 'até', 'passo', 'fimpara',
        'repita', 'fimrepita',
        'inteiro', 'real', 'caractere', 'cadeia', 'logico', 'lógico', 'vetor',
        'verdadeiro', 'falso',
        'retorne', 'retorna',
        'e', 'ou', 'nao', 'não', 'mod'
      ],
      
      builtins: [
        'escreva', 'escreval', 'leia', 'limpa'
      ],

      operators: [
        '<-', '=', '<>', '>', '<', '>=', '<=',
        '+', '-', '*', '/', '^', '%'
      ],

      tokenizer: {
        root: [
          [/\/\/.*$/, 'comment'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string_double'],
          [/'/, 'string', '@string_single'],
          [/\d+\.\d+/, 'number.float'],
          [/\d+/, 'number'],
          [/[a-záàâãéêíóôõúüçA-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@builtins': 'keyword.builtin',
              '@default': 'identifier'
            }
          }],
          [/<-|<>|>=|<=|\.\./, 'operator'],
          [/[+\-*\/^%=<>]/, 'operator'],
          [/[()[\],;:]/, 'delimiter'],
        ],
        string_double: [
          [/[^\\"]+/, 'string'],
          [/"/, 'string', '@pop']
        ],
        string_single: [
          [/[^\\']+/, 'string'],
          [/'/, 'string', '@pop']
        ],
      },
    });

    monaco.editor.defineTheme('portugol-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'keyword.builtin', foreground: 'DCDCAA' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'operator', foreground: 'D4D4D4' },
      ],
      colors: {}
    });

    monaco.editor.defineTheme('portugol-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'keyword.builtin', foreground: '795E26' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'operator', foreground: '000000' },
      ],
      colors: {}
    });

    // Hover Provider
    monaco.languages.registerHoverProvider('portugol', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const descriptions = {
          'algoritmo': '**algoritmo**: Inicia a definição do programa e seu nome.',
          'var': '**var**: Inicia a seção de declaração de variáveis.',
          'inicio': '**inicio**: Marca o começo do bloco de comandos do programa.',
          'fim': '**fim**: Finaliza um bloco de comandos.',
          'fimalgoritmo': '**fimalgoritmo**: Finaliza a execução do programa.',
          'se': '**se**: Estrutura condicional que executa um bloco se a condição for verdadeira.',
          'entao': '**entao**: Parte da estrutura SE, precede o bloco de comandos.',
          'então': '**então**: Parte da estrutura SE, precede o bloco de comandos.',
          'senao': '**senao**: Parte da estrutura SE, executa se a condição for falsa.',
          'senão': '**senão**: Parte da estrutura SE, executa se a condição for falsa.',
          'fimse': '**fimse**: Finaliza a estrutura condicional SE.',
          'enquanto': '**enquanto**: Estrutura de repetição que executa enquanto a condição for verdadeira.',
          'faca': '**faca**: Precede o bloco de comandos de uma estrutura de repetição.',
          'faça': '**faça**: Precede o bloco de comandos de uma estrutura de repetição.',
          'fimenquanto': '**fimenquanto**: Finaliza a estrutura ENQUANTO.',
          'para': '**para**: Estrutura de repetição com contador definido.',
          'de': '**de**: Parte da estrutura PARA, define o valor inicial.',
          'ate': '**ate**: Parte da estrutura PARA, define o valor final.',
          'até': '**até**: Parte da estrutura PARA, define o valor final.',
          'passo': '**passo**: Define o incremento/decremento da estrutura PARA.',
          'fimpara': '**fimpara**: Finaliza a estrutura PARA.',
          'repita': '**repita**: Estrutura de repetição que executa pelo menos uma vez até que a condição seja verdadeira.',
          'fimrepita': '**fimrepita**: Finaliza a estrutura REPITA.',
          'inteiro': '**inteiro**: Tipo de dado para números inteiros (ex: 1, 10, -5).',
          'real': '**real**: Tipo de dado para números decimais (ex: 3.14, 2.5).',
          'caractere': '**caractere**: Tipo de dado para texto e strings.',
          'logico': '**logico**: Tipo de dado booleano (verdadeiro ou falso).',
          'lógico': '**lógico**: Tipo de dado booleano (verdadeiro ou falso).',
          'vetor': '**vetor**: Define uma estrutura de dados de array (vetor).',
          'escreva': '**escreva**: Exibe informações no console sem pular linha.',
          'escreval': '**escreval**: Exibe informações no console e pula para a próxima linha.',
          'leia': '**leia**: Lê um valor digitado pelo usuário e armazena em uma variável.',
          'verdadeiro': '**verdadeiro**: Valor lógico positivo.',
          'falso': '**falso**: Valor lógico negativo.',
          'mod': '**mod**: Operador que retorna o resto da divisão entre dois números.'
        };

        const lowerWord = word.word.toLowerCase();
        if (descriptions[lowerWord]) {
          return {
            contents: [{ value: descriptions[lowerWord] }]
          };
        }

        const codeText = model.getValue();
        const varRegex = new RegExp(`(\\w+)\\s*(?:,\\s*\\w+)*\\s*:\\s*(\\w+)|(\\w+)\\s+(\\w+)(?:\\s*,\\s*\\w+)*`, 'g');
        let match;
        while ((match = varRegex.exec(codeText)) !== null) {
          if (match[1] === word.word || match[3] === word.word || match[4] === word.word) {
            const type = match[2] || match[3];
            return {
              contents: [{ value: `**Variável \`${word.word}\`**: Declarada como tipo \`${type}\`.` }]
            };
          }
        }

        return null;
      }
    });

    // Atalho Ctrl/Cmd + Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runShortcutRef.current?.();
    });

    // Forçar tema no mount
    const monacoTheme = theme === 'dark' ? 'portugol-dark' : 'portugol-light';
    monaco.editor.setTheme(monacoTheme);
  }

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const monacoTheme = theme === 'dark' ? 'portugol-dark' : 'portugol-light';
      monacoRef.current.editor.setTheme(monacoTheme);
      editorRef.current.updateOptions({
        theme: monacoTheme
      });
    }
  }, [theme]);

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="portugol"
      value={code}
      onChange={onChange}
      theme={theme === 'dark' ? 'portugol-dark' : 'portugol-light'}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
        fontLigatures: true,
        lineNumbers: 'on',
        lineNumbersMinChars: 2,
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 12, bottom: 12 },
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
      }}
    />
  );
}
