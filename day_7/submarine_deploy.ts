import { readFileSync } from "fs";

function readInput(file: string): string {
    return readFileSync(file)
        .toString()
        .trim();
}

function getData(file: string): CrabMarine[] {
    return readInput(file).split(",").map((lanternFish: string) => {
        const position = parseInt(lanternFish);
        return new CrabMarine(position);
    });
}

class CrabMarine {
    position: number;
    constructor(position: number) {
        this.position = position
    }

    fuelCost(newPosition: number): number {
        return this.position < newPosition ? newPosition - this.position : this.position - newPosition;
    }

    accurateFuelCost(newPosition: number): number {
        const array = [...Array(this.fuelCost(newPosition)+1).keys()]
        const cost = array.reduce((sum: number, cost: number) => (sum + cost), 0);
        return cost;
    }
}

function minimumFuelCost(input: string): number {
    const positions: number[] = [];
    const submarine: CrabMarine[] = getData(input);
    const maxPosition = submarine.reduce((prev: number, current: CrabMarine) => (prev > current.position ? prev : current.position), 0);
    for (let i: number = 0; i < maxPosition; i++) {
        positions.push(submarine.reduce((prev: number, current: CrabMarine) => (prev + current.fuelCost(i)), 0));
    }
    return positions.reduce((min: number, current: number) => (min > current ? current : min), Number.MAX_SAFE_INTEGER);
}

function specialFuelCost(input: string): number {
    const positions: number[] = [];
    const submarine: CrabMarine[] = getData(input);
    const maxPosition = submarine.reduce((prev: number, current: CrabMarine) => (prev > current.position ? prev : current.position), 0);
    for (let i: number = 0; i < maxPosition; i++)
        positions.push(submarine.reduce((prev: number, current: CrabMarine) => (prev + current.accurateFuelCost(i)), 0));
    return positions.reduce((min: number, current: number) => (min > current ? current : min), Number.MAX_SAFE_INTEGER);
}


console.log(minimumFuelCost("test.txt"));
console.log(minimumFuelCost("input.txt"));
console.log(specialFuelCost("test.txt"));
console.log(specialFuelCost("input.txt"));
