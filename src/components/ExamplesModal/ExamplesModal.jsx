import { X, FileCode, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { getExamplesList } from '../../examples/examples';

export default function ExamplesModal({ mode = 'pseudocode', onSelect, onClose }) {
  const examples = getExamplesList(mode);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 animate-in fade-in zoom-in-95 flex flex-col max-h-[80vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-primary">
            <FileCode className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Exemplos de Código</h2>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                Modo {mode === 'visualg' ? 'VisualG' : 'Pseudocódigo'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-6">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => {
                onSelect(example.id, example.name);
                onClose();
              }}
              className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {example.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  Clique para carregar este exemplo no editor
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="w-5 h-5 text-primary" />
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="px-8">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
