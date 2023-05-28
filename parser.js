import { regex, memoFunction, skipSpace, operPres } from "./tools.js";
import { OperatorError, AssignmentError, ParameterError } from "./error.js";
import builtIn from "./builtin.js";
export function parser(program, memo = {}) {
    const id = str => /^-?\d*\.?\d+/.test(str) ? 'num' : /^"[^"]*"/.test(str) ? 'str' : 'name';
    const { identifier, fn, call, oper } = regex;
    program = skipSpace(program); let expr = null, match = null;
    if (!program) return '';
    else if (match = program.match(fn)) { // 1 SUPPORTS FOR FUNCTION DECLARATION
        let [_, name, args] = match;
        args = args.split` `.filter(a => a);
        if ((new Set(args)).size != args.length) throw new ParameterError(`can't declare two pars with the same name`);
        program = skipSpace(program.replace(_, ''));
        if (program[0] == '{') { //1.1 IF FUNCTION IS MULTI-LINE
            const bodyExpr = []; program = program.slice(1);
            memo[name] = { $args: args, nest: {} };
            while (program[0] != '}') {
                if (!program) throw new SyntaxError(`"}" is needed for closing function decalaration`);
                const body = parser(program, memo[name].nest); // RECURSION
                bodyExpr.push(body.expr);
                program = body.program;
            }
            expr = { fn: name, args, body: bodyExpr };
            program = program.slice(1);
        }
        else { //1.2 IF FUNCTION IS SINGLE LINE
            const body = parser(program, memo); // RECURSION
            expr = { fn: name, args, body: body.expr };
            memo[name] = { $args: args };
            program = body.program;
        }
    }
    else if (match = program.match(call)) { // 2 GIVE SURPPORTS TO FUNCTION INVOCATION OR CALL
        if (!(match[1] in builtIn || match[1] in memo)) throw new Error();
        program = skipSpace(program.replace(call, ''));
        const $args = [];
        while (program[0] != ")") {
            const chain = parser(program, memo); // RECURSION
            program = chain.program[0] == ',' ? chain.program.slice(1) : chain.program;
            $args.push(chain.expr);
            if (!program) throw new SyntaxError(`closing parenthesis ")" is missing at ${match[1]} ( ... `);
        }
        program = skipSpace(program.slice(1));
        expr = { call: match[1], $args };
    }
    else if (match = program.match(identifier)) { // 3 LITERAL NUMBERS, IDENTIFIERS AND STRINGS  WITHOUT OPERATORS
        let nameOrVal = match[0];
        program = skipSpace(program.replace(nameOrVal, ''));
        expr = { [id(match)]: nameOrVal };
    }
    else if (match = program.match(/^\(/ /* */)) { // 4 GIVE SUPPORT TO PARENTHESES OR NESTED EXPRESSIONS
        const paren = parser(program.replace(/^-?\(/, ''), memo);
        if (paren.program[0] != ')') throw new SyntaxError('CLOSING PARENTHESIS ")" IS NEEDED');
        if ('fn' in paren.expr) throw new Error(`Can't decalare fn in an expression`);
        expr = { paren: paren.expr };
        program = skipSpace(paren.program.slice(1));
    }
    else if (match = program.match(/^(\[|\{)/)) { //5 GIVE SURPPORT TO ARRAYS AND OBJECTS
        program = skipSpace(program.slice(1));
        const arr = [], obj = {};
        if (match[0] == '[') {
            while (program[0] != ']') {
                const array = parser(program, memo); // RECURSION
                if (operPres(array.expr) == '=') throw new SyntaxError('Unsurpported arr syntax, can\'t use "=" oper in an arr');
                arr.push(array.expr);
                program = array.program[0] == ',' ? skipSpace(array.program.slice(1)) : array.program;
                if (!program) throw new SyntaxError(`"]" is missing at arr expr `);

            }
            expr = { arr };
        } else {
            while (program[0] != '}') {
                const object = parser(program, memo); // RECURSION
                const prop = object.expr.name ?? object.expr.num ?? object.expr.str;
                if (operPres(object.expr) != '$') throw new SyntaxError('Unsurpported object syntax');
                else if (!prop) throw new SyntaxError('Obj property must be a str, num or name');
                else if ([...'$='].includes(operPres(object.expr['$']))) throw new SyntaxError('nested assignment is not supported in obj');
                obj[prop] = object.expr['$'];
                program = object.program[0] == ',' ? skipSpace(object.program.slice(1)) : object.program;
                if (!program) throw new SyntaxError(`"}" is missing at obj expr `);
            }
            expr = { obj };
        }
        program = skipSpace(skipSpace(program).slice(1));
    }
    else if (skipSpace(program).match(oper)) { }// 6 ESCAPE THE ELSE CALUASE IF OPER PRESENT
    else throw new SyntaxError(`${program} not supported`);
    if (match = skipSpace(program).match(oper)) { // GIVE SUPPORTS FOR OPER LINKAGE, CHAIN SUPPORT WHICH WORKS GENERALLY
        program = skipSpace(program.replace(match[0], ''));
        if (!program) throw new SyntaxError(`Right operand is needed for ${match[0]} oper`);
        const chain = parser(program, memo); // RECURSION
        if ('fn' in chain.expr) throw new AssignmentError(`fn decalaration can't be used with any oper`);
        expr = { ...expr, [match[0]]: chain.expr };
        program = chain.program;
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