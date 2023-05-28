import { IndexError, OperatorError } from "./error.js";

export const globalVars = Object.create(null);
export const memoFunction = Object.create(null);
export const localVars = Object.create(null);
let str = /^"([^"]*)"$/, num = /^-?\d*\.?\d+$/, match = null;
export const operator = {
    '+'(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
        if (str.test(a) && num.test(b)) return `"${a.match(str)[1] + b}"`;
        else if (str.test(b) && num.test(a)) return `"${a + b.match(str)[1]}"`;
        else if (str.test(a) && str.test(b)) return `"${a.match(str)[1]}${b.match(str)[1]}"`;
        else if (num.test(a) && num.test(b)) return Number(a) + Number(b);
        throw new OperatorError(`"+" oper doesn't support operands ${a} and ${b}`);
    },
    '-'(a, b) {
        if (Array.isArray(a)) {
            if (Array.isArray(b)) throw new OperatorError(`"-" oper doesn't support operands [${a}] and [ ${b} ]`);
            else if (b in a) return a.splice(b, 1)[0];
            else if (Number(b) == -1 && 0 in a) return a.pop();
            else throw new IndexError(`${b} is not an index of [${a}]`);
        }
        if (num.test(a) && num.test(b)) return Number(a) - Number(b);
        throw new OperatorError(`"-" oper doesn't support operands ${a} and ${b}`);

    },
    '*'(a, b) {
        if (Array.isArray(b)) throw new OperatorError(`"*" oper doesn't support operands ${a} and [ ${b} ]`);
        if (Array.isArray(a) && num.test(b)) {
            const arr = [];
            for (let i = Number(b); i > 0; i--) arr.push(...a);
            return arr;
        }
        else if (a.match(str) && num.test(b)) return `"${a.match(str)[1].repeat(Number(b))}"`;
        else if (num.test(a) && num.test(b)) return Number(a) * Number(b);
        throw new OperatorError(`"*" oper doesn't support operands ${a} and ${b}`);

    },
    '%'(a, b) {
        if (Array.isArray(a)) { a.push(+(b) || b); return a.length; }
        else if (num.test(a) && num.test(b)) return Number(a) % Number(b);
        throw new OperatorError(`"%" oper doesn't support operands ${a} and ${b}`);

    },
    '^'(a, b) {
        if (Array.isArray(a)) { a.unshift(+(b) || b); return a.length; }
        else if (num.test(a) && num.test(b)) return Number(a) ** Number(b);
        throw new OperatorError(`"^" oper doesn't support operands ${a} and ${b}`);
    },
    '/'(a, b) {
        if (Array.isArray(b)) throw new OperatorError(`"/" oper doesn't support operands ${a} and [ ${b} ]`);
        if (Array.isArray(a) && num.test(b)) return a.slice(Number(b));
        else if (str.test(a) && num.test(b)) return `"${a.match(str)[1].slice(Number(b))}"`;
        else if (num.test(a) && num.test(b)) return Number(a) / Number(b);
        throw new OperatorError(`"^" oper doesn't support operands ${a} and ${b}`);
    },

};
export const regex = {
    identifier: /^(-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    fn: /^fn +([a-zA-Z_]+\d*) *\(? *(([a-zA-Z_]+\d* *)*) *\)? *=>/,
    call: /^([a-zA-Z]+\w*) *\(/, // function invocation
    combo: /^([\[\{\($=+\-*^%/]|\*\*|-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    oper: /^([%$\-+*/^!&])/
};
export const skipSpace = program => program.replace(/^(\s*|\s*#.*)/, '');
export const operPres = expr => {
    for (const oper of [...'$-^/+%*=', '**']) if (oper in expr) return oper;
    return false;
};