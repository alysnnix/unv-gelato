import {createMachine, assign} from "xstate";
import {createActorContext} from "@xstate/react";

const toggleMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  context: {
    count: 0,
  },
  states: {
    inactive: {
      on: {
        TOGGLE: "active",
        inc: {actions: assign({count: ({context}) => context.count + 1})},
      },
    },
    active: {
      on: {
        TOGGLE: "inactive",
        inc: {actions: assign({count: ({context}) => context.count + 1})},
      },
    },
  },
});

const ToggleMachineContext = createActorContext(toggleMachine);

const StateDisplay = () => {
  const value = ToggleMachineContext.useSelector((state) => state.value);
  return (
    <p>
      state machine: <strong>{String(value)}</strong>
    </p>
  );
};

const CounterDisplay = () => {
  const count = ToggleMachineContext.useSelector(
    (state) => state.context.count
  );
  return (
    <p>
      counter (from context): <strong>{count}</strong>
    </p>
  );
};

const Controls = () => {
  const actorRef = ToggleMachineContext.useActorRef();
  const stateValue = actorRef.getSnapshot().value;

  return (
    <div style={{display: "flex", gap: "10px"}}>
      <button onClick={() => actorRef.send({type: "TOGGLE"})}>
        change to '{stateValue === "active" ? "inactive" : "active"}'
      </button>
      <button onClick={() => actorRef.send({type: "inc"})}>increment</button>
    </div>
  );
};

export const Playground = () => {
  return (
    <ToggleMachineContext.Provider>
      <div>
        <h1>xstate playground</h1>
        <hr />
        <h3>
          example with <code>createActorContext</code> and selectors
        </h3>
        <StateDisplay />
        <CounterDisplay />
        <Controls />
      </div>
    </ToggleMachineContext.Provider>
  );
};
