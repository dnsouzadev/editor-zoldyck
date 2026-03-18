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

const MOBILE_QUERY = '(max-width: 767px)';

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

  const getIsMobile = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;

  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [showConsolePanel, setShowConsolePanel] = useState(() => !getIsMobile());
  const [hasExecutedOnMobile, setHasExecutedOnMobile] = useState(false);

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
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event) => setIsMobile(event.matches);
    handleChange(mediaQuery);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setShowConsolePanel(true);
      return;
    }
    if (!hasExecutedOnMobile) {
      setShowConsolePanel(false);
    }
  }, [isMobile, hasExecutedOnMobile]);

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
    if (isMobile) {
      setHasExecutedOnMobile(true);
      setShowConsolePanel(true);
    }
    consoleRef.current?.clear();
    const result = await runPortugol(
      code,
      (t, n) => consoleRef.current?.write(t, n),
      (p) => consoleRef.current?.read(p)
    );
    if (!result.success) consoleRef.current?.writeError('Erro: ' + result.error);
    setIsRunning(false);
  }, [code, isRunning, isMobile]);

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
    const hasNavigator = typeof navigator !== 'undefined';
    const isMobileDevice = hasNavigator && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const match = code.match(/algoritmo\s+["'](.+?)["']/i);
    const algorithmName = match ? match[1] : 'codigo';

    const shareCodeAsText = async () => {
      if (!hasNavigator) return false;
      if (navigator.share) {
        await navigator.share({
          title: 'Código Portugol - ' + algorithmName,
          text: code,
        });
        return true;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        return true;
      }
      return false;
    };

    if (format === 'text') {
      try {
        const shared = await shareCodeAsText();
        if (shared) {
          consoleRef.current?.write('Código compartilhado com sucesso!');
        } else {
          consoleRef.current?.writeError('Não foi possível compartilhar automaticamente este código.');
        }
      } catch (error) {
        consoleRef.current?.writeError('Erro: ' + error.message);
      }
      return;
    }

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
        consoleRef.current?.write(
          format === 'png' && isMobileDevice
            ? 'Imagem exportada separadamente (sem texto).'
            : 'Exportado com sucesso!'
        );
      } else {
        consoleRef.current?.writeError('Erro: ' + result.error);
      }
    } catch (error) {
      consoleRef.current?.writeError('Erro: ' + error.message);
    }
  };

  const handleSelectExample = (id, name) => {
    setCode(getExample(id));
    consoleRef.current?.write('Exemplo "' + name + '" carregado!');
  };

  const mobileConsoleRevealHint = isMobile && hasExecutedOnMobile && !showConsolePanel;

  const containerHeightStyle = isMobile
    ? { minHeight: 'calc(var(--vh, 1vh) * 100)' }
    : { height: 'calc(var(--vh, 1vh) * 100)' };

  return (
    <div
      className={`flex flex-col bg-background text-foreground w-full font-mono ${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}
      style={containerHeightStyle}
    >
      <header className="border-b-2 border-border px-4 md:px-8 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-foreground flex items-center justify-center rounded-sm bg-card">
                <Code2 className="w-6 h-6" />
              </div>
              <img
                src="/capivara.png"
                alt="Mascote Capivara"
                className="w-12 h-12 object-contain border-2 border-foreground rounded-sm bg-card"
                loading="lazy"
              />
            </div>
            <div className="space-y-1">
              <p className="uppercase text-[10px] tracking-[0.35em] text-muted-foreground">Portugol</p>
              <h1 className="text-2xl md:text-4xl font-black leading-tight">Editor Zoldyck</h1>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Interpretador</p>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 text-[11px] uppercase tracking-[0.2em]">
            <p className="text-muted-foreground">Daniel Souza • SI FeMASS 2026.1</p>
            {visitorCount !== null && (
              <div className="flex items-center gap-2 border-2 border-foreground px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Acessos: {visitorCount.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </header>

      <Toolbar
        onRun={handleRun}
        onClear={() => consoleRef.current?.clear()}
        onExport={() => setShowExportMenu(true)}
        onLoadExample={() => setShowExamplesModal(true)}
        isRunning={isRunning}
      />

      {mobileConsoleRevealHint && (
        <div className="px-4 md:px-8 py-2 border-b border-dashed border-border flex justify-end">
          <button
            onClick={() => setShowConsolePanel(true)}
            className="text-[11px] uppercase tracking-[0.3em] border-2 border-foreground px-3 py-1 hover:bg-foreground hover:text-background transition-colors"
          >
            Mostrar console
          </button>
        </div>
      )}

      <main className="flex-1 px-4 md:px-8 py-4 bg-background overflow-hidden">
        <div className={`${isMobile ? 'flex flex-col gap-4 h-full' : 'grid grid-cols-2 gap-4 h-full'}`}>
          <section className="flex flex-col border-2 border-foreground rounded-sm bg-card h-full shadow-[6px_6px_0_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2 text-[11px] uppercase tracking-[0.3em]">
              <span>Editor</span>
              <span className="hidden md:inline text-muted-foreground">Ctrl + Enter</span>
            </div>
            <div className="flex-1 min-h-0">
              <Editor code={code} onChange={setCode} />
            </div>
          </section>

          {(!isMobile || showConsolePanel) && (
            <section className="flex flex-col border-2 border-foreground rounded-sm bg-card h-full shadow-[6px_6px_0_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2 text-[11px] uppercase tracking-[0.3em]">
                <span>Console</span>
                {isMobile && (
                  <button
                    onClick={() => setShowConsolePanel(false)}
                    className="text-[10px] uppercase tracking-[0.2em] border border-foreground px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors"
                  >
                    Ocultar
                  </button>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <Console ref={consoleRef} />
              </div>
            </section>
          )}
        </div>
      </main>

      {showExportMenu && (
        <ExportMenu onExport={handleExport} onClose={() => setShowExportMenu(false)} />
      )}
      {showExamplesModal && (
        <ExamplesModal onSelect={handleSelectExample} onClose={() => setShowExamplesModal(false)} />
      )}

      <footer className="border-t-2 border-border px-4 md:px-8 py-3 text-[10px] uppercase tracking-[0.3em] flex justify-between flex-wrap gap-2">
        <button
          onClick={() => window.open('https://papertoilet.com/', '_blank')}
          className="underline-offset-4 hover:underline text-foreground"
        >
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
