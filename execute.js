import evaluate from "./evaluate.js";
import { globalVars, localVars, memoFunction } from "./tools.js";
import parsedExpressions from "./parser.js";
const execuute = program =>
    parsedExpressions(program).forEach(expr => console.log(evaluate(expr)));
const program = `
y = 34
x = y = (56 - 43 * (10 + 2))
fn avg w z => (w + z) / y
avg 4 (-3) 
avg 7 8 -  4
 y = c = t = 5
`;
execuute(program);
const print = console.log;
print(localVars);