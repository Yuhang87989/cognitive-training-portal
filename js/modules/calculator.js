// ============================================================
// 版本: V144
// 计算器模块
// ============================================================

let calculatorDisplay = '0';
let calculatorFirstNum = null;
let calculatorOperator = null;
let calculatorWaitingForSecondNum = false;

function renderCalculator(container) {
    container.innerHTML = `
        <div class="card" style="max-width:360px;margin:0 auto;">
            <h3 style="text-align:center;margin-bottom:16px;">🧮 计算器</h3>
            
            <div style="background:#1e1e1e;border-radius:12px;padding:20px;margin-bottom:16px;">
                <div id="calc-display" style="color:#0f0;font-family:monospace;font-size:36px;text-align:right;padding:10px;overflow:hidden;text-overflow:ellipsis;">${calculatorDisplay}</div>
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
                <button onclick="window.calcInput('C')" style="padding:20px;background:#ff6b6b;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">C</button>
                <button onclick="window.calcInput('±')" style="padding:20px;background:#667eea;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">±</button>
                <button onclick="window.calcInput('%')" style="padding:20px;background:#667eea;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">%</button>
                <button onclick="window.calcInput('÷')" style="padding:20px;background:#ffa502;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">÷</button>
                
                <button onclick="window.calcInput('7')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">7</button>
                <button onclick="window.calcInput('8')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">8</button>
                <button onclick="window.calcInput('9')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">9</button>
                <button onclick="window.calcInput('×')" style="padding:20px;background:#ffa502;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">×</button>
                
                <button onclick="window.calcInput('4')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">4</button>
                <button onclick="window.calcInput('5')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">5</button>
                <button onclick="window.calcInput('6')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">6</button>
                <button onclick="window.calcInput('-')" style="padding:20px;background:#ffa502;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">-</button>
                
                <button onclick="window.calcInput('1')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">1</button>
                <button onclick="window.calcInput('2')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">2</button>
                <button onclick="window.calcInput('3')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">3</button>
                <button onclick="window.calcInput('+')" style="padding:20px;background:#ffa502;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">+</button>
                
                <button onclick="window.calcInput('0')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;grid-column:span 2;">0</button>
                <button onclick="window.calcInput('.')" style="padding:20px;background:#f1f2f6;color:#333;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">.</button>
                <button onclick="window.calcInput('=')" style="padding:20px;background:#2ed573;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;">=</button>
            </div>
            
            <button onclick="history.back()" style="margin-top:20px;width:100%;padding:12px 24px;background:#f5f5f5;color:#666;border:none;border-radius:8px;font-size:14px;cursor:pointer;">← 返回</button>
        </div>
    `;
}

function calcInput(value) {
    const display = document.getElementById('calc-display');
    
    switch(value) {
        case 'C':
            calculatorDisplay = '0';
            calculatorFirstNum = null;
            calculatorOperator = null;
            calculatorWaitingForSecondNum = false;
            break;
        case '±':
            calculatorDisplay = (parseFloat(calculatorDisplay) * -1).toString();
            break;
        case '%':
            calculatorDisplay = (parseFloat(calculatorDisplay) / 100).toString();
            break;
        case '=':
            if (calculatorOperator && calculatorFirstNum !== null) {
                const secondNum = parseFloat(calculatorDisplay);
                let result;
                switch(calculatorOperator) {
                    case '+': result = calculatorFirstNum + secondNum; break;
                    case '-': result = calculatorFirstNum - secondNum; break;
                    case '×': result = calculatorFirstNum * secondNum; break;
                    case '÷': result = secondNum !== 0 ? calculatorFirstNum / secondNum : 'Error'; break;
                }
                calculatorDisplay = result.toString();
                calculatorFirstNum = null;
                calculatorOperator = null;
                calculatorWaitingForSecondNum = false;
            }
            break;
        case '+':
        case '-':
        case '×':
        case '÷':
            calculatorFirstNum = parseFloat(calculatorDisplay);
            calculatorOperator = value;
            calculatorWaitingForSecondNum = true;
            break;
        case '.':
            if (!calculatorDisplay.includes('.')) {
                calculatorDisplay += '.';
            }
            break;
        default: // 数字
            if (calculatorWaitingForSecondNum) {
                calculatorDisplay = value;
                calculatorWaitingForSecondNum = false;
            } else {
                calculatorDisplay = calculatorDisplay === '0' ? value : calculatorDisplay + value;
            }
    }
    
    if (display) {
        display.textContent = calculatorDisplay;
    }
}

// 导出到window，供onclick调用
window.renderCalculator = renderCalculator;
window.calcInput = calcInput;

// ============================================================
// V270: 传统方式加载，移除ES6 export
// ============================================================
