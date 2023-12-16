import { HandPalm, Play } from 'phosphor-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { createContext, useState } from 'react';

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles';
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown/Index';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'O projeto deve ter pelo menos 1 caractere'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo deve ter no mínimo 5 minutos')
    .max(60, 'O ciclo deve ter no máximo 60 minutos'),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

interface ICycleContext {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
}

export const CycleContext = createContext({} as ICycleContext);

export const Home = () => {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const { handleSubmit, watch, reset } = newCycleForm;

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);

    reset();
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle === activeCycle) {
          return { ...cycle, interruptDate: new Date() };
        } else {
          return cycle;
        }
      }),
    );
  }

  function handleInterruptCountdown() {
    markCurrentCycleAsFinished();
    setActiveCycleId(null);
  }

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CycleContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            amountSecondsPassed,
            markCurrentCycleAsFinished,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CycleContext.Provider>

        <datalist id="task-suggestions">
          <option value="Projeto 1" />
          <option value="Projeto 2" />
          <option value="Projeto 3" />
          <option value="Projeto 4" />
        </datalist>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCountdown}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
};
