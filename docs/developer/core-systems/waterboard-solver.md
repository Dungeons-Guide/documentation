---
sidebar_position: 1
---

# Waterboard Puzzle Solver

The Waterboard puzzle is arguably one of the most complex in the game. It is not a simple pathfinding problem, but rather a state-space search problem, requiring a precise sequence and timing of actions to manipulate a dynamic system—the flow of water. To solve this, Dungeons Guide uses a sophisticated optimization technique known as **simulated annealing**, with its core logic implemented in native C++ for maximum performance.

## System Components

The solver is broken down into several key classes, each with a distinct responsibility. The `FeatureSolverWaterboard` is the user-facing component that defines the configuration options, allowing players to tune the performance of the underlying algorithm. The `RoomProcessorWaterPuzzle` acts as the central controller, responsible for modeling the puzzle by reading the block data from the world and orchestrating the solving process. It uses a `Simulator` utility class to accurately predict water flow for any given sequence of actions.

The heart of the solver is the `Waterboard` class, which contains the `solve()` method. This method takes the puzzle model from the `RoomProcessor` and passes it to the native C++ library where the computationally expensive simulated annealing algorithm is executed.

## The Simulated Annealing Algorithm (C++ Implementation)

Simulated annealing is a probabilistic technique used to find a good approximation of the global optimum in a large search space. It's inspired by the process of annealing in metallurgy, where a material is heated and then slowly cooled to reduce its defects.

In the context of the Waterboard puzzle, a "solution" is a list of `Waterboard.Action` objects, where each action consists of flipping a specific lever and then waiting for a certain number of ticks. The "energy" or "cost" of a solution is a measure of how far the resulting water flow is from the target flow required to open the doors.

The algorithm begins with a random sequence of actions and then iteratively makes small, random modifications. If a change results in a better solution (lower energy), it is always accepted. However, if a change results in a *worse* solution, it might still be accepted based on a "temperature" parameter. This is the key to the algorithm's power. By allowing occasional "bad" moves, especially at a high initial temperature, the solver can avoid getting stuck in "local optima" (good-but-not-the-best solutions) and explore a much wider range of possibilities. As the algorithm runs, the temperature is slowly lowered, causing it to become more "greedy" and eventually settle on a very low-energy, high-quality solution.

This entire computationally intensive process is handled by a native C++ library (loaded via `NativeLoader.extractLibraryAndLoad("waterboard")`) to ensure it doesn't impact game performance. The final, optimized sequence of actions is then returned to the `RoomProcessorWaterPuzzle`, which renders it as a series of clear, timed instructions for the player.