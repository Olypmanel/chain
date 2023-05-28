import { operPres, memoFunction } from "./tools.js";
import { evaluatorHelper } from "./helper.js";
import calculate from "./calculator.js";
import builtIn from "./builtin.js";
export default function evaluate(expr, local, global, params = {}) {
    const math = [];
    if (!expr) return '';
    if ('fn' in expr) { // EVALUATE FUNCTION DECLARATION
        if (expr.fn in global) throw new Error(`${expr.fn} has been initially declared`);
        local[expr.fn] = { $args: expr.args, $body: expr.body, $params: {} };
        return '';
    }
    else if ('call' in expr) { // EVALUATE FUNCTION INVOCATION
        if (expr.call in builtIn) return builtIn[expr.call](expr.$args) ?? false;
        const par = local[expr.call];
        par.$args = par.$args.filter(arg => arg);
        const args = expr.$args.map(arg => evaluate(arg, local, global, params));
        par.$args.forEach((arg, i) => par.$params[arg] = args[i]);
        params = par.$params;
        expr = par.$body;
        if (Array.isArray(expr)) {
            const scope = { ...global, ...params };
            expr = expr.map(ex => evaluate(ex, {}, scope, params));
            return expr[expr.length - 1];
        }
        while (operPres(expr)) expr = evaluatorHelper(expr, local, global, params, math);
        evaluatorHelper(expr, local, global, params, math);
    }
    else if (operPres(expr) == '=') { // EVALUATE IDENTIFIER
        let name = expr.name;
        if (!('name' in expr)) throw new SyntaxError(`AN IDENTIFIER MUST BE AT THE LEFT SIDE OF AN "=" OPERATOR`);
        if (expr.name in memoFunction) throw new Error(`${expr.name} HAS BEEN INITIALLY DECLARED`);
        expr = expr['='];
        return global[name] = evaluate(expr, local, global);
    }
    else if (!operPres(expr) && expr.name in global) return global[expr.name];
    else if ('arr' in expr || 'obj' in expr) { //EVALUATE ARRAY AND OBJECT
        const obj = {};
        if ('arr' in expr) return expr.arr.map(elem => evaluate(elem, local, global));
        else for (const key in expr.obj) obj[key] = evaluate(expr.obj[key], local, global);
        return obj;
    }
    else { // EVALUATE LITERAL EXPRESSION
        while (operPres(expr)) expr = evaluatorHelper(expr, local, global, params, math);
        evaluatorHelper(expr, local, global, params, math);
    }
    return calculate(math);
}