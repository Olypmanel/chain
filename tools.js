export const globalVars = Object.create(null);
export const memoFunction = Object.create(null);
export const localVars = Object.create(null);
export const operator = {
    '+'(a, b) { return a + b; },
    '-'(a, b) { return a - b; },
    '*'(a, b) { return a * b; },
    '%'(a, b) { return a % b; },
    '/'(a, b) { return a / b; },
    '^'(a, b) { return a ** b; },
};
export const regex = {
    one: /^(-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    exp: /^([\-+%*/=^])\s*(\-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    three: /^(-?\d*\.?\d+|"[^"]*"|[a-zA-Z]+\w*)\s*([\-+%*/^=])\s*(-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    brac1: /^([\-+%*/=^])\s*\(/,
    calc: /(-?\d*\.?\d+|\w+)\s*([%/^*])\s*(-?\d*\.?\d+|\w+)/,
    calc1: /(-?\d*\.?\d+|"[^"]*")\s*([+\-])\s*(-?\d*\.?\d+|"[^"]*")/,
    fn: /^fn +([a-zA-Z_]+\d*) *\(? *(([a-zA-Z_]+\d* *)*) *\)? *=>/,
    identifier: /^(-?\d*\.?\d+|"[^"]*"|[a-zA-Z]+\w*)\s*([\-+%*/^=])/,

};
export const skipSpace = program => program.replace(/^\s*/, '');
export const operPres = expr => {
    for (const oper of '-^/+%*=') if (oper in expr) return oper;
    return false;
};