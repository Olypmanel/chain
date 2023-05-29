import evaluate from "./evaluate.js";
import { globalVars, localVars, operator } from "./tools.js";
import parsedExpressions, { parser } from "./parser.js";
import program from "./program.js";
const execute = program =>
  parsedExpressions(program).forEach(expr => evaluate(expr, localVars, globalVars));
execute(program);
// console.log(operator['==']([12], [12]))
