---
sidebar_position: 2
---

# Dungeon State Management

The ability of Dungeons Guide to provide accurate, real-time information and puzzle solutions hinges on its robust dungeon state management system. This system is responsible for understanding the dungeon's layout, tracking player progress, and monitoring the state of every puzzle and entity within it.

## The `DungeonContext`

The heart of the state management system is the `DungeonContext` class. An instance of this class is created every time a player enters a new dungeon and is destroyed when they leave. It serves as a central repository for all information related to the current dungeon run.

Key responsibilities of `DungeonContext`:

-   **Dungeon Layout:** It holds a reference to the `DungeonRoomScaffoldParser`, which is responsible for parsing the dungeon map data and identifying the individual rooms and their connections.
-   **Player and Entity Tracking:** It keeps track of all players in the dungeon, their locations on the map, and the state of important entities (like mimics or bosses).
-   **Puzzle and Room State:** Through `RoomProcessor` instances, it monitors the state of every room, including whether puzzles are complete, failed, or in progress.
-   **Boss Fight Logic:** It holds an instance of a `BossfightProcessor` specific to the current floor, which manages the complex phases and mechanics of the boss encounter.
-   **Event Recording:** It uses a `DungeonEventRecorder` to log significant events that occur during the run, which can be used for debugging or advanced analytics.
-   **Pathfinding Execution:** It manages the `PathfinderExecutorExecutor`, which runs pathfinding calculations in the background.

## The Data Flow: From Game to `DungeonContext`

The `DungeonContext` is populated and updated by a series of listeners and processors that observe the game world and translate raw game events into meaningful state changes.

1.  **Map Updates (`onMapUpdate`):** This is the primary source of information for the dungeon layout. When the in-game map is updated, the `DungeonContext` receives the new map data.
    -   If the layout hasn't been determined yet, it uses `DungeonMapConstantRetriever` to parse the map and create a `DungeonMapLayout`.
    -   This layout is then used to initialize the `DungeonRoomScaffoldParser`, which breaks the map down into a grid of `DungeonRoom` objects.
    -   Each `DungeonRoom` is then matched against a library of known room layouts to identify it (e.g., "1x1 Room", "Fairy Room", "Blaze Puzzle").

2.  **Chat Messages (`onChat`):** Many in-game events are only communicated through chat. The `DungeonContext` listens for specific chat messages to detect:
    -   Puzzle failures (`PUZZLE FAIL!`).
    -   The end of a dungeon run (`EXTRA STATS`).
    -   Player deaths.
    -   Secret DG-to-DG communication for sharing information like secret counts.

3.  **World Ticks (`tick`):** On every game tick, the `DungeonContext` performs several updates:
    -   It updates the list of players in the dungeon by checking the tab list.
    -   It checks if the player has entered the boss room by comparing their position to the known dungeon boundary.
    -   It tells each `DungeonRoom` to re-evaluate its state if it hasn't been successfully identified yet.

## Room Processors: The Brains of the Operation

While `DungeonContext` holds the state, the `RoomProcessor` classes contain the logic for interpreting that state. Each `DungeonRoom` can have a `RoomProcessor` attached to it.

-   **`GeneralRoomProcessor`:** Handles common tasks for all rooms, like tracking secrets.
-   **Puzzle-Specific Processors:** For rooms with puzzles (e.g., blaze, water board), a specialized processor is attached. This processor understands the specific entities and mechanics of its puzzle and updates the room's state accordingly. For example, the blaze room processor tracks which blazes have been killed and in what order.
-   **`BossfightProcessor`:** A special type of processor that manages the entire boss fight, which can have multiple phases and complex mechanics.

By centralizing all dungeon-related information into the `DungeonContext`, the mod ensures that all features are working with the same, consistent view of the game world. This allows a feature like a solver to simply query the context for the state of a puzzle, without needing to know the low-level details of how that state was determined.