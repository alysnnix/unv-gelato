import {createMachine, assign} from "xstate";
import {createActorContext} from "@xstate/react";

// 1. A máquina de estados continua a mesma
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

// 2. Criamos o Contexto a partir da máquina
const ToggleMachineContext = createActorContext(toggleMachine);

// --- Componentes Especializados ---

// Este componente SÓ se importa com o valor do estado (active/inactive)
const StateDisplay = () => {
  const value = ToggleMachineContext.useSelector((state) => state.value);
  return (
    <p>
      Estado da máquina: <strong>{String(value)}</strong>
    </p>
  );
};

// Este componente SÓ se importa com o contador
const CounterDisplay = () => {
  const count = ToggleMachineContext.useSelector(
    (state) => state.context.count
  );
  return (
    <p>
      Contador (do contexto): <strong>{count}</strong>
    </p>
  );
};

// Este componente SÓ se importa em enviar eventos. Ele não se inscreve em nenhuma mudança.
const Controls = () => {
  const actorRef = ToggleMachineContext.useActorRef();
  // Usamos getSnapshot() para ler o valor atual sem nos inscrevermos para futuras atualizações.
  const stateValue = actorRef.getSnapshot().value;

  return (
    <div style={{display: "flex", gap: "10px"}}>
      <button onClick={() => actorRef.send({type: "TOGGLE"})}>
        Mudar para '{stateValue === "active" ? "inactive" : "active"}'
      </button>
      <button onClick={() => actorRef.send({type: "inc"})}>
        Incrementar Contador
      </button>
    </div>
  );
};

// 3. O componente Home agora é o Provedor do contexto
export const Home = () => {
  return (
    <ToggleMachineContext.Provider>
      <div>
        <h1>Dashboard Home com XState</h1>
        <hr />
        <h3>
          Exemplo com <code>createActorContext</code> e Seletores
        </h3>
        <StateDisplay />
        <CounterDisplay />
        <Controls />
      </div>
    </ToggleMachineContext.Provider>
  );
};
