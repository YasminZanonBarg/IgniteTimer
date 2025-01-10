import { useEffect, useState } from "react";
import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns';

import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";


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

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

export function Home(){
    // o estado abaixo armazena um arrey de cycle = Cycle[]
    const [cycles, setCycle] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const { register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);
    const totalSecond = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    useEffect(() =>{
        let interval: NodeJS.Timeout;

        
        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(), 
                    activeCycle.startDate
                )

                if (secondsDifference >= totalSecond) {
                    setCycle((state) => 
                        state.map((cycle) => {
                            if (cycle.id == activeCycleId) {
                                return { ...cycle, finishedDate: new Date() }
                            } else {
                                return cycle
                            }
                        }),
                    )

                    setAmountSecondsPassed(totalSecond)
                    clearInterval(interval)
                } else {
                    setAmountSecondsPassed(secondsDifference)
                } 
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSecond, activeCycleId])

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        
        setCycle((state) => [...state, newCycle]);
        setActiveCycleId(id);
        setAmountSecondsPassed(0);

        reset();
    }

    function handleInterruptCycle() {
        setCycle((state) =>
            state.map(cycle => {
                if (cycle.id == activeCycleId) {
                    return {
                        ...cycle, interruptedDate: new Date()
                    }
                } else {
                    return cycle
                }
            }),
        )

        setActiveCycleId(null);
    }

    const currentSeconds = activeCycle ? totalSecond - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    // Quando meus minuntos e segundos alterarem, ajustar contagem na aba de navegação
    useEffect(() => {
        if (activeCycle) {
            document.title = `Ignite Timer - ${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

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
                        disabled={!!activeCycle}
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
                        disabled={!!activeCycle}
                        step={5} // propriedade que permite pular o contator
                        min={5} // valor minímo do contator
                        max={60} // valor máximo do contator
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutes</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>  
                )}
            </form>
        </HomeContainer>
    );
}