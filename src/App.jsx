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

    if (isMobile && format === 'png' && navigator.share) {
      try {
        await navigator.share({
          title: 'Código Portugol - ' + algorithmName,
          text: code,
        });
        return;
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
    <div className="flex flex-col bg-background w-full overflow-hidden font-mono" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <header className="bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground px-4 md:px-6 py-3 md:py-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-2 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTAgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMTggMzZjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="flex items-center gap-3 z-10">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
            <Code2 className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold leading-tight tracking-tight drop-shadow-md">Editor Zoldyck</h1>
            <p className="text-xs md:text-sm opacity-95 leading-tight font-medium">Interpretador Portugol</p>
          </div>
        </div>
        <div className="text-center md:text-right z-10">
          <p className="text-[10px] md:text-xs opacity-90 hidden md:block font-medium mb-1">
            Daniel Souza • SI FeMASS 2026.1
          </p>
          {visitorCount !== null && (
            <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] md:text-xs font-mono border border-white/20 shadow-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              <span className="font-semibold">Acessos:</span> {visitorCount.toLocaleString()}
            </div>
          )}
        </div>
      </header>

      <Toolbar onRun={handleRun} onClear={() => consoleRef.current?.clear()} onExport={() => setShowExportMenu(true)} onLoadExample={() => setShowExamplesModal(true)} isRunning={isRunning} />

      <main className="flex-1 flex flex-col md:grid md:grid-cols-2 overflow-hidden min-h-0 relative bg-muted/20">
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-border/50 h-1/2 md:h-full overflow-hidden bg-background/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-muted/80 to-muted/60 px-4 py-2 text-xs md:text-sm font-semibold border-b border-border/50 flex justify-between items-center shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
              <span className="text-foreground/90">Editor</span>
            </div>
            <span className="hidden md:inline opacity-60 font-normal text-xs">Ctrl+Enter para rodar</span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <Editor code={code} onChange={setCode} />
          </div>
        </div>

        <div className="flex flex-col h-1/2 md:h-full overflow-hidden bg-background/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-muted/60 to-muted/80 px-4 py-2 text-xs md:text-sm font-semibold border-b border-border/50 shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]"></div>
              <span className="text-foreground/90">Console</span>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <Console ref={consoleRef} />
          </div>
        </div>
      </main>

      {showExportMenu && <ExportMenu onExport={handleExport} onClose={() => setShowExportMenu(false)} />}
      {showExamplesModal && <ExamplesModal onSelect={handleSelectExample} onClose={() => setShowExamplesModal(false)} />}

      <footer className="bg-gradient-to-r from-muted/70 to-muted/50 border-t border-border/50 py-2 px-4 flex justify-center items-center shrink-0 backdrop-blur-sm">
        <button onClick={() => window.open('https://papertoilet.com/', '_blank')} className="text-[9px] md:text-[10px] text-muted-foreground hover:text-primary transition-all hover:scale-105 cursor-pointer font-medium">
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
