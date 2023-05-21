import { regex, memoFunction, skipSpace } from "./tools.js";
import { parserHelper } from "./helper.js";
import { ParameterError } from "./error.js";
export function parser(program) {
    const id = str => /^-?\d*\.?\d+/.test(str) ? 'num' : /^"[^"]*"/.test(str) ? 'str' : 'name';
    const { one, three, three1, brac2, fn } = regex;
    program = skipSpace(program); let expr = null, match = null;
    if (!program) return '';
    else if (match = program.match(fn)) {
        let [_, name, args] = match; args = args.split` `.filter(a => a);

        if ((new Set(args)).size != args.length) throw new ParameterError(`can't declare two pars with the same name`);
        program = skipSpace(program.replace(_, ''));

        const body = parser(program);
        expr = { fn: name, args, body: body.expr };
        memoFunction[name] = args;
        program = body.program;
    }
    else if (match = (program.match(three) || program.match(three1))) {
        const [_, iden, oper, value] = match;
        if (oper == '=' && iden in memoFunction) throw new Error(`${iden} IS ALREADY DECLARED AS A FUNTION`);
        else if (iden in memoFunction) {
            program = skipSpace(program.replace(iden, ''));
            let argslen = memoFunction[iden].length;
            const argsArr = [];
            for (argslen; argslen >= 1; argslen--) {
                const args = parser(program);
                argsArr.push(args.expr);
                program = args.program;
                expr = { call: iden, args: argsArr };
            }
        }
        else {
            if (value in memoFunction) {
                const call = parser(program.replace(program.slice(0, _.length - value.length), ''));
                program = call.program;
                expr = { [id(iden)]: iden, [oper]: call.expr };

            } else {
                expr = { [id(iden)]: iden, [oper]: { [id(value)]: value } };
                let deeperExpr = expr[oper]; program = skipSpace(program.replace(_, ""));
                const chain = parserHelper(program, deeperExpr);
                program = chain.program; deeperExpr = chain.deeperExpr;
            }
        }
    }
    else if (match = program.match(brac2)) {
        const [_, iden, oper] = match;
        const paren = parser(skipSpace(program.replace(_, '')));
        expr = { [id(iden)]: iden, [oper]: { paren: paren.expr } };
        if (paren.program[0] != ')') throw new SyntaxError('CLOSING PARENTHESIS ")" IS NEEDED');
        program = skipSpace(paren.program.slice(1)); let deeperExpr = expr[oper];
        const chain = parserHelper(program, deeperExpr);
        program = chain.program; deeperExpr = chain.deeperExpr;
    }
    else if (match = program.match(one)) {
        let nameOrVal = match[0];
        program = skipSpace(program.replace(nameOrVal, ''));
        if (nameOrVal in memoFunction) {
            let argslen = memoFunction[nameOrVal].length;
            const argsArr = [];
            for (argslen; argslen >= 1; argslen--) {
                const args = parser(program);
                if (args.expr === undefined) throw new Error(`inconstitent par and args`);
                argsArr.push(args.expr);
                program = args.program;
            }
            expr = { call: nameOrVal, args: argsArr };
        } else expr = { [id(match)]: nameOrVal };
    }
    else if (/^\(/.test(program)) {
        const paren = parser(program.slice(1));
        if (paren.program[0] != ')') throw new SyntaxError('CLOSING PARENTHESIS ")" IS NEEDED');
        if ('fn' in paren.expr) throw new Error(`can't decalare fn in an expression`);
        expr = { paren: paren.expr };
        program = skipSpace(paren.program.slice(1));
        program = parserHelper(program, expr).program;
    }
    else throw new SyntaxError(`${program} IS NOT A VALID SYNTAX`);
    return { expr, program };
}
export default function parsedExpressions(programme) {
    const expressions = [];
    while (programme) {
        const { expr, program } = parser(programme);
        expressions.push(expr);
        programme = program;
    }
    return expressions;
};