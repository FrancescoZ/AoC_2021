import { readFileSync } from "fs";

function readInput(file: string): string[] {
    return readFileSync(file)
        .toString()
        .trim().
        split("\n");
}

function getFinalData(file: string): string[] {
    return readInput(file).reduce((accumulator: string[], input: string) => (accumulator.concat(input.trim().split("|")[1].trim().split(" "))), []);
}

function contains(legend: Record<number, string[]>, num: number, input: string): boolean {
    return legend[num].every((led: string) => (input.includes(led)))
}

function extractIntermediateParts(input: string, legend: Record<number, string[]>): number | undefined {
    if (input.length == 5 && contains(legend, 1, input))
        return 3;
    return undefined;
}
function extractParts(input: string, legend: Record<number, string[]>): number {
    if (input.length == 6 && !contains(legend, 7, input))
        return 6;
    if (input.length == 6 && contains(legend, 3, input))
        return 9;
    if (input.length == 6 && !contains(legend, 3, input))
        return 0;
    if (input.length == 5 && legend[4].filter((led: string) => (input.includes(led))).length == 3)
        return 5;
    if (input.length == 5)
        return 2;
    return -1;
}

function convertNumber(input: string): number | undefined {
    if (input.length === 2) return 1;
    if (input.length === 4) return 4;
    if (input.length === 7) return 8;
    if (input.length === 3) return 7;
    return undefined;
}

function translate(file: string): number {
    let sum = 0;
    const instructions = readInput(file);
    instructions.forEach((instr: string) => {
        const commands = instr.split("|")[0].trim().split(" ");
        const finalCommands = instr.split("|")[1].trim().split(" ");

        const counter: Record<number, string[]> = {};
        const finalCounter: Record<string, number> = {};

        commands.forEach((command) => {
            if (convertNumber(command))
                counter[convertNumber(command) as number] = command.split("");
        });

        commands.forEach((command) => {
            if (extractIntermediateParts(command, counter))
                counter[extractIntermediateParts(command, counter) as number] = command.split("")
        });

        commands.forEach((command) => {
            const key: string = command.split("").sort().join("");
            if (!convertNumber(command) && !extractIntermediateParts(command, counter))
                finalCounter[key] = extractParts(command, counter);
            else
                finalCounter[key] = convertNumber(command) ?
                    convertNumber(command) as number :
                    extractIntermediateParts(command, counter) as number;
        });

        finalCommands.forEach((comand: string, index: number) => {
            sum += finalCounter[comand.split("").sort().join("")] * Math.pow(10, 3-index);
        });

    });
    return sum;
}

function countOccurrences(file: string): number {
    const commands = getFinalData(file);
    return commands.filter((value) => (value.length > 6 || value.length < 5)).length;
}

console.log(countOccurrences("test.txt"));
console.log(countOccurrences("input.txt"));

console.log(translate("test.txt"));
console.log(translate("input.txt"));
