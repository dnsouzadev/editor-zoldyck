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
    <div className="flex items-center justify-between px-2 md:px-4 py-3 bg-card border-b border-border shrink-0 overflow-x-auto">
      <div className="flex items-center gap-1 md:gap-2">
        <Button 
          onClick={onRun}
          disabled={isRunning}
          size="sm"
          className="md:px-4"
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">{isRunning ? 'Executando...' : 'Executar'}</span>
          <span className="sm:hidden">{isRunning ? '...' : ''}</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClear}
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Limpar</span>
        </Button>
        
        <Button 
          variant="outline"
          onClick={onLoadExample}
          size="sm"
        >
          <FileCode className="w-4 h-4" />
          <span className="hidden sm:inline">Exemplos</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2">
        <Button 
          variant="secondary"
          onClick={onExport}
          size="sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
          title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 h-5" /> : <Moon className="w-4 h-4 md:w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
