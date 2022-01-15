import { get } from 'lodash';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  CastProperties,
  cleanPath,
  createFormBox,
  createPathSelector,
  FormBox,
  FormBoxConfig,
  FormBoxInputPropsConfig,
  FormBoxState,
  Selector,
  SelectorPath,
} from './formBox';
import { mapObject } from './util/mapObject';

const formContext = createContext<FormBox<any> | undefined>(undefined);

export function FormProvider<T>({ form, ...other }: { form: FormBox<T>; children: any }) {
  return <formContext.Provider value={form} {...other} />;
}

export function useFormBox<TValues>(config: FormBoxConfig<TValues>): FormBox<TValues> {
  const formRef = useRef<FormBox<TValues>>();
  if (!formRef.current) {
    formRef.current = createFormBox<TValues>(config);
  }
  formRef.current!.config = config;

  useEffect(() => {
    if (formRef.current!.config.validateOnMount) formRef.current!.validate();
    return () => formRef.current!.destroy();
  }, []);

  return formRef.current!;
}

/*
Returns the current form object.
*/
export function useFormContext<TValues>(): FormBox<TValues> {
  return useContext(formContext)!;
}

export function useInputProps(path: SelectorPath, config?: FormBoxInputPropsConfig) {
  const form = useFormContext();
  const value = useFormState(['values', ...cleanPath(path)], form);
  return useMemo(
    () => ({ value, ...form.getInputHandlers(path, config) }),
    [value, JSON.stringify(path)],
  );
}

/*
Returns the current form state returned by `selector` and re-renders when it changes.
*/
export function useFormState<TValues = any, TOut = any>(
  selector: Selector<FormBoxState<TValues>, TOut>,
  form?: FormBox<TValues>,
): TOut {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  form = form || useContext(formContext)!;
  const [, trigger] = useState({});
  useFormEffect(selector, () => trigger({}), form);
  return form.getState(selector);
}

/*
Triggers `effect` to run with the state value returned by `selector` changes.
 */
export function useFormEffect<TValues>(
  selector: Selector<FormBoxState<TValues>, any>,
  effect: (val: any) => void,
  form?: FormBox<TValues>,
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  form = form || useContext(formContext)!;
  useEffect(() => {
    const unsub = form!.subscribe(createPathSelector(selector), (val: any) => effect(val));
    return () => unsub();
  }, [JSON.stringify(selector)]);
}

export function useTouchedErrors<TValues>(
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
