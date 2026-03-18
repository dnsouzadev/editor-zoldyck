// Módulo de exportação para Word (DOCX)
import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';

export async function exportToWord(code, algorithmName = 'algoritmo') {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Título
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Editor Portugol Web - Código Fonte',
                  bold: true,
                  size: 32, // 16pt
                  color: '0066CC',
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Informações
            new Paragraph({
              children: [
                new TextRun({
                  text: `Algoritmo: ${algorithmName}`,
                  size: 20, // 10pt
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
                  size: 20, // 10pt
                  color: '666666',
                }),
              ],
              spacing: {
                after: 400,
              },
            }),

            // Separador
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

            // Código
            ...code.split('\n').map(
              (line) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line || ' ', // Linha vazia precisa de espaço
                      font: 'Courier New',
                      size: 20, // 10pt
                    }),
                  ],
                  spacing: {
                    line: 276, // 1.15 line spacing
                  },
                })
            ),
          ],
        },
      ],
    });

    // Gerar e salvar
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${algorithmName}.docx`);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
