"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const util_1 = require("./helpers/util");
const invalid_value_error_1 = require("./invalid-value.error");
class ValueObject {
    toString() {
        return this.toPlainValue().toString();
    }
    valueOf() {
        return this.toPlainValue().valueOf();
    }
    toJSON() {
        const plain = this.toPlainValue();
        if (util_1.util.isPrimitive(plain))
            return plain;
        return JSON.stringify(plain);
    }
    validate(value) {
        try {
            return this.schema.parse(value);
        }
        catch (error) {
            throw new invalid_value_error_1.InvalidValueError(error);
        }
    }
    toPlainValue(value = this.value) {
        return ValueObject.toPlainValue(value);
    }
    equals(other) {
        const Ctor = this.constructor;
        return ((0, fast_deep_equal_1.default)(util_1.util.flyweight.run(Ctor, this.type, Ctor.toPlainValue(other)), this));
    }
    with(value) {
        const Ctor = this.constructor;
        if (util_1.util.isPrimitive(value))
            return util_1.util.flyweight.run(Ctor, this.type, value);
        if (typeof value === 'object' && value !== null) {
            const newValue = Object.assign({}, this.value, value);
            return util_1.util.flyweight.run(Ctor, this.type, newValue);
        }
        return util_1.util.flyweight.run(Ctor, this.type, value);
    }
    constructor(value) {
        const Ctor = this.constructor;
        util_1.util.defineImmutable(this, 'schema', Ctor.schema);
        util_1.util.defineImmutable(this, 'type', Ctor.type);
        util_1.util.defineImmutable(this, 'value', Object.freeze(value), true);
        util_1.util.defineImmutable(this, util_1.util.IS_VALUE_OBJECT, true);
        const unwrapped = Ctor.toPlainValue(value);
        const instance = util_1.util.flyweight.run(Ctor, Ctor.type, unwrapped);
        if (instance) {
            util_1.util.validateSync(instance, unwrapped, this.constructor.name);
            util_1.util.copyPrototypeTo(this.constructor.prototype, instance.constructor.prototype);
            return instance;
        }
    }
    static async createAsync(value) {
        const unwrapped = this.toPlainValue(value);
        await this.schema.parseAsync(unwrapped);
        return util_1.util.flyweight.run(this, this.type, unwrapped);
    }
    static toPlainValue(value) {
        return value;
    }
    static _disableFlyweight() {
        util_1.util.flyweight.run = util_1.util.flyweightDisabled;
    }
    static _enableFlyweight() {
        util_1.util.flyweight.run = util_1.util.flyweightEnabled;
    }
}
exports.ValueObject = ValueObject;
