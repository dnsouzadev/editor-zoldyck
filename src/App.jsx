import { useState, useRef, useEffect, useCallback } from 'react';
import { Code2 } from 'lucide-react';
import Editor from './components/Editor/Editor';
import Console from './components/Console/Console';
import Toolbar from './components/Toolbar/Toolbar';
import ExportMenu from './components/ExportMenu/ExportMenu';
import ExamplesModal from './components/ExamplesModal/ExamplesModal';
import DocsModal from './components/DocsModal/DocsModal';
import { ThemeProvider } from './components/ThemeProvider';
import { runPortugol, runVisualG } from './interpreter';
import { exportToImage } from './export/toImage';
import { exportToPDF, exportAlgorithmsToPDF } from './export/toPDF';
import { exportToWord, exportAlgorithmsToWord } from './export/toWord';
import { getExample } from './examples/examples';

const MOBILE_QUERY = '(max-width: 767px)';
const LANGUAGE_STORAGE_KEY = 'portugol-language';
const ALGORITHMS_STORAGE_KEY = 'portugol-algorithm-list';
const DEFAULT_LANGUAGE = 'pseudocode';

const createConsoleEntry = (entry) => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`,
  ...entry,
});

const DEFAULT_CODE = `algoritmo "Meu Primeiro Programa"
var
   nome: caractere
inicio
   escreva("Digite seu nome: ")
   leia(nome)
   escreval("Olá, ", nome, "!")
   escreval("Bem-vindo ao Editor Zoldyck!")
fimalgoritmo`;

function getStoredLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
  } catch (error) {
    return DEFAULT_LANGUAGE;
  }
}

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
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState([]);
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [consolePrompt, setConsolePrompt] = useState('');
  const consoleInputResolverRef = useRef(null);
  const consolePromptRef = useRef('');
  const mainLayoutRef = useRef(null);
  const [language, setLanguage] = useState(getStoredLanguage);
  const [consoleMode, setConsoleMode] = useState('minimized'); // minimized | overlay | fixed
  const abortControllerRef = useRef({ aborted: false });

  const getIsMobile = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;

  const [isMobile, setIsMobile] = useState(getIsMobile);
  const [showConsolePanel, setShowConsolePanel] = useState(false);
  const [hasExecutedOnMobile, setHasExecutedOnMobile] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.7);
  const [isResizingPanels, setIsResizingPanels] = useState(false);
  const [algorithmList, setAlgorithmList] = useState(() => {
    try {
      const raw = localStorage.getItem(ALGORITHMS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  });

  const appendConsoleEntry = useCallback((entry) => {
    setConsoleEntries((prev) => [...prev, createConsoleEntry(entry)]);
  }, []);

  const writeConsole = useCallback((text, newLine = true) => {
    appendConsoleEntry({ type: 'output', text, newLine });
  }, [appendConsoleEntry]);

  const writeConsoleError = useCallback((text) => {
    appendConsoleEntry({ type: 'error', text });
  }, [appendConsoleEntry]);

  const clearConsole = useCallback(() => {
    setConsoleEntries([]);
    setIsWaitingInput(false);
    setConsolePrompt('');
    consolePromptRef.current = '';
    consoleInputResolverRef.current = null;
  }, []);

  const readConsoleInput = useCallback((prompt = 'Digite: ') => {
    return new Promise((resolve) => {
      setConsolePrompt(prompt);
      consolePromptRef.current = prompt;
      setIsWaitingInput(true);
      consoleInputResolverRef.current = resolve;
    });
  }, []);

  const submitConsoleInput = useCallback((value) => {
    const promptLabel = consolePromptRef.current || '';
    appendConsoleEntry({ type: 'input', text: `${promptLabel}${value}` });
    setIsWaitingInput(false);
    setConsolePrompt('');
    consolePromptRef.current = '';
    if (consoleInputResolverRef.current) {
      const resolver = consoleInputResolverRef.current;
      consoleInputResolverRef.current = null;
      resolver(value);
    }
  }, [appendConsoleEntry]);

  const stopExecution = useCallback((options = {}) => {
    abortControllerRef.current.aborted = true;
    setIsRunning(false);
    setIsWaitingInput(false);
    setConsolePrompt('');
    consolePromptRef.current = '';
    if (consoleInputResolverRef.current) {
      const resolver = consoleInputResolverRef.current;
      consoleInputResolverRef.current = null;
      resolver('');
    }
    if (!isMobile && options.minimize !== false) {
      setConsoleMode('minimized');
    }
  }, [isMobile]);

  const ensureNotAborted = useCallback(() => {
    if (abortControllerRef.current.aborted) {
      throw new Error('Execução interrompida pelo usuário.');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('portugol-code', code);
      } catch (e) {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [code]);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {}
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(ALGORITHMS_STORAGE_KEY, JSON.stringify(algorithmList));
    } catch (error) {}
  }, [algorithmList]);

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
    if (!isMobile) return;
    if (!hasExecutedOnMobile) {
      setShowConsolePanel(false);
    }
  }, [isMobile, hasExecutedOnMobile]);

  useEffect(() => {
    if (!isMobile) {
      setConsoleMode('minimized');
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isResizingPanels || isMobile || consoleMode !== 'fixed') return;

    const handleMouseMove = (event) => {
      if (!mainLayoutRef.current) return;
      const rect = mainLayoutRef.current.getBoundingClientRect();
      if (rect.height <= 0) return;
      let ratio = (event.clientY - rect.top) / rect.height;
      ratio = Math.max(0.3, Math.min(0.9, ratio));
      setSplitRatio(ratio);
    };

    const stopResizing = () => setIsResizingPanels(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResizing);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [consoleMode, isResizingPanels, isMobile]);

  useEffect(() => {
    if (isMobile && isResizingPanels) {
      setIsResizingPanels(false);
    }
  }, [isMobile, isResizingPanels]);

  const executeProgram = useCallback(async () => {
    if (isRunning) return;
    abortControllerRef.current = { aborted: false };
    setIsRunning(true);
    if (isMobile) {
      setHasExecutedOnMobile(true);
      setShowConsolePanel(true);
    } else {
      setConsoleMode((prev) => (prev === 'fixed' ? 'fixed' : 'overlay'));
    }
    clearConsole();

    const wrappedWrite = (text, newLine) => {
      ensureNotAborted();
      writeConsole(text, newLine);
    };

    const wrappedRead = async (prompt) => {
      ensureNotAborted();
      const value = await readConsoleInput(prompt);
      ensureNotAborted();
      return value;
    };

    const wrappedClear = () => {
      ensureNotAborted();
      clearConsole();
    };

    let result;
    try {
      if (language === 'visualg') {
        result = await runVisualG(code, {
          onWrite: wrappedWrite,
          onRead: wrappedRead,
          onClear: wrappedClear,
        });
      } else {
        result = await runPortugol(code, wrappedWrite, wrappedRead);
      }
    } catch (error) {
      result = { success: false, error: error.message };
    }

    if (abortControllerRef.current.aborted) {
      writeConsole('Execução interrompida.');
    } else if (!result?.success) {
      writeConsoleError('Erro: ' + result.error);
    }

    setIsRunning(false);
    abortControllerRef.current.aborted = false;
  }, [
    clearConsole,
    code,
    ensureNotAborted,
    isMobile,
    isRunning,
    language,
    readConsoleInput,
    writeConsole,
    writeConsoleError,
  ]);

  const handleRunToggle = useCallback(() => {
    if (isRunning) {
      stopExecution({ minimize: false });
    } else {
      executeProgram();
    }
  }, [executeProgram, isRunning, stopExecution]);

  const handleCloseConsole = useCallback(() => {
    if (isRunning) {
      stopExecution();
    } else {
      setConsoleMode('minimized');
    }
  }, [isRunning, stopExecution]);

  const handleMobileConsoleClose = useCallback(() => {
    setShowConsolePanel(false);
    if (isRunning) {
      stopExecution();
    }
  }, [isRunning, stopExecution]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        executeProgram();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeProgram]);

  const handleExport = async (format) => {
    const hasNavigator = typeof navigator !== 'undefined';
    const isMobileDevice = hasNavigator && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const match = code.match(/algoritmo\s+["'](.+?)["']/i);
    const algorithmName = match ? match[1] : 'codigo';

    if ((format === 'pdf-list' || format === 'docx-list') && algorithmList.length === 0) {
      writeConsoleError('A lista de algoritmos está vazia.');
      return;
    }

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
          writeConsole('Código compartilhado com sucesso!');
        } else {
          writeConsoleError('Não foi possível compartilhar automaticamente este código.');
        }
      } catch (error) {
        writeConsoleError('Erro: ' + error.message);
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
        case 'pdf-list':
          result = await exportAlgorithmsToPDF(algorithmList, 'lista-algoritmos');
          break;
        case 'docx-list':
          result = await exportAlgorithmsToWord(algorithmList, 'lista-algoritmos');
          break;
        default:
          return;
      }
      if (result.success) {
        writeConsole(
          format === 'png' && isMobileDevice
            ? 'Imagem exportada separadamente (sem texto).'
            : 'Exportado com sucesso!'
        );
      } else {
        writeConsoleError('Erro: ' + result.error);
      }
    } catch (error) {
      writeConsoleError('Erro: ' + error.message);
    }
  };

  const getAlgorithmNameFromCode = useCallback((sourceCode) => {
    const match = sourceCode.match(/algoritmo\s+["'](.+?)["']/i);
    return match ? match[1] : `algoritmo-${algorithmList.length + 1}`;
  }, [algorithmList.length]);

  const handleAddCurrentAlgorithmToList = useCallback(() => {
    const name = getAlgorithmNameFromCode(code);
    const entry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      name,
      code,
      createdAt: new Date().toISOString(),
    };
    setAlgorithmList((prev) => [...prev, entry]);
    writeConsole(`Algoritmo "${name}" adicionado à lista (${algorithmList.length + 1}).`);
  }, [algorithmList.length, code, getAlgorithmNameFromCode, writeConsole]);

  const handleClearAlgorithmList = useCallback(() => {
    setAlgorithmList([]);
    writeConsole('Lista de algoritmos limpa.');
  }, [writeConsole]);

  const handleSelectExample = (id, name) => {
    setCode(getExample(id, language));
    writeConsole('Exemplo "' + name + '" carregado!');
  };

  const mobileConsoleRevealHint = isMobile && hasExecutedOnMobile && !showConsolePanel;
  const showDesktopFixedConsole = !isMobile && consoleMode === 'fixed';
  const showDesktopOverlayConsole = !isMobile && consoleMode === 'overlay';
  const editorPaneStyle = showDesktopFixedConsole
    ? { flexBasis: `${splitRatio * 100}%` }
    : { flex: 1 };
  const consolePaneStyle = showDesktopFixedConsole
    ? { flexBasis: `${(1 - splitRatio) * 100}%` }
    : undefined;

  const containerHeightStyle = isMobile
    ? { minHeight: 'calc(var(--vh, 1vh) * 100)' }
    : { height: 'calc(var(--vh, 1vh) * 100)' };
  const shouldShowMobileConsole = isMobile && showConsolePanel;
  const mainPaddingStyle = showDesktopOverlayConsole ? { paddingBottom: '18rem' } : undefined;

  const startPanelResize = (event) => {
    if (isMobile || consoleMode !== 'fixed') return;
    event.preventDefault();
    setIsResizingPanels(true);
  };

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
        <div className="flex flex-col items-start md:items-end gap-1 text-[11px] uppercase tracking-[0.2em]">
          <p className="text-muted-foreground">Daniel Souza • SI FeMASS 2026.1</p>
        </div>
        </div>
      </header>

      <Toolbar
        onRun={handleRunToggle}
        onClear={clearConsole}
        onExport={() => setShowExportMenu(true)}
        onLoadExample={() => setShowExamplesModal(true)}
        onAddToList={handleAddCurrentAlgorithmToList}
        onClearList={handleClearAlgorithmList}
        algorithmListCount={algorithmList.length}
        isRunning={isRunning}
        language={language}
        onLanguageChange={setLanguage}
        onShowDocs={() => setShowDocsModal(true)}
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

      <main
        className="flex-1 px-4 md:px-8 py-4 bg-background overflow-hidden relative"
        style={mainPaddingStyle}
      >
        <div
          ref={mainLayoutRef}
          className="flex flex-col gap-4 h-full"
        >
          <section
            className="flex flex-col border-2 border-foreground rounded-sm bg-card h-full shadow-[6px_6px_0_rgba(0,0,0,0.08)]"
            style={editorPaneStyle}
          >
            <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2 text-[11px] uppercase tracking-[0.3em]">
              <span>Editor</span>
              <span className="hidden md:inline text-muted-foreground">Ctrl + Enter</span>
            </div>
            <div className="flex-1 min-h-0">
              <Editor code={code} onChange={setCode} onRunShortcut={executeProgram} />
            </div>
          </section>

          {showDesktopFixedConsole && (
            <div
              role="separator"
              aria-orientation="horizontal"
              aria-label="Redimensionar painéis"
              className="hidden md:flex items-center justify-center h-3 cursor-row-resize border-2 border-foreground bg-background relative"
              onMouseDown={startPanelResize}
            >
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-foreground/60 pointer-events-none" />
            </div>
          )}

          {showDesktopFixedConsole && (
            <section
              className="flex flex-col border-2 border-foreground rounded-sm bg-card h-full shadow-[6px_6px_0_rgba(0,0,0,0.08)]"
              style={consolePaneStyle}
            >
              <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2 text-[11px] uppercase tracking-[0.3em]">
                <span>Console</span>
                <button
                  onClick={handleCloseConsole}
                  className="text-[10px] uppercase tracking-[0.2em] border border-foreground px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors"
                >
                  Minimizar
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <Console
                  entries={consoleEntries}
                  isWaitingInput={isWaitingInput}
                  inputPrompt={consolePrompt}
                  onSubmitInput={submitConsoleInput}
                />
              </div>
            </section>
          )}

          {shouldShowMobileConsole && (
            <section className="flex flex-col border-2 border-foreground rounded-sm bg-card h-full shadow-[6px_6px_0_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2 text-[11px] uppercase tracking-[0.3em]">
                <span>Console</span>
                <button
                  onClick={handleMobileConsoleClose}
                  className="text-[10px] uppercase tracking-[0.2em] border border-foreground px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors"
                >
                  Ocultar
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <Console
                  entries={consoleEntries}
                  isWaitingInput={isWaitingInput}
                  inputPrompt={consolePrompt}
                  onSubmitInput={submitConsoleInput}
                />
              </div>
            </section>
          )}
        </div>

        {showDesktopOverlayConsole && (
          <div className="hidden md:block absolute left-0 right-0 bottom-0 px-4 md:px-8 pb-4">
            <div className="border-2 border-foreground bg-card shadow-[10px_10px_0_rgba(0,0,0,0.2)] rounded-sm">
              <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-2 text-[11px] uppercase tracking-[0.3em]">
                <span>Console</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConsoleMode('fixed')}
                    className="text-[10px] uppercase tracking-[0.2em] border border-foreground px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors"
                  >
                    Fixar
                  </button>
                  <button
                    onClick={handleCloseConsole}
                    className="text-[10px] uppercase tracking-[0.2em] border border-foreground px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
              <div className="h-64">
                <Console
                  entries={consoleEntries}
                  isWaitingInput={isWaitingInput}
                  inputPrompt={consolePrompt}
                  onSubmitInput={submitConsoleInput}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {showExportMenu && (
        <ExportMenu
          onExport={handleExport}
          onClose={() => setShowExportMenu(false)}
          algorithmListCount={algorithmList.length}
        />
      )}
      {showExamplesModal && (
        <ExamplesModal
          mode={language}
          onSelect={handleSelectExample}
          onClose={() => setShowExamplesModal(false)}
        />
      )}
      {showDocsModal && (
        <DocsModal onClose={() => setShowDocsModal(false)} />
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
