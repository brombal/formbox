import $8I1y4$justsafeget from "just-safe-get";
import $8I1y4$react, {createContext as $8I1y4$createContext, useRef as $8I1y4$useRef, useEffect as $8I1y4$useEffect, useContext as $8I1y4$useContext, useMemo as $8I1y4$useMemo, useState as $8I1y4$useState} from "react";
import $8I1y4$justsafeset from "just-safe-set";
import $8I1y4$justextend from "just-extend";






function $f0607d64a58bf38b$export$2e2bcd8739ae039(value) {
    return !!value && Object.getPrototypeOf(value) === Object.prototype;
}


function $6f396d0b31e2050b$export$d6051a0f7a227332(object, callback, options) {
    return $6f396d0b31e2050b$var$_mapObject(object, callback, options || {
    }, new WeakMap(), [], object);
}
function $6f396d0b31e2050b$var$_mapObject(object, callback, options, cache, path, root) {
    if (!Array.isArray(object) && !$f0607d64a58bf38b$export$2e2bcd8739ae039(object)) return object;
    if (cache.has(object)) return cache.get(object);
    const result = options.mutate ? object : Array.isArray(object) ? [] : {
    };
    cache.set(object, result);
    for(const k in object){
        const val = object[k];
        const mapped = $f0607d64a58bf38b$export$2e2bcd8739ae039(val) || Array.isArray(val) ? $6f396d0b31e2050b$var$_mapObject(val, callback, options, cache, [
            ...path,
            k
        ], root) : callback.call(null, val, [
            ...path,
            k
        ], root);
        if (mapped !== undefined) result[k] = mapped;
    }
    if (!options.omitEmpty || $f0607d64a58bf38b$export$2e2bcd8739ae039(result) && Object.keys(result).length || Array.isArray(result) && result.length) return result;
}


function $5182c3bee8e8757b$export$2e2bcd8739ae039(a, b, shallow = false) {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.constructor !== b.constructor) return false;
    if (typeof a !== 'object') return a === b;
    if (a instanceof Date) return a.toISOString() === b.toISOString();
    if (a instanceof Set) {
        if (a.size !== b.size) return false;
        for (const i of a){
            if (!b.has(i)) return false;
        }
        return true;
    }
    if (a instanceof Map) {
        if (a.size !== b.size) return false;
        for (const [k, v] of a.entries()){
            if (shallow ? a.get(k) !== b.get(k) : !$5182c3bee8e8757b$export$2e2bcd8739ae039(a.get(k), b.get(k))) return false;
        }
        return true;
    }
    if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        for(const i in a){
            if (shallow ? a[i] !== b[i] : !$5182c3bee8e8757b$export$2e2bcd8739ae039(a[i], b[i])) return false;
        }
        return true;
    }
    if (!a.toString().startsWith('[object ')) return a.toString() === b.toString();
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for(const k in a){
        if (shallow ? a[k] !== b[k] : !$5182c3bee8e8757b$export$2e2bcd8739ae039(a[k], b[k])) return false;
    }
    return true;
}



function $bc090ca26e5812e2$export$2e2bcd8739ae039(value) {
    if (!value) return value;
    if (typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map($bc090ca26e5812e2$export$2e2bcd8739ae039);
    if (value.constructor === Error) return new Error(value.message);
    if (value.constructor === Date) return new Date(value);
    if (value.constructor === RegExp) return new RegExp(value);
    if (value.constructor === Set) return new Set(value);
    if ($f0607d64a58bf38b$export$2e2bcd8739ae039(value)) {
        const result = {
        };
        for(const k in value)result[k] = $bc090ca26e5812e2$export$2e2bcd8739ae039(value[k]);
        return result;
    }
    throw new Error(`Cannot clone value: ${value} of type ${value.constructor.name}`);
}



function $d0a92be09fe5084b$export$2e2bcd8739ae039(a, b) {
    if (a === b) return a;
    if (!a || !b) return b;
    if ($5182c3bee8e8757b$export$2e2bcd8739ae039(a, b, true)) return a;
    if (a.constructor === b.constructor && (Array.isArray(a) || $f0607d64a58bf38b$export$2e2bcd8739ae039(a))) {
        let changed = false;
        const result = Array.isArray(a) ? [] : {
        };
        for(const key in b){
            const compared = $d0a92be09fe5084b$export$2e2bcd8739ae039(a[key], b[key]);
            if (compared !== a[key]) {
                result[key] = compared;
                changed = true;
            } else result[key] = a[key];
        }
        for(const key1 in a)if (!(key1 in b)) changed = true;
        return changed ? result : a;
    }
    return $bc090ca26e5812e2$export$2e2bcd8739ae039(b);
}



class $561ca3ebb262412e$export$2e2bcd8739ae039 {
    constructor(data1){
        this.subscriptions = new Set();
        this.set = (data)=>{
            let newData = data;
            if (typeof data === 'function') {
                try {
                    newData = $bc090ca26e5812e2$export$2e2bcd8739ae039(this.data);
                } catch (e) {
                    const err = new Error('Error cloning subscriptionBox data: ' + e.message);
                    err.data = this.data;
                    err.innerError = e;
                    throw err;
                }
                let result = data(newData);
                if (typeof result !== 'undefined') newData = result;
            }
            const oldData = this.data;
            try {
                this._data = $d0a92be09fe5084b$export$2e2bcd8739ae039(this.data, newData);
            } catch (e) {
                const err = new Error('Error comparing subscriptionBox data: ' + e.message);
                err.newData = newData;
                err.innerError = e;
                throw err;
            }
            this.subscriptions.forEach((sub)=>{
                const oldValue = sub.selector(oldData);
                const newValue = sub.selector(this.data);
                if (oldValue !== newValue) sub.callback(newValue);
            });
        };
        this.subscribe = (selector, callback)=>{
            const sub = {
                selector: selector,
                callback: callback
            };
            this.subscriptions.add(sub);
            sub.unsubscribe = ()=>this.subscriptions.delete(sub)
            ;
            return sub.unsubscribe;
        };
        this.unsubscribeAll = ()=>{
            this.subscriptions.forEach((sub)=>{
                sub.unsubscribe();
            });
        };
        this._data = data1;
    }
    get data() {
        return this._data;
    }
}



class $fa22644d03289891$export$8cd7ca2dd7ba6f89 {
    constructor(config){
        this.subscribe = (selector, callback)=>{
            return this.box.subscribe(selector, callback);
        };
        this.validate = async (values)=>{
            if (!this.config.validate) return;
            this.box.set((data)=>{
                data.validating = true;
            });
            values = values || this.values;
            try {
                const validators = Array.isArray(this.config.validate) ? this.config.validate : [
                    this.config.validate
                ];
                let result;
                for (const v of validators){
                    result = await v(values);
                    if (result) break;
                }
                this.box.set((data)=>{
                    data.errors = result;
                });
                return result;
            } catch (error) {
                this.box.set((data)=>{
                    data.errors = error;
                });
                return error;
            } finally{
                this.box.set((data)=>{
                    data.validating = false;
                });
            }
        };
        this.handleSubmit = async (e)=>{
            e.preventDefault();
            await this.submit();
        };
        this.submit = async ()=>{
            try {
                var _config, ref;
                this.box.set((data)=>{
                    data.submitting = true;
                    data.touched = $6f396d0b31e2050b$export$d6051a0f7a227332(data.values, ()=>true
                    );
                    data.submitCount++;
                });
                const errors = await this.validate();
                if (!errors) await ((ref = (_config = this.config).onSubmit) === null || ref === void 0 ? void 0 : ref.call(_config, this.box.data.values));
            } finally{
                this.box.set((data)=>{
                    data.submitting = false;
                });
            }
        };
        this.getInputHandlers = (path, inputConfig)=>{
            return {
                onChange: async (e)=>{
                    var ref;
                    this.box.set((data)=>{
                        let value;
                        var _value;
                        if ((inputConfig === null || inputConfig === void 0 ? void 0 : inputConfig.type) === 'checkbox') value = e.target.checked ? (_value = e.target.value) !== null && _value !== void 0 ? _value : true : undefined;
                        else if ((inputConfig === null || inputConfig === void 0 ? void 0 : inputConfig.type) === 'raw') value = e;
                        else value = e.target.value;
                        $8I1y4$justsafeset(data, [
                            'values',
                            ...$fa22644d03289891$export$b7c632328822445d(path)
                        ], value);
                        $8I1y4$justsafeset(data, [
                            'touched',
                            ...$fa22644d03289891$export$b7c632328822445d(path)
                        ], true);
                    });
                    inputConfig === null || inputConfig === void 0 ? void 0 : (ref = inputConfig.onChange) === null || ref === void 0 ? void 0 : ref.call(inputConfig, e);
                    if ((inputConfig === null || inputConfig === void 0 ? void 0 : inputConfig.validateOnChange) !== false && this.config.validateOnChange !== false) await this.validate();
                },
                onFocus: (e)=>{
                    var ref;
                    this.box.set((data)=>{
                        $8I1y4$justsafeset(data, [
                            'active',
                            ...$fa22644d03289891$export$b7c632328822445d(path)
                        ], true);
                    });
                    inputConfig === null || inputConfig === void 0 ? void 0 : (ref = inputConfig.onFocus) === null || ref === void 0 ? void 0 : ref.call(inputConfig, e);
                },
                onBlur: async (e)=>{
                    var ref;
                    this.box.set((data)=>{
                        $8I1y4$justsafeset(data, [
                            'active',
                            ...$fa22644d03289891$export$b7c632328822445d(path)
                        ], false);
                        $8I1y4$justsafeset(data, [
                            'touched',
                            ...$fa22644d03289891$export$b7c632328822445d(path)
                        ], true);
                    });
                    inputConfig === null || inputConfig === void 0 ? void 0 : (ref = inputConfig.onBlur) === null || ref === void 0 ? void 0 : ref.call(inputConfig, e);
                    if ((inputConfig === null || inputConfig === void 0 ? void 0 : inputConfig.validateOnBlur) !== false && this.config.validateOnBlur !== false) await this.validate();
                }
            };
        };
        this.reset = ()=>{
            const formState = {
                values: $bc090ca26e5812e2$export$2e2bcd8739ae039(this.config.initialValues),
                initialValues: $bc090ca26e5812e2$export$2e2bcd8739ae039(this.config.initialValues),
                submitting: false,
                validating: false,
                submitCount: 0,
                valid: true
            };
            if (typeof this.config.initialState === 'function') this.config.initialState(formState);
            else if (this.config.initialState) $8I1y4$justextend(true, formState, this.config.initialState);
            formState.valid = !!formState.errors;
            this.box.set(formState);
        };
        /**
   * Convenience method that "touches" all fields that are currently in state.values.
   */ this.touchAll = ()=>{
            this.setState((state)=>{
                state.touched = $6f396d0b31e2050b$export$d6051a0f7a227332(state.values, ()=>true
                );
            });
        };
        this._userConfig = config;
        this.box = new $561ca3ebb262412e$export$2e2bcd8739ae039({
        });
        this.reset();
        this.box.subscribe((data)=>data.values
        , ()=>{
            this.box.set((data)=>{
                data.dirty = $6f396d0b31e2050b$export$d6051a0f7a227332(this.values, (value, path)=>{
                    const init = $8I1y4$justsafeget(this.initialValues, path);
                    return init === value ? undefined : true;
                }, {
                    omitEmpty: true
                });
            });
        });
        this.box.subscribe((data)=>!!data.errors
        , ()=>{
            this.box.set((data)=>{
                data.valid = !!data.errors;
            });
        });
    }
    // Returns the user's config merged with defaults
    get config() {
        return Object.assign({
            validateOnBlur: true,
            validateOnChange: true,
            validateOnMount: true
        }, this._userConfig);
    }
    set config(value) {
        this._userConfig = value;
    }
    destroy() {
        this.box.unsubscribeAll();
    }
    async setValue(path, value, noValidate = false) {
        this.setState([
            'values',
            ...$fa22644d03289891$export$b7c632328822445d(path)
        ], value);
        if (!noValidate) await this.validate();
    }
    get state() {
        return this.box.data;
    }
    setState(stateSetter, value) {
        this.box.set(typeof stateSetter === 'function' ? stateSetter : (data)=>{
            $8I1y4$justsafeset(data, $fa22644d03289891$export$b7c632328822445d(stateSetter), value);
        });
    }
    getState(selector) {
        return $8I1y4$justsafeget(this.box.data, $fa22644d03289891$export$b7c632328822445d(selector));
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
    get submitCount() {
        return this.box.data.submitCount;
    }
    get valid() {
        return !this.box.data.valid;
    }
}
function $fa22644d03289891$export$b7c632328822445d(path) {
    return Array.isArray(path) ? path.filter(Boolean).map(String) : path.split(/[.\[\]]/).filter(Boolean);
}



const $b08afb9798ad624c$var$formContext = /*#__PURE__*/ $8I1y4$createContext(null);
function $b08afb9798ad624c$export$b49f8f80c87bfa8a({ form: form , ...other }) {
    return(/*#__PURE__*/ $8I1y4$react.createElement($b08afb9798ad624c$var$formContext.Provider, {
        value: form,
        ...other
    }));
}
function $b08afb9798ad624c$export$556f954a4a71c43(config) {
    const formRef = $8I1y4$useRef();
    if (!formRef.current) formRef.current = new $fa22644d03289891$export$8cd7ca2dd7ba6f89(config);
    formRef.current.config = config;
    $8I1y4$useEffect(()=>{
        if (formRef.current.config.validateOnMount) formRef.current.validate();
        return ()=>formRef.current.destroy()
        ;
    }, []);
    return formRef.current;
}
function $b08afb9798ad624c$export$5565872d6db3686f() {
    return $8I1y4$useContext($b08afb9798ad624c$var$formContext);
}
function $b08afb9798ad624c$export$434ed5c8d5bb7eb5(path, config, deps = []) {
    const form = $b08afb9798ad624c$export$5565872d6db3686f();
    const value = $b08afb9798ad624c$export$606f11b2eb45ecc6([
        'values',
        ...$fa22644d03289891$export$b7c632328822445d(path)
    ], form);
    return $8I1y4$useMemo(()=>({
            value: value,
            ...form.getInputHandlers(path, config)
        })
    , [
        value,
        JSON.stringify(path),
        ...deps
    ]);
}
function $b08afb9798ad624c$export$606f11b2eb45ecc6(selector, form) {
    form = form || $8I1y4$useContext($b08afb9798ad624c$var$formContext);
    const [, trigger] = $8I1y4$useState({
    });
    $b08afb9798ad624c$export$dde8d869f0aafb85(selector, ()=>trigger({
        })
    , form);
    return $b08afb9798ad624c$var$createPathSelector(selector)(form.state);
}
function $b08afb9798ad624c$export$dde8d869f0aafb85(selector, effect, form) {
    form = form || $8I1y4$useContext($b08afb9798ad624c$var$formContext);
    $8I1y4$useEffect(()=>{
        const unsub = form.subscribe($b08afb9798ad624c$var$createPathSelector(selector), (val)=>effect(val)
        );
        return ()=>unsub()
        ;
    }, [
        JSON.stringify(selector)
    ]);
}
function $b08afb9798ad624c$export$8b00e3485cb32583(form) {
    const errors = $b08afb9798ad624c$export$606f11b2eb45ecc6('errors', form);
    const touched = $b08afb9798ad624c$export$606f11b2eb45ecc6('touched', form);
    return $6f396d0b31e2050b$export$d6051a0f7a227332(errors, (val, path)=>$8I1y4$justsafeget(touched, path) ? val : undefined
    , {
        omitEmpty: true
    });
}
/**
 * Given a selector `path`, returns a function that accepts an object and returns the value located at `path`.
 */ const $b08afb9798ad624c$var$createPathSelector = (path)=>(data)=>typeof path === 'function' ? path(data) : $8I1y4$justsafeget(data, $fa22644d03289891$export$b7c632328822445d(path))
;




const $9b550176a16e6616$export$5bcff7329d9c4934 = (schema)=>{
    return async (values)=>{
        try {
            await schema.validate(values, {
                context: values,
                abortEarly: false
            });
            return null;
        } catch (err) {
            return $9b550176a16e6616$var$yupErrorToObject(err);
        }
    };
};
function $9b550176a16e6616$var$yupErrorToObject(yupError) {
    const errors = {
    };
    if (yupError.inner) {
        if (yupError.inner.length === 0) {
            $8I1y4$justsafeset(errors, yupError.path, yupError.message);
            return errors;
        }
        for (const err of yupError.inner)if (!$8I1y4$justsafeget(errors, err.path)) $8I1y4$justsafeset(errors, err.path, err.message);
    }
    return errors;
}




export {$b08afb9798ad624c$export$556f954a4a71c43 as useCreateFormBox, $b08afb9798ad624c$export$5565872d6db3686f as useFormBox, $b08afb9798ad624c$export$dde8d869f0aafb85 as useFormEffect, $b08afb9798ad624c$export$606f11b2eb45ecc6 as useFormState, $b08afb9798ad624c$export$434ed5c8d5bb7eb5 as useInputProps, $b08afb9798ad624c$export$8b00e3485cb32583 as useTouchedErrors, $b08afb9798ad624c$export$b49f8f80c87bfa8a as FormBoxProvider, $9b550176a16e6616$export$5bcff7329d9c4934 as createYupValidator};
//# sourceMappingURL=module.js.map
