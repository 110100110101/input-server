import express, { Request, Response } from "express";
import { CronJob } from "cron";
import { getActiveWindow, keyboard, Key, KeyboardClass, providerRegistry} from "../node_modules/@nut-tree/nut-js/dist/index.js"
import { GBAInput } from "./GBAInput.js";
import { InputTally } from "./InputTally.js";

let tally = new InputTally()

let cronJob = new CronJob("*/3 * * * * *", async () => {

    let preferredInput = tally.winner()

    if (preferredInput != null) {

        console.log("Winner: %s", preferredInput)

        let activeWindow = await getActiveWindow()
        let activeWindowTitle = await activeWindow.title
        if (activeWindowTitle.includes("mGBA")) {
    
            console.log("Found preferred window!")

            let keyboardObject = new KeyboardClass(providerRegistry)
            keyboardObject.config.autoDelayMs = 10

            switch (preferredInput) {
                case GBAInput.Up:
                    await keyboardObject.pressKey(Key.Up)
                    await keyboardObject.releaseKey(Key.Up)
                    break
                case GBAInput.Down:
                    await keyboardObject.pressKey(Key.Down)
                    await keyboardObject.releaseKey(Key.Down)
                    break
                case GBAInput.Left:
                    await keyboardObject.pressKey(Key.Left)
                    await keyboardObject.releaseKey(Key.Left)
                    break
                case GBAInput.Right:
                    await keyboardObject.pressKey(Key.Right)
                    await keyboardObject.releaseKey(Key.Right)
                    break
                case GBAInput.A:
                    await keyboardObject.pressKey(Key.X)
                    await keyboardObject.releaseKey(Key.X)
                    break
                case GBAInput.B:
                    await keyboardObject.pressKey(Key.Z)
                    await keyboardObject.releaseKey(Key.Z)
                    break
                case GBAInput.L:
                    await keyboardObject.pressKey(Key.A)
                    await keyboardObject.releaseKey(Key.A)
                    break
                case GBAInput.R:
                    await keyboardObject.pressKey(Key.S)
                    await keyboardObject.releaseKey(Key.S)
                    break
                case GBAInput.Start:
                    await keyboardObject.pressKey(Key.W)
                    await keyboardObject.releaseKey(Key.W)
                    break
                case GBAInput.Select:
                    await keyboardObject.pressKey(Key.Q)
                    await keyboardObject.releaseKey(Key.Q)
                    break
            }
        }
        else {
            console.log("No preferred window found!")
        }
    }
    else {
        console.log("No winner!")
    }

    console.log("Resetting tally")
    tally.reset()
})

let app = express()
app.use(express.json())

app.post("/input", (request: Request, response: Response) => {

    let parsedInput = request.body["input"]
    if (parsedInput === null || parsedInput === undefined) {
        response.sendStatus(400)
    }
    else {

        let capturedGBAInput = (parsedInput as string).toUpperCase() as GBAInput
        if (capturedGBAInput === undefined) {
            response.sendStatus(400)
        }

        tally.tallyInput(capturedGBAInput)
        response.sendStatus(200)
    }
})

app.listen(1337, () => {
    console.log("Starting input-server")
    cronJob.start()
})
