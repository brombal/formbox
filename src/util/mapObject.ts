/*
# mapObject

Maps an object recursively by calling `callback` on each property and replacing the value with the result.
`callback` is not invoked for properties that contain objects or arrays, but instead `mapObject` is called
recursively on those values.

`callback` is passed the following parameters:
  - `value` - The current value
  - `path` - The path to the value as an array
  - `object` - The original object being mapped

If the result of `callback` is undefined, the property will be absent from the resulting object.

`options` is an object with the following properties:
  - `mutate` - If true, the original object will be mutated (default false)
  - `omitEmpty` - If true, mapped objects and arrays that are empty will be omitted from the result (default false)
 */

import isObject from './isObject';

interface MapObjectOptions {
  mutate?: boolean;
  omitEmpty?: boolean;
}

export function mapObject<TOut>(
  object: any,
  callback: (value: any, path: string[], root: any) => any,
  options?: MapObjectOptions,
): TOut {
  return _mapObject(object, callback, options || {}, new WeakMap(), [], object);
}

function _mapObject(
  object: any,
  callback: (value: any, path: string[], root: any) => any,
  options: MapObjectOptions,
  cache: any,
  path: string[],
  root: any,
): any {
  if (!Array.isArray(object) && !isObject(object)) return object;
  if (cache.has(object)) return cache.get(object);

  const result = options.mutate ? object : Array.isArray(object) ? [] : {};
  cache.set(object, result);

  for (const k in object) {
    const val = object[k];
    const mapped =
      isObject(val) || Array.isArray(val)
        ? _mapObject(val, callback, options, cache, [...path, k], root)
        : callback.call(null, val, [...path, k], root);
    if (mapped !== undefined) result[k] = mapped;
  }

  if (
    !options.omitEmpty ||
    (isObject(result) && Object.keys(result).length) ||
    (Array.isArray(result) && result.length)
  )
    return result;
}
