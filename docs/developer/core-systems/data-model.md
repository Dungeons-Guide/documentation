---
sidebar_position: 1
---

# Core Data Model: Blueprints and Instances

To understand how Dungeons Guide works, it is essential to grasp its core data model. The system is built on a clear and powerful separation between **static, pre-defined blueprints** and **dynamic, runtime instances**. This architecture allows the mod to use a rich, pre-calculated set of data for every known room in the game, while still being able to track the unique, changing state of every individual dungeon run.

## The Static Blueprints: `Info` & `Data`

The static half of the data model represents the unchanging, "textbook" definition of a dungeon room and all of its components. These objects are loaded from the mod's asset files (`.roomdata.cbor`) once when the game starts and are never modified during gameplay.

A `DungeonRoomInfo` object serves as the master blueprint for a specific dungeon room, such as the "1x1 Crusher Room". It contains all the static information about that room, including its physical schematic (the block data), its shape and color as they appear on the map, and a map of all its interactive elements.

This map of interactive elements is the key to the blueprint system. It contains `DungeonMechanicData` objects, which are the blueprints for individual mechanics like secrets, levers, or traps. A `DungeonSecretChestData` object, for example, knows the static location of a secret chest within the room's schematic. It defines *what* the mechanic is and its inherent properties, but knows nothing about its current state in a live game. Think of these as the raw schematics and parts lists for a room; they know everything about how a room *should* be, but nothing about what's happening in it *right now*.

## The Runtime Instances: `Room` & `State`

The runtime half of the data model represents the live, dynamic state of a room during an active dungeon run. These objects are created when a player enters a room and are destroyed when the run ends, holding all the information specific to that single instance of the room.

The `DungeonRoom` class is the runtime instance of a room. When the `DungeonRoomScaffoldParser` detects that the player has entered a new area, it creates a `DungeonRoom` object. This object holds a reference back to its `DungeonRoomInfo` blueprint, giving it access to all the static data. Most importantly, it manages a collection of `DungeonMechanicState` objects.

The `DungeonMechanicState` is the dynamic counterpart to `DungeonMechanicData` and the heart of the runtime state tracking. A new `DungeonMechanicState` object is instantiated for every mechanic in the room's blueprint when the `DungeonRoom` is created. This object holds the *current, mutable state* of that specific mechanic for the current run. For example, a `DungeonLeverState` object would have a property like `isFlipped`, which starts as `false` and is updated to `true` only when the player interacts with that specific lever in that specific run.

## The `RoomProcessor`: The Logic Engine

The `RoomProcessor` is the bridge that connects the static world of blueprints to the dynamic world of the live dungeon. When a `DungeonRoom` is created, it uses a `ProcessorFactory` to instantiate the correct type of `RoomProcessor` based on an ID string from the `DungeonRoomInfo` blueprint. This allows for specialized logic for different room types, such as a `RoomProcessorWaterPuzzle` or a `RoomProcessorBlazeSolver`.

The `RoomProcessor` acts as the "brain" of the room. It observes game events like chat messages, block updates, and entity deaths. It then interprets these events within the context of the room and updates the state of the `DungeonRoom` and its collection of `DungeonMechanicState` objects accordingly. This clean separation of data (the `State` objects) and logic (the `Processor`) is fundamental to the mod's ability to manage the complexity of Hypixel Dungeons.