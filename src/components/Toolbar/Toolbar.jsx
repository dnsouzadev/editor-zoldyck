import './Toolbar.css';

export default function Toolbar({ 
  onRun, 
  onClear, 
  onExport, 
  onLoadExample, 
  isRunning 
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button 
          className="toolbar-btn toolbar-btn-primary" 
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? '⏸ Executando...' : '▶ Executar (Ctrl+Enter)'}
        </button>
        
        <button 
          className="toolbar-btn" 
          onClick={onClear}
        >
          🗑 Limpar Console
        </button>
        
        <button 
          className="toolbar-btn" 
          onClick={onLoadExample}
        >
          📄 Exemplos
        </button>
      </div>
      
      <div className="toolbar-right">
        <button 
          className="toolbar-btn toolbar-btn-export" 
          onClick={onExport}
        >
          📤 Exportar
        </button>
      </div>
    </div>
  );
}
