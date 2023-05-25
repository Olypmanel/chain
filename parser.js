import { regex, memoFunction, skipSpace, operPres } from "./tools.js";
import { parserHelper } from "./helper.js";
import { ParameterError } from "./error.js";
export function parser(program, memo = {}) {
    const id = str => /^-?\d*\.?\d+/.test(str) ? 'num' : /^"[^"]*"/.test(str) ? 'str' : 'name';
    const { one, identifier, fn } = regex;
    program = skipSpace(program); let expr = null, match = null;
    if (!program) return '';
    else if (match = program.match(fn)) { // SUPPORTS FOR FUNCTION DECLARATION
        let [_, name, args] = match;
        args = args.split` `.filter(a => a);
        if ((new Set(args)).size != args.length) throw new ParameterError(`can't declare two pars with the same name`);
        program = skipSpace(program.replace(_, ''));
        if (program[0] == '{') { // IF FUNCTION IS MULTI-LINE
            const bodyExpr = []; program = program.slice(1);
            memo[name] = { $args: args, nest: {} };
            while (program[0] != '}') {
                if (!program) throw new SyntaxError(`"}" is needed for closing function decalaration`);
                const body = parser(program, memo[name].nest);
                bodyExpr.push(body.expr);
                program = body.program;
            }
            expr = { fn: name, args, body: bodyExpr };
            program = program.slice(1);
        }
        else { // IF FUNCTION IS SINGLE LINE
            const body = parser(program, memo);
            expr = { fn: name, args, body: body.expr };
            memo[name] = { $args: args };
            program = body.program;
        }
    }
    else if (match = program.match(identifier)) {
        const [_, iden, oper] = match;
        program = program.replace(_, '');
        const deeperExpr = parser(program, memo);
        if ('fn' in deeperExpr.expr) throw new SyntaxError("Can't use fn as a value");
        expr = { [id(iden)]: iden, [oper]: deeperExpr.expr };
        program = deeperExpr.program;
    }
    else if (match = program.match(one)) {
        let nameOrVal = match[0];
        program = skipSpace(program.replace(nameOrVal, ''));
        if (nameOrVal in memo) { // FUNCTION INVOCATION 
            let argslen = memo[nameOrVal].$args.length;
            const argsArr = [];
            for (argslen; argslen >= 1; argslen--) {
                const args = parser(program);
                if (args.expr === undefined) throw new Error(`Inconstitent par and args`);
                argsArr.push(args.expr);
                program = args.program;
            }
            expr = { call: nameOrVal, args: argsArr };
        } else expr = { [id(match)]: nameOrVal };
    }
    else if (/^\(/.test(program)) { // GIVE SUPPORT TO PARENTHESES OR NESTED EXPRESSIONS
        const paren = parser(program.slice(1));
        if (paren.program[0] != ')') throw new SyntaxError('CLOSING PARENTHESIS ")" IS NEEDED');
        if ('fn' in paren.expr) throw new Error(`Can't decalare fn in an expression`);
        expr = { paren: paren.expr };
        program = skipSpace(paren.program.slice(1));
        program = parserHelper(program, expr).program;
    }
    else if (match = program.match(/^(\[|\{)/)) { // GIVE SURPPORT TO ARRAYS AND OBJECTS
        program = skipSpace(program.replace(match[0], ''));
        const arr = [], obj = {};
        if (match[0].includes('[')) {
            while (program[0] != ']') {
                const array = parser(program);
                if (operPres(array.expr) == '=') throw new SyntaxError('Unsurpported arr syntax, can\'t use "=" oper in an arr');
                arr.push(array.expr);
                program = array.program[0] == ',' ? skipSpace(array.program.slice(1)) : array.program;
            }
            expr = { arr };
        } else {
            while (program[0] != '}') {
                const object = parser(program);
                const prop = object.expr.name ?? object.expr.num ?? object.expr.str;
                if (operPres(object.expr) != '=') throw new SyntaxError('Unsurpported object syntax');
                else if (!prop) throw new SyntaxError('Obj property must be a str, num or name');
                else if (operPres(object.expr['=']) == '=') throw new SyntaxError('nested assignment is not supported in obj');
                obj[prop] = object.expr['='];
                program = object.program[0] == ',' ? skipSpace(object.program.slice(1)) : object.program;
            }
            expr = { obj };
        }
        program = skipSpace(program).slice(1);
    }
    else throw new SyntaxError(`${program} IS NOT A VALID SYNTAX`);
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