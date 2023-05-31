import { ArgumentError } from './error.js';
import evaluate from './evaluate.js';
import { globalVars as global, isEqual, localVars as local, } from './tools.js';
class BuiltIn {
    while(expr, lc = local, gl = global) {
        if (expr.length < 1 || expr.length > 2) throw new ArgumentError(`while expr accepts two statements at most, one at least`);
        while (this.bool([expr[0]], lc, gl)) evaluate(expr[1], lc, gl);
    }
    if(expr, lc = local, gl = global) {
        if (expr === true) return true; else if (expr === false) return false;
        if (expr.length < 2 || expr.length > 3) throw new ArgumentError(`if expr accepts three statements max`);
        if (this.bool([expr[0]], lc, gl)) return evaluate(expr[1], lc, gl);
        else return evaluate(expr[2], lc, gl);
    }
    print(expr, lc = local, gl = global) { console.log(...expr.map(exp => evaluate(exp, lc, gl))); }
    reverse(expr, lc, gl = global) {
        if (expr.length !== 1) throw new ArgumentError(`reverse fn accepts only one argument`);
        expr = evaluate(expr[0], lc, gl);
        if (Array.isArray(expr)) return expr.reverse();
        else if (typeof expr == 'string') return `"${[...expr.slice(1, expr.length - 1)].reverse().join``}"`;
        else throw new ArgumentError(`reverse method expects an arr or str`);
    }
    builtin() { console.log(Object.getOwnPropertyNames(BuiltIn.prototype).slice(1).sort()); }
    bool(expr, lc = local, gl = global) {
        if (expr.length !== 1) throw new ArgumentError(`bool fn accepts only one argument`);
        const type = evaluate(expr[0], lc, gl);
        if (type === true) return true; else if (type === false) return false;
        else if (isEqual([], type) || isEqual({}, type) || '""' == type || type === 0) return false;
        else return true;
    }
    num(expr, lc = local, gl = global) {
        let val = evaluate(expr[0], lc, gl);
        if (typeof val == "string") {
            val = val.slice(1, val.length - 1); // val = val.replace(/\"/g, "")
            return (!Number.isNaN(Number(val))) ? Number(val) : false;
        }
        return (!Number.isNaN(Number(val))) ? Number(val) : false;
    }
    len(expr, lc = local, gl = global) {
        if (expr.length !== 1) throw new ArgumentError(`len fn accepts only one argument`);
        const val = evaluate(expr[0], lc, gl);
        if (typeof val == "string" || Array.isArray(val)) return val.length;
        else throw new ArgumentError(`len fn accepts only sequence like arr and str`);
    }
}
export default new BuiltIn;