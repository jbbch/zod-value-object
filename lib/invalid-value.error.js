"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidValueError = void 0;
class InvalidValueError extends Error {
    constructor(error) {
        super(error.message);
        Object.assign(this, error);
    }
}
exports.InvalidValueError = InvalidValueError;
