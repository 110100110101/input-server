import { GBAInput } from "./GBAInput";

class InputTally {

    private inputs = new Map<GBAInput, number>()

    tallyInput(talliedInput: GBAInput) {
        
        let currentTally = this.inputs.get(talliedInput)
        let newTally: number

        if (currentTally === undefined) {
            newTally = 1
        }
        else {
            newTally = currentTally + 1
        }

        this.inputs.set(talliedInput, newTally)
    }

    reset() {
        this.inputs.clear()
    }

    winner(): GBAInput | null {

        let winningInput: GBAInput | null = null
        let winningInputTally: number = 0

        this.inputs.forEach((value: number, key: GBAInput) => {

            if (value >= winningInputTally) {
                winningInput = key
                winningInputTally = value
            }
        })

        return winningInput
    }
}

export { InputTally }