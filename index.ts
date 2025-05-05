type ActionDefinition<State extends string> = {
  [Action: string]: State
}

type TransitionGraphDefinition<State extends string> = {
  [S in State]: ActionDefinition<State>
}

type DisableInference<T> = T extends any ? { value: T } : never;

type TransitionGraphInput<State extends string> = {
  [S in State]: ActionDefinition<DisableInference<State>['value']>
};

type CreateMachineInput<State extends string> = {
  readonly transitionGraph: TransitionGraphInput<State>;
  readonly initialState: DisableInference<State>['value'];
}

type StateMachine<State extends string> = {
  withListeners: ()
}

function createMachine<State extends string>({ transitionGraph, initialState }: CreateMachineInput<State>): void {
  return;
}

createMachine({
  transitionGraph: { hello: { to: 'world' }, world: { } },
  initialState: 'hello'
})

type NumToStr<num extends number> = `${num}`;


type Add_<num1 extends string, num2 extends string> = 
  num1 extends ''
    ? num2
    : num1 extends `${infer rest1 extends string}0`
      ? num2 extends ''
        ? num1
        : num2 extends `${infer rest2 extends string}0`
          ? `${Add_<rest1, rest2>}0`
          : num2 extends `${infer rest2 extends string}1`
            ? `${Add_<rest1, rest2>}1`
            : never
      : num1 extends `${infer rest1 extends string}1`
        ? num2 extends ''
          ? num1
          : num2 extends `${infer rest2 extends string}0`
            ? `${Add_<rest1, rest2>}1`
            : num2 extends `${infer rest2 extends string}1`
              ? `${Add_<Add_<rest1, rest2>, '1'>}0`
              : never
        : never;

type Inc_<num extends string> = Add_<num, '1'>;

type Dec_<num extends string, acc extends string = '0'> = 
  Eq<num, Inc_<acc>> extends true
    ? acc
    : Dec_<num, Inc_<acc>>

type Res = Dec_<'100'>