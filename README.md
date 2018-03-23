![Proxly](https://i.imgur.com/kqGg1MN.png)

# Proxly
Proxy any list of objects or functions to a single entity.
All common properties and methods are automatically reflected.

* Objects can be hetrogeneous with a shared interface
* Can proxy a set of functions (sync/async) to a single call
* Supports callbacks
* Excellent with async/await
* Tiny in size. **Only 447bytes gzipped**

## Install
Download the latest from [dist folder](https://github.com/pshihn/proxly/tree/master/dist)<br>
or from npm:
```
npm install --save proxly
```

## Usage/Examples
#### Proxy functions
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