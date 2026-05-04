import require$$1 from 'util';
import stream, { Readable } from 'stream';
import * as path from 'path';
import path__default from 'path';
import * as http from 'http';
import http__default from 'http';
import require$$2 from 'https';
import require$$5, { fileURLToPath } from 'url';
import * as fs from 'fs';
import fs__default from 'fs';
import require$$8, { randomFillSync, randomUUID } from 'crypto';
import http2 from 'http2';
import require$$4 from 'assert';
import require$$1$1 from 'tty';
import os from 'os';
import zlib from 'zlib';
import require$$4$1, { EventEmitter } from 'events';
import * as require$$0$1 from 'net';
import require$$0__default from 'net';
import require$$1$2 from 'tls';
import { chromium, firefox } from 'playwright';
import WebSocket, { WebSocketServer } from 'ws';
import require$$0$2 from 'buffer';

/**
 * Create a bound version of a function with a specified `this` context
 *
 * @param {Function} fn - The function to bind
 * @param {*} thisArg - The value to be passed as the `this` parameter
 * @returns {Function} A new function that will call the original function with the specified `this` context
 */
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const { iterator, toStringTag } = Symbol;

const kindOf = ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};

const typeOfTest = (type) => (thing) => typeof thing === type;

/**
 * Determine if a value is a non-null object
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const { isArray } = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    isFunction$1(val.constructor.isBuffer) &&
    val.constructor.isBuffer(val)
  );
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction$1 = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = (thing) => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(toStringTag in val) &&
    !(iterator in val)
  );
};

/**
 * Determine if a value is an empty object (safely handles Buffers)
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an empty object, otherwise false
 */
const isEmptyObject = (val) => {
  // Early return for non-objects or Buffers to prevent RangeError
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }

  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    // Fallback for any other objects that might cause RangeError with Object.keys()
    return false;
  }
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a React Native Blob
 * React Native "blob": an object with a `uri` attribute. Optionally, it can
 * also have a `name` and `type` attribute to specify filename and content type
 *
 * @see https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Network/FormData.js#L68-L71
 * 
 * @param {*} value The value to test
 * 
 * @returns {boolean} True if value is a React Native Blob, otherwise false
 */
const isReactNativeBlob = (value) => {
  return !!(value && typeof value.uri !== 'undefined');
};

/**
 * Determine if environment is React Native
 * ReactNative `FormData` has a non-standard `getParts()` method
 * 
 * @param {*} formData The formData to test
 * 
 * @returns {boolean} True if environment is React Native, otherwise false
 */
const isReactNative = (formData) => formData && typeof formData.getParts !== 'undefined';

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction$1(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function getGlobal() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  return {};
}

const G = getGlobal();
const FormDataCtor = typeof G.FormData !== 'undefined' ? G.FormData : undefined;

const isFormData = (thing) => {
  let kind;
  return thing && (
    (FormDataCtor && thing instanceof FormDataCtor) || (
      isFunction$1(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction$1(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  );
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = [
  'ReadableStream',
  'Request',
  'Response',
  'Headers',
].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => {
  return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array<unknown>} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Object} [options]
 * @param {Boolean} [options.allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Buffer check
    if (isBuffer(obj)) {
      return;
    }

    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

/**
 * Finds a key in an object, case-insensitive, returning the actual key name.
 * Returns null if the object is a Buffer or if no match is found.
 *
 * @param {Object} obj - The object to search.
 * @param {string} key - The key to find (case-insensitive).
 * @returns {?string} The actual key name if found, otherwise null.
 */
function findKey(obj, key) {
  if (isBuffer(obj)) {
    return null;
  }

  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== 'undefined') return globalThis;
  return typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : global;
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * const result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const { caseless, skipUndefined } = (isContextDefined(this) && this) || {};
  const result = {};
  const assignValue = (val, key) => {
    // Skip dangerous property names to prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return;
    }

    const targetKey = (caseless && findKey(result, key)) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Object} [options]
 * @param {Boolean} [options.allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(
    b,
    (val, key) => {
      if (thisArg && isFunction$1(val)) {
        Object.defineProperty(a, key, {
          value: bind(val, thisArg),
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        Object.defineProperty(a, key, {
          value: val,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    },
    { allOwnKeys }
  );
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  Object.defineProperty(constructor.prototype, 'constructor', {
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype,
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};

/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = ((TypedArray) => {
  // eslint-disable-next-line func-names
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];

  const _iterator = generator.call(obj);

  let result;

  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = (str) => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
    return p1.toUpperCase() + p2;
  });
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (
  ({ hasOwnProperty }) =>
  (obj, prop) =>
    hasOwnProperty.call(obj, prop)
)(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction$1(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction$1(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};

/**
 * Converts an array or a delimited string into an object set with values as keys and true as values.
 * Useful for fast membership checks.
 *
 * @param {Array|string} arrayOrString - The array or string to convert.
 * @param {string} delimiter - The delimiter to use if input is a string.
 * @returns {Object} An object with keys from the array or string, values set to true.
 */
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite((value = +value)) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(
    thing &&
    isFunction$1(thing.append) &&
    thing[toStringTag] === 'FormData' &&
    thing[iterator]
  );
}

/**
 * Recursively converts an object to a JSON-compatible object, handling circular references and Buffers.
 *
 * @param {Object} obj - The object to convert.
 * @returns {Object} The JSON-compatible object.
 */
const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      //Buffer check
      if (isBuffer(source)) {
        return source;
      }

      if (!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

/**
 * Determines if a value is an async function.
 *
 * @param {*} thing - The value to test.
 * @returns {boolean} True if value is an async function, otherwise false.
 */
const isAsyncFn = kindOfTest('AsyncFunction');

/**
 * Determines if a value is thenable (has then and catch methods).
 *
 * @param {*} thing - The value to test.
 * @returns {boolean} True if value is thenable, otherwise false.
 */
const isThenable = (thing) =>
  thing &&
  (isObject(thing) || isFunction$1(thing)) &&
  isFunction$1(thing.then) &&
  isFunction$1(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

/**
 * Provides a cross-platform setImmediate implementation.
 * Uses native setImmediate if available, otherwise falls back to postMessage or setTimeout.
 *
 * @param {boolean} setImmediateSupported - Whether setImmediate is supported.
 * @param {boolean} postMessageSupported - Whether postMessage is supported.
 * @returns {Function} A function to schedule a callback asynchronously.
 */
const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported
    ? ((token, callbacks) => {
        _global.addEventListener(
          'message',
          ({ source, data }) => {
            if (source === _global && data === token) {
              callbacks.length && callbacks.shift()();
            }
          },
          false
        );

        return (cb) => {
          callbacks.push(cb);
          _global.postMessage(token, '*');
        };
      })(`axios@${Math.random()}`, [])
    : (cb) => setTimeout(cb);
})(typeof setImmediate === 'function', isFunction$1(_global.postMessage));

/**
 * Schedules a microtask or asynchronous callback as soon as possible.
 * Uses queueMicrotask if available, otherwise falls back to process.nextTick or _setImmediate.
 *
 * @type {Function}
 */
const asap =
  typeof queueMicrotask !== 'undefined'
    ? queueMicrotask.bind(_global)
    : (typeof process !== 'undefined' && process.nextTick) || _setImmediate;

// *********************

const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);

var utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isReactNativeBlob,
  isReactNative,
  isBlob,
  isRegExp,
  isFunction: isFunction$1,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable,
};

let AxiosError$1 = class AxiosError extends Error {
  static from(error, code, config, request, response, customProps) {
    const axiosError = new AxiosError(error.message, code || error.code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;

    // Preserve status from the original error if not already set from response
    if (error.status != null && axiosError.status == null) {
      axiosError.status = error.status;
    }

    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  }

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     *
     * @returns {Error} The created error.
     */
    constructor(message, code, config, request, response) {
      super(message);
      
      // Make message enumerable to maintain backward compatibility
      // The native Error constructor sets message as non-enumerable,
      // but axios < v1.13.3 had it as enumerable
      Object.defineProperty(this, 'message', {
          value: message,
          enumerable: true,
          writable: true,
          configurable: true
      });
      
      this.name = 'AxiosError';
      this.isAxiosError = true;
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      if (response) {
          this.response = response;
          this.status = response.status;
      }
    }

  toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    };
  }
};

// This can be changed to static properties as soon as the parser options in .eslint.cjs are updated.
AxiosError$1.ERR_BAD_OPTION_VALUE = 'ERR_BAD_OPTION_VALUE';
AxiosError$1.ERR_BAD_OPTION = 'ERR_BAD_OPTION';
AxiosError$1.ECONNABORTED = 'ECONNABORTED';
AxiosError$1.ETIMEDOUT = 'ETIMEDOUT';
AxiosError$1.ERR_NETWORK = 'ERR_NETWORK';
AxiosError$1.ERR_FR_TOO_MANY_REDIRECTS = 'ERR_FR_TOO_MANY_REDIRECTS';
AxiosError$1.ERR_DEPRECATED = 'ERR_DEPRECATED';
AxiosError$1.ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE';
AxiosError$1.ERR_BAD_REQUEST = 'ERR_BAD_REQUEST';
AxiosError$1.ERR_CANCELED = 'ERR_CANCELED';
AxiosError$1.ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT';
AxiosError$1.ERR_INVALID_URL = 'ERR_INVALID_URL';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var delayed_stream;
var hasRequiredDelayed_stream;

function requireDelayed_stream () {
	if (hasRequiredDelayed_stream) return delayed_stream;
	hasRequiredDelayed_stream = 1;
	var Stream = stream.Stream;
	var util = require$$1;

	delayed_stream = DelayedStream;
	function DelayedStream() {
	  this.source = null;
	  this.dataSize = 0;
	  this.maxDataSize = 1024 * 1024;
	  this.pauseStream = true;

	  this._maxDataSizeExceeded = false;
	  this._released = false;
	  this._bufferedEvents = [];
	}
	util.inherits(DelayedStream, Stream);

	DelayedStream.create = function(source, options) {
	  var delayedStream = new this();

	  options = options || {};
	  for (var option in options) {
	    delayedStream[option] = options[option];
	  }

	  delayedStream.source = source;

	  var realEmit = source.emit;
	  source.emit = function() {
	    delayedStream._handleEmit(arguments);
	    return realEmit.apply(source, arguments);
	  };

	  source.on('error', function() {});
	  if (delayedStream.pauseStream) {
	    source.pause();
	  }

	  return delayedStream;
	};

	Object.defineProperty(DelayedStream.prototype, 'readable', {
	  configurable: true,
	  enumerable: true,
	  get: function() {
	    return this.source.readable;
	  }
	});

	DelayedStream.prototype.setEncoding = function() {
	  return this.source.setEncoding.apply(this.source, arguments);
	};

	DelayedStream.prototype.resume = function() {
	  if (!this._released) {
	    this.release();
	  }

	  this.source.resume();
	};

	DelayedStream.prototype.pause = function() {
	  this.source.pause();
	};

	DelayedStream.prototype.release = function() {
	  this._released = true;

	  this._bufferedEvents.forEach(function(args) {
	    this.emit.apply(this, args);
	  }.bind(this));
	  this._bufferedEvents = [];
	};

	DelayedStream.prototype.pipe = function() {
	  var r = Stream.prototype.pipe.apply(this, arguments);
	  this.resume();
	  return r;
	};

	DelayedStream.prototype._handleEmit = function(args) {
	  if (this._released) {
	    this.emit.apply(this, args);
	    return;
	  }

	  if (args[0] === 'data') {
	    this.dataSize += args[1].length;
	    this._checkIfMaxDataSizeExceeded();
	  }

	  this._bufferedEvents.push(args);
	};

	DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
	  if (this._maxDataSizeExceeded) {
	    return;
	  }

	  if (this.dataSize <= this.maxDataSize) {
	    return;
	  }

	  this._maxDataSizeExceeded = true;
	  var message =
	    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
	  this.emit('error', new Error(message));
	};
	return delayed_stream;
}

var combined_stream;
var hasRequiredCombined_stream;

function requireCombined_stream () {
	if (hasRequiredCombined_stream) return combined_stream;
	hasRequiredCombined_stream = 1;
	var util = require$$1;
	var Stream = stream.Stream;
	var DelayedStream = requireDelayed_stream();

	combined_stream = CombinedStream;
	function CombinedStream() {
	  this.writable = false;
	  this.readable = true;
	  this.dataSize = 0;
	  this.maxDataSize = 2 * 1024 * 1024;
	  this.pauseStreams = true;

	  this._released = false;
	  this._streams = [];
	  this._currentStream = null;
	  this._insideLoop = false;
	  this._pendingNext = false;
	}
	util.inherits(CombinedStream, Stream);

	CombinedStream.create = function(options) {
	  var combinedStream = new this();

	  options = options || {};
	  for (var option in options) {
	    combinedStream[option] = options[option];
	  }

	  return combinedStream;
	};

	CombinedStream.isStreamLike = function(stream) {
	  return (typeof stream !== 'function')
	    && (typeof stream !== 'string')
	    && (typeof stream !== 'boolean')
	    && (typeof stream !== 'number')
	    && (!Buffer.isBuffer(stream));
	};

	CombinedStream.prototype.append = function(stream) {
	  var isStreamLike = CombinedStream.isStreamLike(stream);

	  if (isStreamLike) {
	    if (!(stream instanceof DelayedStream)) {
	      var newStream = DelayedStream.create(stream, {
	        maxDataSize: Infinity,
	        pauseStream: this.pauseStreams,
	      });
	      stream.on('data', this._checkDataSize.bind(this));
	      stream = newStream;
	    }

	    this._handleErrors(stream);

	    if (this.pauseStreams) {
	      stream.pause();
	    }
	  }

	  this._streams.push(stream);
	  return this;
	};

	CombinedStream.prototype.pipe = function(dest, options) {
	  Stream.prototype.pipe.call(this, dest, options);
	  this.resume();
	  return dest;
	};

	CombinedStream.prototype._getNext = function() {
	  this._currentStream = null;

	  if (this._insideLoop) {
	    this._pendingNext = true;
	    return; // defer call
	  }

	  this._insideLoop = true;
	  try {
	    do {
	      this._pendingNext = false;
	      this._realGetNext();
	    } while (this._pendingNext);
	  } finally {
	    this._insideLoop = false;
	  }
	};

	CombinedStream.prototype._realGetNext = function() {
	  var stream = this._streams.shift();


	  if (typeof stream == 'undefined') {
	    this.end();
	    return;
	  }

	  if (typeof stream !== 'function') {
	    this._pipeNext(stream);
	    return;
	  }

	  var getStream = stream;
	  getStream(function(stream) {
	    var isStreamLike = CombinedStream.isStreamLike(stream);
	    if (isStreamLike) {
	      stream.on('data', this._checkDataSize.bind(this));
	      this._handleErrors(stream);
	    }

	    this._pipeNext(stream);
	  }.bind(this));
	};

	CombinedStream.prototype._pipeNext = function(stream) {
	  this._currentStream = stream;

	  var isStreamLike = CombinedStream.isStreamLike(stream);
	  if (isStreamLike) {
	    stream.on('end', this._getNext.bind(this));
	    stream.pipe(this, {end: false});
	    return;
	  }

	  var value = stream;
	  this.write(value);
	  this._getNext();
	};

	CombinedStream.prototype._handleErrors = function(stream) {
	  var self = this;
	  stream.on('error', function(err) {
	    self._emitError(err);
	  });
	};

	CombinedStream.prototype.write = function(data) {
	  this.emit('data', data);
	};

	CombinedStream.prototype.pause = function() {
	  if (!this.pauseStreams) {
	    return;
	  }

	  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
	  this.emit('pause');
	};

	CombinedStream.prototype.resume = function() {
	  if (!this._released) {
	    this._released = true;
	    this.writable = true;
	    this._getNext();
	  }

	  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
	  this.emit('resume');
	};

	CombinedStream.prototype.end = function() {
	  this._reset();
	  this.emit('end');
	};

	CombinedStream.prototype.destroy = function() {
	  this._reset();
	  this.emit('close');
	};

	CombinedStream.prototype._reset = function() {
	  this.writable = false;
	  this._streams = [];
	  this._currentStream = null;
	};

	CombinedStream.prototype._checkDataSize = function() {
	  this._updateDataSize();
	  if (this.dataSize <= this.maxDataSize) {
	    return;
	  }

	  var message =
	    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
	  this._emitError(new Error(message));
	};

	CombinedStream.prototype._updateDataSize = function() {
	  this.dataSize = 0;

	  var self = this;
	  this._streams.forEach(function(stream) {
	    if (!stream.dataSize) {
	      return;
	    }

	    self.dataSize += stream.dataSize;
	  });

	  if (this._currentStream && this._currentStream.dataSize) {
	    this.dataSize += this._currentStream.dataSize;
	  }
	};

	CombinedStream.prototype._emitError = function(err) {
	  this._reset();
	  this.emit('error', err);
	};
	return combined_stream;
}

var mimeTypes = {};

var require$$0 = {
	"application/1d-interleaved-parityfec": {
	source: "iana"
},
	"application/3gpdash-qoe-report+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/3gpp-ims+xml": {
	source: "iana",
	compressible: true
},
	"application/3gpphal+json": {
	source: "iana",
	compressible: true
},
	"application/3gpphalforms+json": {
	source: "iana",
	compressible: true
},
	"application/a2l": {
	source: "iana"
},
	"application/ace+cbor": {
	source: "iana"
},
	"application/activemessage": {
	source: "iana"
},
	"application/activity+json": {
	source: "iana",
	compressible: true
},
	"application/alto-costmap+json": {
	source: "iana",
	compressible: true
},
	"application/alto-costmapfilter+json": {
	source: "iana",
	compressible: true
},
	"application/alto-directory+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointcost+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointcostparams+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointprop+json": {
	source: "iana",
	compressible: true
},
	"application/alto-endpointpropparams+json": {
	source: "iana",
	compressible: true
},
	"application/alto-error+json": {
	source: "iana",
	compressible: true
},
	"application/alto-networkmap+json": {
	source: "iana",
	compressible: true
},
	"application/alto-networkmapfilter+json": {
	source: "iana",
	compressible: true
},
	"application/alto-updatestreamcontrol+json": {
	source: "iana",
	compressible: true
},
	"application/alto-updatestreamparams+json": {
	source: "iana",
	compressible: true
},
	"application/aml": {
	source: "iana"
},
	"application/andrew-inset": {
	source: "iana",
	extensions: [
		"ez"
	]
},
	"application/applefile": {
	source: "iana"
},
	"application/applixware": {
	source: "apache",
	extensions: [
		"aw"
	]
},
	"application/at+jwt": {
	source: "iana"
},
	"application/atf": {
	source: "iana"
},
	"application/atfx": {
	source: "iana"
},
	"application/atom+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atom"
	]
},
	"application/atomcat+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomcat"
	]
},
	"application/atomdeleted+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomdeleted"
	]
},
	"application/atomicmail": {
	source: "iana"
},
	"application/atomsvc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"atomsvc"
	]
},
	"application/atsc-dwd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dwd"
	]
},
	"application/atsc-dynamic-event-message": {
	source: "iana"
},
	"application/atsc-held+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"held"
	]
},
	"application/atsc-rdt+json": {
	source: "iana",
	compressible: true
},
	"application/atsc-rsat+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rsat"
	]
},
	"application/atxml": {
	source: "iana"
},
	"application/auth-policy+xml": {
	source: "iana",
	compressible: true
},
	"application/bacnet-xdd+zip": {
	source: "iana",
	compressible: false
},
	"application/batch-smtp": {
	source: "iana"
},
	"application/bdoc": {
	compressible: false,
	extensions: [
		"bdoc"
	]
},
	"application/beep+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/calendar+json": {
	source: "iana",
	compressible: true
},
	"application/calendar+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xcs"
	]
},
	"application/call-completion": {
	source: "iana"
},
	"application/cals-1840": {
	source: "iana"
},
	"application/captive+json": {
	source: "iana",
	compressible: true
},
	"application/cbor": {
	source: "iana"
},
	"application/cbor-seq": {
	source: "iana"
},
	"application/cccex": {
	source: "iana"
},
	"application/ccmp+xml": {
	source: "iana",
	compressible: true
},
	"application/ccxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ccxml"
	]
},
	"application/cdfx+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"cdfx"
	]
},
	"application/cdmi-capability": {
	source: "iana",
	extensions: [
		"cdmia"
	]
},
	"application/cdmi-container": {
	source: "iana",
	extensions: [
		"cdmic"
	]
},
	"application/cdmi-domain": {
	source: "iana",
	extensions: [
		"cdmid"
	]
},
	"application/cdmi-object": {
	source: "iana",
	extensions: [
		"cdmio"
	]
},
	"application/cdmi-queue": {
	source: "iana",
	extensions: [
		"cdmiq"
	]
},
	"application/cdni": {
	source: "iana"
},
	"application/cea": {
	source: "iana"
},
	"application/cea-2018+xml": {
	source: "iana",
	compressible: true
},
	"application/cellml+xml": {
	source: "iana",
	compressible: true
},
	"application/cfw": {
	source: "iana"
},
	"application/city+json": {
	source: "iana",
	compressible: true
},
	"application/clr": {
	source: "iana"
},
	"application/clue+xml": {
	source: "iana",
	compressible: true
},
	"application/clue_info+xml": {
	source: "iana",
	compressible: true
},
	"application/cms": {
	source: "iana"
},
	"application/cnrp+xml": {
	source: "iana",
	compressible: true
},
	"application/coap-group+json": {
	source: "iana",
	compressible: true
},
	"application/coap-payload": {
	source: "iana"
},
	"application/commonground": {
	source: "iana"
},
	"application/conference-info+xml": {
	source: "iana",
	compressible: true
},
	"application/cose": {
	source: "iana"
},
	"application/cose-key": {
	source: "iana"
},
	"application/cose-key-set": {
	source: "iana"
},
	"application/cpl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"cpl"
	]
},
	"application/csrattrs": {
	source: "iana"
},
	"application/csta+xml": {
	source: "iana",
	compressible: true
},
	"application/cstadata+xml": {
	source: "iana",
	compressible: true
},
	"application/csvm+json": {
	source: "iana",
	compressible: true
},
	"application/cu-seeme": {
	source: "apache",
	extensions: [
		"cu"
	]
},
	"application/cwt": {
	source: "iana"
},
	"application/cybercash": {
	source: "iana"
},
	"application/dart": {
	compressible: true
},
	"application/dash+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpd"
	]
},
	"application/dash-patch+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpp"
	]
},
	"application/dashdelta": {
	source: "iana"
},
	"application/davmount+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"davmount"
	]
},
	"application/dca-rft": {
	source: "iana"
},
	"application/dcd": {
	source: "iana"
},
	"application/dec-dx": {
	source: "iana"
},
	"application/dialog-info+xml": {
	source: "iana",
	compressible: true
},
	"application/dicom": {
	source: "iana"
},
	"application/dicom+json": {
	source: "iana",
	compressible: true
},
	"application/dicom+xml": {
	source: "iana",
	compressible: true
},
	"application/dii": {
	source: "iana"
},
	"application/dit": {
	source: "iana"
},
	"application/dns": {
	source: "iana"
},
	"application/dns+json": {
	source: "iana",
	compressible: true
},
	"application/dns-message": {
	source: "iana"
},
	"application/docbook+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"dbk"
	]
},
	"application/dots+cbor": {
	source: "iana"
},
	"application/dskpp+xml": {
	source: "iana",
	compressible: true
},
	"application/dssc+der": {
	source: "iana",
	extensions: [
		"dssc"
	]
},
	"application/dssc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdssc"
	]
},
	"application/dvcs": {
	source: "iana"
},
	"application/ecmascript": {
	source: "iana",
	compressible: true,
	extensions: [
		"es",
		"ecma"
	]
},
	"application/edi-consent": {
	source: "iana"
},
	"application/edi-x12": {
	source: "iana",
	compressible: false
},
	"application/edifact": {
	source: "iana",
	compressible: false
},
	"application/efi": {
	source: "iana"
},
	"application/elm+json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/elm+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.cap+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/emergencycalldata.comment+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.control+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.deviceinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.ecall.msd": {
	source: "iana"
},
	"application/emergencycalldata.providerinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.serviceinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.subscriberinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/emergencycalldata.veds+xml": {
	source: "iana",
	compressible: true
},
	"application/emma+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"emma"
	]
},
	"application/emotionml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"emotionml"
	]
},
	"application/encaprtp": {
	source: "iana"
},
	"application/epp+xml": {
	source: "iana",
	compressible: true
},
	"application/epub+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"epub"
	]
},
	"application/eshop": {
	source: "iana"
},
	"application/exi": {
	source: "iana",
	extensions: [
		"exi"
	]
},
	"application/expect-ct-report+json": {
	source: "iana",
	compressible: true
},
	"application/express": {
	source: "iana",
	extensions: [
		"exp"
	]
},
	"application/fastinfoset": {
	source: "iana"
},
	"application/fastsoap": {
	source: "iana"
},
	"application/fdt+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"fdt"
	]
},
	"application/fhir+json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/fhir+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/fido.trusted-apps+json": {
	compressible: true
},
	"application/fits": {
	source: "iana"
},
	"application/flexfec": {
	source: "iana"
},
	"application/font-sfnt": {
	source: "iana"
},
	"application/font-tdpfr": {
	source: "iana",
	extensions: [
		"pfr"
	]
},
	"application/font-woff": {
	source: "iana",
	compressible: false
},
	"application/framework-attributes+xml": {
	source: "iana",
	compressible: true
},
	"application/geo+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"geojson"
	]
},
	"application/geo+json-seq": {
	source: "iana"
},
	"application/geopackage+sqlite3": {
	source: "iana"
},
	"application/geoxacml+xml": {
	source: "iana",
	compressible: true
},
	"application/gltf-buffer": {
	source: "iana"
},
	"application/gml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"gml"
	]
},
	"application/gpx+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"gpx"
	]
},
	"application/gxf": {
	source: "apache",
	extensions: [
		"gxf"
	]
},
	"application/gzip": {
	source: "iana",
	compressible: false,
	extensions: [
		"gz"
	]
},
	"application/h224": {
	source: "iana"
},
	"application/held+xml": {
	source: "iana",
	compressible: true
},
	"application/hjson": {
	extensions: [
		"hjson"
	]
},
	"application/http": {
	source: "iana"
},
	"application/hyperstudio": {
	source: "iana",
	extensions: [
		"stk"
	]
},
	"application/ibe-key-request+xml": {
	source: "iana",
	compressible: true
},
	"application/ibe-pkg-reply+xml": {
	source: "iana",
	compressible: true
},
	"application/ibe-pp-data": {
	source: "iana"
},
	"application/iges": {
	source: "iana"
},
	"application/im-iscomposing+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/index": {
	source: "iana"
},
	"application/index.cmd": {
	source: "iana"
},
	"application/index.obj": {
	source: "iana"
},
	"application/index.response": {
	source: "iana"
},
	"application/index.vnd": {
	source: "iana"
},
	"application/inkml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ink",
		"inkml"
	]
},
	"application/iotp": {
	source: "iana"
},
	"application/ipfix": {
	source: "iana",
	extensions: [
		"ipfix"
	]
},
	"application/ipp": {
	source: "iana"
},
	"application/isup": {
	source: "iana"
},
	"application/its+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"its"
	]
},
	"application/java-archive": {
	source: "apache",
	compressible: false,
	extensions: [
		"jar",
		"war",
		"ear"
	]
},
	"application/java-serialized-object": {
	source: "apache",
	compressible: false,
	extensions: [
		"ser"
	]
},
	"application/java-vm": {
	source: "apache",
	compressible: false,
	extensions: [
		"class"
	]
},
	"application/javascript": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"js",
		"mjs"
	]
},
	"application/jf2feed+json": {
	source: "iana",
	compressible: true
},
	"application/jose": {
	source: "iana"
},
	"application/jose+json": {
	source: "iana",
	compressible: true
},
	"application/jrd+json": {
	source: "iana",
	compressible: true
},
	"application/jscalendar+json": {
	source: "iana",
	compressible: true
},
	"application/json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"json",
		"map"
	]
},
	"application/json-patch+json": {
	source: "iana",
	compressible: true
},
	"application/json-seq": {
	source: "iana"
},
	"application/json5": {
	extensions: [
		"json5"
	]
},
	"application/jsonml+json": {
	source: "apache",
	compressible: true,
	extensions: [
		"jsonml"
	]
},
	"application/jwk+json": {
	source: "iana",
	compressible: true
},
	"application/jwk-set+json": {
	source: "iana",
	compressible: true
},
	"application/jwt": {
	source: "iana"
},
	"application/kpml-request+xml": {
	source: "iana",
	compressible: true
},
	"application/kpml-response+xml": {
	source: "iana",
	compressible: true
},
	"application/ld+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"jsonld"
	]
},
	"application/lgr+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lgr"
	]
},
	"application/link-format": {
	source: "iana"
},
	"application/load-control+xml": {
	source: "iana",
	compressible: true
},
	"application/lost+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lostxml"
	]
},
	"application/lostsync+xml": {
	source: "iana",
	compressible: true
},
	"application/lpf+zip": {
	source: "iana",
	compressible: false
},
	"application/lxf": {
	source: "iana"
},
	"application/mac-binhex40": {
	source: "iana",
	extensions: [
		"hqx"
	]
},
	"application/mac-compactpro": {
	source: "apache",
	extensions: [
		"cpt"
	]
},
	"application/macwriteii": {
	source: "iana"
},
	"application/mads+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mads"
	]
},
	"application/manifest+json": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"webmanifest"
	]
},
	"application/marc": {
	source: "iana",
	extensions: [
		"mrc"
	]
},
	"application/marcxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mrcx"
	]
},
	"application/mathematica": {
	source: "iana",
	extensions: [
		"ma",
		"nb",
		"mb"
	]
},
	"application/mathml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mathml"
	]
},
	"application/mathml-content+xml": {
	source: "iana",
	compressible: true
},
	"application/mathml-presentation+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-associated-procedure-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-deregister+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-envelope+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-msk+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-msk-response+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-protection-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-reception-report+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-register+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-register-response+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-schedule+xml": {
	source: "iana",
	compressible: true
},
	"application/mbms-user-service-description+xml": {
	source: "iana",
	compressible: true
},
	"application/mbox": {
	source: "iana",
	extensions: [
		"mbox"
	]
},
	"application/media-policy-dataset+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpf"
	]
},
	"application/media_control+xml": {
	source: "iana",
	compressible: true
},
	"application/mediaservercontrol+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mscml"
	]
},
	"application/merge-patch+json": {
	source: "iana",
	compressible: true
},
	"application/metalink+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"metalink"
	]
},
	"application/metalink4+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"meta4"
	]
},
	"application/mets+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mets"
	]
},
	"application/mf4": {
	source: "iana"
},
	"application/mikey": {
	source: "iana"
},
	"application/mipc": {
	source: "iana"
},
	"application/missing-blocks+cbor-seq": {
	source: "iana"
},
	"application/mmt-aei+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"maei"
	]
},
	"application/mmt-usd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"musd"
	]
},
	"application/mods+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mods"
	]
},
	"application/moss-keys": {
	source: "iana"
},
	"application/moss-signature": {
	source: "iana"
},
	"application/mosskey-data": {
	source: "iana"
},
	"application/mosskey-request": {
	source: "iana"
},
	"application/mp21": {
	source: "iana",
	extensions: [
		"m21",
		"mp21"
	]
},
	"application/mp4": {
	source: "iana",
	extensions: [
		"mp4s",
		"m4p"
	]
},
	"application/mpeg4-generic": {
	source: "iana"
},
	"application/mpeg4-iod": {
	source: "iana"
},
	"application/mpeg4-iod-xmt": {
	source: "iana"
},
	"application/mrb-consumer+xml": {
	source: "iana",
	compressible: true
},
	"application/mrb-publish+xml": {
	source: "iana",
	compressible: true
},
	"application/msc-ivr+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/msc-mixer+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/msword": {
	source: "iana",
	compressible: false,
	extensions: [
		"doc",
		"dot"
	]
},
	"application/mud+json": {
	source: "iana",
	compressible: true
},
	"application/multipart-core": {
	source: "iana"
},
	"application/mxf": {
	source: "iana",
	extensions: [
		"mxf"
	]
},
	"application/n-quads": {
	source: "iana",
	extensions: [
		"nq"
	]
},
	"application/n-triples": {
	source: "iana",
	extensions: [
		"nt"
	]
},
	"application/nasdata": {
	source: "iana"
},
	"application/news-checkgroups": {
	source: "iana",
	charset: "US-ASCII"
},
	"application/news-groupinfo": {
	source: "iana",
	charset: "US-ASCII"
},
	"application/news-transmission": {
	source: "iana"
},
	"application/nlsml+xml": {
	source: "iana",
	compressible: true
},
	"application/node": {
	source: "iana",
	extensions: [
		"cjs"
	]
},
	"application/nss": {
	source: "iana"
},
	"application/oauth-authz-req+jwt": {
	source: "iana"
},
	"application/oblivious-dns-message": {
	source: "iana"
},
	"application/ocsp-request": {
	source: "iana"
},
	"application/ocsp-response": {
	source: "iana"
},
	"application/octet-stream": {
	source: "iana",
	compressible: false,
	extensions: [
		"bin",
		"dms",
		"lrf",
		"mar",
		"so",
		"dist",
		"distz",
		"pkg",
		"bpk",
		"dump",
		"elc",
		"deploy",
		"exe",
		"dll",
		"deb",
		"dmg",
		"iso",
		"img",
		"msi",
		"msp",
		"msm",
		"buffer"
	]
},
	"application/oda": {
	source: "iana",
	extensions: [
		"oda"
	]
},
	"application/odm+xml": {
	source: "iana",
	compressible: true
},
	"application/odx": {
	source: "iana"
},
	"application/oebps-package+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"opf"
	]
},
	"application/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"ogx"
	]
},
	"application/omdoc+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"omdoc"
	]
},
	"application/onenote": {
	source: "apache",
	extensions: [
		"onetoc",
		"onetoc2",
		"onetmp",
		"onepkg"
	]
},
	"application/opc-nodeset+xml": {
	source: "iana",
	compressible: true
},
	"application/oscore": {
	source: "iana"
},
	"application/oxps": {
	source: "iana",
	extensions: [
		"oxps"
	]
},
	"application/p21": {
	source: "iana"
},
	"application/p21+zip": {
	source: "iana",
	compressible: false
},
	"application/p2p-overlay+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"relo"
	]
},
	"application/parityfec": {
	source: "iana"
},
	"application/passport": {
	source: "iana"
},
	"application/patch-ops-error+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xer"
	]
},
	"application/pdf": {
	source: "iana",
	compressible: false,
	extensions: [
		"pdf"
	]
},
	"application/pdx": {
	source: "iana"
},
	"application/pem-certificate-chain": {
	source: "iana"
},
	"application/pgp-encrypted": {
	source: "iana",
	compressible: false,
	extensions: [
		"pgp"
	]
},
	"application/pgp-keys": {
	source: "iana",
	extensions: [
		"asc"
	]
},
	"application/pgp-signature": {
	source: "iana",
	extensions: [
		"asc",
		"sig"
	]
},
	"application/pics-rules": {
	source: "apache",
	extensions: [
		"prf"
	]
},
	"application/pidf+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/pidf-diff+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/pkcs10": {
	source: "iana",
	extensions: [
		"p10"
	]
},
	"application/pkcs12": {
	source: "iana"
},
	"application/pkcs7-mime": {
	source: "iana",
	extensions: [
		"p7m",
		"p7c"
	]
},
	"application/pkcs7-signature": {
	source: "iana",
	extensions: [
		"p7s"
	]
},
	"application/pkcs8": {
	source: "iana",
	extensions: [
		"p8"
	]
},
	"application/pkcs8-encrypted": {
	source: "iana"
},
	"application/pkix-attr-cert": {
	source: "iana",
	extensions: [
		"ac"
	]
},
	"application/pkix-cert": {
	source: "iana",
	extensions: [
		"cer"
	]
},
	"application/pkix-crl": {
	source: "iana",
	extensions: [
		"crl"
	]
},
	"application/pkix-pkipath": {
	source: "iana",
	extensions: [
		"pkipath"
	]
},
	"application/pkixcmp": {
	source: "iana",
	extensions: [
		"pki"
	]
},
	"application/pls+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"pls"
	]
},
	"application/poc-settings+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/postscript": {
	source: "iana",
	compressible: true,
	extensions: [
		"ai",
		"eps",
		"ps"
	]
},
	"application/ppsp-tracker+json": {
	source: "iana",
	compressible: true
},
	"application/problem+json": {
	source: "iana",
	compressible: true
},
	"application/problem+xml": {
	source: "iana",
	compressible: true
},
	"application/provenance+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"provx"
	]
},
	"application/prs.alvestrand.titrax-sheet": {
	source: "iana"
},
	"application/prs.cww": {
	source: "iana",
	extensions: [
		"cww"
	]
},
	"application/prs.cyn": {
	source: "iana",
	charset: "7-BIT"
},
	"application/prs.hpub+zip": {
	source: "iana",
	compressible: false
},
	"application/prs.nprend": {
	source: "iana"
},
	"application/prs.plucker": {
	source: "iana"
},
	"application/prs.rdf-xml-crypt": {
	source: "iana"
},
	"application/prs.xsf+xml": {
	source: "iana",
	compressible: true
},
	"application/pskc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"pskcxml"
	]
},
	"application/pvd+json": {
	source: "iana",
	compressible: true
},
	"application/qsig": {
	source: "iana"
},
	"application/raml+yaml": {
	compressible: true,
	extensions: [
		"raml"
	]
},
	"application/raptorfec": {
	source: "iana"
},
	"application/rdap+json": {
	source: "iana",
	compressible: true
},
	"application/rdf+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rdf",
		"owl"
	]
},
	"application/reginfo+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rif"
	]
},
	"application/relax-ng-compact-syntax": {
	source: "iana",
	extensions: [
		"rnc"
	]
},
	"application/remote-printing": {
	source: "iana"
},
	"application/reputon+json": {
	source: "iana",
	compressible: true
},
	"application/resource-lists+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rl"
	]
},
	"application/resource-lists-diff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rld"
	]
},
	"application/rfc+xml": {
	source: "iana",
	compressible: true
},
	"application/riscos": {
	source: "iana"
},
	"application/rlmi+xml": {
	source: "iana",
	compressible: true
},
	"application/rls-services+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rs"
	]
},
	"application/route-apd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rapd"
	]
},
	"application/route-s-tsid+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sls"
	]
},
	"application/route-usd+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rusd"
	]
},
	"application/rpki-ghostbusters": {
	source: "iana",
	extensions: [
		"gbr"
	]
},
	"application/rpki-manifest": {
	source: "iana",
	extensions: [
		"mft"
	]
},
	"application/rpki-publication": {
	source: "iana"
},
	"application/rpki-roa": {
	source: "iana",
	extensions: [
		"roa"
	]
},
	"application/rpki-updown": {
	source: "iana"
},
	"application/rsd+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"rsd"
	]
},
	"application/rss+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"rss"
	]
},
	"application/rtf": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtf"
	]
},
	"application/rtploopback": {
	source: "iana"
},
	"application/rtx": {
	source: "iana"
},
	"application/samlassertion+xml": {
	source: "iana",
	compressible: true
},
	"application/samlmetadata+xml": {
	source: "iana",
	compressible: true
},
	"application/sarif+json": {
	source: "iana",
	compressible: true
},
	"application/sarif-external-properties+json": {
	source: "iana",
	compressible: true
},
	"application/sbe": {
	source: "iana"
},
	"application/sbml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sbml"
	]
},
	"application/scaip+xml": {
	source: "iana",
	compressible: true
},
	"application/scim+json": {
	source: "iana",
	compressible: true
},
	"application/scvp-cv-request": {
	source: "iana",
	extensions: [
		"scq"
	]
},
	"application/scvp-cv-response": {
	source: "iana",
	extensions: [
		"scs"
	]
},
	"application/scvp-vp-request": {
	source: "iana",
	extensions: [
		"spq"
	]
},
	"application/scvp-vp-response": {
	source: "iana",
	extensions: [
		"spp"
	]
},
	"application/sdp": {
	source: "iana",
	extensions: [
		"sdp"
	]
},
	"application/secevent+jwt": {
	source: "iana"
},
	"application/senml+cbor": {
	source: "iana"
},
	"application/senml+json": {
	source: "iana",
	compressible: true
},
	"application/senml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"senmlx"
	]
},
	"application/senml-etch+cbor": {
	source: "iana"
},
	"application/senml-etch+json": {
	source: "iana",
	compressible: true
},
	"application/senml-exi": {
	source: "iana"
},
	"application/sensml+cbor": {
	source: "iana"
},
	"application/sensml+json": {
	source: "iana",
	compressible: true
},
	"application/sensml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sensmlx"
	]
},
	"application/sensml-exi": {
	source: "iana"
},
	"application/sep+xml": {
	source: "iana",
	compressible: true
},
	"application/sep-exi": {
	source: "iana"
},
	"application/session-info": {
	source: "iana"
},
	"application/set-payment": {
	source: "iana"
},
	"application/set-payment-initiation": {
	source: "iana",
	extensions: [
		"setpay"
	]
},
	"application/set-registration": {
	source: "iana"
},
	"application/set-registration-initiation": {
	source: "iana",
	extensions: [
		"setreg"
	]
},
	"application/sgml": {
	source: "iana"
},
	"application/sgml-open-catalog": {
	source: "iana"
},
	"application/shf+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"shf"
	]
},
	"application/sieve": {
	source: "iana",
	extensions: [
		"siv",
		"sieve"
	]
},
	"application/simple-filter+xml": {
	source: "iana",
	compressible: true
},
	"application/simple-message-summary": {
	source: "iana"
},
	"application/simplesymbolcontainer": {
	source: "iana"
},
	"application/sipc": {
	source: "iana"
},
	"application/slate": {
	source: "iana"
},
	"application/smil": {
	source: "iana"
},
	"application/smil+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"smi",
		"smil"
	]
},
	"application/smpte336m": {
	source: "iana"
},
	"application/soap+fastinfoset": {
	source: "iana"
},
	"application/soap+xml": {
	source: "iana",
	compressible: true
},
	"application/sparql-query": {
	source: "iana",
	extensions: [
		"rq"
	]
},
	"application/sparql-results+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"srx"
	]
},
	"application/spdx+json": {
	source: "iana",
	compressible: true
},
	"application/spirits-event+xml": {
	source: "iana",
	compressible: true
},
	"application/sql": {
	source: "iana"
},
	"application/srgs": {
	source: "iana",
	extensions: [
		"gram"
	]
},
	"application/srgs+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"grxml"
	]
},
	"application/sru+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sru"
	]
},
	"application/ssdl+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"ssdl"
	]
},
	"application/ssml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ssml"
	]
},
	"application/stix+json": {
	source: "iana",
	compressible: true
},
	"application/swid+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"swidtag"
	]
},
	"application/tamp-apex-update": {
	source: "iana"
},
	"application/tamp-apex-update-confirm": {
	source: "iana"
},
	"application/tamp-community-update": {
	source: "iana"
},
	"application/tamp-community-update-confirm": {
	source: "iana"
},
	"application/tamp-error": {
	source: "iana"
},
	"application/tamp-sequence-adjust": {
	source: "iana"
},
	"application/tamp-sequence-adjust-confirm": {
	source: "iana"
},
	"application/tamp-status-query": {
	source: "iana"
},
	"application/tamp-status-response": {
	source: "iana"
},
	"application/tamp-update": {
	source: "iana"
},
	"application/tamp-update-confirm": {
	source: "iana"
},
	"application/tar": {
	compressible: true
},
	"application/taxii+json": {
	source: "iana",
	compressible: true
},
	"application/td+json": {
	source: "iana",
	compressible: true
},
	"application/tei+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"tei",
		"teicorpus"
	]
},
	"application/tetra_isi": {
	source: "iana"
},
	"application/thraud+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"tfi"
	]
},
	"application/timestamp-query": {
	source: "iana"
},
	"application/timestamp-reply": {
	source: "iana"
},
	"application/timestamped-data": {
	source: "iana",
	extensions: [
		"tsd"
	]
},
	"application/tlsrpt+gzip": {
	source: "iana"
},
	"application/tlsrpt+json": {
	source: "iana",
	compressible: true
},
	"application/tnauthlist": {
	source: "iana"
},
	"application/token-introspection+jwt": {
	source: "iana"
},
	"application/toml": {
	compressible: true,
	extensions: [
		"toml"
	]
},
	"application/trickle-ice-sdpfrag": {
	source: "iana"
},
	"application/trig": {
	source: "iana",
	extensions: [
		"trig"
	]
},
	"application/ttml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ttml"
	]
},
	"application/tve-trigger": {
	source: "iana"
},
	"application/tzif": {
	source: "iana"
},
	"application/tzif-leap": {
	source: "iana"
},
	"application/ubjson": {
	compressible: false,
	extensions: [
		"ubj"
	]
},
	"application/ulpfec": {
	source: "iana"
},
	"application/urc-grpsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/urc-ressheet+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"rsheet"
	]
},
	"application/urc-targetdesc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"td"
	]
},
	"application/urc-uisocketdesc+xml": {
	source: "iana",
	compressible: true
},
	"application/vcard+json": {
	source: "iana",
	compressible: true
},
	"application/vcard+xml": {
	source: "iana",
	compressible: true
},
	"application/vemmi": {
	source: "iana"
},
	"application/vividence.scriptfile": {
	source: "apache"
},
	"application/vnd.1000minds.decision-model+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"1km"
	]
},
	"application/vnd.3gpp-prose+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp-prose-pc3ch+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp-v2x-local-service-information": {
	source: "iana"
},
	"application/vnd.3gpp.5gnas": {
	source: "iana"
},
	"application/vnd.3gpp.access-transfer-events+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.bsf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.gmop+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.gtpc": {
	source: "iana"
},
	"application/vnd.3gpp.interworking-data": {
	source: "iana"
},
	"application/vnd.3gpp.lpp": {
	source: "iana"
},
	"application/vnd.3gpp.mc-signalling-ear": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-payload": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-signalling": {
	source: "iana"
},
	"application/vnd.3gpp.mcdata-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcdata-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-floor-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-location-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-signed+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-ue-init-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcptt-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-affiliation-command+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-affiliation-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-location-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-service-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-transmission-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-ue-config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mcvideo-user-profile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.mid-call+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.ngap": {
	source: "iana"
},
	"application/vnd.3gpp.pfcp": {
	source: "iana"
},
	"application/vnd.3gpp.pic-bw-large": {
	source: "iana",
	extensions: [
		"plb"
	]
},
	"application/vnd.3gpp.pic-bw-small": {
	source: "iana",
	extensions: [
		"psb"
	]
},
	"application/vnd.3gpp.pic-bw-var": {
	source: "iana",
	extensions: [
		"pvb"
	]
},
	"application/vnd.3gpp.s1ap": {
	source: "iana"
},
	"application/vnd.3gpp.sms": {
	source: "iana"
},
	"application/vnd.3gpp.sms+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.srvcc-ext+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.srvcc-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.state-and-event-info+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp.ussd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp2.bcmcsinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.3gpp2.sms": {
	source: "iana"
},
	"application/vnd.3gpp2.tcap": {
	source: "iana",
	extensions: [
		"tcap"
	]
},
	"application/vnd.3lightssoftware.imagescal": {
	source: "iana"
},
	"application/vnd.3m.post-it-notes": {
	source: "iana",
	extensions: [
		"pwn"
	]
},
	"application/vnd.accpac.simply.aso": {
	source: "iana",
	extensions: [
		"aso"
	]
},
	"application/vnd.accpac.simply.imp": {
	source: "iana",
	extensions: [
		"imp"
	]
},
	"application/vnd.acucobol": {
	source: "iana",
	extensions: [
		"acu"
	]
},
	"application/vnd.acucorp": {
	source: "iana",
	extensions: [
		"atc",
		"acutc"
	]
},
	"application/vnd.adobe.air-application-installer-package+zip": {
	source: "apache",
	compressible: false,
	extensions: [
		"air"
	]
},
	"application/vnd.adobe.flash.movie": {
	source: "iana"
},
	"application/vnd.adobe.formscentral.fcdt": {
	source: "iana",
	extensions: [
		"fcdt"
	]
},
	"application/vnd.adobe.fxp": {
	source: "iana",
	extensions: [
		"fxp",
		"fxpl"
	]
},
	"application/vnd.adobe.partial-upload": {
	source: "iana"
},
	"application/vnd.adobe.xdp+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdp"
	]
},
	"application/vnd.adobe.xfdf": {
	source: "iana",
	extensions: [
		"xfdf"
	]
},
	"application/vnd.aether.imp": {
	source: "iana"
},
	"application/vnd.afpc.afplinedata": {
	source: "iana"
},
	"application/vnd.afpc.afplinedata-pagedef": {
	source: "iana"
},
	"application/vnd.afpc.cmoca-cmresource": {
	source: "iana"
},
	"application/vnd.afpc.foca-charset": {
	source: "iana"
},
	"application/vnd.afpc.foca-codedfont": {
	source: "iana"
},
	"application/vnd.afpc.foca-codepage": {
	source: "iana"
},
	"application/vnd.afpc.modca": {
	source: "iana"
},
	"application/vnd.afpc.modca-cmtable": {
	source: "iana"
},
	"application/vnd.afpc.modca-formdef": {
	source: "iana"
},
	"application/vnd.afpc.modca-mediummap": {
	source: "iana"
},
	"application/vnd.afpc.modca-objectcontainer": {
	source: "iana"
},
	"application/vnd.afpc.modca-overlay": {
	source: "iana"
},
	"application/vnd.afpc.modca-pagesegment": {
	source: "iana"
},
	"application/vnd.age": {
	source: "iana",
	extensions: [
		"age"
	]
},
	"application/vnd.ah-barcode": {
	source: "iana"
},
	"application/vnd.ahead.space": {
	source: "iana",
	extensions: [
		"ahead"
	]
},
	"application/vnd.airzip.filesecure.azf": {
	source: "iana",
	extensions: [
		"azf"
	]
},
	"application/vnd.airzip.filesecure.azs": {
	source: "iana",
	extensions: [
		"azs"
	]
},
	"application/vnd.amadeus+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.amazon.ebook": {
	source: "apache",
	extensions: [
		"azw"
	]
},
	"application/vnd.amazon.mobi8-ebook": {
	source: "iana"
},
	"application/vnd.americandynamics.acc": {
	source: "iana",
	extensions: [
		"acc"
	]
},
	"application/vnd.amiga.ami": {
	source: "iana",
	extensions: [
		"ami"
	]
},
	"application/vnd.amundsen.maze+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.android.ota": {
	source: "iana"
},
	"application/vnd.android.package-archive": {
	source: "apache",
	compressible: false,
	extensions: [
		"apk"
	]
},
	"application/vnd.anki": {
	source: "iana"
},
	"application/vnd.anser-web-certificate-issue-initiation": {
	source: "iana",
	extensions: [
		"cii"
	]
},
	"application/vnd.anser-web-funds-transfer-initiation": {
	source: "apache",
	extensions: [
		"fti"
	]
},
	"application/vnd.antix.game-component": {
	source: "iana",
	extensions: [
		"atx"
	]
},
	"application/vnd.apache.arrow.file": {
	source: "iana"
},
	"application/vnd.apache.arrow.stream": {
	source: "iana"
},
	"application/vnd.apache.thrift.binary": {
	source: "iana"
},
	"application/vnd.apache.thrift.compact": {
	source: "iana"
},
	"application/vnd.apache.thrift.json": {
	source: "iana"
},
	"application/vnd.api+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.aplextor.warrp+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.apothekende.reservation+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.apple.installer+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mpkg"
	]
},
	"application/vnd.apple.keynote": {
	source: "iana",
	extensions: [
		"key"
	]
},
	"application/vnd.apple.mpegurl": {
	source: "iana",
	extensions: [
		"m3u8"
	]
},
	"application/vnd.apple.numbers": {
	source: "iana",
	extensions: [
		"numbers"
	]
},
	"application/vnd.apple.pages": {
	source: "iana",
	extensions: [
		"pages"
	]
},
	"application/vnd.apple.pkpass": {
	compressible: false,
	extensions: [
		"pkpass"
	]
},
	"application/vnd.arastra.swi": {
	source: "iana"
},
	"application/vnd.aristanetworks.swi": {
	source: "iana",
	extensions: [
		"swi"
	]
},
	"application/vnd.artisan+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.artsquare": {
	source: "iana"
},
	"application/vnd.astraea-software.iota": {
	source: "iana",
	extensions: [
		"iota"
	]
},
	"application/vnd.audiograph": {
	source: "iana",
	extensions: [
		"aep"
	]
},
	"application/vnd.autopackage": {
	source: "iana"
},
	"application/vnd.avalon+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.avistar+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.balsamiq.bmml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"bmml"
	]
},
	"application/vnd.balsamiq.bmpr": {
	source: "iana"
},
	"application/vnd.banana-accounting": {
	source: "iana"
},
	"application/vnd.bbf.usp.error": {
	source: "iana"
},
	"application/vnd.bbf.usp.msg": {
	source: "iana"
},
	"application/vnd.bbf.usp.msg+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.bekitzur-stech+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.bint.med-content": {
	source: "iana"
},
	"application/vnd.biopax.rdf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.blink-idb-value-wrapper": {
	source: "iana"
},
	"application/vnd.blueice.multipass": {
	source: "iana",
	extensions: [
		"mpm"
	]
},
	"application/vnd.bluetooth.ep.oob": {
	source: "iana"
},
	"application/vnd.bluetooth.le.oob": {
	source: "iana"
},
	"application/vnd.bmi": {
	source: "iana",
	extensions: [
		"bmi"
	]
},
	"application/vnd.bpf": {
	source: "iana"
},
	"application/vnd.bpf3": {
	source: "iana"
},
	"application/vnd.businessobjects": {
	source: "iana",
	extensions: [
		"rep"
	]
},
	"application/vnd.byu.uapi+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cab-jscript": {
	source: "iana"
},
	"application/vnd.canon-cpdl": {
	source: "iana"
},
	"application/vnd.canon-lips": {
	source: "iana"
},
	"application/vnd.capasystems-pg+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cendio.thinlinc.clientconf": {
	source: "iana"
},
	"application/vnd.century-systems.tcp_stream": {
	source: "iana"
},
	"application/vnd.chemdraw+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"cdxml"
	]
},
	"application/vnd.chess-pgn": {
	source: "iana"
},
	"application/vnd.chipnuts.karaoke-mmd": {
	source: "iana",
	extensions: [
		"mmd"
	]
},
	"application/vnd.ciedi": {
	source: "iana"
},
	"application/vnd.cinderella": {
	source: "iana",
	extensions: [
		"cdy"
	]
},
	"application/vnd.cirpack.isdn-ext": {
	source: "iana"
},
	"application/vnd.citationstyles.style+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"csl"
	]
},
	"application/vnd.claymore": {
	source: "iana",
	extensions: [
		"cla"
	]
},
	"application/vnd.cloanto.rp9": {
	source: "iana",
	extensions: [
		"rp9"
	]
},
	"application/vnd.clonk.c4group": {
	source: "iana",
	extensions: [
		"c4g",
		"c4d",
		"c4f",
		"c4p",
		"c4u"
	]
},
	"application/vnd.cluetrust.cartomobile-config": {
	source: "iana",
	extensions: [
		"c11amc"
	]
},
	"application/vnd.cluetrust.cartomobile-config-pkg": {
	source: "iana",
	extensions: [
		"c11amz"
	]
},
	"application/vnd.coffeescript": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.document": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.document-template": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.presentation": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.presentation-template": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.spreadsheet": {
	source: "iana"
},
	"application/vnd.collabio.xodocuments.spreadsheet-template": {
	source: "iana"
},
	"application/vnd.collection+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.collection.doc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.collection.next+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.comicbook+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.comicbook-rar": {
	source: "iana"
},
	"application/vnd.commerce-battelle": {
	source: "iana"
},
	"application/vnd.commonspace": {
	source: "iana",
	extensions: [
		"csp"
	]
},
	"application/vnd.contact.cmsg": {
	source: "iana",
	extensions: [
		"cdbcmsg"
	]
},
	"application/vnd.coreos.ignition+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cosmocaller": {
	source: "iana",
	extensions: [
		"cmc"
	]
},
	"application/vnd.crick.clicker": {
	source: "iana",
	extensions: [
		"clkx"
	]
},
	"application/vnd.crick.clicker.keyboard": {
	source: "iana",
	extensions: [
		"clkk"
	]
},
	"application/vnd.crick.clicker.palette": {
	source: "iana",
	extensions: [
		"clkp"
	]
},
	"application/vnd.crick.clicker.template": {
	source: "iana",
	extensions: [
		"clkt"
	]
},
	"application/vnd.crick.clicker.wordbank": {
	source: "iana",
	extensions: [
		"clkw"
	]
},
	"application/vnd.criticaltools.wbs+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wbs"
	]
},
	"application/vnd.cryptii.pipe+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.crypto-shade-file": {
	source: "iana"
},
	"application/vnd.cryptomator.encrypted": {
	source: "iana"
},
	"application/vnd.cryptomator.vault": {
	source: "iana"
},
	"application/vnd.ctc-posml": {
	source: "iana",
	extensions: [
		"pml"
	]
},
	"application/vnd.ctct.ws+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.cups-pdf": {
	source: "iana"
},
	"application/vnd.cups-postscript": {
	source: "iana"
},
	"application/vnd.cups-ppd": {
	source: "iana",
	extensions: [
		"ppd"
	]
},
	"application/vnd.cups-raster": {
	source: "iana"
},
	"application/vnd.cups-raw": {
	source: "iana"
},
	"application/vnd.curl": {
	source: "iana"
},
	"application/vnd.curl.car": {
	source: "apache",
	extensions: [
		"car"
	]
},
	"application/vnd.curl.pcurl": {
	source: "apache",
	extensions: [
		"pcurl"
	]
},
	"application/vnd.cyan.dean.root+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.cybank": {
	source: "iana"
},
	"application/vnd.cyclonedx+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.cyclonedx+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.d2l.coursepackage1p0+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.d3m-dataset": {
	source: "iana"
},
	"application/vnd.d3m-problem": {
	source: "iana"
},
	"application/vnd.dart": {
	source: "iana",
	compressible: true,
	extensions: [
		"dart"
	]
},
	"application/vnd.data-vision.rdz": {
	source: "iana",
	extensions: [
		"rdz"
	]
},
	"application/vnd.datapackage+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dataresource+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dbf": {
	source: "iana",
	extensions: [
		"dbf"
	]
},
	"application/vnd.debian.binary-package": {
	source: "iana"
},
	"application/vnd.dece.data": {
	source: "iana",
	extensions: [
		"uvf",
		"uvvf",
		"uvd",
		"uvvd"
	]
},
	"application/vnd.dece.ttml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"uvt",
		"uvvt"
	]
},
	"application/vnd.dece.unspecified": {
	source: "iana",
	extensions: [
		"uvx",
		"uvvx"
	]
},
	"application/vnd.dece.zip": {
	source: "iana",
	extensions: [
		"uvz",
		"uvvz"
	]
},
	"application/vnd.denovo.fcselayout-link": {
	source: "iana",
	extensions: [
		"fe_launch"
	]
},
	"application/vnd.desmume.movie": {
	source: "iana"
},
	"application/vnd.dir-bi.plate-dl-nosuffix": {
	source: "iana"
},
	"application/vnd.dm.delegation+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dna": {
	source: "iana",
	extensions: [
		"dna"
	]
},
	"application/vnd.document+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.dolby.mlp": {
	source: "apache",
	extensions: [
		"mlp"
	]
},
	"application/vnd.dolby.mobile.1": {
	source: "iana"
},
	"application/vnd.dolby.mobile.2": {
	source: "iana"
},
	"application/vnd.doremir.scorecloud-binary-document": {
	source: "iana"
},
	"application/vnd.dpgraph": {
	source: "iana",
	extensions: [
		"dpg"
	]
},
	"application/vnd.dreamfactory": {
	source: "iana",
	extensions: [
		"dfac"
	]
},
	"application/vnd.drive+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ds-keypoint": {
	source: "apache",
	extensions: [
		"kpxx"
	]
},
	"application/vnd.dtg.local": {
	source: "iana"
},
	"application/vnd.dtg.local.flash": {
	source: "iana"
},
	"application/vnd.dtg.local.html": {
	source: "iana"
},
	"application/vnd.dvb.ait": {
	source: "iana",
	extensions: [
		"ait"
	]
},
	"application/vnd.dvb.dvbisl+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.dvbj": {
	source: "iana"
},
	"application/vnd.dvb.esgcontainer": {
	source: "iana"
},
	"application/vnd.dvb.ipdcdftnotifaccess": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgaccess": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgaccess2": {
	source: "iana"
},
	"application/vnd.dvb.ipdcesgpdd": {
	source: "iana"
},
	"application/vnd.dvb.ipdcroaming": {
	source: "iana"
},
	"application/vnd.dvb.iptv.alfec-base": {
	source: "iana"
},
	"application/vnd.dvb.iptv.alfec-enhancement": {
	source: "iana"
},
	"application/vnd.dvb.notif-aggregate-root+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-container+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-generic+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-msglist+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-registration-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-ia-registration-response+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.notif-init+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.dvb.pfr": {
	source: "iana"
},
	"application/vnd.dvb.service": {
	source: "iana",
	extensions: [
		"svc"
	]
},
	"application/vnd.dxr": {
	source: "iana"
},
	"application/vnd.dynageo": {
	source: "iana",
	extensions: [
		"geo"
	]
},
	"application/vnd.dzr": {
	source: "iana"
},
	"application/vnd.easykaraoke.cdgdownload": {
	source: "iana"
},
	"application/vnd.ecdis-update": {
	source: "iana"
},
	"application/vnd.ecip.rlp": {
	source: "iana"
},
	"application/vnd.eclipse.ditto+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ecowin.chart": {
	source: "iana",
	extensions: [
		"mag"
	]
},
	"application/vnd.ecowin.filerequest": {
	source: "iana"
},
	"application/vnd.ecowin.fileupdate": {
	source: "iana"
},
	"application/vnd.ecowin.series": {
	source: "iana"
},
	"application/vnd.ecowin.seriesrequest": {
	source: "iana"
},
	"application/vnd.ecowin.seriesupdate": {
	source: "iana"
},
	"application/vnd.efi.img": {
	source: "iana"
},
	"application/vnd.efi.iso": {
	source: "iana"
},
	"application/vnd.emclient.accessrequest+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.enliven": {
	source: "iana",
	extensions: [
		"nml"
	]
},
	"application/vnd.enphase.envoy": {
	source: "iana"
},
	"application/vnd.eprints.data+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.epson.esf": {
	source: "iana",
	extensions: [
		"esf"
	]
},
	"application/vnd.epson.msf": {
	source: "iana",
	extensions: [
		"msf"
	]
},
	"application/vnd.epson.quickanime": {
	source: "iana",
	extensions: [
		"qam"
	]
},
	"application/vnd.epson.salt": {
	source: "iana",
	extensions: [
		"slt"
	]
},
	"application/vnd.epson.ssf": {
	source: "iana",
	extensions: [
		"ssf"
	]
},
	"application/vnd.ericsson.quickcall": {
	source: "iana"
},
	"application/vnd.espass-espass+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.eszigno3+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"es3",
		"et3"
	]
},
	"application/vnd.etsi.aoc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.asic-e+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.etsi.asic-s+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.etsi.cug+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvcommand+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvdiscovery+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-bc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-cod+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsad-npvr+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvservice+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvsync+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.iptvueprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.mcid+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.mheg5": {
	source: "iana"
},
	"application/vnd.etsi.overload-control-policy-dataset+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.pstn+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.sci+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.simservs+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.timestamp-token": {
	source: "iana"
},
	"application/vnd.etsi.tsl+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.etsi.tsl.der": {
	source: "iana"
},
	"application/vnd.eu.kasparian.car+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.eudora.data": {
	source: "iana"
},
	"application/vnd.evolv.ecig.profile": {
	source: "iana"
},
	"application/vnd.evolv.ecig.settings": {
	source: "iana"
},
	"application/vnd.evolv.ecig.theme": {
	source: "iana"
},
	"application/vnd.exstream-empower+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.exstream-package": {
	source: "iana"
},
	"application/vnd.ezpix-album": {
	source: "iana",
	extensions: [
		"ez2"
	]
},
	"application/vnd.ezpix-package": {
	source: "iana",
	extensions: [
		"ez3"
	]
},
	"application/vnd.f-secure.mobile": {
	source: "iana"
},
	"application/vnd.familysearch.gedcom+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.fastcopy-disk-image": {
	source: "iana"
},
	"application/vnd.fdf": {
	source: "iana",
	extensions: [
		"fdf"
	]
},
	"application/vnd.fdsn.mseed": {
	source: "iana",
	extensions: [
		"mseed"
	]
},
	"application/vnd.fdsn.seed": {
	source: "iana",
	extensions: [
		"seed",
		"dataless"
	]
},
	"application/vnd.ffsns": {
	source: "iana"
},
	"application/vnd.ficlab.flb+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.filmit.zfc": {
	source: "iana"
},
	"application/vnd.fints": {
	source: "iana"
},
	"application/vnd.firemonkeys.cloudcell": {
	source: "iana"
},
	"application/vnd.flographit": {
	source: "iana",
	extensions: [
		"gph"
	]
},
	"application/vnd.fluxtime.clip": {
	source: "iana",
	extensions: [
		"ftc"
	]
},
	"application/vnd.font-fontforge-sfd": {
	source: "iana"
},
	"application/vnd.framemaker": {
	source: "iana",
	extensions: [
		"fm",
		"frame",
		"maker",
		"book"
	]
},
	"application/vnd.frogans.fnc": {
	source: "iana",
	extensions: [
		"fnc"
	]
},
	"application/vnd.frogans.ltf": {
	source: "iana",
	extensions: [
		"ltf"
	]
},
	"application/vnd.fsc.weblaunch": {
	source: "iana",
	extensions: [
		"fsc"
	]
},
	"application/vnd.fujifilm.fb.docuworks": {
	source: "iana"
},
	"application/vnd.fujifilm.fb.docuworks.binder": {
	source: "iana"
},
	"application/vnd.fujifilm.fb.docuworks.container": {
	source: "iana"
},
	"application/vnd.fujifilm.fb.jfi+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.fujitsu.oasys": {
	source: "iana",
	extensions: [
		"oas"
	]
},
	"application/vnd.fujitsu.oasys2": {
	source: "iana",
	extensions: [
		"oa2"
	]
},
	"application/vnd.fujitsu.oasys3": {
	source: "iana",
	extensions: [
		"oa3"
	]
},
	"application/vnd.fujitsu.oasysgp": {
	source: "iana",
	extensions: [
		"fg5"
	]
},
	"application/vnd.fujitsu.oasysprs": {
	source: "iana",
	extensions: [
		"bh2"
	]
},
	"application/vnd.fujixerox.art-ex": {
	source: "iana"
},
	"application/vnd.fujixerox.art4": {
	source: "iana"
},
	"application/vnd.fujixerox.ddd": {
	source: "iana",
	extensions: [
		"ddd"
	]
},
	"application/vnd.fujixerox.docuworks": {
	source: "iana",
	extensions: [
		"xdw"
	]
},
	"application/vnd.fujixerox.docuworks.binder": {
	source: "iana",
	extensions: [
		"xbd"
	]
},
	"application/vnd.fujixerox.docuworks.container": {
	source: "iana"
},
	"application/vnd.fujixerox.hbpl": {
	source: "iana"
},
	"application/vnd.fut-misnet": {
	source: "iana"
},
	"application/vnd.futoin+cbor": {
	source: "iana"
},
	"application/vnd.futoin+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.fuzzysheet": {
	source: "iana",
	extensions: [
		"fzs"
	]
},
	"application/vnd.genomatix.tuxedo": {
	source: "iana",
	extensions: [
		"txd"
	]
},
	"application/vnd.gentics.grd+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.geo+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.geocube+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.geogebra.file": {
	source: "iana",
	extensions: [
		"ggb"
	]
},
	"application/vnd.geogebra.slides": {
	source: "iana"
},
	"application/vnd.geogebra.tool": {
	source: "iana",
	extensions: [
		"ggt"
	]
},
	"application/vnd.geometry-explorer": {
	source: "iana",
	extensions: [
		"gex",
		"gre"
	]
},
	"application/vnd.geonext": {
	source: "iana",
	extensions: [
		"gxt"
	]
},
	"application/vnd.geoplan": {
	source: "iana",
	extensions: [
		"g2w"
	]
},
	"application/vnd.geospace": {
	source: "iana",
	extensions: [
		"g3w"
	]
},
	"application/vnd.gerber": {
	source: "iana"
},
	"application/vnd.globalplatform.card-content-mgt": {
	source: "iana"
},
	"application/vnd.globalplatform.card-content-mgt-response": {
	source: "iana"
},
	"application/vnd.gmx": {
	source: "iana",
	extensions: [
		"gmx"
	]
},
	"application/vnd.google-apps.document": {
	compressible: false,
	extensions: [
		"gdoc"
	]
},
	"application/vnd.google-apps.presentation": {
	compressible: false,
	extensions: [
		"gslides"
	]
},
	"application/vnd.google-apps.spreadsheet": {
	compressible: false,
	extensions: [
		"gsheet"
	]
},
	"application/vnd.google-earth.kml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"kml"
	]
},
	"application/vnd.google-earth.kmz": {
	source: "iana",
	compressible: false,
	extensions: [
		"kmz"
	]
},
	"application/vnd.gov.sk.e-form+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.gov.sk.e-form+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.gov.sk.xmldatacontainer+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.grafeq": {
	source: "iana",
	extensions: [
		"gqf",
		"gqs"
	]
},
	"application/vnd.gridmp": {
	source: "iana"
},
	"application/vnd.groove-account": {
	source: "iana",
	extensions: [
		"gac"
	]
},
	"application/vnd.groove-help": {
	source: "iana",
	extensions: [
		"ghf"
	]
},
	"application/vnd.groove-identity-message": {
	source: "iana",
	extensions: [
		"gim"
	]
},
	"application/vnd.groove-injector": {
	source: "iana",
	extensions: [
		"grv"
	]
},
	"application/vnd.groove-tool-message": {
	source: "iana",
	extensions: [
		"gtm"
	]
},
	"application/vnd.groove-tool-template": {
	source: "iana",
	extensions: [
		"tpl"
	]
},
	"application/vnd.groove-vcard": {
	source: "iana",
	extensions: [
		"vcg"
	]
},
	"application/vnd.hal+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hal+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"hal"
	]
},
	"application/vnd.handheld-entertainment+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"zmm"
	]
},
	"application/vnd.hbci": {
	source: "iana",
	extensions: [
		"hbci"
	]
},
	"application/vnd.hc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hcl-bireports": {
	source: "iana"
},
	"application/vnd.hdt": {
	source: "iana"
},
	"application/vnd.heroku+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hhe.lesson-player": {
	source: "iana",
	extensions: [
		"les"
	]
},
	"application/vnd.hl7cda+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.hl7v2+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.hp-hpgl": {
	source: "iana",
	extensions: [
		"hpgl"
	]
},
	"application/vnd.hp-hpid": {
	source: "iana",
	extensions: [
		"hpid"
	]
},
	"application/vnd.hp-hps": {
	source: "iana",
	extensions: [
		"hps"
	]
},
	"application/vnd.hp-jlyt": {
	source: "iana",
	extensions: [
		"jlt"
	]
},
	"application/vnd.hp-pcl": {
	source: "iana",
	extensions: [
		"pcl"
	]
},
	"application/vnd.hp-pclxl": {
	source: "iana",
	extensions: [
		"pclxl"
	]
},
	"application/vnd.httphone": {
	source: "iana"
},
	"application/vnd.hydrostatix.sof-data": {
	source: "iana",
	extensions: [
		"sfd-hdstx"
	]
},
	"application/vnd.hyper+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hyper-item+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hyperdrive+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.hzn-3d-crossword": {
	source: "iana"
},
	"application/vnd.ibm.afplinedata": {
	source: "iana"
},
	"application/vnd.ibm.electronic-media": {
	source: "iana"
},
	"application/vnd.ibm.minipay": {
	source: "iana",
	extensions: [
		"mpy"
	]
},
	"application/vnd.ibm.modcap": {
	source: "iana",
	extensions: [
		"afp",
		"listafp",
		"list3820"
	]
},
	"application/vnd.ibm.rights-management": {
	source: "iana",
	extensions: [
		"irm"
	]
},
	"application/vnd.ibm.secure-container": {
	source: "iana",
	extensions: [
		"sc"
	]
},
	"application/vnd.iccprofile": {
	source: "iana",
	extensions: [
		"icc",
		"icm"
	]
},
	"application/vnd.ieee.1905": {
	source: "iana"
},
	"application/vnd.igloader": {
	source: "iana",
	extensions: [
		"igl"
	]
},
	"application/vnd.imagemeter.folder+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.imagemeter.image+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.immervision-ivp": {
	source: "iana",
	extensions: [
		"ivp"
	]
},
	"application/vnd.immervision-ivu": {
	source: "iana",
	extensions: [
		"ivu"
	]
},
	"application/vnd.ims.imsccv1p1": {
	source: "iana"
},
	"application/vnd.ims.imsccv1p2": {
	source: "iana"
},
	"application/vnd.ims.imsccv1p3": {
	source: "iana"
},
	"application/vnd.ims.lis.v2.result+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolproxy+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolproxy.id+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolsettings+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ims.lti.v2.toolsettings.simple+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.informedcontrol.rms+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.informix-visionary": {
	source: "iana"
},
	"application/vnd.infotech.project": {
	source: "iana"
},
	"application/vnd.infotech.project+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.innopath.wamp.notification": {
	source: "iana"
},
	"application/vnd.insors.igm": {
	source: "iana",
	extensions: [
		"igm"
	]
},
	"application/vnd.intercon.formnet": {
	source: "iana",
	extensions: [
		"xpw",
		"xpx"
	]
},
	"application/vnd.intergeo": {
	source: "iana",
	extensions: [
		"i2g"
	]
},
	"application/vnd.intertrust.digibox": {
	source: "iana"
},
	"application/vnd.intertrust.nncp": {
	source: "iana"
},
	"application/vnd.intu.qbo": {
	source: "iana",
	extensions: [
		"qbo"
	]
},
	"application/vnd.intu.qfx": {
	source: "iana",
	extensions: [
		"qfx"
	]
},
	"application/vnd.iptc.g2.catalogitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.conceptitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.knowledgeitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.newsitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.newsmessage+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.packageitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.iptc.g2.planningitem+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ipunplugged.rcprofile": {
	source: "iana",
	extensions: [
		"rcprofile"
	]
},
	"application/vnd.irepository.package+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"irp"
	]
},
	"application/vnd.is-xpr": {
	source: "iana",
	extensions: [
		"xpr"
	]
},
	"application/vnd.isac.fcs": {
	source: "iana",
	extensions: [
		"fcs"
	]
},
	"application/vnd.iso11783-10+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.jam": {
	source: "iana",
	extensions: [
		"jam"
	]
},
	"application/vnd.japannet-directory-service": {
	source: "iana"
},
	"application/vnd.japannet-jpnstore-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-payment-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-registration": {
	source: "iana"
},
	"application/vnd.japannet-registration-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-setstore-wakeup": {
	source: "iana"
},
	"application/vnd.japannet-verification": {
	source: "iana"
},
	"application/vnd.japannet-verification-wakeup": {
	source: "iana"
},
	"application/vnd.jcp.javame.midlet-rms": {
	source: "iana",
	extensions: [
		"rms"
	]
},
	"application/vnd.jisp": {
	source: "iana",
	extensions: [
		"jisp"
	]
},
	"application/vnd.joost.joda-archive": {
	source: "iana",
	extensions: [
		"joda"
	]
},
	"application/vnd.jsk.isdn-ngn": {
	source: "iana"
},
	"application/vnd.kahootz": {
	source: "iana",
	extensions: [
		"ktz",
		"ktr"
	]
},
	"application/vnd.kde.karbon": {
	source: "iana",
	extensions: [
		"karbon"
	]
},
	"application/vnd.kde.kchart": {
	source: "iana",
	extensions: [
		"chrt"
	]
},
	"application/vnd.kde.kformula": {
	source: "iana",
	extensions: [
		"kfo"
	]
},
	"application/vnd.kde.kivio": {
	source: "iana",
	extensions: [
		"flw"
	]
},
	"application/vnd.kde.kontour": {
	source: "iana",
	extensions: [
		"kon"
	]
},
	"application/vnd.kde.kpresenter": {
	source: "iana",
	extensions: [
		"kpr",
		"kpt"
	]
},
	"application/vnd.kde.kspread": {
	source: "iana",
	extensions: [
		"ksp"
	]
},
	"application/vnd.kde.kword": {
	source: "iana",
	extensions: [
		"kwd",
		"kwt"
	]
},
	"application/vnd.kenameaapp": {
	source: "iana",
	extensions: [
		"htke"
	]
},
	"application/vnd.kidspiration": {
	source: "iana",
	extensions: [
		"kia"
	]
},
	"application/vnd.kinar": {
	source: "iana",
	extensions: [
		"kne",
		"knp"
	]
},
	"application/vnd.koan": {
	source: "iana",
	extensions: [
		"skp",
		"skd",
		"skt",
		"skm"
	]
},
	"application/vnd.kodak-descriptor": {
	source: "iana",
	extensions: [
		"sse"
	]
},
	"application/vnd.las": {
	source: "iana"
},
	"application/vnd.las.las+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.las.las+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lasxml"
	]
},
	"application/vnd.laszip": {
	source: "iana"
},
	"application/vnd.leap+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.liberty-request+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.llamagraphics.life-balance.desktop": {
	source: "iana",
	extensions: [
		"lbd"
	]
},
	"application/vnd.llamagraphics.life-balance.exchange+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"lbe"
	]
},
	"application/vnd.logipipe.circuit+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.loom": {
	source: "iana"
},
	"application/vnd.lotus-1-2-3": {
	source: "iana",
	extensions: [
		"123"
	]
},
	"application/vnd.lotus-approach": {
	source: "iana",
	extensions: [
		"apr"
	]
},
	"application/vnd.lotus-freelance": {
	source: "iana",
	extensions: [
		"pre"
	]
},
	"application/vnd.lotus-notes": {
	source: "iana",
	extensions: [
		"nsf"
	]
},
	"application/vnd.lotus-organizer": {
	source: "iana",
	extensions: [
		"org"
	]
},
	"application/vnd.lotus-screencam": {
	source: "iana",
	extensions: [
		"scm"
	]
},
	"application/vnd.lotus-wordpro": {
	source: "iana",
	extensions: [
		"lwp"
	]
},
	"application/vnd.macports.portpkg": {
	source: "iana",
	extensions: [
		"portpkg"
	]
},
	"application/vnd.mapbox-vector-tile": {
	source: "iana",
	extensions: [
		"mvt"
	]
},
	"application/vnd.marlin.drm.actiontoken+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.conftoken+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.license+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.marlin.drm.mdcf": {
	source: "iana"
},
	"application/vnd.mason+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.maxar.archive.3tz+zip": {
	source: "iana",
	compressible: false
},
	"application/vnd.maxmind.maxmind-db": {
	source: "iana"
},
	"application/vnd.mcd": {
	source: "iana",
	extensions: [
		"mcd"
	]
},
	"application/vnd.medcalcdata": {
	source: "iana",
	extensions: [
		"mc1"
	]
},
	"application/vnd.mediastation.cdkey": {
	source: "iana",
	extensions: [
		"cdkey"
	]
},
	"application/vnd.meridian-slingshot": {
	source: "iana"
},
	"application/vnd.mfer": {
	source: "iana",
	extensions: [
		"mwf"
	]
},
	"application/vnd.mfmp": {
	source: "iana",
	extensions: [
		"mfm"
	]
},
	"application/vnd.micro+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.micrografx.flo": {
	source: "iana",
	extensions: [
		"flo"
	]
},
	"application/vnd.micrografx.igx": {
	source: "iana",
	extensions: [
		"igx"
	]
},
	"application/vnd.microsoft.portable-executable": {
	source: "iana"
},
	"application/vnd.microsoft.windows.thumbnail-cache": {
	source: "iana"
},
	"application/vnd.miele+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.mif": {
	source: "iana",
	extensions: [
		"mif"
	]
},
	"application/vnd.minisoft-hp3000-save": {
	source: "iana"
},
	"application/vnd.mitsubishi.misty-guard.trustweb": {
	source: "iana"
},
	"application/vnd.mobius.daf": {
	source: "iana",
	extensions: [
		"daf"
	]
},
	"application/vnd.mobius.dis": {
	source: "iana",
	extensions: [
		"dis"
	]
},
	"application/vnd.mobius.mbk": {
	source: "iana",
	extensions: [
		"mbk"
	]
},
	"application/vnd.mobius.mqy": {
	source: "iana",
	extensions: [
		"mqy"
	]
},
	"application/vnd.mobius.msl": {
	source: "iana",
	extensions: [
		"msl"
	]
},
	"application/vnd.mobius.plc": {
	source: "iana",
	extensions: [
		"plc"
	]
},
	"application/vnd.mobius.txf": {
	source: "iana",
	extensions: [
		"txf"
	]
},
	"application/vnd.mophun.application": {
	source: "iana",
	extensions: [
		"mpn"
	]
},
	"application/vnd.mophun.certificate": {
	source: "iana",
	extensions: [
		"mpc"
	]
},
	"application/vnd.motorola.flexsuite": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.adsi": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.fis": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.gotap": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.kmr": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.ttc": {
	source: "iana"
},
	"application/vnd.motorola.flexsuite.wem": {
	source: "iana"
},
	"application/vnd.motorola.iprm": {
	source: "iana"
},
	"application/vnd.mozilla.xul+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xul"
	]
},
	"application/vnd.ms-3mfdocument": {
	source: "iana"
},
	"application/vnd.ms-artgalry": {
	source: "iana",
	extensions: [
		"cil"
	]
},
	"application/vnd.ms-asf": {
	source: "iana"
},
	"application/vnd.ms-cab-compressed": {
	source: "iana",
	extensions: [
		"cab"
	]
},
	"application/vnd.ms-color.iccprofile": {
	source: "apache"
},
	"application/vnd.ms-excel": {
	source: "iana",
	compressible: false,
	extensions: [
		"xls",
		"xlm",
		"xla",
		"xlc",
		"xlt",
		"xlw"
	]
},
	"application/vnd.ms-excel.addin.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlam"
	]
},
	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlsb"
	]
},
	"application/vnd.ms-excel.sheet.macroenabled.12": {
	source: "iana",
	extensions: [
		"xlsm"
	]
},
	"application/vnd.ms-excel.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"xltm"
	]
},
	"application/vnd.ms-fontobject": {
	source: "iana",
	compressible: true,
	extensions: [
		"eot"
	]
},
	"application/vnd.ms-htmlhelp": {
	source: "iana",
	extensions: [
		"chm"
	]
},
	"application/vnd.ms-ims": {
	source: "iana",
	extensions: [
		"ims"
	]
},
	"application/vnd.ms-lrm": {
	source: "iana",
	extensions: [
		"lrm"
	]
},
	"application/vnd.ms-office.activex+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-officetheme": {
	source: "iana",
	extensions: [
		"thmx"
	]
},
	"application/vnd.ms-opentype": {
	source: "apache",
	compressible: true
},
	"application/vnd.ms-outlook": {
	compressible: false,
	extensions: [
		"msg"
	]
},
	"application/vnd.ms-package.obfuscated-opentype": {
	source: "apache"
},
	"application/vnd.ms-pki.seccat": {
	source: "apache",
	extensions: [
		"cat"
	]
},
	"application/vnd.ms-pki.stl": {
	source: "apache",
	extensions: [
		"stl"
	]
},
	"application/vnd.ms-playready.initiator+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-powerpoint": {
	source: "iana",
	compressible: false,
	extensions: [
		"ppt",
		"pps",
		"pot"
	]
},
	"application/vnd.ms-powerpoint.addin.macroenabled.12": {
	source: "iana",
	extensions: [
		"ppam"
	]
},
	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
	source: "iana",
	extensions: [
		"pptm"
	]
},
	"application/vnd.ms-powerpoint.slide.macroenabled.12": {
	source: "iana",
	extensions: [
		"sldm"
	]
},
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
	source: "iana",
	extensions: [
		"ppsm"
	]
},
	"application/vnd.ms-powerpoint.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"potm"
	]
},
	"application/vnd.ms-printdevicecapabilities+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-printing.printticket+xml": {
	source: "apache",
	compressible: true
},
	"application/vnd.ms-printschematicket+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.ms-project": {
	source: "iana",
	extensions: [
		"mpp",
		"mpt"
	]
},
	"application/vnd.ms-tnef": {
	source: "iana"
},
	"application/vnd.ms-windows.devicepairing": {
	source: "iana"
},
	"application/vnd.ms-windows.nwprinting.oob": {
	source: "iana"
},
	"application/vnd.ms-windows.printerpairing": {
	source: "iana"
},
	"application/vnd.ms-windows.wsd.oob": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.lic-chlg-req": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.lic-resp": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.meter-chlg-req": {
	source: "iana"
},
	"application/vnd.ms-wmdrm.meter-resp": {
	source: "iana"
},
	"application/vnd.ms-word.document.macroenabled.12": {
	source: "iana",
	extensions: [
		"docm"
	]
},
	"application/vnd.ms-word.template.macroenabled.12": {
	source: "iana",
	extensions: [
		"dotm"
	]
},
	"application/vnd.ms-works": {
	source: "iana",
	extensions: [
		"wps",
		"wks",
		"wcm",
		"wdb"
	]
},
	"application/vnd.ms-wpl": {
	source: "iana",
	extensions: [
		"wpl"
	]
},
	"application/vnd.ms-xpsdocument": {
	source: "iana",
	compressible: false,
	extensions: [
		"xps"
	]
},
	"application/vnd.msa-disk-image": {
	source: "iana"
},
	"application/vnd.mseq": {
	source: "iana",
	extensions: [
		"mseq"
	]
},
	"application/vnd.msign": {
	source: "iana"
},
	"application/vnd.multiad.creator": {
	source: "iana"
},
	"application/vnd.multiad.creator.cif": {
	source: "iana"
},
	"application/vnd.music-niff": {
	source: "iana"
},
	"application/vnd.musician": {
	source: "iana",
	extensions: [
		"mus"
	]
},
	"application/vnd.muvee.style": {
	source: "iana",
	extensions: [
		"msty"
	]
},
	"application/vnd.mynfc": {
	source: "iana",
	extensions: [
		"taglet"
	]
},
	"application/vnd.nacamar.ybrid+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.ncd.control": {
	source: "iana"
},
	"application/vnd.ncd.reference": {
	source: "iana"
},
	"application/vnd.nearst.inv+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.nebumind.line": {
	source: "iana"
},
	"application/vnd.nervana": {
	source: "iana"
},
	"application/vnd.netfpx": {
	source: "iana"
},
	"application/vnd.neurolanguage.nlu": {
	source: "iana",
	extensions: [
		"nlu"
	]
},
	"application/vnd.nimn": {
	source: "iana"
},
	"application/vnd.nintendo.nitro.rom": {
	source: "iana"
},
	"application/vnd.nintendo.snes.rom": {
	source: "iana"
},
	"application/vnd.nitf": {
	source: "iana",
	extensions: [
		"ntf",
		"nitf"
	]
},
	"application/vnd.noblenet-directory": {
	source: "iana",
	extensions: [
		"nnd"
	]
},
	"application/vnd.noblenet-sealer": {
	source: "iana",
	extensions: [
		"nns"
	]
},
	"application/vnd.noblenet-web": {
	source: "iana",
	extensions: [
		"nnw"
	]
},
	"application/vnd.nokia.catalogs": {
	source: "iana"
},
	"application/vnd.nokia.conml+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.conml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.iptv.config+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.isds-radio-presets": {
	source: "iana"
},
	"application/vnd.nokia.landmark+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.landmark+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.landmarkcollection+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.n-gage.ac+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"ac"
	]
},
	"application/vnd.nokia.n-gage.data": {
	source: "iana",
	extensions: [
		"ngdat"
	]
},
	"application/vnd.nokia.n-gage.symbian.install": {
	source: "iana",
	extensions: [
		"n-gage"
	]
},
	"application/vnd.nokia.ncd": {
	source: "iana"
},
	"application/vnd.nokia.pcd+wbxml": {
	source: "iana"
},
	"application/vnd.nokia.pcd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.nokia.radio-preset": {
	source: "iana",
	extensions: [
		"rpst"
	]
},
	"application/vnd.nokia.radio-presets": {
	source: "iana",
	extensions: [
		"rpss"
	]
},
	"application/vnd.novadigm.edm": {
	source: "iana",
	extensions: [
		"edm"
	]
},
	"application/vnd.novadigm.edx": {
	source: "iana",
	extensions: [
		"edx"
	]
},
	"application/vnd.novadigm.ext": {
	source: "iana",
	extensions: [
		"ext"
	]
},
	"application/vnd.ntt-local.content-share": {
	source: "iana"
},
	"application/vnd.ntt-local.file-transfer": {
	source: "iana"
},
	"application/vnd.ntt-local.ogw_remote-access": {
	source: "iana"
},
	"application/vnd.ntt-local.sip-ta_remote": {
	source: "iana"
},
	"application/vnd.ntt-local.sip-ta_tcp_stream": {
	source: "iana"
},
	"application/vnd.oasis.opendocument.chart": {
	source: "iana",
	extensions: [
		"odc"
	]
},
	"application/vnd.oasis.opendocument.chart-template": {
	source: "iana",
	extensions: [
		"otc"
	]
},
	"application/vnd.oasis.opendocument.database": {
	source: "iana",
	extensions: [
		"odb"
	]
},
	"application/vnd.oasis.opendocument.formula": {
	source: "iana",
	extensions: [
		"odf"
	]
},
	"application/vnd.oasis.opendocument.formula-template": {
	source: "iana",
	extensions: [
		"odft"
	]
},
	"application/vnd.oasis.opendocument.graphics": {
	source: "iana",
	compressible: false,
	extensions: [
		"odg"
	]
},
	"application/vnd.oasis.opendocument.graphics-template": {
	source: "iana",
	extensions: [
		"otg"
	]
},
	"application/vnd.oasis.opendocument.image": {
	source: "iana",
	extensions: [
		"odi"
	]
},
	"application/vnd.oasis.opendocument.image-template": {
	source: "iana",
	extensions: [
		"oti"
	]
},
	"application/vnd.oasis.opendocument.presentation": {
	source: "iana",
	compressible: false,
	extensions: [
		"odp"
	]
},
	"application/vnd.oasis.opendocument.presentation-template": {
	source: "iana",
	extensions: [
		"otp"
	]
},
	"application/vnd.oasis.opendocument.spreadsheet": {
	source: "iana",
	compressible: false,
	extensions: [
		"ods"
	]
},
	"application/vnd.oasis.opendocument.spreadsheet-template": {
	source: "iana",
	extensions: [
		"ots"
	]
},
	"application/vnd.oasis.opendocument.text": {
	source: "iana",
	compressible: false,
	extensions: [
		"odt"
	]
},
	"application/vnd.oasis.opendocument.text-master": {
	source: "iana",
	extensions: [
		"odm"
	]
},
	"application/vnd.oasis.opendocument.text-template": {
	source: "iana",
	extensions: [
		"ott"
	]
},
	"application/vnd.oasis.opendocument.text-web": {
	source: "iana",
	extensions: [
		"oth"
	]
},
	"application/vnd.obn": {
	source: "iana"
},
	"application/vnd.ocf+cbor": {
	source: "iana"
},
	"application/vnd.oci.image.manifest.v1+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oftn.l10n+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.contentaccessdownload+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.contentaccessstreaming+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.cspg-hexbinary": {
	source: "iana"
},
	"application/vnd.oipf.dae.svg+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.dae.xhtml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.mippvcontrolmessage+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.pae.gem": {
	source: "iana"
},
	"application/vnd.oipf.spdiscovery+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.spdlist+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.ueprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oipf.userprofile+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.olpc-sugar": {
	source: "iana",
	extensions: [
		"xo"
	]
},
	"application/vnd.oma-scws-config": {
	source: "iana"
},
	"application/vnd.oma-scws-http-request": {
	source: "iana"
},
	"application/vnd.oma-scws-http-response": {
	source: "iana"
},
	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.drm-trigger+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.imd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.ltkm": {
	source: "iana"
},
	"application/vnd.oma.bcast.notification+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.provisioningtrigger": {
	source: "iana"
},
	"application/vnd.oma.bcast.sgboot": {
	source: "iana"
},
	"application/vnd.oma.bcast.sgdd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.sgdu": {
	source: "iana"
},
	"application/vnd.oma.bcast.simple-symbol-container": {
	source: "iana"
},
	"application/vnd.oma.bcast.smartcard-trigger+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.sprov+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.bcast.stkm": {
	source: "iana"
},
	"application/vnd.oma.cab-address-book+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-feature-handler+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-pcc+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-subs-invite+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.cab-user-prefs+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.dcd": {
	source: "iana"
},
	"application/vnd.oma.dcdc": {
	source: "iana"
},
	"application/vnd.oma.dd2+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dd2"
	]
},
	"application/vnd.oma.drm.risd+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.group-usage-list+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.lwm2m+cbor": {
	source: "iana"
},
	"application/vnd.oma.lwm2m+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.lwm2m+tlv": {
	source: "iana"
},
	"application/vnd.oma.pal+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.detailed-progress-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.final-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.groups+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.invocation-descriptor+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.poc.optimized-progress-report+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.push": {
	source: "iana"
},
	"application/vnd.oma.scidm.messages+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oma.xcap-directory+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.omads-email+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.omads-file+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.omads-folder+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.omaloc-supl-init": {
	source: "iana"
},
	"application/vnd.onepager": {
	source: "iana"
},
	"application/vnd.onepagertamp": {
	source: "iana"
},
	"application/vnd.onepagertamx": {
	source: "iana"
},
	"application/vnd.onepagertat": {
	source: "iana"
},
	"application/vnd.onepagertatp": {
	source: "iana"
},
	"application/vnd.onepagertatx": {
	source: "iana"
},
	"application/vnd.openblox.game+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"obgx"
	]
},
	"application/vnd.openblox.game-binary": {
	source: "iana"
},
	"application/vnd.openeye.oeb": {
	source: "iana"
},
	"application/vnd.openofficeorg.extension": {
	source: "apache",
	extensions: [
		"oxt"
	]
},
	"application/vnd.openstreetmap.data+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"osm"
	]
},
	"application/vnd.opentimestamps.ots": {
	source: "iana"
},
	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawing+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
	source: "iana",
	compressible: false,
	extensions: [
		"pptx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slide": {
	source: "iana",
	extensions: [
		"sldx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
	source: "iana",
	extensions: [
		"ppsx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.template": {
	source: "iana",
	extensions: [
		"potx"
	]
},
	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
	source: "iana",
	compressible: false,
	extensions: [
		"xlsx"
	]
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
	source: "iana",
	extensions: [
		"xltx"
	]
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.theme+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.vmldrawing": {
	source: "iana"
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
	source: "iana",
	compressible: false,
	extensions: [
		"docx"
	]
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
	source: "iana",
	extensions: [
		"dotx"
	]
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.core-properties+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.openxmlformats-package.relationships+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oracle.resource+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.orange.indata": {
	source: "iana"
},
	"application/vnd.osa.netdeploy": {
	source: "iana"
},
	"application/vnd.osgeo.mapguide.package": {
	source: "iana",
	extensions: [
		"mgp"
	]
},
	"application/vnd.osgi.bundle": {
	source: "iana"
},
	"application/vnd.osgi.dp": {
	source: "iana",
	extensions: [
		"dp"
	]
},
	"application/vnd.osgi.subsystem": {
	source: "iana",
	extensions: [
		"esa"
	]
},
	"application/vnd.otps.ct-kip+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.oxli.countgraph": {
	source: "iana"
},
	"application/vnd.pagerduty+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.palm": {
	source: "iana",
	extensions: [
		"pdb",
		"pqa",
		"oprc"
	]
},
	"application/vnd.panoply": {
	source: "iana"
},
	"application/vnd.paos.xml": {
	source: "iana"
},
	"application/vnd.patentdive": {
	source: "iana"
},
	"application/vnd.patientecommsdoc": {
	source: "iana"
},
	"application/vnd.pawaafile": {
	source: "iana",
	extensions: [
		"paw"
	]
},
	"application/vnd.pcos": {
	source: "iana"
},
	"application/vnd.pg.format": {
	source: "iana",
	extensions: [
		"str"
	]
},
	"application/vnd.pg.osasli": {
	source: "iana",
	extensions: [
		"ei6"
	]
},
	"application/vnd.piaccess.application-licence": {
	source: "iana"
},
	"application/vnd.picsel": {
	source: "iana",
	extensions: [
		"efif"
	]
},
	"application/vnd.pmi.widget": {
	source: "iana",
	extensions: [
		"wg"
	]
},
	"application/vnd.poc.group-advertisement+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.pocketlearn": {
	source: "iana",
	extensions: [
		"plf"
	]
},
	"application/vnd.powerbuilder6": {
	source: "iana",
	extensions: [
		"pbd"
	]
},
	"application/vnd.powerbuilder6-s": {
	source: "iana"
},
	"application/vnd.powerbuilder7": {
	source: "iana"
},
	"application/vnd.powerbuilder7-s": {
	source: "iana"
},
	"application/vnd.powerbuilder75": {
	source: "iana"
},
	"application/vnd.powerbuilder75-s": {
	source: "iana"
},
	"application/vnd.preminet": {
	source: "iana"
},
	"application/vnd.previewsystems.box": {
	source: "iana",
	extensions: [
		"box"
	]
},
	"application/vnd.proteus.magazine": {
	source: "iana",
	extensions: [
		"mgz"
	]
},
	"application/vnd.psfs": {
	source: "iana"
},
	"application/vnd.publishare-delta-tree": {
	source: "iana",
	extensions: [
		"qps"
	]
},
	"application/vnd.pvi.ptid1": {
	source: "iana",
	extensions: [
		"ptid"
	]
},
	"application/vnd.pwg-multiplexed": {
	source: "iana"
},
	"application/vnd.pwg-xhtml-print+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.qualcomm.brew-app-res": {
	source: "iana"
},
	"application/vnd.quarantainenet": {
	source: "iana"
},
	"application/vnd.quark.quarkxpress": {
	source: "iana",
	extensions: [
		"qxd",
		"qxt",
		"qwd",
		"qwt",
		"qxl",
		"qxb"
	]
},
	"application/vnd.quobject-quoxdocument": {
	source: "iana"
},
	"application/vnd.radisys.moml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-conf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-conn+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-dialog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-audit-stream+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-conf+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-base+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-fax-detect+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-group+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-speech+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.radisys.msml-dialog-transform+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.rainstor.data": {
	source: "iana"
},
	"application/vnd.rapid": {
	source: "iana"
},
	"application/vnd.rar": {
	source: "iana",
	extensions: [
		"rar"
	]
},
	"application/vnd.realvnc.bed": {
	source: "iana",
	extensions: [
		"bed"
	]
},
	"application/vnd.recordare.musicxml": {
	source: "iana",
	extensions: [
		"mxl"
	]
},
	"application/vnd.recordare.musicxml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"musicxml"
	]
},
	"application/vnd.renlearn.rlprint": {
	source: "iana"
},
	"application/vnd.resilient.logic": {
	source: "iana"
},
	"application/vnd.restful+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.rig.cryptonote": {
	source: "iana",
	extensions: [
		"cryptonote"
	]
},
	"application/vnd.rim.cod": {
	source: "apache",
	extensions: [
		"cod"
	]
},
	"application/vnd.rn-realmedia": {
	source: "apache",
	extensions: [
		"rm"
	]
},
	"application/vnd.rn-realmedia-vbr": {
	source: "apache",
	extensions: [
		"rmvb"
	]
},
	"application/vnd.route66.link66+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"link66"
	]
},
	"application/vnd.rs-274x": {
	source: "iana"
},
	"application/vnd.ruckus.download": {
	source: "iana"
},
	"application/vnd.s3sms": {
	source: "iana"
},
	"application/vnd.sailingtracker.track": {
	source: "iana",
	extensions: [
		"st"
	]
},
	"application/vnd.sar": {
	source: "iana"
},
	"application/vnd.sbm.cid": {
	source: "iana"
},
	"application/vnd.sbm.mid2": {
	source: "iana"
},
	"application/vnd.scribus": {
	source: "iana"
},
	"application/vnd.sealed.3df": {
	source: "iana"
},
	"application/vnd.sealed.csf": {
	source: "iana"
},
	"application/vnd.sealed.doc": {
	source: "iana"
},
	"application/vnd.sealed.eml": {
	source: "iana"
},
	"application/vnd.sealed.mht": {
	source: "iana"
},
	"application/vnd.sealed.net": {
	source: "iana"
},
	"application/vnd.sealed.ppt": {
	source: "iana"
},
	"application/vnd.sealed.tiff": {
	source: "iana"
},
	"application/vnd.sealed.xls": {
	source: "iana"
},
	"application/vnd.sealedmedia.softseal.html": {
	source: "iana"
},
	"application/vnd.sealedmedia.softseal.pdf": {
	source: "iana"
},
	"application/vnd.seemail": {
	source: "iana",
	extensions: [
		"see"
	]
},
	"application/vnd.seis+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.sema": {
	source: "iana",
	extensions: [
		"sema"
	]
},
	"application/vnd.semd": {
	source: "iana",
	extensions: [
		"semd"
	]
},
	"application/vnd.semf": {
	source: "iana",
	extensions: [
		"semf"
	]
},
	"application/vnd.shade-save-file": {
	source: "iana"
},
	"application/vnd.shana.informed.formdata": {
	source: "iana",
	extensions: [
		"ifm"
	]
},
	"application/vnd.shana.informed.formtemplate": {
	source: "iana",
	extensions: [
		"itp"
	]
},
	"application/vnd.shana.informed.interchange": {
	source: "iana",
	extensions: [
		"iif"
	]
},
	"application/vnd.shana.informed.package": {
	source: "iana",
	extensions: [
		"ipk"
	]
},
	"application/vnd.shootproof+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.shopkick+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.shp": {
	source: "iana"
},
	"application/vnd.shx": {
	source: "iana"
},
	"application/vnd.sigrok.session": {
	source: "iana"
},
	"application/vnd.simtech-mindmapper": {
	source: "iana",
	extensions: [
		"twd",
		"twds"
	]
},
	"application/vnd.siren+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.smaf": {
	source: "iana",
	extensions: [
		"mmf"
	]
},
	"application/vnd.smart.notebook": {
	source: "iana"
},
	"application/vnd.smart.teacher": {
	source: "iana",
	extensions: [
		"teacher"
	]
},
	"application/vnd.snesdev-page-table": {
	source: "iana"
},
	"application/vnd.software602.filler.form+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"fo"
	]
},
	"application/vnd.software602.filler.form-xml-zip": {
	source: "iana"
},
	"application/vnd.solent.sdkm+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"sdkm",
		"sdkd"
	]
},
	"application/vnd.spotfire.dxp": {
	source: "iana",
	extensions: [
		"dxp"
	]
},
	"application/vnd.spotfire.sfs": {
	source: "iana",
	extensions: [
		"sfs"
	]
},
	"application/vnd.sqlite3": {
	source: "iana"
},
	"application/vnd.sss-cod": {
	source: "iana"
},
	"application/vnd.sss-dtf": {
	source: "iana"
},
	"application/vnd.sss-ntf": {
	source: "iana"
},
	"application/vnd.stardivision.calc": {
	source: "apache",
	extensions: [
		"sdc"
	]
},
	"application/vnd.stardivision.draw": {
	source: "apache",
	extensions: [
		"sda"
	]
},
	"application/vnd.stardivision.impress": {
	source: "apache",
	extensions: [
		"sdd"
	]
},
	"application/vnd.stardivision.math": {
	source: "apache",
	extensions: [
		"smf"
	]
},
	"application/vnd.stardivision.writer": {
	source: "apache",
	extensions: [
		"sdw",
		"vor"
	]
},
	"application/vnd.stardivision.writer-global": {
	source: "apache",
	extensions: [
		"sgl"
	]
},
	"application/vnd.stepmania.package": {
	source: "iana",
	extensions: [
		"smzip"
	]
},
	"application/vnd.stepmania.stepchart": {
	source: "iana",
	extensions: [
		"sm"
	]
},
	"application/vnd.street-stream": {
	source: "iana"
},
	"application/vnd.sun.wadl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wadl"
	]
},
	"application/vnd.sun.xml.calc": {
	source: "apache",
	extensions: [
		"sxc"
	]
},
	"application/vnd.sun.xml.calc.template": {
	source: "apache",
	extensions: [
		"stc"
	]
},
	"application/vnd.sun.xml.draw": {
	source: "apache",
	extensions: [
		"sxd"
	]
},
	"application/vnd.sun.xml.draw.template": {
	source: "apache",
	extensions: [
		"std"
	]
},
	"application/vnd.sun.xml.impress": {
	source: "apache",
	extensions: [
		"sxi"
	]
},
	"application/vnd.sun.xml.impress.template": {
	source: "apache",
	extensions: [
		"sti"
	]
},
	"application/vnd.sun.xml.math": {
	source: "apache",
	extensions: [
		"sxm"
	]
},
	"application/vnd.sun.xml.writer": {
	source: "apache",
	extensions: [
		"sxw"
	]
},
	"application/vnd.sun.xml.writer.global": {
	source: "apache",
	extensions: [
		"sxg"
	]
},
	"application/vnd.sun.xml.writer.template": {
	source: "apache",
	extensions: [
		"stw"
	]
},
	"application/vnd.sus-calendar": {
	source: "iana",
	extensions: [
		"sus",
		"susp"
	]
},
	"application/vnd.svd": {
	source: "iana",
	extensions: [
		"svd"
	]
},
	"application/vnd.swiftview-ics": {
	source: "iana"
},
	"application/vnd.sycle+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.syft+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.symbian.install": {
	source: "apache",
	extensions: [
		"sis",
		"sisx"
	]
},
	"application/vnd.syncml+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"xsm"
	]
},
	"application/vnd.syncml.dm+wbxml": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"bdm"
	]
},
	"application/vnd.syncml.dm+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"xdm"
	]
},
	"application/vnd.syncml.dm.notification": {
	source: "iana"
},
	"application/vnd.syncml.dmddf+wbxml": {
	source: "iana"
},
	"application/vnd.syncml.dmddf+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"ddf"
	]
},
	"application/vnd.syncml.dmtnds+wbxml": {
	source: "iana"
},
	"application/vnd.syncml.dmtnds+xml": {
	source: "iana",
	charset: "UTF-8",
	compressible: true
},
	"application/vnd.syncml.ds.notification": {
	source: "iana"
},
	"application/vnd.tableschema+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.tao.intent-module-archive": {
	source: "iana",
	extensions: [
		"tao"
	]
},
	"application/vnd.tcpdump.pcap": {
	source: "iana",
	extensions: [
		"pcap",
		"cap",
		"dmp"
	]
},
	"application/vnd.think-cell.ppttc+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.tmd.mediaflex.api+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.tml": {
	source: "iana"
},
	"application/vnd.tmobile-livetv": {
	source: "iana",
	extensions: [
		"tmo"
	]
},
	"application/vnd.tri.onesource": {
	source: "iana"
},
	"application/vnd.trid.tpt": {
	source: "iana",
	extensions: [
		"tpt"
	]
},
	"application/vnd.triscape.mxs": {
	source: "iana",
	extensions: [
		"mxs"
	]
},
	"application/vnd.trueapp": {
	source: "iana",
	extensions: [
		"tra"
	]
},
	"application/vnd.truedoc": {
	source: "iana"
},
	"application/vnd.ubisoft.webplayer": {
	source: "iana"
},
	"application/vnd.ufdl": {
	source: "iana",
	extensions: [
		"ufd",
		"ufdl"
	]
},
	"application/vnd.uiq.theme": {
	source: "iana",
	extensions: [
		"utz"
	]
},
	"application/vnd.umajin": {
	source: "iana",
	extensions: [
		"umj"
	]
},
	"application/vnd.unity": {
	source: "iana",
	extensions: [
		"unityweb"
	]
},
	"application/vnd.uoml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"uoml"
	]
},
	"application/vnd.uplanet.alert": {
	source: "iana"
},
	"application/vnd.uplanet.alert-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.bearer-choice": {
	source: "iana"
},
	"application/vnd.uplanet.bearer-choice-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.cacheop": {
	source: "iana"
},
	"application/vnd.uplanet.cacheop-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.channel": {
	source: "iana"
},
	"application/vnd.uplanet.channel-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.list": {
	source: "iana"
},
	"application/vnd.uplanet.list-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.listcmd": {
	source: "iana"
},
	"application/vnd.uplanet.listcmd-wbxml": {
	source: "iana"
},
	"application/vnd.uplanet.signal": {
	source: "iana"
},
	"application/vnd.uri-map": {
	source: "iana"
},
	"application/vnd.valve.source.material": {
	source: "iana"
},
	"application/vnd.vcx": {
	source: "iana",
	extensions: [
		"vcx"
	]
},
	"application/vnd.vd-study": {
	source: "iana"
},
	"application/vnd.vectorworks": {
	source: "iana"
},
	"application/vnd.vel+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.verimatrix.vcas": {
	source: "iana"
},
	"application/vnd.veritone.aion+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.veryant.thin": {
	source: "iana"
},
	"application/vnd.ves.encrypted": {
	source: "iana"
},
	"application/vnd.vidsoft.vidconference": {
	source: "iana"
},
	"application/vnd.visio": {
	source: "iana",
	extensions: [
		"vsd",
		"vst",
		"vss",
		"vsw"
	]
},
	"application/vnd.visionary": {
	source: "iana",
	extensions: [
		"vis"
	]
},
	"application/vnd.vividence.scriptfile": {
	source: "iana"
},
	"application/vnd.vsf": {
	source: "iana",
	extensions: [
		"vsf"
	]
},
	"application/vnd.wap.sic": {
	source: "iana"
},
	"application/vnd.wap.slc": {
	source: "iana"
},
	"application/vnd.wap.wbxml": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"wbxml"
	]
},
	"application/vnd.wap.wmlc": {
	source: "iana",
	extensions: [
		"wmlc"
	]
},
	"application/vnd.wap.wmlscriptc": {
	source: "iana",
	extensions: [
		"wmlsc"
	]
},
	"application/vnd.webturbo": {
	source: "iana",
	extensions: [
		"wtb"
	]
},
	"application/vnd.wfa.dpp": {
	source: "iana"
},
	"application/vnd.wfa.p2p": {
	source: "iana"
},
	"application/vnd.wfa.wsc": {
	source: "iana"
},
	"application/vnd.windows.devicepairing": {
	source: "iana"
},
	"application/vnd.wmc": {
	source: "iana"
},
	"application/vnd.wmf.bootstrap": {
	source: "iana"
},
	"application/vnd.wolfram.mathematica": {
	source: "iana"
},
	"application/vnd.wolfram.mathematica.package": {
	source: "iana"
},
	"application/vnd.wolfram.player": {
	source: "iana",
	extensions: [
		"nbp"
	]
},
	"application/vnd.wordperfect": {
	source: "iana",
	extensions: [
		"wpd"
	]
},
	"application/vnd.wqd": {
	source: "iana",
	extensions: [
		"wqd"
	]
},
	"application/vnd.wrq-hp3000-labelled": {
	source: "iana"
},
	"application/vnd.wt.stf": {
	source: "iana",
	extensions: [
		"stf"
	]
},
	"application/vnd.wv.csp+wbxml": {
	source: "iana"
},
	"application/vnd.wv.csp+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.wv.ssp+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.xacml+json": {
	source: "iana",
	compressible: true
},
	"application/vnd.xara": {
	source: "iana",
	extensions: [
		"xar"
	]
},
	"application/vnd.xfdl": {
	source: "iana",
	extensions: [
		"xfdl"
	]
},
	"application/vnd.xfdl.webform": {
	source: "iana"
},
	"application/vnd.xmi+xml": {
	source: "iana",
	compressible: true
},
	"application/vnd.xmpie.cpkg": {
	source: "iana"
},
	"application/vnd.xmpie.dpkg": {
	source: "iana"
},
	"application/vnd.xmpie.plan": {
	source: "iana"
},
	"application/vnd.xmpie.ppkg": {
	source: "iana"
},
	"application/vnd.xmpie.xlim": {
	source: "iana"
},
	"application/vnd.yamaha.hv-dic": {
	source: "iana",
	extensions: [
		"hvd"
	]
},
	"application/vnd.yamaha.hv-script": {
	source: "iana",
	extensions: [
		"hvs"
	]
},
	"application/vnd.yamaha.hv-voice": {
	source: "iana",
	extensions: [
		"hvp"
	]
},
	"application/vnd.yamaha.openscoreformat": {
	source: "iana",
	extensions: [
		"osf"
	]
},
	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"osfpvg"
	]
},
	"application/vnd.yamaha.remote-setup": {
	source: "iana"
},
	"application/vnd.yamaha.smaf-audio": {
	source: "iana",
	extensions: [
		"saf"
	]
},
	"application/vnd.yamaha.smaf-phrase": {
	source: "iana",
	extensions: [
		"spf"
	]
},
	"application/vnd.yamaha.through-ngn": {
	source: "iana"
},
	"application/vnd.yamaha.tunnel-udpencap": {
	source: "iana"
},
	"application/vnd.yaoweme": {
	source: "iana"
},
	"application/vnd.yellowriver-custom-menu": {
	source: "iana",
	extensions: [
		"cmp"
	]
},
	"application/vnd.youtube.yt": {
	source: "iana"
},
	"application/vnd.zul": {
	source: "iana",
	extensions: [
		"zir",
		"zirz"
	]
},
	"application/vnd.zzazz.deck+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"zaz"
	]
},
	"application/voicexml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"vxml"
	]
},
	"application/voucher-cms+json": {
	source: "iana",
	compressible: true
},
	"application/vq-rtcpxr": {
	source: "iana"
},
	"application/wasm": {
	source: "iana",
	compressible: true,
	extensions: [
		"wasm"
	]
},
	"application/watcherinfo+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wif"
	]
},
	"application/webpush-options+json": {
	source: "iana",
	compressible: true
},
	"application/whoispp-query": {
	source: "iana"
},
	"application/whoispp-response": {
	source: "iana"
},
	"application/widget": {
	source: "iana",
	extensions: [
		"wgt"
	]
},
	"application/winhlp": {
	source: "apache",
	extensions: [
		"hlp"
	]
},
	"application/wita": {
	source: "iana"
},
	"application/wordperfect5.1": {
	source: "iana"
},
	"application/wsdl+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wsdl"
	]
},
	"application/wspolicy+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"wspolicy"
	]
},
	"application/x-7z-compressed": {
	source: "apache",
	compressible: false,
	extensions: [
		"7z"
	]
},
	"application/x-abiword": {
	source: "apache",
	extensions: [
		"abw"
	]
},
	"application/x-ace-compressed": {
	source: "apache",
	extensions: [
		"ace"
	]
},
	"application/x-amf": {
	source: "apache"
},
	"application/x-apple-diskimage": {
	source: "apache",
	extensions: [
		"dmg"
	]
},
	"application/x-arj": {
	compressible: false,
	extensions: [
		"arj"
	]
},
	"application/x-authorware-bin": {
	source: "apache",
	extensions: [
		"aab",
		"x32",
		"u32",
		"vox"
	]
},
	"application/x-authorware-map": {
	source: "apache",
	extensions: [
		"aam"
	]
},
	"application/x-authorware-seg": {
	source: "apache",
	extensions: [
		"aas"
	]
},
	"application/x-bcpio": {
	source: "apache",
	extensions: [
		"bcpio"
	]
},
	"application/x-bdoc": {
	compressible: false,
	extensions: [
		"bdoc"
	]
},
	"application/x-bittorrent": {
	source: "apache",
	extensions: [
		"torrent"
	]
},
	"application/x-blorb": {
	source: "apache",
	extensions: [
		"blb",
		"blorb"
	]
},
	"application/x-bzip": {
	source: "apache",
	compressible: false,
	extensions: [
		"bz"
	]
},
	"application/x-bzip2": {
	source: "apache",
	compressible: false,
	extensions: [
		"bz2",
		"boz"
	]
},
	"application/x-cbr": {
	source: "apache",
	extensions: [
		"cbr",
		"cba",
		"cbt",
		"cbz",
		"cb7"
	]
},
	"application/x-cdlink": {
	source: "apache",
	extensions: [
		"vcd"
	]
},
	"application/x-cfs-compressed": {
	source: "apache",
	extensions: [
		"cfs"
	]
},
	"application/x-chat": {
	source: "apache",
	extensions: [
		"chat"
	]
},
	"application/x-chess-pgn": {
	source: "apache",
	extensions: [
		"pgn"
	]
},
	"application/x-chrome-extension": {
	extensions: [
		"crx"
	]
},
	"application/x-cocoa": {
	source: "nginx",
	extensions: [
		"cco"
	]
},
	"application/x-compress": {
	source: "apache"
},
	"application/x-conference": {
	source: "apache",
	extensions: [
		"nsc"
	]
},
	"application/x-cpio": {
	source: "apache",
	extensions: [
		"cpio"
	]
},
	"application/x-csh": {
	source: "apache",
	extensions: [
		"csh"
	]
},
	"application/x-deb": {
	compressible: false
},
	"application/x-debian-package": {
	source: "apache",
	extensions: [
		"deb",
		"udeb"
	]
},
	"application/x-dgc-compressed": {
	source: "apache",
	extensions: [
		"dgc"
	]
},
	"application/x-director": {
	source: "apache",
	extensions: [
		"dir",
		"dcr",
		"dxr",
		"cst",
		"cct",
		"cxt",
		"w3d",
		"fgd",
		"swa"
	]
},
	"application/x-doom": {
	source: "apache",
	extensions: [
		"wad"
	]
},
	"application/x-dtbncx+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"ncx"
	]
},
	"application/x-dtbook+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"dtb"
	]
},
	"application/x-dtbresource+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"res"
	]
},
	"application/x-dvi": {
	source: "apache",
	compressible: false,
	extensions: [
		"dvi"
	]
},
	"application/x-envoy": {
	source: "apache",
	extensions: [
		"evy"
	]
},
	"application/x-eva": {
	source: "apache",
	extensions: [
		"eva"
	]
},
	"application/x-font-bdf": {
	source: "apache",
	extensions: [
		"bdf"
	]
},
	"application/x-font-dos": {
	source: "apache"
},
	"application/x-font-framemaker": {
	source: "apache"
},
	"application/x-font-ghostscript": {
	source: "apache",
	extensions: [
		"gsf"
	]
},
	"application/x-font-libgrx": {
	source: "apache"
},
	"application/x-font-linux-psf": {
	source: "apache",
	extensions: [
		"psf"
	]
},
	"application/x-font-pcf": {
	source: "apache",
	extensions: [
		"pcf"
	]
},
	"application/x-font-snf": {
	source: "apache",
	extensions: [
		"snf"
	]
},
	"application/x-font-speedo": {
	source: "apache"
},
	"application/x-font-sunos-news": {
	source: "apache"
},
	"application/x-font-type1": {
	source: "apache",
	extensions: [
		"pfa",
		"pfb",
		"pfm",
		"afm"
	]
},
	"application/x-font-vfont": {
	source: "apache"
},
	"application/x-freearc": {
	source: "apache",
	extensions: [
		"arc"
	]
},
	"application/x-futuresplash": {
	source: "apache",
	extensions: [
		"spl"
	]
},
	"application/x-gca-compressed": {
	source: "apache",
	extensions: [
		"gca"
	]
},
	"application/x-glulx": {
	source: "apache",
	extensions: [
		"ulx"
	]
},
	"application/x-gnumeric": {
	source: "apache",
	extensions: [
		"gnumeric"
	]
},
	"application/x-gramps-xml": {
	source: "apache",
	extensions: [
		"gramps"
	]
},
	"application/x-gtar": {
	source: "apache",
	extensions: [
		"gtar"
	]
},
	"application/x-gzip": {
	source: "apache"
},
	"application/x-hdf": {
	source: "apache",
	extensions: [
		"hdf"
	]
},
	"application/x-httpd-php": {
	compressible: true,
	extensions: [
		"php"
	]
},
	"application/x-install-instructions": {
	source: "apache",
	extensions: [
		"install"
	]
},
	"application/x-iso9660-image": {
	source: "apache",
	extensions: [
		"iso"
	]
},
	"application/x-iwork-keynote-sffkey": {
	extensions: [
		"key"
	]
},
	"application/x-iwork-numbers-sffnumbers": {
	extensions: [
		"numbers"
	]
},
	"application/x-iwork-pages-sffpages": {
	extensions: [
		"pages"
	]
},
	"application/x-java-archive-diff": {
	source: "nginx",
	extensions: [
		"jardiff"
	]
},
	"application/x-java-jnlp-file": {
	source: "apache",
	compressible: false,
	extensions: [
		"jnlp"
	]
},
	"application/x-javascript": {
	compressible: true
},
	"application/x-keepass2": {
	extensions: [
		"kdbx"
	]
},
	"application/x-latex": {
	source: "apache",
	compressible: false,
	extensions: [
		"latex"
	]
},
	"application/x-lua-bytecode": {
	extensions: [
		"luac"
	]
},
	"application/x-lzh-compressed": {
	source: "apache",
	extensions: [
		"lzh",
		"lha"
	]
},
	"application/x-makeself": {
	source: "nginx",
	extensions: [
		"run"
	]
},
	"application/x-mie": {
	source: "apache",
	extensions: [
		"mie"
	]
},
	"application/x-mobipocket-ebook": {
	source: "apache",
	extensions: [
		"prc",
		"mobi"
	]
},
	"application/x-mpegurl": {
	compressible: false
},
	"application/x-ms-application": {
	source: "apache",
	extensions: [
		"application"
	]
},
	"application/x-ms-shortcut": {
	source: "apache",
	extensions: [
		"lnk"
	]
},
	"application/x-ms-wmd": {
	source: "apache",
	extensions: [
		"wmd"
	]
},
	"application/x-ms-wmz": {
	source: "apache",
	extensions: [
		"wmz"
	]
},
	"application/x-ms-xbap": {
	source: "apache",
	extensions: [
		"xbap"
	]
},
	"application/x-msaccess": {
	source: "apache",
	extensions: [
		"mdb"
	]
},
	"application/x-msbinder": {
	source: "apache",
	extensions: [
		"obd"
	]
},
	"application/x-mscardfile": {
	source: "apache",
	extensions: [
		"crd"
	]
},
	"application/x-msclip": {
	source: "apache",
	extensions: [
		"clp"
	]
},
	"application/x-msdos-program": {
	extensions: [
		"exe"
	]
},
	"application/x-msdownload": {
	source: "apache",
	extensions: [
		"exe",
		"dll",
		"com",
		"bat",
		"msi"
	]
},
	"application/x-msmediaview": {
	source: "apache",
	extensions: [
		"mvb",
		"m13",
		"m14"
	]
},
	"application/x-msmetafile": {
	source: "apache",
	extensions: [
		"wmf",
		"wmz",
		"emf",
		"emz"
	]
},
	"application/x-msmoney": {
	source: "apache",
	extensions: [
		"mny"
	]
},
	"application/x-mspublisher": {
	source: "apache",
	extensions: [
		"pub"
	]
},
	"application/x-msschedule": {
	source: "apache",
	extensions: [
		"scd"
	]
},
	"application/x-msterminal": {
	source: "apache",
	extensions: [
		"trm"
	]
},
	"application/x-mswrite": {
	source: "apache",
	extensions: [
		"wri"
	]
},
	"application/x-netcdf": {
	source: "apache",
	extensions: [
		"nc",
		"cdf"
	]
},
	"application/x-ns-proxy-autoconfig": {
	compressible: true,
	extensions: [
		"pac"
	]
},
	"application/x-nzb": {
	source: "apache",
	extensions: [
		"nzb"
	]
},
	"application/x-perl": {
	source: "nginx",
	extensions: [
		"pl",
		"pm"
	]
},
	"application/x-pilot": {
	source: "nginx",
	extensions: [
		"prc",
		"pdb"
	]
},
	"application/x-pkcs12": {
	source: "apache",
	compressible: false,
	extensions: [
		"p12",
		"pfx"
	]
},
	"application/x-pkcs7-certificates": {
	source: "apache",
	extensions: [
		"p7b",
		"spc"
	]
},
	"application/x-pkcs7-certreqresp": {
	source: "apache",
	extensions: [
		"p7r"
	]
},
	"application/x-pki-message": {
	source: "iana"
},
	"application/x-rar-compressed": {
	source: "apache",
	compressible: false,
	extensions: [
		"rar"
	]
},
	"application/x-redhat-package-manager": {
	source: "nginx",
	extensions: [
		"rpm"
	]
},
	"application/x-research-info-systems": {
	source: "apache",
	extensions: [
		"ris"
	]
},
	"application/x-sea": {
	source: "nginx",
	extensions: [
		"sea"
	]
},
	"application/x-sh": {
	source: "apache",
	compressible: true,
	extensions: [
		"sh"
	]
},
	"application/x-shar": {
	source: "apache",
	extensions: [
		"shar"
	]
},
	"application/x-shockwave-flash": {
	source: "apache",
	compressible: false,
	extensions: [
		"swf"
	]
},
	"application/x-silverlight-app": {
	source: "apache",
	extensions: [
		"xap"
	]
},
	"application/x-sql": {
	source: "apache",
	extensions: [
		"sql"
	]
},
	"application/x-stuffit": {
	source: "apache",
	compressible: false,
	extensions: [
		"sit"
	]
},
	"application/x-stuffitx": {
	source: "apache",
	extensions: [
		"sitx"
	]
},
	"application/x-subrip": {
	source: "apache",
	extensions: [
		"srt"
	]
},
	"application/x-sv4cpio": {
	source: "apache",
	extensions: [
		"sv4cpio"
	]
},
	"application/x-sv4crc": {
	source: "apache",
	extensions: [
		"sv4crc"
	]
},
	"application/x-t3vm-image": {
	source: "apache",
	extensions: [
		"t3"
	]
},
	"application/x-tads": {
	source: "apache",
	extensions: [
		"gam"
	]
},
	"application/x-tar": {
	source: "apache",
	compressible: true,
	extensions: [
		"tar"
	]
},
	"application/x-tcl": {
	source: "apache",
	extensions: [
		"tcl",
		"tk"
	]
},
	"application/x-tex": {
	source: "apache",
	extensions: [
		"tex"
	]
},
	"application/x-tex-tfm": {
	source: "apache",
	extensions: [
		"tfm"
	]
},
	"application/x-texinfo": {
	source: "apache",
	extensions: [
		"texinfo",
		"texi"
	]
},
	"application/x-tgif": {
	source: "apache",
	extensions: [
		"obj"
	]
},
	"application/x-ustar": {
	source: "apache",
	extensions: [
		"ustar"
	]
},
	"application/x-virtualbox-hdd": {
	compressible: true,
	extensions: [
		"hdd"
	]
},
	"application/x-virtualbox-ova": {
	compressible: true,
	extensions: [
		"ova"
	]
},
	"application/x-virtualbox-ovf": {
	compressible: true,
	extensions: [
		"ovf"
	]
},
	"application/x-virtualbox-vbox": {
	compressible: true,
	extensions: [
		"vbox"
	]
},
	"application/x-virtualbox-vbox-extpack": {
	compressible: false,
	extensions: [
		"vbox-extpack"
	]
},
	"application/x-virtualbox-vdi": {
	compressible: true,
	extensions: [
		"vdi"
	]
},
	"application/x-virtualbox-vhd": {
	compressible: true,
	extensions: [
		"vhd"
	]
},
	"application/x-virtualbox-vmdk": {
	compressible: true,
	extensions: [
		"vmdk"
	]
},
	"application/x-wais-source": {
	source: "apache",
	extensions: [
		"src"
	]
},
	"application/x-web-app-manifest+json": {
	compressible: true,
	extensions: [
		"webapp"
	]
},
	"application/x-www-form-urlencoded": {
	source: "iana",
	compressible: true
},
	"application/x-x509-ca-cert": {
	source: "iana",
	extensions: [
		"der",
		"crt",
		"pem"
	]
},
	"application/x-x509-ca-ra-cert": {
	source: "iana"
},
	"application/x-x509-next-ca-cert": {
	source: "iana"
},
	"application/x-xfig": {
	source: "apache",
	extensions: [
		"fig"
	]
},
	"application/x-xliff+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xlf"
	]
},
	"application/x-xpinstall": {
	source: "apache",
	compressible: false,
	extensions: [
		"xpi"
	]
},
	"application/x-xz": {
	source: "apache",
	extensions: [
		"xz"
	]
},
	"application/x-zmachine": {
	source: "apache",
	extensions: [
		"z1",
		"z2",
		"z3",
		"z4",
		"z5",
		"z6",
		"z7",
		"z8"
	]
},
	"application/x400-bp": {
	source: "iana"
},
	"application/xacml+xml": {
	source: "iana",
	compressible: true
},
	"application/xaml+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xaml"
	]
},
	"application/xcap-att+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xav"
	]
},
	"application/xcap-caps+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xca"
	]
},
	"application/xcap-diff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xdf"
	]
},
	"application/xcap-el+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xel"
	]
},
	"application/xcap-error+xml": {
	source: "iana",
	compressible: true
},
	"application/xcap-ns+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xns"
	]
},
	"application/xcon-conference-info+xml": {
	source: "iana",
	compressible: true
},
	"application/xcon-conference-info-diff+xml": {
	source: "iana",
	compressible: true
},
	"application/xenc+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xenc"
	]
},
	"application/xhtml+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xhtml",
		"xht"
	]
},
	"application/xhtml-voice+xml": {
	source: "apache",
	compressible: true
},
	"application/xliff+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xlf"
	]
},
	"application/xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xml",
		"xsl",
		"xsd",
		"rng"
	]
},
	"application/xml-dtd": {
	source: "iana",
	compressible: true,
	extensions: [
		"dtd"
	]
},
	"application/xml-external-parsed-entity": {
	source: "iana"
},
	"application/xml-patch+xml": {
	source: "iana",
	compressible: true
},
	"application/xmpp+xml": {
	source: "iana",
	compressible: true
},
	"application/xop+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xop"
	]
},
	"application/xproc+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xpl"
	]
},
	"application/xslt+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xsl",
		"xslt"
	]
},
	"application/xspf+xml": {
	source: "apache",
	compressible: true,
	extensions: [
		"xspf"
	]
},
	"application/xv+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"mxml",
		"xhvml",
		"xvml",
		"xvm"
	]
},
	"application/yang": {
	source: "iana",
	extensions: [
		"yang"
	]
},
	"application/yang-data+json": {
	source: "iana",
	compressible: true
},
	"application/yang-data+xml": {
	source: "iana",
	compressible: true
},
	"application/yang-patch+json": {
	source: "iana",
	compressible: true
},
	"application/yang-patch+xml": {
	source: "iana",
	compressible: true
},
	"application/yin+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"yin"
	]
},
	"application/zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"zip"
	]
},
	"application/zlib": {
	source: "iana"
},
	"application/zstd": {
	source: "iana"
},
	"audio/1d-interleaved-parityfec": {
	source: "iana"
},
	"audio/32kadpcm": {
	source: "iana"
},
	"audio/3gpp": {
	source: "iana",
	compressible: false,
	extensions: [
		"3gpp"
	]
},
	"audio/3gpp2": {
	source: "iana"
},
	"audio/aac": {
	source: "iana"
},
	"audio/ac3": {
	source: "iana"
},
	"audio/adpcm": {
	source: "apache",
	extensions: [
		"adp"
	]
},
	"audio/amr": {
	source: "iana",
	extensions: [
		"amr"
	]
},
	"audio/amr-wb": {
	source: "iana"
},
	"audio/amr-wb+": {
	source: "iana"
},
	"audio/aptx": {
	source: "iana"
},
	"audio/asc": {
	source: "iana"
},
	"audio/atrac-advanced-lossless": {
	source: "iana"
},
	"audio/atrac-x": {
	source: "iana"
},
	"audio/atrac3": {
	source: "iana"
},
	"audio/basic": {
	source: "iana",
	compressible: false,
	extensions: [
		"au",
		"snd"
	]
},
	"audio/bv16": {
	source: "iana"
},
	"audio/bv32": {
	source: "iana"
},
	"audio/clearmode": {
	source: "iana"
},
	"audio/cn": {
	source: "iana"
},
	"audio/dat12": {
	source: "iana"
},
	"audio/dls": {
	source: "iana"
},
	"audio/dsr-es201108": {
	source: "iana"
},
	"audio/dsr-es202050": {
	source: "iana"
},
	"audio/dsr-es202211": {
	source: "iana"
},
	"audio/dsr-es202212": {
	source: "iana"
},
	"audio/dv": {
	source: "iana"
},
	"audio/dvi4": {
	source: "iana"
},
	"audio/eac3": {
	source: "iana"
},
	"audio/encaprtp": {
	source: "iana"
},
	"audio/evrc": {
	source: "iana"
},
	"audio/evrc-qcp": {
	source: "iana"
},
	"audio/evrc0": {
	source: "iana"
},
	"audio/evrc1": {
	source: "iana"
},
	"audio/evrcb": {
	source: "iana"
},
	"audio/evrcb0": {
	source: "iana"
},
	"audio/evrcb1": {
	source: "iana"
},
	"audio/evrcnw": {
	source: "iana"
},
	"audio/evrcnw0": {
	source: "iana"
},
	"audio/evrcnw1": {
	source: "iana"
},
	"audio/evrcwb": {
	source: "iana"
},
	"audio/evrcwb0": {
	source: "iana"
},
	"audio/evrcwb1": {
	source: "iana"
},
	"audio/evs": {
	source: "iana"
},
	"audio/flexfec": {
	source: "iana"
},
	"audio/fwdred": {
	source: "iana"
},
	"audio/g711-0": {
	source: "iana"
},
	"audio/g719": {
	source: "iana"
},
	"audio/g722": {
	source: "iana"
},
	"audio/g7221": {
	source: "iana"
},
	"audio/g723": {
	source: "iana"
},
	"audio/g726-16": {
	source: "iana"
},
	"audio/g726-24": {
	source: "iana"
},
	"audio/g726-32": {
	source: "iana"
},
	"audio/g726-40": {
	source: "iana"
},
	"audio/g728": {
	source: "iana"
},
	"audio/g729": {
	source: "iana"
},
	"audio/g7291": {
	source: "iana"
},
	"audio/g729d": {
	source: "iana"
},
	"audio/g729e": {
	source: "iana"
},
	"audio/gsm": {
	source: "iana"
},
	"audio/gsm-efr": {
	source: "iana"
},
	"audio/gsm-hr-08": {
	source: "iana"
},
	"audio/ilbc": {
	source: "iana"
},
	"audio/ip-mr_v2.5": {
	source: "iana"
},
	"audio/isac": {
	source: "apache"
},
	"audio/l16": {
	source: "iana"
},
	"audio/l20": {
	source: "iana"
},
	"audio/l24": {
	source: "iana",
	compressible: false
},
	"audio/l8": {
	source: "iana"
},
	"audio/lpc": {
	source: "iana"
},
	"audio/melp": {
	source: "iana"
},
	"audio/melp1200": {
	source: "iana"
},
	"audio/melp2400": {
	source: "iana"
},
	"audio/melp600": {
	source: "iana"
},
	"audio/mhas": {
	source: "iana"
},
	"audio/midi": {
	source: "apache",
	extensions: [
		"mid",
		"midi",
		"kar",
		"rmi"
	]
},
	"audio/mobile-xmf": {
	source: "iana",
	extensions: [
		"mxmf"
	]
},
	"audio/mp3": {
	compressible: false,
	extensions: [
		"mp3"
	]
},
	"audio/mp4": {
	source: "iana",
	compressible: false,
	extensions: [
		"m4a",
		"mp4a"
	]
},
	"audio/mp4a-latm": {
	source: "iana"
},
	"audio/mpa": {
	source: "iana"
},
	"audio/mpa-robust": {
	source: "iana"
},
	"audio/mpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"mpga",
		"mp2",
		"mp2a",
		"mp3",
		"m2a",
		"m3a"
	]
},
	"audio/mpeg4-generic": {
	source: "iana"
},
	"audio/musepack": {
	source: "apache"
},
	"audio/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"oga",
		"ogg",
		"spx",
		"opus"
	]
},
	"audio/opus": {
	source: "iana"
},
	"audio/parityfec": {
	source: "iana"
},
	"audio/pcma": {
	source: "iana"
},
	"audio/pcma-wb": {
	source: "iana"
},
	"audio/pcmu": {
	source: "iana"
},
	"audio/pcmu-wb": {
	source: "iana"
},
	"audio/prs.sid": {
	source: "iana"
},
	"audio/qcelp": {
	source: "iana"
},
	"audio/raptorfec": {
	source: "iana"
},
	"audio/red": {
	source: "iana"
},
	"audio/rtp-enc-aescm128": {
	source: "iana"
},
	"audio/rtp-midi": {
	source: "iana"
},
	"audio/rtploopback": {
	source: "iana"
},
	"audio/rtx": {
	source: "iana"
},
	"audio/s3m": {
	source: "apache",
	extensions: [
		"s3m"
	]
},
	"audio/scip": {
	source: "iana"
},
	"audio/silk": {
	source: "apache",
	extensions: [
		"sil"
	]
},
	"audio/smv": {
	source: "iana"
},
	"audio/smv-qcp": {
	source: "iana"
},
	"audio/smv0": {
	source: "iana"
},
	"audio/sofa": {
	source: "iana"
},
	"audio/sp-midi": {
	source: "iana"
},
	"audio/speex": {
	source: "iana"
},
	"audio/t140c": {
	source: "iana"
},
	"audio/t38": {
	source: "iana"
},
	"audio/telephone-event": {
	source: "iana"
},
	"audio/tetra_acelp": {
	source: "iana"
},
	"audio/tetra_acelp_bb": {
	source: "iana"
},
	"audio/tone": {
	source: "iana"
},
	"audio/tsvcis": {
	source: "iana"
},
	"audio/uemclip": {
	source: "iana"
},
	"audio/ulpfec": {
	source: "iana"
},
	"audio/usac": {
	source: "iana"
},
	"audio/vdvi": {
	source: "iana"
},
	"audio/vmr-wb": {
	source: "iana"
},
	"audio/vnd.3gpp.iufp": {
	source: "iana"
},
	"audio/vnd.4sb": {
	source: "iana"
},
	"audio/vnd.audiokoz": {
	source: "iana"
},
	"audio/vnd.celp": {
	source: "iana"
},
	"audio/vnd.cisco.nse": {
	source: "iana"
},
	"audio/vnd.cmles.radio-events": {
	source: "iana"
},
	"audio/vnd.cns.anp1": {
	source: "iana"
},
	"audio/vnd.cns.inf1": {
	source: "iana"
},
	"audio/vnd.dece.audio": {
	source: "iana",
	extensions: [
		"uva",
		"uvva"
	]
},
	"audio/vnd.digital-winds": {
	source: "iana",
	extensions: [
		"eol"
	]
},
	"audio/vnd.dlna.adts": {
	source: "iana"
},
	"audio/vnd.dolby.heaac.1": {
	source: "iana"
},
	"audio/vnd.dolby.heaac.2": {
	source: "iana"
},
	"audio/vnd.dolby.mlp": {
	source: "iana"
},
	"audio/vnd.dolby.mps": {
	source: "iana"
},
	"audio/vnd.dolby.pl2": {
	source: "iana"
},
	"audio/vnd.dolby.pl2x": {
	source: "iana"
},
	"audio/vnd.dolby.pl2z": {
	source: "iana"
},
	"audio/vnd.dolby.pulse.1": {
	source: "iana"
},
	"audio/vnd.dra": {
	source: "iana",
	extensions: [
		"dra"
	]
},
	"audio/vnd.dts": {
	source: "iana",
	extensions: [
		"dts"
	]
},
	"audio/vnd.dts.hd": {
	source: "iana",
	extensions: [
		"dtshd"
	]
},
	"audio/vnd.dts.uhd": {
	source: "iana"
},
	"audio/vnd.dvb.file": {
	source: "iana"
},
	"audio/vnd.everad.plj": {
	source: "iana"
},
	"audio/vnd.hns.audio": {
	source: "iana"
},
	"audio/vnd.lucent.voice": {
	source: "iana",
	extensions: [
		"lvp"
	]
},
	"audio/vnd.ms-playready.media.pya": {
	source: "iana",
	extensions: [
		"pya"
	]
},
	"audio/vnd.nokia.mobile-xmf": {
	source: "iana"
},
	"audio/vnd.nortel.vbk": {
	source: "iana"
},
	"audio/vnd.nuera.ecelp4800": {
	source: "iana",
	extensions: [
		"ecelp4800"
	]
},
	"audio/vnd.nuera.ecelp7470": {
	source: "iana",
	extensions: [
		"ecelp7470"
	]
},
	"audio/vnd.nuera.ecelp9600": {
	source: "iana",
	extensions: [
		"ecelp9600"
	]
},
	"audio/vnd.octel.sbc": {
	source: "iana"
},
	"audio/vnd.presonus.multitrack": {
	source: "iana"
},
	"audio/vnd.qcelp": {
	source: "iana"
},
	"audio/vnd.rhetorex.32kadpcm": {
	source: "iana"
},
	"audio/vnd.rip": {
	source: "iana",
	extensions: [
		"rip"
	]
},
	"audio/vnd.rn-realaudio": {
	compressible: false
},
	"audio/vnd.sealedmedia.softseal.mpeg": {
	source: "iana"
},
	"audio/vnd.vmx.cvsd": {
	source: "iana"
},
	"audio/vnd.wave": {
	compressible: false
},
	"audio/vorbis": {
	source: "iana",
	compressible: false
},
	"audio/vorbis-config": {
	source: "iana"
},
	"audio/wav": {
	compressible: false,
	extensions: [
		"wav"
	]
},
	"audio/wave": {
	compressible: false,
	extensions: [
		"wav"
	]
},
	"audio/webm": {
	source: "apache",
	compressible: false,
	extensions: [
		"weba"
	]
},
	"audio/x-aac": {
	source: "apache",
	compressible: false,
	extensions: [
		"aac"
	]
},
	"audio/x-aiff": {
	source: "apache",
	extensions: [
		"aif",
		"aiff",
		"aifc"
	]
},
	"audio/x-caf": {
	source: "apache",
	compressible: false,
	extensions: [
		"caf"
	]
},
	"audio/x-flac": {
	source: "apache",
	extensions: [
		"flac"
	]
},
	"audio/x-m4a": {
	source: "nginx",
	extensions: [
		"m4a"
	]
},
	"audio/x-matroska": {
	source: "apache",
	extensions: [
		"mka"
	]
},
	"audio/x-mpegurl": {
	source: "apache",
	extensions: [
		"m3u"
	]
},
	"audio/x-ms-wax": {
	source: "apache",
	extensions: [
		"wax"
	]
},
	"audio/x-ms-wma": {
	source: "apache",
	extensions: [
		"wma"
	]
},
	"audio/x-pn-realaudio": {
	source: "apache",
	extensions: [
		"ram",
		"ra"
	]
},
	"audio/x-pn-realaudio-plugin": {
	source: "apache",
	extensions: [
		"rmp"
	]
},
	"audio/x-realaudio": {
	source: "nginx",
	extensions: [
		"ra"
	]
},
	"audio/x-tta": {
	source: "apache"
},
	"audio/x-wav": {
	source: "apache",
	extensions: [
		"wav"
	]
},
	"audio/xm": {
	source: "apache",
	extensions: [
		"xm"
	]
},
	"chemical/x-cdx": {
	source: "apache",
	extensions: [
		"cdx"
	]
},
	"chemical/x-cif": {
	source: "apache",
	extensions: [
		"cif"
	]
},
	"chemical/x-cmdf": {
	source: "apache",
	extensions: [
		"cmdf"
	]
},
	"chemical/x-cml": {
	source: "apache",
	extensions: [
		"cml"
	]
},
	"chemical/x-csml": {
	source: "apache",
	extensions: [
		"csml"
	]
},
	"chemical/x-pdb": {
	source: "apache"
},
	"chemical/x-xyz": {
	source: "apache",
	extensions: [
		"xyz"
	]
},
	"font/collection": {
	source: "iana",
	extensions: [
		"ttc"
	]
},
	"font/otf": {
	source: "iana",
	compressible: true,
	extensions: [
		"otf"
	]
},
	"font/sfnt": {
	source: "iana"
},
	"font/ttf": {
	source: "iana",
	compressible: true,
	extensions: [
		"ttf"
	]
},
	"font/woff": {
	source: "iana",
	extensions: [
		"woff"
	]
},
	"font/woff2": {
	source: "iana",
	extensions: [
		"woff2"
	]
},
	"image/aces": {
	source: "iana",
	extensions: [
		"exr"
	]
},
	"image/apng": {
	compressible: false,
	extensions: [
		"apng"
	]
},
	"image/avci": {
	source: "iana",
	extensions: [
		"avci"
	]
},
	"image/avcs": {
	source: "iana",
	extensions: [
		"avcs"
	]
},
	"image/avif": {
	source: "iana",
	compressible: false,
	extensions: [
		"avif"
	]
},
	"image/bmp": {
	source: "iana",
	compressible: true,
	extensions: [
		"bmp"
	]
},
	"image/cgm": {
	source: "iana",
	extensions: [
		"cgm"
	]
},
	"image/dicom-rle": {
	source: "iana",
	extensions: [
		"drle"
	]
},
	"image/emf": {
	source: "iana",
	extensions: [
		"emf"
	]
},
	"image/fits": {
	source: "iana",
	extensions: [
		"fits"
	]
},
	"image/g3fax": {
	source: "iana",
	extensions: [
		"g3"
	]
},
	"image/gif": {
	source: "iana",
	compressible: false,
	extensions: [
		"gif"
	]
},
	"image/heic": {
	source: "iana",
	extensions: [
		"heic"
	]
},
	"image/heic-sequence": {
	source: "iana",
	extensions: [
		"heics"
	]
},
	"image/heif": {
	source: "iana",
	extensions: [
		"heif"
	]
},
	"image/heif-sequence": {
	source: "iana",
	extensions: [
		"heifs"
	]
},
	"image/hej2k": {
	source: "iana",
	extensions: [
		"hej2"
	]
},
	"image/hsj2": {
	source: "iana",
	extensions: [
		"hsj2"
	]
},
	"image/ief": {
	source: "iana",
	extensions: [
		"ief"
	]
},
	"image/jls": {
	source: "iana",
	extensions: [
		"jls"
	]
},
	"image/jp2": {
	source: "iana",
	compressible: false,
	extensions: [
		"jp2",
		"jpg2"
	]
},
	"image/jpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpeg",
		"jpg",
		"jpe"
	]
},
	"image/jph": {
	source: "iana",
	extensions: [
		"jph"
	]
},
	"image/jphc": {
	source: "iana",
	extensions: [
		"jhc"
	]
},
	"image/jpm": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpm"
	]
},
	"image/jpx": {
	source: "iana",
	compressible: false,
	extensions: [
		"jpx",
		"jpf"
	]
},
	"image/jxr": {
	source: "iana",
	extensions: [
		"jxr"
	]
},
	"image/jxra": {
	source: "iana",
	extensions: [
		"jxra"
	]
},
	"image/jxrs": {
	source: "iana",
	extensions: [
		"jxrs"
	]
},
	"image/jxs": {
	source: "iana",
	extensions: [
		"jxs"
	]
},
	"image/jxsc": {
	source: "iana",
	extensions: [
		"jxsc"
	]
},
	"image/jxsi": {
	source: "iana",
	extensions: [
		"jxsi"
	]
},
	"image/jxss": {
	source: "iana",
	extensions: [
		"jxss"
	]
},
	"image/ktx": {
	source: "iana",
	extensions: [
		"ktx"
	]
},
	"image/ktx2": {
	source: "iana",
	extensions: [
		"ktx2"
	]
},
	"image/naplps": {
	source: "iana"
},
	"image/pjpeg": {
	compressible: false
},
	"image/png": {
	source: "iana",
	compressible: false,
	extensions: [
		"png"
	]
},
	"image/prs.btif": {
	source: "iana",
	extensions: [
		"btif"
	]
},
	"image/prs.pti": {
	source: "iana",
	extensions: [
		"pti"
	]
},
	"image/pwg-raster": {
	source: "iana"
},
	"image/sgi": {
	source: "apache",
	extensions: [
		"sgi"
	]
},
	"image/svg+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"svg",
		"svgz"
	]
},
	"image/t38": {
	source: "iana",
	extensions: [
		"t38"
	]
},
	"image/tiff": {
	source: "iana",
	compressible: false,
	extensions: [
		"tif",
		"tiff"
	]
},
	"image/tiff-fx": {
	source: "iana",
	extensions: [
		"tfx"
	]
},
	"image/vnd.adobe.photoshop": {
	source: "iana",
	compressible: true,
	extensions: [
		"psd"
	]
},
	"image/vnd.airzip.accelerator.azv": {
	source: "iana",
	extensions: [
		"azv"
	]
},
	"image/vnd.cns.inf2": {
	source: "iana"
},
	"image/vnd.dece.graphic": {
	source: "iana",
	extensions: [
		"uvi",
		"uvvi",
		"uvg",
		"uvvg"
	]
},
	"image/vnd.djvu": {
	source: "iana",
	extensions: [
		"djvu",
		"djv"
	]
},
	"image/vnd.dvb.subtitle": {
	source: "iana",
	extensions: [
		"sub"
	]
},
	"image/vnd.dwg": {
	source: "iana",
	extensions: [
		"dwg"
	]
},
	"image/vnd.dxf": {
	source: "iana",
	extensions: [
		"dxf"
	]
},
	"image/vnd.fastbidsheet": {
	source: "iana",
	extensions: [
		"fbs"
	]
},
	"image/vnd.fpx": {
	source: "iana",
	extensions: [
		"fpx"
	]
},
	"image/vnd.fst": {
	source: "iana",
	extensions: [
		"fst"
	]
},
	"image/vnd.fujixerox.edmics-mmr": {
	source: "iana",
	extensions: [
		"mmr"
	]
},
	"image/vnd.fujixerox.edmics-rlc": {
	source: "iana",
	extensions: [
		"rlc"
	]
},
	"image/vnd.globalgraphics.pgb": {
	source: "iana"
},
	"image/vnd.microsoft.icon": {
	source: "iana",
	compressible: true,
	extensions: [
		"ico"
	]
},
	"image/vnd.mix": {
	source: "iana"
},
	"image/vnd.mozilla.apng": {
	source: "iana"
},
	"image/vnd.ms-dds": {
	compressible: true,
	extensions: [
		"dds"
	]
},
	"image/vnd.ms-modi": {
	source: "iana",
	extensions: [
		"mdi"
	]
},
	"image/vnd.ms-photo": {
	source: "apache",
	extensions: [
		"wdp"
	]
},
	"image/vnd.net-fpx": {
	source: "iana",
	extensions: [
		"npx"
	]
},
	"image/vnd.pco.b16": {
	source: "iana",
	extensions: [
		"b16"
	]
},
	"image/vnd.radiance": {
	source: "iana"
},
	"image/vnd.sealed.png": {
	source: "iana"
},
	"image/vnd.sealedmedia.softseal.gif": {
	source: "iana"
},
	"image/vnd.sealedmedia.softseal.jpg": {
	source: "iana"
},
	"image/vnd.svf": {
	source: "iana"
},
	"image/vnd.tencent.tap": {
	source: "iana",
	extensions: [
		"tap"
	]
},
	"image/vnd.valve.source.texture": {
	source: "iana",
	extensions: [
		"vtf"
	]
},
	"image/vnd.wap.wbmp": {
	source: "iana",
	extensions: [
		"wbmp"
	]
},
	"image/vnd.xiff": {
	source: "iana",
	extensions: [
		"xif"
	]
},
	"image/vnd.zbrush.pcx": {
	source: "iana",
	extensions: [
		"pcx"
	]
},
	"image/webp": {
	source: "apache",
	extensions: [
		"webp"
	]
},
	"image/wmf": {
	source: "iana",
	extensions: [
		"wmf"
	]
},
	"image/x-3ds": {
	source: "apache",
	extensions: [
		"3ds"
	]
},
	"image/x-cmu-raster": {
	source: "apache",
	extensions: [
		"ras"
	]
},
	"image/x-cmx": {
	source: "apache",
	extensions: [
		"cmx"
	]
},
	"image/x-freehand": {
	source: "apache",
	extensions: [
		"fh",
		"fhc",
		"fh4",
		"fh5",
		"fh7"
	]
},
	"image/x-icon": {
	source: "apache",
	compressible: true,
	extensions: [
		"ico"
	]
},
	"image/x-jng": {
	source: "nginx",
	extensions: [
		"jng"
	]
},
	"image/x-mrsid-image": {
	source: "apache",
	extensions: [
		"sid"
	]
},
	"image/x-ms-bmp": {
	source: "nginx",
	compressible: true,
	extensions: [
		"bmp"
	]
},
	"image/x-pcx": {
	source: "apache",
	extensions: [
		"pcx"
	]
},
	"image/x-pict": {
	source: "apache",
	extensions: [
		"pic",
		"pct"
	]
},
	"image/x-portable-anymap": {
	source: "apache",
	extensions: [
		"pnm"
	]
},
	"image/x-portable-bitmap": {
	source: "apache",
	extensions: [
		"pbm"
	]
},
	"image/x-portable-graymap": {
	source: "apache",
	extensions: [
		"pgm"
	]
},
	"image/x-portable-pixmap": {
	source: "apache",
	extensions: [
		"ppm"
	]
},
	"image/x-rgb": {
	source: "apache",
	extensions: [
		"rgb"
	]
},
	"image/x-tga": {
	source: "apache",
	extensions: [
		"tga"
	]
},
	"image/x-xbitmap": {
	source: "apache",
	extensions: [
		"xbm"
	]
},
	"image/x-xcf": {
	compressible: false
},
	"image/x-xpixmap": {
	source: "apache",
	extensions: [
		"xpm"
	]
},
	"image/x-xwindowdump": {
	source: "apache",
	extensions: [
		"xwd"
	]
},
	"message/cpim": {
	source: "iana"
},
	"message/delivery-status": {
	source: "iana"
},
	"message/disposition-notification": {
	source: "iana",
	extensions: [
		"disposition-notification"
	]
},
	"message/external-body": {
	source: "iana"
},
	"message/feedback-report": {
	source: "iana"
},
	"message/global": {
	source: "iana",
	extensions: [
		"u8msg"
	]
},
	"message/global-delivery-status": {
	source: "iana",
	extensions: [
		"u8dsn"
	]
},
	"message/global-disposition-notification": {
	source: "iana",
	extensions: [
		"u8mdn"
	]
},
	"message/global-headers": {
	source: "iana",
	extensions: [
		"u8hdr"
	]
},
	"message/http": {
	source: "iana",
	compressible: false
},
	"message/imdn+xml": {
	source: "iana",
	compressible: true
},
	"message/news": {
	source: "iana"
},
	"message/partial": {
	source: "iana",
	compressible: false
},
	"message/rfc822": {
	source: "iana",
	compressible: true,
	extensions: [
		"eml",
		"mime"
	]
},
	"message/s-http": {
	source: "iana"
},
	"message/sip": {
	source: "iana"
},
	"message/sipfrag": {
	source: "iana"
},
	"message/tracking-status": {
	source: "iana"
},
	"message/vnd.si.simp": {
	source: "iana"
},
	"message/vnd.wfa.wsc": {
	source: "iana",
	extensions: [
		"wsc"
	]
},
	"model/3mf": {
	source: "iana",
	extensions: [
		"3mf"
	]
},
	"model/e57": {
	source: "iana"
},
	"model/gltf+json": {
	source: "iana",
	compressible: true,
	extensions: [
		"gltf"
	]
},
	"model/gltf-binary": {
	source: "iana",
	compressible: true,
	extensions: [
		"glb"
	]
},
	"model/iges": {
	source: "iana",
	compressible: false,
	extensions: [
		"igs",
		"iges"
	]
},
	"model/mesh": {
	source: "iana",
	compressible: false,
	extensions: [
		"msh",
		"mesh",
		"silo"
	]
},
	"model/mtl": {
	source: "iana",
	extensions: [
		"mtl"
	]
},
	"model/obj": {
	source: "iana",
	extensions: [
		"obj"
	]
},
	"model/step": {
	source: "iana"
},
	"model/step+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"stpx"
	]
},
	"model/step+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"stpz"
	]
},
	"model/step-xml+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"stpxz"
	]
},
	"model/stl": {
	source: "iana",
	extensions: [
		"stl"
	]
},
	"model/vnd.collada+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"dae"
	]
},
	"model/vnd.dwf": {
	source: "iana",
	extensions: [
		"dwf"
	]
},
	"model/vnd.flatland.3dml": {
	source: "iana"
},
	"model/vnd.gdl": {
	source: "iana",
	extensions: [
		"gdl"
	]
},
	"model/vnd.gs-gdl": {
	source: "apache"
},
	"model/vnd.gs.gdl": {
	source: "iana"
},
	"model/vnd.gtw": {
	source: "iana",
	extensions: [
		"gtw"
	]
},
	"model/vnd.moml+xml": {
	source: "iana",
	compressible: true
},
	"model/vnd.mts": {
	source: "iana",
	extensions: [
		"mts"
	]
},
	"model/vnd.opengex": {
	source: "iana",
	extensions: [
		"ogex"
	]
},
	"model/vnd.parasolid.transmit.binary": {
	source: "iana",
	extensions: [
		"x_b"
	]
},
	"model/vnd.parasolid.transmit.text": {
	source: "iana",
	extensions: [
		"x_t"
	]
},
	"model/vnd.pytha.pyox": {
	source: "iana"
},
	"model/vnd.rosette.annotated-data-model": {
	source: "iana"
},
	"model/vnd.sap.vds": {
	source: "iana",
	extensions: [
		"vds"
	]
},
	"model/vnd.usdz+zip": {
	source: "iana",
	compressible: false,
	extensions: [
		"usdz"
	]
},
	"model/vnd.valve.source.compiled-map": {
	source: "iana",
	extensions: [
		"bsp"
	]
},
	"model/vnd.vtu": {
	source: "iana",
	extensions: [
		"vtu"
	]
},
	"model/vrml": {
	source: "iana",
	compressible: false,
	extensions: [
		"wrl",
		"vrml"
	]
},
	"model/x3d+binary": {
	source: "apache",
	compressible: false,
	extensions: [
		"x3db",
		"x3dbz"
	]
},
	"model/x3d+fastinfoset": {
	source: "iana",
	extensions: [
		"x3db"
	]
},
	"model/x3d+vrml": {
	source: "apache",
	compressible: false,
	extensions: [
		"x3dv",
		"x3dvz"
	]
},
	"model/x3d+xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"x3d",
		"x3dz"
	]
},
	"model/x3d-vrml": {
	source: "iana",
	extensions: [
		"x3dv"
	]
},
	"multipart/alternative": {
	source: "iana",
	compressible: false
},
	"multipart/appledouble": {
	source: "iana"
},
	"multipart/byteranges": {
	source: "iana"
},
	"multipart/digest": {
	source: "iana"
},
	"multipart/encrypted": {
	source: "iana",
	compressible: false
},
	"multipart/form-data": {
	source: "iana",
	compressible: false
},
	"multipart/header-set": {
	source: "iana"
},
	"multipart/mixed": {
	source: "iana"
},
	"multipart/multilingual": {
	source: "iana"
},
	"multipart/parallel": {
	source: "iana"
},
	"multipart/related": {
	source: "iana",
	compressible: false
},
	"multipart/report": {
	source: "iana"
},
	"multipart/signed": {
	source: "iana",
	compressible: false
},
	"multipart/vnd.bint.med-plus": {
	source: "iana"
},
	"multipart/voice-message": {
	source: "iana"
},
	"multipart/x-mixed-replace": {
	source: "iana"
},
	"text/1d-interleaved-parityfec": {
	source: "iana"
},
	"text/cache-manifest": {
	source: "iana",
	compressible: true,
	extensions: [
		"appcache",
		"manifest"
	]
},
	"text/calendar": {
	source: "iana",
	extensions: [
		"ics",
		"ifb"
	]
},
	"text/calender": {
	compressible: true
},
	"text/cmd": {
	compressible: true
},
	"text/coffeescript": {
	extensions: [
		"coffee",
		"litcoffee"
	]
},
	"text/cql": {
	source: "iana"
},
	"text/cql-expression": {
	source: "iana"
},
	"text/cql-identifier": {
	source: "iana"
},
	"text/css": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"css"
	]
},
	"text/csv": {
	source: "iana",
	compressible: true,
	extensions: [
		"csv"
	]
},
	"text/csv-schema": {
	source: "iana"
},
	"text/directory": {
	source: "iana"
},
	"text/dns": {
	source: "iana"
},
	"text/ecmascript": {
	source: "iana"
},
	"text/encaprtp": {
	source: "iana"
},
	"text/enriched": {
	source: "iana"
},
	"text/fhirpath": {
	source: "iana"
},
	"text/flexfec": {
	source: "iana"
},
	"text/fwdred": {
	source: "iana"
},
	"text/gff3": {
	source: "iana"
},
	"text/grammar-ref-list": {
	source: "iana"
},
	"text/html": {
	source: "iana",
	compressible: true,
	extensions: [
		"html",
		"htm",
		"shtml"
	]
},
	"text/jade": {
	extensions: [
		"jade"
	]
},
	"text/javascript": {
	source: "iana",
	compressible: true
},
	"text/jcr-cnd": {
	source: "iana"
},
	"text/jsx": {
	compressible: true,
	extensions: [
		"jsx"
	]
},
	"text/less": {
	compressible: true,
	extensions: [
		"less"
	]
},
	"text/markdown": {
	source: "iana",
	compressible: true,
	extensions: [
		"markdown",
		"md"
	]
},
	"text/mathml": {
	source: "nginx",
	extensions: [
		"mml"
	]
},
	"text/mdx": {
	compressible: true,
	extensions: [
		"mdx"
	]
},
	"text/mizar": {
	source: "iana"
},
	"text/n3": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"n3"
	]
},
	"text/parameters": {
	source: "iana",
	charset: "UTF-8"
},
	"text/parityfec": {
	source: "iana"
},
	"text/plain": {
	source: "iana",
	compressible: true,
	extensions: [
		"txt",
		"text",
		"conf",
		"def",
		"list",
		"log",
		"in",
		"ini"
	]
},
	"text/provenance-notation": {
	source: "iana",
	charset: "UTF-8"
},
	"text/prs.fallenstein.rst": {
	source: "iana"
},
	"text/prs.lines.tag": {
	source: "iana",
	extensions: [
		"dsc"
	]
},
	"text/prs.prop.logic": {
	source: "iana"
},
	"text/raptorfec": {
	source: "iana"
},
	"text/red": {
	source: "iana"
},
	"text/rfc822-headers": {
	source: "iana"
},
	"text/richtext": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtx"
	]
},
	"text/rtf": {
	source: "iana",
	compressible: true,
	extensions: [
		"rtf"
	]
},
	"text/rtp-enc-aescm128": {
	source: "iana"
},
	"text/rtploopback": {
	source: "iana"
},
	"text/rtx": {
	source: "iana"
},
	"text/sgml": {
	source: "iana",
	extensions: [
		"sgml",
		"sgm"
	]
},
	"text/shaclc": {
	source: "iana"
},
	"text/shex": {
	source: "iana",
	extensions: [
		"shex"
	]
},
	"text/slim": {
	extensions: [
		"slim",
		"slm"
	]
},
	"text/spdx": {
	source: "iana",
	extensions: [
		"spdx"
	]
},
	"text/strings": {
	source: "iana"
},
	"text/stylus": {
	extensions: [
		"stylus",
		"styl"
	]
},
	"text/t140": {
	source: "iana"
},
	"text/tab-separated-values": {
	source: "iana",
	compressible: true,
	extensions: [
		"tsv"
	]
},
	"text/troff": {
	source: "iana",
	extensions: [
		"t",
		"tr",
		"roff",
		"man",
		"me",
		"ms"
	]
},
	"text/turtle": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"ttl"
	]
},
	"text/ulpfec": {
	source: "iana"
},
	"text/uri-list": {
	source: "iana",
	compressible: true,
	extensions: [
		"uri",
		"uris",
		"urls"
	]
},
	"text/vcard": {
	source: "iana",
	compressible: true,
	extensions: [
		"vcard"
	]
},
	"text/vnd.a": {
	source: "iana"
},
	"text/vnd.abc": {
	source: "iana"
},
	"text/vnd.ascii-art": {
	source: "iana"
},
	"text/vnd.curl": {
	source: "iana",
	extensions: [
		"curl"
	]
},
	"text/vnd.curl.dcurl": {
	source: "apache",
	extensions: [
		"dcurl"
	]
},
	"text/vnd.curl.mcurl": {
	source: "apache",
	extensions: [
		"mcurl"
	]
},
	"text/vnd.curl.scurl": {
	source: "apache",
	extensions: [
		"scurl"
	]
},
	"text/vnd.debian.copyright": {
	source: "iana",
	charset: "UTF-8"
},
	"text/vnd.dmclientscript": {
	source: "iana"
},
	"text/vnd.dvb.subtitle": {
	source: "iana",
	extensions: [
		"sub"
	]
},
	"text/vnd.esmertec.theme-descriptor": {
	source: "iana",
	charset: "UTF-8"
},
	"text/vnd.familysearch.gedcom": {
	source: "iana",
	extensions: [
		"ged"
	]
},
	"text/vnd.ficlab.flt": {
	source: "iana"
},
	"text/vnd.fly": {
	source: "iana",
	extensions: [
		"fly"
	]
},
	"text/vnd.fmi.flexstor": {
	source: "iana",
	extensions: [
		"flx"
	]
},
	"text/vnd.gml": {
	source: "iana"
},
	"text/vnd.graphviz": {
	source: "iana",
	extensions: [
		"gv"
	]
},
	"text/vnd.hans": {
	source: "iana"
},
	"text/vnd.hgl": {
	source: "iana"
},
	"text/vnd.in3d.3dml": {
	source: "iana",
	extensions: [
		"3dml"
	]
},
	"text/vnd.in3d.spot": {
	source: "iana",
	extensions: [
		"spot"
	]
},
	"text/vnd.iptc.newsml": {
	source: "iana"
},
	"text/vnd.iptc.nitf": {
	source: "iana"
},
	"text/vnd.latex-z": {
	source: "iana"
},
	"text/vnd.motorola.reflex": {
	source: "iana"
},
	"text/vnd.ms-mediapackage": {
	source: "iana"
},
	"text/vnd.net2phone.commcenter.command": {
	source: "iana"
},
	"text/vnd.radisys.msml-basic-layout": {
	source: "iana"
},
	"text/vnd.senx.warpscript": {
	source: "iana"
},
	"text/vnd.si.uricatalogue": {
	source: "iana"
},
	"text/vnd.sosi": {
	source: "iana"
},
	"text/vnd.sun.j2me.app-descriptor": {
	source: "iana",
	charset: "UTF-8",
	extensions: [
		"jad"
	]
},
	"text/vnd.trolltech.linguist": {
	source: "iana",
	charset: "UTF-8"
},
	"text/vnd.wap.si": {
	source: "iana"
},
	"text/vnd.wap.sl": {
	source: "iana"
},
	"text/vnd.wap.wml": {
	source: "iana",
	extensions: [
		"wml"
	]
},
	"text/vnd.wap.wmlscript": {
	source: "iana",
	extensions: [
		"wmls"
	]
},
	"text/vtt": {
	source: "iana",
	charset: "UTF-8",
	compressible: true,
	extensions: [
		"vtt"
	]
},
	"text/x-asm": {
	source: "apache",
	extensions: [
		"s",
		"asm"
	]
},
	"text/x-c": {
	source: "apache",
	extensions: [
		"c",
		"cc",
		"cxx",
		"cpp",
		"h",
		"hh",
		"dic"
	]
},
	"text/x-component": {
	source: "nginx",
	extensions: [
		"htc"
	]
},
	"text/x-fortran": {
	source: "apache",
	extensions: [
		"f",
		"for",
		"f77",
		"f90"
	]
},
	"text/x-gwt-rpc": {
	compressible: true
},
	"text/x-handlebars-template": {
	extensions: [
		"hbs"
	]
},
	"text/x-java-source": {
	source: "apache",
	extensions: [
		"java"
	]
},
	"text/x-jquery-tmpl": {
	compressible: true
},
	"text/x-lua": {
	extensions: [
		"lua"
	]
},
	"text/x-markdown": {
	compressible: true,
	extensions: [
		"mkd"
	]
},
	"text/x-nfo": {
	source: "apache",
	extensions: [
		"nfo"
	]
},
	"text/x-opml": {
	source: "apache",
	extensions: [
		"opml"
	]
},
	"text/x-org": {
	compressible: true,
	extensions: [
		"org"
	]
},
	"text/x-pascal": {
	source: "apache",
	extensions: [
		"p",
		"pas"
	]
},
	"text/x-processing": {
	compressible: true,
	extensions: [
		"pde"
	]
},
	"text/x-sass": {
	extensions: [
		"sass"
	]
},
	"text/x-scss": {
	extensions: [
		"scss"
	]
},
	"text/x-setext": {
	source: "apache",
	extensions: [
		"etx"
	]
},
	"text/x-sfv": {
	source: "apache",
	extensions: [
		"sfv"
	]
},
	"text/x-suse-ymp": {
	compressible: true,
	extensions: [
		"ymp"
	]
},
	"text/x-uuencode": {
	source: "apache",
	extensions: [
		"uu"
	]
},
	"text/x-vcalendar": {
	source: "apache",
	extensions: [
		"vcs"
	]
},
	"text/x-vcard": {
	source: "apache",
	extensions: [
		"vcf"
	]
},
	"text/xml": {
	source: "iana",
	compressible: true,
	extensions: [
		"xml"
	]
},
	"text/xml-external-parsed-entity": {
	source: "iana"
},
	"text/yaml": {
	compressible: true,
	extensions: [
		"yaml",
		"yml"
	]
},
	"video/1d-interleaved-parityfec": {
	source: "iana"
},
	"video/3gpp": {
	source: "iana",
	extensions: [
		"3gp",
		"3gpp"
	]
},
	"video/3gpp-tt": {
	source: "iana"
},
	"video/3gpp2": {
	source: "iana",
	extensions: [
		"3g2"
	]
},
	"video/av1": {
	source: "iana"
},
	"video/bmpeg": {
	source: "iana"
},
	"video/bt656": {
	source: "iana"
},
	"video/celb": {
	source: "iana"
},
	"video/dv": {
	source: "iana"
},
	"video/encaprtp": {
	source: "iana"
},
	"video/ffv1": {
	source: "iana"
},
	"video/flexfec": {
	source: "iana"
},
	"video/h261": {
	source: "iana",
	extensions: [
		"h261"
	]
},
	"video/h263": {
	source: "iana",
	extensions: [
		"h263"
	]
},
	"video/h263-1998": {
	source: "iana"
},
	"video/h263-2000": {
	source: "iana"
},
	"video/h264": {
	source: "iana",
	extensions: [
		"h264"
	]
},
	"video/h264-rcdo": {
	source: "iana"
},
	"video/h264-svc": {
	source: "iana"
},
	"video/h265": {
	source: "iana"
},
	"video/iso.segment": {
	source: "iana",
	extensions: [
		"m4s"
	]
},
	"video/jpeg": {
	source: "iana",
	extensions: [
		"jpgv"
	]
},
	"video/jpeg2000": {
	source: "iana"
},
	"video/jpm": {
	source: "apache",
	extensions: [
		"jpm",
		"jpgm"
	]
},
	"video/jxsv": {
	source: "iana"
},
	"video/mj2": {
	source: "iana",
	extensions: [
		"mj2",
		"mjp2"
	]
},
	"video/mp1s": {
	source: "iana"
},
	"video/mp2p": {
	source: "iana"
},
	"video/mp2t": {
	source: "iana",
	extensions: [
		"ts"
	]
},
	"video/mp4": {
	source: "iana",
	compressible: false,
	extensions: [
		"mp4",
		"mp4v",
		"mpg4"
	]
},
	"video/mp4v-es": {
	source: "iana"
},
	"video/mpeg": {
	source: "iana",
	compressible: false,
	extensions: [
		"mpeg",
		"mpg",
		"mpe",
		"m1v",
		"m2v"
	]
},
	"video/mpeg4-generic": {
	source: "iana"
},
	"video/mpv": {
	source: "iana"
},
	"video/nv": {
	source: "iana"
},
	"video/ogg": {
	source: "iana",
	compressible: false,
	extensions: [
		"ogv"
	]
},
	"video/parityfec": {
	source: "iana"
},
	"video/pointer": {
	source: "iana"
},
	"video/quicktime": {
	source: "iana",
	compressible: false,
	extensions: [
		"qt",
		"mov"
	]
},
	"video/raptorfec": {
	source: "iana"
},
	"video/raw": {
	source: "iana"
},
	"video/rtp-enc-aescm128": {
	source: "iana"
},
	"video/rtploopback": {
	source: "iana"
},
	"video/rtx": {
	source: "iana"
},
	"video/scip": {
	source: "iana"
},
	"video/smpte291": {
	source: "iana"
},
	"video/smpte292m": {
	source: "iana"
},
	"video/ulpfec": {
	source: "iana"
},
	"video/vc1": {
	source: "iana"
},
	"video/vc2": {
	source: "iana"
},
	"video/vnd.cctv": {
	source: "iana"
},
	"video/vnd.dece.hd": {
	source: "iana",
	extensions: [
		"uvh",
		"uvvh"
	]
},
	"video/vnd.dece.mobile": {
	source: "iana",
	extensions: [
		"uvm",
		"uvvm"
	]
},
	"video/vnd.dece.mp4": {
	source: "iana"
},
	"video/vnd.dece.pd": {
	source: "iana",
	extensions: [
		"uvp",
		"uvvp"
	]
},
	"video/vnd.dece.sd": {
	source: "iana",
	extensions: [
		"uvs",
		"uvvs"
	]
},
	"video/vnd.dece.video": {
	source: "iana",
	extensions: [
		"uvv",
		"uvvv"
	]
},
	"video/vnd.directv.mpeg": {
	source: "iana"
},
	"video/vnd.directv.mpeg-tts": {
	source: "iana"
},
	"video/vnd.dlna.mpeg-tts": {
	source: "iana"
},
	"video/vnd.dvb.file": {
	source: "iana",
	extensions: [
		"dvb"
	]
},
	"video/vnd.fvt": {
	source: "iana",
	extensions: [
		"fvt"
	]
},
	"video/vnd.hns.video": {
	source: "iana"
},
	"video/vnd.iptvforum.1dparityfec-1010": {
	source: "iana"
},
	"video/vnd.iptvforum.1dparityfec-2005": {
	source: "iana"
},
	"video/vnd.iptvforum.2dparityfec-1010": {
	source: "iana"
},
	"video/vnd.iptvforum.2dparityfec-2005": {
	source: "iana"
},
	"video/vnd.iptvforum.ttsavc": {
	source: "iana"
},
	"video/vnd.iptvforum.ttsmpeg2": {
	source: "iana"
},
	"video/vnd.motorola.video": {
	source: "iana"
},
	"video/vnd.motorola.videop": {
	source: "iana"
},
	"video/vnd.mpegurl": {
	source: "iana",
	extensions: [
		"mxu",
		"m4u"
	]
},
	"video/vnd.ms-playready.media.pyv": {
	source: "iana",
	extensions: [
		"pyv"
	]
},
	"video/vnd.nokia.interleaved-multimedia": {
	source: "iana"
},
	"video/vnd.nokia.mp4vr": {
	source: "iana"
},
	"video/vnd.nokia.videovoip": {
	source: "iana"
},
	"video/vnd.objectvideo": {
	source: "iana"
},
	"video/vnd.radgamettools.bink": {
	source: "iana"
},
	"video/vnd.radgamettools.smacker": {
	source: "iana"
},
	"video/vnd.sealed.mpeg1": {
	source: "iana"
},
	"video/vnd.sealed.mpeg4": {
	source: "iana"
},
	"video/vnd.sealed.swf": {
	source: "iana"
},
	"video/vnd.sealedmedia.softseal.mov": {
	source: "iana"
},
	"video/vnd.uvvu.mp4": {
	source: "iana",
	extensions: [
		"uvu",
		"uvvu"
	]
},
	"video/vnd.vivo": {
	source: "iana",
	extensions: [
		"viv"
	]
},
	"video/vnd.youtube.yt": {
	source: "iana"
},
	"video/vp8": {
	source: "iana"
},
	"video/vp9": {
	source: "iana"
},
	"video/webm": {
	source: "apache",
	compressible: false,
	extensions: [
		"webm"
	]
},
	"video/x-f4v": {
	source: "apache",
	extensions: [
		"f4v"
	]
},
	"video/x-fli": {
	source: "apache",
	extensions: [
		"fli"
	]
},
	"video/x-flv": {
	source: "apache",
	compressible: false,
	extensions: [
		"flv"
	]
},
	"video/x-m4v": {
	source: "apache",
	extensions: [
		"m4v"
	]
},
	"video/x-matroska": {
	source: "apache",
	compressible: false,
	extensions: [
		"mkv",
		"mk3d",
		"mks"
	]
},
	"video/x-mng": {
	source: "apache",
	extensions: [
		"mng"
	]
},
	"video/x-ms-asf": {
	source: "apache",
	extensions: [
		"asf",
		"asx"
	]
},
	"video/x-ms-vob": {
	source: "apache",
	extensions: [
		"vob"
	]
},
	"video/x-ms-wm": {
	source: "apache",
	extensions: [
		"wm"
	]
},
	"video/x-ms-wmv": {
	source: "apache",
	compressible: false,
	extensions: [
		"wmv"
	]
},
	"video/x-ms-wmx": {
	source: "apache",
	extensions: [
		"wmx"
	]
},
	"video/x-ms-wvx": {
	source: "apache",
	extensions: [
		"wvx"
	]
},
	"video/x-msvideo": {
	source: "apache",
	extensions: [
		"avi"
	]
},
	"video/x-sgi-movie": {
	source: "apache",
	extensions: [
		"movie"
	]
},
	"video/x-smv": {
	source: "apache",
	extensions: [
		"smv"
	]
},
	"x-conference/x-cooltalk": {
	source: "apache",
	extensions: [
		"ice"
	]
},
	"x-shader/x-fragment": {
	compressible: true
},
	"x-shader/x-vertex": {
	compressible: true
}
};

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

var mimeDb;
var hasRequiredMimeDb;

function requireMimeDb () {
	if (hasRequiredMimeDb) return mimeDb;
	hasRequiredMimeDb = 1;
	/**
	 * Module exports.
	 */

	mimeDb = require$$0;
	return mimeDb;
}

/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

var hasRequiredMimeTypes;

function requireMimeTypes () {
	if (hasRequiredMimeTypes) return mimeTypes;
	hasRequiredMimeTypes = 1;
	(function (exports$1) {

		/**
		 * Module dependencies.
		 * @private
		 */

		var db = requireMimeDb();
		var extname = path__default.extname;

		/**
		 * Module variables.
		 * @private
		 */

		var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
		var TEXT_TYPE_REGEXP = /^text\//i;

		/**
		 * Module exports.
		 * @public
		 */

		exports$1.charset = charset;
		exports$1.charsets = { lookup: charset };
		exports$1.contentType = contentType;
		exports$1.extension = extension;
		exports$1.extensions = Object.create(null);
		exports$1.lookup = lookup;
		exports$1.types = Object.create(null);

		// Populate the extensions/types maps
		populateMaps(exports$1.extensions, exports$1.types);

		/**
		 * Get the default charset for a MIME type.
		 *
		 * @param {string} type
		 * @return {boolean|string}
		 */

		function charset (type) {
		  if (!type || typeof type !== 'string') {
		    return false
		  }

		  // TODO: use media-typer
		  var match = EXTRACT_TYPE_REGEXP.exec(type);
		  var mime = match && db[match[1].toLowerCase()];

		  if (mime && mime.charset) {
		    return mime.charset
		  }

		  // default text/* to utf-8
		  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
		    return 'UTF-8'
		  }

		  return false
		}

		/**
		 * Create a full Content-Type header given a MIME type or extension.
		 *
		 * @param {string} str
		 * @return {boolean|string}
		 */

		function contentType (str) {
		  // TODO: should this even be in this module?
		  if (!str || typeof str !== 'string') {
		    return false
		  }

		  var mime = str.indexOf('/') === -1
		    ? exports$1.lookup(str)
		    : str;

		  if (!mime) {
		    return false
		  }

		  // TODO: use content-type or other module
		  if (mime.indexOf('charset') === -1) {
		    var charset = exports$1.charset(mime);
		    if (charset) mime += '; charset=' + charset.toLowerCase();
		  }

		  return mime
		}

		/**
		 * Get the default extension for a MIME type.
		 *
		 * @param {string} type
		 * @return {boolean|string}
		 */

		function extension (type) {
		  if (!type || typeof type !== 'string') {
		    return false
		  }

		  // TODO: use media-typer
		  var match = EXTRACT_TYPE_REGEXP.exec(type);

		  // get extensions
		  var exts = match && exports$1.extensions[match[1].toLowerCase()];

		  if (!exts || !exts.length) {
		    return false
		  }

		  return exts[0]
		}

		/**
		 * Lookup the MIME type for a file path/extension.
		 *
		 * @param {string} path
		 * @return {boolean|string}
		 */

		function lookup (path) {
		  if (!path || typeof path !== 'string') {
		    return false
		  }

		  // get the extension ("ext" or ".ext" or full path)
		  var extension = extname('x.' + path)
		    .toLowerCase()
		    .substr(1);

		  if (!extension) {
		    return false
		  }

		  return exports$1.types[extension] || false
		}

		/**
		 * Populate the extensions and types maps.
		 * @private
		 */

		function populateMaps (extensions, types) {
		  // source preference (least -> most)
		  var preference = ['nginx', 'apache', undefined, 'iana'];

		  Object.keys(db).forEach(function forEachMimeType (type) {
		    var mime = db[type];
		    var exts = mime.extensions;

		    if (!exts || !exts.length) {
		      return
		    }

		    // mime -> extensions
		    extensions[type] = exts;

		    // extension -> mime
		    for (var i = 0; i < exts.length; i++) {
		      var extension = exts[i];

		      if (types[extension]) {
		        var from = preference.indexOf(db[types[extension]].source);
		        var to = preference.indexOf(mime.source);

		        if (types[extension] !== 'application/octet-stream' &&
		          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
		          // skip the remapping
		          continue
		        }
		      }

		      // set the extension -> mime
		      types[extension] = type;
		    }
		  });
		} 
	} (mimeTypes));
	return mimeTypes;
}

var defer_1;
var hasRequiredDefer;

function requireDefer () {
	if (hasRequiredDefer) return defer_1;
	hasRequiredDefer = 1;
	defer_1 = defer;

	/**
	 * Runs provided function on next iteration of the event loop
	 *
	 * @param {function} fn - function to run
	 */
	function defer(fn)
	{
	  var nextTick = typeof setImmediate == 'function'
	    ? setImmediate
	    : (
	      typeof process == 'object' && typeof process.nextTick == 'function'
	      ? process.nextTick
	      : null
	    );

	  if (nextTick)
	  {
	    nextTick(fn);
	  }
	  else
	  {
	    setTimeout(fn, 0);
	  }
	}
	return defer_1;
}

var async_1;
var hasRequiredAsync;

function requireAsync () {
	if (hasRequiredAsync) return async_1;
	hasRequiredAsync = 1;
	var defer = requireDefer();

	// API
	async_1 = async;

	/**
	 * Runs provided callback asynchronously
	 * even if callback itself is not
	 *
	 * @param   {function} callback - callback to invoke
	 * @returns {function} - augmented callback
	 */
	function async(callback)
	{
	  var isAsync = false;

	  // check if async happened
	  defer(function() { isAsync = true; });

	  return function async_callback(err, result)
	  {
	    if (isAsync)
	    {
	      callback(err, result);
	    }
	    else
	    {
	      defer(function nextTick_callback()
	      {
	        callback(err, result);
	      });
	    }
	  };
	}
	return async_1;
}

var abort_1;
var hasRequiredAbort;

function requireAbort () {
	if (hasRequiredAbort) return abort_1;
	hasRequiredAbort = 1;
	// API
	abort_1 = abort;

	/**
	 * Aborts leftover active jobs
	 *
	 * @param {object} state - current state object
	 */
	function abort(state)
	{
	  Object.keys(state.jobs).forEach(clean.bind(state));

	  // reset leftover jobs
	  state.jobs = {};
	}

	/**
	 * Cleans up leftover job by invoking abort function for the provided job id
	 *
	 * @this  state
	 * @param {string|number} key - job id to abort
	 */
	function clean(key)
	{
	  if (typeof this.jobs[key] == 'function')
	  {
	    this.jobs[key]();
	  }
	}
	return abort_1;
}

var iterate_1;
var hasRequiredIterate;

function requireIterate () {
	if (hasRequiredIterate) return iterate_1;
	hasRequiredIterate = 1;
	var async = requireAsync()
	  , abort = requireAbort()
	  ;

	// API
	iterate_1 = iterate;

	/**
	 * Iterates over each job object
	 *
	 * @param {array|object} list - array or object (named list) to iterate over
	 * @param {function} iterator - iterator to run
	 * @param {object} state - current job status
	 * @param {function} callback - invoked when all elements processed
	 */
	function iterate(list, iterator, state, callback)
	{
	  // store current index
	  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

	  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
	  {
	    // don't repeat yourself
	    // skip secondary callbacks
	    if (!(key in state.jobs))
	    {
	      return;
	    }

	    // clean up jobs
	    delete state.jobs[key];

	    if (error)
	    {
	      // don't process rest of the results
	      // stop still active jobs
	      // and reset the list
	      abort(state);
	    }
	    else
	    {
	      state.results[key] = output;
	    }

	    // return salvaged results
	    callback(error, state.results);
	  });
	}

	/**
	 * Runs iterator over provided job element
	 *
	 * @param   {function} iterator - iterator to invoke
	 * @param   {string|number} key - key/index of the element in the list of jobs
	 * @param   {mixed} item - job description
	 * @param   {function} callback - invoked after iterator is done with the job
	 * @returns {function|mixed} - job abort function or something else
	 */
	function runJob(iterator, key, item, callback)
	{
	  var aborter;

	  // allow shortcut if iterator expects only two arguments
	  if (iterator.length == 2)
	  {
	    aborter = iterator(item, async(callback));
	  }
	  // otherwise go with full three arguments
	  else
	  {
	    aborter = iterator(item, key, async(callback));
	  }

	  return aborter;
	}
	return iterate_1;
}

var state_1;
var hasRequiredState;

function requireState () {
	if (hasRequiredState) return state_1;
	hasRequiredState = 1;
	// API
	state_1 = state;

	/**
	 * Creates initial state object
	 * for iteration over list
	 *
	 * @param   {array|object} list - list to iterate over
	 * @param   {function|null} sortMethod - function to use for keys sort,
	 *                                     or `null` to keep them as is
	 * @returns {object} - initial state object
	 */
	function state(list, sortMethod)
	{
	  var isNamedList = !Array.isArray(list)
	    , initState =
	    {
	      index    : 0,
	      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
	      jobs     : {},
	      results  : isNamedList ? {} : [],
	      size     : isNamedList ? Object.keys(list).length : list.length
	    }
	    ;

	  if (sortMethod)
	  {
	    // sort array keys based on it's values
	    // sort object's keys just on own merit
	    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
	    {
	      return sortMethod(list[a], list[b]);
	    });
	  }

	  return initState;
	}
	return state_1;
}

var terminator_1;
var hasRequiredTerminator;

function requireTerminator () {
	if (hasRequiredTerminator) return terminator_1;
	hasRequiredTerminator = 1;
	var abort = requireAbort()
	  , async = requireAsync()
	  ;

	// API
	terminator_1 = terminator;

	/**
	 * Terminates jobs in the attached state context
	 *
	 * @this  AsyncKitState#
	 * @param {function} callback - final callback to invoke after termination
	 */
	function terminator(callback)
	{
	  if (!Object.keys(this.jobs).length)
	  {
	    return;
	  }

	  // fast forward iteration index
	  this.index = this.size;

	  // abort jobs
	  abort(this);

	  // send back results we have so far
	  async(callback)(null, this.results);
	}
	return terminator_1;
}

var parallel_1;
var hasRequiredParallel;

function requireParallel () {
	if (hasRequiredParallel) return parallel_1;
	hasRequiredParallel = 1;
	var iterate    = requireIterate()
	  , initState  = requireState()
	  , terminator = requireTerminator()
	  ;

	// Public API
	parallel_1 = parallel;

	/**
	 * Runs iterator over provided array elements in parallel
	 *
	 * @param   {array|object} list - array or object (named list) to iterate over
	 * @param   {function} iterator - iterator to run
	 * @param   {function} callback - invoked when all elements processed
	 * @returns {function} - jobs terminator
	 */
	function parallel(list, iterator, callback)
	{
	  var state = initState(list);

	  while (state.index < (state['keyedList'] || list).length)
	  {
	    iterate(list, iterator, state, function(error, result)
	    {
	      if (error)
	      {
	        callback(error, result);
	        return;
	      }

	      // looks like it's the last one
	      if (Object.keys(state.jobs).length === 0)
	      {
	        callback(null, state.results);
	        return;
	      }
	    });

	    state.index++;
	  }

	  return terminator.bind(state, callback);
	}
	return parallel_1;
}

var serialOrdered = {exports: {}};

var hasRequiredSerialOrdered;

function requireSerialOrdered () {
	if (hasRequiredSerialOrdered) return serialOrdered.exports;
	hasRequiredSerialOrdered = 1;
	var iterate    = requireIterate()
	  , initState  = requireState()
	  , terminator = requireTerminator()
	  ;

	// Public API
	serialOrdered.exports = serialOrdered$1;
	// sorting helpers
	serialOrdered.exports.ascending  = ascending;
	serialOrdered.exports.descending = descending;

	/**
	 * Runs iterator over provided sorted array elements in series
	 *
	 * @param   {array|object} list - array or object (named list) to iterate over
	 * @param   {function} iterator - iterator to run
	 * @param   {function} sortMethod - custom sort function
	 * @param   {function} callback - invoked when all elements processed
	 * @returns {function} - jobs terminator
	 */
	function serialOrdered$1(list, iterator, sortMethod, callback)
	{
	  var state = initState(list, sortMethod);

	  iterate(list, iterator, state, function iteratorHandler(error, result)
	  {
	    if (error)
	    {
	      callback(error, result);
	      return;
	    }

	    state.index++;

	    // are we there yet?
	    if (state.index < (state['keyedList'] || list).length)
	    {
	      iterate(list, iterator, state, iteratorHandler);
	      return;
	    }

	    // done here
	    callback(null, state.results);
	  });

	  return terminator.bind(state, callback);
	}

	/*
	 * -- Sort methods
	 */

	/**
	 * sort helper to sort array elements in ascending order
	 *
	 * @param   {mixed} a - an item to compare
	 * @param   {mixed} b - an item to compare
	 * @returns {number} - comparison result
	 */
	function ascending(a, b)
	{
	  return a < b ? -1 : a > b ? 1 : 0;
	}

	/**
	 * sort helper to sort array elements in descending order
	 *
	 * @param   {mixed} a - an item to compare
	 * @param   {mixed} b - an item to compare
	 * @returns {number} - comparison result
	 */
	function descending(a, b)
	{
	  return -1 * ascending(a, b);
	}
	return serialOrdered.exports;
}

var serial_1;
var hasRequiredSerial;

function requireSerial () {
	if (hasRequiredSerial) return serial_1;
	hasRequiredSerial = 1;
	var serialOrdered = requireSerialOrdered();

	// Public API
	serial_1 = serial;

	/**
	 * Runs iterator over provided array elements in series
	 *
	 * @param   {array|object} list - array or object (named list) to iterate over
	 * @param   {function} iterator - iterator to run
	 * @param   {function} callback - invoked when all elements processed
	 * @returns {function} - jobs terminator
	 */
	function serial(list, iterator, callback)
	{
	  return serialOrdered(list, iterator, null, callback);
	}
	return serial_1;
}

var asynckit;
var hasRequiredAsynckit;

function requireAsynckit () {
	if (hasRequiredAsynckit) return asynckit;
	hasRequiredAsynckit = 1;
	asynckit =
	{
	  parallel      : requireParallel(),
	  serial        : requireSerial(),
	  serialOrdered : requireSerialOrdered()
	};
	return asynckit;
}

var esObjectAtoms;
var hasRequiredEsObjectAtoms;

function requireEsObjectAtoms () {
	if (hasRequiredEsObjectAtoms) return esObjectAtoms;
	hasRequiredEsObjectAtoms = 1;

	/** @type {import('.')} */
	esObjectAtoms = Object;
	return esObjectAtoms;
}

var esErrors;
var hasRequiredEsErrors;

function requireEsErrors () {
	if (hasRequiredEsErrors) return esErrors;
	hasRequiredEsErrors = 1;

	/** @type {import('.')} */
	esErrors = Error;
	return esErrors;
}

var _eval;
var hasRequired_eval;

function require_eval () {
	if (hasRequired_eval) return _eval;
	hasRequired_eval = 1;

	/** @type {import('./eval')} */
	_eval = EvalError;
	return _eval;
}

var range;
var hasRequiredRange;

function requireRange () {
	if (hasRequiredRange) return range;
	hasRequiredRange = 1;

	/** @type {import('./range')} */
	range = RangeError;
	return range;
}

var ref;
var hasRequiredRef;

function requireRef () {
	if (hasRequiredRef) return ref;
	hasRequiredRef = 1;

	/** @type {import('./ref')} */
	ref = ReferenceError;
	return ref;
}

var syntax;
var hasRequiredSyntax;

function requireSyntax () {
	if (hasRequiredSyntax) return syntax;
	hasRequiredSyntax = 1;

	/** @type {import('./syntax')} */
	syntax = SyntaxError;
	return syntax;
}

var type;
var hasRequiredType;

function requireType () {
	if (hasRequiredType) return type;
	hasRequiredType = 1;

	/** @type {import('./type')} */
	type = TypeError;
	return type;
}

var uri;
var hasRequiredUri;

function requireUri () {
	if (hasRequiredUri) return uri;
	hasRequiredUri = 1;

	/** @type {import('./uri')} */
	uri = URIError;
	return uri;
}

var abs;
var hasRequiredAbs;

function requireAbs () {
	if (hasRequiredAbs) return abs;
	hasRequiredAbs = 1;

	/** @type {import('./abs')} */
	abs = Math.abs;
	return abs;
}

var floor;
var hasRequiredFloor;

function requireFloor () {
	if (hasRequiredFloor) return floor;
	hasRequiredFloor = 1;

	/** @type {import('./floor')} */
	floor = Math.floor;
	return floor;
}

var max;
var hasRequiredMax;

function requireMax () {
	if (hasRequiredMax) return max;
	hasRequiredMax = 1;

	/** @type {import('./max')} */
	max = Math.max;
	return max;
}

var min;
var hasRequiredMin;

function requireMin () {
	if (hasRequiredMin) return min;
	hasRequiredMin = 1;

	/** @type {import('./min')} */
	min = Math.min;
	return min;
}

var pow;
var hasRequiredPow;

function requirePow () {
	if (hasRequiredPow) return pow;
	hasRequiredPow = 1;

	/** @type {import('./pow')} */
	pow = Math.pow;
	return pow;
}

var round;
var hasRequiredRound;

function requireRound () {
	if (hasRequiredRound) return round;
	hasRequiredRound = 1;

	/** @type {import('./round')} */
	round = Math.round;
	return round;
}

var _isNaN;
var hasRequired_isNaN;

function require_isNaN () {
	if (hasRequired_isNaN) return _isNaN;
	hasRequired_isNaN = 1;

	/** @type {import('./isNaN')} */
	_isNaN = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
	return _isNaN;
}

var sign;
var hasRequiredSign;

function requireSign () {
	if (hasRequiredSign) return sign;
	hasRequiredSign = 1;

	var $isNaN = /*@__PURE__*/ require_isNaN();

	/** @type {import('./sign')} */
	sign = function sign(number) {
		if ($isNaN(number) || number === 0) {
			return number;
		}
		return number < 0 ? -1 : 1;
	};
	return sign;
}

var gOPD;
var hasRequiredGOPD;

function requireGOPD () {
	if (hasRequiredGOPD) return gOPD;
	hasRequiredGOPD = 1;

	/** @type {import('./gOPD')} */
	gOPD = Object.getOwnPropertyDescriptor;
	return gOPD;
}

var gopd;
var hasRequiredGopd;

function requireGopd () {
	if (hasRequiredGopd) return gopd;
	hasRequiredGopd = 1;

	/** @type {import('.')} */
	var $gOPD = /*@__PURE__*/ requireGOPD();

	if ($gOPD) {
		try {
			$gOPD([], 'length');
		} catch (e) {
			// IE 8 has a broken gOPD
			$gOPD = null;
		}
	}

	gopd = $gOPD;
	return gopd;
}

var esDefineProperty;
var hasRequiredEsDefineProperty;

function requireEsDefineProperty () {
	if (hasRequiredEsDefineProperty) return esDefineProperty;
	hasRequiredEsDefineProperty = 1;

	/** @type {import('.')} */
	var $defineProperty = Object.defineProperty || false;
	if ($defineProperty) {
		try {
			$defineProperty({}, 'a', { value: 1 });
		} catch (e) {
			// IE 8 has a broken defineProperty
			$defineProperty = false;
		}
	}

	esDefineProperty = $defineProperty;
	return esDefineProperty;
}

var shams$1;
var hasRequiredShams$1;

function requireShams$1 () {
	if (hasRequiredShams$1) return shams$1;
	hasRequiredShams$1 = 1;

	/** @type {import('./shams')} */
	/* eslint complexity: [2, 18], max-statements: [2, 33] */
	shams$1 = function hasSymbols() {
		if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
		if (typeof Symbol.iterator === 'symbol') { return true; }

		/** @type {{ [k in symbol]?: unknown }} */
		var obj = {};
		var sym = Symbol('test');
		var symObj = Object(sym);
		if (typeof sym === 'string') { return false; }

		if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
		if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

		// temp disabled per https://github.com/ljharb/object.assign/issues/17
		// if (sym instanceof Symbol) { return false; }
		// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
		// if (!(symObj instanceof Symbol)) { return false; }

		// if (typeof Symbol.prototype.toString !== 'function') { return false; }
		// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

		var symVal = 42;
		obj[sym] = symVal;
		for (var _ in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
		if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

		if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) { return false; }

		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

		if (typeof Object.getOwnPropertyDescriptor === 'function') {
			// eslint-disable-next-line no-extra-parens
			var descriptor = /** @type {PropertyDescriptor} */ (Object.getOwnPropertyDescriptor(obj, sym));
			if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
		}

		return true;
	};
	return shams$1;
}

var hasSymbols;
var hasRequiredHasSymbols;

function requireHasSymbols () {
	if (hasRequiredHasSymbols) return hasSymbols;
	hasRequiredHasSymbols = 1;

	var origSymbol = typeof Symbol !== 'undefined' && Symbol;
	var hasSymbolSham = requireShams$1();

	/** @type {import('.')} */
	hasSymbols = function hasNativeSymbols() {
		if (typeof origSymbol !== 'function') { return false; }
		if (typeof Symbol !== 'function') { return false; }
		if (typeof origSymbol('foo') !== 'symbol') { return false; }
		if (typeof Symbol('bar') !== 'symbol') { return false; }

		return hasSymbolSham();
	};
	return hasSymbols;
}

var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;

function requireReflect_getPrototypeOf () {
	if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
	hasRequiredReflect_getPrototypeOf = 1;

	/** @type {import('./Reflect.getPrototypeOf')} */
	Reflect_getPrototypeOf = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;
	return Reflect_getPrototypeOf;
}

var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;

function requireObject_getPrototypeOf () {
	if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
	hasRequiredObject_getPrototypeOf = 1;

	var $Object = /*@__PURE__*/ requireEsObjectAtoms();

	/** @type {import('./Object.getPrototypeOf')} */
	Object_getPrototypeOf = $Object.getPrototypeOf || null;
	return Object_getPrototypeOf;
}

var implementation;
var hasRequiredImplementation;

function requireImplementation () {
	if (hasRequiredImplementation) return implementation;
	hasRequiredImplementation = 1;

	/* eslint no-invalid-this: 1 */

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = '[object Function]';

	var concatty = function concatty(a, b) {
	    var arr = [];

	    for (var i = 0; i < a.length; i += 1) {
	        arr[i] = a[i];
	    }
	    for (var j = 0; j < b.length; j += 1) {
	        arr[j + a.length] = b[j];
	    }

	    return arr;
	};

	var slicy = function slicy(arrLike, offset) {
	    var arr = [];
	    for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
	        arr[j] = arrLike[i];
	    }
	    return arr;
	};

	var joiny = function (arr, joiner) {
	    var str = '';
	    for (var i = 0; i < arr.length; i += 1) {
	        str += arr[i];
	        if (i + 1 < arr.length) {
	            str += joiner;
	        }
	    }
	    return str;
	};

	implementation = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slicy(arguments, 1);

	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                concatty(args, arguments)
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        }
	        return target.apply(
	            that,
	            concatty(args, arguments)
	        );

	    };

	    var boundLength = max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs[i] = '$' + i;
	    }

	    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }

	    return bound;
	};
	return implementation;
}

var functionBind;
var hasRequiredFunctionBind;

function requireFunctionBind () {
	if (hasRequiredFunctionBind) return functionBind;
	hasRequiredFunctionBind = 1;

	var implementation = requireImplementation();

	functionBind = Function.prototype.bind || implementation;
	return functionBind;
}

var functionCall;
var hasRequiredFunctionCall;

function requireFunctionCall () {
	if (hasRequiredFunctionCall) return functionCall;
	hasRequiredFunctionCall = 1;

	/** @type {import('./functionCall')} */
	functionCall = Function.prototype.call;
	return functionCall;
}

var functionApply;
var hasRequiredFunctionApply;

function requireFunctionApply () {
	if (hasRequiredFunctionApply) return functionApply;
	hasRequiredFunctionApply = 1;

	/** @type {import('./functionApply')} */
	functionApply = Function.prototype.apply;
	return functionApply;
}

var reflectApply;
var hasRequiredReflectApply;

function requireReflectApply () {
	if (hasRequiredReflectApply) return reflectApply;
	hasRequiredReflectApply = 1;

	/** @type {import('./reflectApply')} */
	reflectApply = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;
	return reflectApply;
}

var actualApply;
var hasRequiredActualApply;

function requireActualApply () {
	if (hasRequiredActualApply) return actualApply;
	hasRequiredActualApply = 1;

	var bind = requireFunctionBind();

	var $apply = requireFunctionApply();
	var $call = requireFunctionCall();
	var $reflectApply = requireReflectApply();

	/** @type {import('./actualApply')} */
	actualApply = $reflectApply || bind.call($call, $apply);
	return actualApply;
}

var callBindApplyHelpers;
var hasRequiredCallBindApplyHelpers;

function requireCallBindApplyHelpers () {
	if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
	hasRequiredCallBindApplyHelpers = 1;

	var bind = requireFunctionBind();
	var $TypeError = /*@__PURE__*/ requireType();

	var $call = requireFunctionCall();
	var $actualApply = requireActualApply();

	/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
	callBindApplyHelpers = function callBindBasic(args) {
		if (args.length < 1 || typeof args[0] !== 'function') {
			throw new $TypeError('a function is required');
		}
		return $actualApply(bind, $call, args);
	};
	return callBindApplyHelpers;
}

var get;
var hasRequiredGet;

function requireGet () {
	if (hasRequiredGet) return get;
	hasRequiredGet = 1;

	var callBind = requireCallBindApplyHelpers();
	var gOPD = /*@__PURE__*/ requireGopd();

	var hasProtoAccessor;
	try {
		// eslint-disable-next-line no-extra-parens, no-proto
		hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ ([]).__proto__ === Array.prototype;
	} catch (e) {
		if (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
			throw e;
		}
	}

	// eslint-disable-next-line no-extra-parens
	var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */ ('__proto__'));

	var $Object = Object;
	var $getPrototypeOf = $Object.getPrototypeOf;

	/** @type {import('./get')} */
	get = desc && typeof desc.get === 'function'
		? callBind([desc.get])
		: typeof $getPrototypeOf === 'function'
			? /** @type {import('./get')} */ function getDunder(value) {
				// eslint-disable-next-line eqeqeq
				return $getPrototypeOf(value == null ? value : $Object(value));
			}
			: false;
	return get;
}

var getProto;
var hasRequiredGetProto;

function requireGetProto () {
	if (hasRequiredGetProto) return getProto;
	hasRequiredGetProto = 1;

	var reflectGetProto = requireReflect_getPrototypeOf();
	var originalGetProto = requireObject_getPrototypeOf();

	var getDunderProto = /*@__PURE__*/ requireGet();

	/** @type {import('.')} */
	getProto = reflectGetProto
		? function getProto(O) {
			// @ts-expect-error TS can't narrow inside a closure, for some reason
			return reflectGetProto(O);
		}
		: originalGetProto
			? function getProto(O) {
				if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
					throw new TypeError('getProto: not an object');
				}
				// @ts-expect-error TS can't narrow inside a closure, for some reason
				return originalGetProto(O);
			}
			: getDunderProto
				? function getProto(O) {
					// @ts-expect-error TS can't narrow inside a closure, for some reason
					return getDunderProto(O);
				}
				: null;
	return getProto;
}

var hasown;
var hasRequiredHasown;

function requireHasown () {
	if (hasRequiredHasown) return hasown;
	hasRequiredHasown = 1;

	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	var bind = requireFunctionBind();

	/** @type {import('.')} */
	hasown = bind.call(call, $hasOwn);
	return hasown;
}

var getIntrinsic;
var hasRequiredGetIntrinsic;

function requireGetIntrinsic () {
	if (hasRequiredGetIntrinsic) return getIntrinsic;
	hasRequiredGetIntrinsic = 1;

	var undefined$1;

	var $Object = /*@__PURE__*/ requireEsObjectAtoms();

	var $Error = /*@__PURE__*/ requireEsErrors();
	var $EvalError = /*@__PURE__*/ require_eval();
	var $RangeError = /*@__PURE__*/ requireRange();
	var $ReferenceError = /*@__PURE__*/ requireRef();
	var $SyntaxError = /*@__PURE__*/ requireSyntax();
	var $TypeError = /*@__PURE__*/ requireType();
	var $URIError = /*@__PURE__*/ requireUri();

	var abs = /*@__PURE__*/ requireAbs();
	var floor = /*@__PURE__*/ requireFloor();
	var max = /*@__PURE__*/ requireMax();
	var min = /*@__PURE__*/ requireMin();
	var pow = /*@__PURE__*/ requirePow();
	var round = /*@__PURE__*/ requireRound();
	var sign = /*@__PURE__*/ requireSign();

	var $Function = Function;

	// eslint-disable-next-line consistent-return
	var getEvalledConstructor = function (expressionSyntax) {
		try {
			return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
		} catch (e) {}
	};

	var $gOPD = /*@__PURE__*/ requireGopd();
	var $defineProperty = /*@__PURE__*/ requireEsDefineProperty();

	var throwTypeError = function () {
		throw new $TypeError();
	};
	var ThrowTypeError = $gOPD
		? (function () {
			try {
				// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
				arguments.callee; // IE 8 does not throw here
				return throwTypeError;
			} catch (calleeThrows) {
				try {
					// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
					return $gOPD(arguments, 'callee').get;
				} catch (gOPDthrows) {
					return throwTypeError;
				}
			}
		}())
		: throwTypeError;

	var hasSymbols = requireHasSymbols()();

	var getProto = requireGetProto();
	var $ObjectGPO = requireObject_getPrototypeOf();
	var $ReflectGPO = requireReflect_getPrototypeOf();

	var $apply = requireFunctionApply();
	var $call = requireFunctionCall();

	var needsEval = {};

	var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined$1 : getProto(Uint8Array);

	var INTRINSICS = {
		__proto__: null,
		'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
		'%Array%': Array,
		'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
		'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined$1,
		'%AsyncFromSyncIteratorPrototype%': undefined$1,
		'%AsyncFunction%': needsEval,
		'%AsyncGenerator%': needsEval,
		'%AsyncGeneratorFunction%': needsEval,
		'%AsyncIteratorPrototype%': needsEval,
		'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
		'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
		'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined$1 : BigInt64Array,
		'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined$1 : BigUint64Array,
		'%Boolean%': Boolean,
		'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
		'%Date%': Date,
		'%decodeURI%': decodeURI,
		'%decodeURIComponent%': decodeURIComponent,
		'%encodeURI%': encodeURI,
		'%encodeURIComponent%': encodeURIComponent,
		'%Error%': $Error,
		'%eval%': eval, // eslint-disable-line no-eval
		'%EvalError%': $EvalError,
		'%Float16Array%': typeof Float16Array === 'undefined' ? undefined$1 : Float16Array,
		'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
		'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
		'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
		'%Function%': $Function,
		'%GeneratorFunction%': needsEval,
		'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
		'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
		'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
		'%isFinite%': isFinite,
		'%isNaN%': isNaN,
		'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
		'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
		'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
		'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
		'%Math%': Math,
		'%Number%': Number,
		'%Object%': $Object,
		'%Object.getOwnPropertyDescriptor%': $gOPD,
		'%parseFloat%': parseFloat,
		'%parseInt%': parseInt,
		'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
		'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
		'%RangeError%': $RangeError,
		'%ReferenceError%': $ReferenceError,
		'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
		'%RegExp%': RegExp,
		'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
		'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
		'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
		'%String%': String,
		'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined$1,
		'%Symbol%': hasSymbols ? Symbol : undefined$1,
		'%SyntaxError%': $SyntaxError,
		'%ThrowTypeError%': ThrowTypeError,
		'%TypedArray%': TypedArray,
		'%TypeError%': $TypeError,
		'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
		'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
		'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
		'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
		'%URIError%': $URIError,
		'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
		'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
		'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet,

		'%Function.prototype.call%': $call,
		'%Function.prototype.apply%': $apply,
		'%Object.defineProperty%': $defineProperty,
		'%Object.getPrototypeOf%': $ObjectGPO,
		'%Math.abs%': abs,
		'%Math.floor%': floor,
		'%Math.max%': max,
		'%Math.min%': min,
		'%Math.pow%': pow,
		'%Math.round%': round,
		'%Math.sign%': sign,
		'%Reflect.getPrototypeOf%': $ReflectGPO
	};

	if (getProto) {
		try {
			null.error; // eslint-disable-line no-unused-expressions
		} catch (e) {
			// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
			var errorProto = getProto(getProto(e));
			INTRINSICS['%Error.prototype%'] = errorProto;
		}
	}

	var doEval = function doEval(name) {
		var value;
		if (name === '%AsyncFunction%') {
			value = getEvalledConstructor('async function () {}');
		} else if (name === '%GeneratorFunction%') {
			value = getEvalledConstructor('function* () {}');
		} else if (name === '%AsyncGeneratorFunction%') {
			value = getEvalledConstructor('async function* () {}');
		} else if (name === '%AsyncGenerator%') {
			var fn = doEval('%AsyncGeneratorFunction%');
			if (fn) {
				value = fn.prototype;
			}
		} else if (name === '%AsyncIteratorPrototype%') {
			var gen = doEval('%AsyncGenerator%');
			if (gen && getProto) {
				value = getProto(gen.prototype);
			}
		}

		INTRINSICS[name] = value;

		return value;
	};

	var LEGACY_ALIASES = {
		__proto__: null,
		'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
		'%ArrayPrototype%': ['Array', 'prototype'],
		'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
		'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
		'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
		'%ArrayProto_values%': ['Array', 'prototype', 'values'],
		'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
		'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
		'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
		'%BooleanPrototype%': ['Boolean', 'prototype'],
		'%DataViewPrototype%': ['DataView', 'prototype'],
		'%DatePrototype%': ['Date', 'prototype'],
		'%ErrorPrototype%': ['Error', 'prototype'],
		'%EvalErrorPrototype%': ['EvalError', 'prototype'],
		'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
		'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
		'%FunctionPrototype%': ['Function', 'prototype'],
		'%Generator%': ['GeneratorFunction', 'prototype'],
		'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
		'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
		'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
		'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
		'%JSONParse%': ['JSON', 'parse'],
		'%JSONStringify%': ['JSON', 'stringify'],
		'%MapPrototype%': ['Map', 'prototype'],
		'%NumberPrototype%': ['Number', 'prototype'],
		'%ObjectPrototype%': ['Object', 'prototype'],
		'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
		'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
		'%PromisePrototype%': ['Promise', 'prototype'],
		'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
		'%Promise_all%': ['Promise', 'all'],
		'%Promise_reject%': ['Promise', 'reject'],
		'%Promise_resolve%': ['Promise', 'resolve'],
		'%RangeErrorPrototype%': ['RangeError', 'prototype'],
		'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
		'%RegExpPrototype%': ['RegExp', 'prototype'],
		'%SetPrototype%': ['Set', 'prototype'],
		'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
		'%StringPrototype%': ['String', 'prototype'],
		'%SymbolPrototype%': ['Symbol', 'prototype'],
		'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
		'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
		'%TypeErrorPrototype%': ['TypeError', 'prototype'],
		'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
		'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
		'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
		'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
		'%URIErrorPrototype%': ['URIError', 'prototype'],
		'%WeakMapPrototype%': ['WeakMap', 'prototype'],
		'%WeakSetPrototype%': ['WeakSet', 'prototype']
	};

	var bind = requireFunctionBind();
	var hasOwn = /*@__PURE__*/ requireHasown();
	var $concat = bind.call($call, Array.prototype.concat);
	var $spliceApply = bind.call($apply, Array.prototype.splice);
	var $replace = bind.call($call, String.prototype.replace);
	var $strSlice = bind.call($call, String.prototype.slice);
	var $exec = bind.call($call, RegExp.prototype.exec);

	/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === '%' && last !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
		} else if (last === '%' && first !== '%') {
			throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
		}
		var result = [];
		$replace(string, rePropName, function (match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
		});
		return result;
	};
	/* end adaptation */

	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = '%' + alias[0] + '%';
		}

		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) {
				value = doEval(intrinsicName);
			}
			if (typeof value === 'undefined' && !allowMissing) {
				throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
			}

			return {
				alias: alias,
				name: intrinsicName,
				value: value
			};
		}

		throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
	};

	getIntrinsic = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== 'string' || name.length === 0) {
			throw new $TypeError('intrinsic name must be a non-empty string');
		}
		if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
			throw new $TypeError('"allowMissing" argument must be a boolean');
		}

		if ($exec(/^%?[^%]*%?$/, name) === null) {
			throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
		}
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

		var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;

		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}

		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if (
				(
					(first === '"' || first === "'" || first === '`')
					|| (last === '"' || last === "'" || last === '`')
				)
				&& first !== last
			) {
				throw new $SyntaxError('property names with quotes must have matching quotes');
			}
			if (part === 'constructor' || !isOwn) {
				skipFurtherCaching = true;
			}

			intrinsicBaseName += '.' + part;
			intrinsicRealName = '%' + intrinsicBaseName + '%';

			if (hasOwn(INTRINSICS, intrinsicRealName)) {
				value = INTRINSICS[intrinsicRealName];
			} else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) {
						throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
					}
					return void undefined$1;
				}
				if ($gOPD && (i + 1) >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;

					// By convention, when a data property is converted to an accessor
					// property to emulate a data property that does not suffer from
					// the override mistake, that accessor's getter is marked with
					// an `originalValue` property. Here, when we detect this, we
					// uphold the illusion by pretending to see that original data
					// property, i.e., returning the value rather than the getter
					// itself.
					if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
						value = desc.get;
					} else {
						value = value[part];
					}
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}

				if (isOwn && !skipFurtherCaching) {
					INTRINSICS[intrinsicRealName] = value;
				}
			}
		}
		return value;
	};
	return getIntrinsic;
}

var shams;
var hasRequiredShams;

function requireShams () {
	if (hasRequiredShams) return shams;
	hasRequiredShams = 1;

	var hasSymbols = requireShams$1();

	/** @type {import('.')} */
	shams = function hasToStringTagShams() {
		return hasSymbols() && !!Symbol.toStringTag;
	};
	return shams;
}

var esSetTostringtag;
var hasRequiredEsSetTostringtag;

function requireEsSetTostringtag () {
	if (hasRequiredEsSetTostringtag) return esSetTostringtag;
	hasRequiredEsSetTostringtag = 1;

	var GetIntrinsic = /*@__PURE__*/ requireGetIntrinsic();

	var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

	var hasToStringTag = requireShams()();
	var hasOwn = /*@__PURE__*/ requireHasown();
	var $TypeError = /*@__PURE__*/ requireType();

	var toStringTag = hasToStringTag ? Symbol.toStringTag : null;

	/** @type {import('.')} */
	esSetTostringtag = function setToStringTag(object, value) {
		var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
		var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
		if (
			(typeof overrideIfSet !== 'undefined' && typeof overrideIfSet !== 'boolean')
			|| (typeof nonConfigurable !== 'undefined' && typeof nonConfigurable !== 'boolean')
		) {
			throw new $TypeError('if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans');
		}
		if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
			if ($defineProperty) {
				$defineProperty(object, toStringTag, {
					configurable: !nonConfigurable,
					enumerable: false,
					value: value,
					writable: false
				});
			} else {
				object[toStringTag] = value; // eslint-disable-line no-param-reassign
			}
		}
	};
	return esSetTostringtag;
}

var populate;
var hasRequiredPopulate;

function requirePopulate () {
	if (hasRequiredPopulate) return populate;
	hasRequiredPopulate = 1;

	// populates missing values
	populate = function (dst, src) {
	  Object.keys(src).forEach(function (prop) {
	    dst[prop] = dst[prop] || src[prop]; // eslint-disable-line no-param-reassign
	  });

	  return dst;
	};
	return populate;
}

var form_data;
var hasRequiredForm_data;

function requireForm_data () {
	if (hasRequiredForm_data) return form_data;
	hasRequiredForm_data = 1;

	var CombinedStream = requireCombined_stream();
	var util = require$$1;
	var path = path__default;
	var http = http__default;
	var https = require$$2;
	var parseUrl = require$$5.parse;
	var fs = fs__default;
	var Stream = stream.Stream;
	var crypto = require$$8;
	var mime = requireMimeTypes();
	var asynckit = requireAsynckit();
	var setToStringTag = /*@__PURE__*/ requireEsSetTostringtag();
	var hasOwn = /*@__PURE__*/ requireHasown();
	var populate = requirePopulate();

	/**
	 * Create readable "multipart/form-data" streams.
	 * Can be used to submit forms
	 * and file uploads to other web applications.
	 *
	 * @constructor
	 * @param {object} options - Properties to be added/overriden for FormData and CombinedStream
	 */
	function FormData(options) {
	  if (!(this instanceof FormData)) {
	    return new FormData(options);
	  }

	  this._overheadLength = 0;
	  this._valueLength = 0;
	  this._valuesToMeasure = [];

	  CombinedStream.call(this);

	  options = options || {}; // eslint-disable-line no-param-reassign
	  for (var option in options) { // eslint-disable-line no-restricted-syntax
	    this[option] = options[option];
	  }
	}

	// make it a Stream
	util.inherits(FormData, CombinedStream);

	FormData.LINE_BREAK = '\r\n';
	FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

	FormData.prototype.append = function (field, value, options) {
	  options = options || {}; // eslint-disable-line no-param-reassign

	  // allow filename as single option
	  if (typeof options === 'string') {
	    options = { filename: options }; // eslint-disable-line no-param-reassign
	  }

	  var append = CombinedStream.prototype.append.bind(this);

	  // all that streamy business can't handle numbers
	  if (typeof value === 'number' || value == null) {
	    value = String(value); // eslint-disable-line no-param-reassign
	  }

	  // https://github.com/felixge/node-form-data/issues/38
	  if (Array.isArray(value)) {
	    /*
	     * Please convert your array into string
	     * the way web server expects it
	     */
	    this._error(new Error('Arrays are not supported.'));
	    return;
	  }

	  var header = this._multiPartHeader(field, value, options);
	  var footer = this._multiPartFooter();

	  append(header);
	  append(value);
	  append(footer);

	  // pass along options.knownLength
	  this._trackLength(header, value, options);
	};

	FormData.prototype._trackLength = function (header, value, options) {
	  var valueLength = 0;

	  /*
	   * used w/ getLengthSync(), when length is known.
	   * e.g. for streaming directly from a remote server,
	   * w/ a known file a size, and not wanting to wait for
	   * incoming file to finish to get its size.
	   */
	  if (options.knownLength != null) {
	    valueLength += Number(options.knownLength);
	  } else if (Buffer.isBuffer(value)) {
	    valueLength = value.length;
	  } else if (typeof value === 'string') {
	    valueLength = Buffer.byteLength(value);
	  }

	  this._valueLength += valueLength;

	  // @check why add CRLF? does this account for custom/multiple CRLFs?
	  this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;

	  // empty or either doesn't have path or not an http response or not a stream
	  if (!value || (!value.path && !(value.readable && hasOwn(value, 'httpVersion')) && !(value instanceof Stream))) {
	    return;
	  }

	  // no need to bother with the length
	  if (!options.knownLength) {
	    this._valuesToMeasure.push(value);
	  }
	};

	FormData.prototype._lengthRetriever = function (value, callback) {
	  if (hasOwn(value, 'fd')) {
	    // take read range into a account
	    // `end` = Infinity –> read file till the end
	    //
	    // TODO: Looks like there is bug in Node fs.createReadStream
	    // it doesn't respect `end` options without `start` options
	    // Fix it when node fixes it.
	    // https://github.com/joyent/node/issues/7819
	    if (value.end != undefined && value.end != Infinity && value.start != undefined) {
	      // when end specified
	      // no need to calculate range
	      // inclusive, starts with 0
	      callback(null, value.end + 1 - (value.start ? value.start : 0)); // eslint-disable-line callback-return

	      // not that fast snoopy
	    } else {
	      // still need to fetch file size from fs
	      fs.stat(value.path, function (err, stat) {
	        if (err) {
	          callback(err);
	          return;
	        }

	        // update final size based on the range options
	        var fileSize = stat.size - (value.start ? value.start : 0);
	        callback(null, fileSize);
	      });
	    }

	    // or http response
	  } else if (hasOwn(value, 'httpVersion')) {
	    callback(null, Number(value.headers['content-length'])); // eslint-disable-line callback-return

	    // or request stream http://github.com/mikeal/request
	  } else if (hasOwn(value, 'httpModule')) {
	    // wait till response come back
	    value.on('response', function (response) {
	      value.pause();
	      callback(null, Number(response.headers['content-length']));
	    });
	    value.resume();

	    // something else
	  } else {
	    callback('Unknown stream'); // eslint-disable-line callback-return
	  }
	};

	FormData.prototype._multiPartHeader = function (field, value, options) {
	  /*
	   * custom header specified (as string)?
	   * it becomes responsible for boundary
	   * (e.g. to handle extra CRLFs on .NET servers)
	   */
	  if (typeof options.header === 'string') {
	    return options.header;
	  }

	  var contentDisposition = this._getContentDisposition(value, options);
	  var contentType = this._getContentType(value, options);

	  var contents = '';
	  var headers = {
	    // add custom disposition as third element or keep it two elements if not
	    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
	    // if no content type. allow it to be empty array
	    'Content-Type': [].concat(contentType || [])
	  };

	  // allow custom headers.
	  if (typeof options.header === 'object') {
	    populate(headers, options.header);
	  }

	  var header;
	  for (var prop in headers) { // eslint-disable-line no-restricted-syntax
	    if (hasOwn(headers, prop)) {
	      header = headers[prop];

	      // skip nullish headers.
	      if (header == null) {
	        continue; // eslint-disable-line no-restricted-syntax, no-continue
	      }

	      // convert all headers to arrays.
	      if (!Array.isArray(header)) {
	        header = [header];
	      }

	      // add non-empty headers.
	      if (header.length) {
	        contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
	      }
	    }
	  }

	  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
	};

	FormData.prototype._getContentDisposition = function (value, options) { // eslint-disable-line consistent-return
	  var filename;

	  if (typeof options.filepath === 'string') {
	    // custom filepath for relative paths
	    filename = path.normalize(options.filepath).replace(/\\/g, '/');
	  } else if (options.filename || (value && (value.name || value.path))) {
	    /*
	     * custom filename take precedence
	     * formidable and the browser add a name property
	     * fs- and request- streams have path property
	     */
	    filename = path.basename(options.filename || (value && (value.name || value.path)));
	  } else if (value && value.readable && hasOwn(value, 'httpVersion')) {
	    // or try http response
	    filename = path.basename(value.client._httpMessage.path || '');
	  }

	  if (filename) {
	    return 'filename="' + filename + '"';
	  }
	};

	FormData.prototype._getContentType = function (value, options) {
	  // use custom content-type above all
	  var contentType = options.contentType;

	  // or try `name` from formidable, browser
	  if (!contentType && value && value.name) {
	    contentType = mime.lookup(value.name);
	  }

	  // or try `path` from fs-, request- streams
	  if (!contentType && value && value.path) {
	    contentType = mime.lookup(value.path);
	  }

	  // or if it's http-reponse
	  if (!contentType && value && value.readable && hasOwn(value, 'httpVersion')) {
	    contentType = value.headers['content-type'];
	  }

	  // or guess it from the filepath or filename
	  if (!contentType && (options.filepath || options.filename)) {
	    contentType = mime.lookup(options.filepath || options.filename);
	  }

	  // fallback to the default content type if `value` is not simple value
	  if (!contentType && value && typeof value === 'object') {
	    contentType = FormData.DEFAULT_CONTENT_TYPE;
	  }

	  return contentType;
	};

	FormData.prototype._multiPartFooter = function () {
	  return function (next) {
	    var footer = FormData.LINE_BREAK;

	    var lastPart = this._streams.length === 0;
	    if (lastPart) {
	      footer += this._lastBoundary();
	    }

	    next(footer);
	  }.bind(this);
	};

	FormData.prototype._lastBoundary = function () {
	  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
	};

	FormData.prototype.getHeaders = function (userHeaders) {
	  var header;
	  var formHeaders = {
	    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
	  };

	  for (header in userHeaders) { // eslint-disable-line no-restricted-syntax
	    if (hasOwn(userHeaders, header)) {
	      formHeaders[header.toLowerCase()] = userHeaders[header];
	    }
	  }

	  return formHeaders;
	};

	FormData.prototype.setBoundary = function (boundary) {
	  if (typeof boundary !== 'string') {
	    throw new TypeError('FormData boundary must be a string');
	  }
	  this._boundary = boundary;
	};

	FormData.prototype.getBoundary = function () {
	  if (!this._boundary) {
	    this._generateBoundary();
	  }

	  return this._boundary;
	};

	FormData.prototype.getBuffer = function () {
	  var dataBuffer = new Buffer.alloc(0); // eslint-disable-line new-cap
	  var boundary = this.getBoundary();

	  // Create the form content. Add Line breaks to the end of data.
	  for (var i = 0, len = this._streams.length; i < len; i++) {
	    if (typeof this._streams[i] !== 'function') {
	      // Add content to the buffer.
	      if (Buffer.isBuffer(this._streams[i])) {
	        dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
	      } else {
	        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
	      }

	      // Add break after content.
	      if (typeof this._streams[i] !== 'string' || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
	        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData.LINE_BREAK)]);
	      }
	    }
	  }

	  // Add the footer and return the Buffer object.
	  return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
	};

	FormData.prototype._generateBoundary = function () {
	  // This generates a 50 character boundary similar to those used by Firefox.

	  // They are optimized for boyer-moore parsing.
	  this._boundary = '--------------------------' + crypto.randomBytes(12).toString('hex');
	};

	// Note: getLengthSync DOESN'T calculate streams length
	// As workaround one can calculate file size manually and add it as knownLength option
	FormData.prototype.getLengthSync = function () {
	  var knownLength = this._overheadLength + this._valueLength;

	  // Don't get confused, there are 3 "internal" streams for each keyval pair so it basically checks if there is any value added to the form
	  if (this._streams.length) {
	    knownLength += this._lastBoundary().length;
	  }

	  // https://github.com/form-data/form-data/issues/40
	  if (!this.hasKnownLength()) {
	    /*
	     * Some async length retrievers are present
	     * therefore synchronous length calculation is false.
	     * Please use getLength(callback) to get proper length
	     */
	    this._error(new Error('Cannot calculate proper length in synchronous way.'));
	  }

	  return knownLength;
	};

	// Public API to check if length of added values is known
	// https://github.com/form-data/form-data/issues/196
	// https://github.com/form-data/form-data/issues/262
	FormData.prototype.hasKnownLength = function () {
	  var hasKnownLength = true;

	  if (this._valuesToMeasure.length) {
	    hasKnownLength = false;
	  }

	  return hasKnownLength;
	};

	FormData.prototype.getLength = function (cb) {
	  var knownLength = this._overheadLength + this._valueLength;

	  if (this._streams.length) {
	    knownLength += this._lastBoundary().length;
	  }

	  if (!this._valuesToMeasure.length) {
	    process.nextTick(cb.bind(this, null, knownLength));
	    return;
	  }

	  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function (err, values) {
	    if (err) {
	      cb(err);
	      return;
	    }

	    values.forEach(function (length) {
	      knownLength += length;
	    });

	    cb(null, knownLength);
	  });
	};

	FormData.prototype.submit = function (params, cb) {
	  var request;
	  var options;
	  var defaults = { method: 'post' };

	  // parse provided url if it's string or treat it as options object
	  if (typeof params === 'string') {
	    params = parseUrl(params); // eslint-disable-line no-param-reassign
	    /* eslint sort-keys: 0 */
	    options = populate({
	      port: params.port,
	      path: params.pathname,
	      host: params.hostname,
	      protocol: params.protocol
	    }, defaults);
	  } else { // use custom params
	    options = populate(params, defaults);
	    // if no port provided use default one
	    if (!options.port) {
	      options.port = options.protocol === 'https:' ? 443 : 80;
	    }
	  }

	  // put that good code in getHeaders to some use
	  options.headers = this.getHeaders(params.headers);

	  // https if specified, fallback to http in any other case
	  if (options.protocol === 'https:') {
	    request = https.request(options);
	  } else {
	    request = http.request(options);
	  }

	  // get content length and fire away
	  this.getLength(function (err, length) {
	    if (err && err !== 'Unknown stream') {
	      this._error(err);
	      return;
	    }

	    // add content length
	    if (length) {
	      request.setHeader('Content-Length', length);
	    }

	    this.pipe(request);
	    if (cb) {
	      var onResponse;

	      var callback = function (error, responce) {
	        request.removeListener('error', callback);
	        request.removeListener('response', onResponse);

	        return cb.call(this, error, responce);
	      };

	      onResponse = callback.bind(this, null);

	      request.on('error', callback);
	      request.on('response', onResponse);
	    }
	  }.bind(this));

	  return request;
	};

	FormData.prototype._error = function (err) {
	  if (!this.error) {
	    this.error = err;
	    this.pause();
	    this.emit('error', err);
	  }
	};

	FormData.prototype.toString = function () {
	  return '[object FormData]';
	};
	setToStringTag(FormData.prototype, 'FormData');

	// Public API
	form_data = FormData;
	return form_data;
}

var form_dataExports = requireForm_data();
var FormData$1 = /*@__PURE__*/getDefaultExportFromCjs(form_dataExports);

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path
    .concat(key)
    .map(function each(token, i) {
      // eslint-disable-next-line no-param-reassign
      token = removeBrackets(token);
      return !dots && i ? '[' + token + ']' : token;
    })
    .join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData$1(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData$1 || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(
    options,
    {
      metaTokens: true,
      dots: false,
      indexes: false,
    },
    false,
    function defined(option, source) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      return !utils$1.isUndefined(source[option]);
    }
  );

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || (typeof Blob !== 'undefined' && Blob);
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (utils$1.isBoolean(value)) {
      return value.toString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError$1('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (utils$1.isReactNative(formData) && utils$1.isReactNativeBlob(value)) {
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value)))
      ) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) &&
            formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true
                ? renderKey([key], index, dots)
                : indexes === null
                  ? key
                  : key + '[]',
              convertValue(el)
            );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable,
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result =
        !(utils$1.isUndefined(el) || el === null) &&
        visitor.call(formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers);

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00',
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData$1(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder
    ? function (value) {
        return encoder.call(this, value, encode$1);
      }
    : encode$1;

  return this._pairs
    .map(function each(pair) {
      return _encode(pair[0]) + '=' + _encode(pair[1]);
    }, '')
    .join('&');
};

/**
 * It replaces URL-encoded forms of `:`, `$`, `,`, and spaces with
 * their plain counterparts (`:`, `$`, `,`, `+`).
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }

  const _encode = (options && options.encode) || encode;

  const _options = utils$1.isFunction(options)
    ? {
        serialize: options,
      }
    : options;

  const serializeFn = _options && _options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, _options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params)
      ? params.toString()
      : new AxiosURLSearchParams(params, _options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf('#');

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   * @param {Object} options The options for the interceptor, synchronous and runWhen
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null,
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false,
  legacyInterceptorReqResOrdering: true,
};

var URLSearchParams$1 = require$$5.URLSearchParams;

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT,
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const { length } = alphabet;
  const randomValues = new Uint32Array(size);
  require$$8.randomFillSync(randomValues);
  for (let i = 0; i < size; i++) {
    str += alphabet[randomValues[i] % length];
  }

  return str;
};

var platform$1 = {
  isNode: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: (typeof Blob !== 'undefined' && Blob) || null,
  },
  ALPHABET,
  generateString,
  protocols: ['http', 'https', 'file', 'data'],
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = (typeof navigator === 'object' && navigator) || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv =
  hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = (hasBrowserEnv && window.location.href) || 'http://localhost';

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  navigator: _navigator,
  origin: origin
});

var platform = {
  ...utils,
  ...platform$1,
};

function toURLEncodedForm(data, options) {
  return toFormData$1(data, new platform.classes.URLSearchParams(), {
    visitor: function (value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options,
  });
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {
  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [
    function transformRequest(data, headers) {
      const contentType = headers.getContentType() || '';
      const hasJSONContentType = contentType.indexOf('application/json') > -1;
      const isObjectPayload = utils$1.isObject(data);

      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }

      const isFormData = utils$1.isFormData(data);

      if (isFormData) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }

      if (
        utils$1.isArrayBuffer(data) ||
        utils$1.isBuffer(data) ||
        utils$1.isStream(data) ||
        utils$1.isFile(data) ||
        utils$1.isBlob(data) ||
        utils$1.isReadableStream(data)
      ) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
        return data.toString();
      }

      let isFileList;

      if (isObjectPayload) {
        if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }

        if (
          (isFileList = utils$1.isFileList(data)) ||
          contentType.indexOf('multipart/form-data') > -1
        ) {
          const _FormData = this.env && this.env.FormData;

          return toFormData$1(
            isFileList ? { 'files[]': data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }

      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType('application/json', false);
        return stringifySafely(data);
      }

      return data;
    },
  ],

  transformResponse: [
    function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === 'json';

      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }

      if (
        data &&
        utils$1.isString(data) &&
        ((forcedJSONParsing && !this.responseType) || JSONRequested)
      ) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;

        try {
          return JSON.parse(data, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }

      return data;
    },
  ],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob,
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': undefined,
    },
  },
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent',
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders &&
    rawHeaders.split('\n').forEach(function parser(line) {
      i = line.indexOf(':');
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();

      if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
        return;
      }

      if (key === 'set-cookie') {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value)
    ? value.map(normalizeValue)
    : String(value).replace(/[\r\n]+$/, '');
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function (arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true,
    });
  });
}

let AxiosHeaders$1 = class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if (
        !key ||
        self[key] === undefined ||
        _rewrite === true ||
        (_rewrite === undefined && self[key] !== false)
      ) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
      let obj = {},
        dest,
        key;
      for (const entry of header) {
        if (!utils$1.isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }

        obj[(key = entry[0])] = (dest = obj[key])
          ? utils$1.isArray(dest)
            ? [...dest, entry[1]]
            : [dest, entry[1]]
          : entry[1];
      }

      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(
        key &&
        this[key] !== undefined &&
        (!matcher || matchHeaderValue(this, this[key], key, matcher))
      );
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null &&
        value !== false &&
        (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON())
      .map(([header, value]) => header + ': ' + value)
      .join('\n');
  }

  getSetCookie() {
    return this.get('set-cookie') || [];
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals =
      (this[$internals] =
      this[$internals] =
        {
          accessors: {},
        });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
};

AxiosHeaders$1.accessor([
  'Content-Type',
  'Content-Length',
  'Accept',
  'Accept-Encoding',
  'User-Agent',
  'Authorization',
]);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    },
  };
});

utils$1.freezeMethods(AxiosHeaders$1);

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel$1(value) {
  return !!(value && value.__CANCEL__);
}

let CanceledError$1 = class CanceledError extends AxiosError$1 {
  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  constructor(message, config, request) {
    super(message == null ? 'canceled' : message, AxiosError$1.ERR_CANCELED, config, request);
    this.name = 'CanceledError';
    this.__CANCEL__ = true;
  }
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      new AxiosError$1(
        'Request failed with status code ' + response.status,
        [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][
          Math.floor(response.status / 100) - 4
        ],
        response.config,
        response.request,
        response
      )
    );
  }
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  if (typeof url !== 'string') {
    return false;
  }

  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

var DEFAULT_PORTS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
};

function parseUrl(urlString) {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

/**
 * @param {string|object|URL} url - The URL as a string or URL instance, or a
 *   compatible object (such as the result from legacy url.parse).
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */
function getProxyForUrl(url) {
  var parsedUrl = (typeof url === 'string' ? parseUrl(url) : url) || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
    return '';  // Don't proxy URLs without a valid scheme or host.
  }

  proto = proto.split(':', 1)[0];
  // Stripping ports in this way instead of using parsedUrl.hostname to make
  // sure that the brackets around IPv6 addresses are kept.
  hostname = hostname.replace(/:\d*$/, '');
  port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return '';  // Don't proxy URLs that match NO_PROXY.
  }

  var proxy = getEnv(proto + '_proxy') || getEnv('all_proxy');
  if (proxy && proxy.indexOf('://') === -1) {
    // Missing scheme in proxy, default to the requested URL's scheme.
    proxy = proto + '://' + proxy;
  }
  return proxy;
}

/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */
function shouldProxy(hostname, port) {
  var NO_PROXY = getEnv('no_proxy').toLowerCase();
  if (!NO_PROXY) {
    return true;  // Always proxy if NO_PROXY is not set.
  }
  if (NO_PROXY === '*') {
    return false;  // Never proxy if wildcard is set.
  }

  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;  // Skip zero-length hosts.
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;  // Skip if ports don't match.
    }

    if (!/^[.*]/.test(parsedProxyHostname)) {
      // No wildcards, so stop proxying if there is an exact match.
      return hostname !== parsedProxyHostname;
    }

    if (parsedProxyHostname.charAt(0) === '*') {
      // Remove leading wildcard.
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    // Stop proxying if the hostname ends with the no_proxy host.
    return !hostname.endsWith(parsedProxyHostname);
  });
}

/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
}

var followRedirects$1 = {exports: {}};

var src = {exports: {}};

var browser = {exports: {}};

/**
 * Helpers.
 */

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	ms = function (val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

var common;
var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 */

	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = requireMs();
		createDebug.destroy = destroy;

		Object.keys(env).forEach(key => {
			createDebug[key] = env[key];
		});

		/**
		* The currently active debug mode names, and names to skip.
		*/

		createDebug.names = [];
		createDebug.skips = [];

		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};

		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;

			for (let i = 0; i < namespace.length; i++) {
				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
				hash |= 0; // Convert to 32bit integer
			}

			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;

		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;

			function debug(...args) {
				// Disabled?
				if (!debug.enabled) {
					return;
				}

				const self = debug;

				// Set `diff` timestamp
				const curr = Number(new Date());
				const ms = curr - (prevTime || curr);
				self.diff = ms;
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;

				args[0] = createDebug.coerce(args[0]);

				if (typeof args[0] !== 'string') {
					// Anything else let's inspect with %O
					args.unshift('%O');
				}

				// Apply any `formatters` transformations
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					// If we encounter an escaped % then don't increase the array index
					if (match === '%%') {
						return '%';
					}
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === 'function') {
						const val = args[index];
						match = formatter.call(self, val);

						// Now we need to remove `args[index]` since it's inlined in the `format`
						args.splice(index, 1);
						index--;
					}
					return match;
				});

				// Apply env-specific formatting (colors, etc.)
				createDebug.formatArgs.call(self, args);

				const logFn = self.log || createDebug.log;
				logFn.apply(self, args);
			}

			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

			Object.defineProperty(debug, 'enabled', {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) {
						return enableOverride;
					}
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}

					return enabledCache;
				},
				set: v => {
					enableOverride = v;
				}
			});

			// Env-specific initialization logic for debug instances
			if (typeof createDebug.init === 'function') {
				createDebug.init(debug);
			}

			return debug;
		}

		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}

		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;

			createDebug.names = [];
			createDebug.skips = [];

			const split = (typeof namespaces === 'string' ? namespaces : '')
				.trim()
				.replace(/\s+/g, ',')
				.split(',')
				.filter(Boolean);

			for (const ns of split) {
				if (ns[0] === '-') {
					createDebug.skips.push(ns.slice(1));
				} else {
					createDebug.names.push(ns);
				}
			}
		}

		/**
		 * Checks if the given string matches a namespace template, honoring
		 * asterisks as wildcards.
		 *
		 * @param {String} search
		 * @param {String} template
		 * @return {Boolean}
		 */
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;

			while (searchIndex < search.length) {
				if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
					// Match character or proceed with wildcard
					if (template[templateIndex] === '*') {
						starIndex = templateIndex;
						matchIndex = searchIndex;
						templateIndex++; // Skip the '*'
					} else {
						searchIndex++;
						templateIndex++;
					}
				} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
					// Backtrack to the last '*' and try to match more characters
					templateIndex = starIndex + 1;
					matchIndex++;
					searchIndex = matchIndex;
				} else {
					return false; // No match
				}
			}

			// Handle trailing '*' in template
			while (templateIndex < template.length && template[templateIndex] === '*') {
				templateIndex++;
			}

			return templateIndex === template.length;
		}

		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [
				...createDebug.names,
				...createDebug.skips.map(namespace => '-' + namespace)
			].join(',');
			createDebug.enable('');
			return namespaces;
		}

		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) {
				if (matchesTemplate(name, skip)) {
					return false;
				}
			}

			for (const ns of createDebug.names) {
				if (matchesTemplate(name, ns)) {
					return true;
				}
			}

			return false;
		}

		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) {
				return val.stack || val.message;
			}
			return val;
		}

		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}

		createDebug.enable(createDebug.load());

		return createDebug;
	}

	common = setup;
	return common;
}

/* eslint-env browser */

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser.exports;
	hasRequiredBrowser = 1;
	(function (module, exports$1) {
		/**
		 * This is the web browser implementation of `debug()`.
		 */

		exports$1.formatArgs = formatArgs;
		exports$1.save = save;
		exports$1.load = load;
		exports$1.useColors = useColors;
		exports$1.storage = localstorage();
		exports$1.destroy = (() => {
			let warned = false;

			return () => {
				if (!warned) {
					warned = true;
					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
				}
			};
		})();

		/**
		 * Colors.
		 */

		exports$1.colors = [
			'#0000CC',
			'#0000FF',
			'#0033CC',
			'#0033FF',
			'#0066CC',
			'#0066FF',
			'#0099CC',
			'#0099FF',
			'#00CC00',
			'#00CC33',
			'#00CC66',
			'#00CC99',
			'#00CCCC',
			'#00CCFF',
			'#3300CC',
			'#3300FF',
			'#3333CC',
			'#3333FF',
			'#3366CC',
			'#3366FF',
			'#3399CC',
			'#3399FF',
			'#33CC00',
			'#33CC33',
			'#33CC66',
			'#33CC99',
			'#33CCCC',
			'#33CCFF',
			'#6600CC',
			'#6600FF',
			'#6633CC',
			'#6633FF',
			'#66CC00',
			'#66CC33',
			'#9900CC',
			'#9900FF',
			'#9933CC',
			'#9933FF',
			'#99CC00',
			'#99CC33',
			'#CC0000',
			'#CC0033',
			'#CC0066',
			'#CC0099',
			'#CC00CC',
			'#CC00FF',
			'#CC3300',
			'#CC3333',
			'#CC3366',
			'#CC3399',
			'#CC33CC',
			'#CC33FF',
			'#CC6600',
			'#CC6633',
			'#CC9900',
			'#CC9933',
			'#CCCC00',
			'#CCCC33',
			'#FF0000',
			'#FF0033',
			'#FF0066',
			'#FF0099',
			'#FF00CC',
			'#FF00FF',
			'#FF3300',
			'#FF3333',
			'#FF3366',
			'#FF3399',
			'#FF33CC',
			'#FF33FF',
			'#FF6600',
			'#FF6633',
			'#FF9900',
			'#FF9933',
			'#FFCC00',
			'#FFCC33'
		];

		/**
		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
		 * and the Firebug extension (any Firefox version) are known
		 * to support "%c" CSS customizations.
		 *
		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
		 */

		// eslint-disable-next-line complexity
		function useColors() {
			// NB: In an Electron preload script, document will be defined but not fully
			// initialized. Since we know we're in Chrome, we'll just detect this case
			// explicitly
			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
				return true;
			}

			// Internet Explorer and Edge do not support colors.
			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
				return false;
			}

			let m;

			// Is webkit? http://stackoverflow.com/a/16459606/376773
			// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
			// eslint-disable-next-line no-return-assign
			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
				// Is firebug? http://stackoverflow.com/a/398120/376773
				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
				// Is firefox >= v31?
				// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
				(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
				// Double check webkit in userAgent just in case we are in a worker
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
		}

		/**
		 * Colorize log arguments if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			args[0] = (this.useColors ? '%c' : '') +
				this.namespace +
				(this.useColors ? ' %c' : ' ') +
				args[0] +
				(this.useColors ? '%c ' : ' ') +
				'+' + module.exports.humanize(this.diff);

			if (!this.useColors) {
				return;
			}

			const c = 'color: ' + this.color;
			args.splice(1, 0, c, 'color: inherit');

			// The final "%c" is somewhat tricky, because there could be other
			// arguments passed either before or after the %c, so we need to
			// figure out the correct index to insert the CSS into
			let index = 0;
			let lastC = 0;
			args[0].replace(/%[a-zA-Z%]/g, match => {
				if (match === '%%') {
					return;
				}
				index++;
				if (match === '%c') {
					// We only are interested in the *last* %c
					// (the user may have provided their own)
					lastC = index;
				}
			});

			args.splice(lastC, 0, c);
		}

		/**
		 * Invokes `console.debug()` when available.
		 * No-op when `console.debug` is not a "function".
		 * If `console.debug` is not available, falls back
		 * to `console.log`.
		 *
		 * @api public
		 */
		exports$1.log = console.debug || console.log || (() => {});

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			try {
				if (namespaces) {
					exports$1.storage.setItem('debug', namespaces);
				} else {
					exports$1.storage.removeItem('debug');
				}
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */
		function load() {
			let r;
			try {
				r = exports$1.storage.getItem('debug') || exports$1.storage.getItem('DEBUG') ;
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}

			// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
			if (!r && typeof process !== 'undefined' && 'env' in process) {
				r = process.env.DEBUG;
			}

			return r;
		}

		/**
		 * Localstorage attempts to return the localstorage.
		 *
		 * This is necessary because safari throws
		 * when a user disables cookies/localstorage
		 * and you attempt to access it.
		 *
		 * @return {LocalStorage}
		 * @api private
		 */

		function localstorage() {
			try {
				// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
				// The Browser also has localStorage in the global context.
				return localStorage;
			} catch (error) {
				// Swallow
				// XXX (@Qix-) should we be logging these?
			}
		}

		module.exports = requireCommon()(exports$1);

		const {formatters} = module.exports;

		/**
		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
		 */

		formatters.j = function (v) {
			try {
				return JSON.stringify(v);
			} catch (error) {
				return '[UnexpectedJSONParseError]: ' + error.message;
			}
		}; 
	} (browser, browser.exports));
	return browser.exports;
}

var node = {exports: {}};

var hasFlag;
var hasRequiredHasFlag;

function requireHasFlag () {
	if (hasRequiredHasFlag) return hasFlag;
	hasRequiredHasFlag = 1;

	hasFlag = (flag, argv = process.argv) => {
		const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf('--');
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
	return hasFlag;
}

var supportsColor_1;
var hasRequiredSupportsColor;

function requireSupportsColor () {
	if (hasRequiredSupportsColor) return supportsColor_1;
	hasRequiredSupportsColor = 1;
	const os$1 = os;
	const tty = require$$1$1;
	const hasFlag = requireHasFlag();

	const {env} = process;

	let forceColor;
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false') ||
		hasFlag('color=never')) {
		forceColor = 0;
	} else if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		forceColor = 1;
	}

	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			forceColor = 1;
		} else if (env.FORCE_COLOR === 'false') {
			forceColor = 0;
		} else {
			forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
		}
	}

	function translateLevel(level) {
		if (level === 0) {
			return false;
		}

		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}

	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) {
			return 0;
		}

		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}

		if (haveStream && !streamIsTTY && forceColor === undefined) {
			return 0;
		}

		const min = forceColor || 0;

		if (env.TERM === 'dumb') {
			return min;
		}

		if (process.platform === 'win32') {
			// Windows 10 build 10586 is the first Windows release that supports 256 colors.
			// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
			const osRelease = os$1.release().split('.');
			if (
				Number(osRelease[0]) >= 10 &&
				Number(osRelease[2]) >= 10586
			) {
				return Number(osRelease[2]) >= 14931 ? 3 : 2;
			}

			return 1;
		}

		if ('CI' in env) {
			if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
				return 1;
			}

			return min;
		}

		if ('TEAMCITY_VERSION' in env) {
			return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		}

		if (env.COLORTERM === 'truecolor') {
			return 3;
		}

		if ('TERM_PROGRAM' in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

			switch (env.TERM_PROGRAM) {
				case 'iTerm.app':
					return version >= 3 ? 3 : 2;
				case 'Apple_Terminal':
					return 2;
				// No default
			}
		}

		if (/-256(color)?$/i.test(env.TERM)) {
			return 2;
		}

		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
			return 1;
		}

		if ('COLORTERM' in env) {
			return 1;
		}

		return min;
	}

	function getSupportLevel(stream) {
		const level = supportsColor(stream, stream && stream.isTTY);
		return translateLevel(level);
	}

	supportsColor_1 = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty.isatty(2)))
	};
	return supportsColor_1;
}

/**
 * Module dependencies.
 */

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node.exports;
	hasRequiredNode = 1;
	(function (module, exports$1) {
		const tty = require$$1$1;
		const util = require$$1;

		/**
		 * This is the Node.js implementation of `debug()`.
		 */

		exports$1.init = init;
		exports$1.log = log;
		exports$1.formatArgs = formatArgs;
		exports$1.save = save;
		exports$1.load = load;
		exports$1.useColors = useColors;
		exports$1.destroy = util.deprecate(
			() => {},
			'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
		);

		/**
		 * Colors.
		 */

		exports$1.colors = [6, 2, 3, 4, 5, 1];

		try {
			// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
			// eslint-disable-next-line import/no-extraneous-dependencies
			const supportsColor = requireSupportsColor();

			if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
				exports$1.colors = [
					20,
					21,
					26,
					27,
					32,
					33,
					38,
					39,
					40,
					41,
					42,
					43,
					44,
					45,
					56,
					57,
					62,
					63,
					68,
					69,
					74,
					75,
					76,
					77,
					78,
					79,
					80,
					81,
					92,
					93,
					98,
					99,
					112,
					113,
					128,
					129,
					134,
					135,
					148,
					149,
					160,
					161,
					162,
					163,
					164,
					165,
					166,
					167,
					168,
					169,
					170,
					171,
					172,
					173,
					178,
					179,
					184,
					185,
					196,
					197,
					198,
					199,
					200,
					201,
					202,
					203,
					204,
					205,
					206,
					207,
					208,
					209,
					214,
					215,
					220,
					221
				];
			}
		} catch (error) {
			// Swallow - we only care if `supports-color` is available; it doesn't have to be.
		}

		/**
		 * Build up the default `inspectOpts` object from the environment variables.
		 *
		 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
		 */

		exports$1.inspectOpts = Object.keys(process.env).filter(key => {
			return /^debug_/i.test(key);
		}).reduce((obj, key) => {
			// Camel-case
			const prop = key
				.substring(6)
				.toLowerCase()
				.replace(/_([a-z])/g, (_, k) => {
					return k.toUpperCase();
				});

			// Coerce string value into JS value
			let val = process.env[key];
			if (/^(yes|on|true|enabled)$/i.test(val)) {
				val = true;
			} else if (/^(no|off|false|disabled)$/i.test(val)) {
				val = false;
			} else if (val === 'null') {
				val = null;
			} else {
				val = Number(val);
			}

			obj[prop] = val;
			return obj;
		}, {});

		/**
		 * Is stdout a TTY? Colored output is enabled when `true`.
		 */

		function useColors() {
			return 'colors' in exports$1.inspectOpts ?
				Boolean(exports$1.inspectOpts.colors) :
				tty.isatty(process.stderr.fd);
		}

		/**
		 * Adds ANSI color escape codes if enabled.
		 *
		 * @api public
		 */

		function formatArgs(args) {
			const {namespace: name, useColors} = this;

			if (useColors) {
				const c = this.color;
				const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
				const prefix = `  ${colorCode};1m${name} \u001B[0m`;

				args[0] = prefix + args[0].split('\n').join('\n' + prefix);
				args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
			} else {
				args[0] = getDate() + name + ' ' + args[0];
			}
		}

		function getDate() {
			if (exports$1.inspectOpts.hideDate) {
				return '';
			}
			return new Date().toISOString() + ' ';
		}

		/**
		 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
		 */

		function log(...args) {
			return process.stderr.write(util.formatWithOptions(exports$1.inspectOpts, ...args) + '\n');
		}

		/**
		 * Save `namespaces`.
		 *
		 * @param {String} namespaces
		 * @api private
		 */
		function save(namespaces) {
			if (namespaces) {
				process.env.DEBUG = namespaces;
			} else {
				// If you set a process.env field to null or undefined, it gets cast to the
				// string 'null' or 'undefined'. Just delete instead.
				delete process.env.DEBUG;
			}
		}

		/**
		 * Load `namespaces`.
		 *
		 * @return {String} returns the previously persisted debug modes
		 * @api private
		 */

		function load() {
			return process.env.DEBUG;
		}

		/**
		 * Init logic for `debug` instances.
		 *
		 * Create a new `inspectOpts` object in case `useColors` is set
		 * differently for a particular `debug` instance.
		 */

		function init(debug) {
			debug.inspectOpts = {};

			const keys = Object.keys(exports$1.inspectOpts);
			for (let i = 0; i < keys.length; i++) {
				debug.inspectOpts[keys[i]] = exports$1.inspectOpts[keys[i]];
			}
		}

		module.exports = requireCommon()(exports$1);

		const {formatters} = module.exports;

		/**
		 * Map %o to `util.inspect()`, all on a single line.
		 */

		formatters.o = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts)
				.split('\n')
				.map(str => str.trim())
				.join(' ');
		};

		/**
		 * Map %O to `util.inspect()`, allowing multiple lines if needed.
		 */

		formatters.O = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts);
		}; 
	} (node, node.exports));
	return node.exports;
}

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src.exports;
	hasRequiredSrc = 1;
	if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
		src.exports = requireBrowser();
	} else {
		src.exports = requireNode();
	}
	return src.exports;
}

var debug_1;
var hasRequiredDebug;

function requireDebug () {
	if (hasRequiredDebug) return debug_1;
	hasRequiredDebug = 1;
	var debug;

	debug_1 = function () {
	  if (!debug) {
	    try {
	      /* eslint global-require: off */
	      debug = requireSrc()("follow-redirects");
	    }
	    catch (error) { /* */ }
	    if (typeof debug !== "function") {
	      debug = function () { /* */ };
	    }
	  }
	  debug.apply(null, arguments);
	};
	return debug_1;
}

var hasRequiredFollowRedirects;

function requireFollowRedirects () {
	if (hasRequiredFollowRedirects) return followRedirects$1.exports;
	hasRequiredFollowRedirects = 1;
	var url = require$$5;
	var URL = url.URL;
	var http = http__default;
	var https = require$$2;
	var Writable = stream.Writable;
	var assert = require$$4;
	var debug = requireDebug();

	// Preventive platform detection
	// istanbul ignore next
	(function detectUnsupportedEnvironment() {
	  var looksLikeNode = typeof process !== "undefined";
	  var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
	  var looksLikeV8 = isFunction(Error.captureStackTrace);
	  if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
	    console.warn("The follow-redirects package should be excluded from browser builds.");
	  }
	}());

	// Whether to use the native URL object or the legacy url module
	var useNativeURL = false;
	try {
	  assert(new URL(""));
	}
	catch (error) {
	  useNativeURL = error.code === "ERR_INVALID_URL";
	}

	// URL fields to preserve in copy operations
	var preservedUrlFields = [
	  "auth",
	  "host",
	  "hostname",
	  "href",
	  "path",
	  "pathname",
	  "port",
	  "protocol",
	  "query",
	  "search",
	  "hash",
	];

	// Create handlers that pass events from native requests
	var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
	var eventHandlers = Object.create(null);
	events.forEach(function (event) {
	  eventHandlers[event] = function (arg1, arg2, arg3) {
	    this._redirectable.emit(event, arg1, arg2, arg3);
	  };
	});

	// Error types with codes
	var InvalidUrlError = createErrorType(
	  "ERR_INVALID_URL",
	  "Invalid URL",
	  TypeError
	);
	var RedirectionError = createErrorType(
	  "ERR_FR_REDIRECTION_FAILURE",
	  "Redirected request failed"
	);
	var TooManyRedirectsError = createErrorType(
	  "ERR_FR_TOO_MANY_REDIRECTS",
	  "Maximum number of redirects exceeded",
	  RedirectionError
	);
	var MaxBodyLengthExceededError = createErrorType(
	  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
	  "Request body larger than maxBodyLength limit"
	);
	var WriteAfterEndError = createErrorType(
	  "ERR_STREAM_WRITE_AFTER_END",
	  "write after end"
	);

	// istanbul ignore next
	var destroy = Writable.prototype.destroy || noop;

	// An HTTP(S) request that can be redirected
	function RedirectableRequest(options, responseCallback) {
	  // Initialize the request
	  Writable.call(this);
	  this._sanitizeOptions(options);
	  this._options = options;
	  this._ended = false;
	  this._ending = false;
	  this._redirectCount = 0;
	  this._redirects = [];
	  this._requestBodyLength = 0;
	  this._requestBodyBuffers = [];

	  // Attach a callback if passed
	  if (responseCallback) {
	    this.on("response", responseCallback);
	  }

	  // React to responses of native requests
	  var self = this;
	  this._onNativeResponse = function (response) {
	    try {
	      self._processResponse(response);
	    }
	    catch (cause) {
	      self.emit("error", cause instanceof RedirectionError ?
	        cause : new RedirectionError({ cause: cause }));
	    }
	  };

	  // Perform the first request
	  this._performRequest();
	}
	RedirectableRequest.prototype = Object.create(Writable.prototype);

	RedirectableRequest.prototype.abort = function () {
	  destroyRequest(this._currentRequest);
	  this._currentRequest.abort();
	  this.emit("abort");
	};

	RedirectableRequest.prototype.destroy = function (error) {
	  destroyRequest(this._currentRequest, error);
	  destroy.call(this, error);
	  return this;
	};

	// Writes buffered data to the current native request
	RedirectableRequest.prototype.write = function (data, encoding, callback) {
	  // Writing is not allowed if end has been called
	  if (this._ending) {
	    throw new WriteAfterEndError();
	  }

	  // Validate input and shift parameters if necessary
	  if (!isString(data) && !isBuffer(data)) {
	    throw new TypeError("data should be a string, Buffer or Uint8Array");
	  }
	  if (isFunction(encoding)) {
	    callback = encoding;
	    encoding = null;
	  }

	  // Ignore empty buffers, since writing them doesn't invoke the callback
	  // https://github.com/nodejs/node/issues/22066
	  if (data.length === 0) {
	    if (callback) {
	      callback();
	    }
	    return;
	  }
	  // Only write when we don't exceed the maximum body length
	  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
	    this._requestBodyLength += data.length;
	    this._requestBodyBuffers.push({ data: data, encoding: encoding });
	    this._currentRequest.write(data, encoding, callback);
	  }
	  // Error when we exceed the maximum body length
	  else {
	    this.emit("error", new MaxBodyLengthExceededError());
	    this.abort();
	  }
	};

	// Ends the current native request
	RedirectableRequest.prototype.end = function (data, encoding, callback) {
	  // Shift parameters if necessary
	  if (isFunction(data)) {
	    callback = data;
	    data = encoding = null;
	  }
	  else if (isFunction(encoding)) {
	    callback = encoding;
	    encoding = null;
	  }

	  // Write data if needed and end
	  if (!data) {
	    this._ended = this._ending = true;
	    this._currentRequest.end(null, null, callback);
	  }
	  else {
	    var self = this;
	    var currentRequest = this._currentRequest;
	    this.write(data, encoding, function () {
	      self._ended = true;
	      currentRequest.end(null, null, callback);
	    });
	    this._ending = true;
	  }
	};

	// Sets a header value on the current native request
	RedirectableRequest.prototype.setHeader = function (name, value) {
	  this._options.headers[name] = value;
	  this._currentRequest.setHeader(name, value);
	};

	// Clears a header value on the current native request
	RedirectableRequest.prototype.removeHeader = function (name) {
	  delete this._options.headers[name];
	  this._currentRequest.removeHeader(name);
	};

	// Global timeout for all underlying requests
	RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
	  var self = this;

	  // Destroys the socket on timeout
	  function destroyOnTimeout(socket) {
	    socket.setTimeout(msecs);
	    socket.removeListener("timeout", socket.destroy);
	    socket.addListener("timeout", socket.destroy);
	  }

	  // Sets up a timer to trigger a timeout event
	  function startTimer(socket) {
	    if (self._timeout) {
	      clearTimeout(self._timeout);
	    }
	    self._timeout = setTimeout(function () {
	      self.emit("timeout");
	      clearTimer();
	    }, msecs);
	    destroyOnTimeout(socket);
	  }

	  // Stops a timeout from triggering
	  function clearTimer() {
	    // Clear the timeout
	    if (self._timeout) {
	      clearTimeout(self._timeout);
	      self._timeout = null;
	    }

	    // Clean up all attached listeners
	    self.removeListener("abort", clearTimer);
	    self.removeListener("error", clearTimer);
	    self.removeListener("response", clearTimer);
	    self.removeListener("close", clearTimer);
	    if (callback) {
	      self.removeListener("timeout", callback);
	    }
	    if (!self.socket) {
	      self._currentRequest.removeListener("socket", startTimer);
	    }
	  }

	  // Attach callback if passed
	  if (callback) {
	    this.on("timeout", callback);
	  }

	  // Start the timer if or when the socket is opened
	  if (this.socket) {
	    startTimer(this.socket);
	  }
	  else {
	    this._currentRequest.once("socket", startTimer);
	  }

	  // Clean up on events
	  this.on("socket", destroyOnTimeout);
	  this.on("abort", clearTimer);
	  this.on("error", clearTimer);
	  this.on("response", clearTimer);
	  this.on("close", clearTimer);

	  return this;
	};

	// Proxy all other public ClientRequest methods
	[
	  "flushHeaders", "getHeader",
	  "setNoDelay", "setSocketKeepAlive",
	].forEach(function (method) {
	  RedirectableRequest.prototype[method] = function (a, b) {
	    return this._currentRequest[method](a, b);
	  };
	});

	// Proxy all public ClientRequest properties
	["aborted", "connection", "socket"].forEach(function (property) {
	  Object.defineProperty(RedirectableRequest.prototype, property, {
	    get: function () { return this._currentRequest[property]; },
	  });
	});

	RedirectableRequest.prototype._sanitizeOptions = function (options) {
	  // Ensure headers are always present
	  if (!options.headers) {
	    options.headers = {};
	  }

	  // Since http.request treats host as an alias of hostname,
	  // but the url module interprets host as hostname plus port,
	  // eliminate the host property to avoid confusion.
	  if (options.host) {
	    // Use hostname if set, because it has precedence
	    if (!options.hostname) {
	      options.hostname = options.host;
	    }
	    delete options.host;
	  }

	  // Complete the URL object when necessary
	  if (!options.pathname && options.path) {
	    var searchPos = options.path.indexOf("?");
	    if (searchPos < 0) {
	      options.pathname = options.path;
	    }
	    else {
	      options.pathname = options.path.substring(0, searchPos);
	      options.search = options.path.substring(searchPos);
	    }
	  }
	};


	// Executes the next native request (initial or redirect)
	RedirectableRequest.prototype._performRequest = function () {
	  // Load the native protocol
	  var protocol = this._options.protocol;
	  var nativeProtocol = this._options.nativeProtocols[protocol];
	  if (!nativeProtocol) {
	    throw new TypeError("Unsupported protocol " + protocol);
	  }

	  // If specified, use the agent corresponding to the protocol
	  // (HTTP and HTTPS use different types of agents)
	  if (this._options.agents) {
	    var scheme = protocol.slice(0, -1);
	    this._options.agent = this._options.agents[scheme];
	  }

	  // Create the native request and set up its event handlers
	  var request = this._currentRequest =
	        nativeProtocol.request(this._options, this._onNativeResponse);
	  request._redirectable = this;
	  for (var event of events) {
	    request.on(event, eventHandlers[event]);
	  }

	  // RFC7230§5.3.1: When making a request directly to an origin server, […]
	  // a client MUST send only the absolute path […] as the request-target.
	  this._currentUrl = /^\//.test(this._options.path) ?
	    url.format(this._options) :
	    // When making a request to a proxy, […]
	    // a client MUST send the target URI in absolute-form […].
	    this._options.path;

	  // End a redirected request
	  // (The first request must be ended explicitly with RedirectableRequest#end)
	  if (this._isRedirect) {
	    // Write the request entity and end
	    var i = 0;
	    var self = this;
	    var buffers = this._requestBodyBuffers;
	    (function writeNext(error) {
	      // Only write if this request has not been redirected yet
	      // istanbul ignore else
	      if (request === self._currentRequest) {
	        // Report any write errors
	        // istanbul ignore if
	        if (error) {
	          self.emit("error", error);
	        }
	        // Write the next buffer if there are still left
	        else if (i < buffers.length) {
	          var buffer = buffers[i++];
	          // istanbul ignore else
	          if (!request.finished) {
	            request.write(buffer.data, buffer.encoding, writeNext);
	          }
	        }
	        // End the request if `end` has been called on us
	        else if (self._ended) {
	          request.end();
	        }
	      }
	    }());
	  }
	};

	// Processes a response from the current native request
	RedirectableRequest.prototype._processResponse = function (response) {
	  // Store the redirected response
	  var statusCode = response.statusCode;
	  if (this._options.trackRedirects) {
	    this._redirects.push({
	      url: this._currentUrl,
	      headers: response.headers,
	      statusCode: statusCode,
	    });
	  }

	  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
	  // that further action needs to be taken by the user agent in order to
	  // fulfill the request. If a Location header field is provided,
	  // the user agent MAY automatically redirect its request to the URI
	  // referenced by the Location field value,
	  // even if the specific status code is not understood.

	  // If the response is not a redirect; return it as-is
	  var location = response.headers.location;
	  if (!location || this._options.followRedirects === false ||
	      statusCode < 300 || statusCode >= 400) {
	    response.responseUrl = this._currentUrl;
	    response.redirects = this._redirects;
	    this.emit("response", response);

	    // Clean up
	    this._requestBodyBuffers = [];
	    return;
	  }

	  // The response is a redirect, so abort the current request
	  destroyRequest(this._currentRequest);
	  // Discard the remainder of the response to avoid waiting for data
	  response.destroy();

	  // RFC7231§6.4: A client SHOULD detect and intervene
	  // in cyclical redirections (i.e., "infinite" redirection loops).
	  if (++this._redirectCount > this._options.maxRedirects) {
	    throw new TooManyRedirectsError();
	  }

	  // Store the request headers if applicable
	  var requestHeaders;
	  var beforeRedirect = this._options.beforeRedirect;
	  if (beforeRedirect) {
	    requestHeaders = Object.assign({
	      // The Host header was set by nativeProtocol.request
	      Host: response.req.getHeader("host"),
	    }, this._options.headers);
	  }

	  // RFC7231§6.4: Automatic redirection needs to done with
	  // care for methods not known to be safe, […]
	  // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
	  // the request method from POST to GET for the subsequent request.
	  var method = this._options.method;
	  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
	      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
	      // the server is redirecting the user agent to a different resource […]
	      // A user agent can perform a retrieval request targeting that URI
	      // (a GET or HEAD request if using HTTP) […]
	      (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
	    this._options.method = "GET";
	    // Drop a possible entity and headers related to it
	    this._requestBodyBuffers = [];
	    removeMatchingHeaders(/^content-/i, this._options.headers);
	  }

	  // Drop the Host header, as the redirect might lead to a different host
	  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

	  // If the redirect is relative, carry over the host of the last request
	  var currentUrlParts = parseUrl(this._currentUrl);
	  var currentHost = currentHostHeader || currentUrlParts.host;
	  var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
	    url.format(Object.assign(currentUrlParts, { host: currentHost }));

	  // Create the redirected request
	  var redirectUrl = resolveUrl(location, currentUrl);
	  debug("redirecting to", redirectUrl.href);
	  this._isRedirect = true;
	  spreadUrlObject(redirectUrl, this._options);

	  // Drop confidential headers when redirecting to a less secure protocol
	  // or to a different domain that is not a superdomain
	  if (redirectUrl.protocol !== currentUrlParts.protocol &&
	     redirectUrl.protocol !== "https:" ||
	     redirectUrl.host !== currentHost &&
	     !isSubdomain(redirectUrl.host, currentHost)) {
	    removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
	  }

	  // Evaluate the beforeRedirect callback
	  if (isFunction(beforeRedirect)) {
	    var responseDetails = {
	      headers: response.headers,
	      statusCode: statusCode,
	    };
	    var requestDetails = {
	      url: currentUrl,
	      method: method,
	      headers: requestHeaders,
	    };
	    beforeRedirect(this._options, responseDetails, requestDetails);
	    this._sanitizeOptions(this._options);
	  }

	  // Perform the redirected request
	  this._performRequest();
	};

	// Wraps the key/value object of protocols with redirect functionality
	function wrap(protocols) {
	  // Default settings
	  var exports$1 = {
	    maxRedirects: 21,
	    maxBodyLength: 10 * 1024 * 1024,
	  };

	  // Wrap each protocol
	  var nativeProtocols = {};
	  Object.keys(protocols).forEach(function (scheme) {
	    var protocol = scheme + ":";
	    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
	    var wrappedProtocol = exports$1[scheme] = Object.create(nativeProtocol);

	    // Executes a request, following redirects
	    function request(input, options, callback) {
	      // Parse parameters, ensuring that input is an object
	      if (isURL(input)) {
	        input = spreadUrlObject(input);
	      }
	      else if (isString(input)) {
	        input = spreadUrlObject(parseUrl(input));
	      }
	      else {
	        callback = options;
	        options = validateUrl(input);
	        input = { protocol: protocol };
	      }
	      if (isFunction(options)) {
	        callback = options;
	        options = null;
	      }

	      // Set defaults
	      options = Object.assign({
	        maxRedirects: exports$1.maxRedirects,
	        maxBodyLength: exports$1.maxBodyLength,
	      }, input, options);
	      options.nativeProtocols = nativeProtocols;
	      if (!isString(options.host) && !isString(options.hostname)) {
	        options.hostname = "::1";
	      }

	      assert.equal(options.protocol, protocol, "protocol mismatch");
	      debug("options", options);
	      return new RedirectableRequest(options, callback);
	    }

	    // Executes a GET request, following redirects
	    function get(input, options, callback) {
	      var wrappedRequest = wrappedProtocol.request(input, options, callback);
	      wrappedRequest.end();
	      return wrappedRequest;
	    }

	    // Expose the properties on the wrapped protocol
	    Object.defineProperties(wrappedProtocol, {
	      request: { value: request, configurable: true, enumerable: true, writable: true },
	      get: { value: get, configurable: true, enumerable: true, writable: true },
	    });
	  });
	  return exports$1;
	}

	function noop() { /* empty */ }

	function parseUrl(input) {
	  var parsed;
	  // istanbul ignore else
	  if (useNativeURL) {
	    parsed = new URL(input);
	  }
	  else {
	    // Ensure the URL is valid and absolute
	    parsed = validateUrl(url.parse(input));
	    if (!isString(parsed.protocol)) {
	      throw new InvalidUrlError({ input });
	    }
	  }
	  return parsed;
	}

	function resolveUrl(relative, base) {
	  // istanbul ignore next
	  return useNativeURL ? new URL(relative, base) : parseUrl(url.resolve(base, relative));
	}

	function validateUrl(input) {
	  if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
	    throw new InvalidUrlError({ input: input.href || input });
	  }
	  if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
	    throw new InvalidUrlError({ input: input.href || input });
	  }
	  return input;
	}

	function spreadUrlObject(urlObject, target) {
	  var spread = target || {};
	  for (var key of preservedUrlFields) {
	    spread[key] = urlObject[key];
	  }

	  // Fix IPv6 hostname
	  if (spread.hostname.startsWith("[")) {
	    spread.hostname = spread.hostname.slice(1, -1);
	  }
	  // Ensure port is a number
	  if (spread.port !== "") {
	    spread.port = Number(spread.port);
	  }
	  // Concatenate path
	  spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;

	  return spread;
	}

	function removeMatchingHeaders(regex, headers) {
	  var lastValue;
	  for (var header in headers) {
	    if (regex.test(header)) {
	      lastValue = headers[header];
	      delete headers[header];
	    }
	  }
	  return (lastValue === null || typeof lastValue === "undefined") ?
	    undefined : String(lastValue).trim();
	}

	function createErrorType(code, message, baseClass) {
	  // Create constructor
	  function CustomError(properties) {
	    // istanbul ignore else
	    if (isFunction(Error.captureStackTrace)) {
	      Error.captureStackTrace(this, this.constructor);
	    }
	    Object.assign(this, properties || {});
	    this.code = code;
	    this.message = this.cause ? message + ": " + this.cause.message : message;
	  }

	  // Attach constructor and set default properties
	  CustomError.prototype = new (baseClass || Error)();
	  Object.defineProperties(CustomError.prototype, {
	    constructor: {
	      value: CustomError,
	      enumerable: false,
	    },
	    name: {
	      value: "Error [" + code + "]",
	      enumerable: false,
	    },
	  });
	  return CustomError;
	}

	function destroyRequest(request, error) {
	  for (var event of events) {
	    request.removeListener(event, eventHandlers[event]);
	  }
	  request.on("error", noop);
	  request.destroy(error);
	}

	function isSubdomain(subdomain, domain) {
	  assert(isString(subdomain) && isString(domain));
	  var dot = subdomain.length - domain.length - 1;
	  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
	}

	function isString(value) {
	  return typeof value === "string" || value instanceof String;
	}

	function isFunction(value) {
	  return typeof value === "function";
	}

	function isBuffer(value) {
	  return typeof value === "object" && ("length" in value);
	}

	function isURL(value) {
	  return URL && value instanceof URL;
	}

	// Exports
	followRedirects$1.exports = wrap({ http: http, https: https });
	followRedirects$1.exports.wrap = wrap;
	return followRedirects$1.exports;
}

var followRedirectsExports = requireFollowRedirects();
var followRedirects = /*@__PURE__*/getDefaultExportFromCjs(followRedirectsExports);

const VERSION$1 = "1.14.0";

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return (match && match[1]) || '';
}

const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

/**
 * Parse data uri to a Buffer or Blob
 *
 * @param {String} uri
 * @param {?Boolean} asBlob
 * @param {?Object} options
 * @param {?Function} options.Blob
 *
 * @returns {Buffer|Blob}
 */
function fromDataURI(uri, asBlob, options) {
  const _Blob = (options && options.Blob) || platform.classes.Blob;
  const protocol = parseProtocol(uri);

  if (asBlob === undefined && _Blob) {
    asBlob = true;
  }

  if (protocol === 'data') {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;

    const match = DATA_URL_PATTERN.exec(uri);

    if (!match) {
      throw new AxiosError$1('Invalid URL', AxiosError$1.ERR_INVALID_URL);
    }

    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? 'base64' : 'utf8');

    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError$1('Blob is not supported', AxiosError$1.ERR_NOT_SUPPORT);
      }

      return new _Blob([buffer], { type: mime });
    }

    return buffer;
  }

  throw new AxiosError$1('Unsupported protocol ' + protocol, AxiosError$1.ERR_NOT_SUPPORT);
}

const kInternals = Symbol('internals');

class AxiosTransformStream extends stream.Transform {
  constructor(options) {
    options = utils$1.toFlatObject(
      options,
      {
        maxRate: 0,
        chunkSize: 64 * 1024,
        minChunkSize: 100,
        timeWindow: 500,
        ticksRate: 2,
        samplesCount: 15,
      },
      null,
      (prop, source) => {
        return !utils$1.isUndefined(source[prop]);
      }
    );

    super({
      readableHighWaterMark: options.chunkSize,
    });

    const internals = (this[kInternals] = {
      timeWindow: options.timeWindow,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null,
    });

    this.on('newListener', (event) => {
      if (event === 'progress') {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
  }

  _read(size) {
    const internals = this[kInternals];

    if (internals.onReadCallback) {
      internals.onReadCallback();
    }

    return super._read(size);
  }

  _transform(chunk, encoding, callback) {
    const internals = this[kInternals];
    const maxRate = internals.maxRate;

    const readableHighWaterMark = this.readableHighWaterMark;

    const timeWindow = internals.timeWindow;

    const divider = 1000 / timeWindow;
    const bytesThreshold = maxRate / divider;
    const minChunkSize =
      internals.minChunkSize !== false
        ? Math.max(internals.minChunkSize, bytesThreshold * 0.01)
        : 0;

    const pushChunk = (_chunk, _callback) => {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;

      internals.isCaptured && this.emit('progress', internals.bytesSeen);

      if (this.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    };

    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;

      if (maxRate) {
        const now = Date.now();

        if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }

        bytesLeft = bytesThreshold - internals.bytes;
      }

      if (maxRate) {
        if (bytesLeft <= 0) {
          // next time window
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }

        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }

      if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }

      pushChunk(
        _chunk,
        chunkRemainder
          ? () => {
              process.nextTick(_callback, null, chunkRemainder);
            }
          : _callback
      );
    };

    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }

      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
}

const { asyncIterator } = Symbol;

const readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};

const BOUNDARY_ALPHABET = platform.ALPHABET.ALPHA_DIGIT + '-_';

const textEncoder = typeof TextEncoder === 'function' ? new TextEncoder() : new require$$1.TextEncoder();

const CRLF = '\r\n';
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;

class FormDataPart {
  constructor(name, value) {
    const { escapeName } = this.constructor;
    const isStringValue = utils$1.isString(value);

    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${
      !isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ''
    }${CRLF}`;

    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || 'application/octet-stream'}${CRLF}`;
    }

    this.headers = textEncoder.encode(headers + CRLF);

    this.contentLength = isStringValue ? value.byteLength : value.size;

    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;

    this.name = name;
    this.value = value;
  }

  async *encode() {
    yield this.headers;

    const { value } = this;

    if (utils$1.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob(value);
    }

    yield CRLF_BYTES;
  }

  static escapeName(name) {
    return String(name).replace(
      /[\r\n"]/g,
      (match) =>
        ({
          '\r': '%0D',
          '\n': '%0A',
          '"': '%22',
        })[match]
    );
  }
}

const formDataToStream = (form, headersHandler, options) => {
  const {
    tag = 'form-data-boundary',
    size = 25,
    boundary = tag + '-' + platform.generateString(size, BOUNDARY_ALPHABET),
  } = options || {};

  if (!utils$1.isFormData(form)) {
    throw TypeError('FormData instance required');
  }

  if (boundary.length < 1 || boundary.length > 70) {
    throw Error('boundary must be 10-70 characters long');
  }

  const boundaryBytes = textEncoder.encode('--' + boundary + CRLF);
  const footerBytes = textEncoder.encode('--' + boundary + '--' + CRLF);
  let contentLength = footerBytes.byteLength;

  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });

  contentLength += boundaryBytes.byteLength * parts.length;

  contentLength = utils$1.toFiniteNumber(contentLength);

  const computedHeaders = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
  };

  if (Number.isFinite(contentLength)) {
    computedHeaders['Content-Length'] = contentLength;
  }

  headersHandler && headersHandler(computedHeaders);

  return Readable.from(
    (async function* () {
      for (const part of parts) {
        yield boundaryBytes;
        yield* part.encode();
      }

      yield footerBytes;
    })()
  );
};

class ZlibHeaderTransformStream extends stream.Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;

      // Add Default Compression headers if no zlib headers are present
      if (chunk[0] !== 120) {
        // Hex: 78
        const header = Buffer.alloc(2);
        header[0] = 120; // Hex: 78
        header[1] = 156; // Hex: 9C
        this.push(header, encoding);
      }
    }

    this.__transform(chunk, encoding, callback);
  }
}

const callbackify = (fn, reducer) => {
  return utils$1.isAsyncFn(fn)
    ? function (...args) {
        const cb = args.pop();
        fn.apply(this, args).then((value) => {
          try {
            reducer ? cb(null, ...reducer(value)) : cb(null, value);
          } catch (err) {
            cb(err);
          }
        }, cb);
      }
    : fn;
};

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round((bytesCount * 1000) / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? loaded / total : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true,
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [
    (loaded) =>
      throttled[0]({
        lengthComputable,
        total,
        loaded,
      }),
    throttled[1],
  ];
};

const asyncDecorator =
  (fn) =>
  (...args) =>
    utils$1.asap(() => fn(...args));

/**
 * Estimate decoded byte length of a data:// URL *without* allocating large buffers.
 * - For base64: compute exact decoded size using length and padding;
 *               handle %XX at the character-count level (no string allocation).
 * - For non-base64: use UTF-8 byteLength of the encoded body as a safe upper bound.
 *
 * @param {string} url
 * @returns {number}
 */
function estimateDataURLDecodedBytes(url) {
  if (!url || typeof url !== 'string') return 0;
  if (!url.startsWith('data:')) return 0;

  const comma = url.indexOf(',');
  if (comma < 0) return 0;

  const meta = url.slice(5, comma);
  const body = url.slice(comma + 1);
  const isBase64 = /;base64/i.test(meta);

  if (isBase64) {
    let effectiveLen = body.length;
    const len = body.length; // cache length

    for (let i = 0; i < len; i++) {
      if (body.charCodeAt(i) === 37 /* '%' */ && i + 2 < len) {
        const a = body.charCodeAt(i + 1);
        const b = body.charCodeAt(i + 2);
        const isHex =
          ((a >= 48 && a <= 57) || (a >= 65 && a <= 70) || (a >= 97 && a <= 102)) &&
          ((b >= 48 && b <= 57) || (b >= 65 && b <= 70) || (b >= 97 && b <= 102));

        if (isHex) {
          effectiveLen -= 2;
          i += 2;
        }
      }
    }

    let pad = 0;
    let idx = len - 1;

    const tailIsPct3D = (j) =>
      j >= 2 &&
      body.charCodeAt(j - 2) === 37 && // '%'
      body.charCodeAt(j - 1) === 51 && // '3'
      (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100); // 'D' or 'd'

    if (idx >= 0) {
      if (body.charCodeAt(idx) === 61 /* '=' */) {
        pad++;
        idx--;
      } else if (tailIsPct3D(idx)) {
        pad++;
        idx -= 3;
      }
    }

    if (pad === 1 && idx >= 0) {
      if (body.charCodeAt(idx) === 61 /* '=' */) {
        pad++;
      } else if (tailIsPct3D(idx)) {
        pad++;
      }
    }

    const groups = Math.floor(effectiveLen / 4);
    const bytes = groups * 3 - (pad || 0);
    return bytes > 0 ? bytes : 0;
  }

  return Buffer.byteLength(body, 'utf8');
}

const zlibOptions = {
  flush: zlib.constants.Z_SYNC_FLUSH,
  finishFlush: zlib.constants.Z_SYNC_FLUSH,
};

const brotliOptions = {
  flush: zlib.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH,
};

const isBrotliSupported = utils$1.isFunction(zlib.createBrotliDecompress);

const { http: httpFollow, https: httpsFollow } = followRedirects;

const isHttps = /https:?/;

const supportedProtocols = platform.protocols.map((protocol) => {
  return protocol + ':';
});

const flushOnFinish = (stream, [throttled, flush]) => {
  stream.on('end', flush).on('error', flush);

  return throttled;
};

class Http2Sessions {
  constructor() {
    this.sessions = Object.create(null);
  }

  getSession(authority, options) {
    options = Object.assign(
      {
        sessionTimeout: 1000,
      },
      options
    );

    let authoritySessions = this.sessions[authority];

    if (authoritySessions) {
      let len = authoritySessions.length;

      for (let i = 0; i < len; i++) {
        const [sessionHandle, sessionOptions] = authoritySessions[i];
        if (
          !sessionHandle.destroyed &&
          !sessionHandle.closed &&
          require$$1.isDeepStrictEqual(sessionOptions, options)
        ) {
          return sessionHandle;
        }
      }
    }

    const session = http2.connect(authority, options);

    let removed;

    const removeSession = () => {
      if (removed) {
        return;
      }

      removed = true;

      let entries = authoritySessions,
        len = entries.length,
        i = len;

      while (i--) {
        if (entries[i][0] === session) {
          if (len === 1) {
            delete this.sessions[authority];
          } else {
            entries.splice(i, 1);
          }
          if (!session.closed) {
            session.close();
          }
          return;
        }
      }
    };

    const originalRequestFn = session.request;

    const { sessionTimeout } = options;

    if (sessionTimeout != null) {
      let timer;
      let streamsCount = 0;

      session.request = function () {
        const stream = originalRequestFn.apply(this, arguments);

        streamsCount++;

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        stream.once('close', () => {
          if (!--streamsCount) {
            timer = setTimeout(() => {
              timer = null;
              removeSession();
            }, sessionTimeout);
          }
        });

        return stream;
      };
    }

    session.once('close', removeSession);

    let entry = [session, options];

    authoritySessions
      ? authoritySessions.push(entry)
      : (authoritySessions = this.sessions[authority] = [entry]);

    return session;
  }
}

const http2Sessions = new Http2Sessions();

/**
 * If the proxy or config beforeRedirects functions are defined, call them with the options
 * object.
 *
 * @param {Object<string, any>} options - The options object that was passed to the request.
 *
 * @returns {Object<string, any>}
 */
function dispatchBeforeRedirect(options, responseDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails);
  }
}

/**
 * If the proxy or config afterRedirects functions are defined, call them with the options
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} configProxy configuration from Axios options object
 * @param {string} location
 *
 * @returns {http.ClientRequestArgs}
 */
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = getProxyForUrl(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    // Basic proxy authorization
    if (proxy.username) {
      proxy.auth = (proxy.username || '') + ':' + (proxy.password || '');
    }

    if (proxy.auth) {
      // Support proxy auth object form
      const validProxyAuth = Boolean(proxy.auth.username || proxy.auth.password);

      if (validProxyAuth) {
        proxy.auth = (proxy.auth.username || '') + ':' + (proxy.auth.password || '');
      } else if (typeof proxy.auth === 'object') {
        throw new AxiosError$1('Invalid proxy authorization', AxiosError$1.ERR_BAD_OPTION, { proxy });
      }

      const base64 = Buffer.from(proxy.auth, 'utf8').toString('base64');

      options.headers['Proxy-Authorization'] = 'Basic ' + base64;
    }

    options.headers.host = options.hostname + (options.port ? ':' + options.port : '');
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    // Replace 'host' since options is not a URL object
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(':') ? proxy.protocol : `${proxy.protocol}:`;
    }
  }

  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    // Configure proxy for redirected request, passing the original config proxy to apply
    // the exact same logic as if the redirected request was performed by axios directly.
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}

const isHttpAdapterSupported =
  typeof process !== 'undefined' && utils$1.kindOf(process) === 'process';

// temporary hotfix

const wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;

    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };

    const _resolve = (value) => {
      done(value);
      resolve(value);
    };

    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };

    asyncExecutor(_resolve, _reject, (onDoneHandler) => (onDone = onDoneHandler)).catch(_reject);
  });
};

const resolveFamily = ({ address, family }) => {
  if (!utils$1.isString(address)) {
    throw TypeError('address must be a string');
  }
  return {
    address,
    family: family || (address.indexOf('.') < 0 ? 6 : 4),
  };
};

const buildAddressEntry = (address, family) =>
  resolveFamily(utils$1.isObject(address) ? address : { address, family });

const http2Transport = {
  request(options, cb) {
    const authority =
      options.protocol +
      '//' +
      options.hostname +
      ':' +
      (options.port || (options.protocol === 'https:' ? 443 : 80));

    const { http2Options, headers } = options;

    const session = http2Sessions.getSession(authority, http2Options);

    const { HTTP2_HEADER_SCHEME, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } =
      http2.constants;

    const http2Headers = {
      [HTTP2_HEADER_SCHEME]: options.protocol.replace(':', ''),
      [HTTP2_HEADER_METHOD]: options.method,
      [HTTP2_HEADER_PATH]: options.path,
    };

    utils$1.forEach(headers, (header, name) => {
      name.charAt(0) !== ':' && (http2Headers[name] = header);
    });

    const req = session.request(http2Headers);

    req.once('response', (responseHeaders) => {
      const response = req; //duplex

      responseHeaders = Object.assign({}, responseHeaders);

      const status = responseHeaders[HTTP2_HEADER_STATUS];

      delete responseHeaders[HTTP2_HEADER_STATUS];

      response.headers = responseHeaders;

      response.statusCode = +status;

      cb(response);
    });

    return req;
  },
};

/*eslint consistent-return:0*/
var httpAdapter = isHttpAdapterSupported &&
  function httpAdapter(config) {
    return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
      let { data, lookup, family, httpVersion = 1, http2Options } = config;
      const { responseType, responseEncoding } = config;
      const method = config.method.toUpperCase();
      let isDone;
      let rejected = false;
      let req;

      httpVersion = +httpVersion;

      if (Number.isNaN(httpVersion)) {
        throw TypeError(`Invalid protocol version: '${config.httpVersion}' is not a number`);
      }

      if (httpVersion !== 1 && httpVersion !== 2) {
        throw TypeError(`Unsupported protocol version '${httpVersion}'`);
      }

      const isHttp2 = httpVersion === 2;

      if (lookup) {
        const _lookup = callbackify(lookup, (value) => (utils$1.isArray(value) ? value : [value]));
        // hotfix to support opt.all option which is required for node 20.x
        lookup = (hostname, opt, cb) => {
          _lookup(hostname, opt, (err, arg0, arg1) => {
            if (err) {
              return cb(err);
            }

            const addresses = utils$1.isArray(arg0)
              ? arg0.map((addr) => buildAddressEntry(addr))
              : [buildAddressEntry(arg0, arg1)];

            opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
          });
        };
      }

      const abortEmitter = new EventEmitter();

      function abort(reason) {
        try {
          abortEmitter.emit(
            'abort',
            !reason || reason.type ? new CanceledError$1(null, config, req) : reason
          );
        } catch (err) {
          console.warn('emit error', err);
        }
      }

      abortEmitter.once('abort', reject);

      const onFinished = () => {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(abort);
        }

        if (config.signal) {
          config.signal.removeEventListener('abort', abort);
        }

        abortEmitter.removeAllListeners();
      };

      if (config.cancelToken || config.signal) {
        config.cancelToken && config.cancelToken.subscribe(abort);
        if (config.signal) {
          config.signal.aborted ? abort() : config.signal.addEventListener('abort', abort);
        }
      }

      onDone((response, isRejected) => {
        isDone = true;

        if (isRejected) {
          rejected = true;
          onFinished();
          return;
        }

        const { data } = response;

        if (data instanceof stream.Readable || data instanceof stream.Duplex) {
          const offListeners = stream.finished(data, () => {
            offListeners();
            onFinished();
          });
        } else {
          onFinished();
        }
      });

      // Parse url
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      const parsed = new URL(fullPath, platform.hasBrowserEnv ? platform.origin : undefined);
      const protocol = parsed.protocol || supportedProtocols[0];

      if (protocol === 'data:') {
        // Apply the same semantics as HTTP: only enforce if a finite, non-negative cap is set.
        if (config.maxContentLength > -1) {
          // Use the exact string passed to fromDataURI (config.url); fall back to fullPath if needed.
          const dataUrl = String(config.url || fullPath || '');
          const estimated = estimateDataURLDecodedBytes(dataUrl);

          if (estimated > config.maxContentLength) {
            return reject(
              new AxiosError$1(
                'maxContentLength size of ' + config.maxContentLength + ' exceeded',
                AxiosError$1.ERR_BAD_RESPONSE,
                config
              )
            );
          }
        }

        let convertedData;

        if (method !== 'GET') {
          return settle(resolve, reject, {
            status: 405,
            statusText: 'method not allowed',
            headers: {},
            config,
          });
        }

        try {
          convertedData = fromDataURI(config.url, responseType === 'blob', {
            Blob: config.env && config.env.Blob,
          });
        } catch (err) {
          throw AxiosError$1.from(err, AxiosError$1.ERR_BAD_REQUEST, config);
        }

        if (responseType === 'text') {
          convertedData = convertedData.toString(responseEncoding);

          if (!responseEncoding || responseEncoding === 'utf8') {
            convertedData = utils$1.stripBOM(convertedData);
          }
        } else if (responseType === 'stream') {
          convertedData = stream.Readable.from(convertedData);
        }

        return settle(resolve, reject, {
          data: convertedData,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders$1(),
          config,
        });
      }

      if (supportedProtocols.indexOf(protocol) === -1) {
        return reject(
          new AxiosError$1('Unsupported protocol ' + protocol, AxiosError$1.ERR_BAD_REQUEST, config)
        );
      }

      const headers = AxiosHeaders$1.from(config.headers).normalize();

      // Set User-Agent (required by some servers)
      // See https://github.com/axios/axios/issues/69
      // User-Agent is specified; handle case where no UA header is desired
      // Only set header if it hasn't been set in config
      headers.set('User-Agent', 'axios/' + VERSION$1, false);

      const { onUploadProgress, onDownloadProgress } = config;
      const maxRate = config.maxRate;
      let maxUploadRate = undefined;
      let maxDownloadRate = undefined;

      // support for spec compliant FormData objects
      if (utils$1.isSpecCompliantForm(data)) {
        const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);

        data = formDataToStream(
          data,
          (formHeaders) => {
            headers.set(formHeaders);
          },
          {
            tag: `axios-${VERSION$1}-boundary`,
            boundary: (userBoundary && userBoundary[1]) || undefined,
          }
        );
        // support for https://www.npmjs.com/package/form-data api
      } else if (utils$1.isFormData(data) && utils$1.isFunction(data.getHeaders)) {
        headers.set(data.getHeaders());

        if (!headers.hasContentLength()) {
          try {
            const knownLength = await require$$1.promisify(data.getLength).call(data);
            Number.isFinite(knownLength) &&
              knownLength >= 0 &&
              headers.setContentLength(knownLength);
            /*eslint no-empty:0*/
          } catch (e) {}
        }
      } else if (utils$1.isBlob(data) || utils$1.isFile(data)) {
        data.size && headers.setContentType(data.type || 'application/octet-stream');
        headers.setContentLength(data.size || 0);
        data = stream.Readable.from(readBlob(data));
      } else if (data && !utils$1.isStream(data)) {
        if (Buffer.isBuffer(data)) ; else if (utils$1.isArrayBuffer(data)) {
          data = Buffer.from(new Uint8Array(data));
        } else if (utils$1.isString(data)) {
          data = Buffer.from(data, 'utf-8');
        } else {
          return reject(
            new AxiosError$1(
              'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
              AxiosError$1.ERR_BAD_REQUEST,
              config
            )
          );
        }

        // Add Content-Length header if data exists
        headers.setContentLength(data.length, false);

        if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
          return reject(
            new AxiosError$1(
              'Request body larger than maxBodyLength limit',
              AxiosError$1.ERR_BAD_REQUEST,
              config
            )
          );
        }
      }

      const contentLength = utils$1.toFiniteNumber(headers.getContentLength());

      if (utils$1.isArray(maxRate)) {
        maxUploadRate = maxRate[0];
        maxDownloadRate = maxRate[1];
      } else {
        maxUploadRate = maxDownloadRate = maxRate;
      }

      if (data && (onUploadProgress || maxUploadRate)) {
        if (!utils$1.isStream(data)) {
          data = stream.Readable.from(data, { objectMode: false });
        }

        data = stream.pipeline(
          [
            data,
            new AxiosTransformStream({
              maxRate: utils$1.toFiniteNumber(maxUploadRate),
            }),
          ],
          utils$1.noop
        );

        onUploadProgress &&
          data.on(
            'progress',
            flushOnFinish(
              data,
              progressEventDecorator(
                contentLength,
                progressEventReducer(asyncDecorator(onUploadProgress), false, 3)
              )
            )
          );
      }

      // HTTP basic authentication
      let auth = undefined;
      if (config.auth) {
        const username = config.auth.username || '';
        const password = config.auth.password || '';
        auth = username + ':' + password;
      }

      if (!auth && parsed.username) {
        const urlUsername = parsed.username;
        const urlPassword = parsed.password;
        auth = urlUsername + ':' + urlPassword;
      }

      auth && headers.delete('authorization');

      let path;

      try {
        path = buildURL(
          parsed.pathname + parsed.search,
          config.params,
          config.paramsSerializer
        ).replace(/^\?/, '');
      } catch (err) {
        const customErr = new Error(err.message);
        customErr.config = config;
        customErr.url = config.url;
        customErr.exists = true;
        return reject(customErr);
      }

      headers.set(
        'Accept-Encoding',
        'gzip, compress, deflate' + (isBrotliSupported ? ', br' : ''),
        false
      );

      const options = {
        path,
        method: method,
        headers: headers.toJSON(),
        agents: { http: config.httpAgent, https: config.httpsAgent },
        auth,
        protocol,
        family,
        beforeRedirect: dispatchBeforeRedirect,
        beforeRedirects: {},
        http2Options,
      };

      // cacheable-lookup integration hotfix
      !utils$1.isUndefined(lookup) && (options.lookup = lookup);

      if (config.socketPath) {
        options.socketPath = config.socketPath;
      } else {
        options.hostname = parsed.hostname.startsWith('[')
          ? parsed.hostname.slice(1, -1)
          : parsed.hostname;
        options.port = parsed.port;
        setProxy(
          options,
          config.proxy,
          protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path
        );
      }

      let transport;
      const isHttpsRequest = isHttps.test(options.protocol);
      options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

      if (isHttp2) {
        transport = http2Transport;
      } else {
        if (config.transport) {
          transport = config.transport;
        } else if (config.maxRedirects === 0) {
          transport = isHttpsRequest ? require$$2 : http__default;
        } else {
          if (config.maxRedirects) {
            options.maxRedirects = config.maxRedirects;
          }
          if (config.beforeRedirect) {
            options.beforeRedirects.config = config.beforeRedirect;
          }
          transport = isHttpsRequest ? httpsFollow : httpFollow;
        }
      }

      if (config.maxBodyLength > -1) {
        options.maxBodyLength = config.maxBodyLength;
      } else {
        // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
        options.maxBodyLength = Infinity;
      }

      if (config.insecureHTTPParser) {
        options.insecureHTTPParser = config.insecureHTTPParser;
      }

      // Create the request
      req = transport.request(options, function handleResponse(res) {
        if (req.destroyed) return;

        const streams = [res];

        const responseLength = utils$1.toFiniteNumber(res.headers['content-length']);

        if (onDownloadProgress || maxDownloadRate) {
          const transformStream = new AxiosTransformStream({
            maxRate: utils$1.toFiniteNumber(maxDownloadRate),
          });

          onDownloadProgress &&
            transformStream.on(
              'progress',
              flushOnFinish(
                transformStream,
                progressEventDecorator(
                  responseLength,
                  progressEventReducer(asyncDecorator(onDownloadProgress), true, 3)
                )
              )
            );

          streams.push(transformStream);
        }

        // decompress the response body transparently if required
        let responseStream = res;

        // return the last request in case of redirects
        const lastRequest = res.req || req;

        // if decompress disabled we should not decompress
        if (config.decompress !== false && res.headers['content-encoding']) {
          // if no content, but headers still say that it is encoded,
          // remove the header not confuse downstream operations
          if (method === 'HEAD' || res.statusCode === 204) {
            delete res.headers['content-encoding'];
          }

          switch ((res.headers['content-encoding'] || '').toLowerCase()) {
            /*eslint default-case:0*/
            case 'gzip':
            case 'x-gzip':
            case 'compress':
            case 'x-compress':
              // add the unzipper to the body stream processing pipeline
              streams.push(zlib.createUnzip(zlibOptions));

              // remove the content-encoding in order to not confuse downstream operations
              delete res.headers['content-encoding'];
              break;
            case 'deflate':
              streams.push(new ZlibHeaderTransformStream());

              // add the unzipper to the body stream processing pipeline
              streams.push(zlib.createUnzip(zlibOptions));

              // remove the content-encoding in order to not confuse downstream operations
              delete res.headers['content-encoding'];
              break;
            case 'br':
              if (isBrotliSupported) {
                streams.push(zlib.createBrotliDecompress(brotliOptions));
                delete res.headers['content-encoding'];
              }
          }
        }

        responseStream = streams.length > 1 ? stream.pipeline(streams, utils$1.noop) : streams[0];

        const response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: new AxiosHeaders$1(res.headers),
          config,
          request: lastRequest,
        };

        if (responseType === 'stream') {
          response.data = responseStream;
          settle(resolve, reject, response);
        } else {
          const responseBuffer = [];
          let totalResponseBytes = 0;

          responseStream.on('data', function handleStreamData(chunk) {
            responseBuffer.push(chunk);
            totalResponseBytes += chunk.length;

            // make sure the content length is not over the maxContentLength if specified
            if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
              // stream.destroy() emit aborted event before calling reject() on Node.js v16
              rejected = true;
              responseStream.destroy();
              abort(
                new AxiosError$1(
                  'maxContentLength size of ' + config.maxContentLength + ' exceeded',
                  AxiosError$1.ERR_BAD_RESPONSE,
                  config,
                  lastRequest
                )
              );
            }
          });

          responseStream.on('aborted', function handlerStreamAborted() {
            if (rejected) {
              return;
            }

            const err = new AxiosError$1(
              'stream has been aborted',
              AxiosError$1.ERR_BAD_RESPONSE,
              config,
              lastRequest
            );
            responseStream.destroy(err);
            reject(err);
          });

          responseStream.on('error', function handleStreamError(err) {
            if (req.destroyed) return;
            reject(AxiosError$1.from(err, null, config, lastRequest));
          });

          responseStream.on('end', function handleStreamEnd() {
            try {
              let responseData =
                responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
              if (responseType !== 'arraybuffer') {
                responseData = responseData.toString(responseEncoding);
                if (!responseEncoding || responseEncoding === 'utf8') {
                  responseData = utils$1.stripBOM(responseData);
                }
              }
              response.data = responseData;
            } catch (err) {
              return reject(AxiosError$1.from(err, null, config, response.request, response));
            }
            settle(resolve, reject, response);
          });
        }

        abortEmitter.once('abort', (err) => {
          if (!responseStream.destroyed) {
            responseStream.emit('error', err);
            responseStream.destroy();
          }
        });
      });

      abortEmitter.once('abort', (err) => {
        if (req.close) {
          req.close();
        } else {
          req.destroy(err);
        }
      });

      // Handle errors
      req.on('error', function handleRequestError(err) {
        reject(AxiosError$1.from(err, null, config, req));
      });

      // set tcp keep alive to prevent drop connection by peer
      req.on('socket', function handleRequestSocket(socket) {
        // default interval of sending ack packet is 1 minute
        socket.setKeepAlive(true, 1000 * 60);
      });

      // Handle request timeout
      if (config.timeout) {
        // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
        const timeout = parseInt(config.timeout, 10);

        if (Number.isNaN(timeout)) {
          abort(
            new AxiosError$1(
              'error trying to parse `config.timeout` to int',
              AxiosError$1.ERR_BAD_OPTION_VALUE,
              config,
              req
            )
          );

          return;
        }

        // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
        // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
        // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
        // And then these socket which be hang up will devouring CPU little by little.
        // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
        req.setTimeout(timeout, function handleRequestTimeout() {
          if (isDone) return;
          let timeoutErrorMessage = config.timeout
            ? 'timeout of ' + config.timeout + 'ms exceeded'
            : 'timeout exceeded';
          const transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          abort(
            new AxiosError$1(
              timeoutErrorMessage,
              transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
              config,
              req
            )
          );
        });
      } else {
        // explicitly reset the socket timeout value for a possible `keep-alive` request
        req.setTimeout(0);
      }

      // Send the request
      if (utils$1.isStream(data)) {
        let ended = false;
        let errored = false;

        data.on('end', () => {
          ended = true;
        });

        data.once('error', (err) => {
          errored = true;
          req.destroy(err);
        });

        data.on('close', () => {
          if (!ended && !errored) {
            abort(new CanceledError$1('Request stream has been aborted', config, req));
          }
        });

        data.pipe(req);
      } else {
        data && req.write(data);
        req.end();
      }
    });
  };

var isURLSameOrigin = platform.hasStandardBrowserEnv
  ? ((origin, isMSIE) => (url) => {
      url = new URL(url, platform.origin);

      return (
        origin.protocol === url.protocol &&
        origin.host === url.host &&
        (isMSIE || origin.port === url.port)
      );
    })(
      new URL(platform.origin),
      platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
    )
  : () => true;

var cookies = platform.hasStandardBrowserEnv
  ? // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure, sameSite) {
        if (typeof document === 'undefined') return;

        const cookie = [`${name}=${encodeURIComponent(value)}`];

        if (utils$1.isNumber(expires)) {
          cookie.push(`expires=${new Date(expires).toUTCString()}`);
        }
        if (utils$1.isString(path)) {
          cookie.push(`path=${path}`);
        }
        if (utils$1.isString(domain)) {
          cookie.push(`domain=${domain}`);
        }
        if (secure === true) {
          cookie.push('secure');
        }
        if (utils$1.isString(sameSite)) {
          cookie.push(`SameSite=${sameSite}`);
        }

        document.cookie = cookie.join('; ');
      },

      read(name) {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
      },

      remove(name) {
        this.write(name, '', Date.now() - 86400000, '/');
      },
    }
  : // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {},
      read() {
        return null;
      },
      remove() {},
    };

const headersToObject = (thing) => (thing instanceof AxiosHeaders$1 ? { ...thing } : thing);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig$1(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({ caseless }, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, prop, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) =>
      mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true),
  };

  utils$1.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
    if (prop === '__proto__' || prop === 'constructor' || prop === 'prototype') return;
    const merge = utils$1.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

var resolveConfig = (config) => {
  const newConfig = mergeConfig$1({}, config);

  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(
    buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls),
    config.params,
    config.paramsSerializer
  );

  // HTTP basic authentication
  if (auth) {
    headers.set(
      'Authorization',
      'Basic ' +
        btoa(
          (auth.username || '') +
            ':' +
            (auth.password ? unescape(encodeURIComponent(auth.password)) : '')
        )
    );
  }

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // browser handles it
    } else if (utils$1.isFunction(data.getHeaders)) {
      // Node.js FormData (like form-data package)
      const formHeaders = data.getHeaders();
      // Only set safe headers to avoid overwriting security headers
      const allowedHeaders = ['content-type', 'content-length'];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported &&
  function (config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;

      function done() {
        flushUpload && flushUpload(); // flush events
        flushDownload && flushDownload(); // flush events

        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

        _config.signal && _config.signal.removeEventListener('abort', onCanceled);
      }

      let request = new XMLHttpRequest();

      request.open(_config.method.toUpperCase(), _config.url, true);

      // Set the request timeout in MS
      request.timeout = _config.timeout;

      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        const responseHeaders = AxiosHeaders$1.from(
          'getAllResponseHeaders' in request && request.getAllResponseHeaders()
        );
        const responseData =
          !responseType || responseType === 'text' || responseType === 'json'
            ? request.responseText
            : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request,
        };

        settle(
          function _resolve(value) {
            resolve(value);
            done();
          },
          function _reject(err) {
            reject(err);
            done();
          },
          response
        );

        // Clean up request
        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (
            request.status === 0 &&
            !(request.responseURL && request.responseURL.indexOf('file:') === 0)
          ) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(new AxiosError$1('Request aborted', AxiosError$1.ECONNABORTED, config, request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError(event) {
        // Browsers deliver a ProgressEvent in XHR onerror
        // (message may be empty; when present, surface it)
        // See https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/error_event
        const msg = event && event.message ? event.message : 'Network Error';
        const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config, request);
        // attach the underlying event for consumers who want details
        err.event = event || null;
        reject(err);
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout
          ? 'timeout of ' + _config.timeout + 'ms exceeded'
          : 'timeout exceeded';
        const transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(
          new AxiosError$1(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
            config,
            request
          )
        );

        // Clean up request
        request = null;
      };

      // Remove Content-Type if data is undefined
      requestData === undefined && requestHeaders.setContentType(null);

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }

      // Add withCredentials to request if needed
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = _config.responseType;
      }

      // Handle progress if needed
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener('progress', downloadThrottled);
      }

      // Not all browsers support upload events
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);

        request.upload.addEventListener('progress', uploadThrottled);

        request.upload.addEventListener('loadend', flushUpload);
      }

      if (_config.cancelToken || _config.signal) {
        // Handle cancellation
        // eslint-disable-next-line func-names
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
          request.abort();
          request = null;
        };

        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted
            ? onCanceled()
            : _config.signal.addEventListener('abort', onCanceled);
        }
      }

      const protocol = parseProtocol(_config.url);

      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(
          new AxiosError$1(
            'Unsupported protocol ' + protocol + ':',
            AxiosError$1.ERR_BAD_REQUEST,
            config
          )
        );
        return;
      }

      // Send the request
      request.send(requestData || null);
    });
  };

const composeSignals = (signals, timeout) => {
  const { length } = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(
          err instanceof AxiosError$1
            ? err
            : new CanceledError$1(err instanceof Error ? err.message : err)
        );
      }
    };

    let timer =
      timeout &&
      setTimeout(() => {
        timer = null;
        onabort(new AxiosError$1(`timeout of ${timeout}ms exceeded`, AxiosError$1.ETIMEDOUT));
      }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal) => {
          signal.unsubscribe
            ? signal.unsubscribe(onabort)
            : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const { signal } = controller;

    signal.unsubscribe = () => utils$1.asap(unsubscribe);

    return signal;
  }
};

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream(
    {
      async pull(controller) {
        try {
          const { done, value } = await iterator.next();

          if (done) {
            _onFinish();
            controller.close();
            return;
          }

          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = (bytes += len);
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator.return();
      },
    },
    {
      highWaterMark: 2,
    }
  );
};

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const { isFunction } = utils$1;

const globalFetchAPI = (({ Request, Response }) => ({
  Request,
  Response,
}))(utils$1.global);

const { ReadableStream: ReadableStream$1, TextEncoder: TextEncoder$1 } = utils$1.global;

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};

const factory = (env) => {
  env = utils$1.merge.call(
    {
      skipUndefined: true,
    },
    globalFetchAPI,
    env
  );

  const { fetch: envFetch, Request, Response } = env;
  const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === 'function';
  const isRequestSupported = isFunction(Request);
  const isResponseSupported = isFunction(Response);

  if (!isFetchSupported) {
    return false;
  }

  const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);

  const encodeText =
    isFetchSupported &&
    (typeof TextEncoder$1 === 'function'
      ? (
          (encoder) => (str) =>
            encoder.encode(str)
        )(new TextEncoder$1())
      : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));

  const supportsRequestStream =
    isRequestSupported &&
    isReadableStreamSupported &&
    test(() => {
      let duplexAccessed = false;

      const body = new ReadableStream$1();

      const hasContentType = new Request(platform.origin, {
        body,
        method: 'POST',
        get duplex() {
          duplexAccessed = true;
          return 'half';
        },
      }).headers.has('Content-Type');

      body.cancel();

      return duplexAccessed && !hasContentType;
    });

  const supportsResponseStream =
    isResponseSupported &&
    isReadableStreamSupported &&
    test(() => utils$1.isReadableStream(new Response('').body));

  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body),
  };

  isFetchSupported &&
    (() => {
      ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach((type) => {
        !resolvers[type] &&
          (resolvers[type] = (res, config) => {
            let method = res && res[type];

            if (method) {
              return method.call(res);
            }

            throw new AxiosError$1(
              `Response type '${type}' is not supported`,
              AxiosError$1.ERR_NOT_SUPPORT,
              config
            );
          });
      });
    })();

  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }

    if (utils$1.isBlob(body)) {
      return body.size;
    }

    if (utils$1.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: 'POST',
        body,
      });
      return (await _request.arrayBuffer()).byteLength;
    }

    if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
      return body.byteLength;
    }

    if (utils$1.isURLSearchParams(body)) {
      body = body + '';
    }

    if (utils$1.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };

  const resolveBodyLength = async (headers, body) => {
    const length = utils$1.toFiniteNumber(headers.getContentLength());

    return length == null ? getBodyLength(body) : length;
  };

  return async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = 'same-origin',
      fetchOptions,
    } = resolveConfig(config);

    let _fetch = envFetch || fetch;

    responseType = responseType ? (responseType + '').toLowerCase() : 'text';

    let composedSignal = composeSignals(
      [signal, cancelToken && cancelToken.toAbortSignal()],
      timeout
    );

    let request = null;

    const unsubscribe =
      composedSignal &&
      composedSignal.unsubscribe &&
      (() => {
        composedSignal.unsubscribe();
      });

    let requestContentLength;

    try {
      if (
        onUploadProgress &&
        supportsRequestStream &&
        method !== 'get' &&
        method !== 'head' &&
        (requestContentLength = await resolveBodyLength(headers, data)) !== 0
      ) {
        let _request = new Request(url, {
          method: 'POST',
          body: data,
          duplex: 'half',
        });

        let contentTypeHeader;

        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
          headers.setContentType(contentTypeHeader);
        }

        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );

          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }

      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? 'include' : 'omit';
      }

      // Cloudflare Workers throws when credentials are defined
      // see https://github.com/cloudflare/workerd/issues/902
      const isCredentialsSupported = isRequestSupported && 'credentials' in Request.prototype;

      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: 'half',
        credentials: isCredentialsSupported ? withCredentials : undefined,
      };

      request = isRequestSupported && new Request(url, resolvedOptions);

      let response = await (isRequestSupported
        ? _fetch(request, fetchOptions)
        : _fetch(url, resolvedOptions));

      const isStreamResponse =
        supportsResponseStream && (responseType === 'stream' || responseType === 'response');

      if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
        const options = {};

        ['status', 'statusText', 'headers'].forEach((prop) => {
          options[prop] = response[prop];
        });

        const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

        const [onProgress, flush] =
          (onDownloadProgress &&
            progressEventDecorator(
              responseContentLength,
              progressEventReducer(asyncDecorator(onDownloadProgress), true)
            )) ||
          [];

        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }

      responseType = responseType || 'text';

      let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](
        response,
        config
      );

      !isStreamResponse && unsubscribe && unsubscribe();

      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders$1.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request,
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();

      if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError$1(
            'Network Error',
            AxiosError$1.ERR_NETWORK,
            config,
            request,
            err && err.response
          ),
          {
            cause: err.cause || err,
          }
        );
      }

      throw AxiosError$1.from(err, err && err.code, config, request, err && err.response);
    }
  };
};

const seedCache = new Map();

const getFetch = (config) => {
  let env = (config && config.env) || {};
  const { fetch, Request, Response } = env;
  const seeds = [Request, Response, fetch];

  let len = seeds.length,
    i = len,
    seed,
    target,
    map = seedCache;

  while (i--) {
    seed = seeds[i];
    target = map.get(seed);

    target === undefined && map.set(seed, (target = i ? new Map() : factory(env)));

    map = target;
  }

  return target;
};

getFetch();

/**
 * Known adapters mapping.
 * Provides environment-specific adapters for Axios:
 * - `http` for Node.js
 * - `xhr` for browsers
 * - `fetch` for fetch API-based requests
 *
 * @type {Object<string, Function|Object>}
 */
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: {
    get: getFetch,
  },
};

// Assign adapter names for easier debugging and identification
utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', { value });
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', { value });
  }
});

/**
 * Render a rejection reason string for unknown or unsupported adapters
 *
 * @param {string} reason
 * @returns {string}
 */
const renderReason = (reason) => `- ${reason}`;

/**
 * Check if the adapter is resolved (function, null, or false)
 *
 * @param {Function|null|false} adapter
 * @returns {boolean}
 */
const isResolvedHandle = (adapter) =>
  utils$1.isFunction(adapter) || adapter === null || adapter === false;

/**
 * Get the first suitable adapter from the provided list.
 * Tries each adapter in order until a supported one is found.
 * Throws an AxiosError if no adapter is suitable.
 *
 * @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
 * @param {Object} config - Axios request configuration
 * @throws {AxiosError} If no suitable adapter is available
 * @returns {Function} The resolved adapter function
 */
function getAdapter$1(adapters, config) {
  adapters = utils$1.isArray(adapters) ? adapters : [adapters];

  const { length } = adapters;
  let nameOrAdapter;
  let adapter;

  const rejectedReasons = {};

  for (let i = 0; i < length; i++) {
    nameOrAdapter = adapters[i];
    let id;

    adapter = nameOrAdapter;

    if (!isResolvedHandle(nameOrAdapter)) {
      adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

      if (adapter === undefined) {
        throw new AxiosError$1(`Unknown adapter '${id}'`);
      }
    }

    if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
      break;
    }

    rejectedReasons[id || '#' + i] = adapter;
  }

  if (!adapter) {
    const reasons = Object.entries(rejectedReasons).map(
      ([id, state]) =>
        `adapter ${id} ` +
        (state === false ? 'is not supported by the environment' : 'is not available in the build')
    );

    let s = length
      ? reasons.length > 1
        ? 'since :\n' + reasons.map(renderReason).join('\n')
        : ' ' + renderReason(reasons[0])
      : 'as no adapter specified';

    throw new AxiosError$1(
      `There is no suitable adapter to dispatch the request ` + s,
      'ERR_NOT_SUPPORT'
    );
  }

  return adapter;
}

/**
 * Exports Axios adapters and utility to resolve an adapter
 */
var adapters = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: getAdapter$1,

  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: knownAdapters,
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(config, config.transformRequest);

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults.adapter, config);

  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(config, config.transformResponse, response);

      response.headers = AxiosHeaders$1.from(response.headers);

      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }

      return Promise.reject(reason);
    }
  );
}

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return (
      '[Axios v' +
      VERSION$1 +
      "] Transitional option '" +
      opt +
      "'" +
      desc +
      (message ? '. ' + message : '')
    );
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError$1(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError$1.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError$1('options must be an object', AxiosError$1.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError$1(
          'option ' + opt + ' must be ' + result,
          AxiosError$1.ERR_BAD_OPTION_VALUE
        );
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError$1('Unknown option ' + opt, AxiosError$1.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1,
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
let Axios$1 = class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig$1(this.defaults, config);

    const { transitional, paramsSerializer, headers } = config;

    if (transitional !== undefined) {
      validator.assertOptions(
        transitional,
        {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean),
          legacyInterceptorReqResOrdering: validators.transitional(validators.boolean),
        },
        false
      );
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer,
        };
      } else {
        validator.assertOptions(
          paramsSerializer,
          {
            encode: validators.function,
            serialize: validators.function,
          },
          true
        );
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(
      config,
      {
        baseUrl: validators.spelling('baseURL'),
        withXsrfToken: validators.spelling('withXSRFToken'),
      },
      true
    );

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(headers.common, headers[config.method]);

    headers &&
      utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], (method) => {
        delete headers[method];
      });

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      const transitional = config.transitional || transitionalDefaults;
      const legacyInterceptorReqResOrdering =
        transitional && transitional.legacyInterceptorReqResOrdering;

      if (legacyInterceptorReqResOrdering) {
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      } else {
        requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      }
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function (url, config) {
    return this.request(
      mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data,
      })
    );
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(
        mergeConfig$1(config || {}, {
          method,
          headers: isForm
            ? {
                'Content-Type': 'multipart/form-data',
              }
            : {},
          url,
          data,
        })
      );
    };
  }

  Axios$1.prototype[method] = generateHTTPMethod();

  Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
let CancelToken$1 = class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then((cancel) => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = (onfulfilled) => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError$1(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel,
    };
  }
};

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  const args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread$1(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError$1(payload) {
  return utils$1.isObject(payload) && payload.isAxiosError === true;
}

const HttpStatusCode$1 = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526,
};

Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
  HttpStatusCode$1[value] = key;
});

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });

  // Copy context to instance
  utils$1.extend(instance, context, null, { allOwnKeys: true });

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError$1;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel$1;
axios.VERSION = VERSION$1;
axios.toFormData = toFormData$1;

// Expose AxiosError class
axios.AxiosError = AxiosError$1;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread$1;

// Expose isAxiosError
axios.isAxiosError = isAxiosError$1;

// Expose mergeConfig
axios.mergeConfig = mergeConfig$1;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig,
} = axios;

var dist$1 = {};

var dist = {};

var helpers = {};

var hasRequiredHelpers;

function requireHelpers () {
	if (hasRequiredHelpers) return helpers;
	hasRequiredHelpers = 1;
	var __createBinding = (helpers && helpers.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (helpers && helpers.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (helpers && helpers.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(helpers, "__esModule", { value: true });
	helpers.req = helpers.json = helpers.toBuffer = void 0;
	const http = __importStar(http__default);
	const https = __importStar(require$$2);
	async function toBuffer(stream) {
	    let length = 0;
	    const chunks = [];
	    for await (const chunk of stream) {
	        length += chunk.length;
	        chunks.push(chunk);
	    }
	    return Buffer.concat(chunks, length);
	}
	helpers.toBuffer = toBuffer;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async function json(stream) {
	    const buf = await toBuffer(stream);
	    const str = buf.toString('utf8');
	    try {
	        return JSON.parse(str);
	    }
	    catch (_err) {
	        const err = _err;
	        err.message += ` (input: ${str})`;
	        throw err;
	    }
	}
	helpers.json = json;
	function req(url, opts = {}) {
	    const href = typeof url === 'string' ? url : url.href;
	    const req = (href.startsWith('https:') ? https : http).request(url, opts);
	    const promise = new Promise((resolve, reject) => {
	        req
	            .once('response', resolve)
	            .once('error', reject)
	            .end();
	    });
	    req.then = promise.then.bind(promise);
	    return req;
	}
	helpers.req = req;
	
	return helpers;
}

var hasRequiredDist$1;

function requireDist$1 () {
	if (hasRequiredDist$1) return dist;
	hasRequiredDist$1 = 1;
	(function (exports$1) {
		var __createBinding = (dist && dist.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (dist && dist.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (dist && dist.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __exportStar = (dist && dist.__exportStar) || function(m, exports$1) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
		};
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.Agent = void 0;
		const net = __importStar(require$$0__default);
		const http = __importStar(http__default);
		const https_1 = require$$2;
		__exportStar(requireHelpers(), exports$1);
		const INTERNAL = Symbol('AgentBaseInternalState');
		class Agent extends http.Agent {
		    constructor(opts) {
		        super(opts);
		        this[INTERNAL] = {};
		    }
		    /**
		     * Determine whether this is an `http` or `https` request.
		     */
		    isSecureEndpoint(options) {
		        if (options) {
		            // First check the `secureEndpoint` property explicitly, since this
		            // means that a parent `Agent` is "passing through" to this instance.
		            // eslint-disable-next-line @typescript-eslint/no-explicit-any
		            if (typeof options.secureEndpoint === 'boolean') {
		                return options.secureEndpoint;
		            }
		            // If no explicit `secure` endpoint, check if `protocol` property is
		            // set. This will usually be the case since using a full string URL
		            // or `URL` instance should be the most common usage.
		            if (typeof options.protocol === 'string') {
		                return options.protocol === 'https:';
		            }
		        }
		        // Finally, if no `protocol` property was set, then fall back to
		        // checking the stack trace of the current call stack, and try to
		        // detect the "https" module.
		        const { stack } = new Error();
		        if (typeof stack !== 'string')
		            return false;
		        return stack
		            .split('\n')
		            .some((l) => l.indexOf('(https.js:') !== -1 ||
		            l.indexOf('node:https:') !== -1);
		    }
		    // In order to support async signatures in `connect()` and Node's native
		    // connection pooling in `http.Agent`, the array of sockets for each origin
		    // has to be updated synchronously. This is so the length of the array is
		    // accurate when `addRequest()` is next called. We achieve this by creating a
		    // fake socket and adding it to `sockets[origin]` and incrementing
		    // `totalSocketCount`.
		    incrementSockets(name) {
		        // If `maxSockets` and `maxTotalSockets` are both Infinity then there is no
		        // need to create a fake socket because Node.js native connection pooling
		        // will never be invoked.
		        if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
		            return null;
		        }
		        // All instances of `sockets` are expected TypeScript errors. The
		        // alternative is to add it as a private property of this class but that
		        // will break TypeScript subclassing.
		        if (!this.sockets[name]) {
		            // @ts-expect-error `sockets` is readonly in `@types/node`
		            this.sockets[name] = [];
		        }
		        const fakeSocket = new net.Socket({ writable: false });
		        this.sockets[name].push(fakeSocket);
		        // @ts-expect-error `totalSocketCount` isn't defined in `@types/node`
		        this.totalSocketCount++;
		        return fakeSocket;
		    }
		    decrementSockets(name, socket) {
		        if (!this.sockets[name] || socket === null) {
		            return;
		        }
		        const sockets = this.sockets[name];
		        const index = sockets.indexOf(socket);
		        if (index !== -1) {
		            sockets.splice(index, 1);
		            // @ts-expect-error  `totalSocketCount` isn't defined in `@types/node`
		            this.totalSocketCount--;
		            if (sockets.length === 0) {
		                // @ts-expect-error `sockets` is readonly in `@types/node`
		                delete this.sockets[name];
		            }
		        }
		    }
		    // In order to properly update the socket pool, we need to call `getName()` on
		    // the core `https.Agent` if it is a secureEndpoint.
		    getName(options) {
		        const secureEndpoint = this.isSecureEndpoint(options);
		        if (secureEndpoint) {
		            // @ts-expect-error `getName()` isn't defined in `@types/node`
		            return https_1.Agent.prototype.getName.call(this, options);
		        }
		        // @ts-expect-error `getName()` isn't defined in `@types/node`
		        return super.getName(options);
		    }
		    createSocket(req, options, cb) {
		        const connectOpts = {
		            ...options,
		            secureEndpoint: this.isSecureEndpoint(options),
		        };
		        const name = this.getName(connectOpts);
		        const fakeSocket = this.incrementSockets(name);
		        Promise.resolve()
		            .then(() => this.connect(req, connectOpts))
		            .then((socket) => {
		            this.decrementSockets(name, fakeSocket);
		            if (socket instanceof http.Agent) {
		                try {
		                    // @ts-expect-error `addRequest()` isn't defined in `@types/node`
		                    return socket.addRequest(req, connectOpts);
		                }
		                catch (err) {
		                    return cb(err);
		                }
		            }
		            this[INTERNAL].currentSocket = socket;
		            // @ts-expect-error `createSocket()` isn't defined in `@types/node`
		            super.createSocket(req, options, cb);
		        }, (err) => {
		            this.decrementSockets(name, fakeSocket);
		            cb(err);
		        });
		    }
		    createConnection() {
		        const socket = this[INTERNAL].currentSocket;
		        this[INTERNAL].currentSocket = undefined;
		        if (!socket) {
		            throw new Error('No socket was returned in the `connect()` function');
		        }
		        return socket;
		    }
		    get defaultPort() {
		        return (this[INTERNAL].defaultPort ??
		            (this.protocol === 'https:' ? 443 : 80));
		    }
		    set defaultPort(v) {
		        if (this[INTERNAL]) {
		            this[INTERNAL].defaultPort = v;
		        }
		    }
		    get protocol() {
		        return (this[INTERNAL].protocol ??
		            (this.isSecureEndpoint() ? 'https:' : 'http:'));
		    }
		    set protocol(v) {
		        if (this[INTERNAL]) {
		            this[INTERNAL].protocol = v;
		        }
		    }
		}
		exports$1.Agent = Agent;
		
	} (dist));
	return dist;
}

var parseProxyResponse = {};

var hasRequiredParseProxyResponse;

function requireParseProxyResponse () {
	if (hasRequiredParseProxyResponse) return parseProxyResponse;
	hasRequiredParseProxyResponse = 1;
	var __importDefault = (parseProxyResponse && parseProxyResponse.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(parseProxyResponse, "__esModule", { value: true });
	parseProxyResponse.parseProxyResponse = void 0;
	const debug_1 = __importDefault(requireSrc());
	const debug = (0, debug_1.default)('https-proxy-agent:parse-proxy-response');
	function parseProxyResponse$1(socket) {
	    return new Promise((resolve, reject) => {
	        // we need to buffer any HTTP traffic that happens with the proxy before we get
	        // the CONNECT response, so that if the response is anything other than an "200"
	        // response code, then we can re-play the "data" events on the socket once the
	        // HTTP parser is hooked up...
	        let buffersLength = 0;
	        const buffers = [];
	        function read() {
	            const b = socket.read();
	            if (b)
	                ondata(b);
	            else
	                socket.once('readable', read);
	        }
	        function cleanup() {
	            socket.removeListener('end', onend);
	            socket.removeListener('error', onerror);
	            socket.removeListener('readable', read);
	        }
	        function onend() {
	            cleanup();
	            debug('onend');
	            reject(new Error('Proxy connection ended before receiving CONNECT response'));
	        }
	        function onerror(err) {
	            cleanup();
	            debug('onerror %o', err);
	            reject(err);
	        }
	        function ondata(b) {
	            buffers.push(b);
	            buffersLength += b.length;
	            const buffered = Buffer.concat(buffers, buffersLength);
	            const endOfHeaders = buffered.indexOf('\r\n\r\n');
	            if (endOfHeaders === -1) {
	                // keep buffering
	                debug('have not received end of HTTP headers yet...');
	                read();
	                return;
	            }
	            const headerParts = buffered
	                .slice(0, endOfHeaders)
	                .toString('ascii')
	                .split('\r\n');
	            const firstLine = headerParts.shift();
	            if (!firstLine) {
	                socket.destroy();
	                return reject(new Error('No header received from proxy CONNECT response'));
	            }
	            const firstLineParts = firstLine.split(' ');
	            const statusCode = +firstLineParts[1];
	            const statusText = firstLineParts.slice(2).join(' ');
	            const headers = {};
	            for (const header of headerParts) {
	                if (!header)
	                    continue;
	                const firstColon = header.indexOf(':');
	                if (firstColon === -1) {
	                    socket.destroy();
	                    return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
	                }
	                const key = header.slice(0, firstColon).toLowerCase();
	                const value = header.slice(firstColon + 1).trimStart();
	                const current = headers[key];
	                if (typeof current === 'string') {
	                    headers[key] = [current, value];
	                }
	                else if (Array.isArray(current)) {
	                    current.push(value);
	                }
	                else {
	                    headers[key] = value;
	                }
	            }
	            debug('got proxy server response: %o %o', firstLine, headers);
	            cleanup();
	            resolve({
	                connect: {
	                    statusCode,
	                    statusText,
	                    headers,
	                },
	                buffered,
	            });
	        }
	        socket.on('error', onerror);
	        socket.on('end', onend);
	        read();
	    });
	}
	parseProxyResponse.parseProxyResponse = parseProxyResponse$1;
	
	return parseProxyResponse;
}

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist$1;
	hasRequiredDist = 1;
	var __createBinding = (dist$1 && dist$1.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (dist$1 && dist$1.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (dist$1 && dist$1.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __importDefault = (dist$1 && dist$1.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(dist$1, "__esModule", { value: true });
	dist$1.HttpsProxyAgent = void 0;
	const net = __importStar(require$$0__default);
	const tls = __importStar(require$$1$2);
	const assert_1 = __importDefault(require$$4);
	const debug_1 = __importDefault(requireSrc());
	const agent_base_1 = requireDist$1();
	const url_1 = require$$5;
	const parse_proxy_response_1 = requireParseProxyResponse();
	const debug = (0, debug_1.default)('https-proxy-agent');
	const setServernameFromNonIpHost = (options) => {
	    if (options.servername === undefined &&
	        options.host &&
	        !net.isIP(options.host)) {
	        return {
	            ...options,
	            servername: options.host,
	        };
	    }
	    return options;
	};
	/**
	 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
	 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
	 *
	 * Outgoing HTTP requests are first tunneled through the proxy server using the
	 * `CONNECT` HTTP request method to establish a connection to the proxy server,
	 * and then the proxy server connects to the destination target and issues the
	 * HTTP request from the proxy server.
	 *
	 * `https:` requests have their socket connection upgraded to TLS once
	 * the connection to the proxy server has been established.
	 */
	class HttpsProxyAgent extends agent_base_1.Agent {
	    constructor(proxy, opts) {
	        super(opts);
	        this.options = { path: undefined };
	        this.proxy = typeof proxy === 'string' ? new url_1.URL(proxy) : proxy;
	        this.proxyHeaders = opts?.headers ?? {};
	        debug('Creating new HttpsProxyAgent instance: %o', this.proxy.href);
	        // Trim off the brackets from IPv6 addresses
	        const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, '');
	        const port = this.proxy.port
	            ? parseInt(this.proxy.port, 10)
	            : this.proxy.protocol === 'https:'
	                ? 443
	                : 80;
	        this.connectOpts = {
	            // Attempt to negotiate http/1.1 for proxy servers that support http/2
	            ALPNProtocols: ['http/1.1'],
	            ...(opts ? omit(opts, 'headers') : null),
	            host,
	            port,
	        };
	    }
	    /**
	     * Called when the node-core HTTP client library is creating a
	     * new HTTP request.
	     */
	    async connect(req, opts) {
	        const { proxy } = this;
	        if (!opts.host) {
	            throw new TypeError('No "host" provided');
	        }
	        // Create a socket connection to the proxy server.
	        let socket;
	        if (proxy.protocol === 'https:') {
	            debug('Creating `tls.Socket`: %o', this.connectOpts);
	            socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
	        }
	        else {
	            debug('Creating `net.Socket`: %o', this.connectOpts);
	            socket = net.connect(this.connectOpts);
	        }
	        const headers = typeof this.proxyHeaders === 'function'
	            ? this.proxyHeaders()
	            : { ...this.proxyHeaders };
	        const host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
	        let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r\n`;
	        // Inject the `Proxy-Authorization` header if necessary.
	        if (proxy.username || proxy.password) {
	            const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
	            headers['Proxy-Authorization'] = `Basic ${Buffer.from(auth).toString('base64')}`;
	        }
	        headers.Host = `${host}:${opts.port}`;
	        if (!headers['Proxy-Connection']) {
	            headers['Proxy-Connection'] = this.keepAlive
	                ? 'Keep-Alive'
	                : 'close';
	        }
	        for (const name of Object.keys(headers)) {
	            payload += `${name}: ${headers[name]}\r\n`;
	        }
	        const proxyResponsePromise = (0, parse_proxy_response_1.parseProxyResponse)(socket);
	        socket.write(`${payload}\r\n`);
	        const { connect, buffered } = await proxyResponsePromise;
	        req.emit('proxyConnect', connect);
	        this.emit('proxyConnect', connect, req);
	        if (connect.statusCode === 200) {
	            req.once('socket', resume);
	            if (opts.secureEndpoint) {
	                // The proxy is connecting to a TLS server, so upgrade
	                // this socket connection to a TLS connection.
	                debug('Upgrading socket connection to TLS');
	                return tls.connect({
	                    ...omit(setServernameFromNonIpHost(opts), 'host', 'path', 'port'),
	                    socket,
	                });
	            }
	            return socket;
	        }
	        // Some other status code that's not 200... need to re-play the HTTP
	        // header "data" events onto the socket once the HTTP machinery is
	        // attached so that the node core `http` can parse and handle the
	        // error status code.
	        // Close the original socket, and a new "fake" socket is returned
	        // instead, so that the proxy doesn't get the HTTP request
	        // written to it (which may contain `Authorization` headers or other
	        // sensitive data).
	        //
	        // See: https://hackerone.com/reports/541502
	        socket.destroy();
	        const fakeSocket = new net.Socket({ writable: false });
	        fakeSocket.readable = true;
	        // Need to wait for the "socket" event to re-play the "data" events.
	        req.once('socket', (s) => {
	            debug('Replaying proxy buffer for failed request');
	            (0, assert_1.default)(s.listenerCount('data') > 0);
	            // Replay the "buffered" Buffer onto the fake `socket`, since at
	            // this point the HTTP module machinery has been hooked up for
	            // the user.
	            s.push(buffered);
	            s.push(null);
	        });
	        return fakeSocket;
	    }
	}
	HttpsProxyAgent.protocols = ['http', 'https'];
	dist$1.HttpsProxyAgent = HttpsProxyAgent;
	function resume(socket) {
	    socket.resume();
	}
	function omit(obj, ...keys) {
	    const ret = {};
	    let key;
	    for (key in obj) {
	        if (!keys.includes(key)) {
	            ret[key] = obj[key];
	        }
	    }
	    return ret;
	}
	
	return dist$1;
}

var distExports = requireDist();

// IP geolocation API utilities (ip-api.com)
// Lazy getters — env vars injected by Doppler at runtime
function getIpApiKey() {
    return process.env.IP_API_KEY;
}
function useProApi() {
    return !!getIpApiKey();
}
function getIpApiBase() {
    return useProApi() ? 'https://pro.ip-api.com' : 'http://ip-api.com';
}

// IP Geolocation Service
// Looks up geographic info for proxy IPs using ip-api.com
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const IP_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const IPIFY_TIMEOUT_MS = 7000;
const FREE_API_RATE_LIMIT_MS = 1500; // ~40 req/min to stay under free tier 45/min limit
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class IPGeolocationService {
    cache = new Map();
    ipCache = new Map();
    lastRequestTime = 0; // For free API rate limiting
    // Get the actual exit IP by making a request through the proxy to ipify.org
    async getExitIP(proxy) {
        const cacheKey = `${proxy.host}:${proxy.port}`;
        // Check IP cache (shorter TTL since IPs can rotate)
        const cached = this.ipCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < IP_CACHE_TTL_MS) {
            return cached.ip;
        }
        try {
            // Build proxy URL for the agent
            const auth = proxy.username && proxy.password
                ? `${proxy.username}:${proxy.password}@`
                : '';
            const proxyUrl = `http://${auth}${proxy.host}:${proxy.port}`;
            const agent = new distExports.HttpsProxyAgent(proxyUrl);
            const { data } = await axios.get('https://api.ipify.org?format=json', {
                httpsAgent: agent,
                timeout: IPIFY_TIMEOUT_MS,
            });
            const ip = data.ip;
            if (ip) {
                this.ipCache.set(cacheKey, { ip, timestamp: Date.now() });
            }
            return ip || null;
        }
        catch (error) {
            console.error(`Failed to get exit IP through proxy:`, error);
            return null;
        }
    }
    // Check if proxy IP has changed compared to stored IP
    async hasIPChanged(proxy, storedIP) {
        const currentIP = await this.getExitIP(proxy);
        if (!currentIP) {
            return { changed: false, currentIP: null };
        }
        if (!storedIP) {
            return { changed: true, currentIP };
        }
        return { changed: currentIP !== storedIP, currentIP };
    }
    // Get geolocation by first getting the exit IP through the proxy
    async lookupThroughProxy(proxy) {
        const ip = await this.getExitIP(proxy);
        if (!ip)
            return null;
        const geo = await this.lookup(ip);
        if (!geo)
            return null;
        return { ip, geo };
    }
    // Lookup geolocation for an IP address
    async lookup(ip) {
        // Check cache first
        const cached = this.cache.get(ip);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
            return cached.data;
        }
        // Fetch from API
        const data = await this.fetchFromAPI(ip);
        if (data) {
            this.cache.set(ip, { data, timestamp: Date.now() });
        }
        return data;
    }
    // Fetch from ip-api.com (Uses Free API if the key isn't set)
    async fetchFromAPI(ip) {
        // Rate limit only for free API
        if (!useProApi()) {
            const elapsed = Date.now() - this.lastRequestTime;
            if (elapsed < FREE_API_RATE_LIMIT_MS) {
                await sleep(FREE_API_RATE_LIMIT_MS - elapsed);
            }
            this.lastRequestTime = Date.now();
        }
        try {
            // Build URL based on API tier
            const ipApiBase = getIpApiBase();
            const url = useProApi()
                ? `${ipApiBase}/json/${ip}?key=${getIpApiKey()}&fields=status,message,countryCode,timezone,lat,lon,city,region`
                : `${ipApiBase}/json/${ip}?fields=status,message,countryCode,timezone,lat,lon,city,region`;
            const { data } = await axios.get(url);
            if (data.status !== 'success') {
                console.warn(`Geo lookup failed for ${ip}: ${data.message || 'unknown error'}`);
                return null;
            }
            return {
                countryCode: data.countryCode,
                timezone: data.timezone,
                lat: data.lat,
                lon: data.lon,
                city: data.city,
                region: data.region,
            };
        }
        catch (error) {
            console.error(`Geo lookup error for ${ip}:`, error);
            return null;
        }
    }
    // Extract IP address from a proxy URL
    static extractIPFromProxy(proxyUrl) {
        if (!proxyUrl)
            return null;
        try {
            const url = new URL(proxyUrl);
            const host = url.hostname;
            // Check if it's an IPv4 address
            const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipv4Regex.test(host)) {
                return host;
            }
            // If it's a hostname (not an IP), return null
            // DNS resolution would be needed to get the IP
            return null;
        }
        catch {
            return null;
        }
    }
    // Clear the geolocation cache
    clearCache() {
        this.cache.clear();
    }
    // Clear the IP cache (forces fresh IP lookup on next call)
    clearIPCache() {
        this.ipCache.clear();
    }
    // Clear all caches
    clearAllCaches() {
        this.cache.clear();
        this.ipCache.clear();
    }
    // Get cache size (useful for debugging)
    getCacheSize() {
        return this.cache.size;
    }
    // Get IP cache size
    getIPCacheSize() {
        return this.ipCache.size;
    }
}
// Singleton instance for shared use
let geoServiceInstance = null;
function getGeoService() {
    if (!geoServiceInstance) {
        geoServiceInstance = new IPGeolocationService();
    }
    return geoServiceInstance;
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        '-' +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        '-' +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        '-' +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        '-' +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]).toLowerCase();
}

const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        randomFillSync(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, (poolPtr += 16));
}

var native = { randomUUID };

function v4(options, buf, offset) {
    if (native.randomUUID && true && !options) {
        return native.randomUUID();
    }
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? rng();
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    return unsafeStringify(rnds);
}

/**
 * Connection pool manager for multiple Roverfox servers
 */
class ConnectionPool {
    constructor(wsAPIKey, debug = false) {
        this.browsers = new Map(); // wsEndpoint -> Browser
        this.replayWebSockets = new Map(); // replayEndpoint -> WebSocket
        this.connectionLocks = new Map(); // wsEndpoint -> lock
        this.wsAPIKey = wsAPIKey;
        this.debug = debug;
    }
    /**
     * Sets the handler for streaming control messages
     */
    setStreamingMessageHandler(handler) {
        this.streamingMessageHandler = handler;
    }
    /**
     * Gets or creates a browser connection for the given endpoint
     */
    async getBrowserConnection(wsEndpoint, browserType = 'camoufox') {
        // Include browser type in the key so different types get separate connections
        const connectionKey = `${wsEndpoint}::${browserType}`;
        // Check if we already have a valid connection
        const existingBrowser = this.browsers.get(connectionKey);
        if (existingBrowser && existingBrowser.isConnected()) {
            if (this.debug)
                console.log(`[client] Reusing existing ${browserType} connection to ${wsEndpoint}`);
            return existingBrowser;
        }
        // Use per-endpoint lock to prevent concurrent connections to same server
        let lock = this.connectionLocks.get(connectionKey);
        if (!lock) {
            lock = this.connectToBrowser(wsEndpoint, browserType, connectionKey);
            this.connectionLocks.set(connectionKey, lock);
        }
        await lock;
        const browser = this.browsers.get(connectionKey);
        if (!browser) {
            throw new Error(`Failed to establish connection to ${wsEndpoint}`);
        }
        return browser;
    }
    /**
     * Connects to a browser server
     */
    async connectToBrowser(wsEndpoint, browserType, connectionKey) {
        if (this.debug)
            console.log(`[client] Connecting to ${browserType} browser server: ${wsEndpoint}`);
        // Append browser type as query parameter for worker-side routing
        const separator = wsEndpoint.includes('?') ? '&' : '?';
        const wsUrl = `${wsEndpoint}${separator}browser=${browserType}`;
        // Use the correct Playwright connector based on browser type
        const connector = browserType === 'brave' ? chromium : firefox;
        const browser = await connector.connect(wsUrl, {
            headers: {
                Authorization: `Bearer ${this.wsAPIKey}`,
            },
        });
        // Store the connection
        this.browsers.set(connectionKey, browser);
        // Set up disconnected event listener
        browser.on('disconnected', () => {
            if (this.debug)
                console.log(`[client] ${browserType} browser disconnected: ${wsEndpoint}`);
            this.browsers.delete(connectionKey);
            this.connectionLocks.delete(connectionKey);
        });
        // Clear the lock after successful connection
        this.connectionLocks.delete(connectionKey);
    }
    /**
     * Gets or creates a replay WebSocket connection
     */
    getReplayWebSocket(replayEndpoint) {
        // Check if we already have a connection
        let ws = this.replayWebSockets.get(replayEndpoint);
        // Reuse if OPEN or CONNECTING (avoid creating duplicate connections)
        if (ws &&
            (ws.readyState === WebSocket.OPEN ||
                ws.readyState === WebSocket.CONNECTING)) {
            if (this.debug)
                console.log(`[client] Reusing existing replay WebSocket: ${replayEndpoint} (state: ${ws.readyState})`);
            // Note: Message handler is already attached when WebSocket was created
            return ws;
        }
        // Create new WebSocket connection
        console.log(`[client] Creating new replay WebSocket: ${replayEndpoint}`);
        ws = new WebSocket(replayEndpoint);
        this.replayWebSockets.set(replayEndpoint, ws);
        ws.on('error', (err) => {
            console.error(`[connection-pool] WebSocket error:`, err);
        });
        // Set up message listener for streaming control
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (this.streamingMessageHandler) {
                    this.streamingMessageHandler(message);
                }
            }
            catch (error) {
                console.error(`[connection-pool] Failed to parse message:`, error);
            }
        });
        // Clean up on close
        ws.on('close', () => {
            if (this.debug)
                console.log(`[client] Replay WebSocket closed: ${replayEndpoint}`);
            this.replayWebSockets.delete(replayEndpoint);
        });
        return ws;
    }
    /**
     * Ensures a WebSocket is open before use
     */
    async ensureWsOpen(ws) {
        return new Promise((resolve, reject) => {
            if (ws.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }
            // WebSocket is CONNECTING, wait for open event
            const onOpen = () => {
                ws.removeEventListener('open', onOpen);
                ws.removeEventListener('error', onError);
                resolve();
            };
            const onError = (error) => {
                ws.removeEventListener('open', onOpen);
                ws.removeEventListener('error', onError);
                reject(new Error(`WebSocket connection failed: ${error.message || error}`));
            };
            ws.addEventListener('open', onOpen);
            ws.addEventListener('error', onError);
        });
    }
    /**
     * Safely sends a message through WebSocket after ensuring it's open
     */
    async safeSend(ws, message) {
        await this.ensureWsOpen(ws);
        ws.send(JSON.stringify(message));
    }
}

/**
 * DataUsageTracker - Tracks network data usage per browser context
 */
class DataUsageTracker {
    constructor(browserId, debug = false) {
        this.bytes = 0;
        this.requests = [];
        this.browserId = browserId;
        this.startTime = new Date();
        this.debug = debug;
    }
    /**
     * Attach network listeners to a page to track data usage
     */
    attachToPage(page) {
        // Track request sizes
        page.on('request', (request) => {
            const postData = request.postData();
            const requestSize = postData ? Buffer.from(postData).length : 0;
            // Store request data temporarily
            request._trackedRequestSize = requestSize;
        });
        // Track response sizes
        page.on('response', async (response) => {
            const request = response.request();
            const requestSize = request._trackedRequestSize || 0;
            let responseSize = 0;
            try {
                const body = await response.body();
                responseSize = body.length;
            }
            catch (_error) {
                // Some responses can't be read (e.g., 204 No Content)
                responseSize = 0;
            }
            const totalSize = requestSize + responseSize;
            this.bytes += totalSize;
            const logEntry = {
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType(),
                requestSize,
                responseSize,
                status: response.status(),
                timestamp: new Date(),
            };
            this.requests.push(logEntry);
            if (this.debug) {
                this.logToConsole(logEntry, totalSize);
            }
        });
        // Also track failed requests
        page.on('requestfailed', (request) => {
            const requestSize = request._trackedRequestSize || 0;
            this.bytes += requestSize;
            const logEntry = {
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType(),
                requestSize,
                responseSize: 0,
                status: null,
                timestamp: new Date(),
            };
            this.requests.push(logEntry);
            if (this.debug) {
                this.logToConsole(logEntry, requestSize);
            }
        });
    }
    /**
     * Log a single request to console in table format
     */
    logToConsole(entry, totalSize) {
        console.table([
            {
                Time: entry.timestamp.toISOString(),
                Method: entry.method,
                Status: entry.status || 'FAILED',
                Type: entry.resourceType,
                'Request (bytes)': entry.requestSize,
                'Response (bytes)': entry.responseSize,
                'Total (bytes)': totalSize,
                URL: entry.url.length > 60
                    ? entry.url.substring(0, 57) + '...'
                    : entry.url,
            },
        ]);
        console.log(`Cumulative usage: ${this.formatBytes(this.bytes)}\n`);
    }
    /**
     * Format bytes to human-readable string
     */
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
    /**
     * Get current usage data for saving to database
     */
    getUsageData() {
        return {
            browserId: this.browserId,
            timeStart: this.startTime.toISOString(),
            timeEnd: new Date().toISOString(),
            bytes: this.bytes,
        };
    }
    /**
     * Get all logged requests (for debugging/analysis)
     */
    getRequests() {
        return this.requests;
    }
    /**
     * Get total bytes transferred
     */
    getTotalBytes() {
        return this.bytes;
    }
}

// Hardcoded fallback fingerprints — used when the fingerprint pool is empty or unavailable.
// Selected from real Firefox and Brave fingerprints collected from actual users.
const FALLBACK_FINGERPRINTS = {
    mac: {
        camoufox: {
            navigatorPlatform: 'MacIntel',
            navigatorOscpu: 'Intel Mac OS X 10.15',
            hardwareConcurrency: 8,
            webglVendor: 'Intel Inc.',
            webglRenderer: 'Intel Iris OpenGL Engine',
            screenDimensions: { width: 2560, height: 1600, colorDepth: 24 },
            devicePixelRatio: 2,
            speechVoices: [],
        },
        brave: {
            navigatorPlatform: 'MacIntel',
            navigatorOscpu: 'Intel Mac OS X 10.15',
            hardwareConcurrency: 8,
            webglVendor: 'Intel Inc.',
            webglRenderer: 'Intel Iris OpenGL Engine',
            screenDimensions: { width: 2560, height: 1440, colorDepth: 24 },
            devicePixelRatio: 1,
            speechVoices: [
                'Samantha:en-US:local',
                'Aaron:en-US:local',
                'Albert:en-US:local',
                'Alice:it-IT:local',
                'Alva:sv-SE:local',
                'Amélie:fr-CA:local',
                'Amira:ms-MY:local',
                'Anna:de-DE:local',
                'Arthur:en-GB:local',
                'Bad News:en-US:local',
                'Bahh:en-US:local',
                'Bells:en-US:local',
                'Boing:en-US:local',
                'Bubbles:en-US:local',
                'Carmit:he-IL:local',
                'Catherine:en-AU:local',
                'Cellos:en-US:local',
                'Damayanti:id-ID:local',
                'Daniel (English (United Kingdom)):en-GB:local',
                'Daniel (French (France)):fr-FR:local',
                'Daria:bg-BG:local',
                'Eddy (German (Germany)):de-DE:local',
                'Eddy (English (United Kingdom)):en-GB:local',
                'Eddy (English (United States)):en-US:local',
                'Eddy (Spanish (Spain)):es-ES:local',
                'Eddy (Spanish (Mexico)):es-MX:local',
                'Eddy (Finnish (Finland)):fi-FI:local',
                'Eddy (French (Canada)):fr-CA:local',
                'Eddy (French (France)):fr-FR:local',
                'Eddy (Italian (Italy)):it-IT:local',
                'Eddy (Japanese (Japan)):ja-JP:local',
                'Eddy (Korean (South Korea)):ko-KR:local',
                'Eddy (Portuguese (Brazil)):pt-BR:local',
                'Eddy (Chinese (China mainland)):zh-CN:local',
                'Eddy (Chinese (Taiwan)):zh-TW:local',
                'Ellen:nl-BE:local',
                'Flo (German (Germany)):de-DE:local',
                'Flo (English (United Kingdom)):en-GB:local',
                'Flo (English (United States)):en-US:local',
                'Flo (Spanish (Spain)):es-ES:local',
                'Flo (Spanish (Mexico)):es-MX:local',
                'Flo (Finnish (Finland)):fi-FI:local',
                'Flo (French (Canada)):fr-CA:local',
                'Flo (French (France)):fr-FR:local',
                'Flo (Italian (Italy)):it-IT:local',
                'Flo (Japanese (Japan)):ja-JP:local',
                'Flo (Korean (South Korea)):ko-KR:local',
                'Flo (Portuguese (Brazil)):pt-BR:local',
                'Flo (Chinese (China mainland)):zh-CN:local',
                'Flo (Chinese (Taiwan)):zh-TW:local',
                'Fred:en-US:local',
                'Good News:en-US:local',
                'Gordon:en-AU:local',
                'Grandma (German (Germany)):de-DE:local',
                'Grandma (English (United Kingdom)):en-GB:local',
                'Grandma (English (United States)):en-US:local',
                'Grandma (Spanish (Spain)):es-ES:local',
                'Grandma (Spanish (Mexico)):es-MX:local',
                'Grandma (Finnish (Finland)):fi-FI:local',
                'Grandma (French (Canada)):fr-CA:local',
                'Grandma (French (France)):fr-FR:local',
                'Grandma (Italian (Italy)):it-IT:local',
                'Grandma (Japanese (Japan)):ja-JP:local',
                'Grandma (Korean (South Korea)):ko-KR:local',
                'Grandma (Portuguese (Brazil)):pt-BR:local',
                'Grandma (Chinese (China mainland)):zh-CN:local',
                'Grandma (Chinese (Taiwan)):zh-TW:local',
                'Grandpa (German (Germany)):de-DE:local',
                'Grandpa (English (United Kingdom)):en-GB:local',
                'Grandpa (English (United States)):en-US:local',
                'Grandpa (Spanish (Spain)):es-ES:local',
                'Grandpa (Spanish (Mexico)):es-MX:local',
                'Grandpa (Finnish (Finland)):fi-FI:local',
                'Grandpa (French (Canada)):fr-CA:local',
                'Grandpa (French (France)):fr-FR:local',
                'Grandpa (Italian (Italy)):it-IT:local',
                'Grandpa (Japanese (Japan)):ja-JP:local',
                'Grandpa (Korean (South Korea)):ko-KR:local',
                'Grandpa (Portuguese (Brazil)):pt-BR:local',
                'Grandpa (Chinese (China mainland)):zh-CN:local',
                'Grandpa (Chinese (Taiwan)):zh-TW:local',
                'Hattori:ja-JP:local',
                'Helena:de-DE:local',
                'Ioana:ro-RO:local',
                'Jacques:fr-FR:local',
                'Jester:en-US:local',
                'Joana:pt-PT:local',
                'Junior:en-US:local',
                'Kanya:th-TH:local',
                'Karen:en-AU:local',
                'Kathy:en-US:local',
                'Kyoko:ja-JP:local',
                'Lana:hr-HR:local',
                'Laura:sk-SK:local',
                'Lekha:hi-IN:local',
                'Lesya:uk-UA:local',
                'Li-Mu:zh-CN:local',
                'Linh:vi-VN:local',
                'Luciana:pt-BR:local',
                'Majed:ar-001:local',
                'Marie:fr-FR:local',
                'Martha:en-GB:local',
                'Martin:de-DE:local',
                'Meijia:zh-TW:local',
                'Melina:el-GR:local',
                'Milena:ru-RU:local',
                'Moira:en-IE:local',
                'Montse:ca-ES:local',
                'Mónica:es-ES:local',
                'Nicky:en-US:local',
                'Nora:nb-NO:local',
                'O-Ren:ja-JP:local',
                'Organ:en-US:local',
                'Paulina:es-MX:local',
                'Ralph:en-US:local',
                'Reed (German (Germany)):de-DE:local',
                'Reed (English (United Kingdom)):en-GB:local',
                'Reed (English (United States)):en-US:local',
                'Reed (Spanish (Spain)):es-ES:local',
                'Reed (Spanish (Mexico)):es-MX:local',
                'Reed (Finnish (Finland)):fi-FI:local',
                'Reed (French (Canada)):fr-CA:local',
                'Reed (Italian (Italy)):it-IT:local',
                'Reed (Japanese (Japan)):ja-JP:local',
                'Reed (Korean (South Korea)):ko-KR:local',
                'Reed (Portuguese (Brazil)):pt-BR:local',
                'Reed (Chinese (China mainland)):zh-CN:local',
                'Reed (Chinese (Taiwan)):zh-TW:local',
                'Rishi:en-IN:local',
                'Rocko (German (Germany)):de-DE:local',
                'Rocko (English (United Kingdom)):en-GB:local',
                'Rocko (English (United States)):en-US:local',
                'Rocko (Spanish (Spain)):es-ES:local',
                'Rocko (Spanish (Mexico)):es-MX:local',
                'Rocko (Finnish (Finland)):fi-FI:local',
                'Rocko (French (Canada)):fr-CA:local',
                'Rocko (French (France)):fr-FR:local',
                'Rocko (Italian (Italy)):it-IT:local',
                'Rocko (Japanese (Japan)):ja-JP:local',
                'Rocko (Korean (South Korea)):ko-KR:local',
                'Rocko (Portuguese (Brazil)):pt-BR:local',
                'Rocko (Chinese (China mainland)):zh-CN:local',
                'Rocko (Chinese (Taiwan)):zh-TW:local',
                'Sandy (German (Germany)):de-DE:local',
                'Sandy (English (United Kingdom)):en-GB:local',
                'Sandy (English (United States)):en-US:local',
                'Sandy (Spanish (Spain)):es-ES:local',
                'Sandy (Spanish (Mexico)):es-MX:local',
                'Sandy (Finnish (Finland)):fi-FI:local',
                'Sandy (French (Canada)):fr-CA:local',
                'Sandy (French (France)):fr-FR:local',
                'Sandy (Italian (Italy)):it-IT:local',
                'Sandy (Japanese (Japan)):ja-JP:local',
                'Sandy (Korean (South Korea)):ko-KR:local',
                'Sandy (Portuguese (Brazil)):pt-BR:local',
                'Sandy (Chinese (China mainland)):zh-CN:local',
                'Sandy (Chinese (Taiwan)):zh-TW:local',
                'Sara:da-DK:local',
                'Satu:fi-FI:local',
                'Shelley (German (Germany)):de-DE:local',
                'Shelley (English (United Kingdom)):en-GB:local',
                'Shelley (English (United States)):en-US:local',
                'Shelley (Spanish (Spain)):es-ES:local',
                'Shelley (Spanish (Mexico)):es-MX:local',
                'Shelley (Finnish (Finland)):fi-FI:local',
                'Shelley (French (Canada)):fr-CA:local',
                'Shelley (French (France)):fr-FR:local',
                'Shelley (Italian (Italy)):it-IT:local',
                'Shelley (Japanese (Japan)):ja-JP:local',
                'Shelley (Korean (South Korea)):ko-KR:local',
                'Shelley (Portuguese (Brazil)):pt-BR:local',
                'Shelley (Chinese (China mainland)):zh-CN:local',
                'Shelley (Chinese (Taiwan)):zh-TW:local',
                'Sinji:zh-HK:local',
                'Superstar:en-US:local',
                'Tessa:en-ZA:local',
                'Thomas:fr-FR:local',
                'Tina:sl-SI:local',
                'Tingting:zh-CN:local',
                'Trinoids:en-US:local',
                'Tünde:hu-HU:local',
                'Vani:ta-IN:local',
                'Whisper:en-US:local',
                'Wobble:en-US:local',
                'Xander:nl-NL:local',
                'Yelda:tr-TR:local',
                'Yu-shu:zh-CN:local',
                'Yuna:ko-KR:local',
                'Zarvox:en-US:local',
                'Zosia:pl-PL:local',
                'Zuzana:cs-CZ:local',
                'Cecil:en-US:local',
            ],
        },
    },
    linux: {
        camoufox: {
            navigatorPlatform: 'Linux x86_64',
            navigatorOscpu: 'Linux x86_64',
            hardwareConcurrency: 4,
            webglVendor: 'Mesa',
            webglRenderer: 'Mesa Intel(R) UHD Graphics 630 (CFL GT2)',
            screenDimensions: { width: 1920, height: 1080, colorDepth: 24 },
            devicePixelRatio: 1,
            speechVoices: [],
        },
        brave: {
            navigatorPlatform: 'Linux x86_64',
            navigatorOscpi: 'Linux x86_64',
            hardwareConcurrency: 9,
            screenDimensions: { width: 2560, height: 1440, colorDepth: 30 },
            devicePixelRatio: 1,
            speechVoices: [],
        },
    },
};
function getFallbackFingerprint(platform, browser) {
    return FALLBACK_FINGERPRINTS[platform][browser];
}

/**
 * Storage management for browser profiles
 */
const SAVE_STORAGE_EVERY_MS = 5000;
const __filename$2 = fileURLToPath(import.meta.url);
const __dirname$2 = path.dirname(__filename$2);
class StorageManager {
    constructor(managerClient) {
        this.managerClient = managerClient;
        this.scriptsCache = null;
    }
    /**
     * Saves storage state to Manager
     */
    async saveStorage(page, profile) {
        if (!this.managerClient)
            return;
        try {
            const { localStorage, indexedDB, origin } = await this.exportStorage(page);
            const cookies = await page.context().cookies();
            await this.managerClient.updateStorage(profile.browser_id, {
                origin,
                localStorage,
                indexedDB,
                cookies,
            });
        }
        catch (_e) { }
    }
    /**
     * Initializes periodic storage saver
     */
    initStorageSaver(page, profile) {
        const storageSaverInterval = setInterval(() => {
            this.saveStorage(page, profile);
        }, SAVE_STORAGE_EVERY_MS);
        page.once('close', () => {
            clearInterval(storageSaverInterval);
        });
    }
    /**
     * Sets fingerprinting properties on a page
     */
    async setFingerprintingProperties(page, profile) {
        try {
            // Wait for initial navigation to complete before setting properties
            await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        }
        catch (_e) {
            // Ignore timeout - page might not be navigating yet
        }
        if (profile.data.browserType === 'brave') {
            await this.setBraveFingerprintingProperties(page, profile.data);
        }
        else {
            await this.setCamoufoxFingerprintingProperties(page, profile.data);
        }
    }
    /**
     * Sets Camoufox-specific fingerprinting properties
     */
    async setCamoufoxFingerprintingProperties(page, data) {
        var _a;
        try {
            await page.mainFrame().evaluate(({ fontSpacingSeed, audioFingerprintSeed, screenDimensions, geolocation, timezone, lastKnownIP, navigatorPlatform, navigatorOscpu, hardwareConcurrency, webglVendor, webglRenderer, canvasSeed, fontList, speechVoices, }) => {
                try {
                    // Note: addInitScript in index.ts already calls these functions
                    // before any page scripts run. This is a fallback for edge cases.
                    const _window = window;
                    if (typeof _window.setFontSpacingSeed === 'function') {
                        _window.setFontSpacingSeed(fontSpacingSeed);
                    }
                    if (typeof _window.setWebRTCIPv4 === 'function') {
                        _window.setWebRTCIPv4(lastKnownIP || '');
                    }
                    if (audioFingerprintSeed !== undefined &&
                        typeof _window.setAudioFingerprintSeed === 'function') {
                        _window.setAudioFingerprintSeed(audioFingerprintSeed);
                    }
                    if (screenDimensions &&
                        typeof _window.setScreenDimensions === 'function') {
                        _window.setScreenDimensions(screenDimensions.width, screenDimensions.height);
                        if (screenDimensions.colorDepth &&
                            typeof _window.setScreenColorDepth === 'function') {
                            _window.setScreenColorDepth(screenDimensions.colorDepth);
                        }
                    }
                    if (geolocation && typeof _window.setGeolocation === 'function') {
                        _window.setGeolocation(geolocation.lat, geolocation.lon);
                    }
                    if (typeof _window.setTimezone === 'function') {
                        _window.setTimezone(timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
                    }
                    if (navigatorPlatform &&
                        typeof _window.setNavigatorPlatform === 'function') {
                        _window.setNavigatorPlatform(navigatorPlatform);
                    }
                    if (navigatorOscpu &&
                        typeof _window.setNavigatorOscpu === 'function') {
                        _window.setNavigatorOscpu(navigatorOscpu);
                    }
                    if (hardwareConcurrency &&
                        typeof _window.setNavigatorHardwareConcurrency === 'function') {
                        _window.setNavigatorHardwareConcurrency(hardwareConcurrency);
                    }
                    if (webglVendor && typeof _window.setWebGLVendor === 'function') {
                        _window.setWebGLVendor(webglVendor);
                    }
                    if (webglRenderer &&
                        typeof _window.setWebGLRenderer === 'function') {
                        _window.setWebGLRenderer(webglRenderer);
                    }
                    if (canvasSeed !== undefined &&
                        typeof _window.setCanvasSeed === 'function') {
                        _window.setCanvasSeed(canvasSeed);
                    }
                    if (fontList &&
                        fontList.length > 0 &&
                        typeof _window.setFontList === 'function') {
                        _window.setFontList(fontList.join(','));
                    }
                    if (speechVoices &&
                        speechVoices.length > 0 &&
                        typeof _window.setSpeechVoices === 'function') {
                        _window.setSpeechVoices(speechVoices.join(','));
                    }
                }
                catch (_e) { }
            }, {
                fontSpacingSeed: data.fontSpacingSeed,
                audioFingerprintSeed: data.audioFingerprintSeed,
                screenDimensions: data.screenDimensions,
                geolocation: data.geolocation,
                timezone: data.timezone,
                lastKnownIP: data.lastKnownIP,
                navigatorPlatform: data.navigatorPlatform,
                navigatorOscpu: data.navigatorOscpu,
                hardwareConcurrency: data.hardwareConcurrency,
                webglVendor: data.webglVendor,
                webglRenderer: data.webglRenderer,
                canvasSeed: data.canvasSeed,
                fontList: data.fontList,
                speechVoices: data.speechVoices,
            });
        }
        catch (error) {
            // Ignore "Execution context was destroyed" errors during navigation
            if (!((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('Execution context was destroyed'))) {
                throw error;
            }
        }
    }
    /**
     * Sets Brave-specific fingerprinting properties
     */
    async setBraveFingerprintingProperties(page, data) {
        var _a;
        try {
            await page.mainFrame().evaluate(({ fingerprintingSeed, lastKnownIP, timezone, }) => {
                try {
                    const _window = window;
                    _window.setFingerprintingSeed(fingerprintingSeed);
                    _window.setWebRTCIPV4(lastKnownIP || '');
                    if (timezone) {
                        _window.setTimezone(timezone);
                    }
                }
                catch (_e) { }
            }, {
                fingerprintingSeed: data.fingerprintingSeed,
                lastKnownIP: data.lastKnownIP,
                timezone: data.timezone,
            });
        }
        catch (error) {
            // Ignore "Execution context was destroyed" errors during navigation
            if (!((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('Execution context was destroyed'))) {
                throw error;
            }
        }
    }
    /**
     * Exports storage from a page
     */
    async exportStorage(page) {
        if (page.isClosed()) {
            return;
        }
        const { localStorage, indexedDB } = await page.evaluate(`(async () => {
        ${this.scripts()}
        return { localStorage: await exportLocalStorage(), indexedDB: await exportIndexedDB() }
      })()`);
        const url = new URL(page.url());
        const origin = url.origin;
        return { localStorage, indexedDB, origin };
    }
    /**
     * Loads browser scripts for storage export
     */
    scripts() {
        if (this.scriptsCache) {
            return this.scriptsCache;
        }
        const candidates = [
            path.join(__dirname$2, '../scripts'),
            path.join(__dirname$2, '../../scripts'),
        ];
        const scriptsDir = candidates.find((p) => fs.existsSync(p));
        if (!scriptsDir) {
            throw new Error('Unable to locate scripts directory. Ensure src/scripts is copied to dist/scripts or available at runtime.');
        }
        const files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.js'));
        this.scriptsCache = files
            .map((f) => fs.readFileSync(path.join(scriptsDir, f), 'utf-8'))
            .join('\n');
        return this.scriptsCache;
    }
}

/**
 * Shared fingerprint module - applies per-context fingerprints via Playwright's addInitScript
 * and sets up per-page fingerprinting fallback handlers.
 *
 * The init script runs BEFORE any page scripts, ensuring fingerprint values are set immediately
 * and custom window functions self-destruct before detection.
 *
 * The page event handler provides a fallback that re-applies fingerprinting properties
 * after navigation, covering edge cases the init script may miss.
 */
/**
 * Applies fingerprinting to a browser context.
 *
 * 1. Registers an init script that runs before any page scripts on every page/navigation,
 *    calling the Camoufox window.setXxx() functions which then self-destruct.
 * 2. Sets up a page event handler as a fallback that re-applies fingerprinting properties
 *    after navigation for edge cases the init script may miss.
 */
async function applyFingerprint(context, values, profile) {
    // The init script uses Camoufox-specific window.setXxx() functions.
    // Brave handles fingerprinting entirely through the page event handler below.
    if (profile.data.browserType === 'camoufox') {
        await context.addInitScript((v) => {
            const w = window;
            if (v.fontSpacingSeed && typeof w.setFontSpacingSeed === 'function') {
                w.setFontSpacingSeed(v.fontSpacingSeed);
            }
            if (typeof w.setWebRTCIPv4 === 'function') {
                w.setWebRTCIPv4(v.lastKnownIP || '');
            }
            if (v.audioFingerprintSeed &&
                typeof w.setAudioFingerprintSeed === 'function') {
                w.setAudioFingerprintSeed(v.audioFingerprintSeed);
            }
            if (v.screenWidth &&
                v.screenHeight &&
                typeof w.setScreenDimensions === 'function') {
                w.setScreenDimensions(v.screenWidth, v.screenHeight);
                if (v.screenColorDepth &&
                    typeof w.setScreenColorDepth === 'function') {
                    w.setScreenColorDepth(v.screenColorDepth);
                }
            }
            if (typeof w.setTimezone === 'function') {
                // Always call setTimezone to trigger self-destruct, even if no custom
                // timezone is set. Falls back to the browser's current timezone (no-op
                // for the actual timezone, but removes the detectable function).
                w.setTimezone(v.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
            }
            if (v.navigatorPlatform &&
                typeof w.setNavigatorPlatform === 'function') {
                w.setNavigatorPlatform(v.navigatorPlatform);
            }
            if (v.navigatorOscpu && typeof w.setNavigatorOscpu === 'function') {
                w.setNavigatorOscpu(v.navigatorOscpu);
            }
            if (v.hardwareConcurrency &&
                typeof w.setNavigatorHardwareConcurrency === 'function') {
                w.setNavigatorHardwareConcurrency(v.hardwareConcurrency);
            }
            if (v.webglVendor && typeof w.setWebGLVendor === 'function') {
                w.setWebGLVendor(v.webglVendor);
            }
            if (v.webglRenderer && typeof w.setWebGLRenderer === 'function') {
                w.setWebGLRenderer(v.webglRenderer);
            }
            if (v.canvasSeed && typeof w.setCanvasSeed === 'function') {
                w.setCanvasSeed(v.canvasSeed);
            }
            if (v.fontList &&
                v.fontList.length > 0 &&
                typeof w.setFontList === 'function') {
                w.setFontList(v.fontList.join(','));
            }
            if (v.speechVoices &&
                v.speechVoices.length > 0 &&
                typeof w.setSpeechVoices === 'function') {
                w.setSpeechVoices(v.speechVoices.join(','));
            }
        }, {
            fontSpacingSeed: values.fontSpacingSeed,
            audioFingerprintSeed: values.audioFingerprintSeed,
            screenWidth: values.screenWidth,
            screenHeight: values.screenHeight,
            screenColorDepth: values.screenColorDepth,
            timezone: values.timezone,
            lastKnownIP: values.lastKnownIP,
            navigatorPlatform: values.navigatorPlatform,
            navigatorOscpu: values.navigatorOscpu,
            hardwareConcurrency: values.hardwareConcurrency,
            webglVendor: values.webglVendor,
            webglRenderer: values.webglRenderer,
            canvasSeed: values.canvasSeed,
            fontList: values.fontList,
            speechVoices: values.speechVoices,
        });
    }
    // Set up page event handler as fallback for init script edge cases
    const storageManager = new StorageManager(null);
    context.on('page', async (page) => {
        try {
            await storageManager.setFingerprintingProperties(page, profile);
        }
        catch (_a) {
            // Page may have navigated or closed before setup completed
        }
    });
}

// Auto-generated from camoufox/pythonlib/camoufox/fonts.json (lin)
// 134 Linux fonts used by Camoufox font whitelist
const LINUX_FONTS = [
    'Arimo',
    'Cousine',
    'Noto Naskh Arabic',
    'Noto Sans Adlam',
    'Noto Sans Armenian',
    'Noto Sans Balinese',
    'Noto Sans Bamum',
    'Noto Sans Bassa Vah',
    'Noto Sans Batak',
    'Noto Sans Bengali',
    'Noto Sans Buginese',
    'Noto Sans Buhid',
    'Noto Sans Canadian Aboriginal',
    'Noto Sans Chakma',
    'Noto Sans Cham',
    'Noto Sans Cherokee',
    'Noto Sans Coptic',
    'Noto Sans Deseret',
    'Noto Sans Devanagari',
    'Noto Sans Elbasan',
    'Noto Sans Ethiopic',
    'Noto Sans Georgian',
    'Noto Sans Grantha',
    'Noto Sans Gujarati',
    'Noto Sans Gunjala Gondi',
    'Noto Sans Gurmukhi',
    'Noto Sans Hanifi Rohingya',
    'Noto Sans Hanunoo',
    'Noto Sans Hebrew',
    'Noto Sans JP',
    'Noto Sans Javanese',
    'Noto Sans KR',
    'Noto Sans Kannada',
    'Noto Sans Kayah Li',
    'Noto Sans Khmer',
    'Noto Sans Khojki',
    'Noto Sans Khudawadi',
    'Noto Sans Lao',
    'Noto Sans Lepcha',
    'Noto Sans Limbu',
    'Noto Sans Lisu',
    'Noto Sans Mahajani',
    'Noto Sans Malayalam',
    'Noto Sans Mandaic',
    'Noto Sans Masaram Gondi',
    'Noto Sans Medefaidrin',
    'Noto Sans Meetei Mayek',
    'Noto Sans Mende Kikakui',
    'Noto Sans Miao',
    'Noto Sans Modi',
    'Noto Sans Mongolian',
    'Noto Sans Mro',
    'Noto Sans Multani',
    'Noto Sans Myanmar',
    'Noto Sans NKo',
    'Noto Sans New Tai Lue',
    'Noto Sans Newa',
    'Noto Sans Ol Chiki',
    'Noto Sans Oriya',
    'Noto Sans Osage',
    'Noto Sans Osmanya',
    'Noto Sans Pahawh Hmong',
    'Noto Sans Pau Cin Hau',
    'Noto Sans Rejang',
    'Noto Sans Runic',
    'Noto Sans SC',
    'Noto Sans Samaritan',
    'Noto Sans Saurashtra',
    'Noto Sans Sharada',
    'Noto Sans Shavian',
    'Noto Sans Sinhala',
    'Noto Sans Sora Sompeng',
    'Noto Sans Soyombo',
    'Noto Sans Sundanese',
    'Noto Sans Syloti Nagri',
    'Noto Sans Symbols',
    'Noto Sans Symbols 2',
    'Noto Sans Syriac',
    'Noto Sans TC',
    'Noto Sans Tagalog',
    'Noto Sans Tagbanwa',
    'Noto Sans Tai Le',
    'Noto Sans Tai Tham',
    'Noto Sans Tai Viet',
    'Noto Sans Takri',
    'Noto Sans Tamil',
    'Noto Sans Telugu',
    'Noto Sans Thaana',
    'Noto Sans Thai',
    'Noto Sans Tifinagh',
    'Noto Sans Tifinagh APT',
    'Noto Sans Tifinagh Adrar',
    'Noto Sans Tifinagh Agraw Imazighen',
    'Noto Sans Tifinagh Ahaggar',
    'Noto Sans Tifinagh Air',
    'Noto Sans Tifinagh Azawagh',
    'Noto Sans Tifinagh Ghat',
    'Noto Sans Tifinagh Hawad',
    'Noto Sans Tifinagh Rhissa Ixa',
    'Noto Sans Tifinagh SIL',
    'Noto Sans Tifinagh Tawellemmet',
    'Noto Sans Tirhuta',
    'Noto Sans Vai',
    'Noto Sans Wancho',
    'Noto Sans Warang Citi',
    'Noto Sans Yi',
    'Noto Sans Zanabazar Square',
    'Noto Serif Armenian',
    'Noto Serif Balinese',
    'Noto Serif Bengali',
    'Noto Serif Devanagari',
    'Noto Serif Dogra',
    'Noto Serif Ethiopic',
    'Noto Serif Georgian',
    'Noto Serif Grantha',
    'Noto Serif Gujarati',
    'Noto Serif Gurmukhi',
    'Noto Serif Hebrew',
    'Noto Serif Kannada',
    'Noto Serif Khmer',
    'Noto Serif Khojki',
    'Noto Serif Lao',
    'Noto Serif Malayalam',
    'Noto Serif Myanmar',
    'Noto Serif NP Hmong',
    'Noto Serif Sinhala',
    'Noto Serif Tamil',
    'Noto Serif Telugu',
    'Noto Serif Thai',
    'Noto Serif Tibetan',
    'Noto Serif Yezidi',
    'STIX Two Math',
    'Tinos',
    'Twemoji Mozilla',
];
// Essential Linux fonts that should always be included in subsets
const ESSENTIAL_LINUX_FONTS = [
    'Arimo',
    'Cousine',
    'Tinos',
    'Noto Sans Devanagari',
    'Noto Sans JP',
    'Noto Sans KR',
    'Noto Sans SC',
    'Noto Sans TC',
];
// Generate a deterministic random subset of LINUX_FONTS.
// Same seed always produces the same subset. Keeps ~78% of fonts + all essential fonts.
function generateRandomLinuxFontSubset(seed) {
    const essentialSet = new Set(ESSENTIAL_LINUX_FONTS);
    const result = [];
    let state = seed >>> 0;
    for (const font of LINUX_FONTS) {
        if (essentialSet.has(font)) {
            result.push(font);
            continue;
        }
        state = (state * 1664525 + 1013904223) >>> 0;
        if (state % 100 < 78) {
            result.push(font);
        }
    }
    return result;
}

class AuthManager {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Parses Basic authentication header
     */
    parseBasicAuth(authHeader) {
        const match = authHeader.match(/^Basic\s+(.+)$/i);
        if (!match || !match[1])
            return null;
        try {
            const decoded = Buffer.from(match[1], 'base64').toString('utf8');
            const colonIndex = decoded.indexOf(':');
            if (colonIndex === -1)
                return null;
            return {
                user: decoded.slice(0, colonIndex),
                pass: decoded.slice(colonIndex + 1),
            };
        }
        catch {
            return null;
        }
    }
    /**
     * Validates Bearer token
     */
    validateBearerToken(authHeader) {
        const match = authHeader.match(/^Bearer\s+(.+)$/i);
        if (!match || !match[1])
            return false;
        const token = match[1].trim();
        return this.config.authTokens.includes(token);
    }
    /**
     * Checks if request is authorized
     */
    isRequestAuthorized(req) {
        // Skip authentication if flag is set (for local development)
        if (this.config.skipAuth) {
            return true;
        }
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return false;
        // Check Bearer token authentication
        if (this.config.authTokens.length > 0 &&
            this.validateBearerToken(authHeader)) {
            return true;
        }
        // Check Basic authentication
        if (this.config.basicAuth.user && this.config.basicAuth.pass) {
            const credentials = this.parseBasicAuth(authHeader);
            if (credentials &&
                credentials.user === this.config.basicAuth.user &&
                credentials.pass === this.config.basicAuth.pass) {
                return true;
            }
        }
        return false;
    }
    /**
     * Logs authentication configuration status
     */
    logAuthStatus() {
        if (this.config.quiet) {
            return; // Suppress all auth logs in quiet mode
        }
        if (this.config.skipAuth) {
            console.log('[auth] ⚠️  Authentication disabled (local mode)');
        }
        else if (this.config.authTokens.length > 0) {
            console.log('[auth] ✓ ROVERFOX_API_KEY configured');
        }
        else {
            console.warn('[auth] ⚠️  WARNING: No authentication configured! Set ROVERFOX_API_KEY environment variable.');
        }
    }
}

var getStream = {exports: {}};

var once = {exports: {}};

var wrappy_1;
var hasRequiredWrappy;

function requireWrappy () {
	if (hasRequiredWrappy) return wrappy_1;
	hasRequiredWrappy = 1;
	// Returns a wrapper function that returns a wrapped callback
	// The wrapper function should do some stuff, and return a
	// presumably different callback function.
	// This makes sure that own properties are retained, so that
	// decorations and such are not lost along the way.
	wrappy_1 = wrappy;
	function wrappy (fn, cb) {
	  if (fn && cb) return wrappy(fn)(cb)

	  if (typeof fn !== 'function')
	    throw new TypeError('need wrapper function')

	  Object.keys(fn).forEach(function (k) {
	    wrapper[k] = fn[k];
	  });

	  return wrapper

	  function wrapper() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    var ret = fn.apply(this, args);
	    var cb = args[args.length-1];
	    if (typeof ret === 'function' && ret !== cb) {
	      Object.keys(cb).forEach(function (k) {
	        ret[k] = cb[k];
	      });
	    }
	    return ret
	  }
	}
	return wrappy_1;
}

var hasRequiredOnce;

function requireOnce () {
	if (hasRequiredOnce) return once.exports;
	hasRequiredOnce = 1;
	var wrappy = requireWrappy();
	once.exports = wrappy(once$1);
	once.exports.strict = wrappy(onceStrict);

	once$1.proto = once$1(function () {
	  Object.defineProperty(Function.prototype, 'once', {
	    value: function () {
	      return once$1(this)
	    },
	    configurable: true
	  });

	  Object.defineProperty(Function.prototype, 'onceStrict', {
	    value: function () {
	      return onceStrict(this)
	    },
	    configurable: true
	  });
	});

	function once$1 (fn) {
	  var f = function () {
	    if (f.called) return f.value
	    f.called = true;
	    return f.value = fn.apply(this, arguments)
	  };
	  f.called = false;
	  return f
	}

	function onceStrict (fn) {
	  var f = function () {
	    if (f.called)
	      throw new Error(f.onceError)
	    f.called = true;
	    return f.value = fn.apply(this, arguments)
	  };
	  var name = fn.name || 'Function wrapped with `once`';
	  f.onceError = name + " shouldn't be called more than once";
	  f.called = false;
	  return f
	}
	return once.exports;
}

var endOfStream;
var hasRequiredEndOfStream;

function requireEndOfStream () {
	if (hasRequiredEndOfStream) return endOfStream;
	hasRequiredEndOfStream = 1;
	var once = requireOnce();

	var noop = function() {};

	var qnt = commonjsGlobal.Bare ? queueMicrotask : process.nextTick.bind(process);

	var isRequest = function(stream) {
		return stream.setHeader && typeof stream.abort === 'function';
	};

	var isChildProcess = function(stream) {
		return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
	};

	var eos = function(stream, opts, callback) {
		if (typeof opts === 'function') return eos(stream, null, opts);
		if (!opts) opts = {};

		callback = once(callback || noop);

		var ws = stream._writableState;
		var rs = stream._readableState;
		var readable = opts.readable || (opts.readable !== false && stream.readable);
		var writable = opts.writable || (opts.writable !== false && stream.writable);
		var cancelled = false;

		var onlegacyfinish = function() {
			if (!stream.writable) onfinish();
		};

		var onfinish = function() {
			writable = false;
			if (!readable) callback.call(stream);
		};

		var onend = function() {
			readable = false;
			if (!writable) callback.call(stream);
		};

		var onexit = function(exitCode) {
			callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
		};

		var onerror = function(err) {
			callback.call(stream, err);
		};

		var onclose = function() {
			qnt(onclosenexttick);
		};

		var onclosenexttick = function() {
			if (cancelled) return;
			if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
			if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
		};

		var onrequest = function() {
			stream.req.on('finish', onfinish);
		};

		if (isRequest(stream)) {
			stream.on('complete', onfinish);
			stream.on('abort', onclose);
			if (stream.req) onrequest();
			else stream.on('request', onrequest);
		} else if (writable && !ws) { // legacy streams
			stream.on('end', onlegacyfinish);
			stream.on('close', onlegacyfinish);
		}

		if (isChildProcess(stream)) stream.on('exit', onexit);

		stream.on('end', onend);
		stream.on('finish', onfinish);
		if (opts.error !== false) stream.on('error', onerror);
		stream.on('close', onclose);

		return function() {
			cancelled = true;
			stream.removeListener('complete', onfinish);
			stream.removeListener('abort', onclose);
			stream.removeListener('request', onrequest);
			if (stream.req) stream.req.removeListener('finish', onfinish);
			stream.removeListener('end', onlegacyfinish);
			stream.removeListener('close', onlegacyfinish);
			stream.removeListener('finish', onfinish);
			stream.removeListener('exit', onexit);
			stream.removeListener('end', onend);
			stream.removeListener('error', onerror);
			stream.removeListener('close', onclose);
		};
	};

	endOfStream = eos;
	return endOfStream;
}

var pump_1;
var hasRequiredPump;

function requirePump () {
	if (hasRequiredPump) return pump_1;
	hasRequiredPump = 1;
	var once = requireOnce();
	var eos = requireEndOfStream();
	var fs;

	try {
	  fs = require('fs'); // we only need fs to get the ReadStream and WriteStream prototypes
	} catch (e) {}

	var noop = function () {};
	var ancient = typeof process === 'undefined' ? false : /^v?\.0/.test(process.version);

	var isFn = function (fn) {
	  return typeof fn === 'function'
	};

	var isFS = function (stream) {
	  if (!ancient) return false // newer node version do not need to care about fs is a special way
	  if (!fs) return false // browser
	  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
	};

	var isRequest = function (stream) {
	  return stream.setHeader && isFn(stream.abort)
	};

	var destroyer = function (stream, reading, writing, callback) {
	  callback = once(callback);

	  var closed = false;
	  stream.on('close', function () {
	    closed = true;
	  });

	  eos(stream, {readable: reading, writable: writing}, function (err) {
	    if (err) return callback(err)
	    closed = true;
	    callback();
	  });

	  var destroyed = false;
	  return function (err) {
	    if (closed) return
	    if (destroyed) return
	    destroyed = true;

	    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
	    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

	    if (isFn(stream.destroy)) return stream.destroy()

	    callback(err || new Error('stream was destroyed'));
	  }
	};

	var call = function (fn) {
	  fn();
	};

	var pipe = function (from, to) {
	  return from.pipe(to)
	};

	var pump = function () {
	  var streams = Array.prototype.slice.call(arguments);
	  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop;

	  if (Array.isArray(streams[0])) streams = streams[0];
	  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

	  var error;
	  var destroys = streams.map(function (stream, i) {
	    var reading = i < streams.length - 1;
	    var writing = i > 0;
	    return destroyer(stream, reading, writing, function (err) {
	      if (!error) error = err;
	      if (err) destroys.forEach(call);
	      if (reading) return
	      destroys.forEach(call);
	      callback(error);
	    })
	  });

	  return streams.reduce(pipe)
	};

	pump_1 = pump;
	return pump_1;
}

var bufferStream;
var hasRequiredBufferStream;

function requireBufferStream () {
	if (hasRequiredBufferStream) return bufferStream;
	hasRequiredBufferStream = 1;
	const {PassThrough: PassThroughStream} = stream;

	bufferStream = options => {
		options = {...options};

		const {array} = options;
		let {encoding} = options;
		const isBuffer = encoding === 'buffer';
		let objectMode = false;

		if (array) {
			objectMode = !(encoding || isBuffer);
		} else {
			encoding = encoding || 'utf8';
		}

		if (isBuffer) {
			encoding = null;
		}

		const stream = new PassThroughStream({objectMode});

		if (encoding) {
			stream.setEncoding(encoding);
		}

		let length = 0;
		const chunks = [];

		stream.on('data', chunk => {
			chunks.push(chunk);

			if (objectMode) {
				length = chunks.length;
			} else {
				length += chunk.length;
			}
		});

		stream.getBufferedValue = () => {
			if (array) {
				return chunks;
			}

			return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
		};

		stream.getBufferedLength = () => length;

		return stream;
	};
	return bufferStream;
}

var hasRequiredGetStream;

function requireGetStream () {
	if (hasRequiredGetStream) return getStream.exports;
	hasRequiredGetStream = 1;
	const {constants: BufferConstants} = require$$0$2;
	const pump = requirePump();
	const bufferStream = requireBufferStream();

	class MaxBufferError extends Error {
		constructor() {
			super('maxBuffer exceeded');
			this.name = 'MaxBufferError';
		}
	}

	async function getStream$1(inputStream, options) {
		if (!inputStream) {
			return Promise.reject(new Error('Expected a stream'));
		}

		options = {
			maxBuffer: Infinity,
			...options
		};

		const {maxBuffer} = options;

		let stream;
		await new Promise((resolve, reject) => {
			const rejectPromise = error => {
				// Don't retrieve an oversized buffer.
				if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
					error.bufferedData = stream.getBufferedValue();
				}

				reject(error);
			};

			stream = pump(inputStream, bufferStream(options), error => {
				if (error) {
					rejectPromise(error);
					return;
				}

				resolve();
			});

			stream.on('data', () => {
				if (stream.getBufferedLength() > maxBuffer) {
					rejectPromise(new MaxBufferError());
				}
			});
		});

		return stream.getBufferedValue();
	}

	getStream.exports = getStream$1;
	// TODO: Remove this for the next major release
	getStream.exports.default = getStream$1;
	getStream.exports.buffer = (stream, options) => getStream$1(stream, {...options, encoding: 'buffer'});
	getStream.exports.array = (stream, options) => getStream$1(stream, {...options, array: true});
	getStream.exports.MaxBufferError = MaxBufferError;
	return getStream.exports;
}

var yauzl = {};

var fdSlicer = {};

var pend;
var hasRequiredPend;

function requirePend () {
	if (hasRequiredPend) return pend;
	hasRequiredPend = 1;
	pend = Pend;

	function Pend() {
	  this.pending = 0;
	  this.max = Infinity;
	  this.listeners = [];
	  this.waiting = [];
	  this.error = null;
	}

	Pend.prototype.go = function(fn) {
	  if (this.pending < this.max) {
	    pendGo(this, fn);
	  } else {
	    this.waiting.push(fn);
	  }
	};

	Pend.prototype.wait = function(cb) {
	  if (this.pending === 0) {
	    cb(this.error);
	  } else {
	    this.listeners.push(cb);
	  }
	};

	Pend.prototype.hold = function() {
	  return pendHold(this);
	};

	function pendHold(self) {
	  self.pending += 1;
	  var called = false;
	  return onCb;
	  function onCb(err) {
	    if (called) throw new Error("callback called twice");
	    called = true;
	    self.error = self.error || err;
	    self.pending -= 1;
	    if (self.waiting.length > 0 && self.pending < self.max) {
	      pendGo(self, self.waiting.shift());
	    } else if (self.pending === 0) {
	      var listeners = self.listeners;
	      self.listeners = [];
	      listeners.forEach(cbListener);
	    }
	  }
	  function cbListener(listener) {
	    listener(self.error);
	  }
	}

	function pendGo(self, fn) {
	  fn(pendHold(self));
	}
	return pend;
}

var hasRequiredFdSlicer;

function requireFdSlicer () {
	if (hasRequiredFdSlicer) return fdSlicer;
	hasRequiredFdSlicer = 1;
	var fs = fs__default;
	var util = require$$1;
	var stream$1 = stream;
	var Readable = stream$1.Readable;
	var Writable = stream$1.Writable;
	var PassThrough = stream$1.PassThrough;
	var Pend = requirePend();
	var EventEmitter = require$$4$1.EventEmitter;

	fdSlicer.createFromBuffer = createFromBuffer;
	fdSlicer.createFromFd = createFromFd;
	fdSlicer.BufferSlicer = BufferSlicer;
	fdSlicer.FdSlicer = FdSlicer;

	util.inherits(FdSlicer, EventEmitter);
	function FdSlicer(fd, options) {
	  options = options || {};
	  EventEmitter.call(this);

	  this.fd = fd;
	  this.pend = new Pend();
	  this.pend.max = 1;
	  this.refCount = 0;
	  this.autoClose = !!options.autoClose;
	}

	FdSlicer.prototype.read = function(buffer, offset, length, position, callback) {
	  var self = this;
	  self.pend.go(function(cb) {
	    fs.read(self.fd, buffer, offset, length, position, function(err, bytesRead, buffer) {
	      cb();
	      callback(err, bytesRead, buffer);
	    });
	  });
	};

	FdSlicer.prototype.write = function(buffer, offset, length, position, callback) {
	  var self = this;
	  self.pend.go(function(cb) {
	    fs.write(self.fd, buffer, offset, length, position, function(err, written, buffer) {
	      cb();
	      callback(err, written, buffer);
	    });
	  });
	};

	FdSlicer.prototype.createReadStream = function(options) {
	  return new ReadStream(this, options);
	};

	FdSlicer.prototype.createWriteStream = function(options) {
	  return new WriteStream(this, options);
	};

	FdSlicer.prototype.ref = function() {
	  this.refCount += 1;
	};

	FdSlicer.prototype.unref = function() {
	  var self = this;
	  self.refCount -= 1;

	  if (self.refCount > 0) return;
	  if (self.refCount < 0) throw new Error("invalid unref");

	  if (self.autoClose) {
	    fs.close(self.fd, onCloseDone);
	  }

	  function onCloseDone(err) {
	    if (err) {
	      self.emit('error', err);
	    } else {
	      self.emit('close');
	    }
	  }
	};

	util.inherits(ReadStream, Readable);
	function ReadStream(context, options) {
	  options = options || {};
	  Readable.call(this, options);

	  this.context = context;
	  this.context.ref();

	  this.start = options.start || 0;
	  this.endOffset = options.end;
	  this.pos = this.start;
	  this.destroyed = false;
	}

	ReadStream.prototype._read = function(n) {
	  var self = this;
	  if (self.destroyed) return;

	  var toRead = Math.min(self._readableState.highWaterMark, n);
	  if (self.endOffset != null) {
	    toRead = Math.min(toRead, self.endOffset - self.pos);
	  }
	  if (toRead <= 0) {
	    self.destroyed = true;
	    self.push(null);
	    self.context.unref();
	    return;
	  }
	  self.context.pend.go(function(cb) {
	    if (self.destroyed) return cb();
	    var buffer = new Buffer(toRead);
	    fs.read(self.context.fd, buffer, 0, toRead, self.pos, function(err, bytesRead) {
	      if (err) {
	        self.destroy(err);
	      } else if (bytesRead === 0) {
	        self.destroyed = true;
	        self.push(null);
	        self.context.unref();
	      } else {
	        self.pos += bytesRead;
	        self.push(buffer.slice(0, bytesRead));
	      }
	      cb();
	    });
	  });
	};

	ReadStream.prototype.destroy = function(err) {
	  if (this.destroyed) return;
	  err = err || new Error("stream destroyed");
	  this.destroyed = true;
	  this.emit('error', err);
	  this.context.unref();
	};

	util.inherits(WriteStream, Writable);
	function WriteStream(context, options) {
	  options = options || {};
	  Writable.call(this, options);

	  this.context = context;
	  this.context.ref();

	  this.start = options.start || 0;
	  this.endOffset = (options.end == null) ? Infinity : +options.end;
	  this.bytesWritten = 0;
	  this.pos = this.start;
	  this.destroyed = false;

	  this.on('finish', this.destroy.bind(this));
	}

	WriteStream.prototype._write = function(buffer, encoding, callback) {
	  var self = this;
	  if (self.destroyed) return;

	  if (self.pos + buffer.length > self.endOffset) {
	    var err = new Error("maximum file length exceeded");
	    err.code = 'ETOOBIG';
	    self.destroy();
	    callback(err);
	    return;
	  }
	  self.context.pend.go(function(cb) {
	    if (self.destroyed) return cb();
	    fs.write(self.context.fd, buffer, 0, buffer.length, self.pos, function(err, bytes) {
	      if (err) {
	        self.destroy();
	        cb();
	        callback(err);
	      } else {
	        self.bytesWritten += bytes;
	        self.pos += bytes;
	        self.emit('progress');
	        cb();
	        callback();
	      }
	    });
	  });
	};

	WriteStream.prototype.destroy = function() {
	  if (this.destroyed) return;
	  this.destroyed = true;
	  this.context.unref();
	};

	util.inherits(BufferSlicer, EventEmitter);
	function BufferSlicer(buffer, options) {
	  EventEmitter.call(this);

	  options = options || {};
	  this.refCount = 0;
	  this.buffer = buffer;
	  this.maxChunkSize = options.maxChunkSize || Number.MAX_SAFE_INTEGER;
	}

	BufferSlicer.prototype.read = function(buffer, offset, length, position, callback) {
	  var end = position + length;
	  var delta = end - this.buffer.length;
	  var written = (delta > 0) ? delta : length;
	  this.buffer.copy(buffer, offset, position, end);
	  setImmediate(function() {
	    callback(null, written);
	  });
	};

	BufferSlicer.prototype.write = function(buffer, offset, length, position, callback) {
	  buffer.copy(this.buffer, position, offset, offset + length);
	  setImmediate(function() {
	    callback(null, length, buffer);
	  });
	};

	BufferSlicer.prototype.createReadStream = function(options) {
	  options = options || {};
	  var readStream = new PassThrough(options);
	  readStream.destroyed = false;
	  readStream.start = options.start || 0;
	  readStream.endOffset = options.end;
	  // by the time this function returns, we'll be done.
	  readStream.pos = readStream.endOffset || this.buffer.length;

	  // respect the maxChunkSize option to slice up the chunk into smaller pieces.
	  var entireSlice = this.buffer.slice(readStream.start, readStream.pos);
	  var offset = 0;
	  while (true) {
	    var nextOffset = offset + this.maxChunkSize;
	    if (nextOffset >= entireSlice.length) {
	      // last chunk
	      if (offset < entireSlice.length) {
	        readStream.write(entireSlice.slice(offset, entireSlice.length));
	      }
	      break;
	    }
	    readStream.write(entireSlice.slice(offset, nextOffset));
	    offset = nextOffset;
	  }

	  readStream.end();
	  readStream.destroy = function() {
	    readStream.destroyed = true;
	  };
	  return readStream;
	};

	BufferSlicer.prototype.createWriteStream = function(options) {
	  var bufferSlicer = this;
	  options = options || {};
	  var writeStream = new Writable(options);
	  writeStream.start = options.start || 0;
	  writeStream.endOffset = (options.end == null) ? this.buffer.length : +options.end;
	  writeStream.bytesWritten = 0;
	  writeStream.pos = writeStream.start;
	  writeStream.destroyed = false;
	  writeStream._write = function(buffer, encoding, callback) {
	    if (writeStream.destroyed) return;

	    var end = writeStream.pos + buffer.length;
	    if (end > writeStream.endOffset) {
	      var err = new Error("maximum file length exceeded");
	      err.code = 'ETOOBIG';
	      writeStream.destroyed = true;
	      callback(err);
	      return;
	    }
	    buffer.copy(bufferSlicer.buffer, writeStream.pos, 0, buffer.length);

	    writeStream.bytesWritten += buffer.length;
	    writeStream.pos = end;
	    writeStream.emit('progress');
	    callback();
	  };
	  writeStream.destroy = function() {
	    writeStream.destroyed = true;
	  };
	  return writeStream;
	};

	BufferSlicer.prototype.ref = function() {
	  this.refCount += 1;
	};

	BufferSlicer.prototype.unref = function() {
	  this.refCount -= 1;

	  if (this.refCount < 0) {
	    throw new Error("invalid unref");
	  }
	};

	function createFromBuffer(buffer, options) {
	  return new BufferSlicer(buffer, options);
	}

	function createFromFd(fd, options) {
	  return new FdSlicer(fd, options);
	}
	return fdSlicer;
}

var bufferCrc32;
var hasRequiredBufferCrc32;

function requireBufferCrc32 () {
	if (hasRequiredBufferCrc32) return bufferCrc32;
	hasRequiredBufferCrc32 = 1;
	var Buffer = require$$0$2.Buffer;

	var CRC_TABLE = [
	  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419,
	  0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4,
	  0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07,
	  0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de,
	  0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856,
	  0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
	  0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4,
	  0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
	  0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3,
	  0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a,
	  0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599,
	  0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
	  0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190,
	  0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f,
	  0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e,
	  0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
	  0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed,
	  0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
	  0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3,
	  0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2,
	  0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a,
	  0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5,
	  0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010,
	  0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
	  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17,
	  0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6,
	  0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615,
	  0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8,
	  0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344,
	  0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
	  0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a,
	  0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
	  0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1,
	  0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c,
	  0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef,
	  0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
	  0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe,
	  0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31,
	  0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c,
	  0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
	  0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b,
	  0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
	  0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1,
	  0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c,
	  0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278,
	  0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7,
	  0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66,
	  0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
	  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605,
	  0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8,
	  0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b,
	  0x2d02ef8d
	];

	if (typeof Int32Array !== 'undefined') {
	  CRC_TABLE = new Int32Array(CRC_TABLE);
	}

	function ensureBuffer(input) {
	  if (Buffer.isBuffer(input)) {
	    return input;
	  }

	  var hasNewBufferAPI =
	      typeof Buffer.alloc === "function" &&
	      typeof Buffer.from === "function";

	  if (typeof input === "number") {
	    return hasNewBufferAPI ? Buffer.alloc(input) : new Buffer(input);
	  }
	  else if (typeof input === "string") {
	    return hasNewBufferAPI ? Buffer.from(input) : new Buffer(input);
	  }
	  else {
	    throw new Error("input must be buffer, number, or string, received " +
	                    typeof input);
	  }
	}

	function bufferizeInt(num) {
	  var tmp = ensureBuffer(4);
	  tmp.writeInt32BE(num, 0);
	  return tmp;
	}

	function _crc32(buf, previous) {
	  buf = ensureBuffer(buf);
	  if (Buffer.isBuffer(previous)) {
	    previous = previous.readUInt32BE(0);
	  }
	  var crc = ~~previous ^ -1;
	  for (var n = 0; n < buf.length; n++) {
	    crc = CRC_TABLE[(crc ^ buf[n]) & 0xff] ^ (crc >>> 8);
	  }
	  return (crc ^ -1);
	}

	function crc32() {
	  return bufferizeInt(_crc32.apply(null, arguments));
	}
	crc32.signed = function () {
	  return _crc32.apply(null, arguments);
	};
	crc32.unsigned = function () {
	  return _crc32.apply(null, arguments) >>> 0;
	};

	bufferCrc32 = crc32;
	return bufferCrc32;
}

var hasRequiredYauzl;

function requireYauzl () {
	if (hasRequiredYauzl) return yauzl;
	hasRequiredYauzl = 1;
	var fs = fs__default;
	var zlib$1 = zlib;
	var fd_slicer = requireFdSlicer();
	var crc32 = requireBufferCrc32();
	var util = require$$1;
	var EventEmitter = require$$4$1.EventEmitter;
	var Transform = stream.Transform;
	var PassThrough = stream.PassThrough;
	var Writable = stream.Writable;

	yauzl.open = open;
	yauzl.fromFd = fromFd;
	yauzl.fromBuffer = fromBuffer;
	yauzl.fromRandomAccessReader = fromRandomAccessReader;
	yauzl.dosDateTimeToDate = dosDateTimeToDate;
	yauzl.validateFileName = validateFileName;
	yauzl.ZipFile = ZipFile;
	yauzl.Entry = Entry;
	yauzl.RandomAccessReader = RandomAccessReader;

	function open(path, options, callback) {
	  if (typeof options === "function") {
	    callback = options;
	    options = null;
	  }
	  if (options == null) options = {};
	  if (options.autoClose == null) options.autoClose = true;
	  if (options.lazyEntries == null) options.lazyEntries = false;
	  if (options.decodeStrings == null) options.decodeStrings = true;
	  if (options.validateEntrySizes == null) options.validateEntrySizes = true;
	  if (options.strictFileNames == null) options.strictFileNames = false;
	  if (callback == null) callback = defaultCallback;
	  fs.open(path, "r", function(err, fd) {
	    if (err) return callback(err);
	    fromFd(fd, options, function(err, zipfile) {
	      if (err) fs.close(fd, defaultCallback);
	      callback(err, zipfile);
	    });
	  });
	}

	function fromFd(fd, options, callback) {
	  if (typeof options === "function") {
	    callback = options;
	    options = null;
	  }
	  if (options == null) options = {};
	  if (options.autoClose == null) options.autoClose = false;
	  if (options.lazyEntries == null) options.lazyEntries = false;
	  if (options.decodeStrings == null) options.decodeStrings = true;
	  if (options.validateEntrySizes == null) options.validateEntrySizes = true;
	  if (options.strictFileNames == null) options.strictFileNames = false;
	  if (callback == null) callback = defaultCallback;
	  fs.fstat(fd, function(err, stats) {
	    if (err) return callback(err);
	    var reader = fd_slicer.createFromFd(fd, {autoClose: true});
	    fromRandomAccessReader(reader, stats.size, options, callback);
	  });
	}

	function fromBuffer(buffer, options, callback) {
	  if (typeof options === "function") {
	    callback = options;
	    options = null;
	  }
	  if (options == null) options = {};
	  options.autoClose = false;
	  if (options.lazyEntries == null) options.lazyEntries = false;
	  if (options.decodeStrings == null) options.decodeStrings = true;
	  if (options.validateEntrySizes == null) options.validateEntrySizes = true;
	  if (options.strictFileNames == null) options.strictFileNames = false;
	  // limit the max chunk size. see https://github.com/thejoshwolfe/yauzl/issues/87
	  var reader = fd_slicer.createFromBuffer(buffer, {maxChunkSize: 0x10000});
	  fromRandomAccessReader(reader, buffer.length, options, callback);
	}

	function fromRandomAccessReader(reader, totalSize, options, callback) {
	  if (typeof options === "function") {
	    callback = options;
	    options = null;
	  }
	  if (options == null) options = {};
	  if (options.autoClose == null) options.autoClose = true;
	  if (options.lazyEntries == null) options.lazyEntries = false;
	  if (options.decodeStrings == null) options.decodeStrings = true;
	  var decodeStrings = !!options.decodeStrings;
	  if (options.validateEntrySizes == null) options.validateEntrySizes = true;
	  if (options.strictFileNames == null) options.strictFileNames = false;
	  if (callback == null) callback = defaultCallback;
	  if (typeof totalSize !== "number") throw new Error("expected totalSize parameter to be a number");
	  if (totalSize > Number.MAX_SAFE_INTEGER) {
	    throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
	  }

	  // the matching unref() call is in zipfile.close()
	  reader.ref();

	  // eocdr means End of Central Directory Record.
	  // search backwards for the eocdr signature.
	  // the last field of the eocdr is a variable-length comment.
	  // the comment size is encoded in a 2-byte field in the eocdr, which we can't find without trudging backwards through the comment to find it.
	  // as a consequence of this design decision, it's possible to have ambiguous zip file metadata if a coherent eocdr was in the comment.
	  // we search backwards for a eocdr signature, and hope that whoever made the zip file was smart enough to forbid the eocdr signature in the comment.
	  var eocdrWithoutCommentSize = 22;
	  var maxCommentSize = 0xffff; // 2-byte size
	  var bufferSize = Math.min(eocdrWithoutCommentSize + maxCommentSize, totalSize);
	  var buffer = newBuffer(bufferSize);
	  var bufferReadStart = totalSize - buffer.length;
	  readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart, function(err) {
	    if (err) return callback(err);
	    for (var i = bufferSize - eocdrWithoutCommentSize; i >= 0; i -= 1) {
	      if (buffer.readUInt32LE(i) !== 0x06054b50) continue;
	      // found eocdr
	      var eocdrBuffer = buffer.slice(i);

	      // 0 - End of central directory signature = 0x06054b50
	      // 4 - Number of this disk
	      var diskNumber = eocdrBuffer.readUInt16LE(4);
	      if (diskNumber !== 0) {
	        return callback(new Error("multi-disk zip files are not supported: found disk number: " + diskNumber));
	      }
	      // 6 - Disk where central directory starts
	      // 8 - Number of central directory records on this disk
	      // 10 - Total number of central directory records
	      var entryCount = eocdrBuffer.readUInt16LE(10);
	      // 12 - Size of central directory (bytes)
	      // 16 - Offset of start of central directory, relative to start of archive
	      var centralDirectoryOffset = eocdrBuffer.readUInt32LE(16);
	      // 20 - Comment length
	      var commentLength = eocdrBuffer.readUInt16LE(20);
	      var expectedCommentLength = eocdrBuffer.length - eocdrWithoutCommentSize;
	      if (commentLength !== expectedCommentLength) {
	        return callback(new Error("invalid comment length. expected: " + expectedCommentLength + ". found: " + commentLength));
	      }
	      // 22 - Comment
	      // the encoding is always cp437.
	      var comment = decodeStrings ? decodeBuffer(eocdrBuffer, 22, eocdrBuffer.length, false)
	                                  : eocdrBuffer.slice(22);

	      if (!(entryCount === 0xffff || centralDirectoryOffset === 0xffffffff)) {
	        return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
	      }

	      // ZIP64 format

	      // ZIP64 Zip64 end of central directory locator
	      var zip64EocdlBuffer = newBuffer(20);
	      var zip64EocdlOffset = bufferReadStart + i - zip64EocdlBuffer.length;
	      readAndAssertNoEof(reader, zip64EocdlBuffer, 0, zip64EocdlBuffer.length, zip64EocdlOffset, function(err) {
	        if (err) return callback(err);

	        // 0 - zip64 end of central dir locator signature = 0x07064b50
	        if (zip64EocdlBuffer.readUInt32LE(0) !== 0x07064b50) {
	          return callback(new Error("invalid zip64 end of central directory locator signature"));
	        }
	        // 4 - number of the disk with the start of the zip64 end of central directory
	        // 8 - relative offset of the zip64 end of central directory record
	        var zip64EocdrOffset = readUInt64LE(zip64EocdlBuffer, 8);
	        // 16 - total number of disks

	        // ZIP64 end of central directory record
	        var zip64EocdrBuffer = newBuffer(56);
	        readAndAssertNoEof(reader, zip64EocdrBuffer, 0, zip64EocdrBuffer.length, zip64EocdrOffset, function(err) {
	          if (err) return callback(err);

	          // 0 - zip64 end of central dir signature                           4 bytes  (0x06064b50)
	          if (zip64EocdrBuffer.readUInt32LE(0) !== 0x06064b50) {
	            return callback(new Error("invalid zip64 end of central directory record signature"));
	          }
	          // 4 - size of zip64 end of central directory record                8 bytes
	          // 12 - version made by                                             2 bytes
	          // 14 - version needed to extract                                   2 bytes
	          // 16 - number of this disk                                         4 bytes
	          // 20 - number of the disk with the start of the central directory  4 bytes
	          // 24 - total number of entries in the central directory on this disk         8 bytes
	          // 32 - total number of entries in the central directory            8 bytes
	          entryCount = readUInt64LE(zip64EocdrBuffer, 32);
	          // 40 - size of the central directory                               8 bytes
	          // 48 - offset of start of central directory with respect to the starting disk number     8 bytes
	          centralDirectoryOffset = readUInt64LE(zip64EocdrBuffer, 48);
	          // 56 - zip64 extensible data sector                                (variable size)
	          return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
	        });
	      });
	      return;
	    }
	    callback(new Error("end of central directory record signature not found"));
	  });
	}

	util.inherits(ZipFile, EventEmitter);
	function ZipFile(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries, decodeStrings, validateEntrySizes, strictFileNames) {
	  var self = this;
	  EventEmitter.call(self);
	  self.reader = reader;
	  // forward close events
	  self.reader.on("error", function(err) {
	    // error closing the fd
	    emitError(self, err);
	  });
	  self.reader.once("close", function() {
	    self.emit("close");
	  });
	  self.readEntryCursor = centralDirectoryOffset;
	  self.fileSize = fileSize;
	  self.entryCount = entryCount;
	  self.comment = comment;
	  self.entriesRead = 0;
	  self.autoClose = !!autoClose;
	  self.lazyEntries = !!lazyEntries;
	  self.decodeStrings = !!decodeStrings;
	  self.validateEntrySizes = !!validateEntrySizes;
	  self.strictFileNames = !!strictFileNames;
	  self.isOpen = true;
	  self.emittedError = false;

	  if (!self.lazyEntries) self._readEntry();
	}
	ZipFile.prototype.close = function() {
	  if (!this.isOpen) return;
	  this.isOpen = false;
	  this.reader.unref();
	};

	function emitErrorAndAutoClose(self, err) {
	  if (self.autoClose) self.close();
	  emitError(self, err);
	}
	function emitError(self, err) {
	  if (self.emittedError) return;
	  self.emittedError = true;
	  self.emit("error", err);
	}

	ZipFile.prototype.readEntry = function() {
	  if (!this.lazyEntries) throw new Error("readEntry() called without lazyEntries:true");
	  this._readEntry();
	};
	ZipFile.prototype._readEntry = function() {
	  var self = this;
	  if (self.entryCount === self.entriesRead) {
	    // done with metadata
	    setImmediate(function() {
	      if (self.autoClose) self.close();
	      if (self.emittedError) return;
	      self.emit("end");
	    });
	    return;
	  }
	  if (self.emittedError) return;
	  var buffer = newBuffer(46);
	  readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err) {
	    if (err) return emitErrorAndAutoClose(self, err);
	    if (self.emittedError) return;
	    var entry = new Entry();
	    // 0 - Central directory file header signature
	    var signature = buffer.readUInt32LE(0);
	    if (signature !== 0x02014b50) return emitErrorAndAutoClose(self, new Error("invalid central directory file header signature: 0x" + signature.toString(16)));
	    // 4 - Version made by
	    entry.versionMadeBy = buffer.readUInt16LE(4);
	    // 6 - Version needed to extract (minimum)
	    entry.versionNeededToExtract = buffer.readUInt16LE(6);
	    // 8 - General purpose bit flag
	    entry.generalPurposeBitFlag = buffer.readUInt16LE(8);
	    // 10 - Compression method
	    entry.compressionMethod = buffer.readUInt16LE(10);
	    // 12 - File last modification time
	    entry.lastModFileTime = buffer.readUInt16LE(12);
	    // 14 - File last modification date
	    entry.lastModFileDate = buffer.readUInt16LE(14);
	    // 16 - CRC-32
	    entry.crc32 = buffer.readUInt32LE(16);
	    // 20 - Compressed size
	    entry.compressedSize = buffer.readUInt32LE(20);
	    // 24 - Uncompressed size
	    entry.uncompressedSize = buffer.readUInt32LE(24);
	    // 28 - File name length (n)
	    entry.fileNameLength = buffer.readUInt16LE(28);
	    // 30 - Extra field length (m)
	    entry.extraFieldLength = buffer.readUInt16LE(30);
	    // 32 - File comment length (k)
	    entry.fileCommentLength = buffer.readUInt16LE(32);
	    // 34 - Disk number where file starts
	    // 36 - Internal file attributes
	    entry.internalFileAttributes = buffer.readUInt16LE(36);
	    // 38 - External file attributes
	    entry.externalFileAttributes = buffer.readUInt32LE(38);
	    // 42 - Relative offset of local file header
	    entry.relativeOffsetOfLocalHeader = buffer.readUInt32LE(42);

	    if (entry.generalPurposeBitFlag & 0x40) return emitErrorAndAutoClose(self, new Error("strong encryption is not supported"));

	    self.readEntryCursor += 46;

	    buffer = newBuffer(entry.fileNameLength + entry.extraFieldLength + entry.fileCommentLength);
	    readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err) {
	      if (err) return emitErrorAndAutoClose(self, err);
	      if (self.emittedError) return;
	      // 46 - File name
	      var isUtf8 = (entry.generalPurposeBitFlag & 0x800) !== 0;
	      entry.fileName = self.decodeStrings ? decodeBuffer(buffer, 0, entry.fileNameLength, isUtf8)
	                                          : buffer.slice(0, entry.fileNameLength);

	      // 46+n - Extra field
	      var fileCommentStart = entry.fileNameLength + entry.extraFieldLength;
	      var extraFieldBuffer = buffer.slice(entry.fileNameLength, fileCommentStart);
	      entry.extraFields = [];
	      var i = 0;
	      while (i < extraFieldBuffer.length - 3) {
	        var headerId = extraFieldBuffer.readUInt16LE(i + 0);
	        var dataSize = extraFieldBuffer.readUInt16LE(i + 2);
	        var dataStart = i + 4;
	        var dataEnd = dataStart + dataSize;
	        if (dataEnd > extraFieldBuffer.length) return emitErrorAndAutoClose(self, new Error("extra field length exceeds extra field buffer size"));
	        var dataBuffer = newBuffer(dataSize);
	        extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd);
	        entry.extraFields.push({
	          id: headerId,
	          data: dataBuffer,
	        });
	        i = dataEnd;
	      }

	      // 46+n+m - File comment
	      entry.fileComment = self.decodeStrings ? decodeBuffer(buffer, fileCommentStart, fileCommentStart + entry.fileCommentLength, isUtf8)
	                                             : buffer.slice(fileCommentStart, fileCommentStart + entry.fileCommentLength);
	      // compatibility hack for https://github.com/thejoshwolfe/yauzl/issues/47
	      entry.comment = entry.fileComment;

	      self.readEntryCursor += buffer.length;
	      self.entriesRead += 1;

	      if (entry.uncompressedSize            === 0xffffffff ||
	          entry.compressedSize              === 0xffffffff ||
	          entry.relativeOffsetOfLocalHeader === 0xffffffff) {
	        // ZIP64 format
	        // find the Zip64 Extended Information Extra Field
	        var zip64EiefBuffer = null;
	        for (var i = 0; i < entry.extraFields.length; i++) {
	          var extraField = entry.extraFields[i];
	          if (extraField.id === 0x0001) {
	            zip64EiefBuffer = extraField.data;
	            break;
	          }
	        }
	        if (zip64EiefBuffer == null) {
	          return emitErrorAndAutoClose(self, new Error("expected zip64 extended information extra field"));
	        }
	        var index = 0;
	        // 0 - Original Size          8 bytes
	        if (entry.uncompressedSize === 0xffffffff) {
	          if (index + 8 > zip64EiefBuffer.length) {
	            return emitErrorAndAutoClose(self, new Error("zip64 extended information extra field does not include uncompressed size"));
	          }
	          entry.uncompressedSize = readUInt64LE(zip64EiefBuffer, index);
	          index += 8;
	        }
	        // 8 - Compressed Size        8 bytes
	        if (entry.compressedSize === 0xffffffff) {
	          if (index + 8 > zip64EiefBuffer.length) {
	            return emitErrorAndAutoClose(self, new Error("zip64 extended information extra field does not include compressed size"));
	          }
	          entry.compressedSize = readUInt64LE(zip64EiefBuffer, index);
	          index += 8;
	        }
	        // 16 - Relative Header Offset 8 bytes
	        if (entry.relativeOffsetOfLocalHeader === 0xffffffff) {
	          if (index + 8 > zip64EiefBuffer.length) {
	            return emitErrorAndAutoClose(self, new Error("zip64 extended information extra field does not include relative header offset"));
	          }
	          entry.relativeOffsetOfLocalHeader = readUInt64LE(zip64EiefBuffer, index);
	          index += 8;
	        }
	        // 24 - Disk Start Number      4 bytes
	      }

	      // check for Info-ZIP Unicode Path Extra Field (0x7075)
	      // see https://github.com/thejoshwolfe/yauzl/issues/33
	      if (self.decodeStrings) {
	        for (var i = 0; i < entry.extraFields.length; i++) {
	          var extraField = entry.extraFields[i];
	          if (extraField.id === 0x7075) {
	            if (extraField.data.length < 6) {
	              // too short to be meaningful
	              continue;
	            }
	            // Version       1 byte      version of this extra field, currently 1
	            if (extraField.data.readUInt8(0) !== 1) {
	              // > Changes may not be backward compatible so this extra
	              // > field should not be used if the version is not recognized.
	              continue;
	            }
	            // NameCRC32     4 bytes     File Name Field CRC32 Checksum
	            var oldNameCrc32 = extraField.data.readUInt32LE(1);
	            if (crc32.unsigned(buffer.slice(0, entry.fileNameLength)) !== oldNameCrc32) {
	              // > If the CRC check fails, this UTF-8 Path Extra Field should be
	              // > ignored and the File Name field in the header should be used instead.
	              continue;
	            }
	            // UnicodeName   Variable    UTF-8 version of the entry File Name
	            entry.fileName = decodeBuffer(extraField.data, 5, extraField.data.length, true);
	            break;
	          }
	        }
	      }

	      // validate file size
	      if (self.validateEntrySizes && entry.compressionMethod === 0) {
	        var expectedCompressedSize = entry.uncompressedSize;
	        if (entry.isEncrypted()) {
	          // traditional encryption prefixes the file data with a header
	          expectedCompressedSize += 12;
	        }
	        if (entry.compressedSize !== expectedCompressedSize) {
	          var msg = "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize;
	          return emitErrorAndAutoClose(self, new Error(msg));
	        }
	      }

	      if (self.decodeStrings) {
	        if (!self.strictFileNames) {
	          // allow backslash
	          entry.fileName = entry.fileName.replace(/\\/g, "/");
	        }
	        var errorMessage = validateFileName(entry.fileName, self.validateFileNameOptions);
	        if (errorMessage != null) return emitErrorAndAutoClose(self, new Error(errorMessage));
	      }
	      self.emit("entry", entry);

	      if (!self.lazyEntries) self._readEntry();
	    });
	  });
	};

	ZipFile.prototype.openReadStream = function(entry, options, callback) {
	  var self = this;
	  // parameter validation
	  var relativeStart = 0;
	  var relativeEnd = entry.compressedSize;
	  if (callback == null) {
	    callback = options;
	    options = {};
	  } else {
	    // validate options that the caller has no excuse to get wrong
	    if (options.decrypt != null) {
	      if (!entry.isEncrypted()) {
	        throw new Error("options.decrypt can only be specified for encrypted entries");
	      }
	      if (options.decrypt !== false) throw new Error("invalid options.decrypt value: " + options.decrypt);
	      if (entry.isCompressed()) {
	        if (options.decompress !== false) throw new Error("entry is encrypted and compressed, and options.decompress !== false");
	      }
	    }
	    if (options.decompress != null) {
	      if (!entry.isCompressed()) {
	        throw new Error("options.decompress can only be specified for compressed entries");
	      }
	      if (!(options.decompress === false || options.decompress === true)) {
	        throw new Error("invalid options.decompress value: " + options.decompress);
	      }
	    }
	    if (options.start != null || options.end != null) {
	      if (entry.isCompressed() && options.decompress !== false) {
	        throw new Error("start/end range not allowed for compressed entry without options.decompress === false");
	      }
	      if (entry.isEncrypted() && options.decrypt !== false) {
	        throw new Error("start/end range not allowed for encrypted entry without options.decrypt === false");
	      }
	    }
	    if (options.start != null) {
	      relativeStart = options.start;
	      if (relativeStart < 0) throw new Error("options.start < 0");
	      if (relativeStart > entry.compressedSize) throw new Error("options.start > entry.compressedSize");
	    }
	    if (options.end != null) {
	      relativeEnd = options.end;
	      if (relativeEnd < 0) throw new Error("options.end < 0");
	      if (relativeEnd > entry.compressedSize) throw new Error("options.end > entry.compressedSize");
	      if (relativeEnd < relativeStart) throw new Error("options.end < options.start");
	    }
	  }
	  // any further errors can either be caused by the zipfile,
	  // or were introduced in a minor version of yauzl,
	  // so should be passed to the client rather than thrown.
	  if (!self.isOpen) return callback(new Error("closed"));
	  if (entry.isEncrypted()) {
	    if (options.decrypt !== false) return callback(new Error("entry is encrypted, and options.decrypt !== false"));
	  }
	  // make sure we don't lose the fd before we open the actual read stream
	  self.reader.ref();
	  var buffer = newBuffer(30);
	  readAndAssertNoEof(self.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader, function(err) {
	    try {
	      if (err) return callback(err);
	      // 0 - Local file header signature = 0x04034b50
	      var signature = buffer.readUInt32LE(0);
	      if (signature !== 0x04034b50) {
	        return callback(new Error("invalid local file header signature: 0x" + signature.toString(16)));
	      }
	      // all this should be redundant
	      // 4 - Version needed to extract (minimum)
	      // 6 - General purpose bit flag
	      // 8 - Compression method
	      // 10 - File last modification time
	      // 12 - File last modification date
	      // 14 - CRC-32
	      // 18 - Compressed size
	      // 22 - Uncompressed size
	      // 26 - File name length (n)
	      var fileNameLength = buffer.readUInt16LE(26);
	      // 28 - Extra field length (m)
	      var extraFieldLength = buffer.readUInt16LE(28);
	      // 30 - File name
	      // 30+n - Extra field
	      var localFileHeaderEnd = entry.relativeOffsetOfLocalHeader + buffer.length + fileNameLength + extraFieldLength;
	      var decompress;
	      if (entry.compressionMethod === 0) {
	        // 0 - The file is stored (no compression)
	        decompress = false;
	      } else if (entry.compressionMethod === 8) {
	        // 8 - The file is Deflated
	        decompress = options.decompress != null ? options.decompress : true;
	      } else {
	        return callback(new Error("unsupported compression method: " + entry.compressionMethod));
	      }
	      var fileDataStart = localFileHeaderEnd;
	      var fileDataEnd = fileDataStart + entry.compressedSize;
	      if (entry.compressedSize !== 0) {
	        // bounds check now, because the read streams will probably not complain loud enough.
	        // since we're dealing with an unsigned offset plus an unsigned size,
	        // we only have 1 thing to check for.
	        if (fileDataEnd > self.fileSize) {
	          return callback(new Error("file data overflows file bounds: " +
	              fileDataStart + " + " + entry.compressedSize + " > " + self.fileSize));
	        }
	      }
	      var readStream = self.reader.createReadStream({
	        start: fileDataStart + relativeStart,
	        end: fileDataStart + relativeEnd,
	      });
	      var endpointStream = readStream;
	      if (decompress) {
	        var destroyed = false;
	        var inflateFilter = zlib$1.createInflateRaw();
	        readStream.on("error", function(err) {
	          // setImmediate here because errors can be emitted during the first call to pipe()
	          setImmediate(function() {
	            if (!destroyed) inflateFilter.emit("error", err);
	          });
	        });
	        readStream.pipe(inflateFilter);

	        if (self.validateEntrySizes) {
	          endpointStream = new AssertByteCountStream(entry.uncompressedSize);
	          inflateFilter.on("error", function(err) {
	            // forward zlib errors to the client-visible stream
	            setImmediate(function() {
	              if (!destroyed) endpointStream.emit("error", err);
	            });
	          });
	          inflateFilter.pipe(endpointStream);
	        } else {
	          // the zlib filter is the client-visible stream
	          endpointStream = inflateFilter;
	        }
	        // this is part of yauzl's API, so implement this function on the client-visible stream
	        endpointStream.destroy = function() {
	          destroyed = true;
	          if (inflateFilter !== endpointStream) inflateFilter.unpipe(endpointStream);
	          readStream.unpipe(inflateFilter);
	          // TODO: the inflateFilter may cause a memory leak. see Issue #27.
	          readStream.destroy();
	        };
	      }
	      callback(null, endpointStream);
	    } finally {
	      self.reader.unref();
	    }
	  });
	};

	function Entry() {
	}
	Entry.prototype.getLastModDate = function() {
	  return dosDateTimeToDate(this.lastModFileDate, this.lastModFileTime);
	};
	Entry.prototype.isEncrypted = function() {
	  return (this.generalPurposeBitFlag & 0x1) !== 0;
	};
	Entry.prototype.isCompressed = function() {
	  return this.compressionMethod === 8;
	};

	function dosDateTimeToDate(date, time) {
	  var day = date & 0x1f; // 1-31
	  var month = (date >> 5 & 0xf) - 1; // 1-12, 0-11
	  var year = (date >> 9 & 0x7f) + 1980; // 0-128, 1980-2108

	  var millisecond = 0;
	  var second = (time & 0x1f) * 2; // 0-29, 0-58 (even numbers)
	  var minute = time >> 5 & 0x3f; // 0-59
	  var hour = time >> 11 & 0x1f; // 0-23

	  return new Date(year, month, day, hour, minute, second, millisecond);
	}

	function validateFileName(fileName) {
	  if (fileName.indexOf("\\") !== -1) {
	    return "invalid characters in fileName: " + fileName;
	  }
	  if (/^[a-zA-Z]:/.test(fileName) || /^\//.test(fileName)) {
	    return "absolute path: " + fileName;
	  }
	  if (fileName.split("/").indexOf("..") !== -1) {
	    return "invalid relative path: " + fileName;
	  }
	  // all good
	  return null;
	}

	function readAndAssertNoEof(reader, buffer, offset, length, position, callback) {
	  if (length === 0) {
	    // fs.read will throw an out-of-bounds error if you try to read 0 bytes from a 0 byte file
	    return setImmediate(function() { callback(null, newBuffer(0)); });
	  }
	  reader.read(buffer, offset, length, position, function(err, bytesRead) {
	    if (err) return callback(err);
	    if (bytesRead < length) {
	      return callback(new Error("unexpected EOF"));
	    }
	    callback();
	  });
	}

	util.inherits(AssertByteCountStream, Transform);
	function AssertByteCountStream(byteCount) {
	  Transform.call(this);
	  this.actualByteCount = 0;
	  this.expectedByteCount = byteCount;
	}
	AssertByteCountStream.prototype._transform = function(chunk, encoding, cb) {
	  this.actualByteCount += chunk.length;
	  if (this.actualByteCount > this.expectedByteCount) {
	    var msg = "too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount;
	    return cb(new Error(msg));
	  }
	  cb(null, chunk);
	};
	AssertByteCountStream.prototype._flush = function(cb) {
	  if (this.actualByteCount < this.expectedByteCount) {
	    var msg = "not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount;
	    return cb(new Error(msg));
	  }
	  cb();
	};

	util.inherits(RandomAccessReader, EventEmitter);
	function RandomAccessReader() {
	  EventEmitter.call(this);
	  this.refCount = 0;
	}
	RandomAccessReader.prototype.ref = function() {
	  this.refCount += 1;
	};
	RandomAccessReader.prototype.unref = function() {
	  var self = this;
	  self.refCount -= 1;

	  if (self.refCount > 0) return;
	  if (self.refCount < 0) throw new Error("invalid unref");

	  self.close(onCloseDone);

	  function onCloseDone(err) {
	    if (err) return self.emit('error', err);
	    self.emit('close');
	  }
	};
	RandomAccessReader.prototype.createReadStream = function(options) {
	  var start = options.start;
	  var end = options.end;
	  if (start === end) {
	    var emptyStream = new PassThrough();
	    setImmediate(function() {
	      emptyStream.end();
	    });
	    return emptyStream;
	  }
	  var stream = this._readStreamForRange(start, end);

	  var destroyed = false;
	  var refUnrefFilter = new RefUnrefFilter(this);
	  stream.on("error", function(err) {
	    setImmediate(function() {
	      if (!destroyed) refUnrefFilter.emit("error", err);
	    });
	  });
	  refUnrefFilter.destroy = function() {
	    stream.unpipe(refUnrefFilter);
	    refUnrefFilter.unref();
	    stream.destroy();
	  };

	  var byteCounter = new AssertByteCountStream(end - start);
	  refUnrefFilter.on("error", function(err) {
	    setImmediate(function() {
	      if (!destroyed) byteCounter.emit("error", err);
	    });
	  });
	  byteCounter.destroy = function() {
	    destroyed = true;
	    refUnrefFilter.unpipe(byteCounter);
	    refUnrefFilter.destroy();
	  };

	  return stream.pipe(refUnrefFilter).pipe(byteCounter);
	};
	RandomAccessReader.prototype._readStreamForRange = function(start, end) {
	  throw new Error("not implemented");
	};
	RandomAccessReader.prototype.read = function(buffer, offset, length, position, callback) {
	  var readStream = this.createReadStream({start: position, end: position + length});
	  var writeStream = new Writable();
	  var written = 0;
	  writeStream._write = function(chunk, encoding, cb) {
	    chunk.copy(buffer, offset + written, 0, chunk.length);
	    written += chunk.length;
	    cb();
	  };
	  writeStream.on("finish", callback);
	  readStream.on("error", function(error) {
	    callback(error);
	  });
	  readStream.pipe(writeStream);
	};
	RandomAccessReader.prototype.close = function(callback) {
	  setImmediate(callback);
	};

	util.inherits(RefUnrefFilter, PassThrough);
	function RefUnrefFilter(context) {
	  PassThrough.call(this);
	  this.context = context;
	  this.context.ref();
	  this.unreffedYet = false;
	}
	RefUnrefFilter.prototype._flush = function(cb) {
	  this.unref();
	  cb();
	};
	RefUnrefFilter.prototype.unref = function(cb) {
	  if (this.unreffedYet) return;
	  this.unreffedYet = true;
	  this.context.unref();
	};

	var cp437 = '\u0000☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ';
	function decodeBuffer(buffer, start, end, isUtf8) {
	  if (isUtf8) {
	    return buffer.toString("utf8", start, end);
	  } else {
	    var result = "";
	    for (var i = start; i < end; i++) {
	      result += cp437[buffer[i]];
	    }
	    return result;
	  }
	}

	function readUInt64LE(buffer, offset) {
	  // there is no native function for this, because we can't actually store 64-bit integers precisely.
	  // after 53 bits, JavaScript's Number type (IEEE 754 double) can't store individual integers anymore.
	  // but since 53 bits is a whole lot more than 32 bits, we do our best anyway.
	  var lower32 = buffer.readUInt32LE(offset);
	  var upper32 = buffer.readUInt32LE(offset + 4);
	  // we can't use bitshifting here, because JavaScript bitshifting only works on 32-bit integers.
	  return upper32 * 0x100000000 + lower32;
	  // as long as we're bounds checking the result of this function against the total file size,
	  // we'll catch any overflow errors, because we already made sure the total file size was within reason.
	}

	// Node 10 deprecated new Buffer().
	var newBuffer;
	if (typeof Buffer.allocUnsafe === "function") {
	  newBuffer = function(len) {
	    return Buffer.allocUnsafe(len);
	  };
	} else {
	  newBuffer = function(len) {
	    return new Buffer(len);
	  };
	}

	function defaultCallback(err) {
	  if (err) throw err;
	}
	return yauzl;
}

var extractZip;
var hasRequiredExtractZip;

function requireExtractZip () {
	if (hasRequiredExtractZip) return extractZip;
	hasRequiredExtractZip = 1;
	const debug = requireSrc()('extract-zip');
	// eslint-disable-next-line node/no-unsupported-features/node-builtins
	const { createWriteStream, promises: fs } = fs__default;
	const getStream = requireGetStream();
	const path = path__default;
	const { promisify } = require$$1;
	const stream$1 = stream;
	const yauzl = requireYauzl();

	const openZip = promisify(yauzl.open);
	const pipeline = promisify(stream$1.pipeline);

	class Extractor {
	  constructor (zipPath, opts) {
	    this.zipPath = zipPath;
	    this.opts = opts;
	  }

	  async extract () {
	    debug('opening', this.zipPath, 'with opts', this.opts);

	    this.zipfile = await openZip(this.zipPath, { lazyEntries: true });
	    this.canceled = false;

	    return new Promise((resolve, reject) => {
	      this.zipfile.on('error', err => {
	        this.canceled = true;
	        reject(err);
	      });
	      this.zipfile.readEntry();

	      this.zipfile.on('close', () => {
	        if (!this.canceled) {
	          debug('zip extraction complete');
	          resolve();
	        }
	      });

	      this.zipfile.on('entry', async entry => {
	        /* istanbul ignore if */
	        if (this.canceled) {
	          debug('skipping entry', entry.fileName, { cancelled: this.canceled });
	          return
	        }

	        debug('zipfile entry', entry.fileName);

	        if (entry.fileName.startsWith('__MACOSX/')) {
	          this.zipfile.readEntry();
	          return
	        }

	        const destDir = path.dirname(path.join(this.opts.dir, entry.fileName));

	        try {
	          await fs.mkdir(destDir, { recursive: true });

	          const canonicalDestDir = await fs.realpath(destDir);
	          const relativeDestDir = path.relative(this.opts.dir, canonicalDestDir);

	          if (relativeDestDir.split(path.sep).includes('..')) {
	            throw new Error(`Out of bound path "${canonicalDestDir}" found while processing file ${entry.fileName}`)
	          }

	          await this.extractEntry(entry);
	          debug('finished processing', entry.fileName);
	          this.zipfile.readEntry();
	        } catch (err) {
	          this.canceled = true;
	          this.zipfile.close();
	          reject(err);
	        }
	      });
	    })
	  }

	  async extractEntry (entry) {
	    /* istanbul ignore if */
	    if (this.canceled) {
	      debug('skipping entry extraction', entry.fileName, { cancelled: this.canceled });
	      return
	    }

	    if (this.opts.onEntry) {
	      this.opts.onEntry(entry, this.zipfile);
	    }

	    const dest = path.join(this.opts.dir, entry.fileName);

	    // convert external file attr int into a fs stat mode int
	    const mode = (entry.externalFileAttributes >> 16) & 0xFFFF;
	    // check if it's a symlink or dir (using stat mode constants)
	    const IFMT = 61440;
	    const IFDIR = 16384;
	    const IFLNK = 40960;
	    const symlink = (mode & IFMT) === IFLNK;
	    let isDir = (mode & IFMT) === IFDIR;

	    // Failsafe, borrowed from jsZip
	    if (!isDir && entry.fileName.endsWith('/')) {
	      isDir = true;
	    }

	    // check for windows weird way of specifying a directory
	    // https://github.com/maxogden/extract-zip/issues/13#issuecomment-154494566
	    const madeBy = entry.versionMadeBy >> 8;
	    if (!isDir) isDir = (madeBy === 0 && entry.externalFileAttributes === 16);

	    debug('extracting entry', { filename: entry.fileName, isDir: isDir, isSymlink: symlink });

	    const procMode = this.getExtractedMode(mode, isDir) & 0o777;

	    // always ensure folders are created
	    const destDir = isDir ? dest : path.dirname(dest);

	    const mkdirOptions = { recursive: true };
	    if (isDir) {
	      mkdirOptions.mode = procMode;
	    }
	    debug('mkdir', { dir: destDir, ...mkdirOptions });
	    await fs.mkdir(destDir, mkdirOptions);
	    if (isDir) return

	    debug('opening read stream', dest);
	    const readStream = await promisify(this.zipfile.openReadStream.bind(this.zipfile))(entry);

	    if (symlink) {
	      const link = await getStream(readStream);
	      debug('creating symlink', link, dest);
	      await fs.symlink(link, dest);
	    } else {
	      await pipeline(readStream, createWriteStream(dest, { mode: procMode }));
	    }
	  }

	  getExtractedMode (entryMode, isDir) {
	    let mode = entryMode;
	    // Set defaults, if necessary
	    if (mode === 0) {
	      if (isDir) {
	        if (this.opts.defaultDirMode) {
	          mode = parseInt(this.opts.defaultDirMode, 10);
	        }

	        if (!mode) {
	          mode = 0o755;
	        }
	      } else {
	        if (this.opts.defaultFileMode) {
	          mode = parseInt(this.opts.defaultFileMode, 10);
	        }

	        if (!mode) {
	          mode = 0o644;
	        }
	      }
	    }

	    return mode
	  }
	}

	extractZip = async function (zipPath, opts) {
	  debug('creating target directory', opts.dir);

	  if (!path.isAbsolute(opts.dir)) {
	    throw new Error('Target directory is expected to be absolute')
	  }

	  await fs.mkdir(opts.dir, { recursive: true });
	  opts.dir = await fs.realpath(opts.dir);
	  return new Extractor(zipPath, opts).extract()
	};
	return extractZip;
}

var extractZipExports = requireExtractZip();
var extract = /*@__PURE__*/getDefaultExportFromCjs(extractZipExports);

class BraveSetup {
    downloadUrl;
    constructor() {
        this.downloadUrl = process.env.BRAVE_DOWNLOAD_URL || '';
        if (!this.downloadUrl) {
            throw new Error('BRAVE_DOWNLOAD_URL environment variable is not set');
        }
    }
    getZipFileName() {
        const url = new URL(this.downloadUrl);
        const pathSegments = url.pathname.split('/');
        return pathSegments[pathSegments.length - 1];
    }
    async downloadFile(url, dest) {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                maxRedirects: 10,
            });
            fs__default.writeFileSync(dest, Buffer.from(response.data));
        }
        catch (error) {
            // Clean up partial download if it exists
            if (fs__default.existsSync(dest)) {
                fs__default.unlinkSync(dest);
            }
            throw error;
        }
    }
    async unzipFile(zipPath, extractDir) {
        if (!fs__default.existsSync(extractDir)) {
            fs__default.mkdirSync(extractDir, { recursive: true });
        }
        try {
            await extract(zipPath, { dir: extractDir });
        }
        catch (error) {
            throw new Error(`Failed to unzip file: ${error}`);
        }
    }
    async init() {
        // If the download URL is not a remote URL, treat it as a local path to the binary
        if (!/^https?:\/\//.test(this.downloadUrl)) {
            return this.downloadUrl;
        }
        const zipFileName = this.getZipFileName();
        const zipFolderName = zipFileName.replace('.zip', '');
        let cacheDir = process.env.XDG_CACHE_HOME;
        if (!cacheDir) {
            if (process.platform === 'darwin') {
                cacheDir = path__default.join(os.homedir(), 'Library', 'Caches');
            }
            else {
                cacheDir = path__default.join(os.homedir(), '.cache');
            }
        }
        if (!fs__default.existsSync(cacheDir)) {
            fs__default.mkdirSync(cacheDir, { recursive: true });
        }
        const zipFolderPath = path__default.join(cacheDir, zipFolderName);
        // Platform-specific paths
        let bravePath = '';
        if (process.platform === 'darwin') {
            bravePath = path__default.join(zipFolderPath, 'Brave.app', 'Contents', 'MacOS', 'Brave Browser Development');
        }
        else {
            // Linux/others - assume binary is in the root of extracted folder or named 'brave'
            bravePath = path__default.join(zipFolderPath, 'brave');
        }
        if (fs__default.existsSync(bravePath)) {
            return bravePath;
        }
        if (!fs__default.existsSync(`${cacheDir}/${zipFileName}`)) {
            console.log('[browser] Downloading Brave...');
            await this.downloadFile(this.downloadUrl, `${cacheDir}/${zipFileName}`);
        }
        if (!fs__default.existsSync(bravePath)) {
            await this.unzipFile(`${cacheDir}/${zipFileName}`, zipFolderPath);
            fs__default.unlinkSync(`${cacheDir}/${zipFileName}`);
            // Ensure binary is executable on Linux
            if (process.platform !== 'darwin' && fs__default.existsSync(bravePath)) {
                fs__default.chmodSync(bravePath, '755');
            }
        }
        return bravePath;
    }
}

class CamoufoxSetup {
    downloadUrl;
    constructor() {
        this.downloadUrl = process.env.CAMOUFOX_DOWNLOAD_URL || '';
        if (!this.downloadUrl) {
            throw new Error('CAMOUFOX_DOWNLOAD_URL environment variable is not set');
        }
    }
    getZipFileName() {
        const url = new URL(this.downloadUrl);
        const pathSegments = url.pathname.split('/');
        return pathSegments[pathSegments.length - 1];
    }
    async downloadFile(url, dest) {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                maxRedirects: 10,
            });
            fs__default.writeFileSync(dest, Buffer.from(response.data));
        }
        catch (error) {
            // Clean up partial download if it exists
            if (fs__default.existsSync(dest)) {
                fs__default.unlinkSync(dest);
            }
            throw error;
        }
    }
    async unzipFile(zipPath, extractDir) {
        if (!fs__default.existsSync(extractDir)) {
            fs__default.mkdirSync(extractDir, { recursive: true });
        }
        try {
            await extract(zipPath, { dir: extractDir });
        }
        catch (error) {
            throw new Error(`Failed to unzip file: ${error}`);
        }
    }
    async init() {
        // If the download URL is not a remote URL, treat it as a local path to the binary
        if (!/^https?:\/\//.test(this.downloadUrl)) {
            console.log(`[browser] CAMOUFOX_DOWNLOAD_URL is not a URL, treating as a local path: ${this.downloadUrl}`);
            return this.downloadUrl;
        }
        const zipFileName = this.getZipFileName();
        const zipFolderName = zipFileName.replace('.zip', '');
        let cacheDir = process.env.XDG_CACHE_HOME;
        if (!cacheDir) {
            if (process.platform === 'darwin') {
                cacheDir = path__default.join(os.homedir(), 'Library', 'Caches');
            }
            else {
                cacheDir = path__default.join(os.homedir(), '.cache');
            }
        }
        if (!fs__default.existsSync(cacheDir)) {
            fs__default.mkdirSync(cacheDir, { recursive: true });
        }
        const zipFolderPath = path__default.join(cacheDir, zipFolderName);
        // Platform-specific paths
        let camoufoxPath = '';
        if (process.platform === 'darwin') {
            camoufoxPath = path__default.join(zipFolderPath, 'Camoufox.app', 'Contents', 'MacOS', 'camoufox');
        }
        else {
            // Linux/others - assume binary is in the root of extracted folder or named 'camoufox'
            camoufoxPath = path__default.join(zipFolderPath, 'camoufox');
        }
        if (fs__default.existsSync(camoufoxPath)) {
            return camoufoxPath;
        }
        if (!fs__default.existsSync(`${cacheDir}/${zipFileName}`)) {
            console.log('[browser] Downloading Camoufox...');
            await this.downloadFile(this.downloadUrl, `${cacheDir}/${zipFileName}`);
        }
        if (!fs__default.existsSync(camoufoxPath)) {
            await this.unzipFile(`${cacheDir}/${zipFileName}`, zipFolderPath);
            fs__default.unlinkSync(`${cacheDir}/${zipFileName}`);
            // Ensure binary is executable on Linux
            if (process.platform !== 'darwin' && fs__default.existsSync(camoufoxPath)) {
                fs__default.chmodSync(camoufoxPath, '755');
            }
        }
        return camoufoxPath;
    }
}

const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path__default.dirname(__filename$1);
/**
 * Loads the shared browser fingerprint configuration.
 * Returns the JSON string for CAMOU_CONFIG_1, or null if not found.
 */
function loadBrowserConfig(quiet) {
    try {
        const configName = process.platform === 'darwin'
            ? 'browserConfig.json'
            : 'browserConfig-linux.json';
        const configPath = path__default.join(__dirname$1, `./${configName}`);
        const configData = fs__default.readFileSync(configPath, 'utf8');
        // Parse the JSON to modify it
        const config = JSON.parse(configData);
        if (!quiet) {
            console.log(`[browser] Loading ${configName} for platform ${process.platform}`);
        }
        // Return the modified configuration as JSON string
        return JSON.stringify(config);
    }
    catch (error) {
        console.error('[browser] Failed to load browser config:', error);
        return null;
    }
}
/**
 * Launches one or more browser servers with the shared configuration.
 */
async function launchBrowserServers(options) {
    const { numServers, browserType, headless = true, quiet = false } = options;
    const browserLabel = browserType === 'brave' ? 'Brave' : 'Camoufox';
    if (!quiet) {
        console.log(`[browser] Launching ${numServers} ${browserLabel} browser server(s)...`);
    }
    let executablePath;
    const playwrightBrowser = browserType === 'brave' ? chromium : firefox;
    if (browserType === 'brave') {
        const setup = new BraveSetup();
        executablePath = await setup.init();
    }
    else {
        const setup = new CamoufoxSetup();
        executablePath = await setup.init();
    }
    // Copy process.env, filtering out undefined values
    const env = {};
    for (const [key, value] of Object.entries(process.env)) {
        if (value !== undefined) {
            env[key] = value;
        }
    }
    // Camoufox uses CAMOU_CONFIG_1 for fingerprint configuration
    if (browserType === 'camoufox') {
        const browserConfig = loadBrowserConfig(quiet);
        // Enable software OpenGL rendering (required for WebGL in WSL/headless)
        env.LIBGL_ALWAYS_SOFTWARE = '1';
        if (browserConfig) {
            env.CAMOU_CONFIG_1 = browserConfig;
            if (!quiet) {
                console.log('[browser] Loaded browser configuration for CAMOU_CONFIG_1');
            }
        }
        else if (!quiet) {
            console.warn('[browser] No browser configuration loaded - continuing without CAMOU_CONFIG_1');
        }
    }
    const browserServers = [];
    for (let i = 0; i < numServers; i++) {
        const browserServer = await playwrightBrowser.launchServer({
            headless,
            executablePath,
            env,
            firefoxUserPrefs: {
                'webgl.force-enabled': true,
                'webgl.disabled': false,
                'gfx.webrender.software': true,
            },
        });
        browserServers.push(browserServer);
        if (!quiet) {
            const wsEndpoint = browserServer.wsEndpoint();
            console.log(`[browser] ${browserLabel} server ${i + 1}/${numServers} started: ${wsEndpoint}`);
        }
    }
    return browserServers;
}

class BrowserProxy {
    clients = new Map();
    pools = {
        camoufox: { servers: [], currentIndex: 0 },
        brave: { servers: [], currentIndex: 0 },
    };
    quiet = false;
    constructor(browserServers = [], quiet = false) {
        // Legacy: treat initial servers as camoufox for backwards compatibility
        this.pools.camoufox.servers = browserServers;
        this.quiet = quiet;
    }
    /**
     * Registers a new proxy client with a specific browser type
     */
    registerClient(ws, browserType = 'camoufox') {
        this.clients.set(ws, {
            meta: { type: 'proxy' },
            browserWs: null,
            isConnecting: false,
            messageQueue: [],
            browserType,
        });
        if (!this.quiet) {
            console.log(`[proxy] Browser proxy client connected (${browserType})`);
        }
        // Set up client-side cleanup handlers
        ws.on('close', () => this.handleClientDisconnect(ws));
        ws.on('error', (error) => {
            console.error('[proxy] Client WebSocket error:', error);
            this.handleClientDisconnect(ws);
        });
    }
    /**
     * Handles client disconnection
     */
    handleClientDisconnect(ws) {
        const connection = this.clients.get(ws);
        if (connection?.browserWs) {
            if (!this.quiet) {
                console.log('[proxy] Closing browser WebSocket due to client disconnect');
            }
            connection.browserWs.close();
        }
        this.clients.delete(ws);
    }
    /**
     * Handles browser proxy messages (existing functionality)
     */
    handleBrowserProxyMessage(clientWs, msg) {
        const connection = this.clients.get(clientWs);
        if (!connection) {
            console.error('[proxy] Client connection not found');
            clientWs.close(1011, 'Client not registered');
            return;
        }
        const pool = this.pools[connection.browserType];
        if (pool.servers.length === 0) {
            clientWs.close(1011, 'Browser server not available');
            return;
        }
        // If browser WebSocket already exists and is open, just forward the message
        if (connection.browserWs &&
            connection.browserWs.readyState === WebSocket.OPEN) {
            connection.browserWs.send(msg);
            return;
        }
        // If already connecting, queue the message
        if (connection.isConnecting) {
            if (!this.quiet) {
                console.log('[proxy] Browser WebSocket still connecting, queuing message');
            }
            connection.messageQueue.push(msg);
            return;
        }
        // Create browser WebSocket connection only once
        this.createBrowserConnection(clientWs, connection, msg);
    }
    /**
     * Creates a browser WebSocket connection for a client (once per client)
     */
    createBrowserConnection(clientWs, connection, initialMsg) {
        const pool = this.pools[connection.browserType];
        if (pool.servers.length === 0) {
            clientWs.close(1011, 'Browser server not available');
            return;
        }
        // Round-robin: select next browser server from the correct pool
        const browserServer = pool.servers[pool.currentIndex];
        if (!browserServer) {
            throw new Error(`[proxy] Expected a ${connection.browserType} browser server with index ${pool.currentIndex} to exist, there are currently ${pool.servers.length} servers registered`);
        }
        pool.currentIndex = (pool.currentIndex + 1) % pool.servers.length;
        connection.isConnecting = true;
        const wsEndpoint = browserServer.wsEndpoint();
        if (!this.quiet) {
            console.log(`[proxy] Creating ${connection.browserType} browser WebSocket connection to server ${pool.currentIndex}/${pool.servers.length}: ${wsEndpoint}`);
        }
        const browserWs = new WebSocket(wsEndpoint, {
            handshakeTimeout: 30000,
            perMessageDeflate: false,
        });
        connection.browserWs = browserWs;
        browserWs.on('open', () => {
            if (!this.quiet) {
                console.log('[proxy] Browser WebSocket connected');
            }
            connection.isConnecting = false;
            // Send the initial message that triggered this connection
            if (browserWs.readyState === WebSocket.OPEN) {
                browserWs.send(initialMsg);
                // Send all queued messages
                while (connection.messageQueue.length > 0) {
                    const queuedMsg = connection.messageQueue.shift();
                    if (queuedMsg && browserWs.readyState === WebSocket.OPEN) {
                        browserWs.send(queuedMsg);
                    }
                }
            }
            // Set up one-time bidirectional message forwarding
            this.setupMessageForwarding(clientWs, browserWs);
        });
        browserWs.on('error', (error) => {
            console.error('[proxy] Browser WebSocket error:', error);
            connection.isConnecting = false;
            connection.browserWs = null;
            connection.messageQueue = []; // Clear queue on error
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.close(1011, 'Browser connection error');
            }
        });
        browserWs.on('close', (code, reason) => {
            if (!this.quiet) {
                console.log(`[proxy] Browser WebSocket closed: ${code} ${reason}`);
            }
            connection.isConnecting = false;
            connection.browserWs = null;
            connection.messageQueue = []; // Clear queue on close
            if (clientWs.readyState === WebSocket.OPEN) {
                // Convert Buffer reason to UTF-8 string and truncate to 123 bytes max
                let closeReason;
                if (reason && Buffer.isBuffer(reason)) {
                    // Slice to max 123 bytes and convert to UTF-8 string
                    const truncatedBuffer = reason.subarray(0, 123);
                    closeReason = truncatedBuffer.toString('utf8');
                }
                else if (reason) {
                    // Handle case where reason is already a string
                    closeReason = String(reason).slice(0, 123);
                }
                clientWs.close(code, closeReason);
            }
        });
        browserWs.on('unexpected-response', (_req, res) => {
            console.error(`[proxy] Unexpected response from browser WebSocket: ${res.statusCode}`);
            connection.isConnecting = false;
            connection.browserWs = null;
            connection.messageQueue = []; // Clear queue on failure
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.close(1011, 'Browser connection failed');
            }
        });
    }
    /**
     * Sets up bidirectional message forwarding between client and browser WebSockets (once per connection)
     */
    setupMessageForwarding(clientWs, browserWs) {
        // Forward messages from browser to client
        browserWs.on('message', (data, isBinary) => {
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data, { binary: isBinary });
            }
        });
        // Note: We don't set up clientWs.on("message") here because that's handled
        // by the WebSocketManager calling handleBrowserProxyMessage for each message
    }
    /**
     * Updates the browser servers for a specific browser type
     */
    setBrowserServers(browserServers, browserType = 'camoufox') {
        this.pools[browserType].servers = browserServers;
        this.pools[browserType].currentIndex = 0;
    }
}

// Type guards for inbound messages
function isRegisterProfileMessage(msg) {
    return (msg.type === 'register-profile' &&
        typeof msg.uuid === 'string');
}
function isUnregisterProfileMessage(msg) {
    return (msg.type === 'unregister-profile' &&
        typeof msg.uuid === 'string');
}
function isScreenshotMessage(msg) {
    const m = msg;
    return (msg.type === 'screenshot' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string' &&
        typeof m.pageTitle === 'string' &&
        typeof m.base64 === 'string');
}
function isSubscribeMessage(msg) {
    return (msg.type === 'subscribe' &&
        typeof msg.uuid === 'string');
}
function isSubscribePageMessage(msg) {
    const m = msg;
    return (msg.type === 'subscribe-page' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string');
}
function isPageOpenedMessage(msg) {
    const m = msg;
    return (msg.type === 'page-opened' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string' &&
        typeof m.pageTitle === 'string');
}
function isPageClosedMessage(msg) {
    const m = msg;
    return (msg.type === 'page-closed' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string');
}
function isStartStreamingMessage(msg) {
    return (msg.type === 'start-streaming' &&
        typeof msg.uuid === 'string');
}
function isStopStreamingMessage(msg) {
    return (msg.type === 'stop-streaming' &&
        typeof msg.uuid === 'string');
}
// Type guards for input commands
function isMouseMoveCommand(msg) {
    const m = msg;
    return (msg.type === 'mouse-move' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string' &&
        typeof m.x === 'number' &&
        typeof m.y === 'number');
}
function isMouseClickCommand(msg) {
    const m = msg;
    return (msg.type === 'mouse-click' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string' &&
        typeof m.x === 'number' &&
        typeof m.y === 'number' &&
        ['left', 'right', 'middle'].includes(m.button) &&
        [1, 2].includes(m.clickCount));
}
function isKeyboardTypeCommand(msg) {
    const m = msg;
    return (msg.type === 'keyboard-type' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string' &&
        typeof m.text === 'string');
}
function isKeyboardPressCommand(msg) {
    const m = msg;
    return (msg.type === 'keyboard-press' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string' &&
        typeof m.key === 'string');
}
function isScrollCommand(msg) {
    const m = msg;
    return (msg.type === 'scroll' &&
        typeof m.uuid === 'string' &&
        typeof m.pageId === 'string' &&
        typeof m.deltaX === 'number' &&
        typeof m.deltaY === 'number');
}
// Runtime validation function
function validateInboundMessage(data) {
    if (!data || typeof data !== 'object' || !('type' in data)) {
        return null;
    }
    const msg = data;
    if (isRegisterProfileMessage(msg))
        return msg;
    if (isUnregisterProfileMessage(msg))
        return msg;
    if (isScreenshotMessage(msg))
        return msg;
    if (isSubscribeMessage(msg))
        return msg;
    if (isSubscribePageMessage(msg))
        return msg;
    if (isPageOpenedMessage(msg))
        return msg;
    if (isPageClosedMessage(msg))
        return msg;
    if (isStartStreamingMessage(msg))
        return msg;
    if (isStopStreamingMessage(msg))
        return msg;
    if (isMouseMoveCommand(msg))
        return msg;
    if (isMouseClickCommand(msg))
        return msg;
    if (isKeyboardTypeCommand(msg))
        return msg;
    if (isKeyboardPressCommand(msg))
        return msg;
    if (isScrollCommand(msg))
        return msg;
    return null;
}

// Note: Page cleanup timers were removed as they are redundant.
// Pages are cleaned up via:
// 1. Explicit page-closed messages from the producer
// 2. Profile cleanup when producer disconnects
// Message handler functions keyed by message type
const handleRegisterProfile = (hub, ws, message) => {
    const { uuid } = message;
    // If this profile is already registered with a different WebSocket, clean it up first
    if (hub.activeProfiles.has(uuid)) {
        const oldWs = hub.activeProfiles.get(uuid);
        if (oldWs && oldWs !== ws) {
            console.log(`[screenshot] Profile ${uuid} re-registering, cleaning up old connection`);
            // Remove from old WebSocket's profile tracking
            if (hub.wsProfiles.has(oldWs)) {
                hub.wsProfiles.get(oldWs).delete(uuid);
                if (hub.wsProfiles.get(oldWs).size === 0) {
                    hub.wsProfiles.delete(oldWs);
                }
            }
        }
    }
    hub.clients.set(ws, { type: 'producer', uuid });
    hub.activeProfiles.set(uuid, ws);
    // Track this profile for this WebSocket
    if (!hub.wsProfiles.has(ws)) {
        hub.wsProfiles.set(ws, new Set());
    }
    hub.wsProfiles.get(ws).add(uuid);
    // Log WebSocket identity for debugging
    const wsId = ws.__wsId || 'unknown';
    console.log(`[screenshot] Profile registered: ${uuid} (wsId: ${wsId})`);
    hub.broadcastAll({
        type: 'profiles-updated',
        profiles: [...hub.activeProfiles.keys()],
    });
};
const handleUnregisterProfile = (hub, ws, message) => {
    const { uuid } = message;
    console.log(`[screenshot] Profile unregistered: ${uuid}`);
    // Cancel any pending cleanup timer for this profile
    hub.cancelProfileCleanupTimer(uuid);
    // Remove from wsProfiles tracking
    if (hub.wsProfiles.has(ws)) {
        hub.wsProfiles.get(ws).delete(uuid);
        if (hub.wsProfiles.get(ws).size === 0) {
            hub.wsProfiles.delete(ws);
        }
    }
    hub.cleanupProfile(uuid);
};
const handleScreenshot = (hub, _ws, message) => {
    const { uuid, pageId, pageTitle, base64, mouseX, mouseY } = message;
    if (hub.activeProfiles.has(uuid)) {
        // Update page information
        if (!hub.profilePages.has(uuid)) {
            hub.profilePages.set(uuid, new Map());
        }
        const pagesMap = hub.profilePages.get(uuid);
        if (!pagesMap) {
            console.error(`[ReplayHub] Failed to get pages map for profile ${uuid}`);
            return;
        }
        const isNewPage = !pagesMap.has(pageId);
        pagesMap.set(pageId, { pageId, pageTitle });
        // Note: Profile cleanup only happens when producer disconnects
        // Cache the latest screenshot by pageId
        hub.lastScreenshots.set(pageId, base64);
        // If this is the first time we see this page, notify all viewers (lightweight)
        if (isNewPage) {
            hub.broadcastAll({
                type: 'page-opened',
                uuid,
                pageId,
                pageTitle,
            });
        }
        // Send screenshot to subscribed viewers only (bandwidth intensive)
        hub.broadcastToProfile(uuid, {
            type: 'new-screenshot',
            uuid,
            pageId,
            pageTitle,
            base64,
            mouseX: mouseX,
            mouseY: mouseY,
        });
        // Broadcast updated pages list to all viewers (lightweight)
        hub.broadcastAll({
            type: 'pages-updated',
            uuid,
            pages: Array.from(pagesMap.values()),
        });
    }
};
const handleSubscribe = (hub, ws, message) => {
    const { uuid } = message;
    // Check if viewer was previously subscribed to a different profile
    const oldMeta = hub.clients.get(ws);
    if (oldMeta?.type === 'viewer' && oldMeta.uuid && oldMeta.uuid !== uuid) {
        // Remove from old profile's viewer set
        hub.removeViewer(oldMeta.uuid, ws);
    }
    // If uuid is empty, viewer is unsubscribing from all profiles
    if (!uuid) {
        hub.clients.set(ws, { type: 'viewer' }); // Clear uuid
        return;
    }
    hub.clients.set(ws, { type: 'viewer', uuid });
    // Add viewer and potentially start streaming
    hub.addViewer(uuid, ws);
    // Send available pages for this profile
    if (hub.profilePages.has(uuid)) {
        const pages = Array.from(hub.profilePages.get(uuid).values());
        ws.send(JSON.stringify({
            type: 'pages-updated',
            uuid,
            pages: pages,
        }));
    }
};
const handleSubscribePage = (hub, ws, message) => {
    const { uuid, pageId } = message;
    // Check if viewer was previously subscribed to a different profile
    const oldMeta = hub.clients.get(ws);
    if (oldMeta?.type === 'viewer' && oldMeta.uuid && oldMeta.uuid !== uuid) {
        // Remove from old profile's viewer set
        hub.removeViewer(oldMeta.uuid, ws);
        console.log(`[screenshot] Viewer unsubscribed from ${oldMeta.uuid} (switching to ${uuid})`);
    }
    hub.clients.set(ws, { type: 'viewer', uuid });
    console.log(`[screenshot] Viewer subscribed to page ${pageId} in profile ${uuid}`);
    // Add viewer and potentially start streaming
    hub.addViewer(uuid, ws);
    // Send the last available screenshot for this specific page
    const lastScreenshot = hub.lastScreenshots.get(pageId);
    if (lastScreenshot && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'new-screenshot',
            uuid,
            pageId,
            base64: lastScreenshot,
        }));
        console.log(`[screenshot] Sent cached screenshot to viewer for page ${pageId}`);
    }
};
const handlePageOpened = (hub, _ws, message) => {
    const { uuid, pageId, pageTitle } = message;
    if (hub.activeProfiles.has(uuid)) {
        // Update page information
        if (!hub.profilePages.has(uuid)) {
            hub.profilePages.set(uuid, new Map());
        }
        hub.profilePages.get(uuid).set(pageId, { pageId, pageTitle });
        console.log(`[page-lifecycle] Page opened: ${pageId} (${pageTitle}) in profile ${uuid}`);
        // Broadcast page-opened event to all viewers (lightweight notification)
        hub.broadcastAll({
            type: 'page-opened',
            uuid,
            pageId,
            pageTitle,
        });
        // Broadcast updated pages list to all viewers (lightweight)
        hub.broadcastAll({
            type: 'pages-updated',
            uuid,
            pages: Array.from(hub.profilePages.get(uuid).values()),
        });
    }
};
const handlePageClosed = (hub, _ws, message) => {
    const { uuid, pageId } = message;
    if (hub.activeProfiles.has(uuid) && hub.profilePages.has(uuid)) {
        // Remove page from profile pages
        const pages = hub.profilePages.get(uuid);
        pages.delete(pageId);
        // Clean up cached screenshot for this page
        hub.lastScreenshots.delete(pageId);
        console.log(`[page-lifecycle] Page closed: ${pageId} in profile ${uuid}`);
        // Always broadcast updated pages (possibly empty) to keep UI in sync
        hub.broadcastAll({
            type: 'pages-updated',
            uuid,
            pages: Array.from(pages.values()),
        });
        // Notify all viewers that this specific page was closed
        hub.broadcastAll({
            type: 'page-closed',
            uuid,
            pageId,
        });
        // Note: Profile cleanup only happens when producer disconnects, not when pages close
    }
};
const handleInputCommand = (hub, ws, message) => {
    const { uuid } = message;
    // Verify sender is a viewer subscribed to this profile
    const clientMeta = hub.clients.get(ws);
    if (clientMeta?.type !== 'viewer' || clientMeta.uuid !== uuid) {
        return;
    }
    // Find the producer WebSocket for this profile
    const producerWs = hub.activeProfiles.get(uuid);
    if (!producerWs || producerWs.readyState !== WebSocket.OPEN) {
        return;
    }
    // Forward the command to the producer
    producerWs.send(JSON.stringify(message));
};
class ReplayHub {
    clients = new Map();
    activeProfiles = new Map(); // uuid -> producer socket
    wsProfiles = new Map(); // WebSocket -> Set of profile uuids
    lastScreenshots = new Map(); // pageId -> base64 screenshot
    profilePages = new Map(); // profileId -> Map<pageId, pageInfo>
    profileCleanupTimers = new Map(); // uuid -> cleanup timer (disabled)
    profileViewers = new Map(); // uuid -> Set of viewer sockets
    /**
     * Broadcasts message to all connected clients
     */
    broadcastAll(msg) {
        const data = JSON.stringify(msg);
        for (const ws of this.clients.keys()) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        }
    }
    /**
     * Broadcasts message to viewers of a specific profile
     */
    broadcastToProfile(uuid, msg) {
        const data = JSON.stringify(msg);
        let sentCount = 0;
        for (const [ws, meta] of this.clients.entries()) {
            if (meta.type === 'viewer' &&
                meta.uuid === uuid &&
                ws.readyState === WebSocket.OPEN) {
                ws.send(data);
                sentCount++;
            }
        }
        if (sentCount === 0 && msg.type === 'new-screenshot') {
            console.log(`[broadcast] No viewers subscribed to profile ${uuid} for screenshot. Total clients: ${this.clients.size}`);
        }
    }
    /**
     * Adds a viewer to a profile and starts streaming if this is the first viewer
     */
    addViewer(uuid, ws) {
        if (!this.profileViewers.has(uuid)) {
            this.profileViewers.set(uuid, new Set());
        }
        const viewers = this.profileViewers.get(uuid);
        const wasEmpty = viewers.size === 0;
        viewers.add(ws);
        // If this is the first viewer, tell the producer to start streaming
        if (wasEmpty && this.activeProfiles.has(uuid)) {
            const producerWs = this.activeProfiles.get(uuid);
            if (producerWs.readyState === WebSocket.OPEN) {
                producerWs.send(JSON.stringify({
                    type: 'start-streaming',
                    uuid,
                }));
                console.log(`[screenshot] Started streaming for profile ${uuid} (first viewer)`);
            }
        }
    }
    /**
     * Removes a viewer from a profile and stops streaming if this was the last viewer
     */
    removeViewer(uuid, ws) {
        if (!this.profileViewers.has(uuid)) {
            console.log(`[removeViewer] Profile ${uuid} not in profileViewers map`);
            return;
        }
        const viewers = this.profileViewers.get(uuid);
        const hadViewer = viewers.has(ws);
        viewers.delete(ws);
        console.log(`[removeViewer] Removed viewer from ${uuid}, had viewer: ${hadViewer}, remaining: ${viewers.size}`);
        // If no more viewers, tell the producer to stop streaming
        if (viewers.size === 0) {
            if (!this.activeProfiles.has(uuid)) {
                console.log(`[removeViewer] Profile ${uuid} not in activeProfiles, cannot send stop-streaming`);
            }
            else {
                const producerWs = this.activeProfiles.get(uuid);
                if (producerWs.readyState !== WebSocket.OPEN) {
                    console.log(`[removeViewer] Producer WebSocket for ${uuid} not open (state: ${producerWs.readyState})`);
                }
                else {
                    producerWs.send(JSON.stringify({
                        type: 'stop-streaming',
                        uuid,
                    }));
                    console.log(`[screenshot] Stopped streaming for profile ${uuid} (no viewers)`);
                }
            }
            this.profileViewers.delete(uuid);
        }
    }
    /**
     * Gets the number of active viewers for a profile
     */
    getViewerCount(uuid) {
        return this.profileViewers.get(uuid)?.size || 0;
    }
    /**
     * Handles screenshot streaming messages with type-safe dispatch
     */
    handleScreenshotMessage(ws, data) {
        // Validate and narrow the message type
        const validatedMessage = validateInboundMessage(data);
        if (!validatedMessage) {
            console.warn(`[screenshot] Invalid message received:`, data);
            return;
        }
        // Type-safe message dispatch using switch statement
        switch (validatedMessage.type) {
            case 'register-profile':
                handleRegisterProfile(this, ws, validatedMessage);
                break;
            case 'unregister-profile':
                handleUnregisterProfile(this, ws, validatedMessage);
                break;
            case 'screenshot':
                handleScreenshot(this, ws, validatedMessage);
                break;
            case 'subscribe':
                handleSubscribe(this, ws, validatedMessage);
                break;
            case 'subscribe-page':
                handleSubscribePage(this, ws, validatedMessage);
                break;
            case 'page-opened':
                handlePageOpened(this, ws, validatedMessage);
                break;
            case 'page-closed':
                handlePageClosed(this, ws, validatedMessage);
                break;
            case 'mouse-move':
            case 'mouse-click':
            case 'keyboard-type':
            case 'keyboard-press':
            case 'scroll':
                handleInputCommand(this, ws, validatedMessage);
                break;
            default:
                console.warn(`[screenshot] Unknown message type: ${validatedMessage.type}`);
        }
    }
    /**
     * Cancels cleanup timer for a profile (legacy - kept for compatibility)
     * NOTE: Profile cleanup timers are disabled. Profiles are only cleaned up when:
     * 1. Producer explicitly sends unregister-profile message
     * 2. Producer WebSocket disconnects
     */
    cancelProfileCleanupTimer(uuid) {
        if (this.profileCleanupTimers.has(uuid)) {
            clearTimeout(this.profileCleanupTimers.get(uuid));
            this.profileCleanupTimers.delete(uuid);
            console.log(`[cleanup] Cancelled cleanup timer for profile ${uuid}`);
        }
    }
    /**
     * Cleans up a profile completely
     */
    cleanupProfile(uuid) {
        console.log(`[cleanup] Cleaning up profile ${uuid}`);
        this.activeProfiles.delete(uuid);
        // Clean up cached screenshots for all pages in this profile
        if (this.profilePages.has(uuid)) {
            const pages = this.profilePages.get(uuid);
            for (const pageInfo of pages.values()) {
                this.lastScreenshots.delete(pageInfo.pageId);
            }
            this.profilePages.delete(uuid);
        }
        // Clear cleanup timer
        this.profileCleanupTimers.delete(uuid);
        // Notify all viewers that this stream has ended
        this.broadcastAll({
            type: 'stream-ended',
            uuid: uuid,
        });
        this.broadcastAll({
            type: 'profiles-updated',
            profiles: [...this.activeProfiles.keys()],
        });
    }
    /**
     * Handles client disconnection cleanup
     */
    handleClientDisconnect(ws) {
        const meta = this.clients.get(ws);
        // If this is a producer, clean up ALL profiles registered by this WebSocket
        if (meta?.type === 'producer') {
            const profiles = this.wsProfiles.get(ws);
            if (profiles && profiles.size > 0) {
                console.log(`[screenshot] Producer disconnected, cleaning up ${profiles.size} profile(s)`);
                for (const uuid of profiles) {
                    // Cancel any pending cleanup timers before cleaning up
                    this.cancelProfileCleanupTimer(uuid);
                    this.cleanupProfile(uuid);
                }
                this.wsProfiles.delete(ws);
            }
        }
        else if (meta?.type === 'viewer' && meta.uuid) {
            // Remove viewer and potentially stop streaming
            this.removeViewer(meta.uuid, ws);
            console.log(`[screenshot] Viewer disconnected from ${meta.uuid}`);
        }
        this.clients.delete(ws);
    }
    /**
     * Initializes a new client connection for replay functionality
     */
    initializeReplayClient(ws) {
        this.clients.set(ws, { type: 'viewer' }); // default to viewer
        console.log('[replay] Screenshot streaming client connected');
        // Send current available profiles to the newly connected viewer
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'profiles-updated',
                profiles: [...this.activeProfiles.keys()],
            }));
            // Send cached pages-updated for all active profiles
            for (const [uuid, pagesMap] of this.profilePages.entries()) {
                if (pagesMap.size > 0) {
                    ws.send(JSON.stringify({
                        type: 'pages-updated',
                        uuid,
                        pages: Array.from(pagesMap.values()),
                    }));
                }
            }
        }
    }
}

class WebSocketManager {
    config;
    replayHub;
    browserProxy;
    authManager;
    wsServer = null;
    wsServerUrl = null;
    connectionReporter = null;
    isDraining = false;
    constructor(config, replayHub, browserProxy, authManager) {
        this.config = config;
        this.replayHub = replayHub;
        this.browserProxy = browserProxy;
        this.authManager = authManager;
    }
    /**
     * Creates and configures the WebSocket server with path-based routing
     */
    async createWebSocketServer() {
        const wsOptions = {
            verifyClient: (info) => {
                return this.verifyClient(info);
            },
        };
        // Use HTTPS server if provided, otherwise use port/host
        if (this.config.httpsServer) {
            wsOptions.server = this.config.httpsServer;
            this.config.httpsServer.listen(this.config.port, this.config.host);
        }
        else {
            wsOptions.port = this.config.port;
            wsOptions.host = this.config.host;
        }
        this.wsServer = new WebSocketServer(wsOptions);
        this.wsServer.on('connection', (clientWs, req) => {
            this.handleConnection(clientWs, req);
        });
        const protocol = this.config.httpsServer ? 'wss' : 'ws';
        this.wsServerUrl = `${protocol}://${this.config.host}:${this.config.port}`;
        this.logServerInfo();
        this.authManager.logAuthStatus();
    }
    /**
     * Sets the server to draining mode
     */
    setDraining(draining) {
        this.isDraining = draining;
        if (draining && !this.config.quiet) {
            console.log('[wss] WebSocket Manager entered DRAINING mode - rejecting new proxy connections');
        }
    }
    /**
     * Extracts the pathname from a request URL (strips query params)
     */
    getPathname(url) {
        if (!url)
            return '';
        const qIndex = url.indexOf('?');
        return qIndex === -1 ? url : url.slice(0, qIndex);
    }
    /**
     * Extracts the browser type from a request URL query parameter
     */
    getBrowserType(url) {
        if (!url)
            return 'camoufox';
        const qIndex = url.indexOf('?');
        if (qIndex === -1)
            return 'camoufox';
        const params = new URLSearchParams(url.slice(qIndex));
        const browser = params.get('browser');
        if (browser === 'brave')
            return 'brave';
        return 'camoufox';
    }
    /**
     * Verifies client connections based on path and authentication
     */
    verifyClient(info) {
        const pathname = this.getPathname(info.req.url);
        // Reject new proxy connections if draining
        if (this.isDraining) {
            if (!this.config.quiet) {
                console.log('[wss] Rejecting proxy connection - server is draining');
            }
            return false;
        }
        // Allow connections to both /roverfox and /replay paths
        if (pathname !== this.config.proxyPath &&
            pathname !== this.config.replayPath) {
            return false;
        }
        // /replay path doesn't require authentication
        if (pathname === this.config.replayPath) {
            return true;
        }
        // /roverfox path requires authentication
        return this.authManager.isRequestAuthorized(info.req);
    }
    /**
     * Handles new WebSocket connections based on path
     */
    handleConnection(clientWs, req) {
        const pathname = this.getPathname(req.url);
        if (pathname === this.config.proxyPath) {
            const browserType = this.getBrowserType(req.url);
            this.handleProxyConnection(clientWs, browserType);
        }
        else if (pathname === this.config.replayPath) {
            this.handleReplayConnection(clientWs);
        }
    }
    /**
     * Handles browser proxy connections
     */
    handleProxyConnection(clientWs, browserType = 'camoufox') {
        this.browserProxy.registerClient(clientWs, browserType);
        // Report capacity increase
        if (this.connectionReporter) {
            this.connectionReporter.onConnectionOpen(browserType).catch((error) => {
                console.error('[capacity] Failed to report connection open:', error);
            });
        }
        clientWs.on('message', (msg) => {
            this.browserProxy.handleBrowserProxyMessage(clientWs, msg);
        });
        clientWs.on('close', () => {
            this.browserProxy.handleClientDisconnect(clientWs);
            // Report capacity decrease
            if (this.connectionReporter) {
                this.connectionReporter
                    .onConnectionClose(browserType)
                    .catch((error) => {
                    console.error('[capacity] Failed to report connection close:', error);
                });
            }
        });
        clientWs.on('error', (error) => {
            console.error('[proxy] Client WebSocket error:', error);
            this.browserProxy.handleClientDisconnect(clientWs);
            // Report capacity decrease on error
            if (this.connectionReporter) {
                this.connectionReporter
                    .onConnectionClose(browserType)
                    .catch((error) => {
                    console.error('[capacity] Failed to report connection close:', error);
                });
            }
        });
    }
    /**
     * Handles screenshot streaming connections
     */
    handleReplayConnection(clientWs) {
        this.replayHub.initializeReplayClient(clientWs);
        clientWs.on('message', (msg) => {
            let data;
            try {
                data = JSON.parse(msg.toString());
            }
            catch {
                console.warn('[replay] Received non-JSON message, ignoring');
                return;
            }
            this.replayHub.handleScreenshotMessage(clientWs, data);
        });
        clientWs.on('close', () => {
            this.replayHub.handleClientDisconnect(clientWs);
        });
        clientWs.on('error', (error) => {
            console.error('[replay] Client WebSocket error:', error);
            this.replayHub.handleClientDisconnect(clientWs);
        });
    }
    /**
     * Logs server information
     */
    logServerInfo() {
        if (!this.config.quiet) {
            console.log(`[wss] WebSocket server listening on ${this.wsServerUrl}`);
            console.log(`[wss] Browser proxy endpoint: ${this.wsServerUrl}${this.config.proxyPath}`);
            console.log(`[wss] Screenshot streaming endpoint: ${this.wsServerUrl}${this.config.replayPath}`);
        }
    }
    /**
     * Closes the WebSocket server
     */
    close() {
        if (this.wsServer) {
            this.wsServer.close();
            this.wsServer = null;
        }
    }
    /**
     * Gets the WebSocket server URL endpoints
     */
    getWsProxyLocalEndpoint() {
        return `${this.wsServerUrl}${this.config.proxyPath}`;
    }
    getWsReplayLocalEndpoint() {
        return `${this.wsServerUrl}${this.config.replayPath}`;
    }
    /**
     * Sets the connection reporter for tracking connections
     */
    setConnectionReporter(reporter) {
        this.connectionReporter = reporter;
    }
}

/**
 * Lightweight local proxy server for launching browser contexts locally.
 * Uses @roverfox/worker-core components but omits production infrastructure
 * (AWS registration, capacity reporting, metrics, HTTPS certificates).
 */
class LocalProxyServer {
    constructor(config) {
        var _a, _b;
        this.config = config;
        this.browserServers = [];
        this.numBrowserServers = (_a = config.numBrowserServers) !== null && _a !== void 0 ? _a : 1;
        this.browserProxy = new BrowserProxy([], (_b = config.quiet) !== null && _b !== void 0 ? _b : false);
        this.authManager = new AuthManager(config);
        this.wsManager = new WebSocketManager(config, new ReplayHub(), this.browserProxy, this.authManager);
    }
    /**
     * Starts the local proxy server
     */
    async start() {
        var _a, _b;
        try {
            // Determine which browser types to launch (default: both)
            const browserTypes = (_a = this.config.browserTypes) !== null && _a !== void 0 ? _a : ['camoufox', 'brave'];
            // Launch browser servers for each requested type
            for (const browserType of browserTypes) {
                const servers = await launchBrowserServers({
                    numServers: this.numBrowserServers,
                    browserType,
                    headless: (_b = this.config.headless) !== null && _b !== void 0 ? _b : true,
                    quiet: this.config.quiet,
                });
                this.browserServers.push(...servers);
                this.browserProxy.setBrowserServers(servers, browserType);
            }
            // Create and start WebSocket server
            await this.wsManager.createWebSocketServer();
            if (!this.config.quiet) {
                console.log('[wss] Local proxy server started successfully');
            }
        }
        catch (error) {
            console.error('[wss] Failed to start local server:', error);
            await this.shutdown();
            throw error;
        }
    }
    /**
     * Gracefully shuts down the server
     */
    async shutdown() {
        if (!this.config.quiet) {
            console.log('[wss] Shutting down local proxy server...');
        }
        this.wsManager.close();
        for (const browserServer of this.browserServers) {
            await browserServer.close();
        }
        this.browserServers = [];
        if (!this.config.quiet) {
            console.log('[wss] Local proxy server shutdown complete');
        }
    }
}

// Auto-generated from camoufox/pythonlib/camoufox/fonts.json (mac)
// 573 Mac fonts used by Camoufox font whitelist
const MAC_FONTS = [
    '.Al Bayan PUA',
    '.Al Nile PUA',
    '.Al Tarikh PUA',
    '.Apple Color Emoji UI',
    '.Apple SD Gothic NeoI',
    '.Aqua Kana',
    '.Aqua Kana Bold',
    '.Aqua かな',
    '.Aqua かな ボールド',
    '.Arial Hebrew Desk Interface',
    '.Baghdad PUA',
    '.Beirut PUA',
    '.Damascus PUA',
    '.DecoType Naskh PUA',
    '.Diwan Kufi PUA',
    '.Farah PUA',
    '.Geeza Pro Interface',
    '.Geeza Pro PUA',
    '.Helvetica LT MM',
    '.Hiragino Kaku Gothic Interface',
    '.Hiragino Sans GB Interface',
    '.Keyboard',
    '.KufiStandardGK PUA',
    '.LastResort',
    '.Lucida Grande UI',
    '.Muna PUA',
    '.Nadeem PUA',
    '.New York',
    '.Noto Nastaliq Urdu UI',
    '.PingFang HK',
    '.PingFang SC',
    '.PingFang TC',
    '.SF Arabic',
    '.SF Arabic Rounded',
    '.SF Compact',
    '.SF Compact Rounded',
    '.SF NS',
    '.SF NS Mono',
    '.SF NS Rounded',
    '.Sana PUA',
    '.Savoye LET CC.',
    '.ThonburiUI',
    '.ThonburiUIWatch',
    '.苹方-港',
    '.苹方-简',
    '.苹方-繁',
    '.蘋方-港',
    '.蘋方-簡',
    '.蘋方-繁',
    'Academy Engraved LET',
    'Al Bayan',
    'Al Nile',
    'Al Tarikh',
    'American Typewriter',
    'Andale Mono',
    'Apple Braille',
    'Apple Chancery',
    'Apple Color Emoji',
    'Apple SD Gothic Neo',
    'Apple SD 산돌고딕 Neo',
    'Apple Symbols',
    'AppleGothic',
    'AppleMyungjo',
    'Arial',
    'Arial Black',
    'Arial Hebrew',
    'Arial Hebrew Scholar',
    'Arial Narrow',
    'Arial Rounded MT Bold',
    'Arial Unicode MS',
    'Athelas',
    'Avenir',
    'Avenir Black',
    'Avenir Black Oblique',
    'Avenir Book',
    'Avenir Heavy',
    'Avenir Light',
    'Avenir Medium',
    'Avenir Next',
    'Avenir Next Condensed',
    'Avenir Next Condensed Demi Bold',
    'Avenir Next Condensed Heavy',
    'Avenir Next Condensed Medium',
    'Avenir Next Condensed Ultra Light',
    'Avenir Next Demi Bold',
    'Avenir Next Heavy',
    'Avenir Next Medium',
    'Avenir Next Ultra Light',
    'Ayuthaya',
    'Baghdad',
    'Bangla MN',
    'Bangla Sangam MN',
    'Baskerville',
    'Beirut',
    'Big Caslon',
    'Bodoni 72',
    'Bodoni 72 Oldstyle',
    'Bodoni 72 Smallcaps',
    'Bodoni Ornaments',
    'Bradley Hand',
    'Brush Script MT',
    'Chalkboard',
    'Chalkboard SE',
    'Chalkduster',
    'Charter',
    'Charter Black',
    'Cochin',
    'Comic Sans MS',
    'Copperplate',
    'Corsiva Hebrew',
    'Courier',
    'Courier New',
    'Czcionka systemowa',
    'DIN Alternate',
    'DIN Condensed',
    'Damascus',
    'DecoType Naskh',
    'Devanagari MT',
    'Devanagari Sangam MN',
    'Didot',
    'Diwan Kufi',
    'Diwan Thuluth',
    'Euphemia UCAS',
    'Farah',
    'Farisi',
    'Font Sistem',
    'Font de sistem',
    'Font di sistema',
    'Font sustava',
    'Fonte do Sistema',
    'Futura',
    'GB18030 Bitmap',
    'Galvji',
    'Geeza Pro',
    'Geneva',
    'Georgia',
    'Gill Sans',
    'Grantha Sangam MN',
    'Gujarati MT',
    'Gujarati Sangam MN',
    'Gurmukhi MN',
    'Gurmukhi MT',
    'Gurmukhi Sangam MN',
    'Heiti SC',
    'Heiti TC',
    'Heiti-간체',
    'Heiti-번체',
    'Helvetica',
    'Helvetica Neue',
    'Herculanum',
    'Hiragino Kaku Gothic Pro',
    'Hiragino Kaku Gothic Pro W3',
    'Hiragino Kaku Gothic Pro W6',
    'Hiragino Kaku Gothic ProN',
    'Hiragino Kaku Gothic ProN W3',
    'Hiragino Kaku Gothic ProN W6',
    'Hiragino Kaku Gothic Std',
    'Hiragino Kaku Gothic Std W8',
    'Hiragino Kaku Gothic StdN',
    'Hiragino Kaku Gothic StdN W8',
    'Hiragino Maru Gothic Pro',
    'Hiragino Maru Gothic Pro W4',
    'Hiragino Maru Gothic ProN',
    'Hiragino Maru Gothic ProN W4',
    'Hiragino Mincho Pro',
    'Hiragino Mincho Pro W3',
    'Hiragino Mincho Pro W6',
    'Hiragino Mincho ProN',
    'Hiragino Mincho ProN W3',
    'Hiragino Mincho ProN W6',
    'Hiragino Sans',
    'Hiragino Sans GB',
    'Hiragino Sans GB W3',
    'Hiragino Sans GB W6',
    'Hiragino Sans W0',
    'Hiragino Sans W1',
    'Hiragino Sans W2',
    'Hiragino Sans W3',
    'Hiragino Sans W4',
    'Hiragino Sans W5',
    'Hiragino Sans W6',
    'Hiragino Sans W7',
    'Hiragino Sans W8',
    'Hiragino Sans W9',
    'Hoefler Text',
    'Hoefler Text Ornaments',
    'ITF Devanagari',
    'ITF Devanagari Marathi',
    'Impact',
    'InaiMathi',
    'Iowan Old Style',
    'Iowan Old Style Black',
    'Järjestelmäfontti',
    'Kailasa',
    'Kannada MN',
    'Kannada Sangam MN',
    'Kefa',
    'Khmer MN',
    'Khmer Sangam MN',
    'Kohinoor Bangla',
    'Kohinoor Devanagari',
    'Kohinoor Gujarati',
    'Kohinoor Telugu',
    'Kokonor',
    'Krungthep',
    'KufiStandardGK',
    'Lao MN',
    'Lao Sangam MN',
    'Lucida Grande',
    'Luminari',
    'Malayalam MN',
    'Malayalam Sangam MN',
    'Marion',
    'Marker Felt',
    'Menlo',
    'Microsoft Sans Serif',
    'Mishafi',
    'Mishafi Gold',
    'Monaco',
    'Mshtakan',
    'Mukta Mahee',
    'MuktaMahee Bold',
    'MuktaMahee ExtraBold',
    'MuktaMahee ExtraLight',
    'MuktaMahee Light',
    'MuktaMahee Medium',
    'MuktaMahee Regular',
    'MuktaMahee SemiBold',
    'Muna',
    'Myanmar MN',
    'Myanmar Sangam MN',
    'Nadeem',
    'New Peninim MT',
    'Noteworthy',
    'Noto Nastaliq Urdu',
    'Noto Sans Adlam',
    'Noto Sans Armenian',
    'Noto Sans Armenian Blk',
    'Noto Sans Armenian ExtBd',
    'Noto Sans Armenian ExtLt',
    'Noto Sans Armenian Light',
    'Noto Sans Armenian Med',
    'Noto Sans Armenian SemBd',
    'Noto Sans Armenian Thin',
    'Noto Sans Avestan',
    'Noto Sans Bamum',
    'Noto Sans Bassa Vah',
    'Noto Sans Batak',
    'Noto Sans Bhaiksuki',
    'Noto Sans Brahmi',
    'Noto Sans Buginese',
    'Noto Sans Buhid',
    'Noto Sans CanAborig',
    'Noto Sans Canadian Aboriginal',
    'Noto Sans Carian',
    'Noto Sans CaucAlban',
    'Noto Sans Caucasian Albanian',
    'Noto Sans Chakma',
    'Noto Sans Cham',
    'Noto Sans Coptic',
    'Noto Sans Cuneiform',
    'Noto Sans Cypriot',
    'Noto Sans Duployan',
    'Noto Sans EgyptHiero',
    'Noto Sans Egyptian Hieroglyphs',
    'Noto Sans Elbasan',
    'Noto Sans Glagolitic',
    'Noto Sans Gothic',
    'Noto Sans Gunjala Gondi',
    'Noto Sans Hanifi Rohingya',
    'Noto Sans HanifiRohg',
    'Noto Sans Hanunoo',
    'Noto Sans Hatran',
    'Noto Sans ImpAramaic',
    'Noto Sans Imperial Aramaic',
    'Noto Sans InsPahlavi',
    'Noto Sans InsParthi',
    'Noto Sans Inscriptional Pahlavi',
    'Noto Sans Inscriptional Parthian',
    'Noto Sans Javanese',
    'Noto Sans Kaithi',
    'Noto Sans Kannada',
    'Noto Sans Kannada Black',
    'Noto Sans Kannada ExtraBold',
    'Noto Sans Kannada ExtraLight',
    'Noto Sans Kannada Light',
    'Noto Sans Kannada Medium',
    'Noto Sans Kannada SemiBold',
    'Noto Sans Kannada Thin',
    'Noto Sans Kayah Li',
    'Noto Sans Kharoshthi',
    'Noto Sans Khojki',
    'Noto Sans Khudawadi',
    'Noto Sans Lepcha',
    'Noto Sans Limbu',
    'Noto Sans Linear A',
    'Noto Sans Linear B',
    'Noto Sans Lisu',
    'Noto Sans Lycian',
    'Noto Sans Lydian',
    'Noto Sans Mahajani',
    'Noto Sans Mandaic',
    'Noto Sans Manichaean',
    'Noto Sans Marchen',
    'Noto Sans Masaram Gondi',
    'Noto Sans Meetei Mayek',
    'Noto Sans Mende Kikakui',
    'Noto Sans Meroitic',
    'Noto Sans Miao',
    'Noto Sans Modi',
    'Noto Sans Mongolian',
    'Noto Sans Mro',
    'Noto Sans Multani',
    'Noto Sans Myanmar',
    'Noto Sans Myanmar Blk',
    'Noto Sans Myanmar ExtBd',
    'Noto Sans Myanmar ExtLt',
    'Noto Sans Myanmar Light',
    'Noto Sans Myanmar Med',
    'Noto Sans Myanmar SemBd',
    'Noto Sans Myanmar Thin',
    'Noto Sans NKo',
    'Noto Sans Nabataean',
    'Noto Sans New Tai Lue',
    'Noto Sans Newa',
    'Noto Sans Ol Chiki',
    'Noto Sans Old Hungarian',
    'Noto Sans Old Italic',
    'Noto Sans Old North Arabian',
    'Noto Sans Old Permic',
    'Noto Sans Old Persian',
    'Noto Sans Old South Arabian',
    'Noto Sans Old Turkic',
    'Noto Sans OldHung',
    'Noto Sans OldNorArab',
    'Noto Sans OldSouArab',
    'Noto Sans Oriya',
    'Noto Sans Osage',
    'Noto Sans Osmanya',
    'Noto Sans Pahawh Hmong',
    'Noto Sans Palmyrene',
    'Noto Sans Pau Cin Hau',
    'Noto Sans PhagsPa',
    'Noto Sans Phoenician',
    'Noto Sans PsaPahlavi',
    'Noto Sans Psalter Pahlavi',
    'Noto Sans Rejang',
    'Noto Sans Samaritan',
    'Noto Sans Saurashtra',
    'Noto Sans Sharada',
    'Noto Sans Siddham',
    'Noto Sans Sora Sompeng',
    'Noto Sans SoraSomp',
    'Noto Sans Sundanese',
    'Noto Sans Syloti Nagri',
    'Noto Sans Syriac',
    'Noto Sans Tagalog',
    'Noto Sans Tagbanwa',
    'Noto Sans Tai Le',
    'Noto Sans Tai Tham',
    'Noto Sans Tai Viet',
    'Noto Sans Takri',
    'Noto Sans Thaana',
    'Noto Sans Tifinagh',
    'Noto Sans Tirhuta',
    'Noto Sans Ugaritic',
    'Noto Sans Vai',
    'Noto Sans Wancho',
    'Noto Sans Warang Citi',
    'Noto Sans Yi',
    'Noto Sans Zawgyi',
    'Noto Sans Zawgyi Blk',
    'Noto Sans Zawgyi ExtBd',
    'Noto Sans Zawgyi ExtLt',
    'Noto Sans Zawgyi Light',
    'Noto Sans Zawgyi Med',
    'Noto Sans Zawgyi SemBd',
    'Noto Sans Zawgyi Thin',
    'Noto Serif Ahom',
    'Noto Serif Balinese',
    'Noto Serif Hmong Nyiakeng',
    'Noto Serif Myanmar',
    'Noto Serif Myanmar Blk',
    'Noto Serif Myanmar ExtBd',
    'Noto Serif Myanmar ExtLt',
    'Noto Serif Myanmar Light',
    'Noto Serif Myanmar Med',
    'Noto Serif Myanmar SemBd',
    'Noto Serif Myanmar Thin',
    'Noto Serif Yezidi',
    'Optima',
    'Oriya MN',
    'Oriya Sangam MN',
    'PT Mono',
    'PT Sans',
    'PT Sans Caption',
    'PT Sans Narrow',
    'PT Serif',
    'PT Serif Caption',
    'Palatino',
    'Papyrus',
    'Party LET',
    'Phosphate',
    'Phông chữ Hệ thống',
    'PingFang HK',
    'PingFang SC',
    'PingFang TC',
    'Plantagenet Cherokee',
    'Police système',
    'Raanana',
    'Rendszerbetűtípus',
    'Rockwell',
    'STIX Two Math',
    'STIX Two Text',
    'STIXGeneral',
    'STIXIntegralsD',
    'STIXIntegralsSm',
    'STIXIntegralsUp',
    'STIXIntegralsUpD',
    'STIXIntegralsUpSm',
    'STIXNonUnicode',
    'STIXSizeFiveSym',
    'STIXSizeFourSym',
    'STIXSizeOneSym',
    'STIXSizeThreeSym',
    'STIXSizeTwoSym',
    'STIXVariants',
    'STSong',
    'Sana',
    'Sathu',
    'Savoye LET',
    'Seravek',
    'Seravek ExtraLight',
    'Seravek Light',
    'Seravek Medium',
    'Shree Devanagari 714',
    'SignPainter',
    'SignPainter-HouseScript',
    'Silom',
    'Sinhala MN',
    'Sinhala Sangam MN',
    'Sistem Fontu',
    'Skia',
    'Snell Roundhand',
    'Songti SC',
    'Songti TC',
    'Sukhumvit Set',
    'Superclarendon',
    'Symbol',
    'Systeemlettertype',
    'System Font',
    'Systemschrift',
    'Systemskrift',
    'Systemtypsnitt',
    'Systémové písmo',
    'Tahoma',
    'Tamil MN',
    'Tamil Sangam MN',
    'Telugu MN',
    'Telugu Sangam MN',
    'Thonburi',
    'Times',
    'Times New Roman',
    'Tipo de letra del sistema',
    'Tipo de letra do sistema',
    'Tipus de lletra del sistema',
    'Trattatello',
    'Trebuchet MS',
    'Verdana',
    'Waseem',
    'Webdings',
    'Wingdings',
    'Wingdings 2',
    'Wingdings 3',
    'Zapf Dingbats',
    'Zapfino',
    'Γραμματοσειρά συστήματος',
    'Системний шрифт',
    'Системный шрифт',
    'גופן מערכת',
    'البيان',
    'التاريخ',
    'النيل',
    'بغداد',
    'بيروت',
    'جيزة',
    'خط النظام',
    'دمشق',
    'ديوان ثلث',
    'ديوان كوفي',
    'صنعاء',
    'فارسي',
    'فرح',
    'كوفي',
    'منى',
    'مِصحفي',
    'مِصحفي ذهبي',
    'نديم',
    'نسخ',
    'وسيم',
    'आई॰टी॰एफ़॰ देवनागरी',
    'आई॰टी॰एफ़॰ देवनागरी मराठी',
    'कोहिनूर देवनागरी',
    'देवनागरी एम॰टी॰',
    'देवनागरी संगम एम॰एन॰',
    'श्री देवनागरी ७१४',
    'แบบอักษรระบบ',
    '⹁煵愠芩苈',
    'システムフォント',
    'ヒラギノ丸ゴ Pro',
    'ヒラギノ丸ゴ Pro W4',
    'ヒラギノ丸ゴ ProN',
    'ヒラギノ丸ゴ ProN W4',
    'ヒラギノ明朝 Pro',
    'ヒラギノ明朝 Pro W3',
    'ヒラギノ明朝 Pro W6',
    'ヒラギノ明朝 ProN',
    'ヒラギノ明朝 ProN W3',
    'ヒラギノ明朝 ProN W6',
    'ヒラギノ角ゴ Pro',
    'ヒラギノ角ゴ Pro W3',
    'ヒラギノ角ゴ Pro W6',
    'ヒラギノ角ゴ ProN',
    'ヒラギノ角ゴ ProN W3',
    'ヒラギノ角ゴ ProN W6',
    'ヒラギノ角ゴ Std',
    'ヒラギノ角ゴ Std W8',
    'ヒラギノ角ゴ StdN',
    'ヒラギノ角ゴ StdN W8',
    'ヒラギノ角ゴ 簡体中文',
    'ヒラギノ角ゴ 簡体中文 W3',
    'ヒラギノ角ゴ 簡体中文 W6',
    'ヒラギノ角ゴシック',
    'ヒラギノ角ゴシック W0',
    'ヒラギノ角ゴシック W1',
    'ヒラギノ角ゴシック W2',
    'ヒラギノ角ゴシック W3',
    'ヒラギノ角ゴシック W4',
    'ヒラギノ角ゴシック W5',
    'ヒラギノ角ゴシック W6',
    'ヒラギノ角ゴシック W7',
    'ヒラギノ角ゴシック W8',
    'ヒラギノ角ゴシック W9',
    '冬青黑体简体中文',
    '冬青黑体简体中文 W3',
    '冬青黑体简体中文 W6',
    '冬青黑體簡體中文',
    '冬青黑體簡體中文 W3',
    '冬青黑體簡體中文 W6',
    '宋体-简',
    '宋体-繁',
    '宋體-簡',
    '宋體-繁',
    '系統字體',
    '系统字体',
    '苹方-港',
    '苹方-简',
    '苹方-繁',
    '荱莉荍荭詰荓⁐牯',
    '荱莉荍荭詰荓⁓瑤',
    '荱莉荍荭詰荓荖荢荎',
    '荱莉荍荭諛荓⁐牯',
    '荱莉荍荭难銩⁐牯',
    '蘋方-港',
    '蘋方-簡',
    '蘋方-繁',
    '黑体-简',
    '黑体-繁',
    '黑體-簡',
    '黑體-繁',
    '黒体-簡',
    '黒体-繁',
    '시스템 서체',
];
// Essential fonts that should always be included in subsets
const ESSENTIAL_FONTS = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Georgia',
    'Trebuchet MS',
    'Tahoma',
    'Helvetica Neue',
    'Lucida Grande',
    'Menlo',
    'Monaco',
];
// Generate a deterministic random subset of MAC_FONTS.
// Same seed always produces the same subset. Keeps ~78% of fonts + all essential fonts.
function generateRandomFontSubset(seed) {
    const essentialSet = new Set(ESSENTIAL_FONTS);
    const result = [];
    let state = seed >>> 0;
    for (const font of MAC_FONTS) {
        if (essentialSet.has(font)) {
            result.push(font);
            continue;
        }
        state = (state * 1664525 + 1013904223) >>> 0;
        if (state % 100 < 78) {
            result.push(font);
        }
    }
    return result;
}

/**
 * Client for communicating with Roverfox Manager
 */
class ManagerClient {
    constructor(apiKey, managerUrl, debug = false) {
        this.manager = axios.create({
            baseURL: managerUrl ||
                process.env.ROVERFOX_MANAGER_URL ||
                'https://manager.roverfox.net',
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        this.debug = debug;
    }
    /**
     * Gets server assignment from manager
     */
    async getServerAssignment(options) {
        const opts = Object.assign({ 
            // Default options
            platform: 'mac' }, options);
        try {
            const params = new URLSearchParams();
            if (opts.browserId)
                params.append('browserId', opts.browserId);
            if (opts.platform)
                params.append('platform', opts.platform);
            if (opts.browserType)
                params.append('browserType', opts.browserType);
            const { data: assignment } = await this.manager.get('/api/assign-server', { params });
            if (this.debug)
                console.log(`[client] Assigned to server ${assignment.serverIp}`);
            return assignment;
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to get server assignment:', error);
            throw error;
        }
    }
    /**
     * Assigns the least-used Firefox fingerprint from the pool.
     * Returns fingerprint data mapped to ProfileStorageData fields.
     */
    async assignFingerprint(platform = 'mac', browserType = 'camoufox') {
        try {
            const { data } = await this.manager.post('/api/fingerprints/assign', {
                platform,
                browserType,
            });
            return data;
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to assign fingerprint:', error);
            throw error;
        }
    }
    /**
     * Fetches a specific fingerprint by ID (for backfill of missing fields).
     * Returns the same format as assignFingerprint() but does NOT increment times_assigned.
     */
    async getFingerprint(fingerprintId) {
        try {
            const { data } = await this.manager.get(`/api/fingerprints/${fingerprintId}`);
            return data;
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to get fingerprint:', error);
            throw error;
        }
    }
    /**
     * Selects a geo-matched proxy for a browser profile.
     * Manager handles the DB lookup, health check, and reservation.
     */
    async selectProxy(params) {
        var _a, _b, _c;
        try {
            const { data } = await this.manager.post('/api/proxies/select', params);
            // Normalize: pool-based returns { proxyId, proxyUrl, exitIp, geoState },
            // service-based returns ProxyCredentials { proxyUrl, proxyId?, geoState?, ... }
            if (!data.proxyUrl) {
                throw new Error(data.error || 'No proxyUrl in Manager response');
            }
            return {
                proxyId: (_a = data.proxyId) !== null && _a !== void 0 ? _a : 0,
                proxyUrl: data.proxyUrl,
                exitIp: (_b = data.exitIp) !== null && _b !== void 0 ? _b : null,
                geoState: (_c = data.geoState) !== null && _c !== void 0 ? _c : null,
            };
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to select proxy:', error);
            throw error;
        }
    }
    /**
     * Releases a proxy back to the pool after session ends.
     */
    async releaseProxy(proxyId, rotate = true) {
        try {
            await this.manager.post('/api/proxies/release', { proxyId, rotate });
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to release proxy:', error);
            // Non-critical: don't throw — stale cleanup will handle it
        }
    }
    /**
     * Assigns a geo state to a profile proportionally based on proxy availability.
     */
    async assignGeo(browserId) {
        try {
            const { data } = await this.manager.post('/api/proxies/assign-geo', {
                browserId,
            });
            return data;
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to assign geo:', error);
            throw error;
        }
    }
    /**
     * Lists all profiles via manager
     */
    async listProfiles() {
        try {
            const { data } = await this.manager.get('/api/profiles');
            return data;
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to list profiles:', error);
            throw error;
        }
    }
    /**
     * Gets profile and proxy data from manager
     */
    async getProfile(browserId) {
        try {
            const { data } = await this.manager.get(`/api/profiles/${browserId}`);
            return data;
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to get profile:', error);
            throw error;
        }
    }
    /**
     * Creates a new profile via manager
     */
    async createProfile(browserId, profileData, platform, browserType) {
        try {
            await this.manager.post('/api/profiles', {
                browserId,
                profileData,
                platform,
                browserType,
            });
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to create profile:', error);
            throw error;
        }
    }
    /**
     * Updates profile data via manager
     */
    async updateProfileData(browserId, profileData) {
        try {
            await this.manager.patch(`/api/profiles/${browserId}`, {
                profileData,
            });
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to update profile data:', error);
            throw error;
        }
    }
    /**
     * Deletes a profile via manager
     */
    async deleteProfile(browserId) {
        try {
            await this.manager.delete(`/api/profiles/${browserId}`);
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to delete profile:', error);
            throw error;
        }
    }
    /**
     * Updates storage state via manager
     */
    async updateStorage(browserId, storageData) {
        try {
            await this.manager.post(`/api/profiles/${browserId}/storage`, storageData);
        }
        catch (error) {
            // Silently ignore storage update errors as they aren't critical
            if (this.debug)
                console.error('[client] Failed to update storage:', error);
        }
    }
    /**
     * Logs an action audit via manager
     */
    async logAudit(browserId, actionType, metadata) {
        try {
            await this.manager.post('/api/audit', {
                browserId,
                actionType,
                metadata,
            });
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to log audit:', error);
        }
    }
    /**
     * Logs data usage via manager
     */
    async logUsage(browserId, start, end, bytes, isOneTime = false, serverId) {
        try {
            await this.manager.post('/api/usage', {
                browserId,
                start,
                end,
                bytes,
                isOneTime,
                serverId,
            });
        }
        catch (error) {
            if (this.debug)
                console.error('[client] Failed to log usage:', error);
        }
    }
}

/**
 * Replay and screenshot streaming management
 */
async function sendPageClosedNotification(ws, browserId, pageId) {
    try {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'page-closed',
                uuid: browserId,
                pageId,
            }));
        }
    }
    catch (_error) {
        // Silently ignore errors
    }
}
class ReplayManager {
    constructor() {
        this.mousePositions = new Map();
        this.streamingEnabled = new Map(); // browserId -> streaming enabled
        this.screenshotIntervals = new Map(); // pageId -> interval
        this.browserPages = new Map(); // browserId -> Map<pageId, Page>
        this.pageContexts = new Map(); // pageId -> streaming context
    }
    /**
     * Enables live replay for a page
     */
    async enableLiveReplay(page, page_id, browser_id, replayWs, connectionPool) {
        // Track this page for the browser
        if (!this.browserPages.has(browser_id)) {
            this.browserPages.set(browser_id, new Map());
        }
        // Check if this Page object is already tracked (prevent duplicates)
        const existingPages = this.browserPages.get(browser_id);
        for (const [_existingPageId, existingPage] of existingPages.entries()) {
            if (existingPage === page) {
                return; // Page already tracked, don't add it again
            }
        }
        this.browserPages.get(browser_id).set(page_id, page);
        // Store streaming context for this page
        this.pageContexts.set(page_id, {
            page,
            pageId: page_id,
            browserId: browser_id,
            replayWs,
            connectionPool,
        });
        // monkey patch page.mouse.move to send mouse position to ws
        const originalMove = page.mouse.move;
        page.mouse.move = async (x, y) => {
            this.mousePositions.set(page_id, { x, y });
            await originalMove(x, y);
        };
        // Announce the new page as soon as live replay starts
        try {
            const pageTitle = await page.title();
            await connectionPool.safeSend(replayWs, {
                type: 'page-opened',
                uuid: browser_id,
                pageId: page_id,
                pageTitle,
            });
        }
        catch (_e) { }
        // Start streaming only if already enabled (viewer is watching)
        if (this.streamingEnabled.get(browser_id)) {
            this.startScreenshotStreaming(page, page_id, browser_id, replayWs, connectionPool);
        }
        page.on('close', () => {
            this.stopScreenshotStreaming(page_id);
            // Remove page from tracking
            const pages = this.browserPages.get(browser_id);
            if (pages) {
                pages.delete(page_id);
                if (pages.size === 0) {
                    this.browserPages.delete(browser_id);
                }
            }
            // Remove streaming context
            this.pageContexts.delete(page_id);
            // Notify that just this page closed
            sendPageClosedNotification(replayWs, browser_id, page_id);
        });
    }
    /**
     * Handles streaming control messages
     */
    handleStreamingControlMessage(message) {
        if (message.type === 'start-streaming' && message.uuid) {
            const browserId = message.uuid;
            // Enable streaming for this browser
            this.streamingEnabled.set(browserId, true);
            // Start streaming for all existing pages of this browser
            const pages = this.browserPages.get(browserId);
            if (pages) {
                for (const [pageId, page] of pages.entries()) {
                    if (!page.isClosed()) {
                        const context = this.pageContexts.get(pageId);
                        if (context) {
                            this.startScreenshotStreaming(context.page, context.pageId, context.browserId, context.replayWs, context.connectionPool);
                        }
                    }
                }
            }
        }
        else if (message.type === 'stop-streaming' && message.uuid) {
            const browserId = message.uuid;
            // Disable streaming for this browser
            this.streamingEnabled.set(browserId, false);
            // Stop streaming for all pages of this browser
            const pages = this.browserPages.get(browserId);
            if (pages) {
                for (const pageId of pages.keys()) {
                    this.stopScreenshotStreaming(pageId);
                }
            }
        }
        else if (this.isInputCommand(message)) {
            // Handle input commands from viewers
            this.handleInputCommand(message);
        }
    }
    /**
     * Checks if a message is an input command
     */
    isInputCommand(message) {
        return [
            'mouse-move',
            'mouse-click',
            'keyboard-type',
            'keyboard-press',
            'scroll',
        ].includes(message.type);
    }
    /**
     * Handles input commands from viewers
     */
    async handleInputCommand(message) {
        const { type, uuid, pageId } = message;
        // Find the page by browserId and pageId
        const pages = this.browserPages.get(uuid);
        if (!pages) {
            console.warn(`[replay-manager] No pages found for browser ${uuid}`);
            return;
        }
        const page = pages.get(pageId);
        if (!page || page.isClosed()) {
            console.warn(`[replay-manager] Page ${pageId} not found or closed`);
            return;
        }
        try {
            switch (type) {
                case 'mouse-move':
                    await this.executeMouseMove(page, message);
                    break;
                case 'mouse-click':
                    await this.executeMouseClick(page, message);
                    break;
                case 'keyboard-type':
                    await this.executeKeyboardType(page, message);
                    break;
                case 'keyboard-press':
                    await this.executeKeyboardPress(page, message);
                    break;
                case 'scroll':
                    await this.executeScroll(page, message);
                    break;
            }
        }
        catch (_error) {
            // Silently ignore input command errors (page may be navigating)
        }
    }
    async executeMouseMove(page, cmd) {
        await page.mouse.move(cmd.x, cmd.y);
        this.mousePositions.set(cmd.pageId, { x: cmd.x, y: cmd.y });
    }
    async executeMouseClick(page, cmd) {
        await page.mouse.click(cmd.x, cmd.y, {
            button: cmd.button,
            clickCount: cmd.clickCount,
        });
        this.mousePositions.set(cmd.pageId, { x: cmd.x, y: cmd.y });
    }
    async executeKeyboardType(page, cmd) {
        await page.keyboard.type(cmd.text);
    }
    async executeKeyboardPress(page, cmd) {
        var _a, _b, _c, _d;
        // Build key combination string for modifiers
        const modifiers = [];
        if ((_a = cmd.modifiers) === null || _a === void 0 ? void 0 : _a.ctrl)
            modifiers.push('Control');
        if ((_b = cmd.modifiers) === null || _b === void 0 ? void 0 : _b.shift)
            modifiers.push('Shift');
        if ((_c = cmd.modifiers) === null || _c === void 0 ? void 0 : _c.alt)
            modifiers.push('Alt');
        if ((_d = cmd.modifiers) === null || _d === void 0 ? void 0 : _d.meta)
            modifiers.push('Meta');
        if (modifiers.length > 0) {
            await page.keyboard.press(`${modifiers.join('+')}+${cmd.key}`);
        }
        else {
            await page.keyboard.press(cmd.key);
        }
    }
    async executeScroll(page, cmd) {
        await page.mouse.wheel(cmd.deltaX, cmd.deltaY);
    }
    /**
     * Starts screenshot streaming for a page
     */
    startScreenshotStreaming(page, pageId, browserId, replayWs, connectionPool) {
        // Don't start if already streaming
        if (this.screenshotIntervals.has(pageId)) {
            return;
        }
        const FPS = 10;
        const interval = setInterval(() => {
            this.sendPageStateLiveReplay(page, browserId, pageId, replayWs, connectionPool);
        }, 1000 / FPS);
        this.screenshotIntervals.set(pageId, interval);
    }
    /**
     * Sends page state (screenshot) to replay hub
     */
    async sendPageStateLiveReplay(page, browserId, pageId, replayWs, connectionPool) {
        var _a, _b;
        try {
            // Check if streaming is enabled for this browser
            if (!this.streamingEnabled.get(browserId)) {
                return;
            }
            // Check if page is closed before taking screenshot
            if (page.isClosed()) {
                return;
            }
            // Double-check the page context is still valid
            if (!page.context() || page.context().pages().indexOf(page) === -1) {
                return;
            }
            const screenshot = await page.screenshot({
                type: 'jpeg',
                quality: 70,
                timeout: 1000, // 1 second timeout for screenshot
            });
            const pageTitle = await page.title();
            try {
                await connectionPool.safeSend(replayWs, {
                    type: 'screenshot',
                    uuid: browserId,
                    pageId,
                    pageTitle,
                    base64: screenshot.toString('base64'),
                    mouseX: (_a = this.mousePositions.get(pageId)) === null || _a === void 0 ? void 0 : _a.x,
                    mouseY: (_b = this.mousePositions.get(pageId)) === null || _b === void 0 ? void 0 : _b.y,
                });
            }
            catch (_error) {
                // Continue execution as screenshot streaming is not critical
            }
        }
        catch (_e) {
            // Silently ignore screenshot errors (page may be closing)
        }
    }
    /**
     * Stops screenshot streaming for a page
     */
    stopScreenshotStreaming(pageId) {
        const interval = this.screenshotIntervals.get(pageId);
        if (interval) {
            clearInterval(interval);
            this.screenshotIntervals.delete(pageId);
        }
    }
    /**
     * Stops all screenshot streaming for a browser
     */
    stopAllScreenshotStreaming() {
        // Stop all intervals for this browser's pages
        for (const [pageId, interval] of this.screenshotIntervals.entries()) {
            clearInterval(interval);
            this.screenshotIntervals.delete(pageId);
        }
    }
    /**
     * Cleans up resources for a browser
     */
    cleanup(browserId) {
        this.streamingEnabled.delete(browserId);
        // Clean up page contexts for this browser
        const pages = this.browserPages.get(browserId);
        if (pages) {
            for (const pageId of pages.keys()) {
                this.pageContexts.delete(pageId);
            }
        }
        this.browserPages.delete(browserId);
        this.stopAllScreenshotStreaming();
    }
    /**
     * Safely closes a WebSocket for a specific browserId
     */
    async closeWebSocketForBrowser(browserId) {
        const ws = ReplayManager.wsInstances.get(browserId);
        if (!ws) {
            return;
        }
        // Check if there's already a close promise for this browser
        let closePromise = ReplayManager.wsClosePromises.get(browserId);
        if (closePromise) {
            return closePromise;
        }
        // If WebSocket is already closed, just clean up
        if (ws.readyState === WebSocket.CLOSED) {
            ReplayManager.wsInstances.delete(browserId);
            return;
        }
        // If WebSocket is already closing, wait for it
        if (ws.readyState === WebSocket.CLOSING) {
            closePromise = new Promise((resolve) => {
                ws.addEventListener('close', () => {
                    ReplayManager.wsInstances.delete(browserId);
                    ReplayManager.wsClosePromises.delete(browserId);
                    resolve();
                });
            });
            ReplayManager.wsClosePromises.set(browserId, closePromise);
            return closePromise;
        }
        // Create close promise and initiate close
        closePromise = new Promise((resolve) => {
            const timeout = setTimeout(() => {
                ReplayManager.wsInstances.delete(browserId);
                ReplayManager.wsClosePromises.delete(browserId);
                resolve();
            }, 5000); // 5 second timeout
            ws.addEventListener('close', () => {
                clearTimeout(timeout);
                ReplayManager.wsInstances.delete(browserId);
                ReplayManager.wsClosePromises.delete(browserId);
                resolve();
            });
            ws.addEventListener('error', () => {
                clearTimeout(timeout);
                ReplayManager.wsInstances.delete(browserId);
                ReplayManager.wsClosePromises.delete(browserId);
                resolve(); // Resolve even on error to prevent hanging
            });
        });
        ReplayManager.wsClosePromises.set(browserId, closePromise);
        try {
            ws.close();
        }
        catch (_error) {
            // Clean up even if close() throws
            ReplayManager.wsInstances.delete(browserId);
            ReplayManager.wsClosePromises.delete(browserId);
        }
        return closePromise;
    }
}
ReplayManager.wsInstances = new Map();
ReplayManager.wsClosePromises = new Map();

/**
 * Utility functions for Roverfox Client
 */
/**
 * Formats a proxy URL string into a proxy object
 */
function formatProxyURL(proxyUrl) {
    if (!proxyUrl)
        return null;
    try {
        const url = new URL(proxyUrl);
        return {
            server: `${url.protocol}//${url.host}`,
            username: url.username ? decodeURIComponent(url.username) : '',
            password: url.password ? decodeURIComponent(url.password) : '',
        };
    }
    catch (_error) {
        // Silently return null on parse error - caller should handle validation
        return null;
    }
}

/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */
// Build a Firefox UA string matching the given navigator.platform.
// Uses Camoufox's Firefox version (146.0) regardless of what the pool collected.
const FIREFOX_VERSION = '146.0';
function buildUserAgentForPlatform(platform) {
    if (!platform)
        return null;
    if (platform === 'MacIntel' || platform === 'Macintosh') {
        return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:${FIREFOX_VERSION}) Gecko/20100101 Firefox/${FIREFOX_VERSION}`;
    }
    if (platform.indexOf('Win') === 0) {
        return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${FIREFOX_VERSION}) Gecko/20100101 Firefox/${FIREFOX_VERSION}`;
    }
    if (platform.indexOf('Linux') !== -1) {
        return `Mozilla/5.0 (X11; Linux x86_64; rv:${FIREFOX_VERSION}) Gecko/20100101 Firefox/${FIREFOX_VERSION}`;
    }
    return null;
}
function generateViewport(screen) {
    const widthRatio = 0.7 + Math.random() * 0.2;
    const heightRatio = 0.65 + Math.random() * 0.2;
    const width = Math.round((screen.width * widthRatio) / 10) * 10;
    const height = Math.round((screen.height * heightRatio) / 10) * 10;
    return { width, height };
}
/**
 * Generates browser-specific profile data for a new profile
 */
function generateProfileData(fp, platform, browserType, proxyUrl) {
    const fallback = getFallbackFingerprint(platform, browserType);
    const screen = fp ? fp.screenDimensions : fallback.screenDimensions;
    const speechVoices = (fp === null || fp === void 0 ? void 0 : fp.speechVoices) || fallback.speechVoices;
    const baseData = {
        fingerprintId: fp === null || fp === void 0 ? void 0 : fp.fingerprintId,
        canvasSeed: Math.floor(Math.random() * 0xffffffff) + 1,
        screenDimensions: screen,
        viewport: generateViewport(screen),
        devicePixelRatio: (fp === null || fp === void 0 ? void 0 : fp.devicePixelRatio) || fallback.devicePixelRatio,
        navigatorPlatform: (fp === null || fp === void 0 ? void 0 : fp.navigatorPlatform) || fallback.navigatorPlatform,
        navigatorOscpu: (fp === null || fp === void 0 ? void 0 : fp.navigatorOscpu) || fallback.navigatorOscpu,
        hardwareConcurrency: (fp === null || fp === void 0 ? void 0 : fp.hardwareConcurrency) || fallback.hardwareConcurrency,
        webglVendor: (fp === null || fp === void 0 ? void 0 : fp.webglVendor) || fallback.webglVendor,
        webglRenderer: (fp === null || fp === void 0 ? void 0 : fp.webglRenderer) || fallback.webglRenderer,
        speechVoices: Array.isArray(speechVoices) && speechVoices.length <= 500
            ? speechVoices
            : undefined,
        fontList: fp === null || fp === void 0 ? void 0 : fp.fontList,
        storageState: {
            cookies: [],
            origins: [],
        },
        proxyUrl,
    };
    if (browserType === 'brave') {
        return Object.assign(Object.assign({}, baseData), { browserType: 'brave', fingerprintingSeed: Math.floor(Math.random() * 0xffffffff) + 1 });
    }
    return Object.assign(Object.assign({}, baseData), { browserType: 'camoufox', fontSpacingSeed: Math.floor(Math.random() * 0xffffffff) + 1, audioFingerprintSeed: Math.floor(Math.random() * 0xffffffff) + 1 });
}
class RoverfoxClient {
    constructor(wsAPIKey, managerUrl, debug = false, options) {
        // Direct worker connection (bypasses manager server assignment for local testing)
        this.workerWsUrl = null;
        this.debug = debug;
        this.workerWsUrl = (options === null || options === void 0 ? void 0 : options.workerWsUrl) || null;
        this.connectionPool = new ConnectionPool(wsAPIKey, debug);
        this.managerClient = new ManagerClient(wsAPIKey, managerUrl, debug);
        this.replayManager = new ReplayManager();
        this.storageManager = new StorageManager(this.managerClient);
        this.dataUsageTrackers = new Map();
        this.geoService = new IPGeolocationService();
        // Set up streaming message handler
        this.connectionPool.setStreamingMessageHandler((message) => {
            this.replayManager.handleStreamingControlMessage(message);
        });
    }
    /**
     * Launch a browser profile - gets server assignment from manager.
     * Optionally pass a proxyUrl to override dynamic proxy selection.
     */
    async launchProfile(browserId, options) {
        // Get server assignment (bypass manager if workerWsUrl is set for local testing)
        let roverfoxWsUrl;
        let replayWsUrl;
        let serverId = undefined;
        if (this.workerWsUrl) {
            roverfoxWsUrl = this.workerWsUrl;
            replayWsUrl = this.workerWsUrl.replace('/roverfox', '/replay');
            if (this.debug)
                console.log(`[client] Using direct worker connection: ${roverfoxWsUrl}`);
        }
        else {
            const assignment = await this.managerClient.getServerAssignment({
                browserId,
            });
            roverfoxWsUrl = assignment.roverfoxWsUrl;
            replayWsUrl = assignment.replayWsUrl;
            serverId = assignment.serverId;
        }
        // Get or create replay WebSocket (reuses if already connected)
        const replayWs = this.connectionPool.getReplayWebSocket(replayWsUrl);
        // Fetch profile and proxy data from Manager API
        const { profile, proxy: staticProxyObject } = await this.managerClient.getProfile(browserId);
        // Determine browser type from profile data (defaults to camoufox for old profiles)
        const browserType = profile.data.browserType || 'camoufox';
        // Get or create browser connection with correct connector type
        const browser = await this.connectionPool.getBrowserConnection(roverfoxWsUrl, browserType);
        // Auto-assign geo state if profile doesn't have one
        // Manager handles proportional assignment based on proxy/profile capacity
        if (!profile.geo_state) {
            try {
                const geo = await this.managerClient.assignGeo(browserId);
                profile.geo_state = geo.geoState;
                profile.geo_latitude = geo.latitude;
                profile.geo_longitude = geo.longitude;
                if (this.debug) {
                    console.log(`[client] Auto-assigned geo_state=${geo.geoState} to ${browserId}`);
                }
            }
            catch (_e) {
                // Non-critical: continue without geo (will use static proxy)
                if (this.debug) {
                    console.error(`[client] Failed to auto-assign geo for ${browserId}:`, _e instanceof Error ? _e.message : _e);
                }
            }
        }
        // Proxy selection: use explicit override, dynamic geo-matched, or static fallback
        let proxyObject = staticProxyObject;
        let selectedProxyId = null;
        if (options === null || options === void 0 ? void 0 : options.proxyUrl) {
            // Explicit proxy override — skip dynamic selection entirely
            let proxyUrlObj;
            try {
                proxyUrlObj = new URL(options.proxyUrl);
            }
            catch (_a) {
                throw new Error(`Invalid proxyUrl provided: ${options.proxyUrl}`);
            }
            proxyObject = {
                server: `${proxyUrlObj.hostname}:${proxyUrlObj.port}`,
                username: decodeURIComponent(proxyUrlObj.username),
                password: decodeURIComponent(proxyUrlObj.password),
            };
            if (this.debug) {
                console.log(`[client] Using explicit proxy override for ${browserId}: ${proxyUrlObj.hostname}:${proxyUrlObj.port}`);
            }
        }
        else if (profile.geo_state) {
            try {
                const selected = await this.managerClient.selectProxy({
                    browserId,
                    geoState: profile.geo_state,
                    latitude: profile.geo_latitude,
                    longitude: profile.geo_longitude,
                    service: options === null || options === void 0 ? void 0 : options.service,
                });
                // Override the static proxy with the dynamically selected one
                const proxyUrl = new URL(selected.proxyUrl);
                proxyObject = {
                    server: `${proxyUrl.hostname}:${proxyUrl.port}`,
                    username: decodeURIComponent(proxyUrl.username),
                    password: decodeURIComponent(proxyUrl.password),
                };
                selectedProxyId = selected.proxyId;
                // Use exit IP from health check for geo/WebRTC
                if (selected.exitIp) {
                    profile.data.lastKnownIP = selected.exitIp;
                }
                if (this.debug) {
                    console.log(`[client] Dynamic proxy selected for ${browserId}: proxyId=${selected.proxyId}, state=${selected.geoState}, IP=${selected.exitIp}`);
                }
            }
            catch (e) {
                if (this.debug) {
                    console.error(`[client] Dynamic proxy selection failed for ${browserId}, falling back to static proxy:`, e instanceof Error ? e.message : e);
                }
                // Fall through to static proxy (proxyObject already set)
            }
        }
        // Check if geolocation needs updating based on proxy exit IP
        if (proxyObject) {
            try {
                const serverUrl = new URL(`http://${proxyObject.server}`);
                const proxyConfig = {
                    host: serverUrl.hostname,
                    port: parseInt(serverUrl.port) || 80,
                    username: proxyObject.username || undefined,
                    password: proxyObject.password || undefined,
                };
                const { changed, currentIP } = await this.geoService.hasIPChanged(proxyConfig, profile.data.lastKnownIP || null);
                if (currentIP && (changed || !profile.data.timezone)) {
                    const geoData = await this.geoService.lookup(currentIP);
                    if (geoData) {
                        profile.data.timezone = geoData.timezone;
                        profile.data.geolocation = { lat: geoData.lat, lon: geoData.lon };
                        profile.data.countryCode = geoData.countryCode;
                        profile.data.lastKnownIP = currentIP;
                        // Persist updated geolocation to manager
                        await this.managerClient.updateProfileData(browserId, profile.data);
                        if (this.debug) {
                            if (changed) {
                                console.log(`[client] IP changed for ${browserId}: ${profile.data.lastKnownIP} -> ${currentIP}, updated geolocation to ${geoData.timezone}`);
                            }
                            else {
                                console.log(`[client] Geolocation set for ${browserId}: ${geoData.timezone}`);
                            }
                        }
                    }
                }
            }
            catch (_e) {
                // Non-critical: continue without geolocation update
            }
        }
        // Determine the profile's platform (from DB column, defaults to 'mac')
        const profilePlatform = profile.platform || 'mac';
        // Detect platform mismatch: fingerprint OS doesn't match profile platform.
        // e.g. profile switched from mac to linux, or assigned a macOS fingerprint to a linux profile.
        if (profile.data.fingerprintId && profile.data.navigatorPlatform) {
            const isMacFP = profile.data.navigatorPlatform === 'MacIntel';
            const isLinuxFP = profile.data.navigatorPlatform === 'Linux x86_64';
            const mismatch = (profilePlatform === 'mac' && !isMacFP) ||
                (profilePlatform === 'linux' && !isLinuxFP);
            if (mismatch) {
                console.log(`[client] Platform mismatch for ${browserId}: profile=${profilePlatform}, fingerprint="${profile.data.navigatorPlatform}" — clearing for re-assignment`);
                profile.data.fingerprintId = undefined;
                profile.data.navigatorPlatform = undefined;
                profile.data.navigatorOscpu = undefined;
                profile.data.hardwareConcurrency = undefined;
                profile.data.webglVendor = undefined;
                profile.data.webglRenderer = undefined;
                profile.data.screenDimensions = undefined;
                profile.data.viewport = undefined;
                profile.data.devicePixelRatio = undefined;
                profile.data.fontList = undefined;
                profile.data.speechVoices = undefined;
                profile.data.userAgent = undefined;
            }
        }
        // Detect mobile fingerprints that slipped through before the OS filter was added.
        // Camoufox is desktop-only — mobile fingerprints cause cross-signal mismatches.
        const DESKTOP_PLATFORMS = ['Win32', 'MacIntel', 'Linux x86_64'];
        if (profile.data.fingerprintId &&
            profile.data.navigatorPlatform &&
            !DESKTOP_PLATFORMS.includes(profile.data.navigatorPlatform)) {
            console.log(`[client] Mobile fingerprint detected for ${browserId} (platform="${profile.data.navigatorPlatform}") — clearing for re-assignment`);
            profile.data.fingerprintId = undefined;
            profile.data.navigatorPlatform = undefined;
            profile.data.navigatorOscpu = undefined;
            profile.data.hardwareConcurrency = undefined;
            profile.data.webglVendor = undefined;
            profile.data.webglRenderer = undefined;
            profile.data.screenDimensions = undefined;
            profile.data.viewport = undefined;
            profile.data.devicePixelRatio = undefined;
            profile.data.fontList = undefined;
            profile.data.speechVoices = undefined;
            profile.data.userAgent = undefined;
        }
        // Data quality cleanup: fix corrupted values loaded from DB.
        // Bad speech voices from corrupted pool data can bloat the profile JSONB,
        // causing updateProfileData() to fail silently and preventing seed persistence.
        let profileUpdated = false;
        if (Array.isArray(profile.data.speechVoices) &&
            profile.data.speechVoices.length > 500) {
            console.log(`[client] Corrupted speechVoices for ${browserId}: ${profile.data.speechVoices.length} entries (max 500) — clearing`);
            profile.data.speechVoices = undefined;
            profileUpdated = true;
        }
        // Auto-assign fingerprint from pool if profile doesn't have one yet
        if (!profile.data.fingerprintId) {
            try {
                const fp = await this.managerClient.assignFingerprint(profilePlatform);
                profile.data.fingerprintId = fp.fingerprintId;
                if (fp.userAgent)
                    profile.data.userAgent = fp.userAgent;
                profile.data.navigatorPlatform = fp.navigatorPlatform;
                profile.data.navigatorOscpu = fp.navigatorOscpu;
                profile.data.hardwareConcurrency = fp.hardwareConcurrency;
                profile.data.webglVendor = fp.webglVendor;
                profile.data.webglRenderer = fp.webglRenderer;
                profile.data.screenDimensions = fp.screenDimensions;
                profile.data.devicePixelRatio = fp.devicePixelRatio;
                profile.data.fontList = fp.fontList;
                // Validate speechVoices: must be an array with reasonable length.
                // The DB column is TEXT[] but bad pool data can have 10k+ entries.
                if (Array.isArray(fp.speechVoices) && fp.speechVoices.length <= 500) {
                    profile.data.speechVoices = fp.speechVoices;
                }
                else if (Array.isArray(fp.speechVoices)) {
                    if (this.debug) {
                        console.warn(`[client] speechVoices from pool has ${fp.speechVoices.length} entries (expected <500), skipping`);
                    }
                    profile.data.speechVoices = undefined;
                }
                else {
                    profile.data.speechVoices = undefined;
                }
                profileUpdated = true;
                if (this.debug) {
                    console.log(`[client] Assigned fingerprint ${fp.fingerprintId} to ${browserId} (platform: ${fp.navigatorPlatform})`);
                }
            }
            catch (_e) {
                if (this.debug) {
                    console.error(`[client] Failed to assign fingerprint from pool for ${browserId}, using hardcoded fallback`);
                }
                // Fallback: apply a complete hardcoded fingerprint for the platform
                const fallback = getFallbackFingerprint(profilePlatform, browserType);
                if (!profile.data.navigatorPlatform)
                    profile.data.navigatorPlatform = fallback.navigatorPlatform;
                if (!profile.data.navigatorOscpu)
                    profile.data.navigatorOscpu = fallback.navigatorOscpu;
                if (!profile.data.hardwareConcurrency)
                    profile.data.hardwareConcurrency = fallback.hardwareConcurrency;
                if (!profile.data.webglVendor)
                    profile.data.webglVendor = fallback.webglVendor;
                if (!profile.data.webglRenderer)
                    profile.data.webglRenderer = fallback.webglRenderer;
                if (!profile.data.screenDimensions)
                    profile.data.screenDimensions = fallback.screenDimensions;
                if (!profile.data.devicePixelRatio)
                    profile.data.devicePixelRatio = fallback.devicePixelRatio;
                if (!profile.data.speechVoices)
                    profile.data.speechVoices = fallback.speechVoices;
                profileUpdated = true;
            }
        }
        else {
            // Backfill: fingerprintId exists but some fields may be missing
            // (e.g. new fields added after initial assignment like webglVendor, speechVoices)
            const missing = [];
            if (!profile.data.userAgent)
                missing.push('userAgent');
            if (!profile.data.navigatorPlatform)
                missing.push('navigatorPlatform');
            if (!profile.data.navigatorOscpu)
                missing.push('navigatorOscpu');
            if (!profile.data.hardwareConcurrency)
                missing.push('hardwareConcurrency');
            if (!profile.data.webglVendor)
                missing.push('webglVendor');
            if (!profile.data.webglRenderer)
                missing.push('webglRenderer');
            if (!profile.data.screenDimensions)
                missing.push('screenDimensions');
            if (!profile.data.fontList || profile.data.fontList.length === 0)
                missing.push('fontList');
            if (!profile.data.speechVoices || profile.data.speechVoices.length === 0)
                missing.push('speechVoices');
            if (missing.length > 0) {
                try {
                    const fp = await this.managerClient.getFingerprint(profile.data.fingerprintId);
                    // Only fill fields that are missing — never overwrite existing data
                    if (!profile.data.userAgent && fp.userAgent) {
                        profile.data.userAgent = fp.userAgent;
                    }
                    if (!profile.data.navigatorPlatform && fp.navigatorPlatform) {
                        profile.data.navigatorPlatform = fp.navigatorPlatform;
                    }
                    if (!profile.data.navigatorOscpu && fp.navigatorOscpu) {
                        profile.data.navigatorOscpu = fp.navigatorOscpu;
                    }
                    if (!profile.data.hardwareConcurrency && fp.hardwareConcurrency) {
                        profile.data.hardwareConcurrency = fp.hardwareConcurrency;
                    }
                    if (!profile.data.webglVendor && fp.webglVendor) {
                        profile.data.webglVendor = fp.webglVendor;
                    }
                    if (!profile.data.webglRenderer && fp.webglRenderer) {
                        profile.data.webglRenderer = fp.webglRenderer;
                    }
                    if (!profile.data.screenDimensions && fp.screenDimensions) {
                        profile.data.screenDimensions = fp.screenDimensions;
                    }
                    if (!profile.data.devicePixelRatio && fp.devicePixelRatio) {
                        profile.data.devicePixelRatio = fp.devicePixelRatio;
                    }
                    if ((!profile.data.fontList || profile.data.fontList.length === 0) &&
                        fp.fontList &&
                        fp.fontList.length > 0) {
                        profile.data.fontList = fp.fontList;
                    }
                    if ((!profile.data.speechVoices ||
                        profile.data.speechVoices.length === 0) &&
                        Array.isArray(fp.speechVoices) &&
                        fp.speechVoices.length > 0 &&
                        fp.speechVoices.length <= 500) {
                        profile.data.speechVoices = fp.speechVoices;
                    }
                    profileUpdated = true;
                    if (this.debug) {
                        console.log(`[client] Backfilled ${missing.length} fields for ${browserId} from pool entry ${profile.data.fingerprintId}: ${missing.join(', ')}`);
                    }
                }
                catch (_e) {
                    if (this.debug) {
                        console.error(`[client] Failed to backfill fingerprint for ${browserId} (pool entry ${profile.data.fingerprintId})`);
                    }
                }
            }
        }
        // Platform-aware font backfill: if fontList is still empty after pool assignment,
        // generate a random subset from the appropriate platform's font list
        if (!profile.data.fontList || profile.data.fontList.length === 0) {
            const seed = profile.data.fontSpacingSeed ||
                Math.floor(Math.random() * 0xffffffff) + 1;
            profile.data.fontList =
                profilePlatform === 'linux'
                    ? generateRandomLinuxFontSubset(seed)
                    : generateRandomFontSubset(seed);
            profileUpdated = true;
        }
        // Camoufox-specific backfill
        if (profile.data.browserType !== 'brave') {
            // Generate random seeds (per-profile unique, not from pool).
            // Explicitly check for 0 as well — seed=0 is treated as "not set" because
            // the init script skips application when seed is falsy, and seed=0 would
            // produce identical fingerprints across all profiles.
            if (!profile.data.audioFingerprintSeed ||
                profile.data.audioFingerprintSeed === 0) {
                profile.data.audioFingerprintSeed =
                    Math.floor(Math.random() * 0xffffffff) + 1;
                profileUpdated = true;
            }
        }
        if (!profile.data.canvasSeed || profile.data.canvasSeed === 0) {
            profile.data.canvasSeed = Math.floor(Math.random() * 0xffffffff) + 1;
            profileUpdated = true;
        }
        if (!profile.data.fontSpacingSeed || profile.data.fontSpacingSeed === 0) {
            profile.data.fontSpacingSeed = Math.floor(Math.random() * 0xffffffff) + 1;
            profileUpdated = true;
        }
        // Viewport derived from screen dimensions.
        // Regenerate if missing OR if viewport is wider/taller than screen (stale from
        // a previous fingerprint assignment with different screen dims).
        if (profile.data.screenDimensions) {
            const vp = profile.data.viewport;
            const sd = profile.data.screenDimensions;
            if (!vp || vp.width > sd.width || vp.height > sd.height) {
                profile.data.viewport = generateViewport(sd);
                profileUpdated = true;
            }
        }
        if (!profile.data.devicePixelRatio) {
            profile.data.devicePixelRatio = 1;
            profileUpdated = true;
        }
        if (profileUpdated) {
            try {
                await this.managerClient.updateProfileData(browserId, profile.data);
                if (this.debug) {
                    console.log(`[client] Updated profile data for ${browserId}`);
                }
            }
            catch (saveErr) {
                // Log the error — silent failures here cause seeds/fingerprints to
                // not persist, making the test runner report stale DB values.
                console.warn(`[client] Failed to save profile data for ${browserId}:`, saveErr instanceof Error ? saveErr.message : saveErr);
            }
        }
        // Create browser context with profile data
        return this.launchInstance(browser, replayWs, profile, proxyObject, browserId, false, // skipAudit
        selectedProxyId, // dynamic proxy to release on close
        serverId);
    }
    /**
     * Launch a one-time browser without profile
     */
    async launchOneTimeBrowser(proxyUrl, options) {
        const browserType = (options === null || options === void 0 ? void 0 : options.browserType) || 'camoufox';
        // Get server assignment from manager
        const assignment = await this.managerClient.getServerAssignment({
            platform: options === null || options === void 0 ? void 0 : options.platform,
            browserType,
        });
        const { roverfoxWsUrl, replayWsUrl } = assignment;
        // Get or create connections with correct browser type
        const browser = await this.connectionPool.getBrowserConnection(roverfoxWsUrl, browserType);
        const replayWs = this.connectionPool.getReplayWebSocket(replayWsUrl);
        const proxyObject = proxyUrl ? formatProxyURL(proxyUrl) : null;
        const browserId = v4();
        // Try pool-based fingerprint assignment, fall back to minimal defaults
        let fp = null;
        try {
            fp = await this.managerClient.assignFingerprint((options === null || options === void 0 ? void 0 : options.platform) || 'mac', browserType);
        }
        catch (_e) {
            // Pool unavailable - use fallback
        }
        const platform = (options === null || options === void 0 ? void 0 : options.platform) || 'mac';
        // Backfill fonts if pool didn't provide them
        let fontList = fp === null || fp === void 0 ? void 0 : fp.fontList;
        if (!fontList || fontList.length === 0) {
            const seed = Math.floor(Math.random() * 0xffffffff) + 1;
            fontList =
                platform === 'linux'
                    ? generateRandomLinuxFontSubset(seed)
                    : generateRandomFontSubset(seed);
        }
        const profileData = generateProfileData(fp, platform, browserType, proxyUrl);
        const context = await this.launchInstance(browser, replayWs, {
            browser_id: browserId,
            data: profileData,
        }, proxyObject, browserId, true, // skipAudit
        null, assignment.serverId);
        // Close as one time context
        const closeContext = context.close.bind(context);
        context.close = (options) => closeContext(Object.assign(Object.assign({}, options), { isOneTime: true }));
        return context;
    }
    /**
     * Check if a port is in use
     */
    static async isPortInUse(port) {
        return new Promise((resolve) => {
            const server = require$$0$1.createServer();
            server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
            server.once('listening', () => {
                server.close();
                resolve(false);
            });
            server.listen(port, 'localhost');
        });
    }
    /**
     * Health check for existing server
     */
    static async healthCheckServer(port) {
        return new Promise((resolve) => {
            const req = http.get(`http://localhost:${port}/health`, { timeout: 2000 }, (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => {
                resolve(false);
            });
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
        });
    }
    /**
     * Launch a local context using on-demand local roverfox server
     * Checks if server is already running on port 9001 and connects to it,
     * or spins up a new server if not. This check happens every time.
     * Server runs persistently across multiple processes - no automatic shutdown.
     * Note: Local contexts don't use streaming/replay functionality
     * This is a static method - no client instance required
     */
    static async launchLocalContext(proxyUrl, browserType = 'camoufox') {
        var _a, _b, _c;
        // Check if port is in use every time
        const portInUse = await RoverfoxClient.isPortInUse(RoverfoxClient.localPort);
        if (portInUse) {
            // Port is in use - verify server is healthy
            const isHealthy = await RoverfoxClient.healthCheckServer(RoverfoxClient.localPort);
            if (!isHealthy) {
                throw new Error(`Port ${RoverfoxClient.localPort} is occupied but server is not responding. ` +
                    `Please kill the process on port ${RoverfoxClient.localPort} and try again.`);
            }
            // Set up config to connect to existing healthy server
            if (!RoverfoxClient.localServerConfig) {
                RoverfoxClient.localServerConfig = {
                    roverfoxWsUrl: `ws://localhost:${RoverfoxClient.localPort}/roverfox`,
                    replayWsUrl: '',
                };
            }
        }
        else {
            // Port is free - start new server if we don't have one
            if (!RoverfoxClient.localServer) {
                await RoverfoxClient.startLocalServer(browserType);
            }
        }
        if (!RoverfoxClient.localServerConfig) {
            throw new Error('Failed to start or connect to local server');
        }
        const { roverfoxWsUrl } = RoverfoxClient.localServerConfig;
        // Create a temporary connection pool for local server (no auth needed)
        const tempConnectionPool = new ConnectionPool('', false);
        // Get or create connection to local server (no replay needed)
        const browser = await tempConnectionPool.getBrowserConnection(roverfoxWsUrl, browserType);
        const proxyObject = proxyUrl ? formatProxyURL(proxyUrl) : null;
        const browserId = v4();
        const platform = process.platform === 'darwin' ? 'mac' : 'linux';
        const profile = {
            browser_id: browserId,
            data: generateProfileData(null, platform, browserType, proxyUrl || null),
        };
        const viewport = profile.data.viewport;
        // Create browser context without streaming
        const context = await browser.newContext(Object.assign({ bypassCSP: false, viewport, deviceScaleFactor: profile.data.devicePixelRatio || 1 }, (proxyObject
            ? {
                proxy: {
                    server: proxyObject.server,
                    username: proxyObject.username,
                    password: proxyObject.password,
                },
            }
            : {})));
        // Apply fingerprints: init script (runs before any page scripts) + page event fallback
        await applyFingerprint(context, Object.assign(Object.assign({}, (profile.data.browserType === 'camoufox' && {
            fontSpacingSeed: profile.data.fontSpacingSeed,
            audioFingerprintSeed: profile.data.audioFingerprintSeed,
        })), { screenWidth: (_a = profile.data.screenDimensions) === null || _a === void 0 ? void 0 : _a.width, screenHeight: (_b = profile.data.screenDimensions) === null || _b === void 0 ? void 0 : _b.height, screenColorDepth: (_c = profile.data.screenDimensions) === null || _c === void 0 ? void 0 : _c.colorDepth, timezone: profile.data.timezone, navigatorPlatform: profile.data.navigatorPlatform, navigatorOscpu: profile.data.navigatorOscpu, hardwareConcurrency: profile.data.hardwareConcurrency, webglVendor: profile.data.webglVendor, webglRenderer: profile.data.webglRenderer, canvasSeed: profile.data.canvasSeed, fontList: profile.data.fontList, speechVoices: profile.data.speechVoices }), profile);
        // Wrap context.close to handle cleanup
        const originalClose = context.close.bind(context);
        context.close = async (options) => {
            await originalClose(options);
            // Note: Browser and server are shared across processes
            // Don't close them here - they'll persist for reuse
        };
        return context;
    }
    /**
     * Starts the local roverfox server
     */
    static async startLocalServer(browserType) {
        if (RoverfoxClient.localServer) {
            return;
        }
        // Create a simple HTTP server for local use (no HTTPS needed)
        const httpServer = http.createServer((req, res) => {
            if (req.url === '/' || req.url === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok', service: 'roverfox-local' }));
            }
            else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not found' }));
            }
        });
        // Create server config for local use
        const config = {
            port: RoverfoxClient.localPort,
            host: 'localhost',
            authTokens: [],
            basicAuth: {
                user: '',
                pass: '',
            },
            proxyPath: '/roverfox',
            replayPath: '/replay',
            httpsServer: httpServer, // Type cast since we're using http, not https
            skipAuth: true, // Skip authentication for local development
            numBrowserServers: 1, // Only need 1 browser server for local development
            headless: false, // Always show browser in local mode
            quiet: true, // Suppress verbose logs in local mode
            browserTypes: [browserType], // Only launch the requested browser type
        };
        RoverfoxClient.localServer = new LocalProxyServer(config);
        await RoverfoxClient.localServer.start();
        // Store connection URLs (no replay needed for local contexts)
        RoverfoxClient.localServerConfig = {
            roverfoxWsUrl: `ws://localhost:${RoverfoxClient.localPort}${config.proxyPath}`,
            replayWsUrl: '', // Not used for local contexts
        };
    }
    /**
     * Internal method to launch instance with profile data
     */
    async launchInstance(browser, replayWs, profile, proxyObject, browserId, skipAudit = false, selectedProxyId = null, serverId) {
        var _a, _b, _c;
        // Strip IndexedDB from storage state to prevent restoration conflicts
        let storageStateToUse = profile.data.storageState;
        if (storageStateToUse &&
            typeof storageStateToUse === 'object' &&
            Array.isArray(storageStateToUse.origins)) {
            storageStateToUse = Object.assign(Object.assign({}, storageStateToUse), { origins: storageStateToUse.origins.map((origin) => (Object.assign(Object.assign({}, origin), { indexedDB: [] }))) });
        }
        // Build per-context user agent from platform (ensures UA matches platform/oscpu)
        const builtUA = buildUserAgentForPlatform(profile.data.navigatorPlatform);
        const contextUserAgent = builtUA || profile.data.userAgent || undefined;
        // Create browser context
        const context = await browser.newContext(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (storageStateToUse ? { storageState: storageStateToUse } : {})), { bypassCSP: false }), (contextUserAgent ? { userAgent: contextUserAgent } : {})), (profile.data.viewport ? { viewport: profile.data.viewport } : {})), (profile.data.screenDimensions
            ? {
                screen: {
                    width: profile.data.screenDimensions.width,
                    height: profile.data.screenDimensions.height,
                },
            }
            : {})), (profile.data.devicePixelRatio
            ? { deviceScaleFactor: profile.data.devicePixelRatio }
            : {})), (proxyObject
            ? {
                proxy: {
                    server: proxyObject.server,
                    username: proxyObject.username,
                    password: proxyObject.password,
                },
            }
            : {})));
        // Apply fingerprints: init script (runs before any page scripts) + page event fallback.
        // This ensures: (1) fingerprint values are set immediately, (2) custom window
        // functions self-destruct before any page script can detect them, and (3) values
        // persist across new tabs in the same context.
        await applyFingerprint(context, Object.assign(Object.assign({}, (profile.data.browserType === 'camoufox' && {
            fontSpacingSeed: profile.data.fontSpacingSeed,
            audioFingerprintSeed: profile.data.audioFingerprintSeed,
        })), { screenWidth: (_a = profile.data.screenDimensions) === null || _a === void 0 ? void 0 : _a.width, screenHeight: (_b = profile.data.screenDimensions) === null || _b === void 0 ? void 0 : _b.height, screenColorDepth: (_c = profile.data.screenDimensions) === null || _c === void 0 ? void 0 : _c.colorDepth, timezone: profile.data.timezone, lastKnownIP: profile.data.lastKnownIP, navigatorPlatform: profile.data.navigatorPlatform, navigatorOscpu: profile.data.navigatorOscpu, hardwareConcurrency: profile.data.hardwareConcurrency, webglVendor: profile.data.webglVendor, webglRenderer: profile.data.webglRenderer, canvasSeed: profile.data.canvasSeed, fontList: profile.data.fontList, speechVoices: profile.data.speechVoices }), profile);
        // Register profile with replay hub
        try {
            await this.connectionPool.safeSend(replayWs, {
                type: 'register-profile',
                uuid: browserId,
            });
        }
        catch (_error) {
            // Continue execution as this is not critical
        }
        if (!skipAudit)
            await this.managerClient.logAudit(browserId, 'openContext', {});
        // Initialize data usage tracker for this context
        const dataUsageTracker = new DataUsageTracker(browserId, this.debug);
        this.dataUsageTrackers.set(browserId, dataUsageTracker);
        // Set up page event handlers for replay and storage
        context.on('page', async (page) => {
            try {
                const pageId = v4();
                await this.replayManager.enableLiveReplay(page, pageId, browserId, replayWs, this.connectionPool);
                this.storageManager.initStorageSaver(page, profile);
                // Attach data usage tracking to this page
                dataUsageTracker.attachToPage(page);
                page.on('close', () => {
                    this.storageManager.saveStorage(page, profile);
                });
            }
            catch (err) {
                // Page may have navigated or closed before setup completed — not critical
                if (this.debug) {
                    console.log(`[roverfox] Page setup interrupted for ${browserId}: ${err.message}`);
                }
            }
        });
        // Wrap context.close to clean up replay resources and release proxy
        const closeContext = context.close.bind(context);
        context.close = async (options) => {
            var _a;
            if (!skipAudit)
                await this.managerClient.logAudit(browserId, 'closeContext', {});
            // Release dynamically selected proxy back to the pool (with 5s timeout to avoid hanging if manager is unreachable)
            if (selectedProxyId) {
                await Promise.race([
                    this.managerClient.releaseProxy(selectedProxyId, true),
                    new Promise((resolve) => setTimeout(resolve, 5000)),
                ]).catch(() => { });
            }
            // Report data usage to manager
            const tracker = this.dataUsageTrackers.get(browserId);
            if (tracker) {
                const usageData = tracker.getUsageData();
                await this.managerClient.logUsage(usageData.browserId, usageData.timeStart, usageData.timeEnd, usageData.bytes, (_a = options === null || options === void 0 ? void 0 : options.isOneTime) !== null && _a !== void 0 ? _a : false, serverId);
                // Clean up tracker
                this.dataUsageTrackers.delete(browserId);
            }
            // Clean up streaming state
            this.replayManager.cleanup(browserId);
            // Send unregister message to replay hub
            try {
                await this.connectionPool.safeSend(replayWs, {
                    type: 'unregister-profile',
                    uuid: browserId,
                });
            }
            catch (_error) {
                // Silently ignore unregister errors
            }
            // Close the WebSocket specific to this browserId
            try {
                await this.replayManager.closeWebSocketForBrowser(browserId);
            }
            catch (_error) {
                // Silently ignore close errors
            }
            await closeContext(options);
            // Close browser if no more contexts
            if (browser.contexts().length === 0) {
                browser.close();
            }
        };
        return context;
    }
    /**
     * Creates a new profile with auto-assigned geo state and fingerprint.
     * Geo is assigned proportionally based on proxy capacity per state.
     * Override with options.geoState/latitude/longitude if needed.
     */
    async createProfile(options) {
        const browserType = (options === null || options === void 0 ? void 0 : options.browserType) || 'camoufox';
        const platform = (options === null || options === void 0 ? void 0 : options.platform) || 'mac';
        const browserId = v4();
        // Assign fingerprint from the real fingerprint pool (platform-aware)
        const fp = await this.managerClient.assignFingerprint(platform);
        const profileData = generateProfileData(fp, platform, browserType, null);
        const profile = {
            browser_id: browserId,
            data: profileData,
        };
        // Save profile to DB
        await this.managerClient.createProfile(browserId, profile.data, platform, browserType);
        // Assign geo state (proportional to proxy capacity per state)
        if (options === null || options === void 0 ? void 0 : options.geoState) {
            // Manual override — use the provided geo
            // Update profile row directly via manager
            await this.managerClient.updateProfileData(browserId, profile.data);
            if (this.debug) {
                console.log(`[client] Profile ${browserId} created with manual geo_state=${options.geoState}`);
            }
        }
        else {
            // Auto-assign geo state proportionally
            try {
                const geo = await this.managerClient.assignGeo(browserId);
                if (this.debug) {
                    console.log(`[client] Profile ${browserId} created with auto geo_state=${geo.geoState}`);
                }
            }
            catch (_e) {
                // Non-critical: geo will be assigned at launch time if needed
            }
        }
        return profile;
    }
    /**
     * Deletes a profile
     */
    async deleteProfile(browserId) {
        await this.managerClient.deleteProfile(browserId);
    }
    /**
     * Lists all profiles
     */
    async listProfiles() {
        return await this.managerClient.listProfiles();
    }
    /**
     * Updates profile data for a specific browser
     */
    async updateProfileData(browserId, newData) {
        await this.managerClient.updateProfileData(browserId, newData);
    }
    /**
     * Gets profile data for a specific browser
     */
    async getProfileData(browserId) {
        const { profile } = await this.managerClient.getProfile(browserId);
        return profile.data;
    }
}
// Local server management
RoverfoxClient.localServer = null;
RoverfoxClient.localServerConfig = null;
RoverfoxClient.localPort = 9001;

export { IPGeolocationService, LINUX_FONTS, MAC_FONTS, RoverfoxClient, applyFingerprint, RoverfoxClient as default, generateRandomFontSubset, generateRandomLinuxFontSubset, getGeoService };
//# sourceMappingURL=index.js.map
