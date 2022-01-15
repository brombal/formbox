import isObject from './isObject';

test('Succeeds', () => {
  expect(isObject({ a: 1 })).toBe(true);
  expect(isObject(new Object({ a: 1 }))).toBe(true);

  expect(isObject(1)).toBe(false);
  expect(isObject('a')).toBe(false);
  expect(isObject(true)).toBe(false);
  expect(isObject([1, 2, 3])).toBe(false);
  expect(isObject(new Date())).toBe(false);
  expect(isObject(new Set([1, 2, 3]))).toBe(false);
  expect(isObject(/abc/)).toBe(false);
  class Foo {}
  expect(isObject(new Foo())).toBe(false);
});
