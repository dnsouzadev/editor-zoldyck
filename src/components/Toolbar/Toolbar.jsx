import { Play, Trash2, Download, FileCode, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../ThemeProvider';
import { cn } from '../../lib/utils';

export default function Toolbar({ 
  onRun, 
  onClear, 
  onExport, 
  onLoadExample, 
  isRunning 
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-3 md:px-6 py-2.5 bg-gradient-to-r from-background via-muted/20 to-background border-b border-border/50 shrink-0 overflow-x-auto no-scrollbar gap-4 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          onClick={onRun}
          disabled={isRunning}
          size="sm"
          className="h-9 md:h-10 px-4 md:px-5 font-bold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:opacity-50 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
        >
          <Play className={cn("w-4 h-4", !isRunning && "fill-current")} />
          <span className="hidden sm:inline ml-2 font-mono">{isRunning ? 'Rodando...' : 'Executar'}</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClear}
          size="sm"
          className="h-9 md:h-10 px-3 md:px-4 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-all shadow-md hover:shadow-lg font-mono"
          title="Limpar Console"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden lg:inline ml-2 font-semibold">Limpar</span>
        </Button>
        
        <div className="w-[1px] h-7 bg-border/50 mx-1 hidden sm:block" />

        <Button 
          variant="ghost"
          onClick={onLoadExample}
          size="sm"
          className="h-9 md:h-10 px-3 md:px-4 hover:bg-accent/50 shadow-sm hover:shadow-md transition-all font-mono"
        >
          <FileCode className="w-4 h-4 text-primary" />
          <span className="hidden md:inline ml-2 text-foreground/90 font-semibold">Exemplos</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          variant="secondary"
          onClick={onExport}
          size="sm"
          className="h-9 md:h-10 px-3 md:px-4 shadow-md hover:shadow-lg border border-border/50 hover:border-border transition-all font-mono font-semibold bg-secondary/80 hover:bg-secondary"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Exportar</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-accent/50 transition-all active:rotate-12 shadow-md hover:shadow-lg border border-transparent hover:border-border/30"
          title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400/30 drop-shadow-md" />
          ) : (
            <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-700 fill-slate-700/30 drop-shadow-md" />
          )}
        </Button>
      </div>
    </div>
  );
}
