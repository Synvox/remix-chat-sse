import {
  ComponentProps,
  ComponentType,
  createElement,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";

export const tw = String.raw;

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
type ClassName = string;
type Variant = Record<string, ClassName>;
type Variants = Record<string, Variant>;
type DefaultVariants<V extends Variants> = {
  readonly [K in keyof V]?: keyof V[K];
};

type ValidProps<V extends Variants, D extends DefaultVariants<V>> = Simplify<
  {
    readonly [K in Exclude<keyof V, keyof D>]: keyof V[K];
  } & {
    readonly [K in Extract<keyof V, keyof D>]?: keyof V[K];
  }
>;

function getClassName<V extends Variants, D extends DefaultVariants<V>>(
  variants: V,
  defaultVariants: D,
) {
  return function (props: ValidProps<V, D>): ClassName {
    const allProps: ValidProps<V, D> = {
      ...defaultVariants,
      ...props,
    };

    const classNames: ClassName[] = [];

    for (const key of Object.keys(allProps)) {
      if (!variants[key]) continue;
      const k = key as keyof typeof allProps;

      const variant = variants[k];
      const value = allProps[k] as keyof typeof variant;
      classNames.push(variant[value] ?? "");
    }

    return classNames.join(" ");
  };
}

export function twVariants<V extends Variants, D extends DefaultVariants<V>>(
  variants: V,
  defaultVariants: D,
) {
  const fn = getClassName(variants, defaultVariants);
  return function (props: ValidProps<V, D>): ClassName {
    const classNames = twMerge(fn(props));
    return classNames;
  };
}

function filterVariantNamesFromProps<V extends Variants>(
  variants: V,
  props: any,
): any {
  const filteredProps = {} as any;

  for (const key of Object.keys(props)) {
    if (variants[key]) continue;
    const k = key as keyof typeof props;

    filteredProps[k] = props[k];
  }

  return filteredProps;
}

export function twComponent<
  Type extends keyof JSX.IntrinsicElements | ComponentType<P>,
  V extends Variants = {},
  D extends DefaultVariants<V> = {},
  P = Type extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[Type]
    : ComponentProps<Type>,
>(type: Type, baseValue: ClassName, variants?: V, defaultVariants?: D) {
  type Props = P & ValidProps<V, D> & { className?: string };
  type RefType = Type extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[Type] extends React.DetailedHTMLProps<
        infer _,
        infer T
      >
      ? T
      : never
    : Type extends React.ComponentType<infer T>
    ? T
    : never;

  const getStyles = getClassName(variants ?? {}, defaultVariants ?? {});

  return forwardRef<RefType, Props>((givenProps, ref) => {
    const className = twMerge(
      baseValue,
      getStyles(givenProps),
      givenProps.className,
    );

    const props: P = {
      ...filterVariantNamesFromProps(variants ?? {}, givenProps),
      className,
      ref,
    };

    //@ts-expect-error
    return createElement(type, props);
  });
}
