var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { CronJob } from "cron";
import { getActiveWindow, Key, KeyboardClass, providerRegistry } from "../node_modules/@nut-tree/nut-js/dist/index.js";
import { GBAInput } from "./GBAInput.js";
import { InputTally } from "./InputTally.js";
let tally = new InputTally();
let cronJob = new CronJob("*/3 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    let preferredInput = tally.winner();
    if (preferredInput != null) {
        console.log("Winner: %s", preferredInput);
        let activeWindow = yield getActiveWindow();
        let activeWindowTitle = yield activeWindow.title;
        if (activeWindowTitle.includes("mGBA")) {
            console.log("Found preferred window!");
            let keyboardObject = new KeyboardClass(providerRegistry);
            keyboardObject.config.autoDelayMs = 10;
            switch (preferredInput) {
                case GBAInput.Up:
                    yield keyboardObject.pressKey(Key.Up);
                    yield keyboardObject.releaseKey(Key.Up);
                    break;
                case GBAInput.Down:
                    yield keyboardObject.pressKey(Key.Down);
                    yield keyboardObject.releaseKey(Key.Down);
                    break;
                case GBAInput.Left:
                    yield keyboardObject.pressKey(Key.Left);
                    yield keyboardObject.releaseKey(Key.Left);
                    break;
                case GBAInput.Right:
                    yield keyboardObject.pressKey(Key.Right);
                    yield keyboardObject.releaseKey(Key.Right);
                    break;
                case GBAInput.A:
                    yield keyboardObject.pressKey(Key.X);
                    yield keyboardObject.releaseKey(Key.X);
                    break;
                case GBAInput.B:
                    yield keyboardObject.pressKey(Key.Z);
                    yield keyboardObject.releaseKey(Key.Z);
                    break;
                case GBAInput.L:
                    yield keyboardObject.pressKey(Key.A);
                    yield keyboardObject.releaseKey(Key.A);
                    break;
                case GBAInput.R:
                    yield keyboardObject.pressKey(Key.S);
                    yield keyboardObject.releaseKey(Key.S);
                    break;
                case GBAInput.Start:
                    yield keyboardObject.pressKey(Key.W);
                    yield keyboardObject.releaseKey(Key.W);
                    break;
                case GBAInput.Select:
                    yield keyboardObject.pressKey(Key.Q);
                    yield keyboardObject.releaseKey(Key.Q);
                    break;
            }
        }
        else {
            console.log("No preferred window found!");
        }
    }
    else {
        console.log("No winner!");
    }
    console.log("Resetting tally");
    tally.reset();
}));
let app = express();
app.use(express.json());
app.post("/input", (request, response) => {
    let parsedInput = request.body["input"];
    if (parsedInput === null || parsedInput === undefined) {
        response.sendStatus(400);
    }
    else {
        let capturedGBAInput = parsedInput.toUpperCase();
        if (capturedGBAInput === undefined) {
            response.sendStatus(400);
        }
        tally.tallyInput(capturedGBAInput);
        response.sendStatus(200);
    }
});
app.listen(1337, () => {
    console.log("Starting input-server");
    cronJob.start();
});
