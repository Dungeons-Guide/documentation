---
sidebar_position: 3
---

# The ActionDAG: Modeling Complex Tasks

The core of the Secret Finder and other complex route-planning features is the **ActionDAG**, a **D**irected **A**cyclic **G**raph of actions. This data structure provides a powerful and flexible way to represent all the possible tasks and their dependencies required to clear a dungeon room. Instead of a simple list of locations, the ActionDAG models the entire problem as a graph, which can then be solved to find the most efficient solution.

## A Recursive Construction Process

The power of the system lies in how the `ActionDAG` is constructed. The logic is not centralized in a single, monolithic class; it is **distributed throughout the `AbstractAction` subclasses themselves** in an elegant, recursive process.

The process begins when a feature requests a path to achieve a high-level goal, such as getting a specific secret. This creates an `ActionRoute`, which in turn instantiates an `ActionDAGBuilder` and calls its `requires()` method with a high-level action, for example: `requires(new ActionChangeState("secret_chest_1", "found"))`.

This is where the recursion starts. The builder adds this top-level `ActionChangeState` node to the graph and then calls the `buildActionDAG()` method on the node it just added. The `ActionChangeState` class's implementation of this method knows what it means to "find" a chest: you must first move to it, and then click on it. It then uses the builder it was passed to add its own, lower-level dependencies, such as `builder.requires(new ActionMove(...))` and `builder.requires(new ActionClick(...))`. This process continues, with each action being responsible for defining its own prerequisites, until it reaches "atomic" actions like `ActionMove`, whose `buildActionDAG()` methods are empty, which terminates that branch of the recursion.

## Modeling Choices: The Three Connection Types

The `ActionDAGBuilder` supports three distinct ways to define the relationship between a parent node and its prerequisites, giving it incredible flexibility.

The most common connection is made with the **`requires()`** method, which creates a standard "AND" dependency. This is a list of nodes that must all be completed before the current node can be executed.

To model choices, the builder uses the **`or()`** method. This creates a list of nodes where **exactly one** of them must be completed. This is perfect for situations where a goal can be achieved in multiple ways, such as opening a door by either flipping a lever or using a superboom. The solver can then evaluate both options and choose the most efficient one.

Finally, the **`optional()`** method is used for conditional dependencies. This creates a list of nodes that may or may not be required. This is useful for modeling shortcuts or alternative strategies. For example, a path to a secret might be faster if an optional lever is flipped first, but the secret is still obtainable without it. The solver can then decide if the time saved by taking the shortcut is worth the time spent on the optional action.

## Resolving Possibilities: The `dagId`

These `or` and `optional` connections mean that a single ActionDAG can represent thousands, or even millions, of possible valid routes. To manage this complexity, the system uses a `dagId`—a single integer that acts as a compact, **bit-masked representation of a specific path** through the graph.

The `ActionDAGNode` class contains methods that use bitwise arithmetic on the `dagId` to resolve all the choices in the graph. Different bits in the `dagId` determine which path to take at each `or` connection and which of the `optional` dependencies to include. By iterating through all possible `dagId` values, the **[TSP Solver](./tsp-solver.md)** can effectively evaluate every single unique, valid path through the graph to find the one with the lowest total cost. This elegant solution allows the mod to model incredibly complex, non-linear tasks and then systematically find the single most efficient solution.