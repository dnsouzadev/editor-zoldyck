// Módulo de exportação para PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(code, algorithmName = 'algoritmo') {
  const siteUrl = typeof window !== 'undefined' && window.location ? window.location.origin : 'https://editor-zoldyck.app';
  // Criar elemento temporário com o código
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    background: white;
    padding: 40px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #000;
    width: 700px;
  `;

  // Criar cabeçalho
  const header = document.createElement('div');
  header.style.cssText = `
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #0066cc;
  `;
  header.innerHTML = `
    <div style="font-size: 16px; font-weight: bold; color: #0066cc; margin-bottom: 8px;">
      Editor Zoldyck - Código Fonte
    </div>
    <div style="font-size: 11px; color: #666;">
      Algoritmo: ${algorithmName}<br>
      Data: ${new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })}<br>
      Desenvolvido por: Daniel Souza - Sistemas de Informação FeMASS/2026.1<br>
      URL: ${siteUrl}
    </div>
  `;

  // Criar área de código
  const codeBlock = document.createElement('pre');
  codeBlock.style.cssText = `
    margin: 0;
    padding: 15px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
  `;
  codeBlock.textContent = code;

  container.appendChild(header);
  container.appendChild(codeBlock);
  document.body.appendChild(container);

  try {
    // Capturar como imagem
    const canvas = await html2canvas(container, {
      backgroundColor: 'white',
      scale: 2,
    });

    // Remover elemento temporário
    document.body.removeChild(container);

    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${algorithmName}.pdf`);

    return { success: true };
  } catch (error) {
    document.body.removeChild(container);
    return { success: false, error: error.message };
  }
}
