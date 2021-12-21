from collections import Counter
import sys
import string

def readInput(file_name):
    lines = [line.strip() for line in open(file_name, 'r').readlines()]
    starter = lines[0]
    rules = [rule.split(' ') for rule in lines[2:]]
    rules = {a: (a[0]+c,c+a[1]) for a,b,c in rules}
    return starter, rules

def step(counter, rules):
    new_counter = {key : 0 for key in rules.keys()}
    for key, value in counter.items():
        new_counter[rules[key][0]] += value
        new_counter[rules[key][1]] += value
    return new_counter

def create_polymer(formula, rules, steps):
    pairs = [''.join(p) for p in zip(formula, formula[1:])]
    counter = Counter(pairs)
    for s in range(steps):
        counter = step(counter, rules)
    return counter

def count(starter,counter):
    letterTotals = {letter : 0 for letter in list(string.ascii_uppercase)}
    for key, value in counter.items():
        letterTotals[key[0]] += value

    # the last character in the template gets another count
    letterTotals[starter[-1]] += 1

    lmax = max(letterTotals.values())
    lmin = min([value for value in letterTotals.values() if value > 0])
    return lmax - lmin

def calculate_polymer_value(file_input, steps):
    formula, rules = readInput(file_input)
    value = count(formula, create_polymer(formula, rules,steps))
    print(f"The PL value after {steps} steps is: {value}")
    return value

assert calculate_polymer_value("test.txt",10) == 1588
calculate_polymer_value("input.txt", 10)

assert calculate_polymer_value("test.txt",40)== 2188189693529
calculate_polymer_value("input.txt",40)
