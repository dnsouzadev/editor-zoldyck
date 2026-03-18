import { useState } from 'react';
import { X, Image, FileText, FileDown } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export default function ExportMenu({ onExport, onClose }) {
  const [format, setFormat] = useState('png');

  const handleExport = () => {
    onExport(format);
    onClose();
  };

  const formats = [
    { id: 'png', label: 'Imagem (PNG)', description: 'Captura visual do código', icon: Image },
    { id: 'pdf', label: 'PDF', description: 'Documento formatado', icon: FileText },
    { id: 'docx', label: 'Word (DOCX)', description: 'Documento editável', icon: FileDown },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Exportar Código</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
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
                  "flex items-center gap-3 p-3 rounded-md border-2 cursor-pointer transition-colors",
                  format === fmt.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
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
                <Icon className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="font-medium">{fmt.label}</div>
                  <div className="text-sm text-muted-foreground">{fmt.description}</div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleExport}>
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
