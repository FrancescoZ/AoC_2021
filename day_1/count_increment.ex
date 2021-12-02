defmodule Increments do
  def read_input() do
    {:ok, file} = File.read("input.txt")

    file
    |> String.split("\n", trim: true)
    |> Enum.map(fn x ->
      {n, ""} = Integer.parse(x)
      n
    end)
  end

  defp counts(input) do
    {increments, _last} =
      input
      |> Enum.reduce(
        {0, Enum.at(input, 0)},
        fn
          x, {inc, prev} when x <= prev ->
            {inc, x}

          x, {inc, _prev} ->
            {inc + 1, x}
        end
      )

    increments
  end

  defp create_windows(list, result \\ [])

  defp create_windows([one, two, three], result), do: result ++ [one + two + three]

  defp create_windows([one, two, three | tail], result),
    do: create_windows([two, three | tail], result ++ [one + two + three])

  def count_windows(), do: read_input() |> create_windows() |> counts
  def count(), do: read_input() |> counts()
end

IO.puts("Number of increments in the inputs: #{Increments.count()}")
IO.puts("Number of windows increments in the inputs: #{Increments.count_windows()}")
