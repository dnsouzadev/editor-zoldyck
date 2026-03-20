import { Download, FileCode, BookOpen, ListPlus, ListX } from 'lucide-react';
import { Button } from '../ui/button';

const LANGUAGE_OPTIONS = [
  { value: 'pseudocode', label: 'Pseudocódigo' },
  { value: 'visualg', label: 'VisualG' },
];

export default function Toolbar({ 
  onExport, 
  onLoadExample, 
  onAddToList,
  onClearList,
  algorithmListCount = 0,
  language,
  onLanguageChange,
  onShowDocs,
}) {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-2 bg-surface-low shrink-0 gap-2 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          onClick={onLoadExample}
          size="sm"
          className="h-8 px-3 rounded-none bg-surface-base font-display text-[10px] uppercase tracking-[0.35em] hover:bg-surface-highest"
        >
          <FileCode className="w-4 h-4 text-primary" />
          <span className="hidden md:inline ml-2 text-foreground/90">Exemplos</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onAddToList}
          size="sm"
          className="h-8 px-3 rounded-none bg-surface-base font-display text-[10px] uppercase tracking-[0.35em] hover:bg-surface-highest"
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
          className="h-8 px-3 rounded-none bg-surface-base font-display text-[10px] uppercase tracking-[0.35em] hover:bg-surface-highest"
          title="Limpar lista de algoritmos"
        >
          <ListX className="w-4 h-4 text-primary" />
          <span className="hidden lg:inline ml-2 text-foreground/90">Limpar lista</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2 justify-end">
        <div className="relative h-8">
          <select
            value={language}
            onChange={(event) => onLanguageChange?.(event.target.value)}
            aria-label="Selecionar modo do interpretador"
            className="appearance-none bg-surface-base text-foreground px-3 pr-8 font-display text-[11px] tracking-[0.3em] rounded-none focus:outline-none border-b-2 border-transparent focus:border-foreground cursor-pointer h-full w-[120px]"
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
          className="h-8 px-3 rounded-none bg-surface-highest text-foreground font-display text-[10px] uppercase tracking-[0.35em] hover:bg-foreground hover:text-background transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Exportar</span>
        </Button>

        <Button
          variant="ghost"
          onClick={onShowDocs}
          size="sm"
          className="h-8 px-3 rounded-none bg-surface-base font-display text-[10px] uppercase tracking-[0.35em] hover:bg-surface-highest"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden md:inline ml-2">Docs</span>
        </Button>
      </div>
    </div>
  );
}
