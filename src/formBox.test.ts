import { FormBox } from './formBox';

const mockEvent = (): any => ({ preventDefault() {} });

test('Basic test succeeds', () => {
  const f = new FormBox({
    initialValues: {
      a: 1,
      b: 'b',
      c: [1, 2, 3],
      d: { e: 1, f: 2 },
    },
  });

  expect(f.initialValues).toStrictEqual({
    a: 1,
    b: 'b',
    c: [1, 2, 3],
    d: { e: 1, f: 2 },
  });
  expect(f.values).toStrictEqual({
    a: 1,
    b: 'b',
    c: [1, 2, 3],
    d: { e: 1, f: 2 },
  });
  expect(f.active).toBeUndefined();
  expect(f.errors).toBeUndefined();
  expect(f.touched).toBeUndefined();
  expect(f.dirty).toBeUndefined();
  expect(f.meta).toBeUndefined();
  expect(f.submitting).toBe(false);
  expect(f.validating).toBe(false);
});

test('initialState succeeds', () => {
  const f = new FormBox({
    initialValues: { a: 1 },
    initialState: {
      touched: { a: true },
      errors: { a: 'something' },
    },
  });

  expect(f.errors).toStrictEqual({ a: 'something' });
  expect(f.touched).toStrictEqual({ a: true });
});

test('initialState function succeeds', () => {
  const f = new FormBox({
    initialValues: { a: 1 },
    initialState: (state) => {
      expect(state.initialValues).toStrictEqual({ a: 1 });
      state.touched = { a: true };
      state.errors = { a: 'something' };
    },
  });

  expect(f.errors).toStrictEqual({ a: 'something' });
  expect(f.touched).toStrictEqual({ a: true });
});

test('setValues updates dirty state', () => {
  const f = new FormBox({
    initialValues: { a: 1, b: { c: 2, d: 3 } },
  });

  f.setValue('a', 2);

  expect(f.dirty).toStrictEqual({ a: true });

  f.setValue('b.c', 4);
  expect(f.dirty).toStrictEqual({ a: true, b: { c: true } });
});

test('destroy stops subscriptions', () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  f.destroy();
  f.setValue('a', 2);

  expect(f.dirty).toBeUndefined();
});

test('setState with callback works', () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  f.setState((state) => {
    state.errors = { a: 'something' };
  });
  expect(f.errors).toStrictEqual({ a: 'something' });
});

test('setState with path works', () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  f.setState('errors.a', 'something');
  expect(f.errors).toStrictEqual({ a: 'something' });
});

test('Manual subscription works', () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  const listener = jest.fn();
  f.subscribe((state) => state.values.a, listener);

  f.setValue('a', 2);

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(2);
});

test('Validation that throws works', async () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
    validate() {
      throw new Error('oh no');
    },
  });

  const validatingListener = jest.fn();
  f.subscribe((state) => state.validating, validatingListener);

  const errorListener = jest.fn();
  f.subscribe((state) => state.errors, errorListener);

  const result: Error = await f.validate();

  expect(validatingListener).toHaveBeenCalledTimes(2);
  expect(errorListener).toHaveBeenCalledTimes(1);
  expect(result.message).toBe('oh no');
  expect(f.errors).toStrictEqual(new Error('oh no'));
});

test('Validation that returns works', async () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
    validate() {
      return { a: 'something' };
    },
  });

  const errorListener = jest.fn();
  f.subscribe((state) => state.errors, errorListener);

  const result = await f.validate();

  expect(errorListener).toHaveBeenCalledTimes(1);
  expect(result).toStrictEqual({ a: 'something' });
  expect(f.errors).toStrictEqual({ a: 'something' });
});

test('Validation with no method works', async () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  const errorListener = jest.fn();
  f.subscribe((state) => state.errors, errorListener);

  const result = await f.validate();

  expect(errorListener).not.toHaveBeenCalled();
  expect(result).toBeUndefined();
});

test('handleSubmit works', async () => {
  const validateMock = jest.fn();
  const submitMock = jest.fn();
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
    validate: validateMock,
    onSubmit: submitMock,
  });

  const submittingListener = jest.fn();
  f.subscribe((state) => state.submitting, submittingListener);

  await f.handleSubmit(mockEvent());

  expect(submittingListener).toHaveBeenCalledTimes(2);
  expect(f.submitting).toBe(false);
  expect(f.touched).toEqual({ a: true, b: true });
  expect(validateMock).toHaveBeenCalledTimes(1);
  expect(submitMock).toHaveBeenCalledTimes(1);
  expect(submitMock).toHaveBeenCalledWith({ a: 1, b: 2 });
});

test('handleSubmit with errors works', async () => {
  const submitMock = jest.fn();
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
    validate: () => {
      return { a: 'error' };
    },
    onSubmit: submitMock,
  });

  const submittingListener = jest.fn();
  f.subscribe((state) => state.submitting, submittingListener);

  await f.handleSubmit(mockEvent());

  expect(submittingListener).toHaveBeenCalledTimes(2);
  expect(f.submitting).toBe(false);
  expect(f.touched).toEqual({ a: true, b: true });
  expect(submitMock).not.toHaveBeenCalled();
});

test('handleSubmit with no onSubmit works', async () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  const submittingListener = jest.fn();
  f.subscribe((state) => state.submitting, submittingListener);

  await f.handleSubmit(mockEvent());

  expect(submittingListener).toHaveBeenCalledTimes(2);
  expect(f.submitting).toBe(false);
  expect(f.touched).toEqual({ a: true, b: true });
});

test('getInputHandlers with no config works', async () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  const handlers = f.getInputHandlers('a');
  handlers.onChange({ target: { value: 'x' } } as any);
  expect(f.values).toStrictEqual({ a: 'x', b: 2 });
  expect(f.touched).toStrictEqual({ a: true });
  handlers.onFocus({} as any);
  expect(f.active).toStrictEqual({ a: true });
  handlers.onBlur({} as any);
  expect(f.active).toStrictEqual({ a: false });
  expect(f.touched).toStrictEqual({ a: true });
});

test('getInputHandlers for type input works', async () => {
  const f = new FormBox({
    initialValues: { a: 1, b: 2 },
  });

  const config = {
    type: 'input',
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  } as const;
  const handlers = f.getInputHandlers('a', config);
  handlers.onChange({ target: { value: 'x' } } as any);
  expect(f.values).toStrictEqual({ a: 'x', b: 2 });
  handlers.onFocus({} as any);
  handlers.onBlur({} as any);

  expect(config.onChange).toHaveBeenCalledTimes(1);
  expect(config.onFocus).toHaveBeenCalledTimes(1);
  expect(config.onBlur).toHaveBeenCalledTimes(1);
});

test('getInputHandlers for type checkbox works', async () => {
  const f = new FormBox({
    initialValues: { a: 1 },
  });

  const config = {
    type: 'checkbox',
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  } as const;
  const handlers = f.getInputHandlers('a', config);

  await handlers.onChange({ target: { checked: true, value: 'x' } } as any);
  expect(f.values).toStrictEqual({ a: 'x' });

  await handlers.onChange({ target: { checked: true, value: undefined } } as any);
  expect(f.values).toStrictEqual({ a: true });

  await handlers.onChange({ target: { checked: false, value: 'x' } } as any);
  expect(f.values).toStrictEqual({ a: undefined });

  expect(config.onChange).toHaveBeenCalledTimes(3);
});

test('getInputHandlers for type raw works', async () => {
  const f = new FormBox({
    initialValues: { a: 1 },
  });

  const config = {
    type: 'raw',
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  } as const;
  const handlers = f.getInputHandlers('a', config);

  await handlers.onChange('customValue1' as any);
  expect(f.values).toStrictEqual({ a: 'customValue1' });

  await handlers.onChange('customValue2' as any);
  expect(f.values).toStrictEqual({ a: 'customValue2' });

  expect(config.onChange).toHaveBeenCalledTimes(2);
});

test('getInputHandlers calls validate on change/blur', async () => {
  const f = new FormBox({
    initialValues: { a: 1 },
    validateOnChange: true,
    validateOnBlur: true,
    validate: jest.fn()
  });

  const handlers = f.getInputHandlers('a');

  await handlers.onBlur({ target: { value: '' } } as any);
  expect(f.config.validate).toHaveBeenCalledTimes(1);
  expect(f.config.validate).toHaveBeenCalledWith({ a: 1 });

  await handlers.onChange({ target: { value: 'xxx' } } as any);
  expect(f.values).toStrictEqual({ a: 'xxx' });
  expect(f.config.validate).toHaveBeenCalledTimes(2);
  expect(f.config.validate).toHaveBeenCalledWith({ a: 'xxx' });
});

test('getInputHandlers does not call validate on change/blur when disabled', async () => {
  const f = new FormBox({
    initialValues: { a: 1 },
    validateOnChange: false,
    validateOnBlur: false,
    validate: jest.fn()
  });

  const handlers = f.getInputHandlers('a');

  await handlers.onBlur({ target: { value: '' } } as any);
  await handlers.onChange({ target: { value: 'xxx' } } as any);
  expect(f.config.validate).toHaveBeenCalledTimes(0);
});
