import { z, ZodArray, ZodBranded, ZodFirstPartySchemaTypes, ZodObject, ZodRecord, ZodTuple, ZodType, ZodTypeAny } from 'zod';
export declare namespace util {
    const sortObj: <T>(obj: T) => T;
    const objectKeys: ObjectConstructor['keys'];
    const defineImmutable: <TObject, TValue, TKey extends string | symbol>(object: TObject, property: TKey, value: TValue, enumerable?: boolean) => TObject & { [key in TKey]: TValue; };
    const isPrimitive: (value: unknown) => value is typeUtil.Primitive;
    const extendClass: <Ctor extends typeUtil.SuperConstructor, ExtendCtor extends typeUtil.SuperConstructor>(Ctor: Ctor, extend?: ExtendCtor) => Ctor & ExtendCtor;
    const flyweightEnabled: <T extends typeUtil.Ctor, TValue>(Ctor: T, type: typeUtil.Instance<T>["type"], value: TValue) => typeUtil.Instance<T>;
    const flyweightDisabled: <T, TValue>(Ctor: typeUtil.Ctor, value: TValue) => T;
    const flyweight: {
        run: <T extends typeUtil.Ctor, TValue>(Ctor: T, type: typeUtil.Instance<T>["type"], value: TValue) => typeUtil.Instance<T>;
    };
    const brandSchema: <Schema extends ZodFirstPartySchemaTypes, Type extends string>(schema: Schema, type: Type) => typeUtil.Branded<Schema, Type>;
    const copyPrototypeTo: (prototype1: object, prototype2: object) => void;
    const IS_VALUE_OBJECT: unique symbol;
    const isValueObject: (value: unknown) => value is typeUtil.ValueObjectCtor<string>;
    const validateSync: (instance: typeUtil.ValueObjectCtor<any>, value: any, name: string) => void;
}
export declare namespace typeUtil {
    export type Primitive = string | number | boolean | bigint | symbol | undefined | null;
    export type Ctor<T = any, A extends any[] = any[]> = new (...args: A) => T;
    export type SuperConstructor = abstract new (...args: any) => object;
    export type Instance<T extends Ctor> = T extends Ctor<infer U> ? U : never;
    export type Literal<S extends string> = S extends string ? string extends S ? never : S : never;
    export type Branded<TSchema extends ZodTypeAny, Type extends string> = TSchema extends ZodBranded<infer S, typeUtil.Literal<Type>> ? ZodBranded<S, typeUtil.Literal<Type>> : ZodBranded<TSchema, typeUtil.Literal<Type>>;
    export interface ValueObjectCtor<Type extends KeyType, TSchema extends ZodBranded<ZodTypeAny, string> = ZodBranded<ZodTypeAny, string>, T extends TPlain<TSchema> = TPlain<TSchema>, TInput extends Input<TSchema> = Input<TSchema>> {
        type: Type;
        schema: TSchema;
        readonly value: T;
        toPlainValue(value: TInput): T;
        validate(value: T): T;
        equals(other: TInput): boolean;
        with(value: PartialValue<T>): ValueObjectCtor<Type, TSchema, T, TInput>;
    }
    export type TPlain<TSchemaBranded> = TSchemaBranded extends ZodBranded<infer TSchema, infer _TBrand> ? z.infer<TSchema> : TSchemaBranded extends ZodType ? z.infer<TSchemaBranded> : never;
    export type PartialValue<T> = T extends typeUtil.Primitive ? T : T extends Array<infer U> ? {
        [key: number]: U | ValueObjectCtor<string, ZodBranded<ZodType<U>, string>>;
    } : T extends Record<infer key, infer U> ? Partial<Record<key, U | ValueObjectCtor<string, ZodBranded<ZodType<U>, string>>>> : never;
    export type KeyType = string | number | symbol;
    type NativeTypes<TSchema extends ZodType> = TSchema extends ZodBranded<infer TSchema, infer _> ? z.infer<TSchema> : TSchema extends ZodType<any> ? z.infer<TSchema> : never;
    type PureValueObjectType<TSchema extends ZodType> = TSchema extends ZodBranded<infer TSchema, infer TType> ? ValueObjectCtor<TType, ZodBranded<TSchema, TType>> : TSchema extends ZodType<any> ? ValueObjectCtor<string, ZodBranded<TSchema, any>> : never;
    type MixedTypes<TSchema extends ZodType> = TSchema extends ZodBranded<infer S, any> ? S extends ZodType<infer O> ? O extends Array<infer I> ? S extends ZodArray<infer s> ? Array<Input<s> | I> : S extends ZodTuple<infer s> ? {
        [key in keyof s]: Input<s[key]> | z.infer<s[key]>;
    } : never : O extends Record<any, any> ? S extends ZodRecord<infer key, infer value> ? {
        [k in keyof key]: Input<value> | z.infer<value>;
    } : S extends ZodObject<infer s> ? {
        [key in keyof s]: Input<s[key]> | z.infer<s[key]>;
    } : never : never : never : TSchema extends ZodType<infer O> ? O extends Array<infer I> ? TSchema extends ZodArray<infer s> ? Array<Input<s> | I> : TSchema extends ZodTuple<infer s> ? {
        [key in keyof s]: Input<s[key]> | z.infer<s[key]>;
    } : never : O extends Record<any, any> ? TSchema extends ZodRecord<infer key, infer value> ? {
        [k in keyof key]: Input<value> | z.infer<value>;
    } : TSchema extends ZodObject<infer s> ? {
        [key in keyof s]: Input<s[key]> | z.infer<s[key]>;
    } : never : never : never;
    export type Input<TSchema extends ZodType> = NativeTypes<TSchema> | PureValueObjectType<TSchema> | MixedTypes<TSchema>;
    export {};
}
