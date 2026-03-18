import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './Console.css';

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
    
    // Adicionar input ao console
    setOutput(prev => [...prev, { type: 'input', text: `${inputPrompt}${value}` }]);
    
    // Resolver a promise
    if (inputResolverRef.current) {
      inputResolverRef.current(value);
      inputResolverRef.current = null;
    }
    
    // Resetar estado
    setIsWaitingInput(false);
    setInputPrompt('');
    inputRef.current.value = '';
  };

  return (
    <div className="console">
      <div className="console-output">
        {output.map((item, index) => (
          <div key={index} className={`console-line console-${item.type}`}>
            {item.text}
            {item.newLine !== false && <br />}
          </div>
        ))}
        {isWaitingInput && (
          <form onSubmit={handleInputSubmit} className="console-input-form">
            <span className="input-prompt">{inputPrompt}</span>
            <input
              ref={inputRef}
              type="text"
              className="console-input"
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
