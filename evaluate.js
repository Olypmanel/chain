import { localVars, operPres, memoFunction, globalVars } from "./tools.js";
import { evaluatorHelper } from "./helper.js";
import calculate from "./calculator.js";

export default function evaluate(expr, params = {}) {
    const math = [];
    if (!expr) return '';
    if ('fn' in expr) {
        if (expr.fn in globalVars) throw new Error(`${expr.fn} has been initially declared`);
        localVars[expr.fn] = { args: expr.args, body: expr.body, params: {} };
        return '';
    }
    else if ('call' in expr) { // FUNCTION INVOCATION
        const par = localVars[expr.call];
        par.args = par.args.filter(arg => arg);
        const args = expr.args.map(arg => evaluate(arg, globalVars, params));
        par.args.forEach((arg, i) => par.params[arg] = args[i]);
        params = par.params;
        expr = par.body;
        while (operPres(expr)) expr = evaluatorHelper(expr, params, math);
        evaluatorHelper(expr, params, math);
    }
    else if (operPres(expr) == '=') {
        if (!('name' in expr)) throw new SyntaxError(`AN IDENTIFIER MUST BE AT THE LEFT SIDE OF AN "=" OPERATOR`);
        if (expr.name in memoFunction) throw new Error(`${expr.name} HAS BEEN INITIALLY DECLARED`);
        let deepExpr = expr['='];
        if ('=' in deepExpr) return globalVars[expr.name] = evaluate(deepExpr, params);
        while (operPres(deepExpr)) deepExpr = evaluatorHelper(deepExpr, params, math);
        evaluatorHelper(deepExpr, params, math);
        globalVars[expr.name] = calculate(math.join` `);
    }
    else {
        while (operPres(expr)) expr = evaluatorHelper(expr, params, math);
        evaluatorHelper(expr, params, math);
    }
    return calculate(math.join` `);
}