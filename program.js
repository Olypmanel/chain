import evaluate from "./evaluate.js";
import { parser } from "./parser.js";

export default `
matrix = [
    [01 02 03 04 05]
    [06 07 08 09 10]
    [11 12 13 14 15]
    [16 17 18 19 20]
    [21 22 23 24 25]
    [26 27 28 29 30]
]
ans = []
while (matrix 
    <<<
       counter = 0 
       if ( matrix, ans = ans + matrix - 0)   // TOP
       while( counter in matrix    // RIGHT
            <<<
                ans % matrix # counter # -1 
                matrix # counter - -1
                counter = counter + 1 
             >>>)
       if (matrix ans = ans + reverse(matrix - -1))    // BOTTOM

        last = len(matrix) - 1
        while (last in matrix             // LEFT
            <<<
                ans % matrix # last # 0
                matrix # last - 0
                last = last - 1
            >>>)
    >>>)
    print(ans)
fn avg a b => (a + b) / 2
print( avg(2 4) / avg(2 2) )
`;