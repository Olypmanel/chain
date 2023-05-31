# CHAIN PROGRAMMING LANGUAGE
This is a programming language built on top of javascript core language just like my previous project __nested programming language__ with a few features of __Python__
1. It has an unsual or somewhat odd syntax believe you are going to love it 
2. It currently supports __String__, __Number__, __Array or List__, __Object or Dict__ and __Function__


## How to set up chain programming language

1. Run __git pull https://github.com/olypmanel/chain.git__
2. Then run __npm install__
3. Run yet again __npm run start__
4. Open the __program.js__ file and start coding in chain language.
5. Happy hacking


## Ideas behind chain programming creation 

let review the __chain__ code below:
```py
    sum = 45 + 12 * (1 + 4) / 5
```
The above code follows a trend in which a __variable (sum)__ is followed by an __operator (=)__ then __value (45)__
this again start the whole trend again i.e __value(45)__, __operator(+)__ then again __value (12)__. This is a __Recursion__ problem

This above code can be represented using single linked list where the __operator__ leads to the next __node__ . e.g

```js
    {
        name: "sum",
        '=': { num: 45, '+': {
                    num: 12, 
                    '*': { paren: {...}, '/': {num: 5} }
        }}
     }
```
- This is what the __parser__ function does. It parse the __program string__ into an __Object also known as Dict in Python__ using __Recursive Algorithm__.

- The __parsedExpressions function__ keep on calling the __parser function__ using __while loop__ to parse all __program string__, untill all the program 

string has been parsed, then it returns an __Array (also known as List in python) of Objects__.

- This __parsedExpresions__ is invoked in the __execute function__ which iterates over the __array__ to __evaluate__ the __expr__ orderly

- The __evaluate function__ makes use of two functions: the __calculate function__ and the __evaluateHelper function__

- The __evalutorHelper function__ just works with __evaluator function__ to keep it __recursing__. Together the read the __expr__ into __array__ which is passed into the __calculate function__ which finally interpretes the program.

## Rules and syntax of chain programming language

1. chain support these operators __[+ - = * ^ in == != # $ % / #= => ]__.
All these are binary except __[- #=]__. __[ - ]__ can be both unary and binary operator while  __[ #= ]__ is a ternary operator.
2. __comma__ is optional in chain language, believe me, it is completely optional. Programs are separated by __spaces__ and __none operator__ input
3. __chain__ just like __javascript__ ignores white spaces. and // donates comments
4. Just like __python__ there are no constant variables declarations. Variable can declared and redeclared at any time.
5. Chain __variables__ are known as __name__, __Number__ as __num__, __String__ as __str__, 
    __Array or List__ as __arr__, __Object or Dict__ as __obj__, __Function__ as __fn__.
    __Operator__ as __oper__, __parenthesis__ as __paren__
6. __assignment oper__ can chain to any degree in as much it is chain with a valid __name__ at the __left__

```js
   a = b = c = d = 23
   print (a b c d) // 23 23 23 23
   a = "Hello"
   print(a d) // "Hello" 23
   v = b = 7 = 23 // Error
```

### Chain Object types

#### NUMBER  ( num )
 1. __Chain__ supports decimal, whole numbers, negative values
 2. __Operators__ that works with numbers are __[- + ^ * / % == !=]__
 3. This operators works as they should with numbers excepts the __^__ oper which is exponential oper i.e it represents the __**__
 4. they have the normal order of precedence i.e following the __BODMAS__ rule
 5. __Paren__ are used to disarrnge the order of precedence

```js
    print( 2 * (11 - 2))// 18
    print( 3 ^ 2) // 9     
```

### STRING ( str )

1. The only str literal __chain__ support is the double qoutes, which is the one line and multiline str.
```js
       qtr = "Hello World\nHow are you doing?"
```
2. __oper__ that works with __Str__ are __[ + / * # == !=]__

3. __+__ __concats str__ together just as expected in __Javascript Language__
4. __*__ works just as in __Python Language__. It repeats the __str__ n times
5. __/__ works just like __javascript slicing method__. i.e slicing the __str__ from the index of the right Operand
6. __#__ is used for quering 
7. __==__ and __!=__ works just as expected
 ```js
   print("come" + " to room " + 23) // "come to room 23"
   print ( "we" * 3) //"wewewe"
   print("come" / 1  "hOme" # 1  "45" # 0) //"ome" "O" "4"

 ``` 
 8. Note that comma is ommited in the last __print()__ call.

### ARRAY OR LIST ( arr )
__arr__ is a sequence collections of any type data. It can store a __num__, __str__, __obj__ and even other __arr__
1. The arr literal is donated by __[...]__ with or without comma separating the items
2. __oper__ supported by __arr__ are __[ #= % ^ * - / in == != # ]__

3. The above __str__ oper work just thesame for __arr__ being also a sequence but in __arr__ manner

4. -1 is the only negative right operand that __#__ can accepts and it will access the last item of the __arr__ but __/__ accepts all positive to negative right opperands

5. Trying to access a none available index of an arr will throw an error

6. for __+__, the type of the right operand must be the same with the right operand

7.___*__ repeating __oper__ accpets a number right operand

8. __in__ checks whether an index is in an __arr__ or not. It returns a Boolean

 ```js
      list = [1 2 13 24 "23", 0 23] // [1, 2, 13, 24, '23', 0, 23] NOTE THAT COMMA IS OPTIONAL     
      list / -3 // ['23', 0, 23] NOTE THE right OPERAND OF "/" CAN BE A NEGATIVE OR POSITIVE NUMBER
      print(list # 0  list # -1  list # 10)  // 1  23 Error
      list = [1 2 13 24 "23", 0 23] //     
      list + ["come" "on"] // [1, 2, 13, 24, '23', 0, 23, "come", "on"] NOTE THAT COMMA IS OPTIONAL 
      print(["Hello world"] * 3) //["Hello world", "Hello world", "Hello world"]
      print (4 in list) // true
 ```

9.  The above __arr__ are not inplace changer oper, as in they do not affect or change the structure or item of the __arr__

10. The __following Oper__ perform inplace changes on the __arr__ __[ % ^ - #=]__

11. __%__ pushes or append its right operand into the __arr__ in its left. This is equivalent to __JavaScript array push method__ and __Python list append__ method. 
But like __JS__ it returns the new length of the __arr__

12. __^__ does what __%__ does but pushes an item to the beginning of the  __arr__ ( and return the new length of the __arr__) rather than the end

13. __#__ in conjunction with __=__ is used for indexing into an __arr__ or an __obj__. It is a __Ternary oper__. With a syntax as
     (arr or obj) # (index or key ) = value. NOTE: if value is a chain i.e contains an oper it must be wrapped by a parenthesis otherwise chain throws an error


14. __-__ pops off the item at the index specified by right operand and return the item at that index. It raise an error if the left operand is not an available index of the __arr__ .

15. __==__ and __!=__ works just like in __Python__.  __==__ returns __true__ if all the items of the two __arr__ are equal or otherwise. __!=__ is the complete opposite.

```js
    ar = [1 2 3]
    print (ar % 2, "==>" ar) // 4 "==>" [1, 2, 3, 2]
    print(ar ^ 34 "==>" ar) // 5 "==>" [34, 1, 2, 3, 2] 
    print(ar - 0  "==>" ar) // 34 "==>"  [ 1, 2, 3, 2 ]
    print(ar - -1 "==>" ar) // 2 "==>"  [ 1, 2, 3 ]
    ar # 1 = "In place" // change the item at index 1 in ar to "In place"
    ar # 0 = ( 2 + 3 ) // IS VALID
    print(ar) // [ 5, "In place", 3 ]
    ar # 0  = 2 + 3 // ERROR WRAP VALUE BY A PARENTHESIS
    print( [12 "hello" [ 2 ] ] == [12, "hello", [ 2 ] ] ) // true; NOTE how comma was ignored
```

### OBJECT OR DICT ( obj )

  This is the unordered collection of data of any types in the form of __key value pair__ . The __key Value Pair__ are separated by __$__ oper.
 1. __oper__ support by __obj__ are few which are __[ $ #= in # ]__

 2. __Obj__ is implememted using the __{}__ literal. And __$__ has replaced the normal __colon (:)__, and __comma__ is optional

 3. Only __name__ , __str__ and __num__ are the only valid property names.

 ```js
      collection = {
         name $ "Emmanuel Segun"
         age $ 24
         dep $ "Dentistry"
      }
 ```
3. __in__, __#=__ and __#__ works just as in __arr__ only that __#=__ can never throw an Error in __Obj__

```js
    print (collection # "name") // "Emmanuel Segun"
    collection # "age" = 18 // THINK py  collection["age"] = 18  or js  collection.age = 18
    print(collection # "age") // 18
```
### FUNCTION DECLARATION 
    


### Chain Global Function