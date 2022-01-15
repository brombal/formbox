export default function isEqual(a: any, b: any, shallow = false): boolean {
  if (a === b) return true;

  if (!a || !b) return false;

  if (a.constructor !== b.constructor) return false;

  if (typeof a !== 'object') return a === b;

  if (a instanceof Date) return a.toISOString() === b.toISOString();

  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    for (const i of a) {
      if (!b.has(i)) return false;
    }
    return true;
  }

  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [k, v] of a.entries()) {
      if (shallow ? a.get(k) !== b.get(k) : !isEqual(a.get(k), b.get(k))) return false;
    }
    return true;
  }

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (const i in a) {
      if (shallow ? a[i] !== b[i] : !isEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (!a.toString().startsWith('[object ')) {
    return a.toString() === b.toString();
  }

  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (const k in a) {
    if (shallow ? a[k] !== b[k] : !isEqual(a[k], b[k])) return false;
  }
  return true;
}
