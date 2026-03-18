import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

export default function Console({
  entries,
  isWaitingInput,
  inputPrompt,
  onSubmitInput,
  className,
}) {
  const inputRef = useRef(null);
  const consoleEndRef = useRef(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, isWaitingInput]);

  useEffect(() => {
    if (isWaitingInput) {
      inputRef.current?.focus();
    }
  }, [isWaitingInput]);

  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (!onSubmitInput || !inputRef.current) return;
    const value = inputRef.current.value;
    onSubmitInput(value);
    inputRef.current.value = '';
  };

  return (
    <div className={cn("h-full bg-card p-4 overflow-y-auto font-mono text-xs md:text-sm", className)}>
      <div className="flex flex-col gap-1">
        {entries.map((item) => (
          <div
            key={item.id}
            className={cn(
              "leading-relaxed break-words whitespace-pre-wrap border-b border-dashed border-foreground/20 py-1",
              item.type === 'error' && "text-destructive font-semibold bg-destructive/10 px-2",
              item.type === 'input' && "text-primary font-semibold px-2",
              item.type === 'output' && "text-foreground/95"
            )}
          >
            {item.text}
            {item.newLine !== false && <br />}
          </div>
        ))}
        {isWaitingInput && (
          <form onSubmit={handleInputSubmit} className="flex flex-wrap items-center gap-2 mt-3 border-2 border-foreground px-3 py-2">
            <span className="text-muted-foreground shrink-0 font-semibold uppercase tracking-[0.2em] text-[10px]">
              {inputPrompt}
            </span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 min-w-[120px] bg-background border border-input px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm font-mono"
            />
          </form>
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}
