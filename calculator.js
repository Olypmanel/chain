import { operator , regex} from "./tools.js";
export default function calculate(str) {
    const { calc, calc1 } = regex; let match;
    while (/([*/%+\-])\s*-\s*-/g.test(str)) str = str.replace(/([*/%+\-])\s*-\s*-/g, '$1');
    while (match = str.match(calc)) {
        const [_, val1, oper, val2] = match;
        str = str.replace(_, operator[oper](Number(val1), Number(val2)));
    }
    while (match = str.match(calc1)) {
        const [_, val1, oper, val2] = match;
        str = str.replace(_, operator[oper](Number(val1), Number(val2)));
    }

    return Number.isNaN(Number(str)) ? str : Number(str);
}