import { useState } from 'react';
import './ExportMenu.css';

export default function ExportMenu({ onExport, onClose }) {
  const [format, setFormat] = useState('png');

  const handleExport = () => {
    onExport(format);
    onClose();
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Exportar Código</h2>
        
        <div className="export-options">
          <label className="export-option">
            <input
              type="radio"
              name="format"
              value="png"
              checked={format === 'png'}
              onChange={(e) => setFormat(e.target.value)}
            />
            <div className="option-content">
              <span className="option-icon">🖼️</span>
              <div>
                <div className="option-title">Imagem (PNG)</div>
                <div className="option-description">Captura visual do código</div>
              </div>
            </div>
          </label>

          <label className="export-option">
            <input
              type="radio"
              name="format"
              value="pdf"
              checked={format === 'pdf'}
              onChange={(e) => setFormat(e.target.value)}
            />
            <div className="option-content">
              <span className="option-icon">📄</span>
              <div>
                <div className="option-title">PDF</div>
                <div className="option-description">Documento formatado</div>
              </div>
            </div>
          </label>

          <label className="export-option">
            <input
              type="radio"
              name="format"
              value="docx"
              checked={format === 'docx'}
              onChange={(e) => setFormat(e.target.value)}
            />
            <div className="option-content">
              <span className="option-icon">📝</span>
              <div>
                <div className="option-title">Word (DOCX)</div>
                <div className="option-description">Documento editável</div>
              </div>
            </div>
          </label>
        </div>

        <div className="export-actions">
          <button className="export-btn export-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="export-btn export-btn-confirm" onClick={handleExport}>
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
