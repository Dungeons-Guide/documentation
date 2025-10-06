---
sidebar_position: 4
---

# The TSP Solver: Finding the Optimal Route

Once the **[ActionDAG](./action-dag.md)** has been constructed, it represents every possible valid way to complete a room. The next challenge is to find the single most efficient path through this graph. This is a classic computer science challenge known as the **T**raveling **S**alesperson **P**roblem (TSP). Dungeons Guide uses a sophisticated, multi-stage TSP solver to find the optimal route with maximum performance. The `ActionRoute` class is responsible for orchestrating this entire solving process.

In the context of the mod, the "cities" that must be "visited" are the nodes of the ActionDAG—the individual tasks like moving to a location or clicking a lever. The "distance" or "cost" between two of these actions is the time it takes a player to travel from the location of the first action to the location of the second. This cost is determined by a fast A* pathfinding lookup, made nearly instantaneous by the **[Pre-calculation and Caching](./pre-calculation.md)** system.

## The Primary Solver: `DPTSP` (C++ Implementation)

The first tool the mod reaches for is the `DPTSP` class, a highly efficient solver based on the **Dynamic Programming** approach to the Traveling Salesperson Problem, also known as the Held-Karp algorithm.

-   **Native Performance:** To achieve the absolute best performance, the core logic of the `DPTSP` solver is implemented in **C++** and loaded into the game via a native library (`dptsp.dll` or `dptsp.so`). The `DPTSP.java` class acts as a wrapper, preparing the data from the `ActionDAG` and passing it to the high-performance native code through the Java Native Interface (JNI). This is confirmed by the `native` methods (`startCoroutine`, `resumeCoroutine`, etc.) found within the class.

-   **Advantages:**
    -   **Guaranteed Optimality:** The DPTSP algorithm is guaranteed to find the absolute best, most efficient route.
    -   **Efficiency:** While its complexity is exponential (`O(n² * 2^n)`), the native C++ implementation is vastly more efficient than a Java equivalent and is capable of solving the vast majority of dungeon rooms in milliseconds.

-   **Usage:** The `ActionRoute` class first attempts to solve the `ActionDAG` using this native `DPTSP` solver. In most cases, this is successful and provides the final, optimal route.

## The Fallback Solver: `TravelingSalesman`

In rare cases, a room may be so extraordinarily complex that even the native `DPTSP` solver could take too long. To handle these edge cases without freezing the game, the system gracefully falls back to the `TravelingSalesman` class, which has its own two-stage approach.

The `ActionRoute` detects when a problem is too large by doing a preliminary check on the number of possible paths in the DAG. If it exceeds a certain threshold, it skips the `DPTSP` and uses this fallback instead.

1.  **Bruteforce Mode:** For problems that are too large for `DPTSP` but still have a manageable number of permutations, the `TravelingSalesman` solver will use a **bruteforce** method. It will systematically check every single valid path through the DAG to find the best one.

2.  **Simulated Annealing Mode:** For the most complex rooms imaginable, where even the bruteforce fallback would be too slow, the solver switches to a **simulated annealing** algorithm. This probabilistic method finds a near-optimal solution in a fraction of the time, prioritizing a smooth user experience over guaranteed mathematical perfection in these extreme edge cases.

## Summary

This multi-layered solver architecture provides the best of all worlds:

-   For the vast majority of rooms, the native `DPTSP` solver delivers a **perfectly optimal route** in milliseconds.
-   For the rare, highly complex rooms, the system automatically falls back to a slower but still optimal `bruteforce` method.
-   For the most extreme edge cases, it uses `simulated annealing` to prevent any lag, ensuring a smooth user experience while still providing an excellent, high-quality route.