import html2canvas from 'html2canvas';
import { formatExportTimestamp, getExportSiteUrl, getNumberedCodeLines, normalizeExportCode } from './formatters';

export async function exportToImage(code, algorithmName = 'algoritmo') {
  const siteUrl = getExportSiteUrl();
  const timestamp = formatExportTimestamp();
  const numberedLines = getNumberedCodeLines(normalizeExportCode(code));
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
    padding: 28px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: #d4d4d4;
    width: 920px;
    border-radius: 16px;
    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.35);
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    margin-bottom: 18px;
    padding: 18px 18px 16px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.72);
  `;
  header.innerHTML = `
    <div style="font-size: 18px; font-weight: 700; color: #93c5fd; margin-bottom: 8px; letter-spacing: 0.08em; text-transform: uppercase;">
      Editor Zoldyck - Exportação PNG
    </div>
    <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;">
      ${algorithmName}
    </div>
    <div style="font-size: 10px; color: #94a3b8;">
      Exportado em ${timestamp} • ${siteUrl}
    </div>
  `;

  const codeShell = document.createElement('div');
  codeShell.style.cssText = `
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(15, 23, 42, 0.78);
  `;

  const codeHeader = document.createElement('div');
  codeHeader.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.12);
    font-size: 10px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.22em;
  `;
  codeHeader.innerHTML = `<span>Linhas numeradas</span><span>${numberedLines.length} linhas</span>`;

  const codeBlock = document.createElement('div');
  codeBlock.style.cssText = `
    margin: 0;
    padding: 14px;
  `;

  numberedLines.forEach(({ number, text }) => {
    const lineRow = document.createElement('div');
    lineRow.style.cssText = `
      display: flex;
      gap: 14px;
      align-items: flex-start;
      padding: 2px 0;
    `;

    const numberCell = document.createElement('span');
    numberCell.style.cssText = `
      width: 34px;
      flex: 0 0 34px;
      color: #64748b;
      text-align: right;
      user-select: none;
      opacity: 0.9;
    `;
    numberCell.textContent = String(number).padStart(String(numberedLines.length).length, ' ');

    const textCell = document.createElement('span');
    textCell.style.cssText = `
      flex: 1;
      white-space: pre-wrap;
      word-break: break-word;
      color: #e2e8f0;
    `;
    textCell.textContent = text || ' ';

    lineRow.appendChild(numberCell);
    lineRow.appendChild(textCell);
    codeBlock.appendChild(lineRow);
  });

  const footer = document.createElement('div');
  footer.style.cssText = `
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    font-size: 10px;
    color: #94a3b8;
  `;
  footer.innerHTML = `
    <span>${siteUrl}</span>
    <span>Exportado em ${timestamp}</span>
  `;

  container.appendChild(header);
  codeShell.appendChild(codeHeader);
  codeShell.appendChild(codeBlock);
  codeShell.appendChild(footer);
  container.appendChild(codeShell);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      backgroundColor: '#1e1e1e',
      scale: 2,
    });

    document.body.removeChild(container);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${algorithmName}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    });

    return { success: true };
  } catch (error) {
    document.body.removeChild(container);
    return { success: false, error: error.message };
  }
}
