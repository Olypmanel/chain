import evaluate from "./evaluate.js";
export default `
auth = {            // OBJ DECLARATION
    name $ "Emmanuel Segun"
    nick_name $ "Olypmanel"
    age $ 24
    school $ "Obafemi Awolowo University. Nigeria"
    department $ "Dentistry"
    skills $ ["JavaScript" "Python" "Git" "Football" "Chess" ]
}
matrix = [          // ARR DECALRATION
    [01 02 03 04 05]
    [06 07 08 09 10]
    [11 12 13 14 15]
    [16 17 18 19 20]
    [21 22 23 24 25]
    [26 27 28 29 30]
]
 fn snail grid => <<< // FUNCTION DECLARATION
    ans = []
    while (grid  <<<   //  WHILE LOOP
        counter = 0 
        if ( grid, ans = ans + grid - 0)   // TOP OF THE GRID
        while( counter in grid,   // RIGHT OF THE GRID
                <<<
                    ans % grid # counter # -1  // interpreted to python as ans.append(grid[counter][-1])
                    grid # counter - -1 // interpreted to javaScript as grid[counter].pop()
                    counter = counter + 1 // increment
                >>>)
        if (grid, ans = ans + reverse(grid - -1))    // BOTTOM OF THE GRID

            last = len(grid) - 1
            while (last in grid             // LEFT OF THE GRID
                <<<
                    ans % grid # last # 0 // interpreted to JavaScript as ans.push(grid[last][0])
                    grid # last - 0 // interpreted to javaScript as matrix[last].shift()
                    last = last - 1 // decrement
                >>>)
        >>>)
        ans
>>>
result = snail(matrix) // CALLING THE FUNCTION
print( result )
// print( auth)
`;
// OPERATORS WORKS DIFFERENTLY WITH DIFFRENT DATA TYPES
/*
      ALL THE OPERATORS SUPPORTED BY CHAIN ARE [ -, =, ==, !=, *, +, /, %, #, ^, $, in, #=, <<<>>> ]
         [==, !=] WORKS FOR ALL DATA TYPES. THEY ARE STRICT EQUAL AND NOT EQUAL OPERATOR I.E 2 == "2" IF FALSE
         THE NORMAL MATHEMATICAL OPERATORS FOLLOW THE NORMAL BODMAS RULE FOR PRECEDENCE.
         [ () ] PARENTHESIS HAS THE HIGHEST PRECEDENCE, FOLLOWED BY [ #, #= ] 
         [ *, %, ^, /] FOLLOW IN PRECEDENCE
         [ -, + ] FOLLOW THUS, THEN [ ==, !=]. [ = ] HAS THE LOWEST PRECEDENCE
         PARENTHESIS [ () ] CAN BE USE TO IGNORE THIS PRECEDENCE, BEING THE HIGHEST.
         [<<<>>>] IS NOT REALLY AN OPERATOR BUT A WRAPPER AROUND SERIES OF STAETMENTS. IT CAN BE USED ARBITRARYILY. BUT IT CAN NOT SERVE THE PURPOSE OF A PARENTHESES. 
         COMMA IS EXCEPTIONAL IN CHAIN LANGUAGE, BUT IT IS ADVISABLE TO ALWAYS COMMA YOUR CODE WHERE SEES FIT.

    1  FOR NUMBERS [ -, +, %, *, /,] WORK AS EXPECTED, EXCEPT [ ^ ] WHICH REPLACES [ ** ] WHICH IS EXPONENTIAL OPERATOR

    2 FOR STRING VALID OPERATORS ARE [ +, *, /, #, ==, !=] 
            [ + ] IS CONCATENATION OPERATOR AS EXPECTED.
            [ * ] IS REPETITION OPERATOR AS EXPECTED IN PYTHON. I.E "HELLO" * 2 WILL GIVE "HELLOHELLO"
            [ / ] IS A SLICING OPERATOR FOR STRING THAT SLICE OFF THE STRING AT A SPECIFIED INDEX E.G "hello" / 1 results into "ello"
            [ # ] IS A QUERING OPERATOR, IT ACCESS THE STING AT THE SPECIFIED INDEX
            THESE ABOVE STRING OPERATIONS ARE TYPICAL OF SEQUENCE DATA TYPE. CHAIN HAS ONLY TWO SEQUENCE DATA TYPE ARRAY AND STRING.
            SO THE ABOVE OPERATIONS ALSO WORKS FOR ARRAY AND RETURN AN ARRAY AND RESULTS INTO ARRAY.

    3 FOR ARRAY VALID OPERATORS ARE [ +, *, /, in, ==, !=, %, ^, -, #= ]
            ARRAY IS WRITTEN LITERALLY USING BLOCK PARENTHESIS ([]) COMMA IS EXCEPTIONAL E.G [12 1 "Emmanuel" ]
            [  +, *, /, # , ==, != ] WORKS FOR ARRAY AS THEY DO FOR STRINGS BUT RETURN AN ARRAY WHERE NEEDED.

            [ in ] OPERATOR CHECKS FOR A KEY IN OBJ AND INDEX IN ARR IT THROWS AN ERROR OTHERWISE. IT RETURN A BOOLEAN (true OR false)

            [ ==, != ] CHECK WHETHER ALL THE ITEM IN THE TWO ARRAYS ARE EQUAL THEN RETURN TRUE OR OTHERWISE 
            E.G [ 1 2 3 ] == [ 1 2 3  ] results into true. 

            THE EXPLAINED OPERATORS ABOVE ARE NOT IN-PLACE OPERATORS I.E THEY DO NOT MUTATE THE ARRAY IN ANY WAY BUT RETURN A NEW ARRAY
            [ %, -, ^, #=] THESE OPERATORS PERFORM IN-PLACE CHANGES OR MUTATE AN ARRAY

            [ %, ^] OPERATORS PUSH INTO THE ARRAY. WHILE [ % ] PUSHES TO THE END OF THE ARRAY, [ ^ ] PUSHES TO THE BEGINNING 
            AND BOTH RETURNS THE NEW LENGTH OF THE ARRAY

            [ #= ] IS THE INDEXING OPERATOR AND IT IS A TERNARY OPERATOR. THIS OPERATOR WORKS IN A STRANGE WAY BECAUSE IT HAS HIGHER PRECEDENCE.
            ITS SYNTAX IS AS FOLLOW: (obj or arr) # (index or key) = (value). { think this arr[index] = value or  obj[key] = value }

            NOTE THAT TRYING TO ASSIGN A VALUE AT INDEX OF AN ARRAY THAT IS NOT AVAILABLE WILL RESULT INTO AN ERROR USE [ in ] OPERATOR TO CHECK WHETHER IT IS AVAILABLE. FOR OBJ THIS WILL NEVER THROW AN ERROR AS LONG AS THE KEY IS A VALID KEY, VALID KEYS ARE [ num, name, str ] ONLY.

            IF THE VALUE ASSIGNED TO THE INDEXING OPERATOR IS ALSO A CHAIN I.E AS AN OPERATOR IS PRESENT IN THE VALUE I.E  arr # 0 = 1 + 2 IT WILL THROW AN ERROR. A VALID SYNTAX WILL BE TO WRAP THE VALUE IN A PARENTHESIS I.E arr # 0 = ( 1 + 2 )  IS A VALID SYNTAX.  
    4 FOR OBJECT VALID OPERATOR ARE [in, $, #=, ==, != ]
            OBJECTS ARE IMPLEMENTED USING  THE OBJECT LITERAL WHICH IS CURLY BRACES ({}) USING THE KEY VALUE PAIR.
            [ $ ] IS USED ONLY IN THE CURLY BRACES TO SEPARSTE THE KEY VALUE PAIR I.E { key $ value}. COMMA IS EXCEPTIONAL

            
 */
