import heapq
from collections import defaultdict

def get_data(input_file):
    return [[int(y) for y in x] for x in open(input_file).read().strip().split("\n")]

def exit_paths(data,possibilities):
    size_y, size_x = len(data), len(data[0])
    rows, cols = size_y * possibilities, size_x * possibilities
    costs = defaultdict(int)

    pqueue = [(0, 0, 0)]
    heapq.heapify(pqueue)
    visited = set()
    while len(pqueue) > 0:
        cost, row, col = heapq.heappop(pqueue)
        if (row, col) in visited:
            continue
        visited.add((row, col))
        costs[(row, col)] = cost
        if row == rows - 1 and col == cols - 1:
            break

        for mv_y, mv_x in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            new_row = row + mv_y
            new_col = col + mv_x
            if not (0 <= new_row < rows and 0 <= new_col < cols):
                continue

            new_cost = (
                (
                    data[new_row % size_y][new_col % size_x]
                    + (new_row // size_y)
                    + (new_col // size_x)
                )
                - 1
            ) % 9 + 1
            heapq.heappush(pqueue, (cost + new_cost, new_row, new_col))
    return costs[(rows - 1, cols - 1)]

def best_escape_path(file_name):
    data = get_data(file_name)
    risk = exit_paths(data,1)
    print(f"The lowest risk is: {risk}")
    return risk

def complete_path(file_name):
    data = get_data(file_name)
    risk = exit_paths(data,5)
    print(f"The complete lowest risk is: {risk}")
    return risk

assert best_escape_path("test.txt")==40
best_escape_path("input.txt")
assert complete_path("test.txt")==315
complete_path("input.txt")
