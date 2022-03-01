import { AnySchema } from "yup";
/**
 # SubscriptionBox

 A SubscriptionBox is an object that holds arbitrary data, allowing you set/get properties and subscribe to changes.
 The change algorithm does deep-comparisons, so you'll only be notified if properties actually change value
 (not simply whenever `set` is called).

 ```js
 const box = new SubscriptionBox({
   firstName: 'Johnny',
   favoriteBook: {
     title: 'Green Eggs and Ham',
     author: 'Dr. Seuss'
   }
 });

 const unsubscribe = box.subscribe(
   data => data.favoriteBook,
   (favoriteBook) => {
     ...
   }
 );
 ...
 unsubscribe();

 box.set(data => {
   // `data` is a mutable clone - change its value; don't return it
   data.favoriteBook.title = 'Horton Hears a Who'
 });

 // `box.data` is a read-only getter
 box.data.favoriteBook;
 ```
 */
type SelectorFn<TIn, TOut extends any> = (input: TIn) => TOut;
type SelectorPath = string | Array<string | number | null | undefined>;
type Selector<TIn, TOut> = SelectorPath | SelectorFn<TIn, TOut>;
type ValidatorFn<TValues extends object> = (values: TValues) => any | Promise<any>;
interface FormBoxConfig<TValues extends object> {
    initialValues: TValues;
    initialState?: Partial<FormBoxState<TValues>> | ((state: FormBoxState<TValues>) => void);
    validate?: ValidatorFn<TValues> | ValidatorFn<TValues>[];
    onSubmit?(values: TValues): void | Promise<void>;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    validateOnMount?: boolean;
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
    submitCount: number;
    valid: boolean;
}
type GenericEventHandler = (e: any) => void;
interface FormBoxInputPropsConfig {
    type?: 'input' | 'checkbox' | 'raw';
    onChange?: GenericEventHandler;
    onBlur?: GenericEventHandler;
    onFocus?: GenericEventHandler;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
}
interface FormBoxInputHandlers {
    onChange: GenericEventHandler;
    onFocus: GenericEventHandler;
    onBlur: GenericEventHandler;
}
declare class FormBox<TValues extends object> implements FormBoxState<TValues> {
    constructor(config: FormBoxConfig<TValues>);
    get config(): FormBoxConfig<TValues>;
    set config(value: FormBoxConfig<TValues>);
    destroy(): void;
    setValue(path: SelectorPath, value: any): void;
    get state(): FormBoxState<TValues>;
    setState(selector: SelectorPath, value: any): void;
    setState(stateSetter: (state: FormBoxState<TValues>) => void): void;
    getState(selector: SelectorPath): any;
    subscribe: <TOut>(selector: SelectorFn<FormBoxState<TValues>, TOut>, callback: (val: TOut) => void) => (() => void);
    validate: (values?: TValues) => Promise<any>;
    handleSubmit: (e: any) => Promise<void>;
    submit: () => Promise<void>;
    getInputHandlers: (path: SelectorPath, inputConfig?: FormBoxInputPropsConfig) => FormBoxInputHandlers;
    reset: () => void;
    /**
     * Convenience method that "touches" all fields that are currently in state.values.
     */
    touchAll: () => void;
    get values(): TValues;
    get initialValues(): TValues;
    get submitting(): boolean;
    get validating(): boolean;
    get dirty(): CastProperties<TValues, boolean>;
    get touched(): CastProperties<TValues, boolean>;
    get active(): CastProperties<TValues, boolean>;
    get errors(): CastProperties<TValues, string>;
    get meta(): any;
    get submitCount(): number;
    get valid(): boolean;
}
/**
 * Resolves to a type that has all properties of TObject cast as type TProperty, recursively into objects and arrays
 */
type CastProperties<TObject extends object, TProperty> = {
    [K in keyof TObject]?: TObject[K] extends any[] ? TObject[K][number] extends object ? CastProperties<TObject[K][number], TProperty>[] : TProperty : TObject[K] extends object ? CastProperties<TObject[K], TProperty> : TProperty;
};
export function FormBoxProvider<TValues extends object>({ form, ...other }: {
    form: FormBox<TValues>;
    children: any;
}): JSX.Element;
export function useCreateFormBox<TValues extends object>(config: FormBoxConfig<TValues>): FormBox<TValues>;
export function useFormBox<TValues extends object>(): FormBox<TValues>;
export function useInputProps(path: SelectorPath, config?: FormBoxInputPropsConfig, deps?: any[]): {
    onChange: (e: any) => void;
    onFocus: (e: any) => void;
    onBlur: (e: any) => void;
    value: any;
};
export function useFormState<TValues extends object = any, TOut = any>(selector: Selector<FormBoxState<TValues>, TOut>, form?: FormBox<TValues>): TOut;
export function useFormEffect<TValues extends object>(selector: Selector<FormBoxState<TValues>, any>, effect: (val: any) => void, form?: FormBox<TValues>): void;
export function useTouchedErrors<TValues extends object>(form?: FormBox<TValues>): CastProperties<TValues, string> | null;
export const createYupValidator: (schema: AnySchema) => (values: any) => Promise<object>;

//# sourceMappingURL=types.d.ts.map
