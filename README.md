# Trains Game

This project was developed as part of a **third semester university assignment**.  
It was created solely for **learning purposes** and is **not intended for further development or maintenance**.  
Any bugs or issues found in the project **will not be fixed**, as the work is considered complete in its current state.

---

## General Description

The game demonstrates a pathfinding concept inspired by the **Hamiltonian Circuit problem**, implemented through procedural map generation and backtracking.  
It was designed as an interactive browser-based puzzle game built with **HTML, CSS, and JavaScript**.  
The focus of the assignment was on algorithmic logic, code organization, and UI presentation.

---

## Project Idea and Reference

The initial idea for the pathfinding logic came from the Hamilton Circuit problem, adapted to a tile-based grid system.  
An external reference that helped form the concept:
- [Pathfinding in Java - stepping on each tile once (StackOverflow)](https://stackoverflow.com/questions/33569980/pathfinding-in-java-stepping-on-each-tile-once)

The gameplay revolves around building a valid route across a grid map while following specific traversal rules.  
If the route satisfies all logical constraints, the player wins; otherwise, a penalty is applied, and the board resets.

---

## Map Generation Logic

The project uses **procedural map generation** combined with **backtracking validation** to ensure the playability of each map.

1. The algorithm first places **oasis obstacles** on the grid.  
2. After each placement, it uses backtracking to check if the map remains **fully traversable**.  
3. If the configuration is valid, the algorithm continues placing obstacles.  
4. If the path becomes blocked, the algorithm reverts the last placement and tries a different configuration.

Performance considerations:
- A **5×5 grid** can be generated in a fraction of a second.
- A **7×7 grid** may take several minutes to compute, so for that difficulty level, **predefined maps** are used to avoid waiting times.

You can manually test generation time by calling:
```js
runSetup(difficultyHard);
```

---

## Scoreboard, Saving, and Game State Management

The game keeps track of scores and saved game states throughout a play session.

- The **scoreboard** is always visible during gameplay and can also be accessed from the **ScoreBoard menu**.
- When the player successfully completes a map, the **completion time** is automatically recorded and added to the scoreboard.
- Players can **save** their current game state using the **Save Game** button.
- Saved games can be **reloaded** anytime from the **Saved Games** menu.
- The **Description menu** includes a demonstration of the placement tool, which can be controlled with either:
  - **Arrow keys**, or
  - **On-screen icons**.

---

## User Interface and Responsiveness

The interface was designed with a focus on clarity and simplicity, though complete responsiveness was not required for the assignment.

- The layout renders correctly up to **1536 pixels** screen width.  
- Between **1024 and 1536 pixels**, some visual elements may slightly overlap, but this does **not affect gameplay** or functionality.  
- The overall visual appearance is considered **clean and user-friendly**.  
- The **background image** used in the game is **custom-made** by the author.

The UI elements include:

- Grid-based game board  
- Menus for Scoreboard, Saved Games, and Description  
- On-screen icons for placement controls  
- Status indicators for time, penalty, and current progress

---

## Technical Implementation

- The project was developed using **pure HTML, CSS, and JavaScript** without any external frameworks or libraries.  
- All **pathfinding** and **map generation** logic were implemented manually.  
- **Backtracking** was used to ensure both:  
  - Map traversability during obstacle placement.  
  - Route validity after player interaction.  
- The **state management** and **save system** rely on basic in-browser storage mechanisms.

---

## Known Limitations

- Map generation for larger grids (e.g., 7×7) is computationally expensive and may take several minutes to complete.  
- The responsive layout is partially implemented:  
  - Works well on larger screens (above 1280 px).  
  - Limited layout overlap may occur between 1024–1536 px.  
- No mobile optimization has been applied.  
- The project contains no backend or database functionality.
- Clean code and unorganized project

---

## Educational Context and Purpose

This project was created as part of a **third semester coursework** in a university programming class.  
It serves as a demonstration of:

- Algorithmic thinking and problem-solving using backtracking.  
- Basic procedural content generation.  
- Frontend organization and minimal UI design principles.

It is not intended to represent a full-scale or optimized game product.

---

## Maintenance and Disclaimer

This project is considered **complete** in its current form.  
It was made purely for **educational and demonstration purposes**, not as a production-grade software.  
Future updates, maintenance, or bug fixes **will not be provided**.

---

## Author

**Name:** Hogyor Peti (GitHub: [Hogyi1](https://github.com/Hogyi1))  
**Year:** 2025  
**Purpose:** University assignment – third semester project  
**All rights reserved.**
