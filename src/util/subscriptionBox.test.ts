import SubscriptionBox from './subscriptionBox';

test('Basic use case succeeds', () => {
  const box = new SubscriptionBox({
    firstName: 'Johnny',
    favoriteBook: {
      title: 'Green Eggs and Ham',
      author: 'Dr. Seuss',
    },
  });

  const listener1 = jest.fn();
  const unsubscribe1 = box.subscribe((data) => data.favoriteBook, listener1);

  const listener2 = jest.fn();
  const unsubscribe2 = box.subscribe((data) => data.firstName, listener2);

  box.set((data) => {
    data.favoriteBook.title = 'Horton Hears a Who';
  });

  box.set((data) => {
    data.firstName = 'Sally';
  });

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);

  expect(box.data).toStrictEqual({
    firstName: 'Sally',
    favoriteBook: {
      title: 'Horton Hears a Who',
      author: 'Dr. Seuss',
    },
  });

  unsubscribe1();
  unsubscribe2();

  box.set((data) => {
    data.favoriteBook.title = 'The Cat in the Hat';
    data.firstName = 'Billy';
  });

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);
});

test('unsubscribeAll Succeeds', () => {
  const box = new SubscriptionBox({
    firstName: 'Johnny',
    favoriteBook: {
      title: 'Green Eggs and Ham',
      author: 'Dr. Seuss',
    },
  });

  const listener1 = jest.fn();
  const unsubscribe1 = box.subscribe((data) => data.favoriteBook, listener1);

  const listener2 = jest.fn();
  const unsubscribe2 = box.subscribe((data) => data.firstName, listener2);

  box.set((data) => {
    data.favoriteBook.title = 'Horton Hears a Who';
    data.firstName = 'Sally';
  });

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);

  box.unsubscribeAll();

  box.set((data) => {
    data.favoriteBook.title = 'The Cat in the Hat';
    data.firstName = 'Billy';
  });

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);
});

test('Complex data types trigger changes', () => {
  const box = new SubscriptionBox({
    date: new Date(1234567890000),
    regex: /abc/,
    set: new Set([1, 2, 3]),
  });

  const listener1 = jest.fn();
  const unsubscribe1 = box.subscribe((data) => data.date, listener1);

  const listener2 = jest.fn();
  const unsubscribe2 = box.subscribe((data) => data.regex, listener2);

  const listener3 = jest.fn();
  const unsubscribe3 = box.subscribe((data) => data.set, listener3);

  // Same values do not trigger subscription
  box.set((data) => {
    data.date = new Date(1234567890000);
    data.regex = /abc/;
    data.set = new Set([1, 2, 3]);
  });

  expect(listener1).toHaveBeenCalledTimes(0);
  expect(listener2).toHaveBeenCalledTimes(0);
  expect(listener3).toHaveBeenCalledTimes(0);

  // Different date triggers subscription
  box.set((data) => {
    data.date = new Date(1234567890001);
    data.regex = /abc/;
    data.set = new Set([1, 2, 3]);
  });

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(0);
  expect(listener3).toHaveBeenCalledTimes(0);

  // Different regex triggers subscription
  box.set((data) => {
    data.date = new Date(1234567890001);
    data.regex = /def/;
    data.set = new Set([1, 2, 3]);
  });

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);
  expect(listener3).toHaveBeenCalledTimes(0);

  // Different regex triggers subscription
  box.set((data) => {
    data.date = new Date(1234567890001);
    data.regex = /def/;
    data.set = new Set([1, 2, 3, 4]);
  });

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledTimes(1);
  expect(listener3).toHaveBeenCalledTimes(1);
});
