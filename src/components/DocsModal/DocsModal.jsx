import { BookOpenCheck, X } from 'lucide-react';
import { Button } from '../ui/button';

const COMMAND_SECTIONS = [
  {
    title: 'Entrada / Saída',
    commands: [
      { name: 'escreva(...valores)', description: 'Imprime todos os valores na mesma linha.' },
      { name: 'escreval(...valores)', description: 'Imprime os valores e pula para a próxima linha.' },
      { name: 'mensagem(texto)', description: 'Atalho VisualG que usa escreval internamente.' },
    ],
  },
  {
    title: 'Entrada de dados',
    commands: [
      { name: 'leia(variável)', description: 'Pede ao usuário um valor e atribui na variável informada.' },
      { name: 'limpa()', description: 'Limpa o console antes de continuar a execução.' },
    ],
  },
  {
    title: 'Estruturas condicionais',
    commands: [
      { name: 'se (<condição>) então ... fimse', description: 'Executa o bloco somente quando a condição é verdadeira.' },
      { name: 'se ... senão ... fimse', description: 'Adiciona um bloco alternativo quando a condição é falsa.' },
    ],
  },
  {
    title: 'Laços',
    commands: [
      { name: 'para (início; condição; passo) { ... }', description: 'Laço tradicional (VisualG). Também aceita sintaxe PARA/DE/ATÉ/PASSO no pseudocódigo.' },
      { name: 'enquanto (<condição>) faça ... fimenquanto', description: 'Repete enquanto a condição permanecer verdadeira.' },
      { name: 'repita ... até <condição>', description: 'Executa ao menos uma vez e para quando a condição torna-se verdadeira.' },
    ],
  },
  {
    title: 'Funções e procedimentos',
    commands: [
      { name: 'funcao tipo nome(parâmetros) { ... }', description: 'Define uma função. Use retorne valor para devolver um resultado.' },
      { name: 'procedimento nome(...)', description: 'Procedimento sem retorno (mesma ideia de função void).' },
      { name: 'programa { funcao inicio() { ... } }', description: 'Estrutura padrão VisualG. O bloco inicio é executado automaticamente.' },
    ],
  },
  {
    title: 'Tipos básicos',
    commands: [
      { name: 'inteiro, real, cadeia, caractere, logico', description: 'Tipos primitivos aceitos nas declarações e parâmetros.' },
      { name: 'verdadeiro / falso', description: 'Constantes booleanas.' },
    ],
  },
  {
    title: 'Operadores úteis',
    commands: [
      { name: '<-, =', description: 'Atribuição (pseudocódigo usa <-, VisualG aceita =).' },
      { name: 'e / ou / nao', description: 'Operadores lógicos AND, OR e NOT.' },
      { name: 'mod', description: 'Resto da divisão inteira.' },
      { name: '+ - * / ^ %', description: 'Operadores aritméticos comuns.' },
    ],
  },
];

export default function DocsModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-surface-bright w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-surface-high">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold uppercase tracking-[0.3em] font-display">Referência rápida</h2>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-display">Comandos suportados</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-none bg-surface-highest hover:bg-foreground hover:text-background transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {COMMAND_SECTIONS.map((section) => (
            <section key={section.title} className="p-4 rounded-none bg-surface-base">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground mb-3 font-display">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.commands.map((command) => (
                  <div key={command.name} className="grid md:grid-cols-3 gap-2 items-start">
                    <code className="md:col-span-1 font-mono text-xs bg-surface-low px-2 py-1 inline-block">
                      {command.name}
                    </code>
                    <p className="md:col-span-2 text-sm text-foreground/90">
                      {command.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="px-5 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] uppercase tracking-[0.2em] bg-surface-high font-display">
          <span className="text-muted-foreground">
            Compatível com modos Pseudocódigo e VisualG
          </span>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-none border-0 bg-foreground text-background px-6 py-2 hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
