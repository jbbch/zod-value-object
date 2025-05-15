"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = void 0;
const zod_1 = require("zod");
const invalid_value_error_1 = require("../invalid-value.error");
var util;
(function (util) {
    util.sortObj = (obj) => obj === null || typeof obj !== 'object'
        ? obj
        : Array.isArray(obj)
            ? obj.map(util.sortObj)
            : Object.assign({}, ...Object.entries(obj)
                .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                .map(([k, v]) => ({ [k]: util.sortObj(v) })));
    util.objectKeys = typeof Object.keys === 'function'
        ? (obj) => Object.keys(obj)
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
        if (schema._def.typeName === zod_1.ZodFirstPartyTypeKind.ZodBranded) {
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
            throw new invalid_value_error_1.InvalidValueError(error);
        }
    };
})(util || (exports.util = util = {}));
