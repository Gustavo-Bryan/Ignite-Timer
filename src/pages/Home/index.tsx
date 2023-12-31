import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { HandPalm, Play } from 'phosphor-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown/Index';
import { CycleContext } from '../../contexts/CyclesContext';

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'O projeto deve ter pelo menos 1 caractere'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo deve ter no mínimo 5 minutos')
    .max(60, 'O ciclo deve ter no máximo 60 minutos'),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export const Home = () => {
  const { activeCycle, createNewCycle, interruptCountdown } =
    useContext(CycleContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch('task');
  const isSubmitDisabled = !task;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        <datalist id="task-suggestions">
          <option value="Projeto 1" />
          <option value="Projeto 2" />
          <option value="Projeto 3" />
          <option value="Projeto 4" />
        </datalist>

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCountdown}>
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
