import numpy as np

def readInput(file_name):
    data = []
    fold = []
    with open(file_name) as f:
        for line in f:
            if line == "\n":
                break
            else:
                data.append(tuple(map(int, line.split(','))))

        for line in f:
            step = line.replace("fold along ", "")
            if (step.startswith("x=")):
                fold.append(("x", int(step.replace("x=",""))))
            else:
                fold.append(("y", int(step.replace("y=",""))))
    return data, fold

def getDimention(data):
    max_x = 0
    max_y = 0
    for (x,y) in data:
        if x > max_x:
            max_x = x
        if y > max_y:
            max_y = y
    return max_y+1, max_x+1

def createInput(data):
    matrix = np.zeros(getDimention(data))
    for (x, y) in data:
        matrix[y][x] = 1
    return matrix

def fold(matrix,fold_instruction):
    (axis, splitNum) = fold_instruction
    data = np.delete(matrix, splitNum, 0 if axis == "y" else 1)
    [B,C] = np.array_split(data, 2) if axis == "y" else np.hsplit(data,2)
    return B+np.flip(C, 0 if axis == "y" else 1)

def count_points(matrix):
    return (matrix>0).sum()

def first_fold(input_file):
    data, folds = readInput(input_file)
    matrix =createInput(data)
    first= fold(matrix, folds[0])
    count = count_points(first)
    print(f'After the first fold we have: {count}')
    return count

def code(input_file):
    data, folds = readInput(input_file)
    matrix =createInput(data)
    folded = matrix
    for f in folds:
        folded = fold(folded, f)

    for row in folded:
        s = ""
        for el in row:
            if el > 0:
                s +="#"
            else:
                s += " "
        print(s)

assert first_fold("test.txt") == 17
first_fold("input.txt")
code("test.txt")
code("input.txt")
