import { useState, useRef, useEffect, useCallback } from 'react';
import { Code2, Music, Plus, Trash2, Sun, Moon, Github } from 'lucide-react';
import Editor from './components/Editor/Editor';
import Console from './components/Console/Console';
import Toolbar from './components/Toolbar/Toolbar';
import ExportMenu from './components/ExportMenu/ExportMenu';
import ExamplesModal from './components/ExamplesModal/ExamplesModal';
import DocsModal from './components/DocsModal/DocsModal';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { runPortugol, runVisualG } from './interpreter';
import { exportToImage } from './export/toImage';
import { exportToPDF, exportAlgorithmsToPDF } from './export/toPDF';
import { exportToWord, exportAlgorithmsToWord } from './export/toWord';
import { getDefaultCode, getExample, getExamplesList } from './examples/examples';

const MOBILE_QUERY = '(max-width: 767px)';
const LANGUAGE_STORAGE_KEY = 'portugol-language';
const ALGORITHMS_STORAGE_KEY = 'portugol-algorithm-list';
const DEFAULT_LANGUAGE = 'pseudocode';
const MUSIC_MODAL_IMAGES = ['/images.jpeg', '/teste.jpg'];

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
  const { theme, toggleTheme } = useTheme();
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
  const appContainerRef = useRef(null);
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
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [musicModalImage, setMusicModalImage] = useState(MUSIC_MODAL_IMAGES[0]);
  const [showMobileFooter, setShowMobileFooter] = useState(false);
  const musicAudioRef = useRef(null);
  const [activeAlgorithmId, setActiveAlgorithmId] = useState(null);

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
    if (!isMobile) {
      setShowMobileFooter(true);
      return;
    }
    setShowMobileFooter(false);
  }, [isMobile]);

  useEffect(() => {
    if (typeof Audio === 'undefined') return;
    const audio = new Audio('/audio.mp3');
    audio.preload = 'auto';
    musicAudioRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      musicAudioRef.current = null;
    };
  }, []);

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
      setConsoleMode('fixed');
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
    if (algorithmList.length >= 5) {
      writeConsoleError('Limite de 5 algoritmos atingido.');
      return;
    }
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
    setActiveAlgorithmId(entry.id);
    writeConsole(`Algoritmo "${name}" adicionado à lista (${algorithmList.length + 1}).`);
  }, [algorithmList.length, code, getAlgorithmNameFromCode, writeConsole]);

  const handleClearAlgorithmList = useCallback(() => {
    setAlgorithmList([]);
    setActiveAlgorithmId(null);
    writeConsole('Lista de algoritmos limpa.');
  }, [writeConsole]);

  const handleRemoveAlgorithm = useCallback((id) => {
    setAlgorithmList((prev) => {
      const nextList = prev.filter((item) => item.id !== id);
      const removedIndex = prev.findIndex((item) => item.id === id);
      if (id === activeAlgorithmId) {
        const fallback = nextList[removedIndex] || nextList[removedIndex - 1] || nextList[0];
        if (fallback) {
          setCode(fallback.code);
          setActiveAlgorithmId(fallback.id);
        } else {
          setActiveAlgorithmId(null);
        }
      }
      return nextList;
    });
  }, [activeAlgorithmId]);

  const handleSelectAlgorithm = useCallback((entry) => {
    setCode(entry.code);
    setActiveAlgorithmId(entry.id);
    writeConsole(`Algoritmo "${entry.name}" carregado!`);
  }, [writeConsole]);

  const handleSelectExample = (id, name) => {
    setCode(getExample(id, language));
    writeConsole('Exemplo "' + name + '" carregado!');
  };

  const normalizeCode = useCallback((source) => source.replace(/\r\n/g, '\n').trim(), []);

  const getUpdatedCodeForMode = useCallback((currentCode, fromMode, toMode) => {
    const normalizedCurrent = normalizeCode(currentCode);
    const fromExamples = getExamplesList(fromMode);
    const toExamples = getExamplesList(toMode);

    const currentExampleIndex = fromExamples.findIndex((example) => {
      return normalizeCode(getExample(example.id, fromMode)) === normalizedCurrent;
    });

    if (currentExampleIndex >= 0 && toExamples.length > 0) {
      const mappedIndex = Math.min(currentExampleIndex, toExamples.length - 1);
      return getExample(toExamples[mappedIndex].id, toMode);
    }

    return getDefaultCode(toMode);
  }, [normalizeCode]);

  const handleLanguageChange = useCallback((nextLanguage) => {
    if (nextLanguage === language) return;
    const nextCode = getUpdatedCodeForMode(code, language, nextLanguage);
    setLanguage(nextLanguage);
    setCode(nextCode);
    writeConsole(`Modo alterado para ${nextLanguage === 'visualg' ? 'VisualG' : 'Pseudocódigo'}.`);
  }, [code, getUpdatedCodeForMode, language, writeConsole]);

  const handlePlayMusic = useCallback(async () => {
    const randomImage = MUSIC_MODAL_IMAGES[Math.floor(Math.random() * MUSIC_MODAL_IMAGES.length)];
    setMusicModalImage(randomImage);
    setShowMusicModal(true);

    if (!musicAudioRef.current) return;
    try {
      musicAudioRef.current.currentTime = 0;
      await musicAudioRef.current.play();
    } catch (error) {
      writeConsoleError('Não foi possível reproduzir o áudio neste navegador.');
    }
  }, [writeConsoleError]);

  const mobileConsoleRevealHint = isMobile && hasExecutedOnMobile && !showConsolePanel;
  const showDesktopFixedConsole = !isMobile && consoleMode === 'fixed';
  const showDesktopOverlayConsole = !isMobile && consoleMode === 'overlay';
  const editorPaneStyle = showDesktopFixedConsole
    ? { flexBasis: `${splitRatio * 100}%` }
    : { flex: 1 };
  const consolePaneStyle = showDesktopFixedConsole
    ? { flexBasis: `${(1 - splitRatio) * 100}%` }
    : undefined;

  const containerHeightStyle = { height: 'calc(var(--vh, 1vh) * 100)' };
  const shouldShowMobileConsole = isMobile && showConsolePanel;
  const shouldShowEditorPane = !isMobile || !showConsolePanel;
  const mainPaddingStyle = showDesktopOverlayConsole ? { paddingBottom: '18rem' } : undefined;

  const startPanelResize = (event) => {
    if (isMobile || consoleMode !== 'fixed') return;
    event.preventDefault();
    setIsResizingPanels(true);
  };

  const handleContainerScroll = useCallback((event) => {
    if (!isMobile) return;
    const scrollTop = event.currentTarget.scrollTop || 0;
    setShowMobileFooter(scrollTop > 24);
  }, [isMobile]);

  return (
    <div
      ref={appContainerRef}
      onScroll={handleContainerScroll}
      className={`flex flex-col bg-background text-foreground w-full font-sans ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}
      style={containerHeightStyle}
    >
      <header className="px-4 md:px-8 py-4 bg-surface-base">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-highest flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <img
                src="/capivara.png"
                alt="Mascote Capivara"
                className="w-12 h-12 object-contain bg-surface-highest"
                loading="lazy"
              />
            </div>
            <div className="space-y-2">
              <p className="uppercase text-[10px] tracking-[0.5em] text-muted-foreground font-display">Portugol</p>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.15em] uppercase font-display">Editor Zoldyck</h1>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Daniel Souza • SI FeMASS 2026.1</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunToggle}
                className="bg-primary text-primary-foreground px-6 py-2 text-[11px] uppercase tracking-[0.35em] font-display hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                {isRunning ? 'Stop' : 'Run'}
              </button>
              <button
                onClick={clearConsole}
                className="bg-surface-highest text-foreground px-4 py-2 text-[11px] uppercase tracking-[0.35em] font-display hover:bg-foreground hover:text-background transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileConsoleRevealHint && (
        <div className="px-4 md:px-8 py-2 bg-surface-low flex justify-end">
          <button
            onClick={() => setShowConsolePanel(true)}
            className="text-[11px] uppercase tracking-[0.3em] bg-foreground text-background px-3 py-1 hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            Mostrar console
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden lg:flex w-24 bg-surface-low text-foreground flex-col px-3 py-6 gap-4 items-center">
          <div className="w-full flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleAddCurrentAlgorithmToList}
              className="w-9 h-9 bg-foreground text-background flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
              aria-label="Adicionar algoritmo"
              title="Adicionar algoritmo"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => activeAlgorithmId && handleRemoveAlgorithm(activeAlgorithmId)}
              className="w-9 h-9 bg-surface-highest text-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="Remover algoritmo selecionado"
              title="Remover selecionado"
              disabled={!activeAlgorithmId}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full h-px bg-surface-outline/30" />
          <div className="w-full space-y-2 text-[11px] uppercase tracking-[0.3em] font-display">
            {algorithmList.length === 0 && (
              <p className="text-muted-foreground text-[10px] tracking-[0.2em] text-center">Sem itens</p>
            )}
            {algorithmList.map((entry, index) => (
              <button
                key={entry.id}
                onClick={() => handleSelectAlgorithm(entry)}
                className={`w-full text-center px-2 py-1 ${entry.id === activeAlgorithmId ? 'bg-surface-highest text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                title={entry.name}
                aria-label={`Algoritmo ${index + 1}: ${entry.name}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex-1 flex flex-col overflow-hidden">
          <Toolbar
            onExport={() => setShowExportMenu(true)}
            onLoadExample={() => setShowExamplesModal(true)}
            onAddToList={handleAddCurrentAlgorithmToList}
            onClearList={handleClearAlgorithmList}
            algorithmListCount={algorithmList.length}
            language={language}
            onLanguageChange={handleLanguageChange}
            onShowDocs={() => setShowDocsModal(true)}
          />

          <div className="flex-1 flex overflow-hidden px-4 md:px-8 pb-4 gap-4" style={mainPaddingStyle}>
            <div className="flex-1 min-w-0 relative">
              <div
                ref={mainLayoutRef}
                className="flex flex-col gap-4 h-full"
              >
                {shouldShowEditorPane && (
                  <section
                    className={`flex flex-col bg-surface-base ${isMobile ? 'flex-1 min-h-0' : 'h-full'}`}
                    style={editorPaneStyle}
                  >
                    <div className="flex items-center justify-end px-6 py-2 text-[11px] uppercase tracking-[0.35em] bg-surface-low font-display">
                      <span className="hidden md:inline text-muted-foreground">Ctrl + Enter</span>
                    </div>
                    <div className="flex-1 min-h-0">
                      <Editor code={code} onChange={setCode} onRunShortcut={executeProgram} />
                    </div>
                  </section>
                )}

                {showDesktopFixedConsole && (
                  <div
                    role="separator"
                    aria-orientation="horizontal"
                    aria-label="Redimensionar painéis"
                    className="hidden md:flex items-center justify-center h-3 cursor-row-resize bg-surface-lowest relative"
                    onMouseDown={startPanelResize}
                  >
                    <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-0.5 bg-surface-variant/40 pointer-events-none" />
                  </div>
                )}

                {showDesktopFixedConsole && (
                  <section
                    className="flex flex-col bg-surface-lowest h-full"
                    style={consolePaneStyle}
                  >
                    <div className="flex items-center justify-between px-6 py-3 text-[11px] uppercase tracking-[0.35em] bg-surface-low font-display">
                      <span>Output Console</span>
                      <button
                        onClick={handleCloseConsole}
                        className="text-[10px] uppercase tracking-[0.2em] bg-surface-highest px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
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
                  <section className="flex flex-col bg-surface-lowest flex-1 min-h-0">
                    <div className="flex items-center justify-between px-6 py-3 text-[11px] uppercase tracking-[0.35em] bg-surface-low font-display">
                      <span>Output Console</span>
                      <button
                        onClick={handleMobileConsoleClose}
                        className="text-[10px] uppercase tracking-[0.2em] bg-surface-highest px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
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
                  <div className="bg-surface-bright">
                    <div className="flex items-center justify-between px-6 py-3 text-[11px] uppercase tracking-[0.35em] bg-surface-high font-display">
                      <span>Output Console</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setConsoleMode('fixed')}
                          className="text-[10px] uppercase tracking-[0.2em] bg-surface-highest px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
                        >
                          Fixar
                        </button>
                        <button
                          onClick={handleCloseConsole}
                          className="text-[10px] uppercase tracking-[0.2em] bg-surface-highest px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
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
            </div>

          </div>
        </section>
      </div>

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
      {showMusicModal && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setShowMusicModal(false)}
        >
          <div
            className="bg-surface-bright p-4 max-w-md w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={musicModalImage}
              alt="Imagem aleatória"
              className="w-full h-64 object-cover"
            />
            <p className="mt-4 text-center text-xl font-black uppercase tracking-[0.3em]">okay</p>
          </div>
        </div>
      )}

      {(!isMobile || showMobileFooter) && (
      <footer className="bg-surface-low px-4 md:px-8 py-3 text-[10px] uppercase tracking-[0.3em] flex justify-between flex-wrap gap-2 font-display">
        <button
          onClick={() => window.open('https://github.com/dnsouzadev/editor-zoldyck', '_blank')}
          className="inline-flex items-center gap-2 bg-surface-highest text-foreground px-3 py-1 hover:bg-foreground hover:text-background transition-colors"
          title="GitHub"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </button>
        <button
          onClick={() => window.open('https://papertoilet.com/', '_blank')}
          className="underline-offset-4 hover:underline text-foreground"
        >
          Professor Afonso pediu para você clicar aqui
        </button>
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 bg-surface-highest text-foreground px-3 py-1 hover:bg-foreground hover:text-background transition-colors"
          title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <button
          onClick={handlePlayMusic}
          className="inline-flex items-center gap-2 bg-foreground text-background px-3 py-1 hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          <Music className="w-4 h-4" />
          <span>Não clique aqui, por favor</span>
        </button>
      </footer>
      )}
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
