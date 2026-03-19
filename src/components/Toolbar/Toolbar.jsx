import { Play, Square, Trash2, Download, FileCode, Moon, Sun, BookOpen, ListPlus, ListX } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../ThemeProvider';
import { cn } from '../../lib/utils';

const LANGUAGE_OPTIONS = [
  { value: 'pseudocode', label: 'Pseudocódigo' },
  { value: 'visualg', label: 'VisualG' },
];

export default function Toolbar({ 
  onRun, 
  onClear, 
  onExport, 
  onLoadExample, 
  onAddToList,
  onClearList,
  algorithmListCount = 0,
  isRunning,
  language,
  onLanguageChange,
  onShowDocs,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-wrap items-center justify-between px-4 md:px-8 py-2.5 bg-background border-b-2 border-border shrink-0 gap-3">
      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          onClick={onRun}
          size="sm"
          className={cn(
            "h-8 md:h-9 px-3 md:px-4 rounded-none border-2 font-mono text-[10px] uppercase tracking-[0.25em] shadow-[4px_4px_0_rgba(0,0,0,0.12)] transition-colors",
            isRunning
              ? "border-destructive bg-destructive text-destructive-foreground"
              : "border-foreground bg-primary text-primary-foreground"
          )}
          title={isRunning ? 'Parar execução' : 'Executar (Ctrl + Enter)'}
        >
          {isRunning ? (
            <Square className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span className="ml-2">{isRunning ? 'Parar' : 'Executar'}</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClear}
          size="sm"
          className="h-8 md:h-9 px-3 md:px-4 rounded-none border-2 border-foreground bg-background text-foreground font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
          title="Limpar Console"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden lg:inline ml-2">Limpar</span>
        </Button>
        
        <div className="w-[1px] h-7 bg-border/50 mx-1 hidden sm:block" />

        <Button 
          variant="ghost"
          onClick={onLoadExample}
          size="sm"
          className="h-8 md:h-9 px-3 md:px-4 rounded-none border-2 border-foreground font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-secondary/70"
        >
          <FileCode className="w-4 h-4 text-primary" />
          <span className="hidden md:inline ml-2 text-foreground/90">Exemplos</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onAddToList}
          size="sm"
          className="h-8 md:h-9 px-3 md:px-4 rounded-none border-2 border-foreground font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-secondary/70"
          title="Adicionar código atual na lista de algoritmos"
        >
          <ListPlus className="w-4 h-4 text-primary" />
          <span className="hidden lg:inline ml-2 text-foreground/90">Lista ({algorithmListCount})</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onClearList}
          size="sm"
          disabled={algorithmListCount === 0}
          className="h-8 md:h-9 px-3 md:px-4 rounded-none border-2 border-foreground font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-secondary/70"
          title="Limpar lista de algoritmos"
        >
          <ListX className="w-4 h-4 text-primary" />
          <span className="hidden lg:inline ml-2 text-foreground/90">Limpar lista</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
        <div className="relative h-8 md:h-9">
          <select
            value={language}
            onChange={(event) => onLanguageChange?.(event.target.value)}
            aria-label="Selecionar modo do interpretador"
            className="appearance-none bg-card text-foreground border-2 border-foreground px-3 pr-8 font-mono text-[11px] tracking-[0.2em] rounded-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer h-full w-[130px] md:w-[150px]"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-0 right-0 flex items-center justify-end pr-2 text-foreground text-xs">
            ▼
          </span>
        </div>

        <Button 
          variant="secondary"
          onClick={onExport}
          size="sm"
          className="h-8 md:h-9 px-3 md:px-4 rounded-none border-2 border-foreground bg-secondary text-foreground font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Exportar</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onShowDocs}
          size="sm"
          className="h-8 md:h-9 px-3 md:px-4 rounded-none border-2 border-foreground font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-secondary/70"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Docs</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 md:h-9 md:w-9 rounded-none border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
          title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Moon className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
