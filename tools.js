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
    two: /^([\-+%*/=^])\s*(\-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    three: /^([a-zA-Z]+\w*)\s*([\-=+%*/^])\s*(-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    three1: /^(-?\d*\.?\d+|"[^"]*")\s*([\-+%*/^])\s*(-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")/,
    brac1: /^([\-+%*/=^])\s*\(/,
    brac2: /^(-?\d*\.?\d+|[a-zA-Z]+\w*|"[^"]*")\s*([\-+=%*/^])\s*\(/,
    calc: /(-?\d*\.?\d+|\w+)\s*([%/^*])\s*(-?\d*\.?\d+|\w+)/,
    calc1: /(-?\d*\.?\d+|"[^"]*")\s*([+\-])\s*(-?\d*\.?\d+|"[^"]*")/,
    fn: /^fn +([a-zA-Z_]+\d*) *\(? *(([a-zA-Z_]+\d* *)*) *\)? *=>/
};
export const skipSpace = program => program.replace(/^\s*/, '');
export const operPres = expr => {
    for (const oper of '-^/+%*=') if (oper in expr) return oper;
    return false;
};