import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../context/CyclesContext";

export function NewCycleForm() {
    const { activeCycle, } = useContext(CyclesContext)
    const { register } = useFormContext()

    return (
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
    )
}