(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('zod'), require('fast-deep-equal')) :
    typeof define === 'function' && define.amd ? define(['exports', 'zod', 'fast-deep-equal'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ValueObject = {}, global.zod, global.deepEqual));
})(this, (function (exports, zod, deepEqual) { 'use strict';

    class InvalidValueError extends Error {
        constructor(error) {
            super(error.message);
            Object.assign(this, error);
        }
    }

    exports.util = void 0;
    (function (util) {
        util.sortObj = (obj) => obj === null || typeof obj !== 'object'
            ? obj
            : Array.isArray(obj)
                // @ts-ignore
                ? obj.map(util.sortObj)
                : Object.assign({}, ...Object.entries(obj)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([k, v]) => ({ [k]: util.sortObj(v) })));
        util.objectKeys = typeof Object.keys === 'function' // eslint-disable-line ban/ban
            ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
            : (object) => {
                const keys = [];
                for (const key in object) {
                    if (Object.prototype.hasOwnProperty.call(object, key)) {
                        keys.push(key);
                    }
                }
                return keys;
            };
        util.defineImmutable = (object, property, value, enumerable = false) => Object.defineProperty(object, property, {
            value: value,
            writable: false,
            enumerable,
        });
        util.isPrimitive = (value) => {
            const type = typeof value;
            return (value === null ||
                ['string', 'number', 'boolean', 'bigint', 'symbol', 'undefined'].includes(type));
        };
        util.extendClass = (Ctor, extend) => {
            if (!extend)
                return Ctor;
            const names = Object.getOwnPropertyNames(extend.prototype);
            for (const prop of names) {
                if (prop in Ctor.prototype)
                    continue;
                const desc = Object.getOwnPropertyDescriptor(extend.prototype, prop);
                if (desc) {
                    Object.defineProperty(Ctor.prototype, prop, desc);
                }
            }
            return Ctor;
        };
        const db = Object.create(null);
        util.flyweightEnabled = (Ctor, type, value) => {
            const table = (db[type] = db[type] || Object.create(null));
            const key = JSON.stringify(util.sortObj(value));
            if (typeof table[key] !== 'undefined')
                return table[key];
            table[key] = null;
            table[key] = new Ctor(value);
            return table[key];
        };
        util.flyweightDisabled = (Ctor, value) => {
            return new Ctor(value, true);
        };
        util.flyweight = {
            run: util.flyweightEnabled,
        };
        util.brandSchema = (schema, type) => {
            if (schema._def.typeName === zod.ZodFirstPartyTypeKind.ZodBranded) {
                return schema;
            }
            else {
                return schema.brand(type);
            }
        };
        util.copyPrototypeTo = (prototype1, prototype2) => {
            const names = Object.getOwnPropertyNames(prototype1);
            for (const prop of names) {
                if (prop in prototype2)
                    continue;
                const desc = Object.getOwnPropertyDescriptor(prototype1, prop);
                desc && Object.defineProperty(prototype2, prop, desc);
            }
        };
        util.IS_VALUE_OBJECT = Symbol('IS_VALUE_OBJECT');
        util.isValueObject = (value) => {
            return (value !== null &&
                typeof value === 'object' &&
                util.IS_VALUE_OBJECT in value &&
                value[util.IS_VALUE_OBJECT] === true);
        };
        util.validateSync = (instance, value, name) => {
            try {
                instance['validate'](value);
            }
            catch (error) {
                if (error instanceof Error &&
                    (error.message.includes('Async refinement encountered') ||
                        error.message.includes('Asynchronous transform encountered'))) {
                    error.message = error.message.replace('Use .parseAsync instead.', `Use ${name}.createAsync() instead of new ${name}()`);
                }
                throw new InvalidValueError(error);
            }
        };
    })(exports.util || (exports.util = {}));

    let ValueObject$1 = class ValueObject {
        toString() {
            return this.toPlainValue().toString();
        }
        valueOf() {
            return this.toPlainValue().valueOf();
        }
        toJSON() {
            const plain = this.toPlainValue();
            if (exports.util.isPrimitive(plain))
                return plain;
            return JSON.stringify(plain);
        }
        validate(value) {
            try {
                return this.schema.parse(value);
            }
            catch (error) {
                throw new InvalidValueError(error);
            }
        }
        toPlainValue(value = this.value) {
            return ValueObject.toPlainValue(value);
        }
        equals(other) {
            const Ctor = this.constructor;
            return (deepEqual(exports.util.flyweight.run(Ctor, this.type, Ctor.toPlainValue(other)), this));
        }
        with(value) {
            const Ctor = this.constructor;
            if (exports.util.isPrimitive(value))
                return exports.util.flyweight.run(Ctor, this.type, value);
            if (typeof value === 'object' && value !== null) {
                const newValue = Object.assign({}, this.value, value);
                return exports.util.flyweight.run(Ctor, this.type, newValue);
            }
            return exports.util.flyweight.run(Ctor, this.type, value);
        }
        constructor(value) {
            const Ctor = this.constructor;
            exports.util.defineImmutable(this, 'schema', Ctor.schema);
            exports.util.defineImmutable(this, 'type', Ctor.type);
            exports.util.defineImmutable(this, 'value', Object.freeze(value), true);
            exports.util.defineImmutable(this, exports.util.IS_VALUE_OBJECT, true);
            const unwrapped = Ctor.toPlainValue(value);
            const instance = exports.util.flyweight.run(Ctor, Ctor.type, unwrapped);
            /* Instance will be null once, if the flyweight cache is empty.
             * In this case we don't return the flyweight instance, but the
             * newly (implicitly) constructed instance */
            if (instance) {
                exports.util.validateSync(instance, unwrapped, this.constructor.name);
                exports.util.copyPrototypeTo(this.constructor.prototype, instance.constructor.prototype);
                return instance;
            }
        }
        static async createAsync(value) {
            const unwrapped = this.toPlainValue(value);
            await this.schema.parseAsync(unwrapped);
            return exports.util.flyweight.run(this, this.type, unwrapped);
        }
        static toPlainValue(value) {
            return value;
        }
        static _disableFlyweight() {
            exports.util.flyweight.run = exports.util.flyweightDisabled;
        }
        static _enableFlyweight() {
            exports.util.flyweight.run = exports.util.flyweightEnabled;
        }
    };

    /**
     * This factory is used to type our instance correctly
     * and set static properties.
     */
    const createBaseClass = (brandedSchema, type) => {
        class ValueObjectType extends ValueObject$1 {
            constructor(value) {
                super(value);
            }
            static async createAsync(value) {
                return super.createAsync(value);
            }
        }
        /* To secure immutability */
        exports.util.defineImmutable(ValueObjectType, 'schema', brandedSchema, true);
        exports.util.defineImmutable(ValueObjectType, 'type', type, true);
        exports.util.defineImmutable(ValueObjectType, 'name', type);
        return ValueObjectType;
    };
    function ValueObject(type, schema) {
        const brandedSchema = exports.util.brandSchema(schema, type);
        const BaseClass = createBaseClass(brandedSchema, type);
        /* Return a Proxy to allow using the ValueObject as Zod-Type */
        return new Proxy(BaseClass, {
            get: (target, prop) => {
                if (!(prop in target) && prop in brandedSchema) {
                    // @ts-expect-error ts(2339)
                    return brandedSchema[prop];
                }
                // @ts-expect-error ts(2339)
                return target[prop];
            },
        });
    }

    var index = ValueObject;

    exports.InvalidValueError = InvalidValueError;
    exports.ValueObject = ValueObject;
    exports.default = index;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
