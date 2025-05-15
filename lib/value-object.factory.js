"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = ValueObject;
const util_1 = require("./helpers/util");
const value_object_constructor_1 = require("./value-object.constructor");
const createBaseClass = (brandedSchema, type) => {
    class ValueObjectType extends value_object_constructor_1.ValueObject {
        constructor(value) {
            super(value);
        }
        static async createAsync(value) {
            return super.createAsync(value);
        }
    }
    util_1.util.defineImmutable(ValueObjectType, 'schema', brandedSchema, true);
    util_1.util.defineImmutable(ValueObjectType, 'type', type, true);
    util_1.util.defineImmutable(ValueObjectType, 'name', type);
    return ValueObjectType;
};
function ValueObject(type, schema) {
    const brandedSchema = util_1.util.brandSchema(schema, type);
    const BaseClass = createBaseClass(brandedSchema, type);
    return new Proxy(BaseClass, {
        get: (target, prop) => {
            if (!(prop in target) && prop in brandedSchema) {
                return brandedSchema[prop];
            }
            return target[prop];
        },
    });
}
