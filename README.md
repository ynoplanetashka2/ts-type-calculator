# ts-type-calculator

It is in some sense a proof of concept of Turing Completness of Typescript type system.

This package allows rational number computation built purely on Typescript type system.

Example:
```typescript
type a = RationalToDecimalStringWithPrecision< // transform rational number to string with decimal representation
  Pi<JSNumberToInteger<3>>, // compute PI with specified precision (3)
  JSNumberToInteger<4> // digits to include after decimal point (4)
>;
// type of `a` is a string contaning approximate PI value in decimal representation
// it is equivalent to the following:
// type a = "2.9333"
```