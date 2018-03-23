(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.proxly = factory());
}(this, (function () { 'use strict';

  function proxly() {
    return _proxify([...arguments]);
  }

  function _proxify(items, path) {
    return (new Proxly(items, path).proxy);
  }

  class Proxly {
    constructor(items, path) {
      this.$ = items;
      this._path = path || [];
      this._proxy = new Proxy(function () { }, this);
    }

    get proxy() {
      return this._proxy;
    }

    get(_, prop, receiver) {
      if (prop === 'then') {
        if (!this._path.length) {
          return { then: () => receiver };
        }
        let p = new Promise(async (resolve, reject) => {
          let ret = [];
          for (const o of this.$) {
            try {
              ret.push(await Reflect.get(o, this._path[this._path.length - 1]));
            } catch (err) {
              reject(err);
            }
          }
          resolve(ret.length ? (ret.length === 1 ? ret[0] : ret) : undefined);
        });
        return p.then.bind(p);
      }
      return _proxify(this.$, this._path.concat(prop));
    }

    set(_, prop, value) {
      return new Promise(async (resolve, reject) => {
        for (const o of this.$) {
          try {
            Reflect.set(o, prop, value);
          } catch (err) {
            reject(err);
          }
        }
      });
    }

    apply(_, thisArg, args) {
      return new Promise(async (resolve, reject) => {
        const ret = [];
        const reduce = (target, list) => list.reduce((o, prop) => (o ? o[prop] : o), target);
        for (const o of this.$) {
          let ref = reduce(o, this._path);
          let refParent = reduce(o, this._path.slice(0, -1));
          try {
            ret.push(await Reflect.apply(ref, refParent, args || []));
          } catch (err) {
            reject(err);
          }
        }
        resolve(ret.length ? (ret.length === 1 ? ret[0] : ret) : undefined);
      });
    }
  }

  return proxly;

})));
