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
    try {
      const saved = localStorage.getItem('portugol-code');
      return saved || DEFAULT_CODE;
    } catch (e) {
      return DEFAULT_CODE;
    }
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('portugol-code', code);
      } catch (e) {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [code]);

  useEffect(() => {
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setAppHeight);
    setAppHeight();
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch('https://api.counterapi.dev/v1/zoldyck-editor-daniel-v3/visits/increment');
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        try {
          const localCount = parseInt(localStorage.getItem('visitor-count-v3') || '0');
          setVisitorCount(localCount + 1);
        } catch (e) {}
      }
    };
    fetchVisits();
  }, []);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    consoleRef.current?.clear();
    const result = await runPortugol(code, (t, n) => consoleRef.current?.write(t, n), (p) => consoleRef.current?.read(p));
    if (!result.success) consoleRef.current?.writeError('Erro: ' + result.error);
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

  const handleExport = async (format) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const match = code.match(/algoritmo\s+["'](.+?)["']/i);
    const algorithmName = match ? match[1] : 'codigo';

    // Se for mobile e o formato for PNG, tentar usar o Share API
    if (isMobile && format === 'png' && navigator.share) {
      try {
        const result = await exportToImage(code, algorithmName);
        if (result.success) {
          // No mobile, a exportação gera o download, mas poderíamos tentar compartilhar o texto se preferir
          await navigator.share({
            title: 'Código Portugol - ' + algorithmName,
            text: code,
          });
          return;
        }
      } catch (e) {}
    }

    try {
      let result;
      switch (format) {
        case 'png': result = await exportToImage(code, algorithmName); break;
        case 'pdf': result = await exportToPDF(code, algorithmName); break;
        case 'docx': result = await exportToWord(code, algorithmName); break;
        default: return;
      }
      if (result.success) consoleRef.current?.write('Exportado com sucesso!');
      else consoleRef.current?.writeError('Erro: ' + result.error);
    } catch (error) {
      consoleRef.current?.writeError('Erro: ' + error.message);
    }
  };

  const handleSelectExample = (id, name) => {
    setCode(getExample(id));
    consoleRef.current?.write('Exemplo "' + name + '" carregado!');
  };

  return (
    <div className="flex flex-col bg-background w-full overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 md:px-6 py-1.5 md:py-3 shadow-lg flex flex-row justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 md:w-8 md:h-8" />
          <div>
            <h1 className="text-sm md:text-2xl font-bold leading-tight">Editor Zoldyck</h1>
            <p className="hidden md:block text-sm opacity-90 leading-tight">Interpretador Portugol</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[8px] md:text-xs opacity-75 hidden sm:block">Daniel Souza - SI FeMASS 2026.1</p>
          {visitorCount !== null && (
            <div className="inline-flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-mono border border-white/10 shadow-inner">
              <span className="w-1 h-1 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              {visitorCount.toLocaleString()}
            </div>
          )}
        </div>
      </header>

      <Toolbar onRun={handleRun} onClear={() => consoleRef.current?.clear()} onExport={() => setShowExportMenu(true)} onLoadExample={() => setShowExamplesModal(true)} isRunning={isRunning} />

      <main className="flex-1 flex flex-col md:grid md:grid-cols-2 overflow-hidden min-h-0 relative">
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-border h-1/2 md:h-full overflow-hidden">
          <div className="bg-muted px-4 py-0.5 text-[9px] md:text-sm font-medium border-b border-border flex justify-between items-center shrink-0">
            <span>Editor</span>
            <span className="hidden md:inline opacity-50 font-normal">Ctrl+Enter para rodar</span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <Editor code={code} onChange={setCode} />
          </div>
        </div>

        <div className="flex flex-col h-1/2 md:h-full overflow-hidden">
          <div className="bg-muted px-4 py-0.5 text-[9px] md:text-sm font-medium border-b border-border shrink-0">
            Console
          </div>
          <div className="flex-1 relative overflow-hidden">
            <Console ref={consoleRef} />
          </div>
        </div>
      </main>

      {showExportMenu && <ExportMenu onExport={handleExport} onClose={() => setShowExportMenu(false)} />}
      {showExamplesModal && <ExamplesModal onSelect={handleSelectExample} onClose={() => setShowExamplesModal(false)} />}

      <footer className="bg-muted/50 border-t border-border py-1 px-4 flex justify-center items-center shrink-0">
        <button onClick={() => window.open('https://papertoilet.com/', '_blank')} className="text-[8px] text-muted-foreground hover:text-primary transition-colors cursor-pointer">
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
