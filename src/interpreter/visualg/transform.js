const TYPE_KEYWORDS = ['inteiro', 'real', 'cadeia', 'caractere', 'logico', 'lógico', 'booleano'];
const TYPE_REGEX = new RegExp(`\\b(?:${TYPE_KEYWORDS.join('|')})\\b`, 'gi');

function detectAsyncFunctions(source) {
  const asyncSet = new Set();
  const regex = /funcao\s+(?:(?:[A-Za-zÁ-ú_]\w*)\s+)?([A-Za-z_]\w*)\s*\([^)]*\)\s*\{/gi;
  let match;

  while ((match = regex.exec(source)) !== null) {
    const name = match[1];
    let braceCount = 1;
    let index = regex.lastIndex;

    while (index < source.length && braceCount > 0) {
      const char = source[index];
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      index++;
    }

    const body = source.slice(regex.lastIndex, index - 1);
    if (/leia\s*\(/i.test(body)) {
      asyncSet.add(name.toLowerCase());
    }
    regex.lastIndex = index;
  }

  asyncSet.add('inicio');
  return asyncSet;
}

function transformParams(params) {
  if (!params || !params.trim()) return '';

  return params
    .split(',')
    .map((param) => param.replace(TYPE_REGEX, '').trim())
    .filter(Boolean)
    .map((param) => {
      const parts = param.split(/\s+/).filter(Boolean);
      return parts[parts.length - 1];
    })
    .join(', ');
}

function transformVarDeclarations(source) {
  return source.replace(
    /^\s*(inteiro|real|cadeia|caractere|logico|lógico|booleano)\s+([^;\n{}]+)/gim,
    (_match, _type, rest) => {
      const cleaned = rest.replace(TYPE_REGEX, '').replace(/\s+/g, ' ').trim();
      const normalized = cleaned.replace(/\s*,\s*/g, ', ');
      return normalized ? `let ${normalized};` : '';
    }
  );
}

function convertLeiaCalls(source) {
  return source.replace(/leia\s*\(([^)]+)\)/gi, (match, args, offset, full) => {
    const indentMatch = full.slice(0, offset).match(/(^|\n)([ \t]*)$/);
    const indent = indentMatch ? indentMatch[2] : '';
    const targets = args
      .split(',')
      .map((target) => target.trim())
      .filter(Boolean);

    const statements = targets
      .map((target, index) => `${index === 0 ? '' : indent}${target} = await __leia("${target}")`)
      .join(';\n');

    return statements ? `${statements};` : '';
  });
}

export function transformVisualGSource(code) {
  let output = code.replace(/\r\n/g, '\n');
  const asyncFunctions = detectAsyncFunctions(output);

  output = output.replace(/\bprograma\b/gi, '');
  output = output.replace(/\bretorne\b/gi, 'return');
  output = output.replace(/\bverdadeiro\b/gi, 'true');
  output = output.replace(/\bfalso\b/gi, 'false');
  output = output.replace(/\bpara\s*\(/gi, 'for (');
  output = output.replace(/\benquanto\b/gi, 'while');

  output = output.replace(
    /funcao\s+(?:(?:[A-Za-zÁ-ú_]\w*)\s+)?([A-Za-z_]\w*)\s*\(([^)]*)\)/gi,
    (match, name, params) => {
      const paramList = transformParams(params);
      const asyncKeyword = asyncFunctions.has(name.toLowerCase()) ? 'async ' : '';
      return `${asyncKeyword}function ${name}(${paramList})`;
    }
  );

  output = transformVarDeclarations(output);
  output = convertLeiaCalls(output);

  // O código VisualG geralmente vem encapsulado em `programa { ... }`.
  // Depois de remover `programa`, removemos o bloco externo para que
  // `inicio` fique no escopo acessível ao bootstrap final.
  const trimmed = output.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    output = trimmed.slice(1, -1);
  }

  const finalCode = `
${output}

if (typeof inicio === 'function') {
  await inicio();
}
`.trim();

  return finalCode;
}
