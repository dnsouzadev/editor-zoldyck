// Módulo de exportação para imagem (PNG)
import html2canvas from 'html2canvas';

export async function exportToImage(code, algorithmName = 'algoritmo') {
  const siteUrl = typeof window !== 'undefined' && window.location ? window.location.origin : 'https://editor-zoldyck.app';
  // Criar elemento temporário com o código
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    background: #1e1e1e;
    padding: 30px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: #d4d4d4;
    width: 800px;
    border-radius: 8px;
  `;

  // Criar cabeçalho
  const header = document.createElement('div');
  header.style.cssText = `
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #569CD6;
  `;
  header.innerHTML = `
    <div style="font-size: 18px; font-weight: bold; color: #569CD6; margin-bottom: 8px;">
      Editor Zoldyck
    </div>
    <div style="font-size: 12px; color: #858585;">
      ${algorithmName} • ${new Date().toLocaleDateString('pt-BR')}
    </div>
    <div style="font-size: 11px; color: #a5a5a5; margin-top: 6px;">
      ${siteUrl}
    </div>
  `;

  // Criar área de código
  const codeBlock = document.createElement('pre');
  codeBlock.style.cssText = `
    margin: 0;
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
      backgroundColor: '#1e1e1e',
      scale: 2, // Melhor qualidade
    });

    // Remover elemento temporário
    document.body.removeChild(container);

    // Fazer download
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
