# milktea
The *milktea* is a functional object-oriented scripting language written in JavaScript.

## Features
* Dynamic typing
* Prototype-based object-oriented programming
* Curried functions
* Custom operators
* Proper tail calls

## How to use
**Node.js >= 4.0 or io.js >= 2.0 is strongly recommended.**

Install with `npm`:
``` shell
$ npm install git://github.com/susisu/milktea.git
```
or (if you want to install it globally, to use the commands below):
``` shell
$ npm install -g git://github.com/susisu/milktea.git
```

To run *milktea* in your script, like this:
``` javascript
var mlkt = require("milktea");
var res;
try {
    res = mlkt.parser.parse(<filename:string>, <source:string>);
}
catch (err) {
    // parse error
}
if (res) {
    var program = res[0];
    var env = Object.create(mlkt.prelude);
    try {
        program.forEach(function (stmt) {
            // output the result of each statement
            console.log(stmt.run(env));
        });
    }
    catch (err) {
        // runtime error
    }
}
```

To run a *milktea* script, use `mlkt` command:
``` shell
$ mlkt <file>
```
If you want to run your script interactively, use `mlkti` command (a REPL interpreter):
``` shell
$ mlkti
```

## Examples
### Hello, world!
```
print "Hello, world!";
```

### Data Types
```
-- Unit ('unit')
-- The Unit type has only one value `()`,
-- sometimes considered as 'nothing'.
();

-- Number ('number')
-- The Number type includes integers and floating point numbers (double).
137;
1.38e-23;

-- String ('string')
-- A value of the String type is a sequence of zero or more characters.
"Hello!";

-- Boolean ('bool')
-- The Boolean type has two values `true` and `false`.
true;
false;

-- Function ('function')
-- The type of all functions is the Function type.
\x -> x;
\x y -> x + y;

-- Reference ('reference')
-- A value of the Reference type stores a reference to a value
-- and the reference can be updated.
ref 0;

-- Array ('array')
-- A value of the Array type contains a sequence of values.
[1, "string", true];

-- Object ('object')
-- A value of the Object type can contain a set of key-value pairs.
-- Plus, an object can have its 'proto' object,
-- which is essential for the prototype-based object-oriented programming.
{ name: "Alice", age: 16 };
```

### Variable and Function Declaration
```
a = 1;
b = 2;
f x y = x + y;
trace (f a b);
```

### Recursive Function (e.g. Factorial)
```
factorial n =
    let itr n p =
        if n >= 1 then itr (n - 1) (p * n)
        else p
    in itr n 1
;
trace (factorial 10);
```

### Objects
```
alice = {
        name : "Alice",
        age  : 16,
        greet: \this -> print ("Hello! I'm " ++ this.name)
    }
;

-- read property
trace alice.name;
trace alice.age;

-- check if the object has property
trace alice?name;
trace alice?familyName;

-- call method of the object
alice:greet;
-- it is the syntax sugar of:
alice.greet alice;

-- update property
alice!age (alice.age + 1);
trace alice.age;
```

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
