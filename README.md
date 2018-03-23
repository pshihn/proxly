![Proxly](https://i.imgur.com/kqGg1MN.png)

**Proxy any list of objects or functions to a single entity.**<br>
**All common properties and methods are automatically reflected.**

* Objects can be heterogeneous with a shared interface
* Can proxy a set of functions (sync/async) to a single call
* Supports callbacks as arguments
* Excellent with async/await
* Tiny in size. **Only _447 bytes_ gzipped**

## Install
Download the latest from [dist folder](https://github.com/pshihn/proxly/tree/master/dist)<br>
or from npm:
```
npm install --save proxly
```

## Usage/Examples
#### Proxy Functions
```javascript
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
async function multiply(a, b) { return a * b; }

(async () => {
  let proxy = proxly(add, subtract, multiply);
  let result = await proxy(4, 2);
  console.log(result); // [6, 2, 8]
})();
```
#### Proxy Objects
Objects could be instances of the same class or just any two objects with a common interface.
```javascript
class Operation {
  constructor(name) {
    this.name = name;
    this.count = 0;
  }
  run(a, b) {
    this.count++;
    if (this.name === 'add') return a + b;
    if (this.name === 'subtract') return a - b;
  }
}
let adder = new Operation('add');
let subtractor = new Operation('subtract');

(async () => {
  let proxy = proxly(adder, subtractor);
  console.log(await proxy.name); // ["add", "subtract"]
  console.log(await proxy.count); // [0, 0]
  console.log(await proxy.run(10, 4)); // [14, 6]
  console.log(await proxy.count); // [1, 1]
})();
```
#### Proxy Arrays
Of course it works with arrays
```javascript
let fruits = ["apple", "banana", "grape"];
let colors = ["red", "yellow", "green"];
(async () => {
  let proxy = proxly(fruits, colors);
  console.log(await proxy[1]); // ["banana", "yellow"]
  console.log(await proxy.length); // [3, 3]
  proxy.push('orange');
  console.log(await proxy.length); // [4, 4]
  console.log(fruits); // ["apple", "banana", "grape", "orange"]
  console.log(colors); // ["red", "yellow", "green", "orange"]
})();
```

#### Callbacks
If a callback is passed into a proxied set of functions (or a method in a proxied set of objects), it is called back sequentially in the order the proxy was defined.
```javascript
function add(a, b, cb) {
  cb(a + b);
}
function sub(a, b, cb) {
  setTimeout(() => {
    cb(a - b);
  }, 1000);
}
(async () => {
  let cb = (result) => {
    console.log("result", result);
  };
  let proxy = proxly(add, sub);
  proxy(6, 4, cb);
})();
```
Output:
```
result 10
result 2
```

### Examples
See the [examples folder](https://github.com/pshihn/proxly/tree/master/examples)

### License
[MIT License](https://github.com/pshihn/proxly/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
