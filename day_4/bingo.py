import numpy as np

# Return input data as list of arrays for each binary number in input
def get_data(filename):
    inputs = open(filename).read().splitlines()
    inputs.reverse()
    extracted = np.fromstring(inputs.pop(), sep=',', dtype=int)
    inputs.pop()
    tables = []
    table = []
    for row in inputs:
        if row == '':
            tables.append(np.matrix(table))
            table=[]
        else:
            table.append(np.fromstring(row, sep=' ', dtype=float))
    return extracted, tables

def extract_number(number, tables):
    for table in tables:
        table[table==number] = -1
    return tables

def check_winning_card(tables):
    winners = []
    for index, table in enumerate(tables):
        if -5 in table.sum(axis=0):
            winners.append((table, index))
        elif -5 in table.sum(axis=1):
            winners.append((table, index))
    return winners

def calculate_score(table, extracted):
    table[table==-1] = 0
    return table.sum()*extracted


def play():
    extracteds, tables = get_data("input.txt")
    results = []
    for number in extracteds:
        tables = extract_number(number, tables)
        winners = check_winning_card(tables) 
        if winners:
            score = -1
            for removed, (winner, index) in enumerate(winners):
                temp_score = calculate_score(winner, number)
                if temp_score> score:
                    score = temp_score
                tables.pop(index-removed)
            results.append(score)
            winners = []
    return results

if __name__ == '__main__':
    games = play()
    score = games[0]
    last_score = games[-1]
    print(f'First winning score: {score}')
    print(f'Last winning score: {last_score}')
