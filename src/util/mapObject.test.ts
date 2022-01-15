import { mapObject } from './mapObject';

test('Succeeds with no config', () => {
  const result = mapObject(
    {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: [4, 5, 6],
      },
    },
    (value, path, root) => {
      return path.join('.') + ':' + value * 2 + ':' + root.a;
    },
  );
  expect(result).toEqual({
    a: 'a:2:1',
    b: 'b:4:1',
    c: {
      d: 'c.d:6:1',
      e: ['c.e.0:8:1', 'c.e.1:10:1', 'c.e.2:12:1'],
    },
  });
});

test('Does not mutate original', () => {
  const original = { a: 1, b: 2, c: 3 };
  const result = mapObject(original, (value) => value * 2);
  expect(result).not.toBe(original);
  expect(original).toEqual({ a: 1, b: 2, c: 3 });
});

test('Mutates original with option set', () => {
  const original = { a: 1, b: 2, c: 3 };
  const result = mapObject(original, (value) => value * 2, { mutate: true });
  expect(result).toBe(original);
  expect(original).toEqual({ a: 2, b: 4, c: 6 });
});

test('Omits empty values with config set', () => {
  const original = {
    a: 1,
    b: 2,
    c: 'c',
    d: {
      e: 'e',
    },
    f: [3, 4, 5],
    g: ['a', 'b', 'c'],
  };
  const result = mapObject(
    original,
    // Omit all non-numeric values from result
    (value) => (typeof value === 'number' ? value * 2 : undefined),
    { omitEmpty: true },
  );
  expect(result).toEqual({ a: 2, b: 4, f: [6, 8, 10] });
});

test('Maps root array', () => {
  const original = [1, 2, 3];
  const result = mapObject(original, (value) => value * 2, { omitEmpty: true });
  expect(result).toEqual([2, 4, 6]);
});

test('Returns primitive values', () => {
  const original = 'abc';
  const result = mapObject(original, (value) => value * 2, { omitEmpty: true });
  expect(result).toEqual('abc');
});

test('Handles recursive values', () => {
  const original: any = {
    a: 1,
    b: 2,
  };
  original.c = original;
  const result: any = mapObject(original, (value) => value * 2, { omitEmpty: true });
  expect(result.a).toEqual(2);
  expect(result.b).toEqual(4);
  expect(result.c).toEqual(result);
});

test('Does not map non-POJOs', () => {
  class TestClass {
    a = 1;
  }
  const original = new TestClass();
  const result: any = mapObject(original, (value) => value * 2, { omitEmpty: true });
  expect(result).toEqual(original);
});
