var $dmuzZ$justsafeget = require("just-safe-get");
var $dmuzZ$react = require("react");
var $dmuzZ$justsafeset = require("just-safe-set");
var $dmuzZ$justextend = require("just-extend");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "useCreateFormBox", () => $13c15430094b1863$export$556f954a4a71c43);
$parcel$export(module.exports, "useFormBox", () => $13c15430094b1863$export$5565872d6db3686f);
$parcel$export(module.exports, "useFormEffect", () => $13c15430094b1863$export$dde8d869f0aafb85);
$parcel$export(module.exports, "useFormState", () => $13c15430094b1863$export$606f11b2eb45ecc6);
$parcel$export(module.exports, "useInputProps", () => $13c15430094b1863$export$434ed5c8d5bb7eb5);
$parcel$export(module.exports, "useTouchedErrors", () => $13c15430094b1863$export$8b00e3485cb32583);
$parcel$export(module.exports, "FormBoxProvider", () => $13c15430094b1863$export$b49f8f80c87bfa8a);
$parcel$export(module.exports, "createYupValidator", () => $8c8caac44e0df2f3$export$5bcff7329d9c4934);





function $af39454546388d0c$export$2e2bcd8739ae039(value) {
    return !!value && Object.getPrototypeOf(value) === Object.prototype;
}


function $f79348bd239ce172$export$d6051a0f7a227332(object, callback, options) {
    return $f79348bd239ce172$var$_mapObject(object, callback, options || {
    }, new WeakMap(), [], object);
}
function $f79348bd239ce172$var$_mapObject(object, callback, options, cache, path, root) {
    if (!Array.isArray(object) && !$af39454546388d0c$export$2e2bcd8739ae039(object)) return object;
    if (cache.has(object)) return cache.get(object);
    const result = options.mutate ? object : Array.isArray(object) ? [] : {
    };
    cache.set(object, result);
    for(const k in object){
        const val = object[k];
        const mapped = $af39454546388d0c$export$2e2bcd8739ae039(val) || Array.isArray(val) ? $f79348bd239ce172$var$_mapObject(val, callback, options, cache, [
            ...path,
            k
        ], root) : callback.call(null, val, [
            ...path,
            k
        ], root);
        if (mapped !== undefined) result[k] = mapped;
    }
    if (!options.omitEmpty || $af39454546388d0c$export$2e2bcd8739ae039(result) && Object.keys(result).length || Array.isArray(result) && result.length) return result;
}


function $536ee4d39bd16db9$export$2e2bcd8739ae039(a, b, shallow = false) {
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
            if (shallow ? a.get(k) !== b.get(k) : !$536ee4d39bd16db9$export$2e2bcd8739ae039(a.get(k), b.get(k))) return false;
        }
        return true;
    }
    if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        for(const i in a){
            if (shallow ? a[i] !== b[i] : !$536ee4d39bd16db9$export$2e2bcd8739ae039(a[i], b[i])) return false;
        }
        return true;
    }
    if (!a.toString().startsWith('[object ')) return a.toString() === b.toString();
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for(const k in a){
        if (shallow ? a[k] !== b[k] : !$536ee4d39bd16db9$export$2e2bcd8739ae039(a[k], b[k])) return false;
    }
    return true;
}



function $d599850d96e929f8$export$2e2bcd8739ae039(value) {
    if (!value) return value;
    if (typeof value !== 'object') return value;
    if (Array.isArray(value)) return Array.from(value);
    if (value.constructor === Error) return new Error(value.message);
    if (value.constructor === Date) return new Date(value);
    if (value.constructor === RegExp) return new RegExp(value);
    if (value.constructor === Set) return new Set(value);
    if ($af39454546388d0c$export$2e2bcd8739ae039(value)) {
        const result = {
        };
        for(const k in value)result[k] = $d599850d96e929f8$export$2e2bcd8739ae039(value[k]);
        return result;
    }
    throw new Error(`Cannot clone value: ${value} of type ${value.constructor.name}`);
}



function $d56ffc0b0ccdf590$export$2e2bcd8739ae039(a, b) {
    if (a === b) return a;
    if (!a || !b) return b;
    if ($536ee4d39bd16db9$export$2e2bcd8739ae039(a, b, true)) return a;
    if (a.constructor === b.constructor && (Array.isArray(a) || $af39454546388d0c$export$2e2bcd8739ae039(a))) {
        let changed = false;
        const result = Array.isArray(a) ? [] : {
        };
        for(const key in b){
            const compared = $d56ffc0b0ccdf590$export$2e2bcd8739ae039(a[key], b[key]);
            if (compared !== a[key]) {
                result[key] = compared;
                changed = true;
            } else result[key] = a[key];
        }
        for(const key1 in a)if (!(key1 in b)) changed = true;
        return changed ? result : a;
    }
    return $d599850d96e929f8$export$2e2bcd8739ae039(b);
}



class $c7771d09f38083c3$export$2e2bcd8739ae039 {
    constructor(data1){
        this.subscriptions = new Set();
        this.set = (data)=>{
            let newData = data;
            if (typeof data === 'function') {
                try {
                    newData = $d599850d96e929f8$export$2e2bcd8739ae039(this.data);
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
                this._data = $d56ffc0b0ccdf590$export$2e2bcd8739ae039(this.data, newData);
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



class $96bc46e22b7b614c$export$8cd7ca2dd7ba6f89 {
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
                    data.touched = $f79348bd239ce172$export$d6051a0f7a227332(data.values, ()=>true
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
                        ($parcel$interopDefault($dmuzZ$justsafeset))(data, [
                            'values',
                            ...$96bc46e22b7b614c$export$b7c632328822445d(path)
                        ], value);
                        ($parcel$interopDefault($dmuzZ$justsafeset))(data, [
                            'touched',
                            ...$96bc46e22b7b614c$export$b7c632328822445d(path)
                        ], true);
                    });
                    inputConfig === null || inputConfig === void 0 ? void 0 : (ref = inputConfig.onChange) === null || ref === void 0 ? void 0 : ref.call(inputConfig, e);
                    if ((inputConfig === null || inputConfig === void 0 ? void 0 : inputConfig.validateOnChange) !== false && this.config.validateOnChange !== false) await this.validate();
                },
                onFocus: (e)=>{
                    var ref;
                    this.box.set((data)=>{
                        ($parcel$interopDefault($dmuzZ$justsafeset))(data, [
                            'active',
                            ...$96bc46e22b7b614c$export$b7c632328822445d(path)
                        ], true);
                    });
                    inputConfig === null || inputConfig === void 0 ? void 0 : (ref = inputConfig.onFocus) === null || ref === void 0 ? void 0 : ref.call(inputConfig, e);
                },
                onBlur: async (e)=>{
                    var ref;
                    this.box.set((data)=>{
                        ($parcel$interopDefault($dmuzZ$justsafeset))(data, [
                            'active',
                            ...$96bc46e22b7b614c$export$b7c632328822445d(path)
                        ], false);
                        ($parcel$interopDefault($dmuzZ$justsafeset))(data, [
                            'touched',
                            ...$96bc46e22b7b614c$export$b7c632328822445d(path)
                        ], true);
                    });
                    inputConfig === null || inputConfig === void 0 ? void 0 : (ref = inputConfig.onBlur) === null || ref === void 0 ? void 0 : ref.call(inputConfig, e);
                    if ((inputConfig === null || inputConfig === void 0 ? void 0 : inputConfig.validateOnBlur) !== false && this.config.validateOnBlur !== false) await this.validate();
                }
            };
        };
        this.reset = ()=>{
            const formState = {
                values: $d599850d96e929f8$export$2e2bcd8739ae039(this.config.initialValues),
                initialValues: $d599850d96e929f8$export$2e2bcd8739ae039(this.config.initialValues),
                submitting: false,
                validating: false,
                submitCount: 0,
                valid: true
            };
            if (typeof this.config.initialState === 'function') this.config.initialState(formState);
            else if (this.config.initialState) ($parcel$interopDefault($dmuzZ$justextend))(true, formState, this.config.initialState);
            formState.valid = !!formState.errors;
            this.box.set(formState);
        };
        /**
   * Convenience method that "touches" all fields that are currently in state.values.
   */ this.touchAll = ()=>{
            this.setState((state)=>{
                state.touched = $f79348bd239ce172$export$d6051a0f7a227332(state.values, ()=>true
                );
            });
        };
        this._userConfig = config;
        this.box = new $c7771d09f38083c3$export$2e2bcd8739ae039({
        });
        this.reset();
        this.box.subscribe((data)=>data.values
        , ()=>{
            this.box.set((data)=>{
                data.dirty = $f79348bd239ce172$export$d6051a0f7a227332(this.values, (value, path)=>{
                    const init = ($parcel$interopDefault($dmuzZ$justsafeget))(this.initialValues, path);
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
            ...$96bc46e22b7b614c$export$b7c632328822445d(path)
        ], value);
        if (!noValidate) await this.validate();
    }
    get state() {
        return this.box.data;
    }
    setState(stateSetter, value) {
        this.box.set(typeof stateSetter === 'function' ? stateSetter : (data)=>{
            ($parcel$interopDefault($dmuzZ$justsafeset))(data, $96bc46e22b7b614c$export$b7c632328822445d(stateSetter), value);
        });
    }
    getState(selector) {
        return ($parcel$interopDefault($dmuzZ$justsafeget))(this.box.data, $96bc46e22b7b614c$export$b7c632328822445d(selector));
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
function $96bc46e22b7b614c$export$b7c632328822445d(path) {
    return Array.isArray(path) ? path.filter(Boolean).map(String) : path.split(/[.\[\]]/).filter(Boolean);
}



const $13c15430094b1863$var$formContext = /*#__PURE__*/ $dmuzZ$react.createContext(null);
function $13c15430094b1863$export$b49f8f80c87bfa8a({ form: form , ...other }) {
    return(/*#__PURE__*/ ($parcel$interopDefault($dmuzZ$react)).createElement($13c15430094b1863$var$formContext.Provider, {
        value: form,
        ...other
    }));
}
function $13c15430094b1863$export$556f954a4a71c43(config) {
    const formRef = $dmuzZ$react.useRef();
    if (!formRef.current) formRef.current = new $96bc46e22b7b614c$export$8cd7ca2dd7ba6f89(config);
    formRef.current.config = config;
    $dmuzZ$react.useEffect(()=>{
        if (formRef.current.config.validateOnMount) formRef.current.validate();
        return ()=>formRef.current.destroy()
        ;
    }, []);
    return formRef.current;
}
function $13c15430094b1863$export$5565872d6db3686f() {
    return $dmuzZ$react.useContext($13c15430094b1863$var$formContext);
}
function $13c15430094b1863$export$434ed5c8d5bb7eb5(path, config, deps = []) {
    const form = $13c15430094b1863$export$5565872d6db3686f();
    const value = $13c15430094b1863$export$606f11b2eb45ecc6([
        'values',
        ...$96bc46e22b7b614c$export$b7c632328822445d(path)
    ], form);
    return $dmuzZ$react.useMemo(()=>({
            value: value,
            ...form.getInputHandlers(path, config)
        })
    , [
        value,
        JSON.stringify(path),
        ...deps
    ]);
}
function $13c15430094b1863$export$606f11b2eb45ecc6(selector, form) {
    form = form || $dmuzZ$react.useContext($13c15430094b1863$var$formContext);
    const [, trigger] = $dmuzZ$react.useState({
    });
    $13c15430094b1863$export$dde8d869f0aafb85(selector, ()=>trigger({
        })
    , form);
    return $13c15430094b1863$var$createPathSelector(selector)(form.state);
}
function $13c15430094b1863$export$dde8d869f0aafb85(selector, effect, form) {
    form = form || $dmuzZ$react.useContext($13c15430094b1863$var$formContext);
    $dmuzZ$react.useEffect(()=>{
        const unsub = form.subscribe($13c15430094b1863$var$createPathSelector(selector), (val)=>effect(val)
        );
        return ()=>unsub()
        ;
    }, [
        JSON.stringify(selector)
    ]);
}
function $13c15430094b1863$export$8b00e3485cb32583(form) {
    const errors = $13c15430094b1863$export$606f11b2eb45ecc6('errors', form);
    const touched = $13c15430094b1863$export$606f11b2eb45ecc6('touched', form);
    return $f79348bd239ce172$export$d6051a0f7a227332(errors, (val, path)=>($parcel$interopDefault($dmuzZ$justsafeget))(touched, path) ? val : undefined
    , {
        omitEmpty: true
    });
}
/**
 * Given a selector `path`, returns a function that accepts an object and returns the value located at `path`.
 */ const $13c15430094b1863$var$createPathSelector = (path)=>(data)=>typeof path === 'function' ? path(data) : ($parcel$interopDefault($dmuzZ$justsafeget))(data, $96bc46e22b7b614c$export$b7c632328822445d(path))
;




const $8c8caac44e0df2f3$export$5bcff7329d9c4934 = (schema)=>{
    return async (values)=>{
        try {
            await schema.validate(values, {
                context: values,
                abortEarly: false
            });
            return null;
        } catch (err) {
            return $8c8caac44e0df2f3$var$yupErrorToObject(err);
        }
    };
};
function $8c8caac44e0df2f3$var$yupErrorToObject(yupError) {
    const errors = {
    };
    if (yupError.inner) {
        if (yupError.inner.length === 0) {
            ($parcel$interopDefault($dmuzZ$justsafeset))(errors, yupError.path, yupError.message);
            return errors;
        }
        for (const err of yupError.inner)if (!($parcel$interopDefault($dmuzZ$justsafeget))(errors, err.path)) ($parcel$interopDefault($dmuzZ$justsafeset))(errors, err.path, err.message);
    }
    return errors;
}




//# sourceMappingURL=main.js.map
