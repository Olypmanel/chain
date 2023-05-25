import { operator, regex } from "./tools.js";
const init = (oper, arr) => {
    // print (arr)
    for (const op of oper) if (arr.indexOf(op) > -1) return [arr.indexOf(op), op];
    return false;
};
export default function calculate(arr) {
    const pre1 = '*^%/', pre2 = "-+";
    function calc(op) {
        while (init(op, arr)) {
            const [index, oper] = init(op, arr);
            arr.splice(index - 1, 3, operator[oper](arr[index - 1], arr[index + 1]));
        }
    }
    calc(pre1);
    calc(pre2);
    const ans = Number(arr[0]);
    if (arr[0] === undefined) return false;
    else if (typeof arr[0] == 'object') return arr[0];
    return Number.isNaN(ans) ? arr[0] : ans;
}