import { transformVisualGSource } from './transform.js';

export async function runVisualG(code, { onWrite, onRead, onClear } = {}) {
  try {
    const transformed = transformVisualGSource(code);

    const runner = new Function(
      '__runtime',
      `
      const { __write, __read, __clear } = __runtime;

      const __formatValue = (value) => {
        if (value === undefined || value === null) return '';
        return String(value);
      };

      const escreva = (...args) => __write(args.map(__formatValue).join(''), false);
      const escreval = (...args) => __write(args.map(__formatValue).join(''), true);
      const limpa = () => __clear();

      async function __leia(name) {
        const prompt = 'Digite ' + name + ': ';
        const input = await __read(prompt);
        if (input === undefined || input === null) return '';
        const num = Number(input);
        if (!Number.isNaN(num) && input !== '') {
          return num;
        }
        return input;
      }

      return (async () => {
        ${transformed}
      })();
    `
    );

    await runner({
      __write: (text, newLine) => {
        if (typeof onWrite === 'function') {
          onWrite(text, newLine);
        }
      },
      __read: async (prompt) => {
        if (typeof onRead === 'function') {
          return onRead(prompt);
        }
        return '';
      },
      __clear: () => {
        if (typeof onClear === 'function') {
          onClear();
        }
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
