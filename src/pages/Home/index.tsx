import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
        .number()
        .min(5, 'O ciclo precisa ser de no minímo 5 minutos')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos'),
})

// interface NewCycleFormData {
//     task: string
//     minutesAmount: number
// }

// O zod cria a interface a cima:
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
    const { register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    function handleCreateNewCycle(data: NewCycleFormData) {
        console.log(data);
        reset();
    }

    const task = watch( 'task')
    const isSubmitDisabled = !task;

    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        type="text" 
                        id="task" 
                        list="task-suggestion"
                        placeholder="Dê um nome para o seu projeto" 
                        {...register('task')}
                    />

                    <datalist id="task-suggestion">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Projeto 4" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00"
                        step={5} // propriedade que permite pular o contator
                        min={5} // valor minímo do contator
                        max={60} // valor máximo do contator
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutes</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    );
}