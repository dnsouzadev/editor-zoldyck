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
    <div className="h-full bg-gradient-to-br from-muted/40 via-muted/30 to-background/50 p-4 overflow-y-auto font-mono text-xs md:text-sm backdrop-blur-sm">
      <div className="flex flex-col gap-1">
        {output.map((item, index) => (
          <div key={index} className={cn(
            "leading-relaxed break-words whitespace-pre-wrap px-1 py-0.5 rounded transition-colors",
            item.type === 'error' && "text-destructive font-semibold bg-destructive/5 border-l-2 border-destructive pl-2",
            item.type === 'input' && "text-primary font-medium bg-primary/5 border-l-2 border-primary pl-2",
            item.type === 'output' && "text-foreground/95"
          )}>
            {item.text}
            {item.newLine !== false && <br />}
          </div>
        ))}
        {isWaitingInput && (
          <form onSubmit={handleInputSubmit} className="flex flex-wrap items-center gap-2 mt-2 bg-accent/10 p-2 rounded-lg border border-accent/20">
            <span className="text-muted-foreground shrink-0 font-medium">{inputPrompt}</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 min-w-[120px] bg-background/80 border border-input px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm font-mono transition-all"
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
