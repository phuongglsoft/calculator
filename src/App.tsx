import { useState } from 'react';
import { getLocalStorageData, setLocalStorage } from './utils/local-storage';

const localStorageKey = 'LC';

enum Theme {
  Light,
  Dark
}

const operators = {
  add: '+',
  minus: '-',
  multiply: '*',
  divide: '/',
  empty: ''
} as const

type OperatorValues = (typeof operators)[keyof typeof operators];

function App() {
  const [result, setResult] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const [operator, setOperator] = useState<OperatorValues>('');
  const [input, setInput] = useState<string>('');
  const [calculated, setCalculated] = useState(false);

  function handleNumberClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (calculated && !operator) {
      setResult((e.target as HTMLButtonElement).name);
      setCalculated(false);
    }
    else if (!operator) {
      setResult(prev => prev + (e.target as HTMLButtonElement).name);
    }
    else {
      setInput(prev => prev + (e.target as HTMLButtonElement).name);
    }
  }

  function handleMPlusClick() {
    const data = getLocalStorageData<string>(localStorageKey);
    const newValue = calculateResult();
    const existingValue = data ? parseFloat(data) : 0;
    const updatedValue = existingValue + newValue;
    setResult(updatedValue.toString());
    setLocalStorage(localStorageKey, JSON.stringify(updatedValue));
    setOperator('');
    setInput('');
  }

  function handleMMinusClick() {
    const data = getLocalStorageData<string>(localStorageKey);
    const existingValue = data ? parseFloat(data) : 0;
    const newValue = calculateResult();
    const updatedValue = existingValue - newValue;
    setLocalStorage(localStorageKey, JSON.stringify(updatedValue));
    setResult(updatedValue.toString());
  }

  function handleMCClick() {
    setLocalStorage(localStorageKey, JSON.stringify(0));
  }

  function calculateResult() {
    const inputNum = input ? parseFloat(input) : 0;
    const prevNum = result ? parseFloat(result) : 0;
    let calculatedVal = 0;

    switch (operator) {
      case '+': calculatedVal = prevNum + inputNum; break;
      case '-': calculatedVal = prevNum - inputNum; break;
      case '*': calculatedVal = prevNum * inputNum; break;
      case '/': calculatedVal = prevNum / inputNum; break;
      default: calculatedVal = prevNum;
    }

    return calculatedVal;
  }

  function handleEqualClick() {
    if (result || input) {
      setResult(calculateResult().toString());
    }
    setOperator('');
    setInput('');
    setCalculated(true);
  }

  function toggleTheme() {
    setTheme(prevTheme => {
      if (prevTheme === Theme.Dark) {
        return Theme.Light;
      }
      return Theme.Dark;
    })
  }

  function handleClear() {
    setResult('');
    setInput('');
    setOperator('');
  }

  function handleOperatorClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (input) {
      const inputNum = parseFloat(input);
      setResult((prev) => {
        const prevNum = parseFloat(prev);
        let calculatedVal = 0;
        switch (operator) {
          case '+': calculatedVal = prevNum + inputNum; break;
          case '-': calculatedVal = prevNum - inputNum; break;
          case '*': calculatedVal = prevNum * inputNum; break;
          case '/': calculatedVal = prevNum / inputNum; break;
          default: calculatedVal = prevNum;
        }
        return calculatedVal.toString();
      })
      setInput('');
    }
    setOperator((e.target as HTMLButtonElement).name as OperatorValues);
  }

  return (
    <div className={`calculator ${theme === Theme.Dark && 'dark-theme'}`}>
      <div className='title-container'>
        <h2>Calculator</h2>
        <label className="switch">
          <input type="checkbox" checked={theme === Theme.Dark} onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </div>
      <div className='calculation-container'>
        <div className='output'>{result}{operator}</div>
        <div className='input'>{input}</div>
      </div>
      <div className='buttons-container grid'>
        <button onClick={handleMCClick}>MC</button>
        <button onClick={handleMPlusClick}>M+</button>
        <button onClick={handleMMinusClick}>M-</button>
        <button name='/' onClick={handleOperatorClick} className='dark'>/</button>
        <button name='7' onClick={handleNumberClick}>7</button>
        <button name='8' onClick={handleNumberClick}>8</button>
        <button name='9' onClick={handleNumberClick}>9</button>
        <button name='*' onClick={handleOperatorClick} className='dark'>*</button>
        <button name='4' onClick={handleNumberClick}>4</button>
        <button name='5' onClick={handleNumberClick}>5</button>
        <button name='6' onClick={handleNumberClick}>6</button>
        <button name='-' onClick={handleOperatorClick} className='dark'>-</button>
        <button name='1' onClick={handleNumberClick}>1</button>
        <button name='2' onClick={handleNumberClick}>2</button>
        <button name='3' onClick={handleNumberClick}>3</button>
        <button name='+' onClick={handleOperatorClick} className='dark'>+</button>
        <button name='.' onClick={handleNumberClick}>.</button>
        <button name='0' onClick={handleNumberClick}>0</button>
        <button name='C' onClick={handleClear}>C</button>
        <button onClick={handleEqualClick} className='dark' >=</button>
      </div>
    </div>
  )
}

export default App
