import { readFileSync } from "fs";

class LanternFish {
    start: number;
    current: number;
    constructor(timer: number) {
        this.start = timer;
        this.current = timer;
    }
    grow(days: number): LanternFish | undefined {
        let fish: LanternFish | undefined = undefined
        const newCurrent = this.current - days;
        if (newCurrent >= 0)
            this.current = newCurrent;
        else {
            this.current = 6
            fish = new LanternFish(this.current + 2);
        }
        return fish
    }
    public toString(): string { return `${this.current},` }
}


function readInput(file: string): string {
    return readFileSync(file)
        .toString()
        .trim()
}

function getData(file: string): LanternFish[] {
    return readInput(file).split(",").map((lanternFish: string) => {
        const timer = parseInt(lanternFish)
        return new LanternFish(timer)
    });
}

function acquariumGrowth(file: string, days: number): LanternFish[] {
    let fishes: LanternFish[] = getData(file);
    for (let day = 1; day <= days; day += 1) {
        const newFishes = fishes
            .map((lanternFish: LanternFish) => (lanternFish.grow(1)))
            .filter((fish): fish is LanternFish => !!fish);
        fishes = fishes.concat(newFishes);
    }
    return fishes;
}

function getFishByAge(arr: LanternFish[]): number[] {
    const byAge = [];
    for (let i = 0; i < 9; i++) {
        byAge.push(arr.filter((fish) => fish.start === i).length || 0);
    }
    return byAge;
};

function optimizedAquariumGrowth(file: string, days: number): number {
    const fishes = getData(file);
    let countAges = getFishByAge(fishes);
    for (let day: number = 0; day <days; day++) {
        const amountZero = countAges[0];
        countAges.forEach((count: number, index: number) => {
            if (index === 0) return;
            if (index === 7) countAges[index - 1] = countAges[index] + amountZero;
            else countAges[index-1] = count;
        });
        countAges[countAges.length-1] = amountZero;
    }
    return countAges.reduce((prev: number, current: number) => (prev+current), 0);
}

console.log(acquariumGrowth("test.txt", 80).length);
console.log(acquariumGrowth("input.txt", 80).length);
console.log(optimizedAquariumGrowth("test.txt", 256));
console.log(optimizedAquariumGrowth("input.txt", 256));
