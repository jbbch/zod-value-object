import { ZodBranded, ZodTypeAny } from 'zod';
import { typeUtil } from './helpers/util';
import { ValueObject as ValueObjectCtor } from './value-object.constructor';
export declare function ValueObject<Type extends string, TSchema extends ZodTypeAny>(type: typeUtil.Literal<Type>, schema: TSchema): {
    new (value: typeUtil.Input<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>): {
        readonly type: typeUtil.Literal<Type>;
        readonly schema: typeUtil.Branded<TSchema, typeUtil.Literal<Type>>;
        readonly value: typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>;
        toString(): any;
        valueOf(): any;
        toJSON(): string | (typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>> & undefined) | (typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>> & null) | (typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>> & number) | (typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>> & bigint) | (typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>> & false) | (typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>> & true) | (typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>> & symbol);
        validate(value: typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>): typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>;
        toPlainValue(value?: typeUtil.Input<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>): typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>;
        equals(other: typeUtil.Input<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>): boolean;
        with(value: typeUtil.PartialValue<typeUtil.TPlain<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>>): any;
    };
    schema: typeUtil.Branded<TSchema, typeUtil.Literal<Type>>;
    type: typeUtil.Literal<Type>;
    createAsync(value: typeUtil.Input<typeUtil.Branded<TSchema, typeUtil.Literal<Type>>>): Promise<ValueObjectCtor<string, ZodBranded<ZodTypeAny, string>, any, any>>;
    toPlainValue<Schema extends import("zod").ZodFirstPartySchemaTypes, T extends typeUtil.Input<Schema> = typeUtil.Input<Schema>>(value: T): typeUtil.TPlain<Schema>;
    _disableFlyweight(): void;
    _enableFlyweight(): void;
} & typeUtil.Branded<TSchema, typeUtil.Literal<Type>>;
