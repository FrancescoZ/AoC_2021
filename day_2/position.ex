defmodule Position do
  def read_input() do
    {:ok, file} = File.read("input.txt")

    file
    |> String.split("\n", trim: true)
    |> Enum.map(fn x ->
      [command, move] = String.split(x, " ", trim: true)
      {num, ""} = Integer.parse(move)
      [command, num]
    end)
  end

  def calculate(["forward", x]), do: {0, x}
  def calculate(["up", x]), do: {-x, 0}
  def calculate(["down", x]), do: {x, 0}

  def move() do
    input = read_input()

    {depth, x} =
      input
      |> Enum.reduce({0, 0}, fn command, {depth, x} ->
        {move_depth, move_x} = calculate(command)
        {depth + move_depth, x + move_x}
      end)

    depth * x
  end

  def complex_move() do
    input = read_input()

    {depth, x, _aim} =
      input
      |> Enum.reduce({0, 0, 0}, fn command, {depth, x, aim} ->
        {move_aim, move_x} = calculate(command)

        cond do
          move_x == 0 -> {depth, x + move_x, aim + move_aim}
          move_x > 0 -> {depth + (move_x * aim), x + move_x, aim}
        end
      end)

    depth * x
  end
end

IO.puts("Calculated position: #{Position.move()}")
IO.puts("Calculated complex position: #{Position.complex_move()}")
