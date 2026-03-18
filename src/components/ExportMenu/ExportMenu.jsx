import { useMemo, useState } from 'react';
import { X, Image, FileText, FileDown, Type } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export default function ExportMenu({ onExport, onClose }) {
  const [format, setFormat] = useState('png');

  const handleExport = () => {
    onExport(format);
    onClose();
  };

  const isMobileDevice = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const formats = useMemo(() => {
    const items = [
      { id: 'png', label: 'Imagem (PNG)', description: 'Captura visual do código', icon: Image },
      { id: 'pdf', label: 'PDF', description: 'Documento formatado', icon: FileText },
      { id: 'docx', label: 'Word (DOCX)', description: 'Documento editável', icon: FileDown },
      { id: 'text', label: 'Texto puro', description: isMobileDevice ? 'Compartilha o código como texto separado' : 'Copia/compartilha o código em texto', icon: Type },
    ];
    if (isMobileDevice) {
      // Move text option to the front on mobile for visibilidade
      const textOption = items.pop();
      return [textOption, ...items];
    }
    return items;
  }, [isMobileDevice]);

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-card border-2 border-foreground rounded-sm shadow-[8px_8px_0_rgba(0,0,0,0.2)] p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 text-foreground">
          <h2 className="text-lg font-black uppercase tracking-[0.3em]">Exportar</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-none border border-transparent hover:border-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3 mb-6">
          {formats.map((fmt) => {
            const Icon = fmt.icon;
            return (
              <label
                key={fmt.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-none border-2 cursor-pointer transition-colors uppercase text-[11px] tracking-[0.2em]",
                  format === fmt.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-secondary"
                )}
              >
                <input
                  type="radio"
                  name="format"
                  value={fmt.id}
                  checked={format === fmt.id}
                  onChange={(e) => setFormat(e.target.value)}
                  className="sr-only"
                />
                <Icon className={cn("w-5 h-5", format === fmt.id ? "text-background" : "text-foreground")} />
                <div className="flex-1 normal-case tracking-normal">
                  <div className="font-semibold">{fmt.label}</div>
                  <div className="text-sm text-muted-foreground">{fmt.description}</div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-none border-2 border-foreground">
            Cancelar
          </Button>
          <Button onClick={handleExport} className="rounded-none border-2 border-foreground bg-primary text-primary-foreground">
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
