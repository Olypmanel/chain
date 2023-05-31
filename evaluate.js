import { operPres, memoFunction } from "./tools.js";
import { evaluatorHelper } from "./helper.js";
import calculate from "./calculator.js";
import builtIn from "./builtin.js";
import { ArgumentError, ParameterError } from "./error.js";
export default function evaluate(expr, local, global, params = {}) {
    const math = [];
    if (!expr) return '';
    if ('fn' in expr) { // EVALUATE FUNCTION DECLARATION
        const createFn = (expr) => {
            const { args, body } = expr;
            const localScope = Object.create(local);
            const globalScope = Object.create(global);
            const execute = (parsedExpr, l, g) => parsedExpr.map(expr => evaluate(expr, l, g));
            return function () {
                if (arguments.length != args.length) throw new ArgumentError(`inconsitent number of arguments and parameters`);
                for (let i = 0; i < arguments.length; i++) globalScope[args[i]] = arguments[i];
                const evalExpr = execute(body, localScope, globalScope);
                return evalExpr[evalExpr.length - 1];
            };
        };
        local[expr.fn] = createFn(expr);
        return false;
    }
    else if ('call' in expr) { // EVALUATE FUNCTION INVOCATION
        if (expr.call in builtIn) return builtIn[expr.call](expr.$args, local, global) ?? false;
        else if (expr.call in local) return local[expr.call](...expr.$args.map(arg => evaluate(arg, local, global))) ?? false;
        else console.log(` fuck`);
        return false;
    }
    else if (operPres(expr) == '=') { // EVALUATE IDENTIFIER
        if (math.length) {  // IF IT IS INDEXING I.E FOR ARR OR OBJ
            math.push("=");
            while (operPres(expr)) expr = evaluatorHelper(expr['='], local, global, math);
            evaluatorHelper(expr, local, global, math);
        } else { // IF  IT IS NORMAL ASSIGNMENT
            let name = expr.name;
            if (!('name' in expr)) throw new SyntaxError(`AN IDENTIFIER MUST BE AT THE LEFT SIDE OF AN "=" OPERATOR`);
            if (expr.name in memoFunction) throw new Error(`${expr.name} HAS BEEN INITIALLY DECLARED`);
            return global[name] = evaluate(expr['='], local, global);
        }
    }
    else if (!operPres(expr) && expr.name in global) return global[expr.name];
    else if ('arr' in expr || 'obj' in expr) { //EVALUATE ARRAY AND OBJECT
        const obj = {};
        if ('arr' in expr) return expr.arr.map(elem => evaluate(elem, local, global));
        else for (const key in expr.obj) obj[key] = evaluate(expr.obj[key], local, global);
        return obj;
    }
    else { // EVALUATE LITERAL EXPRESSION
        while (operPres(expr)) expr = evaluatorHelper(expr, local, global, math);
        evaluatorHelper(expr, local, global, math);
    }
    return calculate(math);
}