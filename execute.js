import evaluate from "./evaluate.js";
import { globalVars, localVars, memoFunction, operator } from "./tools.js";
import parsedExpressions, { parser } from "./parser.js";
import fs from 'fs';
const execute = program =>
  parsedExpressions(program).forEach(expr => console.log(evaluate(expr, localVars, globalVars)));
const runProgram = async program => {
  let str = '';
  const streams = fs.createReadStream(program, { encoding: "utf-8" });
  for await (const chunck of streams) str += chunck;
  return str;
};
runProgram('program.txt').then(execute);