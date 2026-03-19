// Módulo de exportação para Word (DOCX)
import { Document, Paragraph, TextRun, Packer, PageBreak } from 'docx';
import { saveAs } from 'file-saver';

export async function exportToWord(code, algorithmName = 'algoritmo') {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Editor Zoldyck - Código Fonte',
                  bold: true,
                  size: 32,
                  color: '0066CC',
                }),
              ],
              spacing: {
                after: 200,
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Algoritmo: ${algorithmName}`,
                  size: 20,
                  color: '666666',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Data: ${new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}`,
                  size: 20,
                  color: '666666',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Desenvolvido por: Daniel Souza - Sistemas de Informação FeMASS/2026.1',
                  size: 18,
                  color: '999999',
                }),
              ],
              spacing: {
                after: 400,
              },
            }),
            new Paragraph({
              border: {
                bottom: {
                  color: '0066CC',
                  space: 1,
                  style: 'single',
                  size: 6,
                },
              },
              spacing: {
                after: 300,
              },
            }),
            ...code.split('\n').map(
              (line) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line || ' ',
                      font: 'Courier New',
                      size: 20,
                    }),
                  ],
                  spacing: {
                    line: 276,
                  },
                })
            ),
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

    algorithms.forEach((algorithm, index) => {
      const name = algorithm.name || `Algoritmo ${index + 1}`;

      if (index > 0) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Editor Zoldyck - Lista de Algoritmos',
              bold: true,
              size: 30,
              color: '0066CC',
            }),
          ],
          spacing: { after: 150 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Item ${index + 1} de ${algorithms.length}`,
              size: 20,
              color: '666666',
            }),
          ],
          spacing: { after: 200 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${name}`,
              bold: true,
              size: 26,
            }),
          ],
          spacing: { after: 200 },
        })
      );

      const lines = (algorithm.code || '').split('\n');
      lines.forEach((line) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line || ' ',
                font: 'Courier New',
                size: 20,
              }),
            ],
            spacing: { line: 276 },
          })
        );
      });
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
