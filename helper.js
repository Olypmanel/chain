import { skipSpace, localVars, regex, globalVars } from "./tools.js";
import { operPres } from "./tools.js";
import { parser } from "./parser.js";
import evaluate from "./evaluate.js";
export const parserHelper = (program, deeperExpr, memo) => {
    const id = str => /^-?\d*\.?\d+/.test(str) ? 'num' : /^"[^"]*"/.test(str) ? 'str' : 'name';
    const { exp, brac1 } = regex;
    while (program.match(/^[\-+*/%=^]/)) {
        let p = program; let match;
        if (match = program.match(exp)) {
            const [_, oper, value] = match;
            if (value in localVars) {
                const chain = parser(program.replace(oper, ''), memo);
                deeperExpr[oper] = chain.expr;
                program = chain.program;
            } else {
                deeperExpr[oper] = { [id(value)]: value };
                deeperExpr = deeperExpr[oper];
                program = skipSpace(program.replace(_, ''));
            }

        }
        if (match = program.match(brac1)) {
            const [_, oper] = match;
            const paren = parser(skipSpace(program.replace(_, '')), memo);
            if ('fn' in paren.expr) throw new Error(``);
            deeperExpr[oper] = { paren: paren.expr };
            deeperExpr = deeperExpr[oper];
            if (paren.program[0] != ')') throw new SyntaxError('CLOSING PARENTHESIS ")" IS NEEDED');
            program = skipSpace(paren.program.slice(1));
        }
        if (p == program) throw new SyntaxError(`${p} IS NOT A VALID SYNTAX`);
        p = program;
    }
    return { deeperExpr, program };
};
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