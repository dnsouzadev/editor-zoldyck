import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeProvider';

export default function Editor({ code, onChange }) {
  const editorRef = useRef(null);
  const { theme } = useTheme();

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    monaco.languages.register({ id: 'portugol' });

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
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        theme: theme === 'dark' ? 'portugol-dark' : 'portugol-light'
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
