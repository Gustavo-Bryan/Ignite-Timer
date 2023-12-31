import { useContext } from 'react';
import { HistoryContainer, HistoryList, Status } from './styles';
import { CycleContext } from '../../contexts/CyclesContext';
import { formatDistanceToNow } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

export const History = () => {
  const { cycles } = useContext(CycleContext);

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutesAmount} minutos</td>
                  <td>
                    {formatDistanceToNow(new Date(cycle.startDate), {
                      addSuffix: true,
                      locale: ptBr,
                    })}
                  </td>
                  {cycle.finishedDate && (
                    <td>
                      <Status statusColor="green">Concluído</Status>
                    </td>
                  )}
                  {cycle.interruptDate && (
                    <td>
                      <Status statusColor="red">Interrompido</Status>
                    </td>
                  )}

                  {!cycle.interruptDate && !cycle.finishedDate && (
                    <td>
                      <Status statusColor="yellow">Em andamento</Status>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
};
