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
    background: linear-gradient(180deg, #121212 0%, #1a1a1a 100%);
    padding: 28px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: #d4d4d4;
    width: 920px;
    border-radius: 16px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    margin-bottom: 18px;
    padding: 18px 18px 16px;
    border: 1px solid rgba(190, 190, 190, 0.18);
    border-radius: 14px;
    background: rgba(20, 20, 20, 0.72);
  `;
  header.innerHTML = `
    <div style="font-size: 18px; font-weight: 700; color: #e5e5e5; margin-bottom: 8px; letter-spacing: 0.08em; text-transform: uppercase;">
      Editor Zoldyck - Exportação PNG
    </div>
    <div style="font-size: 12px; color: #d4d4d4; margin-bottom: 4px;">
      ${algorithmName}
    </div>
    <div style="font-size: 10px; color: #a3a3a3;">
      Exportado em ${timestamp} • ${siteUrl}
    </div>
  `;

  const codeShell = document.createElement('div');
  codeShell.style.cssText = `
    border: 1px solid rgba(190, 190, 190, 0.16);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(18, 18, 18, 0.78);
  `;

  const codeHeader = document.createElement('div');
  codeHeader.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(190, 190, 190, 0.12);
    font-size: 10px;
    color: #a3a3a3;
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
      color: #8a8a8a;
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
      color: #e5e5e5;
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
    border-top: 1px solid rgba(190, 190, 190, 0.12);
    font-size: 10px;
    color: #a3a3a3;
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
      backgroundColor: '#121212',
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
