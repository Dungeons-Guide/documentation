---
sidebar_position: 8
---

# Waterboard Solver

The Waterboard puzzle is arguably one of the most complex in the game, requiring a precise sequence of lever flips to achieve the correct water flow. The Dungeons Guide Waterboard Solver is an advanced tool that calculates a one-flow solution for you, displaying the exact levers to flip and the timing required. This eliminates the need for complex manual calculations and trial-and-error, saving a significant amount of time and effort.

## Configuration

The Waterboard Solver offers a range of configuration options, from simple quality-of-life toggles to advanced hyperparameters for the underlying simulated annealing algorithm.

### Block wrong clicks
This is a simple but powerful quality-of-life feature. When enabled, the mod will physically prevent you from clicking on a lever that is not part of the calculated solution, making it impossible to make a mistake and mess up the puzzle.

### Lever flip waits
This setting controls the minimum time the solver will enforce between lever flips, measured in "water ticks" (where 4 ticks equal 1 second). The default is 6 ticks (1.5 seconds). You can adjust this value based on your own comfort and speed.

### Advanced Solver Settings
The following settings are for advanced users who wish to fine-tune the performance of the simulated annealing algorithm that solves the puzzle. Modifying these can change the trade-off between the speed at which a solution is found and the efficiency of the solution itself.

-   **Temperature Multiplier:** This value (between 0 and 1) controls how quickly the algorithm "cools down." A value closer to 1 will cause the solver to take longer, but it will be more likely to find a faster, more optimal solution. A value closer to 0 will find a solution very quickly, but that solution may involve more steps.

-   **Temperature Target:** This is the temperature at which the algorithm will stop searching. A higher value will cause the solver to stop sooner, potentially with a slower solution, while a lower value will make it search longer for a faster solution.

-   **Iteration Target:** This is a fallback mechanism. If the solver does not find a better solution after this many iterations, it will stop and return the best solution it has found so far.

-   **Maximum amount of 1-water-tick passes:** This advanced setting controls the number of "no-op" actions the solver can consider. A higher value allows it to find slower, more complex solutions if no fast solution exists, but it will increase the calculation time.

-   **Maximum amount of lever flips per each lever type:** This sets a limit on how many times the solver can use each type of lever in its proposed solution. A higher value allows for more complex solutions at the cost of longer calculation times.