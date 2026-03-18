import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

const Console = forwardRef(({ onInput }, ref) => {
  const [output, setOutput] = useState([]);
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const inputRef = useRef(null);
  const consoleEndRef = useRef(null);
  const inputResolverRef = useRef(null);

  useImperativeHandle(ref, () => ({
    write(text, newLine = true) {
      setOutput(prev => [...prev, { type: 'output', text, newLine }]);
      setTimeout(() => consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    },
    
    writeError(text) {
      setOutput(prev => [...prev, { type: 'error', text }]);
      setTimeout(() => consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    },
    
    async read(prompt = 'Digite: ') {
      return new Promise((resolve) => {
        setInputPrompt(prompt);
        setIsWaitingInput(true);
        inputResolverRef.current = resolve;
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    },
    
    clear() {
      setOutput([]);
      setIsWaitingInput(false);
      setInputPrompt('');
    },
  }));

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    
    setOutput(prev => [...prev, { type: 'input', text: `${inputPrompt}${value}` }]);
    
    if (inputResolverRef.current) {
      inputResolverRef.current(value);
      inputResolverRef.current = null;
    }
    
    setIsWaitingInput(false);
    setInputPrompt('');
    inputRef.current.value = '';
  };

  return (
    <div className="h-full bg-card p-4 overflow-y-auto font-mono text-xs md:text-sm">
      <div className="flex flex-col gap-1">
        {output.map((item, index) => (
          <div key={index} className={cn(
            "leading-relaxed break-words whitespace-pre-wrap border-b border-dashed border-foreground/20 py-1",
            item.type === 'error' && "text-destructive font-semibold bg-destructive/10 px-2",
            item.type === 'input' && "text-primary font-semibold px-2",
            item.type === 'output' && "text-foreground/95"
          )}>
            {item.text}
            {item.newLine !== false && <br />}
          </div>
        ))}
        {isWaitingInput && (
          <form onSubmit={handleInputSubmit} className="flex flex-wrap items-center gap-2 mt-3 border-2 border-foreground px-3 py-2">
            <span className="text-muted-foreground shrink-0 font-semibold uppercase tracking-[0.2em] text-[10px]">{inputPrompt}</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 min-w-[120px] bg-background border border-input px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm font-mono"
              autoFocus
            />
          </form>
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
});

Console.displayName = 'Console';

export default Console;
