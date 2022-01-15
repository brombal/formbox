import set from 'just-safe-set';
import get from 'just-safe-get';
import extend from 'just-extend';
import type { AnySchema, ValidationError } from 'yup';

import { mapObject } from './util/mapObject';
import SubscriptionBox, { SelectorFn } from './util/subscriptionBox';
import clone from './util/clone';

export type SelectorPath = string | string[] | SelectorPath[];
export type Selector<TIn, TOut> = SelectorPath | SelectorFn<TIn, TOut>;

export interface FormBoxConfig<TValues extends object> {
  initialValues: TValues;
  initialState?: Partial<FormBoxState<TValues>> | ((state: FormBoxState<TValues>) => void);
  validate?(values: TValues): any | Promise<any>;
  onSubmit?(values: TValues): void | Promise<void>;
  validateOnMount?: boolean; // default false
  validateOnBlur?: boolean; // default true
  validateOnChange?: boolean; // default false
}

interface FormBoxState<TValues extends object> {
  values: TValues;
  initialValues: TValues;
  submitting: boolean;
  validating: boolean;
  dirty?: CastProperties<TValues, boolean>;
  touched?: CastProperties<TValues, boolean>;
  active?: CastProperties<TValues, boolean>;
  errors?: CastProperties<TValues, string>;
  meta?: any;
}

export interface FormBoxInputPropsConfig {
  type?: 'input' | 'checkbox' | 'raw';
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
}

export interface FormBoxInputHandlers {
  onChange(e: Event): void;
  onFocus(e: FocusEvent): void;
  onBlur(e: FocusEvent): void;
}

export class FormBox<TValues extends object> implements FormBoxState<TValues> {
  private config: FormBoxConfig<TValues>;
  private box: SubscriptionBox<FormBoxState<TValues>>;

  constructor(config: FormBoxConfig<TValues>) {
    this.config = Object.assign({ validateOnBlur: true }, config) as FormBoxConfig<TValues>;

    const formState: FormBoxState<TValues> = {
      values: clone(this.config.initialValues),
      initialValues: clone(this.config.initialValues),
      submitting: false,
      validating: false,
    };

    if (typeof config.initialState === 'function') {
      (this.config.initialState as any)(formState);
    } else if (config.initialState) {
      extend(true, formState, this.config.initialState);
    }

    this.box = new SubscriptionBox<FormBoxState<TValues>>(formState);

    this.box.subscribe(
      (data) => data.values,
      () => {
        this.box.set((data) => {
          data.dirty = mapObject(
            this.values,
            (value, path) => {
              const init = get(this.initialValues, path);
              return init === value ? undefined : true;
            },
            { omitEmpty: true },
          );
        });
      },
    );
  }

  // FormBoxState implementation

  get values() {
    return this.box.data.values;
  }
  get initialValues() {
    return this.box.data.initialValues;
  }
  get submitting() {
    return this.box.data.submitting;
  }
  get validating() {
    return this.box.data.validating;
  }
  get dirty() {
    return this.box.data.dirty;
  }
  get touched() {
    return this.box.data.touched;
  }
  get active() {
    return this.box.data.active;
  }
  get errors() {
    return this.box.data.errors;
  }
  get meta() {
    return this.box.data.meta;
  }

  destroy() {
    this.box.unsubscribeAll();
  }

  setValue(path: SelectorPath, value: any): void {
    this.setState(['values', ...cleanPath(path)], value);
  }

  setState(selector: SelectorPath, value: any): void;
  setState(stateSetter: (state: FormBoxState<TValues>) => void): void;

  setState(
    stateSetter: SelectorPath | ((state: FormBoxState<TValues>) => void),
    value?: any,
  ): void {
    this.box.set(
      typeof stateSetter === 'function'
        ? stateSetter
        : (data) => set(data, cleanPath(stateSetter), value),
    );
  }

  subscribe = <TOut>(
    selector: SelectorFn<FormBoxState<TValues>, TOut>,
    callback: (val: TOut) => void,
  ): (() => void) => {
    return this.box.subscribe(selector, callback);
  };

  validate = async (values?: TValues): Promise<any> => {
    if (!this.config.validate) return;
    this.box.set((data) => (data.validating = true));
    values = values || this.values;
    try {
      const result = await this.config.validate(values);
      this.box.set((data) => (data.errors = result));
      return result;
    } catch (error) {
      this.box.set((data) => (data.errors = error));
      return error;
    } finally {
      this.box.set((data) => (data.validating = false));
    }
  };

  handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();
    try {
      this.box.set((data) => {
        data.submitting = true;
        data.touched = mapObject(data.values, () => true);
      });
      const errors = await this.validate();
      if (!errors) await this.config.onSubmit?.(this.box.data.values);
    } finally {
      this.box.set((data) => (data.submitting = false));
    }
  };

  getInputHandlers = (
    path: SelectorPath,
    inputConfig?: FormBoxInputPropsConfig,
  ): FormBoxInputHandlers => {
    return {
      onChange: async (e: any) => {
        this.box.set((data) => {
          let value: any;
          if (inputConfig?.type === 'checkbox') value = e.target.checked;
          else if (inputConfig?.type === 'raw') value = e;
          else value = e.target.value;
          set(data, ['values', ...cleanPath(path)], value);
          set(data, ['touched', ...cleanPath(path)], true);
        });
        inputConfig?.onChange?.(e);
        if (this.config.validateOnChange) await this.validate();
      },
      onFocus: (e: any) => {
        this.box.set((data) => {
          set(data, ['active', ...cleanPath(path)], true);
        });
        inputConfig?.onFocus?.(e);
      },
      onBlur: async (e: any) => {
        this.box.set((data) => {
          set(data, ['active', ...cleanPath(path)], false);
          set(data, ['touched', ...cleanPath(path)], true);
        });
        inputConfig?.onBlur?.(e);
        if (this.config.validateOnBlur) await this.validate();
      },
    };
  };
}

export const createPathSelector =
  <TIn, TOut>(path: Selector<TIn, TOut>) =>
  (data: TIn): TOut =>
    typeof path === 'function' ? path(data) : get(data, cleanPath(path));

/**
 * Returns a type that has all properties of TObject as type TProperty, recursively into objects and arrays
 */
export type CastProperties<TObject extends object, TProperty> = {
  [K in keyof TObject]?: TObject[K] extends any[]
    ? TObject[K][number] extends object
      ? CastProperties<TObject[K][number], TProperty>[]
      : TProperty
    : TObject[K] extends object
    ? CastProperties<TObject[K], TProperty>
    : TProperty;
};

/**
 * Returns a flat array of non-empty strings from `path`, which may be a single object path string
 * or a nested array of object path strings.
 */
export function cleanPath(path: SelectorPath): string[] {
  return Array.isArray(path)
    ? (path.flat().filter(Boolean) as string[])
    : path.split('.').filter(Boolean);
}
