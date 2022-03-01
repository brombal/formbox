import get from 'just-safe-get';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  CastProperties,
  cleanPath,
  FormBox,
  FormBoxConfig,
  FormBoxInputPropsConfig,
  FormBoxState,
  Selector,
  SelectorPath,
} from './formBox';
import { mapObject } from './util/mapObject';

const formContext = createContext<FormBox<any>>(null as any);

export function FormBoxProvider<TValues extends object>({
  form,
  ...other
}: {
  form: FormBox<TValues>;
  children: any;
}) {
  return <formContext.Provider value={form} {...other} />;
}

export function useCreateFormBox<TValues extends object>(
  config: FormBoxConfig<TValues>,
): FormBox<TValues> {
  const formRef = useRef<FormBox<TValues>>();
  if (!formRef.current) {
    formRef.current = new FormBox<TValues>(config);
  }
  formRef.current!.config = config;

  useEffect(() => {
    // if (formRef.current!.config.validateOnMount) formRef.current!.validate();
    return () => formRef.current!.destroy();
  }, []);

  return formRef.current!;
}

/*
Returns the current form object.
*/
export function useFormBox<TValues extends object>(): FormBox<TValues> {
  return useContext(formContext)!;
}

export function useInputProps(
  path: SelectorPath,
  config?: FormBoxInputPropsConfig,
  deps: any[] = [],
) {
  const form = useFormBox();
  const value = useFormState(['values', ...cleanPath(path)], form);
  return useMemo(
    () => ({ value, ...form.getInputHandlers(path, config) }),
    [value, JSON.stringify(path), ...deps],
  );
}

/*
Returns the current form state returned by `selector` and re-renders the component whenever it changes.
*/
export function useFormState<TValues extends object = any, TOut = any>(
  selector: Selector<FormBoxState<TValues>, TOut>,
  form?: FormBox<TValues>,
): TOut {
  form = form || useContext(formContext)!;
  const [, trigger] = useState({});
  useFormEffect(selector, () => trigger({}), form);
  return createPathSelector(selector)(form.state);
}

/*
Triggers `effect` to run whenever the state value returned by `selector` changes.
 */
export function useFormEffect<TValues extends object>(
  selector: Selector<FormBoxState<TValues>, any>,
  effect: (val: any) => void,
  form?: FormBox<TValues>,
) {
  form = form || useContext(formContext)!;
  useEffect(() => {
    const unsub = form!.subscribe(createPathSelector(selector), (val: any) => effect(val));
    return () => unsub();
  }, [JSON.stringify(selector)]);
}

/*
Utility hook that returns only the errors for fields that are also touched.
 */
export function useTouchedErrors<TValues extends object>(
  form?: FormBox<TValues>,
): CastProperties<TValues, string> | null {
  const errors = useFormState('errors', form);
  const touched = useFormState('touched', form);
  return mapObject<CastProperties<TValues, string>>(
    errors,
    (val: boolean, path: string[]) => (get(touched, path) ? val : undefined),
    { omitEmpty: true },
  );
}

/**
 * Given a selector `path`, returns a function that accepts an object and returns the value located at `path`.
 */
const createPathSelector =
  <TIn, TOut>(path: Selector<TIn, TOut>) =>
  (data: TIn): TOut =>
    typeof path === 'function' ? path(data) : get(data, cleanPath(path));
