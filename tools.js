import { ArgumentError, IndexError, OperatorError } from "./error.js";

export const globalVars = Object.create(null);
export const memoFunction = Object.create(null);
export const localVars = Object.create(null);
const str = /^"([^"]*)"$/, num = /^-?\d*\.?\d+$/, match = null;
export const isEqual = (a, b) => {
    if (typeof a !== typeof b) return false;
    else if (Array.isArray(a) !== Array.isArray(b)) return false;
    else if (typeof a == 'object') {
        if (Object.keys(a).length !== Object.keys(b).length) return false;
        for (const elem in a) if (!isEqual(a[elem], b[elem])) return false;
        return true;
    }
    else if (a !== b) return false;
    return true;
};
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
        else if (str.test(a) && num.test(b)) return `"${a.match(str)[1].repeat(Number(b))}"`;
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
    "=="(a, b) { return isEqual(a, b); },
    "!="(a, b) { return !isEqual(a, b); },
    '#'(a, b) {
        if (str.test(a) && a.match(str)[1][b]) return `"${a.match(str)[1][b]}"`;
        if (typeof b == 'string') b = b.replace(/\"/g, '');
        if (typeof a !== 'object') throw new ArgumentError(`${b} is an obj or arr`);
        if (!(b in a) && b != -1) throw new IndexError(`${b} is not an index or elem of queried`);
        return b == -1 ? a[a.length - 1] : a[b];
    },
    in(a, b) {
        if (typeof a == 'string') a = a.replace(/\"/g, '');
        if (typeof b !== 'object') throw new ArgumentError(`${b} is an obj or arr`);
        return a in b;
    },
    indexing(a, b, c) {
        c = Number.isNaN(+c) ? c : +c;
        if (typeof a != 'object') throw new Error();
        else if (Array.isArray(a)) {
            b = String(b).replace(/\"/g, '');
            if (!(b in a) && +b != -1) throw new IndexError(`${b} is not an index or elem of queried`);
            else if (b >= 0) a[b] = c;
            else if (b == -1 && 0 in a) a[a.length - 1] = c;
            else throw new IndexError(`${b} is not an index of empty arr`);
        }
        else a[b.replace(/\"/g, '')] = c;
        return false;
    }
};
export const regex = {
    numNameStr: /^(-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    fn: /^fn +([a-zA-Z_]+\d*) *\(? *(([a-zA-Z_]+\d* *)*) *\)? *=>/,
    call: /^([a-zA-Z]+\w*) *\(/, // function invocation
    combo: /^([\[\{\($=+\-*^%/]|\*\*|-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    oper: /^(==|!=|in|[=%$\-+*/\#^])/
};
export const skipSpace = program => {
    const reg = /^(\s*\/\/.*|\s+)/;
    while (reg.test(program)) program = program.replace(reg, '');
    return program;
};
export const operPres = expr => {
    for (const oper of [...'$-^/+%*=#', '==', '!=', 'in']) if (oper in expr) return oper;
    return false;
};