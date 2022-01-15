import getComparison from './getComparison';

test('Basic test succeeds', () => {
  const a = {
    a: 1,
    b: { c: 2 },
    d: [3, 4, [5, 6]],
    e: {
      f: { g: 1, h: 2 },
      i: { j: 3, k: 2 },
    },
  };
  const b = {
    a: 1, // equal
    b: { c: 3 }, // different
    d: [3, 4, [5, 6]], // equal
    e: {
      f: { g: 1, h: 2 }, // equal
      i: { j: 3, k: 4 }, // different
    },
  };
  const comparison = getComparison(a, b);

  expect(a).not.toBe(comparison);
  expect(a.b).not.toBe(comparison.b);
  expect(a.d).toBe(comparison.d);
  expect(a.e).not.toBe(comparison.e);
  expect(a.e.f).toBe(comparison.e.f);
  expect(a.e.i).not.toBe(comparison.e.i);

  expect(b).toEqual(comparison);
});

test('Missing property is considered changed', () => {
  const a = {
    a: 1,
    b: 2,
  };
  const b = {
    b: 2,
  };
  const comparison = getComparison(a, b);
  expect(a).not.toBe(comparison);
  expect(a.a).not.toBe(comparison.a);
  expect(a.b).toBe(comparison.b);

  expect(b).toEqual(comparison);
});

test('Different types is considered changed', () => {
  const a = {
    a: 1,
    b: 1,
    c: 1,
  };
  const b = {
    a: 1,
    b: '1',
    c: { d: 1 },
  };
  const comparison = getComparison(a, b);
  expect(a).not.toBe(comparison);
  expect(a.a).toBe(comparison.a);
  expect(a.b).not.toBe(comparison.b);
  expect(a.c).not.toBe(comparison.c);
  expect(b).toEqual(comparison);
});

test('Null values are considered changed', () => {
  const a = {
    a: {},
    b: {},
    c: null as any,
  };
  const b = {
    a: {},
    b: null as any,
    c: {},
  };
  const comparison = getComparison(a, b);
  expect(a).not.toBe(comparison);
  expect(a.a).toBe(comparison.a);
  expect(a.b).not.toBe(comparison.b);
  expect(a.c).not.toBe(comparison.c);
  expect(b).toEqual(comparison);
});

test('Different object types is considered changed', () => {
  const a = {
    a: new Date(1234567890000),
    b: new Date(1234567890000),
  };
  const b = {
    a: new Date(1234567890000),
    b: new RegExp('abc'),
  };
  const comparison = getComparison(a, b);
  expect(a).not.toBe(comparison);
  expect(a.a).toBe(comparison.a);
  expect(a.b).not.toBe(comparison.b);
  expect(b).toEqual(comparison);
});

test('Different dates are considered changed', () => {
  const a = {
    a: new Date(1234567890000),
    b: new Date(1234567890000),
    c: 'wrong type',
  };
  const b = {
    a: new Date(1234567890000),
    b: new Date(1234567890001),
    c: new Date(1234567890001),
  };
  const comparison = getComparison(a, b);
  expect(a).not.toBe(comparison);
  expect(a.a).toBe(comparison.a);
  expect(a.b).not.toBe(comparison.b);
  expect(comparison.b).toBeInstanceOf(Date);
  expect(b).toEqual(comparison);
});

test('Different regexes are considered changed', () => {
  const a = {
    a: new RegExp('a'),
    b: /b/,
    c: new RegExp('c'),
    d: /d/,
    e: 'wrong type',
  };
  const b = {
    a: new RegExp('a'),
    b: /b/,
    c: new RegExp('cc'),
    d: /dd/,
    e: /e/,
  };
  const comparison = getComparison(a, b);
  expect(a).not.toBe(comparison);
  expect(a.a).toBe(comparison.a);
  expect(a.b).toBe(comparison.b);
  expect(a.c).not.toBe(comparison.c);
  expect(a.d).not.toBe(comparison.d);
  expect(comparison.a).toBeInstanceOf(RegExp);
  expect(comparison.d).toBeInstanceOf(RegExp);
  expect(b).toEqual(comparison);
});
