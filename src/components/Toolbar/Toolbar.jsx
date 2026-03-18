import { Play, Trash2, Download, FileCode, Moon, Sun, BookOpen } from 'lucide-react';
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
  isRunning,
  language,
  onLanguageChange,
  onShowDocs,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-background border-b-2 border-border shrink-0 overflow-x-auto no-scrollbar gap-4">
      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          onClick={onRun}
          disabled={isRunning}
          size="sm"
          className="h-9 md:h-10 px-4 md:px-5 rounded-none border-2 border-foreground bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-[0.25em] shadow-[4px_4px_0_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          <Play className={cn("w-4 h-4", !isRunning && "fill-current")} />
          <span className="hidden sm:inline ml-2">{isRunning ? 'Rodando' : 'Executar'}</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClear}
          size="sm"
          className="h-9 md:h-10 px-3 md:px-4 rounded-none border-2 border-foreground bg-background text-foreground font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
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
          className="h-9 md:h-10 px-3 md:px-4 rounded-none border-2 border-foreground font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-secondary/70"
        >
          <FileCode className="w-4 h-4 text-primary" />
          <span className="hidden md:inline ml-2 text-foreground/90">Exemplos</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex flex-col text-[10px] uppercase tracking-[0.3em]">
          <span className="text-muted-foreground">Modo</span>
          <div className="relative mt-1">
            <select
              value={language}
              onChange={(event) => onLanguageChange?.(event.target.value)}
              aria-label="Selecionar modo do interpretador"
              className="appearance-none bg-card text-foreground border-2 border-foreground px-3 py-1 pr-8 font-mono text-[11px] tracking-[0.2em] rounded-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-foreground text-xs">
              ▼
            </span>
          </div>
        </div>

        <Button 
          variant="secondary"
          onClick={onExport}
          size="sm"
          className="h-9 md:h-10 px-3 md:px-4 rounded-none border-2 border-foreground bg-secondary text-foreground font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Exportar</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onShowDocs}
          size="sm"
          className="h-9 md:h-10 px-3 md:px-4 rounded-none border-2 border-foreground font-mono text-[11px] uppercase tracking-[0.25em] hover:bg-secondary/70"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Docs</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 md:h-10 md:w-10 rounded-none border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
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
