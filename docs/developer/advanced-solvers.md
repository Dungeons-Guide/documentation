---
sidebar_position: 3
---

# Advanced Solver Architectures

Dungeons Guide employs several sophisticated algorithms to solve the most complex puzzles and optimization problems in dungeons. This document provides a high-level overview of the two main advanced solver architectures. For a deeper, more technical dive into each component, please see the detailed pages in the **[Core Systems](./core-systems/waterboard-solver.md)** section.

## 1. Waterboard Puzzle Solver

The Waterboard puzzle is a complex state-space search problem. The mod solves this by using a **simulated annealing** algorithm, which is implemented in native C++ for maximum performance. This probabilistic technique allows the solver to efficiently search the vast space of possible lever flips and timings to find a high-quality solution.

-   **[Read the detailed Waterboard Solver documentation...](./core-systems/waterboard-solver.md)**

## 2. Secret Route Pathfinder

The "Secret Finder" feature is a powerful route optimization engine that calculates the most efficient path to collect all secrets and complete all necessary tasks within a room. This system is built on several interconnected components.

-   **The ActionDAG:** The entire problem of clearing a room is first modeled as a **D**irected **A**cyclic **G**raph of all necessary actions and their dependencies. This allows the system to understand complex prerequisites, such as needing to flip a lever to unlock a secret.
    -   **[Read the detailed ActionDAG documentation...](./core-systems/action-dag.md)**

-   **The TSP Solver:** Finding the best path through the ActionDAG is a **T**raveling **S**alesperson **P**roblem. The mod uses a multi-stage solver, with its core logic implemented in native C++ for performance, to find the most efficient route.
    -   **[Read the detailed TSP Solver documentation...](./core-systems/tsp-solver.md)**

-   **Pre-calculation and Caching:** To ensure the TSP solver can run in real-time without causing lag, all pathfinding costs are calculated offline by developers and consolidated into a single cache file for each room. At runtime, the solver reads from this in-memory cache for instant results.
    -   **[Read the detailed Pre-calculation and Caching documentation...](./core-systems/pre-calculation.md)**

-   **Code Example:** To see how these systems are tied together by a trigger feature, refer to the Smart Route example.
    -   **[Read the Smart Route Example...](./core-systems/smart-route-example.md)**