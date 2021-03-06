/* https://unpkg.com/merge-anything@4.0.2/dist/index.esm.js?module */ import { isArray, isPlainObject, isSymbol } from "../../../is-what.js";

/*! *****************************************************************************
                                                                                             Copyright (c) Microsoft Corporation.
                                                                                             
                                                                                             Permission to use, copy, modify, and/or distribute this software for any
                                                                                             purpose with or without fee is hereby granted.
                                                                                             
                                                                                             THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
                                                                                             REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
                                                                                             AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
                                                                                             INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
                                                                                             LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
                                                                                             OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
                                                                                             PERFORMANCE OF THIS SOFTWARE.
                                                                                             ***************************************************************************** */

function __spreadArray(to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
  to[j] = from[i];
  return to;
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function concatArrays(originVal, newVal) {
  if (isArray(originVal) && isArray(newVal)) {
    // concat logic
    return originVal.concat(newVal);
  }
  return newVal; // always return newVal as fallback!!
}

function assignProp(carry, key, newVal, originalObject) {
  var propType = {}.propertyIsEnumerable.call(originalObject, key) ?
  'enumerable' :
  'nonenumerable';
  if (propType === 'enumerable')
  carry[key] = newVal;
  if (propType === 'nonenumerable') {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true });

  }
}
function mergeRecursively(origin, newComer, compareFn) {
  // always return newComer if its not an object
  if (!isPlainObject(newComer))
  return newComer;
  // define newObject to merge all values upon
  var newObject = {};
  if (isPlainObject(origin)) {
    var props_1 = Object.getOwnPropertyNames(origin);
    var symbols_1 = Object.getOwnPropertySymbols(origin);
    newObject = __spreadArray(__spreadArray([], props_1), symbols_1).reduce(function (carry, key) {
      var targetVal = origin[key];
      if (!isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key) ||
      isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key)) {
        assignProp(carry, key, targetVal, origin);
      }
      return carry;
    }, {});
  }
  // newObject has all properties that newComer hasn't
  var props = Object.getOwnPropertyNames(newComer);
  var symbols = Object.getOwnPropertySymbols(newComer);
  var result = __spreadArray(__spreadArray([], props), symbols).reduce(function (carry, key) {
    // re-define the origin and newComer as targetVal and newVal
    var newVal = newComer[key];
    var targetVal = isPlainObject(origin) ? origin[key] : undefined;
    // When newVal is an object do the merge recursively
    if (targetVal !== undefined && isPlainObject(newVal)) {
      newVal = mergeRecursively(targetVal, newVal, compareFn);
    }
    var propToAssign = compareFn ? compareFn(targetVal, newVal, key) : newVal;
    assignProp(carry, key, propToAssign, newComer);
    return carry;
  }, newObject);
  return result;
}
/**
   * Merge anything recursively.
   * Objects get merged, special objects (classes etc.) are re-assigned "as is".
   * Basic types overwrite objects or other basic types.
   * @param object
   * @param otherObjects
   */
function merge(object) {
  var otherObjects = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    otherObjects[_i - 1] = arguments[_i];
  }
  return otherObjects.reduce(function (result, newComer) {
    return mergeRecursively(result, newComer);
  }, object);
}
function mergeAndCompare(compareFn, object) {
  var otherObjects = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    otherObjects[_i - 2] = arguments[_i];
  }
  return otherObjects.reduce(function (result, newComer) {
    return mergeRecursively(result, newComer, compareFn);
  }, object);
}
function mergeAndConcat(object) {
  var otherObjects = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    otherObjects[_i - 1] = arguments[_i];
  }
  return otherObjects.reduce(function (result, newComer) {
    return mergeRecursively(result, newComer, concatArrays);
  }, object);
}

export { concatArrays, merge, mergeAndCompare, mergeAndConcat };