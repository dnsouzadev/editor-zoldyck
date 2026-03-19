// Módulo de exportação para PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(code, algorithmName = 'algoritmo') {
  const siteUrl = typeof window !== 'undefined' && window.location ? window.location.origin : 'https://editor-zoldyck.app';
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
    const canvas = await html2canvas(container, {
      backgroundColor: 'white',
      scale: 2,
    });

    document.body.removeChild(container);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${algorithmName}.pdf`);

    return { success: true };
  } catch (error) {
    document.body.removeChild(container);
    return { success: false, error: error.message };
  }
}

export async function exportAlgorithmsToPDF(algorithms, fileName = 'lista-algoritmos') {
  try {
    if (!Array.isArray(algorithms) || algorithms.length === 0) {
      return { success: false, error: 'A lista de algoritmos está vazia.' };
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const today = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const marginX = 15;
    const marginTop = 18;
    const marginBottom = 15;
    const maxTextWidth = pageWidth - marginX * 2;
    const lineHeight = 5;

    const ensureSpace = (currentY, neededLines = 1) => {
      const requiredHeight = neededLines * lineHeight;
      if (currentY + requiredHeight > pageHeight - marginBottom) {
        pdf.addPage();
        return marginTop;
      }
      return currentY;
    };

    let y = marginTop;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Editor Zoldyck - Lista de Algoritmos', marginX, y);
    y += 7;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Total: ${algorithms.length} algoritmo(s) | Data: ${today}`, marginX, y);
    y += 8;

    algorithms.forEach((algorithm, index) => {
      y = ensureSpace(y, 3);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      const title = `${index + 1}. ${algorithm.name || `Algoritmo ${index + 1}`}`;
      pdf.text(title, marginX, y);
      y += 6;

      pdf.setFont('courier', 'normal');
      pdf.setFontSize(9);
      const lines = pdf.splitTextToSize(algorithm.code || '', maxTextWidth);

      for (const line of lines) {
        y = ensureSpace(y, 1);
        pdf.text(line, marginX, y);
        y += lineHeight;
      }

      y += 4;
    });

    pdf.save(`${fileName}.pdf`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
