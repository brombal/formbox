import isObject from './isObject';

export default function clone(value: any) {
  if (!value) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return Array.from(value);
  if (value.constructor === Error) return new Error(value.message);
  if (isObject(value)) {
    const result: any = {};
    for (const k in value) {
      result[k] = clone(value[k]);
    }
    return result;
  }
  return new value.constructor(value);
}
