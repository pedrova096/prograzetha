type Regex_az =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
type Regez_AZ =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
type Regex_09 = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Regex_w = Regex_az | Regez_AZ | Regex_09 | "_";
type ParamChar = Regex_w | "-";
type RegexMatchPlus<
  CharPattern extends string,
  T extends string,
> = T extends `${infer First}${infer Rest}`
  ? First extends CharPattern
    ? RegexMatchPlus<CharPattern, Rest> extends never
      ? First
      : `${First}${RegexMatchPlus<CharPattern, Rest>}`
    : never
  : never;
type _PathParam<Path extends string> = Path extends `${infer L}/${infer R}`
  ? _PathParam<L> | _PathParam<R>
  : Path extends `:${infer Param}`
    ? Param extends `${infer Optional}?${string}`
      ? RegexMatchPlus<ParamChar, Optional>
      : RegexMatchPlus<ParamChar, Param>
    : never;
export type PathParam<Path extends string> = Path extends "*" | "/*"
  ? "*"
  : Path extends `${infer Rest}/*`
    ? "*" | _PathParam<Rest>
    : _PathParam<Path>;

type OptionalPathParam<Path extends string> =
  Path extends `${infer L}/${infer R}`
    ? OptionalPathParam<L> | OptionalPathParam<R>
    : Path extends `:${infer Param}?`
      ? Param
      : never;

export type ParamsForRoute<
  Path extends string,
  Optionals extends string = OptionalPathParam<Path>,
> = {
  [key in Exclude<PathParam<Path>, "*" | Optionals>]: string;
} & {
  [key in Optionals]?: string | null;
};
