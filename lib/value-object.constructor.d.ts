import { ZodBranded, ZodFirstPartySchemaTypes, ZodTypeAny } from 'zod';
import { typeUtil } from './helpers/util';
export declare class ValueObject<Type extends string, TSchema extends ZodBranded<ZodTypeAny, string> = ZodBranded<ZodTypeAny, string>, T extends typeUtil.TPlain<TSchema> = typeUtil.TPlain<TSchema>, TInput extends typeUtil.Input<TSchema> = typeUtil.Input<TSchema>> implements typeUtil.ValueObjectCtor<Type, TSchema, T, TInput> {
    static schema: InstanceType<typeof ZodBranded>;
    static type: string;
    readonly type: Type;
    readonly schema: TSchema;
    readonly value: T;
    toString(): any;
    valueOf(): any;
    toJSON(): string | (T & undefined) | (T & null) | (T & number) | (T & bigint) | (T & false) | (T & true) | (T & symbol);
    validate(value: T): T;
    toPlainValue(value?: TInput): T;
    equals(other: TInput): boolean;
    with(value: typeUtil.PartialValue<T>): this;
    constructor(value: TInput);
    static createAsync(value: typeUtil.Input<InstanceType<typeof ZodBranded>>): Promise<ValueObject<string, ZodBranded<ZodTypeAny, string>, any, any>>;
    static toPlainValue<Schema extends ZodFirstPartySchemaTypes, T extends typeUtil.Input<Schema> = typeUtil.Input<Schema>>(value: T): typeUtil.TPlain<Schema>;
    static _disableFlyweight(): void;
    static _enableFlyweight(): void;
}
