import { Play, Trash2, Download, FileCode, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../ThemeProvider';

export default function Toolbar({ 
  onRun, 
  onClear, 
  onExport, 
  onLoadExample, 
  isRunning 
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-2 md:px-4 py-1.5 md:py-2.5 bg-card border-b border-border shrink-0 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 md:gap-2">
        <Button 
          onClick={onRun}
          disabled={isRunning}
          size="sm"
          className="h-8 md:h-9 px-3 md:px-4"
        >
          <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden md:inline ml-2">{isRunning ? 'Executando...' : 'Executar'}</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClear}
          size="sm"
          className="h-8 md:h-9 px-2.5 md:px-4"
        >
          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden md:inline ml-2">Limpar</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={onLoadExample}
          size="sm"
          className="h-8 md:h-9 px-2.5 md:px-4"
        >
          <FileCode className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden md:inline ml-2">Exemplos</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-1.5 md:gap-2">
        <Button 
          variant="secondary"
          onClick={onExport}
          size="sm"
          className="h-8 md:h-9 px-2.5 md:px-4"
        >
          <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden md:inline ml-2">Exportar</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 md:h-9 md:w-9"
          title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 h-5" /> : <Moon className="w-4 h-4 md:w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
