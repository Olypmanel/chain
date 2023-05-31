import evaluate from "./evaluate.js";
import { globalVars, localVars } from "./tools.js";
import parsedExpressions from "./parser.js";
import program from "./program.js";
const execute = (parsedExpr, l = localVars, g = globalVars) => parsedExpr.forEach(expr => evaluate(expr, l, g));
execute(parsedExpressions(program));
