import isObject from './isObject';

export default function clone(value: any): any {
  if (!value) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(clone);
  if (value.constructor === Error) return new Error(value.message);
  if (value.constructor === Date) return new Date(value);
  if (value.constructor === RegExp) return new RegExp(value);
  if (value.constructor === Set) return new Set(value);
  if (isObject(value)) {
    const result: any = {};
    for (const k in value) {
      result[k] = clone(value[k]);
    }
    return result;
  }
  throw new Error(`Cannot clone value: ${value} of type ${value.constructor.name}`);
}
