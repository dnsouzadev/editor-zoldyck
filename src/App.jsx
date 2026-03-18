import { useState, useRef, useEffect, useCallback } from 'react';
import { Code2 } from 'lucide-react';
import Editor from './components/Editor/Editor';
import Console from './components/Console/Console';
import Toolbar from './components/Toolbar/Toolbar';
import ExportMenu from './components/ExportMenu/ExportMenu';
import ExamplesModal from './components/ExamplesModal/ExamplesModal';
import { ThemeProvider } from './components/ThemeProvider';
import { runPortugol } from './interpreter';
import { exportToImage } from './export/toImage';
import { exportToPDF } from './export/toPDF';
import { exportToWord } from './export/toWord';
import { getExample } from './examples/examples';

const DEFAULT_CODE = `algoritmo "Meu Primeiro Programa"
var
   nome: caractere
inicio
   escreva("Digite seu nome: ")
   leia(nome)
   escreval("Olá, ", nome, "!")
   escreval("Bem-vindo ao Editor Zoldyck!")
fimalgoritmo`;

function AppContent() {
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem('portugol-code');
    return saved || DEFAULT_CODE;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('portugol-code', code);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code]);

  // Contador de visitas global
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/zoldyck-editor-daniel-v3/visits/increment')
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
      .catch(() => {
        const localCount = parseInt(localStorage.getItem('visitor-count-v3') || '0');
        const newCount = localCount + 1;
        localStorage.setItem('visitor-count-v3', newCount.toString());
        setVisitorCount(newCount);
      });
  }, []);

  const handleRun = useCallback(async () => {
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
      consoleRef.current?.writeError('Erro: ' + result.error);
    }

    setIsRunning(false);
  }, [code, isRunning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun]);

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
        consoleRef.current?.write('Exportado com sucesso como ' + format.toUpperCase() + '!');
      } else {
        consoleRef.current?.writeError('Erro ao exportar: ' + result.error);
      }
    } catch (error) {
      consoleRef.current?.writeError('Erro ao exportar: ' + error.message);
    }
  };

  const handleSelectExample = (id, name) => {
    const exampleCode = getExample(id);
    setCode(exampleCode);
    consoleRef.current?.write('Exemplo "' + name + '" carregado!');
  };

  const handleRandomRedirect = () => {
    const sites = [
      'https://papertoilet.com/',
      'https://cat-bounce.com/',
      'https://pointerpointer.com/',
      'http://www.staggeringbeauty.com/'
    ];
    const randomSite = sites[Math.floor(Math.random() * sites.length)];
    window.open(randomSite, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 md:px-6 py-2 md:py-4 shadow-lg flex flex-col md:flex-row justify-between items-center gap-1 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Code2 className="w-6 h-6 md:w-8 md:h-8 shrink-0" />
          <div>
            <h1 className="text-lg md:text-2xl font-bold leading-tight">Editor Zoldyck</h1>
            <p className="text-[10px] md:text-sm opacity-90 leading-tight">Interpretador Portugol Online</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[9px] md:text-xs opacity-75 hidden sm:block md:block">
            Desenvolvido por Daniel Souza - Aluno do curso de Sistemas de Informação FeMASS/2026.1
          </p>
          {visitorCount !== null && (
            <div className="md:mt-1 inline-flex items-center gap-2 bg-black/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-mono border border-white/10 shadow-inner">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              Acessos: {visitorCount.toLocaleString()}
            </div>
          )}
        </div>
      </header>

      <Toolbar
        onRun={handleRun}
        onClear={handleClear}
        onExport={() => setShowExportMenu(true)}
        onLoadExample={() => setShowExamplesModal(true)}
        isRunning={isRunning}
      />

      <div className="flex-1 flex flex-col md:grid md:grid-cols-2 overflow-hidden">
        <div className="flex flex-col border-r border-border h-[50vh] md:h-full">
          <div className="bg-muted px-4 py-2 text-sm font-medium border-b border-border flex justify-between items-center shrink-0">
            <span>Editor de Código</span>
            <span className="hidden md:inline text-[10px] opacity-50 font-normal">Pressione Ctrl+Enter para rodar</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor code={code} onChange={setCode} />
          </div>
        </div>

        <div className="flex flex-col h-[40vh] md:h-full">
          <div className="bg-muted px-4 py-2 text-sm font-medium border-b border-border shrink-0">
            Console de Saída
          </div>
          <div className="flex-1 overflow-hidden">
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

      {showExamplesModal && (
        <ExamplesModal
          onSelect={handleSelectExample}
          onClose={() => setShowExamplesModal(false)}
        />
      )}

      <footer className="bg-muted border-t border-border py-1.5 px-6 flex justify-center items-center shrink-0 mt-auto">
        <button 
          onClick={handleRandomRedirect}
          className="text-[10px] text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
        >
          <span className="w-1 h-1 bg-primary/40 rounded-full group-hover:scale-125 transition-transform"></span>
          Professor Afonso pediu para você clicar aqui
        </button>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
