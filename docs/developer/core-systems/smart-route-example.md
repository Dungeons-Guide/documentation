---
sidebar_position: 6
---

# Example: The Smart Route Trigger

To see how the core systems work together, let's examine the `FeatureSmartRoute` trigger. This feature is responsible for creating a single, optimized route that visits all unfound secrets and unobtained keys in a room.

## The `createSmartRoute` Method

This method is the heart of the feature. It is called when the player enters a new room or presses the "Smart Route" keybind.

```java
// Simplified from FeatureSmartRoute.java

public void createSmartRoute(DungeonRoom dungeonRoom, RoomRouteHandler roomRouteHandler) {
    // 1. Get the current algorithm settings
    AlgorithmSetting algorithmSetting = roomRouteHandler.getAlgorithmSetting();

    // 2. Create a new DAG Builder for the current room
    ActionDAGBuilder actionDAGBuilder = new ActionDAGBuilder(dungeonRoom);

    // 3. Iterate through all mechanics in the room
    for (Map.Entry<String, DungeonMechanicState> value : dungeonRoom.getMechanics().entrySet()) {

        // 4. If the mechanic is an unfound secret...
        if (value.getValue() instanceof ISecret && !((ISecret) value.getValue()).isFound(dungeonRoom)) {
            try {
                // ...add a requirement to the builder: "this mechanic must be in the 'found' state"
                actionDAGBuilder.requires(new ActionChangeState(value.getKey(), "found"), algorithmSetting);
            } catch (PathfindImpossibleException e) {
                // Handle cases where a path is impossible
                continue;
            }
        // 5. If the mechanic is an unobtained key...
        } else if (value.getValue() instanceof DungeonRedstoneKeyState && value.getValue().getCurrentState().equalsIgnoreCase("unobtained")) {
            try {
                // ...add a requirement to the builder: "this key must be in the 'obtained-self' state"
                actionDAGBuilder.requires(new ActionChangeState(value.getKey(), "obtained-self"), algorithmSetting);
            } catch (PathfindImpossibleException e) {
                // Handle cases where a path is impossible
                continue;
            }
        }
    }

    try {
        // 6. Build the final, combined DAG from all requirements
        ActionDAG dag = actionDAGBuilder.build();

        // 7. Create a new ActionRoute, which triggers the TSP solver on the DAG
        ActionRoute actionRoute = new ActionRoute("Smart Route", dungeonRoom, dag);

        // 8. Add the final, solved route to the handler to be displayed
        roomRouteHandler.getPath().put("smart", FeatureRegistry.SECRET_LINE_PROPERTIES_SMART_ROUTE.createPathDisplayEngine(actionRoute));
    } catch (PathfindImpossibleException e) {
        // Handle cases where a solution is impossible
    }
}
```

### Breakdown of the Process

1.  **Get Settings:** It retrieves the current pathfinding settings (e.g., whether to use etherwarp, stonk, etc.).
2.  **Instantiate Builder:** It creates a fresh `ActionDAGBuilder` for the current room. This builder will accumulate all the tasks we need to perform.
3.  **Iterate Mechanics:** It loops through every single defined mechanic in the room's data map.
4.  **Add Secret Requirements:** If a mechanic is an `ISecret` and it hasn't been found yet, it adds a requirement to the builder. The `ActionChangeState` tells the builder its goal is to get this specific secret into the `"found"` state. The builder then automatically determines the necessary sub-actions (e.g., `ActionMove`, `ActionClick`) to achieve this goal.
5.  **Add Key Requirements:** It does the same for any redstone keys that haven't been picked up, adding a goal to get the key into the `"obtained-self"` state.
6.  **Build the DAG:** After iterating through all mechanics, the `actionDAGBuilder.build()` method is called. This takes all the added requirements and their sub-actions and compiles them into a single, massive `ActionDAG` that represents the entire task of clearing the room.
7.  **Solve and Display:** This complete `ActionDAG` is then passed to the `ActionRoute` constructor. This triggers the **[TSP Solver](./tsp-solver.md)**, which finds the most efficient path through the graph. The final, solved route is then passed to the `RoomRouteHandler` to be rendered for the player.

This example perfectly illustrates the power of the ActionDAG architecture. By simply defining a list of high-level goals ("get this secret," "get that key"), the system can automatically build a complex dependency graph and find the single best route to accomplish all of them.