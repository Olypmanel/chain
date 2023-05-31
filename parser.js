import { regex, memoFunction, skipSpace, operPres } from "./tools.js";
import { AssignmentError, ParameterError } from "./error.js";
import builtIn from "./builtin.js";
export function parser(program, memo = {}) {
    const id = str => /^-?\d*\.?\d+/.test(str) ? 'num' : /^"[^"]*"/.test(str) ? 'str' : 'name';
    const { numNameStr, fn, call, oper } = regex;
    program = skipSpace(program); let expr = null, match = null;
    if (!program) return '';
    else if (match = program.match(fn)) { // 1 SUPPORTS FOR FUNCTION DECLARATION
        let [_, name, args] = match;
        args = args.split` `.filter(a => a);
        if ((new Set(args)).size != args.length) throw new ParameterError(`can't declare two pars with the same name`);
        program = skipSpace(program.replace(_, ''));
        const body = parser(program, memo); // RECURSION
        if (!body) throw new Error(`fn must have a body`);
        expr = { fn: name, args, body: body.expr.exec ? body.expr.exec : [body.expr] };
        memo[name] = { $args: args };
        program = body.program;
    }
    else if (/^<<</.test(program)) {
        const exec = []; program = skipSpace(program.slice(3));
        while (!(/^>>>/.test(program))) {
            const body = parser(program, memo); // RECURSION
            program = skipSpace(body.program);
            exec.push(body.expr);
        }
        expr = { exec };
        program = program.slice(3);
    }
    else if (match = program.match(call)) { // 2 GIVE SURPPORTS TO FUNCTION INVOCATION OR CALL
        if (!(match[1] in builtIn || match[1] in memo)) throw new Error(`${match[1]} is not fn`);
        program = skipSpace(program.replace(call, ''));
        const $args = [];
        while (program[0] != ")") {
            const chain = parser(program, memo); // RECURSION
            program = chain.program[0] == ',' ? chain.program.slice(1) : chain.program;
            $args.push(chain.expr);
            if (!program) throw new SyntaxError(`closing parenthesis ")" is missing at ${match[1]} ( ... `);
        }
        program = skipSpace(program.slice(1));
        expr = { pres: { call: match[1], $args } };
    }
    else if (numNameStr.test(program) && !/^in\s+/.test(program)) { // 3 LITERAL NUMBERS, IDENTIFIERS AND STRINGS  WITHOUT OPERATORS
        let [m] = program.match(numNameStr);
        program = skipSpace(program.replace(m, ''));
        expr = { [id(m)]: Number.isNaN(+m) ? m : +m };
    }
    else if (match = program.match(/^(\[|\(|\{)/)) { //4 GIVE SURPPORT TO ARRAYS, OBJECTS AND PARENTHESES
        program = skipSpace(program.slice(1));
        const arr = [], obj = {};
        if (match[0] == "(") {
            const paren = parser(program, memo); // RECURSION
            if (paren.program[0] != ')') throw new SyntaxError('CLOSING PARENTHESIS ")" IS NEEDED');
            else if ('fn' in paren.expr) throw new Error(`Can't decalare fn in an expression`);
            expr = { paren: paren.expr };
            program = paren.program;
        }
        else if (match[0] == '[') {
            while (program[0] != ']') {
                const array = parser(program, memo); // RECURSION
                if (!array) throw new SyntaxError(`"]" is missing at arr expr`);
                else if (operPres(array.expr) == '=') throw new SyntaxError(`Unsurpported arr syntax, can't use "=" oper in an arr`);
                arr.push(array.expr);
                program = array.program[0] == ',' ? skipSpace(array.program.slice(1)) : array.program;

            }
            expr = { pres: { arr } };
        } else {
            while (program[0] != '}') {
                const object = parser(program, memo); // RECURSION
                const prop = String(object.expr.name ?? object.expr.num ?? object.expr.str);
                if (operPres(object.expr) != '$') throw new SyntaxError('Unsurpported object syntax');
                else if (!prop) throw new SyntaxError('Obj property must be a str, num or name');
                else if ([...'$='].includes(operPres(object.expr['$']))) throw new SyntaxError('nested assignment is not supported in obj');
                else if (!object) throw new SyntaxError(`"}" is missing at obj expr `);
                obj[(prop).replace(/\"/g, "")] = object.expr['$'];
                program = object.program[0] == ',' ? skipSpace(object.program.slice(1)) : object.program;
            }
            expr = { pres: { obj } };
        }
        program = skipSpace(skipSpace(program).slice(1));
    }
    else if (skipSpace(program).match(oper)) { }// ESCAPE THE ELSE CLAUSE IF OPER PRESENT
    else throw new SyntaxError(`${program} not supported`);
    if (match = skipSpace(program).match(oper)) { // GIVE SUPPORTS FOR OPER LINKAGE. THIS IS TYPICAL OF CHAIN LANGUAGE
        const chain = parser(program.replace(match[0], ''), memo); // RECURSION
        if (!chain) throw new SyntaxError(`Right operand is needed for ${match[0]} oper`);
        if ('fn' in chain.expr) throw new AssignmentError(`fn decalaration can't be used with any oper`);
        program = skipSpace(chain.program);
        expr = { ...expr, [match[0]]: chain.expr };
    }
    return { expr, program };
}
export default function parsedExpressions(programme) {
    const expressions = [];
    while (programme) {
        const { expr, program } = parser(programme, memoFunction);
        expressions.push(expr);
        programme = program;
    }
    return expressions;
};