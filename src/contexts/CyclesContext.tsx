import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer';
import {
  createNewCycleAction,
  interruptCountdownAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions';
import { differenceInSeconds } from 'date-fns';

interface ICyclesContext {
  children: ReactNode;
}

interface INewCycleFormData {
  task: string;
  minutesAmount: number;
}

interface ICycleContext {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: INewCycleFormData) => void;
  interruptCountdown: () => void;
}

export const CycleContext = createContext({} as ICycleContext);

export const CyclesContextProvider = ({ children }: ICyclesContext) => {
  const [cycleState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJson = localStorage.getItem(
        '@ignite-timer: cycles-state-1.0.0',
      );

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson);
      }
    },
  );

  const { cycles, activeCycleId } = cycleState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  useEffect(() => {
    const stateJson = JSON.stringify(cycleState);

    return localStorage.setItem('@ignite-timer: cycles-state-1.0.0', stateJson);
  }, [cycleState]);

  function createNewCycle(data: INewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(createNewCycleAction(newCycle));

    setAmountSecondsPassed(0);
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function interruptCountdown() {
    dispatch(interruptCountdownAction());
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCountdown,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
};
