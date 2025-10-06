---
sidebar_position: 2
---

# Coordinates and Room Detection

Before the mod can solve puzzles or find secrets, it must first solve two fundamental problems: where things are located within a room, and what room it's currently in. Dungeons Guide uses a clever combination of a relative coordinate system and a unique room "fingerprinting" method to handle this with precision and efficiency.

## 1. The Relative Coordinate System (`OffsetPoint` & `OffsetVec3`)

A dungeon room can spawn at any location in the world and can be rotated in one of four directions. Hard-coding the absolute coordinates of every secret and lever would be impossible. To solve this, the mod uses a relative coordinate system based on the `OffsetPoint` and `OffsetVec3` classes.

The purpose of an `OffsetPoint` is to store a coordinate (`x`, `y`, `z`) that is **relative to the corner of a room's schematic**, assuming zero rotation. This allows developers to define the location of a mechanic (like a chest at `(5, 10, 15)`) in a way that is completely independent of where the room spawns or how it's rotated. This is a fundamental concept that allows all `DungeonRoomInfo` blueprints to be defined in a consistent, reusable way.

At runtime, the `OffsetPoint` class provides the crucial mathematical transformations (`toRotatedRelBlockPos`, `setPosInWorld`) to convert between these abstract, schematic-relative coordinates and the actual, absolute coordinates in the Minecraft world. When a feature needs to know the real-world location of a mechanic, it provides the `OffsetPoint` from the static `DungeonMechanicData` and the current room's rotation. The class then handles the complex matrix transformations to return the correct `BlockPos`, ensuring that waypoints and solvers always have accurate information.

## 2. Room Detection and the `shape` Bitmask

When a player enters a new, unexplored area of the dungeon, the mod needs to identify what room it is so it can load the correct `DungeonRoomInfo` blueprint. This is accomplished through a room "fingerprinting" process managed by the `DungeonRoomScaffoldParser`.

When a new, unidentified room appears on the dungeon map, the `buildRoom` method is called. It performs a **flood-fill** algorithm on the map data, starting from a single point and expanding outwards to find all the connected "unit points" (the 16x16 segments on the map) that constitute a single, contiguous room.

Once the algorithm has the complete set of points belonging to the room, it generates a unique fingerprint for the room's footprint: the `shape` ID. It does this by normalizing the set of points to a 4x4 grid and then constructing a `short` (a 16-bit integer). The formula `shape |= 1 << (localY * 4 + localX)` sets a specific bit for each cell in the 4x4 grid that is part of the room. This creates a compact and unique bitmask that represents the exact shape of the room's footprint. For example, a simple 1x1 room would have a `shape` of `1` (binary `...0001`), while a 2x2 room in the top-left corner would have a shape of `51` (binary `...00110011`).

This unique `shape` ID, along with the room's color on the map, is then passed to the `RoomMatcher`. The `RoomMatcher` compares this fingerprint against its library of known `DungeonRoomInfo` blueprints to find the one that has the same shape and color, allowing it to definitively identify the room. Once a match is found, the system knows the room's rotation and can load all of its mechanics and pre-calculated data, enabling all of the mod's advanced features.