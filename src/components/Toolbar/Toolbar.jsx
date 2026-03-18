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
    <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <Button 
          onClick={onRun}
          disabled={isRunning}
          size="default"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Executando...' : 'Executar'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClear}
        >
          <Trash2 className="w-4 h-4" />
          Limpar
        </Button>
        
        <Button 
          variant="outline"
          onClick={onLoadExample}
        >
          <FileCode className="w-4 h-4" />
          Exemplos
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="secondary"
          onClick={onExport}
        >
          <Download className="w-4 h-4" />
          Exportar
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
