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


function flash(energyMatrix: number[][], row: number, col: number){
    if (row >= energyMatrix.length) return;
    if (row < 0) return;
    if (col < 0) return;
    if (col >= energyMatrix[row].length) return;
    if (energyMatrix[row][col] < 0) return;
    if (energyMatrix[row][col]<9) {
        energyMatrix[row][col]++;
        return;
    }
    energyMatrix[row][col]=-1;
    flash(energyMatrix, row-1,col-1)
        flash(energyMatrix, row-1,col)
        flash(energyMatrix, row-1,col+1)
        flash(energyMatrix, row,col-1)
        flash(energyMatrix, row,col+1)
        flash(energyMatrix, row+1,col-1)
        flash(energyMatrix, row+1,col)
        flash(energyMatrix, row+1,col+1)
}

function oneStep(energyMatrix: number[][]): number{
    let flashes = 0;
    for (let row=0; row< energyMatrix.length; row++)
        for (let col=0; col< energyMatrix[row].length; col++)
            energyMatrix[row][col]++;
    
    for (let row=0; row< energyMatrix.length; row++)
        for (let col=0; col< energyMatrix[row].length; col++)
            if (energyMatrix[row][col]>9) flash(energyMatrix, row, col)

    for (let row=0; row< energyMatrix.length; row++)
        for (let col=0; col< energyMatrix[row].length; col++)
            if (energyMatrix[row][col]<0) {
                energyMatrix[row][col]=0;
                flashes++;
            }
    return flashes;
}

function steps(energyMatrix: number[][],endStep: number): number{
    let flashes:number = 0;
    for (let step:number = 1; step<=endStep; step++){
        flashes += oneStep(energyMatrix);
    }
    return flashes;
}

function synchStep(energyMatrix: number[][]): number{
    let step:number = 0;
    while (oneStep(energyMatrix) != energyMatrix.length*energyMatrix[0].length){
        step++;
    }
    return step+101;
}




const matrix = getData("test.txt");
const inputMatrix = getData("input.txt");
console.log(steps(matrix, 100));
console.log(steps(inputMatrix, 100));

console.log(synchStep(matrix));
console.log(synchStep(inputMatrix));
