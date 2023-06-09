import { operPres } from "./tools.js";
import evaluate from "./evaluate.js";
const pr = console.log
export const evaluatorHelper = (expr, local, global, math) => {
    if ('num' in expr) math.push(expr.num);
    else if ('str' in expr) math.push(expr.str);
    else if ('name' in expr) {
        if (  expr.name in global) math.push( global[expr.name] || 0);
        else throw new Error(`Invalid identifier. No variable with name '${expr.name}' was found.`);
    }
    else if ('paren' in expr) math.push(evaluate(expr.paren, local, global)); // RECURSION
    else if ('pres' in expr) math.push(evaluate(expr.pres, local, global)); // RECURSION
    else if ('call' in expr) math.push(evaluate(expr, local, global)); // RECURSION
    else if ('arr' in expr) math.push(evaluate(expr, local, global)); // RECURSION
    else if ('obj' in expr) math.push(evaluate(expr, local, global)); // RECURSION
    else if ('exec' in expr) expr.exec.forEach(exec => evaluate(exec, local, global)); // RECURSION
    operPres(expr) && math.push(operPres(expr));
    return expr[operPres(expr)];
};