import { operator } from "./tools.js";
const init = (oper, arr) => {
    for (const op of oper) if (arr.indexOf(op) > -1) return [arr.indexOf(op), op];
    return false;
};
export default function calculate(arr) {
    const pre1 = '*^%/', pre2 = "-+", pre3 = ['==', '!=', 'in'];
    calc("#", arr);
    calc(pre1, arr);
    calc(pre2, arr);
    calc(pre3, arr);
    const ans = Number(arr[0]);
    if (arr[0] === undefined) return false;
    else if (typeof arr[0] == 'object') return arr[0];
    return Number.isNaN(ans) ? arr[0] : ans;
}
function calc(op, arr) {
    while (init(op, arr)) {
        const [index, oper] = init(op, arr);
        if (oper == "#" && arr[index + 2] == '=') arr.splice(index - 1, 5, operator.indexing(arr[index - 1], arr[index + 1], arr[index + 3]));
        // INDEXING
        else if (oper == '-' && arr[index - 1] === undefined) {
            const negate = arr[index + 1];
            if ((typeof negate == 'number' || typeof negate == 'string') &&
                typeof negate != "object" && !Number.isNaN(+negate))
                arr.splice(index, 2, 0 - Number(negate));
            else throw new TypeError(`negative oper works on num only`);

        }
        else arr.splice(index - 1, 3, operator[oper](arr[index - 1], arr[index + 1]));
    }
}