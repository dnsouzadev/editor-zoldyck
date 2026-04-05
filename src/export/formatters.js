export function formatExportTimestamp(date = new Date()) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

export function normalizeExportCode(code = '') {
    return String(code).replace(/\r\n/g, '\n');
}

export function getNumberedCodeLines(code = '') {
    return normalizeExportCode(code).split('\n').map((line, index) => ({
        number: index + 1,
        text: line,
    }));
}

export function getExportSiteUrl() {
    return typeof window !== 'undefined' && window.location ? window.location.origin : 'https://editor-zoldyck.app';
}
