import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

export default function Editor({ code, onChange, theme = 'vs-dark' }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Definir linguagem customizada para Portugol
    monaco.languages.register({ id: 'portugol' });

    // Definir syntax highlighting
    monaco.languages.setMonarchTokensProvider('portugol', {
      keywords: [
        'algoritmo', 'var', 'inicio', 'fim', 'fimalgoritmo',
        'se', 'entao', 'então', 'senao', 'senão', 'fimse',
        'enquanto', 'faca', 'faça', 'fimenquanto',
        'para', 'de', 'ate', 'até', 'passo', 'fimpara',
        'repita', 'fimrepita',
        'inteiro', 'real', 'caractere', 'logico', 'lógico', 'vetor',
        'verdadeiro', 'falso',
        'e', 'ou', 'nao', 'não', 'mod'
      ],
      
      builtins: [
        'escreva', 'escreval', 'leia'
      ],

      operators: [
        '<-', '=', '<>', '>', '<', '>=', '<=',
        '+', '-', '*', '/', '^', '%'
      ],

      tokenizer: {
        root: [
          // Comentários
          [/\/\/.*$/, 'comment'],
          
          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string_double'],
          [/'/, 'string', '@string_single'],
          
          // Números
          [/\d+\.\d+/, 'number.float'],
          [/\d+/, 'number'],
          
          // Identificadores e palavras-chave
          [/[a-záàâãéêíóôõúüçA-ZÁÀÂÃÉÊÍÓÔÕÚÜÇ_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@builtins': 'keyword.builtin',
              '@default': 'identifier'
            }
          }],
          
          // Operadores
          [/<-|<>|>=|<=|\.\./, 'operator'],
          [/[+\-*\/^%=<>]/, 'operator'],
          
          // Delimitadores
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

    // Definir tema customizado
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

    monaco.editor.setTheme('portugol-dark');
  }

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="portugol"
      value={code}
      onChange={onChange}
      theme={theme === 'dark' ? 'portugol-dark' : 'vs'}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
      }}
    />
  );
}
