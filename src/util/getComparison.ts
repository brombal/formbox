import isEqual from './isEqual';
import clone from './clone';
import isObject from './isObject';

/**
 https://gist.github.com/brombal/6fc10953c0b082bb12444ba7feb24e4b

 # getComparison

 Returns an object that can be used to compare `a` and `b` (and their nested properties) using `===`.

 The return value will be structurally the same as `b`. However, any properties that are
 equivalent objects (using a deep comparison) to `a`'s properties will be comparable using `===`.
 This will be true for properties at any nested level, including the top level (i.e. if `a` and `b`
 are equivalent, `a` will be identical to the return value).

 E.g.:

 ```
 const a = {
    firstName: 'Alex',
    favoriteBook: {
      title: 'Green Eggs and Ham',
      author: 'Dr. Seuss'
    },
    favoriteSong: {
      title: 'Row row row your boat',
      composer: 'Unknown'
    }
  };
 const b = {
    firstName: 'Alex',
    favoriteBook: {
      title: 'Green Eggs and Ham',
      author: 'Dr. Seuss'
    },
    favoriteSong: {
      title: 'Twinkle twinkle',
      composer: 'Mozart'
    }
  };
 const comparison = getComparison(a, b);
 a === comparison // false
 a.firstName === comparison.firstName // true
 a.favoriteBook === comparison.favoriteBook // true
 a.favoriteSong === comparison.favoriteSong // false
 ```
 */
export default function getComparison(a: any, b: any): any {
  if (a === b) return a;
  if (!a || !b) return b;
  if (isEqual(a, b, true)) return a;

  if (a.constructor === b.constructor && (Array.isArray(a) || isObject(a))) {
    let changed = false;
    const result: any = Array.isArray(a) ? [] : {};
    for (const key in b) {
      const compared = getComparison(a[key], b[key]);
      if (compared !== a[key]) {
        result[key] = compared;
        changed = true;
      } else {
        result[key] = a[key];
      }
    }
    for (const key in a) {
      if (!(key in b)) changed = true;
    }
    return changed ? result : a;
  }

  return clone(b);
}
