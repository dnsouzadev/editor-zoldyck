import jsPDF from 'jspdf';
import { formatExportTimestamp, getExportSiteUrl, getNumberedCodeLines, normalizeExportCode } from './formatters';

function createPdfLayout(pdf) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 15;
  const marginTop = 16;
  const marginBottom = 14;
  const headerTop = 12;
  const headerHeight = 16;
  const footerHeight = 8;

  return {
    pageWidth,
    pageHeight,
    marginX,
    marginTop,
    marginBottom,
    headerTop,
    headerHeight,
    footerHeight,
    contentTop: headerTop + headerHeight + 6,
    contentBottom: pageHeight - marginBottom - footerHeight,
  };
}

function drawHeader(pdf, layout, title, subtitle, timestamp, siteUrl) {
  pdf.setDrawColor(0, 102, 204);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(layout.marginX, layout.headerTop, layout.pageWidth - layout.marginX * 2, layout.headerHeight, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 102, 204);
  pdf.setFontSize(14);
  pdf.text(title, layout.marginX + 4, layout.headerTop + 6);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(90, 98, 111);
  pdf.setFontSize(8.5);
  pdf.text(subtitle, layout.marginX + 4, layout.headerTop + 11);

  pdf.setFontSize(7.5);
  pdf.text(`Exportado em ${timestamp}`, layout.pageWidth - layout.marginX - 4, layout.headerTop + 6, { align: 'right' });
  pdf.text(siteUrl, layout.pageWidth - layout.marginX - 4, layout.headerTop + 11, { align: 'right' });

  pdf.setDrawColor(215, 223, 233);
  pdf.line(layout.marginX, layout.contentTop - 2, layout.pageWidth - layout.marginX, layout.contentTop - 2);
}

function drawFooter(pdf, layout, timestamp, siteUrl) {
  pdf.setDrawColor(215, 223, 233);
  pdf.line(layout.marginX, layout.pageHeight - layout.marginBottom - 2, layout.pageWidth - layout.marginX, layout.pageHeight - layout.marginBottom - 2);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(120, 126, 140);
  pdf.setFontSize(7);
  pdf.text(`${siteUrl} · ${timestamp}`, layout.pageWidth / 2, layout.pageHeight - 6, { align: 'center' });
}

function drawNumberedCodePages(pdf, code, options) {
  const layout = options.layout;
  const numberedLines = getNumberedCodeLines(code);
  const totalDigits = String(numberedLines.length || 1).length;
  const lineNumberWidth = Math.max(pdf.getTextWidth('0'.repeat(totalDigits)) + 6, 12);
  const textWidth = layout.pageWidth - layout.marginX * 2 - lineNumberWidth - 6;
  const lineHeight = 4.8;
  const codeFontSize = 9;

  const renderPage = () => {
    drawHeader(pdf, layout, options.title, options.subtitle, options.timestamp, options.siteUrl);
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(codeFontSize);
    pdf.setTextColor(29, 32, 40);
  };

  const ensureSpace = (currentY, requiredHeight) => {
    if (currentY + requiredHeight <= layout.contentBottom) {
      return currentY;
    }

    drawFooter(pdf, layout, options.timestamp, options.siteUrl);
    pdf.addPage();
    renderPage();
    return layout.contentTop + 4;
  };

  let y = layout.contentTop + 4;
  renderPage();

  numberedLines.forEach((line) => {
    const wrappedLines = pdf.splitTextToSize(line.text || ' ', textWidth);
    const segments = Array.isArray(wrappedLines) ? wrappedLines : [wrappedLines];
    const neededHeight = Math.max(segments.length, 1) * lineHeight;
    y = ensureSpace(y, neededHeight);

    segments.forEach((segment, segmentIndex) => {
      if (segmentIndex === 0) {
        pdf.setTextColor(116, 122, 135);
        pdf.text(String(line.number).padStart(totalDigits, ' '), layout.marginX, y);
        pdf.setTextColor(29, 32, 40);
      } else {
        pdf.text(' '.repeat(totalDigits), layout.marginX, y);
      }

      pdf.text(segment || ' ', layout.marginX + lineNumberWidth, y);
      y += lineHeight;

      if (segmentIndex < segments.length - 1) {
        y = ensureSpace(y, lineHeight);
      }
    });
  });

  drawFooter(pdf, layout, options.timestamp, options.siteUrl);
}

export async function exportToPDF(code, algorithmName = 'algoritmo') {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const layout = createPdfLayout(pdf);
    const timestamp = formatExportTimestamp();
    const siteUrl = getExportSiteUrl();
    const normalizedCode = normalizeExportCode(code);

    drawNumberedCodePages(pdf, normalizedCode, {
      layout,
      title: 'Editor Zoldyck - Código Fonte',
      subtitle: `Algoritmo: ${algorithmName}`,
      timestamp,
      siteUrl,
    });

    pdf.save(`${algorithmName}.pdf`);

    return { success: true };
  } catch (error) {
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

    const layout = createPdfLayout(pdf);
    const timestamp = formatExportTimestamp();
    const siteUrl = getExportSiteUrl();

    algorithms.forEach((algorithm, index) => {
      if (index > 0) {
        drawFooter(pdf, layout, timestamp, siteUrl);
        pdf.addPage();
      }

      drawNumberedCodePages(pdf, normalizeExportCode(algorithm.code || ''), {
        layout,
        title: 'Editor Zoldyck - Lista de Algoritmos',
        subtitle: `Item ${index + 1} de ${algorithms.length} · ${algorithm.name || `Algoritmo ${index + 1}`}`,
        timestamp,
        siteUrl,
      });
    });

    pdf.save(`${fileName}.pdf`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
