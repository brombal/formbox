import set from 'just-safe-set';
import get from 'just-safe-get';
import extend from 'just-extend';
import { mapObject } from './util/mapObject';
import SubscriptionBox, { SelectorFn } from './util/subscriptionBox';
import clone from './util/clone';

// SelectorPath represents a path to select a property from an object. It is either a dot-separated string or an array of string/numbers.
export type SelectorPath = string | Array<string | number | null | undefined>;

// Selector is either a SelectorPath or SelectorFn
export type Selector<TIn, TOut> = SelectorPath | SelectorFn<TIn, TOut>;

type ValidatorFn<TValues extends object> = (values: TValues) => any | Promise<any>;

export interface FormBoxConfig<TValues extends object> {
  initialValues: TValues;
  initialState?: Partial<FormBoxState<TValues>> | ((state: FormBoxState<TValues>) => void);
  validate?: ValidatorFn<TValues> | ValidatorFn<TValues>[];
  onSubmit?(values: TValues): void | Promise<void>;
  validateOnBlur?: boolean; // default true
  validateOnChange?: boolean; // default true
  validateOnMount?: boolean; // default true
}

export interface FormBoxState<TValues extends object> {
  values: TValues;
  initialValues: TValues;
  submitting: boolean;
  validating: boolean;
  dirty?: CastProperties<TValues, boolean>;
  touched?: CastProperties<TValues, boolean>;
  active?: CastProperties<TValues, boolean>;
  errors?: CastProperties<TValues, string>;
  meta?: any;
  submitCount: number;
  valid: boolean;
}

type GenericEventHandler = (e: any) => void;

export interface FormBoxInputPropsConfig {
  type?: 'input' | 'checkbox' | 'raw';
  onChange?: GenericEventHandler;
  onBlur?: GenericEventHandler;
  onFocus?: GenericEventHandler;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

export interface FormBoxInputHandlers {
  onChange: GenericEventHandler;
  onFocus: GenericEventHandler;
  onBlur: GenericEventHandler;
}

export class FormBox<TValues extends object> implements FormBoxState<TValues> {
  private _userConfig: FormBoxConfig<TValues>;
  private box: SubscriptionBox<FormBoxState<TValues>>;

  constructor(config: FormBoxConfig<TValues>) {
    this._userConfig = config;
    this.box = new SubscriptionBox<FormBoxState<TValues>>({} as any);
    this.reset();

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
    this.box.subscribe(
      (data) => !!data.errors,
      () => {
        this.box.set((data) => {
          data.valid = !!data.errors
        });
      },
    );
  }

  // Returns the user's config merged with defaults
  get config() {
    return Object.assign(
      { validateOnBlur: true, validateOnChange: true, validateOnMount: true },
      this._userConfig,
    );
  }
  set config(value: FormBoxConfig<TValues>) {
    this._userConfig = value;
  }

  destroy() {
    this.box.unsubscribeAll();
  }

  setValue(path: SelectorPath, value: any): void {
    this.setState(['values', ...cleanPath(path)], value);
  }

  get state() {
    return this.box.data;
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
        : (data) => {
            set(data, cleanPath(stateSetter), value);
          },
    );
  }

  getState(selector: SelectorPath): any {
    return get(this.box.data, cleanPath(selector));
  }

  subscribe = <TOut>(
    selector: SelectorFn<FormBoxState<TValues>, TOut>,
    callback: (val: TOut) => void,
  ): (() => void) => {
    return this.box.subscribe(selector, callback);
  };

  validate = async (values?: TValues): Promise<any> => {
    if (!this.config.validate) return;
    this.box.set((data) => {
      data.validating = true;
    });
    values = values || this.values;
    try {
      const validators = Array.isArray(this.config.validate)
        ? this.config.validate
        : [this.config.validate];
      let result: any;
      for (const v of validators) {
        result = await v(values);
        if (result) break;
      }
      this.box.set((data) => {
        data.errors = result;
      });
      return result;
    } catch (error: any) {
      this.box.set((data) => {
        data.errors = error;
      });
      return error;
    } finally {
      this.box.set((data) => {
        data.validating = false;
      });
    }
  };

  handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    await this.submit();
  };

  submit = async () => {
    try {
      this.box.set((data) => {
        data.submitting = true;
        data.touched = mapObject(data.values, () => true);
        data.submitCount++;
      });
      const errors = await this.validate();
      if (!errors) await this.config.onSubmit?.(this.box.data.values);
    } finally {
      this.box.set((data) => {
        data.submitting = false;
      });
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
          if (inputConfig?.type === 'checkbox')
            value = e.target.checked ? e.target.value ?? true : undefined;
          else if (inputConfig?.type === 'raw') value = e;
          else value = e.target.value;
          set(data, ['values', ...cleanPath(path)], value);
          set(data, ['touched', ...cleanPath(path)], true);
        });
        inputConfig?.onChange?.(e);
        if (inputConfig?.validateOnChange !== false && this.config.validateOnChange !== false)
          await this.validate();
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
        if (inputConfig?.validateOnBlur !== false && this.config.validateOnBlur !== false)
          await this.validate();
      },
    };
  };

  reset = () => {
    const formState: FormBoxState<TValues> = {
      values: clone(this.config.initialValues),
      initialValues: clone(this.config.initialValues),
      submitting: false,
      validating: false,
      submitCount: 0,
      valid: true
    };

    if (typeof this.config.initialState === 'function') {
      (this.config.initialState as any)(formState);
    } else if (this.config.initialState) {
      extend(true, formState, this.config.initialState);
    }

    formState.valid = !!formState.errors;

    this.box.set(formState);
  };

  /**
   * Convenience method that "touches" all fields that are currently in state.values.
   */
  touchAll = () => {
    this.setState((state) => {
      state.touched = mapObject(state.values, () => true);
    });
  };

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
  get submitCount() {
    return this.box.data.submitCount;
  }
  get valid() {
    return !this.box.data.valid;
  }
}

/**
 * Resolves to a type that has all properties of TObject cast as type TProperty, recursively into objects and arrays
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
    ? (path.filter(Boolean).map(String) as string[])
    : path.split(/[.\[\]]/).filter(Boolean);
}
