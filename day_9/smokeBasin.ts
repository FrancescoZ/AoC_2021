import { readFileSync } from "fs";

function readInput(file: string): string[] {
    return readFileSync(file)
        .toString()
        .trim().
        split("\n");
}

function getData(file: string): number[][] {
    return readInput(file)
        .map((line: string) =>
        (line.split("").map((num: string) =>
            (parseInt(num)))));
}

function findRiskLevels(file: string): [number, number] {
    const input = getData(file);
    const seen = getData(file);
    const riskPoint: number[] = [];
    let basins: number[] = [];
    for (let row = 0; row < input.length; row++)
        for (let col = 0; col < input[row].length; col++) {
            let high: number, right: number, low: number, left: number;

            if (row == 0) high = Number.MAX_VALUE;
            else high = input[row - 1][col]

            if (row + 1 == input.length) low = Number.MAX_VALUE;
            else low = input[row + 1][col]

            if (col == 0) left = Number.MAX_VALUE;
            else left = input[row][col - 1];

            if (col + 1 == input[row].length) right = Number.MAX_VALUE;
            else right = input[row][col + 1]

            const current = input[row][col];
            if (current < high && current < right && current < left && current < low) {
                riskPoint.push(current + 1);
                basins.push(findBasin(row, col, input, seen));
                            }
        }
    console.log(riskPoint.reduce((sum: number, current: number) => (sum + current), 0));
    console.log(basins.sort((a:number, b:number) => (b-a)).splice(0,3).reduce((accumulator: number, current: number) => (accumulator * current), 1));

    return [
        riskPoint.reduce((sum: number, current: number) => (sum + current), 0),
        basins.sort((a:number, b:number) => (b-a)).splice(0,3)
            .reduce((accumulator: number, current: number) => (accumulator * current), 1)
    ];
}

function findBasin(row: number, col: number, input: number[][], seen: number[][], size: number = 1, blocked: string = ""): number {
    if (row < 0) return 0;
    if (row == input.length) return 0
    if (col < 0) return 0
    if (col == input[row].length) return 0;
    if (seen[row][col] == -1) return 0;
    if (input[row][col] == 9) return 0;
    seen[row][col] = -1;
    return size + (blocked != "r" ? findBasin(row + 1, col, input, seen, 1, "l") : 0) +
        (blocked != "l" ? findBasin(row - 1, col, input,seen, 1, "r") : 0) +
        (blocked != "u" ? findBasin(row, col + 1, input,seen, 1, "d") : 0) +
        (blocked != "d" ? findBasin(row, col - 1, input,seen, 1, "u") : 0);
}

findRiskLevels("test.txt");
findRiskLevels("input.txt");


