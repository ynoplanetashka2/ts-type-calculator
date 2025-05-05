type Integer = string;
type PositiveInteger = Integer;
type Zero = '';
type One = '.';
type Two = '..';

type Rational = [numerator: Integer, denominator: Integer];

type Numerator<rat extends Rational> =
  rat extends [infer numerator extends Integer, Integer]
    ? numerator
    : never;

type Denominator<rat extends Rational> =
  rat extends [Integer, infer denominator extends Integer]
    ? denominator
    : never;

type NegateRational<rat extends Rational> =
  rat extends [infer numerator extends Integer, infer denominator extends Integer]
    ? [Negate<numerator>, denominator]
    : never;

type Head<list extends unknown> =
  list extends { [0]: infer value }
    ? value
    : never;

type AddPositive<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  num1 extends Zero
    ? num2
    : num1 extends `.${infer rest1 extends string}`
      ? AddPositive<rest1, `.${num2}`>
      : never;

type DecrementPositive<num extends PositiveInteger> =
  num extends Zero
    ? Zero
    : num extends `.${infer rest extends string}`
        ? rest
        : never;

type PositiveGreaterThan<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  num1 extends Zero
    ? num2 extends Zero
      ? false
      : num2 extends `.${string}`
        ? false
        : never
    : num1 extends `.${string}`
      ? num2 extends ''
        ? true
        : num2 extends `.${string}`
          ? PositiveGreaterThan<DecrementPositive<num1>, DecrementPositive<num2>>
          : never
      : never;

type PositiveLessThan<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  PositiveGreaterThan<num2, num1>;

type Eq<T1, T2> = 
  T1 extends T2
    ? T2 extends T1
      ? true
      : false
    : false;
    
type PositiveGreaterThanOrEqual<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  Eq<num1, num2> extends true
    ? true
    : PositiveGreaterThan<num1, num2>;

type PositiveDecrementWhileBothNoneZero__<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  num1 extends Zero
    ? num2 extends Zero
      ? Zero
      : num2 extends `.${string}`
        ? num2
        : never
    : num1 extends `.${string}`
      ? num2 extends Zero
        ? num1
        : num2 extends `.${string}`
          ? PositiveDecrementWhileBothNoneZero__<DecrementPositive<num1>, DecrementPositive<num2>>
          : never
      : never;

type Abs<num extends Integer> =
  num extends `-${infer value extends string}`
    ? value
    : num;

type Negate<num extends Integer> =
  num extends `-${infer value extends string}`
    ? value
    : `-${num}`;

type IsNegative<num extends Integer> = 
  num extends `-${string}`
    ? true
    : false;

type Xor<bool1 extends boolean, bool2 extends boolean> =
  bool1 extends true
    ? bool2 extends true
      ? false
      : true
    : bool2 extends true
      ? true
      : false;

type SubtractPositive<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  Eq<num1, num2> extends true
    ? Zero
    : PositiveGreaterThan<num1, num2> extends true
      ? PositiveDecrementWhileBothNoneZero__<num1, num2>
      : `-${PositiveDecrementWhileBothNoneZero__<num1, num2>}`

type Add<num1 extends Integer, num2 extends Integer> =
  IsNegative<num1> extends true
    ? IsNegative<num2> extends true
      ? `-${AddPositive<Abs<num1>, Abs<num2>>}`
      : SubtractPositive<num2, Abs<num1>>
    : IsNegative<num2> extends true
      ? SubtractPositive<num1, Abs<num2>>
      : AddPositive<num1, num2>

type Subtract<num1 extends Integer, num2 extends Integer> =
  Add<num1, Negate<num2>>

type MultiplyPositive_<num1 extends PositiveInteger, num2 extends PositiveInteger, acc extends PositiveInteger = ''> =
  num1 extends Zero
    ? acc
    : MultiplyPositive_<DecrementPositive<num1>, num2, AddPositive<num2, acc>>
  

type MultiplyPositive<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  MultiplyPositive_<num1, num2>;

type Multiply<num1 extends Integer, num2 extends Integer> =
  IsNegative<num1> extends true
    ? IsNegative<num2> extends true
      ? MultiplyPositive<Abs<num1>, Abs<num2>>
      : Negate<MultiplyPositive<Abs<num1>, num2>>
    : IsNegative<num2> extends true
      ? Negate<MultiplyPositive<num1, Abs<num2>>>
      : MultiplyPositive<num1, num2>;

type Pow_<num1 extends Integer, num2 extends PositiveInteger, acc extends Integer = One> =
  num2 extends Zero
    ? acc
    : Pow_<num1, DecrementPositive<num2>, Multiply<acc, num1>>;

type Pow<num1 extends Integer, num2 extends PositiveInteger> =
  Pow_<num1, num2>;

type Increment<num extends Integer> = Add<num, One>;

type DividePositive_<num1 extends PositiveInteger, num2 extends PositiveInteger, integerPartAcc extends PositiveInteger = ''> =
  PositiveGreaterThanOrEqual<num1, num2> extends true
    ? DividePositive_<SubtractPositive<num1, num2>, num2, Increment<integerPartAcc>>
    : [integerPartAcc, num1];

type DividePositive<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  DividePositive_<num1, num2>;

type Divide<num1 extends Integer, num2 extends Integer> =
  IsNegative<num1> extends true
    ? IsNegative<num2> extends true
      ? DividePositive<Abs<num1>, Abs<num2>>
      : NegateRational<DividePositive<Abs<num1>, num2>>
    : IsNegative<num2> extends true
      ? NegateRational<DividePositive<num1, Abs<num2>>>
      : DividePositive<num1, num2>;

type PositiveIntegerToString<num extends PositiveInteger> =
  num extends Zero
    ? '0'
    : DividePositive<num, Two> extends [infer integerPart extends PositiveInteger, infer remainder extends PositiveInteger]
      ? integerPart extends Zero
        ? remainder extends Zero
          ? never
          : remainder extends One
            ? '1'
            : never
        : remainder extends Zero
          ? `${PositiveIntegerToString<integerPart>}0`
          : remainder extends One
            ? `${PositiveIntegerToString<integerPart>}1`
            : never
      : never;

type IntegerToString<num extends Integer> =
  IsNegative<num> extends true
    ? `-${PositiveIntegerToString<Abs<num>>}`
    : PositiveIntegerToString<num>;

type StringToPositiveInteger<str extends string> =
  str extends `${infer rest extends string}0`
    ? rest extends ''
      ? Zero
      : MultiplyPositive<StringToPositiveInteger<rest>, Two>
    : str extends `${infer rest extends string}1`
      ? rest extends ''
        ? One
        : AddPositive<
            MultiplyPositive<StringToPositiveInteger<rest>, Two>,
            One
          >
      : never;
    
type StringToInteger<str extends string> =
  str extends `-${infer rest extends string}`
    ? Negate<StringToPositiveInteger<rest>>
    : StringToPositiveInteger<str>;


type IsPrime_<num extends PositiveInteger, acc extends PositiveInteger = Two> =
  num extends Zero
    ? false
    : num extends One
      ? false
      : PositiveLessThan<acc, num> extends true
        ? DividePositive<num, acc> extends [PositiveInteger, infer remainder extends PositiveInteger]
          ? Eq<remainder, Zero> extends true
            ? false
            : IsPrime_<num, Increment<acc>>
          : never
        : true;

type IsPrime<num extends PositiveInteger> = IsPrime_<num>;

type AddRational<rat1 extends Rational, rat2 extends Rational> =
  rat1 extends [infer numerator1 extends Integer, infer denominator1 extends Integer]
    ? rat2 extends [infer numerator2 extends Integer, infer denominator2 extends Integer]
      ? [Add<Multiply<numerator1, denominator2>, Multiply<numerator2, denominator1>>, Multiply<denominator1, denominator2>]
      : never
    : never;

type GreatestCommonDivisorPositive<num1 extends PositiveInteger, num2 extends PositiveInteger> =
  num1 extends Zero
    ? num2
    : num2 extends Zero
      ? num1
      : PositiveGreaterThan<num1, num2> extends true
        ? GreatestCommonDivisorPositive<SubtractPositive<num1, num2>, num2>
        : GreatestCommonDivisorPositive<num1, SubtractPositive<num2, num1>>;

type MultiplyRationalByCommonFactor<rat extends Rational, factor extends Integer> =
  rat extends [infer numerator extends Integer, infer denominator extends Integer]
    ? [Multiply<numerator, factor>, Multiply<denominator, factor>]
    : never;

type GreatestCommonDivisor<num1 extends Integer, num2 extends Integer> = 
  GreatestCommonDivisorPositive<Abs<num1>, Abs<num2>>;

type DivideRationalByCommonFactor<rat extends Rational, commonFactor extends Integer> =
  rat extends [infer numerator extends Integer, infer denominator extends Integer]
    ? [Head<Divide<numerator, commonFactor>>, Head<Divide<denominator, commonFactor>>]
    : never;

type SimplifyRational<rat extends Rational> =
  rat extends [infer numerator extends Integer, infer denominator extends Integer]
    ? IsNegative<denominator> extends true
      ? DivideRationalByCommonFactor<rat, Negate<GreatestCommonDivisor<numerator, denominator>>>
      : DivideRationalByCommonFactor<rat, GreatestCommonDivisor<numerator, denominator>>
  : never;

type RationalNormalizeSign<rat extends Rational> =
  rat extends [Integer, infer denominator extends Integer]
    ? IsNegative<denominator> extends true
      ? MultiplyRationalByCommonFactor<rat, Negate<One>>
      : rat
    : never;

type RationalToString_<rat extends Rational> =
  rat extends [infer numerator extends Integer, infer denominator extends Integer]
    ? `${IntegerToString<numerator>}/${IntegerToString<denominator>}`
    : never;

type RationalToString<rat extends Rational> =
  RationalToString_<RationalNormalizeSign<rat>>;

type IntegerToRational<num extends Integer> =
  [num, One];

type MultiplyRational<rat1 extends Rational, rat2 extends Rational> =
  rat1 extends [infer numerator1 extends Integer, infer denominator1 extends Integer]
    ? rat2 extends [infer numerator2 extends Integer, infer denominator2 extends Integer]
      ? [Multiply<numerator1, numerator2>, Multiply<denominator1, denominator2>]
      : never
    : never;

type Factorial<num extends PositiveInteger> =
  num extends Zero
    ? One
    : Multiply<num, Factorial<DecrementPositive<num>>>;

type RationalInverse<rat extends Rational> =
  rat extends [infer numerator extends Integer, infer denominator extends Integer]
    ? [denominator, numerator]
    : never;

type RationalInIntegerPower<rat extends Rational, pow extends Integer> =
  IsNegative<pow> extends true
    ? RationalInIntegerPower<RationalInverse<rat>, Negate<pow>>
    : rat extends [infer numerator extends Integer, infer denominator extends Integer]
      ? [Pow<numerator, pow>, Pow<denominator, pow>]
      : never;

type Exp_<
  rat extends Rational,
  stepsCount extends PositiveInteger,
  acc extends Rational = IntegerToRational<Zero>,
  i extends PositiveInteger = Zero
> =
  Eq<i, stepsCount> extends true
    ? acc
    : Exp_<
        rat,
        stepsCount,
        AddRational<
          acc,
          MultiplyRational<
            RationalInIntegerPower<rat, i>, 
            RationalInverse<IntegerToRational<Factorial<i>>>
          >
        >,
        Increment<i>
      >;


type Exp<rat extends Rational = IntegerToRational<One>, stepsCount extends number = 3> =
  Exp_<rat, stepsCount>;

type e = Exp
type a = StringToInteger<'101'>;
type b = StringToInteger<'-1010'>;
type c = RationalToString<SimplifyRational<e>>
type d = IntegerToString<Factorial<a>>
type R = IntegerToString<'-.....'>