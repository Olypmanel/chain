import evaluate from "./evaluate.js";
import { globalVars, localVars, memoFunction } from "./tools.js";
import parsedExpressions, { parser } from "./parser.js";
const execute = program =>
  parsedExpressions(program).forEach(expr => console.log(evaluate(expr, localVars, globalVars)));
const program = `
y = 2
x = v = (u = 3 - (3 / 3) * 1)
u
fn avg w z => (w + z) / y
avg 4 (-3) 
b = avg x 8
y = c = t = 5
v = 34
fn add m b => m + b
add 3 4
add 6 6
b = "56"
n = [45]
 v = {b = y}
 v
`;
// execuute(program);
const print = console.log;
execute(program);
