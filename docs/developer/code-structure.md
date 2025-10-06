---
sidebar_position: 1
---

# Code Structure and Architecture

This document provides a high-level overview of the Dungeons Guide mod's architecture. For a more detailed look at the core systems, please see the following pages:

-   **[Core Data Model: Blueprints and Instances](./core-systems/data-model.md)**
-   **[Coordinates and Room Detection](./core-systems/coordinates-and-room-detection.md)**
-   **[Dungeon State Management](./dungeon-state-management.md)**
-   **[Advanced Solver Architectures](./advanced-solvers.md)**

## High-Level Data Flow

The mod's architecture is designed around a one-way data flow, ensuring that the state remains consistent and predictable.

1.  **Raw Game Events:** The process begins with raw events from Minecraft, such as chat messages, map data updates, entity spawns, and world ticks.
2.  **Listeners (`DungeonListener`, etc.):** These classes are registered with the Minecraft Forge event bus. Their sole purpose is to capture these raw game events.
3.  **`DungeonContext` Update:** The listeners take the raw event data and translate it into meaningful state changes within the central `DungeonContext`. For example, a chat message about a puzzle failure updates a flag in the context.
4.  **`RoomProcessor` Logic:** The various `RoomProcessor` instances (for puzzles, boss fights, etc.) continuously monitor the `DungeonContext`. Based on the state in the context, they run their own logic to determine the current state of the puzzle or room (e.g., which blaze to shoot next). The results of this logic are also stored back into the `DungeonContext` or within the processor itself.
5.  **Feature Logic (`AbstractFeature`):** The individual features that the user sees (like HUD elements or solvers) are the final step. They read the processed state from the `DungeonContext` and the `RoomProcessors`. They do not modify the state themselves; they are purely for presentation.
6.  **User Display:** The feature then uses this information to render waypoints, display HUD text, or highlight entities, providing the final output to the user.

This unidirectional flow prevents circular dependencies and makes the system easier to debug and reason about. Data flows from the game, is processed into a central state, and then displayed by features.

## Package Overview

-   **`kr.syeyoung.dungeonsguide.mod`**: The root package for the mod. It contains the main mod class, `DungeonsGuide.java`, which is the entry point for the mod and handles initialization and event registration.

-   **`kr.syeyoung.dungeonsguide.mod.chat`**: This package contains classes for processing and sending chat messages.

-   **`kr.syeyoung.dungeonsguide.mod.commands`**: This package contains the implementation for all of the mod's chat commands (e.g., `/dg`, `/reparty`).

-   **`kr.syeyoung.dungeonsguide.mod.config`**: This package handles loading and saving the mod's configuration. The `Config.java` class is responsible for serializing and deserializing the configuration to and from a JSON file. Individual features define their own configuration parameters.

-   **`kr.syeyoung.dungeonsguide.mod.cosmetics`**: This package contains features related to player cosmetics, such as custom nickname colors, prefixes, and player models.

-   **`kr.syeyoung.dungeonsguide.mod.discord`**: This package contains all the code for Discord Rich Presence integration, including handling party invites and displaying friend activity.

-   **`kr.syeyoung.dungeonsguide.mod.dungeon`**: This is a core package that contains the logic for tracking the player's state within a dungeon. This includes parsing the dungeon layout, tracking room completion, and managing boss fight mechanics.

-   **`kr.syeyoung.dungeonsguide.mod.events`**: This package defines a custom event system that is used throughout the mod to communicate between different components.

-   **`kr.syeyoung.dungeonsguide.mod.features`**: This package contains the base classes and registry for all of the mod's features. Each feature is a subclass of `AbstractFeature` and is registered with the `FeatureRegistry`. This allows for a modular and extensible system for adding new features.

-   **`kr.syeyoung.dungeonsguide.mod.gui`**: This package contains the graphical user interface (GUI) components for the mod, including the main configuration GUI and various HUD elements.

-   **`kr.syeyoung.dungeonsguide.mod.overlay`**: This package contains the system for rendering HUD overlays on the screen.

-   **`kr.syeyoung.dungeonsguide.mod.party`**: This package contains the logic for managing the player's party, including repartying and handling party invites.

-   **`kr.syeyoung.dungeonsguide.mod.pathfinding`**: This package contains pathfinding algorithms used by some of the solvers, such as the ice fill and silverfish solvers.

-   **`kr.syeyoung.dungeonsguide.mod.player`**: This package is responsible for tracking player data and statistics.

-   **`kr.syeyoung.dungeonsguide.mod.utils`**: This package contains various utility classes that are used throughout the mod.