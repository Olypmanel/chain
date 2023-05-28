import evaluate from './evaluate.js';
import { globalVars, localVars } from './tools.js';
const builtIn = Object.create(null);
builtIn.while = (condition, executions) => {
    while (evaluate(condition, localVars, globalVars)) evaluate(executions, localVars, globalVars);
};
builtIn.print = (expr) => {
    for (const exp in expr) console.log(evaluate(expr[exp], localVars, globalVars));
};
export default builtIn


