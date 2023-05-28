import evaluate from "./evaluate.js";
import { globalVars, localVars, memoFunction, operator } from "./tools.js";
import parsedExpressions, { parser } from "./parser.js";
import builtIn from "./builtin.js";
import program from "./program.js";
const print = console.log;
const execute = program =>
  parsedExpressions(program).forEach(expr => evaluate(expr, localVars, globalVars));
execute(program);