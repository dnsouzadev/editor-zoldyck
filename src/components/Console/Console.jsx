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
    <div className="h-full bg-muted/30 p-3 overflow-y-auto font-mono text-sm">
      <div className="flex flex-col gap-0.5">
        {output.map((item, index) => (
          <div key={index} className={cn(
            "leading-relaxed",
            item.type === 'error' && "text-destructive font-semibold",
            item.type === 'input' && "text-primary",
            item.type === 'output' && "text-foreground"
          )}>
            {item.text}
            {item.newLine !== false && <br />}
          </div>
        ))}
        {isWaitingInput && (
          <form onSubmit={handleInputSubmit} className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">{inputPrompt}</span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-background border border-input px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
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
