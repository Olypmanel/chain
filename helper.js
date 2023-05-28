import { skipSpace, localVars, regex, globalVars } from "./tools.js";
import { operPres } from "./tools.js";
import { parser } from "./parser.js";
import evaluate from "./evaluate.js";
export const evaluatorHelper = (expr, local, global, params, math) => {
    if (operPres(expr) == '=' && !expr.name) throw new SyntaxError(`${expr.num} IS NOT A VALID IDENTIFIER`);
    if ('num' in expr) math.push(expr.num);
    else if ('str' in expr) math.push(expr.str);
    else if ('name' in expr) {
        if (expr.name in params || expr.name in global) math.push(params[expr.name] || global[expr.name] || 0);
        else throw new Error(`Invalid identifier. No variable with name '${expr.name}' was found.`);
    }
    else if ('paren' in expr) math.push(evaluate(expr.paren, local, global, params)); // RECURSION
    if ('call' in expr) math.push(evaluate(expr, local, global, params)); // RECURSION
    else if ('arr' in expr) math.push(evaluate(expr, local, global, params)); // RECURSION
    else if ('obj' in expr) math.push(evaluate(expr, local, global, params)); // RECURSION
    operPres(expr) && math.push(operPres(expr));
    return expr[operPres(expr)];
};