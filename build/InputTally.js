class InputTally {
    constructor() {
        this.inputs = new Map();
    }
    tallyInput(talliedInput) {
        let currentTally = this.inputs.get(talliedInput);
        let newTally;
        if (currentTally === undefined) {
            newTally = 1;
        }
        else {
            newTally = currentTally + 1;
        }
        this.inputs.set(talliedInput, newTally);
    }
    reset() {
        this.inputs.clear();
    }
    winner() {
        let winningInput = null;
        let winningInputTally = 0;
        this.inputs.forEach((value, key) => {
            if (value >= winningInputTally) {
                winningInput = key;
                winningInputTally = value;
            }
        });
        return winningInput;
    }
}
export { InputTally };
