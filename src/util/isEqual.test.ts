import isEqual from './isEqual';

test('Primitives succeed', () => {
  expect(isEqual(1, 1)).toBe(true);
  expect(isEqual('a', 'a')).toBe(true);
  expect(isEqual(true, true)).toBe(true);

  expect(isEqual(1, 2)).toBe(false);
  expect(isEqual('a', 'b')).toBe(false);
  expect(isEqual(true, false)).toBe(false);
  expect(isEqual(Symbol('foo'), Symbol('foo'))).toBe(false);
});

test('Date succeeds', () => {
  expect(isEqual(new Date(123456789000), new Date(123456789000))).toBe(true);
  expect(isEqual(new Date(123456789000), new Date(123456789001))).toBe(false);
});

test('RegExp succeeds', () => {
  expect(isEqual(new RegExp('abc'), new RegExp('abc'))).toBe(true);
  expect(isEqual(new RegExp('abc'), new RegExp('def'))).toBe(false);
});

test('Set succeeds', () => {
  expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
  expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3, 4]))).toBe(false);
  expect(isEqual(new Set([1, 2, 3, 4]), new Set([1, 2, 3]))).toBe(false);
  expect(isEqual(new Set([1, 2, 3]), new Set([4, 5, 6]))).toBe(false);
});

test('Map succeeds', () => {
  expect(
    isEqual(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ),
  ).toBe(true);
  expect(isEqual(new Map(), new Map())).toBe(true);
  expect(
    isEqual(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
      new Map([
        ['a', 1],
        ['b', 3],
      ]),
    ),
  ).toBe(false);
  expect(
    isEqual(
      new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]),
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ),
  ).toBe(false);
  expect(
    isEqual(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
      new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]),
    ),
  ).toBe(false);
});

test('toString succeeds', () => {
  class Foo {
    constructor(private name: string) {}
    toString() {
      return this.name;
    }
  }
  expect(isEqual(new Foo('abc'), new Foo('abc'))).toBe(true);
  expect(isEqual(new Foo('abc'), new Foo('def'))).toBe(false);
});

test('Object succeeds', () => {
  expect(
    isEqual(
      {
        a: 1,
        b: 2,
        c: { d: [1, 2, 3] },
      },
      {
        a: 1,
        b: 2,
        c: { d: [1, 2, 3] },
      },
    ),
  ).toBe(true);
  expect(
    isEqual(
      {
        a: 1,
        b: 2,
        c: { d: [1, 2, 3] },
      },
      {
        a: 1,
        b: 2,
        c: { d: [1, 2, 3, 4] },
      },
    ),
  ).toBe(false);
  expect(
    isEqual(
      {
        a: 1,
        b: 2,
        c: { d: [1, 2, 3] },
      },
      {
        a: 1,
        b: 2,
        c: { d: [1, 2, 3] },
        d: 4,
      },
    ),
  ).toBe(false);
});

test('Array succeeds', () => {
  expect(isEqual([1, 2, [3, 4, 5]], [1, 2, [3, 4, 5]])).toBe(true);
  expect(isEqual([1, 2, [3, 4, 5], 4], [1, 2, [3, 4, 5]])).toBe(false);
  expect(isEqual([1, 2, [3, 4, 5]], [1, 2, [3, 4, 5], 4])).toBe(false);
  expect(isEqual([1, 2, [3, 4, 5]], [1, 2, [3, 4, 6]])).toBe(false);
});

test('Different constructors fail', () => {
  expect(isEqual(new Date(), new RegExp('abc'))).toBe(false);
});

test('Shallow tests succeed', () => {
  expect(isEqual(1, 1, true)).toBe(true);
  expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }, true)).toBe(true);
  expect(isEqual([1, 2, 'a'], [1, 2, 'a'], true)).toBe(true);
  expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, true)).toBe(false);
  expect(
    isEqual(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
      true,
    ),
  ).toBe(true);
  expect(
    isEqual(
      new Map<any, any>([
        ['a', 1],
        ['b', { b: 1 }],
      ]),
      new Map<any, any>([
        ['a', 1],
        ['b', { b: 1 }],
      ]),
      true,
    ),
  ).toBe(false);
});
