import { useState, useRef, useEffect } from 'react';
import Editor from './components/Editor/Editor';
import Console from './components/Console/Console';
import Toolbar from './components/Toolbar/Toolbar';
import ExportMenu from './components/ExportMenu/ExportMenu';
import { runPortugol } from './interpreter';
import { exportToImage } from './export/toImage';
import { exportToPDF } from './export/toPDF';
import { exportToWord } from './export/toWord';
import { getExample, getExamplesList } from './examples/examples';
import './App.css';

const DEFAULT_CODE = `algoritmo "Meu Primeiro Programa"
var
   nome: caractere
inicio
   escreva("Digite seu nome: ")
   leia(nome)
   escreval("Olá, ", nome, "!")
   escreval("Bem-vindo ao Editor Portugol Web!")
fimalgoritmo`;

function App() {
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem('portugol-code');
    return saved || DEFAULT_CODE;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const consoleRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('portugol-code', code);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleRun = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    consoleRef.current?.clear();

    const onWrite = (text, newLine) => {
      consoleRef.current?.write(text, newLine);
    };

    const onRead = async (prompt) => {
      return await consoleRef.current?.read(prompt);
    };

    const result = await runPortugol(code, onWrite, onRead);

    if (!result.success) {
      consoleRef.current?.writeError(\`❌ Erro: \${result.error}\`);
    }

    setIsRunning(false);
  };

  const handleClear = () => {
    consoleRef.current?.clear();
  };

  const handleExport = async (format) => {
    const match = code.match(/algoritmo\s+["'](.+?)["']/i);
    const algorithmName = match ? match[1] : 'codigo';

    try {
      let result;
      switch (format) {
        case 'png':
          result = await exportToImage(code, algorithmName);
          break;
        case 'pdf':
          result = await exportToPDF(code, algorithmName);
          break;
        case 'docx':
          result = await exportToWord(code, algorithmName);
          break;
        default:
          return;
      }

      if (result.success) {
        consoleRef.current?.write(\`✅ Exportado com sucesso como \${format.toUpperCase()}!\`);
      } else {
        consoleRef.current?.writeError(\`❌ Erro ao exportar: \${result.error}\`);
      }
    } catch (error) {
      consoleRef.current?.writeError(\`❌ Erro ao exportar: \${error.message}\`);
    }
  };

  const handleLoadExample = () => {
    const examples = getExamplesList();
    const examplesText = examples.map((ex, i) => \`\${i + 1}. \${ex.name}\`).join('\n');
    
    const choice = prompt(
      \`Escolha um exemplo:\n\n\${examplesText}\n\nDigite o número:\`
    );
    
    if (choice) {
      const index = parseInt(choice) - 1;
      if (index >= 0 && index < examples.length) {
        const exampleCode = getExample(examples[index].id);
        setCode(exampleCode);
        consoleRef.current?.write(\`📄 Exemplo "\${examples[index].name}" carregado!\`);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Editor Portugol Web</h1>
        <p>Editor e interpretador online de Portugol com exportação</p>
      </header>

      <Toolbar
        onRun={handleRun}
        onClear={handleClear}
        onExport={() => setShowExportMenu(true)}
        onLoadExample={handleLoadExample}
        isRunning={isRunning}
      />

      <div className="app-content">
        <div className="editor-panel">
          <div className="panel-header">Editor de Código</div>
          <div className="panel-body">
            <Editor code={code} onChange={setCode} theme="dark" />
          </div>
        </div>

        <div className="console-panel">
          <div className="panel-header">Console de Saída</div>
          <div className="panel-body">
            <Console ref={consoleRef} />
          </div>
        </div>
      </div>

      {showExportMenu && (
        <ExportMenu
          onExport={handleExport}
          onClose={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
}

export default App;
