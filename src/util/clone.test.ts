import clone from './clone';

test('Clone succeeds', () => {
  expect(clone(null)).toBe(null);
  expect(clone(false)).toBe(false);
  expect(clone(false)).not.toBe(null);
  expect(clone(1) === 1).toBe(true);
  expect(clone('abc') === 'abc').toBe(true);
  expect(clone([1, 2, 3])).toStrictEqual([1, 2, 3]);
  expect(clone({ a: 1, b: 2, c: [1, 2, 3] })).toStrictEqual({ a: 1, b: 2, c: [1, 2, 3] });

  const nestedObject = { d: 4 };
  const cloneNestedObject = clone({ c: [nestedObject] });
  expect(cloneNestedObject.c[0]).not.toBe(nestedObject);

  expect(clone(new RegExp('abc'))).toStrictEqual(new RegExp('abc'));
  expect(clone(/abc/)).not.toStrictEqual(/def/);
  expect(clone(new Date(123456789000))).toStrictEqual(new Date(123456789000));
  expect(clone(new Date(123456789000))).not.toStrictEqual(new Date(123456789001));
  expect(clone(new Set([1, 2, 3]))).toStrictEqual(new Set([1, 2, 3]));
  expect(clone(new Error('message'))).toStrictEqual(new Error('message'));
});
