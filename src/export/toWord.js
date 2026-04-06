import { Document, Paragraph, TextRun, Packer, PageBreak } from 'docx';
import { saveAs } from 'file-saver';
import { formatExportTimestamp, getExportSiteUrl, getNumberedCodeLines, normalizeExportCode } from './formatters';

function createTitleParagraph(text, color = '1F1F1F', size = 32) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size,
        color,
      }),
    ],
    spacing: {
      after: 120,
    },
  });
}

function createMetaParagraph(text, size = 18, color = '6E6E6E', after = 0) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size,
        color,
      }),
    ],
    spacing: {
      after,
    },
  });
}

function createDividerParagraph() {
  return new Paragraph({
    border: {
      bottom: {
        color: 'D2D2D2',
        space: 1,
        style: 'single',
        size: 4,
      },
    },
    spacing: {
      after: 200,
    },
  });
}

function createCodeParagraphs(code) {
  const lines = getNumberedCodeLines(normalizeExportCode(code));
  const digits = String(lines.length || 1).length;

  return lines.map((line) => {
    const numberLabel = String(line.number).padStart(digits, ' ');
    return new Paragraph({
      children: [
        new TextRun({
          text: `${numberLabel}  `,
          font: 'Courier New',
          size: 18,
          color: '6E6E6E',
        }),
        new TextRun({
          text: line.text || ' ',
          font: 'Courier New',
          size: 20,
        }),
      ],
      spacing: {
        line: 280,
      },
    });
  });
}

export async function exportToWord(code, algorithmName = 'algoritmo') {
  try {
    const timestamp = formatExportTimestamp();
    const siteUrl = getExportSiteUrl();

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            createTitleParagraph('Editor Zoldyck - Código Fonte'),
            createMetaParagraph(`Algoritmo: ${algorithmName}`, 18, '6E6E6E'),
            createMetaParagraph(`Exportado em: ${timestamp}`, 16, 'A3A3A3'),
            createMetaParagraph(siteUrl, 14, 'A3A3A3', 160),
            createDividerParagraph(),
            ...createCodeParagraphs(code),
            createMetaParagraph(`Exportado em ${timestamp} · ${siteUrl}`, 12, 'A3A3A3', 120),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${algorithmName}.docx`);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function exportAlgorithmsToWord(algorithms, fileName = 'lista-algoritmos') {
  try {
    if (!Array.isArray(algorithms) || algorithms.length === 0) {
      return { success: false, error: 'A lista de algoritmos está vazia.' };
    }

    const children = [];
    const timestamp = formatExportTimestamp();
    const siteUrl = getExportSiteUrl();

    algorithms.forEach((algorithm, index) => {
      const name = algorithm.name || `Algoritmo ${index + 1}`;

      if (index > 0) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }

      children.push(createTitleParagraph('Editor Zoldyck - Lista de Algoritmos', '1F1F1F', 30));
      children.push(createMetaParagraph(`Item ${index + 1} de ${algorithms.length}`, 18, '6E6E6E'));
      children.push(createMetaParagraph(`${index + 1}. ${name}`, 24, '202020', 120));
      children.push(createMetaParagraph(`Exportado em: ${timestamp}`, 14, 'A3A3A3'));
      children.push(createMetaParagraph(siteUrl, 12, 'A3A3A3', 120));
      children.push(createDividerParagraph());
      children.push(...createCodeParagraphs(algorithm.code || ''));
      children.push(createMetaParagraph(`Exportado em ${timestamp} · ${siteUrl}`, 12, 'A3A3A3', 120));
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
