/*Variables*/

//1: Easy 2: Hard
//Tócsa mindig páratlan [1,3,5]
//1: Pálya mérete, 2: Összes akadály, 3: Híd, 4: Kanyar
const difficultyEasy = [5, [6, 8], [2, 4], [2, 3]]
const difficultyHard = [7, [8, 12], [3, 5], [4, 5]]
const puddleNumber = [1, 3]
let map = []
let obstacles = []
let emptySpace = []
let usedSpace = []
let originalState = []
let previousState = []
let prevState = [];

//Pathfinding variables
let pathFound = false;
let route = '';
let totalFreeTiles = 0;
let maximumCounter = 100;
let counter = 0;
let count = 0;
let layout = []
let successfullPosition = false;

//Directions for up, down, left, right movements
const directions = [
    { name: "up", coordinates: [-1, 0] },    // Fel
    { name: "down", coordinates: [1, 0] },    // Le
    { name: "right", coordinates: [0, 1] },   // Jobbra
    { name: "left", coordinates: [0, -1] }    // Balra
]




/*Functions*/
//Get a random whole number between two integers (included)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Reset every variable used
function resetVariables() {
    map = []
    obstacles = []
    emptySpace = []
    usedSpace = []
    originalState = []
    previousState = []
    //Pathfinding variables
    pathFound = false;
    route = '';
    totalFreeTiles = 0;
    maximumCounter = 100;
    counter = 0;
    count = 0;
    layout = []
    successfullPosition = false;
}

//Sets the obstacles count
function initializeObstacles(all, bridge, turn) {
    let totalObstacles, puddles, bridges, turns;
    totalObstacles = getRandomInt(all[0], all[1]);

    do {
        puddles = puddleNumber[getRandomInt(0, 1)];
        bridges = getRandomInt(bridge[0], bridge[1]);
        turns = getRandomInt(turn[0], turn[1]);
    } while (puddles + bridges + turns !== totalObstacles);

    obstacles[0] = [puddles, "puddle", 1]; //Nincs forgása
    obstacles[1] = [bridges, "bridge", 2]; //1: vízszintes, 2: függúleges
    obstacles[2] = [turns, "turn", 4]; //1: Fel-jobb, 2: Fel-bal 3: Le-jobb, 4: Le-bal
}

//Sets up the map to place obstacles
/*function initializeMap(size) {

     for (let i = 0; i < size; i++) {
        map.push([]);
    }

    for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
            map[i][j] = [[], "empty", 0, "NSEW"]; //Kotelezo haladasi irany, cella neve, bejárt vagy sem
            emptySpace.push([i, j]);
        }
    }

    for (let i = 1; i < size - 1; i++) {
        map[0][i] = [[], "empty", 0, "NEW"];
        map[i][0] = [[], "empty", 0, "NSW"];
        map[size - 1][i] = [[], "empty", 0, "SEW"];
        map[i][size - 1] = [[], "empty", 0, "NSE"];
        emptySpace.push([0, i]);
        emptySpace.push([i, 0]);
        emptySpace.push([size - 1, i]);
        emptySpace.push([i, size - 1]);
    }

    map[0][0] = [[], "empty", 0, "NW"];
    map[size - 1][size - 1] = [[], "empty", 0, "SE"];
    map[size - 1][0] = [[], "empty", 0, "SW"];
    map[0][size - 1] = [[], "empty", 0, "NE"];

    emptySpace.push([0, 0]);
    emptySpace.push([size - 1, size - 1]);
    emptySpace.push([size - 1, 0]);
    emptySpace.push([0, size - 1]); 
    

}*/

function initializeMap(size) {
    for (let i = 0; i < size; i++) {
        map.push([])
        for (let j = 0; j < size; j++) {
            map[i][j] = [[], "empty", 0, "NSEW", false]; //Kotelezo haladasi irany, cella neve, bejárt vagy sem
            emptySpace.push([i, j]);
        }
    }
}

//Cell is inside the map
function isInside(x, y) {
    let success = false
    if (x < map.length && y < map.length && x >= 0 && y >= 0) {
        success = true;
    }
    return success;
}

//Reset the visited values of the map
function resetRoute() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            map[i][j][2] = 0;
        }
    }

    route = '';
    pathFound = false;
    totalFreeTiles = emptySpace.length

}

//Print out the map
//X: which values   //[must reach coords], "name", visited, "direction of reachability"
function printGrid(x) {
    for (let i = 0; i < map.length; i++) {
        let row = "";  // Sor tárolása egy karakterláncban
        for (let j = 0; j < map.length; j++) {
            row += "[" + map[i][j][x] + "] ";  // Elem hozzáadása szóközzel
        }
        console.log(row);  // Sor kiírása
    }
    console.log("");
}

//Find a loop path while reaching every reachable tile
//Backtracking algorithm
function findLoopPath(x, y, direction, steps) {
    const startX = emptySpace[0][0];
    const startY = emptySpace[0][1];
    //console.log("Visiting:", x, y, "steps:", steps, "route:", route);
    if (pathFound) return;

    if (isInside(x, y) && map[x][y][1] != "puddle" && map[x][y][2] != 1 && map[x][y][3].includes(direction)) {
        map[x][y][2] = 1; // Mark as visited
        route += direction;  // Add current direction to route

        // If all free cells are visited, check if we can return to start
        if (steps + 1 === totalFreeTiles) {
            if (((x === startX && Math.abs(y - startY) === 1) || (y === startY && Math.abs(x - startX) === 1)) &&
                ((x === startX && y === startY - 1 && map[startX][startY][3].includes('E')) ||  // Kezdőcella balra van, és van keleti elérhetőség
                    (x === startX && y === startY + 1 && map[startX][startY][3].includes('W')) ||  // Kezdőcella jobbra van, és van nyugati elérhetőség
                    (x === startX - 1 && y === startY && map[startX][startY][3].includes('S')) ||  // Kezdőcella felett van, és van déli elérhetőség
                    (x === startX + 1 && y === startY && map[startX][startY][3].includes('N')))) {
                pathFound = true;
                //console.log(route);
                return;
            }
        }

        // Move in all directions
        findLoopPath(x - 1, y, "N", steps + 1); // North
        findLoopPath(x + 1, y, "S", steps + 1); // South
        findLoopPath(x, y - 1, "W", steps + 1); // West
        findLoopPath(x, y + 1, "E", steps + 1); // East


        // Backtrack if path not found
        if (!pathFound) {
            route = route.slice(0, -1);  // Remove last direction
            map[x][y][2] = 0; // Unmark the cell
        }
    }
}

//(x === startX && Math.abs(y - startY) === 1) || (y === startY && Math.abs(x - startX) === 1)

//Return back if the given String has the searched characters
//1: String 2: included
function containsAllChars(string, chars) {
    return new Set(chars).size === [...chars].filter(char => string.includes(char)).length;
}

//Adds the obstacles to the map
function addObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        count = 0;
        pathFound = false;
        counter = 0;
        originalState = structuredClone(map);
        if (obstacles[i][1] == "puddle") {
            while (!pathFound) {
                while (count < obstacles[i][0]) {
                    let cell = Math.floor(Math.random() * emptySpace.length);
                    previousState = structuredClone(map);
                    if (isAvailable(emptySpace[cell], obstacles[i][1], i)) {
                        usedSpace.push(emptySpace[cell])
                        emptySpace.splice(cell, 1);
                        count++;
                    } else {
                        map = JSON.parse(JSON.stringify(previousState));
                    }
                }
                resetRoute();
                findLoopPath(emptySpace[0][0], emptySpace[0][1], "", 0);
                if (!pathFound) {
                    emptySpace.push(...usedSpace);
                    usedSpace.length = 0;
                    count = 0;
                    map = JSON.parse(JSON.stringify(originalState));
                }
            }
        } else {
            while (!pathFound) {
                while (count < obstacles[i][0]) {
                    counter++;
                    let cell = Math.floor(Math.random() * emptySpace.length);
                    previousState = structuredClone(map)

                    for (let j = 0; j < obstacles[i][2]; j++) {
                        if (isAvailable(emptySpace[cell], obstacles[i][1], j)) {
                            pathFound = false;
                            route = '';
                            resetRoute();
                            totalFreeTiles = emptySpace.length;
                            findLoopPath(emptySpace[0][0], emptySpace[0][1], "", 0);
                            if (pathFound) {
                                count++;
                                counter = 0;
                                break;
                            } else {
                                map = JSON.parse(JSON.stringify(previousState));
                            }
                        } else {
                            map = JSON.parse(JSON.stringify(previousState));
                        }
                    }

                    if (counter >= maximumCounter) {
                        count = 0;
                        counter = 0;
                        map = JSON.parse(JSON.stringify(originalState));
                    }
                }
            }
        }
    }
}

//Tries to find a place to put the obstacle without obstructing the nearby cells
function isAvailable(coords, obstacle, ways) {
    let row = coords[0];
    let col = coords[1];
    let success = false;
    let savedCoords = [];
    if (!(map[row][col][1] == "empty")) {
        return false;
    }
    map[row][col][1] = obstacle;



    switch (obstacle) {

        case "puddle":
            map[row][col][2] = "X"
            for (let i = 0; i < directions.length; i++) {
                let newRow = row + directions[i].coordinates[0];
                let newCol = col + directions[i].coordinates[1];
                let possibleRoutes = [];
                success = false;

                if (isInside(newRow, newCol)) {
                    if (map[newRow][newCol][1] == "empty") {
                        for (let j = 0; j < directions.length; j++) {
                            let newRow2 = newRow + directions[j].coordinates[0];
                            let newCol2 = newCol + directions[j].coordinates[1];

                            if (isInside(newRow2, newCol2)) {
                                if (map[newRow2][newCol2][1] == "empty") {
                                    possibleRoutes.push([newRow2, newCol2]);
                                }
                            }
                        }
                    }
                    if (possibleRoutes.length >= 2) {
                        success = true;
                        if (possibleRoutes.length == 2) {
                            savedCoords.push([...possibleRoutes, [newRow, newCol]])
                        }
                    } else return success
                }
            }
            if (success) {
                for (let k = 0; k < savedCoords.length; k++) {
                    map[savedCoords[k][2][0]][savedCoords[k][2][1]][0] = [savedCoords[k][0], savedCoords[k][1]];
                    for (let j = 0; j < 2; j++) {
                        map[savedCoords[k][j][0]][savedCoords[k][j][1]][0].push([savedCoords[k][2][0]], [savedCoords[k][2][1]])
                    }
                }

            }
            return success;

        case "bridge":
            // 1: Saját cella, 2: Felette/Balra, 3: Alatta/Jobbra
            const bridgeLayouts = [
                [[row, col + 1], [row, col - 1], "EW", "N", "S"],  // Horizontális
                [[row + 1, col], [row - 1, col], "SN", "W", "E"]   // Vertikális
            ];
            successfullPosition = false;
            // Ellenőrizzük, hogy a híd egyik oldala se menjen ki a pályáról
            layout = bridgeLayouts[ways];
            const [pos1, pos2] = bridgeLayouts[ways];
            if (isInside(pos1[0], pos1[1]) && isInside(pos2[0], pos2[1]) && map[pos1[0]][pos1[1]][1] != "puddle" && map[pos2[0]][pos2[1]][1] != "puddle") {
                if (ways === 0) {
                    if (map[pos1[0]][pos1[1]][1] == "bridge") {
                        if (map[pos1[0]][pos1[1]][3] == bridgeLayouts[0][2]) {
                            successfullPosition = true;
                        } else {
                            return false
                        }
                    }

                    if (map[pos2[0]][pos2[1]][1] == "bridge") {
                        if (map[pos2[0]][pos2[1]][3] == bridgeLayouts[0][2]) {
                            successfullPosition = true;
                        } else {
                            return false
                        }
                    }

                    if (isInside(row + 1, col)) {
                        if (map[row + 1][col][1] == "bridge") {
                            if (map[row + 1][col][3] == bridgeLayouts[0][2]) {
                                successfullPosition = true;
                            } else {
                                return false;
                            }
                        }
                    }


                    if (isInside(row - 1, col)) {
                        if (map[row - 1][col][1] == "bridge") {
                            if (map[row - 1][col][3] == bridgeLayouts[0][2]) {
                                successfullPosition = true;
                            } else {
                                return false;
                            }
                        }
                    }

                    map[row][col][3] = layout[2];
                    if (isInside(row + 1, col) && (map[row + 1][col][1] == "empty")) map[row + 1][col][3] = map[row + 1][col][3].replaceAll(layout[4], "");
                    if (isInside(row - 1, col) && (map[row - 1][col][1] == "empty")) map[row - 1][col][3] = map[row - 1][col][3].replaceAll(layout[3], "");
                    successfullPosition = true
                } else {
                    if (map[pos1[0]][pos1[1]][1] == "bridge") {
                        if (map[pos1[0]][pos1[1]][3] == bridgeLayouts[1][2]) {
                            successfullPosition = true;
                        } else {
                            return false
                        }
                    }

                    if (map[pos2[0]][pos2[1]][1] == "bridge") {
                        if (map[pos2[0]][pos2[1]][3] == bridgeLayouts[1][2]) {
                            successfullPosition = true;
                        } else {
                            return false
                        }
                    }

                    if (isInside(row, col + 1)) {
                        if (map[row][col + 1][1] == "bridge") {
                            if (map[row][col + 1][3] == bridgeLayouts[1][2]) {
                                successfullPosition = true;
                            } else {
                                return false;
                            }
                        }
                    }

                    if (isInside(row, col - 1)) {
                        if (map[row][col - 1][1] == "bridge") {
                            if (map[row][col - 1][3] == bridgeLayouts[1][2]) {
                                successfullPosition = true;
                            } else {
                                return false;
                            }
                        }
                    }


                    map[row][col][3] = layout[2];
                    if (isInside(row, col + 1) && (map[row][col + 1][1] == "empty")) map[row][col + 1][3] = map[row][col + 1][3].replaceAll(layout[4], "");
                    if (isInside(row, col - 1) && (map[row][col - 1][1] == "empty")) map[row][col - 1][3] = map[row][col - 1][3].replaceAll(layout[3], "");
                    successfullPosition = true
                }
            }
            return successfullPosition;

        case "turn":
            const turnlayouts = [[[[row + 1, col, "SN"], [row, col + 1, "EW"], "NW"], [row, col - 1, "W"], [row - 1, col, "N"]],
            [[[row + 1, col, "SN"], [row, col - 1, "EW"], "NE"], [row, col + 1, "E"], [row - 1, col, "N"]],
            [[[row - 1, col, "SN"], [row, col + 1, "EW"], "SW"], [row, col - 1, "W"], [row + 1, col, "S"]],
            [[[row - 1, col, "SN"], [row, col - 1, "EW"], "SE"], [row, col + 1, "E"], [row + 1, col, "S"]]]

            layout = turnlayouts[ways];
            successfullPosition = false;
            for (let i = 0; i < 2; i++) {
                if (isInside(layout[0][i][0], layout[0][i][1]) && containsAllChars(map[layout[0][i][0]][layout[0][i][1]][3], layout[0][i][2]) && map[layout[0][i][0]][layout[0][i][1]][1] != "puddle") {
                    successfullPosition = true;
                } else {
                    return false;
                }
            }

            for (let i = 1; i < layout.length; i++) {
                if (!isInside(layout[i][0], layout[i][1])) {
                    successfullPosition = true;
                    continue;
                } else {
                    if (map[layout[i][0]][layout[i][1]][1] == "empty" || map[layout[i][0]][layout[i][1]][1] == "puddle") {
                        map[layout[i][0]][layout[i][1]][3] = map[layout[i][0]][layout[i][1]][3].replaceAll(layout[i][2], "")
                        successfullPosition = true;
                    } else {
                        if (map[layout[i][0]][layout[i][1]][3].includes(layout[i][2])) {
                            return false;
                        }
                    }
                }
            }
            if (successfullPosition) {
                map[row][col][3] = layout[0][2]
            }
            return successfullPosition;
    }

}
let resetWithoutRails = []
//Sets up the map for playing, gets a difficulty Array
function runSetup(D) {
    resetVariables()
    initializeMap(D[0])
    initializeObstacles(D[1], D[2], D[3])
    console.log(obstacles)
    addObstacles()

    console.log(pathFound, route, totalFreeTiles)
    printGrid(1)
    printGrid(3)
    generateTable(D[0])
    topScores(D[0])
    allPlaced = totalFreeTiles
    resetWithoutRails = structuredClone(map);
}
//runSetup(difficultyEasy)







/*For the Visual Game*/
const StartBtn = document.querySelector('#StartNewGame');
const Startmenu = document.querySelector('.StartMenu');
const nameInput = document.querySelector('#name');
const closeIcon = document.querySelector('.closeIcon');
let clickedCell = null;
let StartGame = false;
let Names = [];
const sideBar = document.querySelector('.sideGameBar')
const playerName = document.querySelector('.yourName')
let otherClick = false
let popUpOpened = false;
const upIcon = document.querySelector('.Up');
const downIcon = document.querySelector('.Down');
const leftIcon = document.querySelector('.Left');
const rightIcon = document.querySelector('.Right');
let currentImageIndex = 0;
let rotation = 0;
const images = ['./pics/tiles/straight_rail.png', './pics/tiles/curve_rail.png'];
const obstacleImages = ['./pics/tiles/bridge_rail.png', './pics/tiles/mountain_rail.png']
const popupImage = document.querySelector('#popup img');
const saveStatus = document.querySelector('#saveStatus');
const GamesIsSaved = document.querySelector('.GamesIsSaved');
const YouWon = document.querySelector('.YouWon')
const SavedGameMenu = document.querySelector('.SavedGameMenu')
let allPlaced = emptySpace.length
let SavedGames = [];
let topList = [];
let timer = 0;
let timerID;


//Gets the difficulty selected by the user // Easy // Hard
function getSelectedDifficulty() {
    const selectedRadio = document.querySelector('input[name="difficulty"]:checked');
    return selectedRadio ? selectedRadio.id : null;
}

//Updates the Start Button based on the given inputs
function updateStartButtonState() {
    if (getSelectedDifficulty() && nameInput.value.length > 0) {
        StartBtn.disabled = false;
        StartBtn.classList.remove('disabled');
    } else {
        StartBtn.disabled = true;
        StartBtn.classList.add('disabled');
    }
}

//Generates the table shown in HTML
/* function generateTable(n) {
    const table = document.querySelector('.tbody');
    table.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const row = table.insertRow()
        for (let j = 0; j < n; j++) {
            const cell = row.insertCell();
            const img = document.createElement('img');
            switch (map[i][j][1]) {
                case "empty":
                    img.src = '../pics/tiles/empty.png';
                    img.classList.add('cellPics');
                    img.addEventListener('click', (event) => {
                        showPopup(event, img);
                    });
                    break;

                case "bridge":
                    img.src = '../pics/tiles/bridge.png';
                    if (map[i][j][4] == true) {
                        img.src = '../pics/tiles/bridge_rail.png';
                    }
                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', (event) => {
                        showPopup(event, img);
                    });
                    if (map[i][j][3] === "EW") {
                        img.style.transform = "rotate(90deg)";
                    }
                    break;

                case "turn":
                    img.src = '../pics/tiles/mountain.png';
                    if (map[i][j][4] == true) {
                        img.src = '../pics/tiles/mountain_rail.png';
                    }

                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', (event) => {
                        showPopup(event, img);
                    });
                    if (map[i][j][3] === "NE") {
                        img.style.transform = "rotate(90deg)";
                    } else if (map[i][j][3] === "SE") {
                        img.style.transform = "rotate(180deg)";
                    } else if (map[i][j][3] === "SW") {
                        img.style.transform = "rotate(270deg)";
                    }
                    break;

                case "puddle":
                    img.src = '../pics/tiles/oasis.png';
                    img.classList.add('cellPics', 'puddlePic');
                    break;
                case "straight":
                    img.src = '../pics/tiles/straight_rail.png';
                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', (event) => {
                        showPopup(event, img);
                    });
                    if (map[i][j][3] === "EW") {
                        img.style.transform = "rotate(90deg)";
                    }
                    break;
                case "curve":
                    img.src = '../pics/tiles/curve_rail.png';
                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', (event) => {
                        showPopup(event, img);
                    });
                    if (map[i][j][3] === "NE") {
                        img.style.transform = "rotate(90deg)";
                    } else if (map[i][j][3] === "SE") {
                        img.style.transform = "rotate(180deg)";
                    } else if (map[i][j][3] === "SW") {
                        img.style.transform = "rotate(270deg)";
                    }
                    break;
            }



            cell.appendChild(img);
        }
    }
} */

function generateTable(n) {
    const table = document.querySelector('.tbody');
    table.innerHTML = '';
    for (let i = 0; i < n; i++) {
        const row = table.insertRow();
        for (let j = 0; j < n; j++) {
            const cell = row.insertCell();
            const img = document.createElement('img');
            switch (map[i][j][1]) {
                case "empty":
                    img.src = './pics/tiles/empty.png';
                    img.classList.add('cellPics');
                    img.addEventListener('click', imgClickHandler);
                    break;
                case "bridge":
                    img.src = './pics/tiles/bridge.png';
                    if (map[i][j][4] === true) {
                        img.src = './pics/tiles/bridge_rail.png';
                    }
                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', imgClickHandler);
                    if (map[i][j][3] === "EW") {
                        img.style.transform = "rotate(90deg)";
                    }
                    break;
                case "turn":
                    img.src = './pics/tiles/mountain.png';
                    if (map[i][j][4] === true) {
                        img.src = './pics/tiles/mountain_rail.png';
                    }
                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', imgClickHandler);
                    if (map[i][j][3] === "NE") {
                        img.style.transform = "rotate(90deg)";
                    } else if (map[i][j][3] === "SE") {
                        img.style.transform = "rotate(180deg)";
                    } else if (map[i][j][3] === "SW") {
                        img.style.transform = "rotate(270deg)";
                    }
                    break;
                case "puddle":
                    img.src = './pics/tiles/oasis.png';
                    img.classList.add('cellPics', 'puddlePic');
                    break;
                case "straight":
                    img.src = './pics/tiles/straight_rail.png';
                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', imgClickHandler);
                    if (map[i][j][3] === "EW") {
                        img.style.transform = "rotate(90deg)";
                    }
                    break;
                case "curve":
                    img.src = './pics/tiles/curve_rail.png';
                    img.classList.add('cellPics', 'bridgePic');
                    img.addEventListener('click', imgClickHandler);
                    if (map[i][j][3] === "NE") {
                        img.style.transform = "rotate(90deg)";
                    } else if (map[i][j][3] === "SE") {
                        img.style.transform = "rotate(180deg)";
                    } else if (map[i][j][3] === "SW") {
                        img.style.transform = "rotate(270deg)";
                    }
                    break;
            }
            cell.appendChild(img);
        }
    }
}

function imgClickHandler(event) {
    showPopup(event, event.currentTarget);
}


updateStartButtonState();

nameInput.addEventListener('input', updateStartButtonState);
document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', updateStartButtonState);
});

StartBtn.addEventListener('click', () => {
    Names.push(nameInput.value);
    const selectedRadio = document.querySelector('input[name="difficulty"]:checked');
    const display = document.querySelector('.timerText')
    Startmenu.classList.remove('revealed');
    Game.style.display = 'flex'
    mainMenu.style.width = "40vw"
    playerName.innerHTML = Names[Names.length - 1]
    saveStatus.disabled = false;
    YouWon.style.display = 'none';
    YouWon.classList.remove('fadeUp2');
    display.classList.remove('successfull')
    stopTimer()
    setTimeout(() => {
        sideBar.style.display = 'flex'
        Startmenu.style.display = 'none';
        Game.classList.remove('zoomOut');
        sideBar.classList.add('revealed')
        startTimer(0)
    }, 300);

    if (getSelectedDifficulty() === 'Easy') {
        runSetup(difficultyEasy);
    } else if (getSelectedDifficulty() === 'Hard') {
        map7x7();
    }

    nameInput.value = "";
    selectedRadio.checked = false;
    StartGame = true;
});

function continuePlaying(name, timer, map2, emptySp, allPlac) {
    Names.push(name);
    saveStatus.disabled = false;
    const display = document.querySelector('.timerText')
    SavedGameMenu.classList.remove('revealed');
    Game.style.display = 'flex'
    mainMenu.style.width = "40vw"
    playerName.innerHTML = Names[Names.length - 1]
    saveStatus.disabled = false;
    YouWon.style.display = 'none';
    YouWon.classList.remove('fadeUp2');
    display.classList.remove('successfull')
    stopTimer()
    setTimeout(() => {
        sideBar.style.display = 'flex'
        savedGameMenu.style.display = 'none';
        Game.classList.remove('zoomOut');
        sideBar.classList.add('revealed')
        startTimer(timer)
    }, 300);

    map = JSON.parse(JSON.stringify(map2))
    StartGame = true;

    printGrid(1)
    printGrid(3)
    generateTable(map.length)
    topScores(map.length)
    emptySpace = emptySp
    allPlaced = allPlac;
    totalFreeTiles = emptySp.length
    resetWithoutRails = structuredClone(map);
}

if (JSON.parse(localStorage.getItem('Games')) == null) {
    SavedGames = [];
} else {
    SavedGames = JSON.parse(localStorage.getItem('Games'));
}

if (JSON.parse(localStorage.getItem('TopList')) == null) {
    topList = [];
} else {
    topList = JSON.parse(localStorage.getItem('TopList'));
}

function showPopup(event, img) {
    const popup = document.querySelector('#popup');
    const rect = img.getBoundingClientRect();
    clickedCell = event.target.closest('td');

    popup.style.left = `${rect.left + window.scrollX + rect.width / 2 - popup.offsetWidth / 2}px`;
    popup.style.top = `${rect.top + window.scrollY - popup.offsetHeight - 10}px`;
    popup.style.opacity = '1';
    popup.style.zIndex = '1';

    otherClick = true;
    setTimeout(() => {
        otherClick = false;
    }, 100);
    popUpOpened = true;


    popupImage.src = images[currentImageIndex];
}

function getCellPosition(clickedCell) {
    const row = clickedCell.parentNode;
    const table = row.parentNode;
    const rowIndex = Array.from(table.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(clickedCell);
    return [rowIndex, cellIndex];
}

upIcon.addEventListener('click', (event) => {
    if (popUpOpened) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        popupImage.src = images[currentImageIndex];
    }
});

downIcon.addEventListener('click', () => {
    if (popUpOpened) {

        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        popupImage.src = images[currentImageIndex];
    }
});

leftIcon.addEventListener('click', () => {
    if (popUpOpened) {
        if (rotation - 90 == -450) {
            popupImage.style.transition = 'none'
        }
        rotation = (rotation - 90) % 450
        popupImage.style.rotate = JSON.stringify(rotation) + "deg"
        setTimeout(() => {
            popupImage.style.transition = '0.3s'
        }, 10)
    }
});

rightIcon.addEventListener('click', () => {
    if (popUpOpened) {
        if ((rotation + 90) == 450) {
            popupImage.style.transition = 'none'
        }
        rotation = (rotation + 90) % 450
        popupImage.style.rotate = JSON.stringify(rotation) + "deg"
        setTimeout(() => {
            popupImage.style.transition = '0.3s'
        }, 10)
    }
});

popupImage.addEventListener('click', (event) => {
    if (popUpOpened) {
        const p = getCellPosition(clickedCell)
        if (map[p[0]][p[1]][1] == "turn") {

            switch (map[p[0]][p[1]][3]) {
                case "NW":
                    if ((rotation == 0 || Math.abs(rotation) == 360) && currentImageIndex == 1) {
                        const imgElement = clickedCell.querySelector('img');
                        imgElement.src = obstacleImages[currentImageIndex];
                        imgElement.style.transform = `rotate(${rotation}deg)`;
                        placeTiles(currentImageIndex, rotation, p);
                        closePopUp()
                    } else {
                        popupImage.classList.add('wrongElem')
                        setTimeout(() => {
                            popupImage.classList.remove('wrongElem')
                        }, 250);
                    }
                    break;
                case "NE":
                    if ((rotation == 90 || rotation == -270) && currentImageIndex == 1) {
                        const imgElement = clickedCell.querySelector('img');
                        imgElement.src = obstacleImages[currentImageIndex];
                        imgElement.style.transform = `rotate(${rotation}deg)`;
                        placeTiles(currentImageIndex, rotation, p);
                        closePopUp()
                    } else {
                        popupImage.classList.add('wrongElem')
                        setTimeout(() => {
                            popupImage.classList.remove('wrongElem')
                        }, 250);
                    }
                    break;
                case "SW":
                    if ((rotation == 270 || rotation == -90) && currentImageIndex == 1) {
                        const imgElement = clickedCell.querySelector('img');
                        imgElement.src = obstacleImages[currentImageIndex];
                        imgElement.style.transform = `rotate(${rotation}deg)`;
                        placeTiles(currentImageIndex, rotation, p);
                        closePopUp()
                    } else {
                        popupImage.classList.add('wrongElem')
                        setTimeout(() => {
                            popupImage.classList.remove('wrongElem')
                        }, 250);
                    }
                    break;
                case "SE":
                    if (Math.abs(rotation) == 180 && currentImageIndex == 1) {
                        const imgElement = clickedCell.querySelector('img');
                        imgElement.src = obstacleImages[currentImageIndex];
                        imgElement.style.transform = `rotate(${rotation}deg)`;
                        placeTiles(currentImageIndex, rotation, p);
                        closePopUp()
                    } else {
                        popupImage.classList.add('wrongElem')
                        setTimeout(() => {
                            popupImage.classList.remove('wrongElem')
                        }, 250);
                    }
                    break;
            }

        } else if (map[p[0]][p[1]][1] == "bridge") {
            switch (map[p[0]][p[1]][3]) {
                case "SN":
                    if (rotation % 180 == 0 && currentImageIndex == 0) {
                        const imgElement = clickedCell.querySelector('img');
                        imgElement.src = obstacleImages[currentImageIndex];
                        // imgElement.style.transform = `rotate(${rotation}deg)`;
                        placeTiles(currentImageIndex, rotation, p);
                        closePopUp()
                    } else {
                        popupImage.classList.add('wrongElem')
                        setTimeout(() => {
                            popupImage.classList.remove('wrongElem')
                        }, 250);
                    }
                    break;
                case "EW":
                    if ((rotation + 90) % 180 == 0 && currentImageIndex == 0) {
                        const imgElement = clickedCell.querySelector('img');
                        imgElement.src = obstacleImages[currentImageIndex];
                        // imgElement.style.transform = `rotate(${rotation}deg)`;
                        placeTiles(currentImageIndex, rotation, p);
                        closePopUp()
                    } else {
                        popupImage.classList.add('wrongElem')
                        setTimeout(() => {
                            popupImage.classList.remove('wrongElem')
                        }, 250);
                    }
                    break;
            }

        } else {
            const imgElement = clickedCell.querySelector('img');
            imgElement.src = images[currentImageIndex];
            imgElement.style.transform = `rotate(${rotation}deg)`;
            placeTiles(currentImageIndex, rotation, p);
            closePopUp()
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (popUpOpened) {
        if (event.key === 'ArrowUp') {

            currentImageIndex = (currentImageIndex + 1) % images.length;
            popupImage.src = images[currentImageIndex];
        } else if (event.key === 'ArrowDown') {

            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            popupImage.src = images[currentImageIndex];
        } else if (event.key === 'ArrowRight') {
            if ((rotation + 90) == 450) {
                popupImage.style.transition = 'none'
            }
            rotation = (rotation + 90) % 450
            popupImage.style.rotate = JSON.stringify(rotation) + "deg"
            setTimeout(() => {
                popupImage.style.transition = '0.3s'
            }, 10)
        } else if (event.key === 'ArrowLeft') {
            if ((rotation - 90) == -450) {
                popupImage.style.transition = 'none'
            }
            rotation = (rotation - 90) % 450
            popupImage.style.rotate = JSON.stringify(rotation) + "deg"
            setTimeout(() => {
                popupImage.style.transition = '0.3s'
            }, 10)
        } else if (event.key === 'Enter' && clickedCell) {
            const p = getCellPosition(clickedCell)
            if (map[p[0]][p[1]][1] == "turn") {

                switch (map[p[0]][p[1]][3]) {
                    case "NW":
                        if ((rotation == 0 || Math.abs(rotation) == 360) && currentImageIndex == 1) {
                            const imgElement = clickedCell.querySelector('img');
                            imgElement.src = obstacleImages[currentImageIndex];
                            imgElement.style.transform = `rotate(${rotation}deg)`;
                            placeTiles(currentImageIndex, rotation, p);
                            closePopUp()
                        } else {
                            popupImage.classList.add('wrongElem')
                            setTimeout(() => {
                                popupImage.classList.remove('wrongElem')
                            }, 250);
                        }
                        break;
                    case "NE":
                        if ((rotation == 90 || rotation == -270) && currentImageIndex == 1) {
                            const imgElement = clickedCell.querySelector('img');
                            imgElement.src = obstacleImages[currentImageIndex];
                            imgElement.style.transform = `rotate(${rotation}deg)`;
                            placeTiles(currentImageIndex, rotation, p);
                            closePopUp()
                        } else {
                            popupImage.classList.add('wrongElem')
                            setTimeout(() => {
                                popupImage.classList.remove('wrongElem')
                            }, 250);
                        }
                        break;
                    case "SW":
                        if ((rotation == 270 || rotation == -90) && currentImageIndex == 1) {
                            const imgElement = clickedCell.querySelector('img');
                            imgElement.src = obstacleImages[currentImageIndex];
                            imgElement.style.transform = `rotate(${rotation}deg)`;
                            placeTiles(currentImageIndex, rotation, p);
                            closePopUp()
                        } else {
                            popupImage.classList.add('wrongElem')
                            setTimeout(() => {
                                popupImage.classList.remove('wrongElem')
                            }, 250);
                        }
                        break;
                    case "SE":
                        if (Math.abs(rotation) == 180 && currentImageIndex == 1) {
                            const imgElement = clickedCell.querySelector('img');
                            imgElement.src = obstacleImages[currentImageIndex];
                            imgElement.style.transform = `rotate(${rotation}deg)`;
                            placeTiles(currentImageIndex, rotation, p);
                            closePopUp()
                        } else {
                            popupImage.classList.add('wrongElem')
                            setTimeout(() => {
                                popupImage.classList.remove('wrongElem')
                            }, 250);
                        }
                        break;
                }

            } else if (map[p[0]][p[1]][1] == "bridge") {
                switch (map[p[0]][p[1]][3]) {
                    case "SN":
                        if (rotation % 180 == 0 && currentImageIndex == 0) {
                            const imgElement = clickedCell.querySelector('img');
                            imgElement.src = obstacleImages[currentImageIndex];
                            imgElement.style.transform = `rotate(${rotation}deg)`;
                            placeTiles(currentImageIndex, rotation, p);
                            closePopUp()
                        } else {
                            popupImage.classList.add('wrongElem')
                            setTimeout(() => {
                                popupImage.classList.remove('wrongElem')
                            }, 250);
                        }
                        break;
                    case "EW":
                        if ((rotation + 90) % 180 == 0 && currentImageIndex == 0) {
                            const imgElement = clickedCell.querySelector('img');
                            imgElement.src = obstacleImages[currentImageIndex];
                            imgElement.style.transform = `rotate(${rotation}deg)`;
                            placeTiles(currentImageIndex, rotation, p);
                            closePopUp()
                        } else {
                            popupImage.classList.add('wrongElem')
                            setTimeout(() => {
                                popupImage.classList.remove('wrongElem')
                            }, 250);
                        }
                        break;
                }

            } else {
                const imgElement = clickedCell.querySelector('img');
                imgElement.src = images[currentImageIndex];
                imgElement.style.transform = `rotate(${rotation}deg)`;
                placeTiles(currentImageIndex, rotation, p);
                closePopUp()
            }
        } else if (event.key === 'Escape') {
            const popup = document.querySelector('#popup');
            popup.style.opacity = '0';
            popup.style.zIndex = '-1';
            popUpOpened = false;
        }
    }
});

closeIcon.addEventListener('click', () => {
    const popup = document.querySelector('#popup');
    popup.style.opacity = '0';
    popup.style.zIndex = '-1';
    popUpOpened = false;
});

document.addEventListener('click', (event) => {
    const popup = document.querySelector('#popup');
    if (!otherClick && !popup.contains(event.target)) {
        popup.style.opacity = '0';
        popup.style.zIndex = '-1';
        popUpOpened = false;
    }
});

function startTimer(duration) {
    const display = document.querySelector('.timerText');
    timer = duration;
    let minutes = 0, seconds = 0;

    timerID = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        timer++;
    }, 1000);
}

saveStatus.addEventListener('click', () => {
    SavedGames.push({ map: structuredClone(map), name: Names[Names.length - 1], time: timer, difficulty: map.length, emptySp: emptySpace, allPlac: allPlaced });
    localStorage.setItem('Games', JSON.stringify(SavedGames))
    GamesIsSaved.style.display = 'block';
    GamesIsSaved.classList.add('fadeUp');
    saveStatus.disabled = true;
    setTimeout(() => {
        GamesIsSaved.style.display = 'none';
        GamesIsSaved.classList.remove('fadeUp');
        saveStatus.disabled = false;
    }, 3000)

    console.log('Saved')
})

function topScores() {
    const tableBody = document.querySelector('.scrollableTable tbody');
    let diff = map.length;
    let topscorecounter = 0;
    topList.sort((a, b) => b.time - a.time);
    topList.reverse()
    tableBody.innerHTML = "";
    for (const player of topList) {
        if (player.difficulty == diff) {
            const row = tableBody.insertRow();
            const nameCell = row.insertCell();
            const timeCell = row.insertCell();
            nameCell.textContent = player.name;

            let minutes = parseInt(player.time / 60, 10);
            let seconds = parseInt(player.time % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timeCell.textContent = minutes + ":" + seconds;
            topscorecounter++;

            if (topscorecounter >= 10) {
                break;
            }
        }
    }
    if (topscorecounter == 0) {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        const timeCell = row.insertCell();
        nameCell.textContent = 'None';
        timeCell.textContent = 'None';
    }
}

function placeTiles(tile, rotation, position) {
    let [x, y] = position;
    let cell = tile == 0 ? "straight" : "curve"
    let dir = null;
    if (cell == "straight") {
        dir = rotation % 180 == 0 ? "SN" : "EW"
    } else {
        if (Math.abs(rotation) == 180) {
            dir = "SE";
        } else if (rotation == 270 || rotation == -90) {
            dir = "SW"
        } else if (rotation == 90 || rotation == -270) {
            dir = "NE"
        } else if (rotation == 0 || Math.abs(rotation) == 360) {
            dir = "NW";
        }
    }

    if (map[x][y][1] == "empty" && map[x][y][4] == false) {
        allPlaced--;
        map[x][y][4] = true;
    }

    if ((map[x][y][1] == "bridge" || map[x][y][1] == "turn") && map[x][y][4] == false) {
        allPlaced--;
        map[x][y][4] = true;
        if (allPlaced <= 0) {
            console.log("Most cskkolja")
            checkRoute()
        }
        return;
    }

    switch (dir) {
        case "SN":
            map[x][y][1] = map[x][y][1] == "bridge" ? "bridge" : "straight";
            map[x][y][3] = "SN"
            break;
        case "EW":
            map[x][y][1] = map[x][y][1] == "bridge" ? "bridge" : "straight";
            map[x][y][3] = "EW";
            break;
        case "SE":
            map[x][y][1] = map[x][y][1] == "turn" ? "turn" : "curve"
            map[x][y][3] = "SE"
            break;
        case "SW":
            map[x][y][1] = map[x][y][1] == "turn" ? "turn" : "curve"
            map[x][y][3] = "SW"
            break;
        case "NE":
            map[x][y][1] = map[x][y][1] == "turn" ? "turn" : "curve"
            map[x][y][3] = "NE"
            break;
        case "NW":
            map[x][y][1] = map[x][y][1] == "turn" ? "turn" : "curve"
            map[x][y][3] = "NW"
            break;

    }

    printGrid(3)
    console.log(allPlaced)
    if (allPlaced <= 0) {
        console.log("Most cskkolja")
        checkRoute()
    }
}

/* function setDir() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            let x = i;
            let y = j;
            switch (map[i][j][3]) {
                case "SN":
                    if (isInside(x, y + 1)) {
                        map[x][y + 1][3].replaceAll('E', '')
                    }
                    if (isInside(x, y - 1)) {
                        map[x][y - 1][3].replaceAll('W', '')
                    }
                    break;
                case "EW":
                    if (isInside(x + 1, y)) {
                        map[x + 1][y][3].replaceAll('N', '')
                    }
                    if (isInside(x - 1, y)) {
                        map[x - 1][y][3].replaceAll('S', '')
                    }
                    break;


                case "SE":
                    if (isInside(x, y + 1)) {
                        map[x][y + 1][3].replaceAll('E', '')
                    }
                    if (isInside(x + 1, y)) {
                        map[x + 1][y][3].replaceAll('S', '')
                    }
                    break;
                case "SW":
                    if (isInside(x + 1, y)) {
                        map[x + 1][y][3].replaceAll('S', '')
                    }
                    if (isInside(x, y - 1)) {
                        map[x][y - 1][3].replaceAll('W', '')
                    }
                    break;
                case "NE":
                    if (isInside(x - 1, y)) {
                        map[x - 1][y][3].replaceAll('N', '')
                    }
                    if (isInside(x, y + 1)) {
                        map[x][y + 1][3].replaceAll('E', '')
                    }
                    break;
                case "NW":
                    if (isInside(x - 1, y)) {
                        map[x - 1][y][3].replaceAll('N', '')
                    }
                    if (isInside(x, y - 1)) {
                        map[x][y - 1][3].replaceAll('W', '')
                    }
                    break;
            }
        }
    }
} */

function setDir() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let x = i;
            let y = j;
            switch (map[i][j][3]) {
                case "SN":
                    if (isInside(x, y + 1)) {
                        map[x][y + 1][3] = map[x][y + 1][3].replaceAll('E', '');
                    }
                    if (isInside(x, y - 1)) {
                        map[x][y - 1][3] = map[x][y - 1][3].replaceAll('W', '');
                    }
                    break;
                case "EW":
                    if (isInside(x + 1, y)) {
                        map[x + 1][y][3] = map[x + 1][y][3].replaceAll('S', '');
                    }
                    if (isInside(x - 1, y)) {
                        map[x - 1][y][3] = map[x - 1][y][3].replaceAll('N', '');
                    }
                    break;
                case "SE":
                    if (isInside(x, y + 1)) {
                        map[x][y + 1][3] = map[x][y + 1][3].replaceAll('E', '');
                    }
                    if (isInside(x + 1, y)) {
                        map[x + 1][y][3] = map[x + 1][y][3].replaceAll('S', '');
                    }
                    break;
                case "SW":
                    if (isInside(x + 1, y)) {
                        map[x + 1][y][3] = map[x + 1][y][3].replaceAll('S', '');
                    }
                    if (isInside(x, y - 1)) {
                        map[x][y - 1][3] = map[x][y - 1][3].replaceAll('W', '');
                    }
                    break;
                case "NE":
                    if (isInside(x - 1, y)) {
                        map[x - 1][y][3] = map[x - 1][y][3].replaceAll('N', '');
                    }
                    if (isInside(x, y + 1)) {
                        map[x][y + 1][3] = map[x][y + 1][3].replaceAll('E', '');
                    }
                    break;
                case "NW":
                    if (isInside(x - 1, y)) {
                        map[x - 1][y][3] = map[x - 1][y][3].replaceAll('N', '');
                    }
                    if (isInside(x, y - 1)) {
                        map[x][y - 1][3] = map[x][y - 1][3].replaceAll('W', '');
                    }
                    break;
            }
        }
    }
}

function stopTimer() {
    clearInterval(timerID);
}

let looproute = false;

function checkRoute() {
    const display = document.querySelector('.timerText');
    setDir()
    resetRoute()
    findLoopPath(emptySpace[0][0], emptySpace[0][1], "", 0)
    looproute = false;
    check2Length()
    if (pathFound && looproute) {
        console.log("Nyertél");
        topList.push({ name: Names[Names.length - 1], time: timer, difficulty: map.length });
        localStorage.setItem('TopList', JSON.stringify(topList));
        display.classList.add('successfull')
        stopTimer()
        topScores()
        saveStatus.disabled = true;
        YouWon.style.display = 'block';
        YouWon.classList.add('fadeUp2');
        closePopUp()
        removeClickListeners()
        console.log(pathFound, route, totalFreeTiles)
        printGrid(3)
    } else {
        console.log(pathFound, route, totalFreeTiles)
        printGrid(3)
        map = JSON.parse(JSON.stringify(resetWithoutRails))
        allPlaced = emptySpace.length;
        display.classList.add('plusTime')
        timer += 60;
        generateTable(map.length)
        setTimeout(() => {
            display.classList.remove('plusTime')
        }, 1000)
        
    }
}

function removeEventL() {
    const table = document.querySelector('.tbody');
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            const cell = table.rows[i].cells[j];
            cell.removeEventListener('click', showPopup);
            cell.classList.add('donetable')
        }
    }
}

function removeClickListeners() {
    const table = document.querySelector('.tbody');
    const imgs = table.querySelectorAll('img');
    imgs.forEach((img) => {
        img.removeEventListener('click', imgClickHandler);
        img.classList.add('donetable')
    });
}

function closePopUp() {
    const popup = document.querySelector('#popup');
    popup.style.opacity = '0';
    popup.style.zIndex = '-1';
    popUpOpened = false;
}

function check2Length(){
    for (let i =0; i < map.length; i++){
        for (let j = 0; j < map.length; j++){
            if (map[i][j][1] != "puddle"){
                if (map[i][j][3].length >= 2){
                    looproute = true;
                } else {
                    looproute = false;
                    return;
                }
            }
        }
    }
}

//1: puddle, 2: hid, 3: kanyar
//[x,y,irany] 
const map1 = [["puddle", [0, 2, "NSEW"], [0, 3, "NSEW"], [4, 6, "NSEW"]],
["bridge", [0, 5, "EW"], [1, 0, "SN"], [2, 2, "SN"], [4, 4, "EW"], [6, 3, "EW"]],
["turn", [0, 1, "NE"], [4, 0, "SW"], [4, 2, "NE"], [3, 3, "SW"]]]

const map2 = [["puddle", [0, 2, "NSEW"], [4, 1, "NSEW"], [6, 2, "NSEW"]],
["bridge", [1, 0, "SN"], [1, 2, "EW"], [2, 2, "EW"], [2, 6, "SN"]],
["turn", [3, 0, "NW"], [1, 5, "SE"], [4, 3, "NE"], [5, 1, "NW"]]]

const map3 = [["puddle", [2, 0, "NSEW"], [4, 1, "NSEW"], [6, 2, "NSEW"]],
["bridge", [0, 2, "EW"], [1, 6, "SN"], [4, 4, "EW"], [5, 0, "SN"]],
["turn", [2, 2, "SW"], [4, 2, "SW"], [6, 3, "SW"], [5, 5, "NE"]]]

const map4 = [["puddle", [3, 3, "NSEW"]],
["bridge", [5, 0, "SN"], [3, 1, "EW"], [1, 3, "SN"], [3, 5, "EW"]],
["turn", [2, 2, "SW"], [1, 5, "SE"], [4, 2, "SE"], [4, 4, "NE"], [5, 5, "SW"]]]

const map5 = [["puddle", [4, 4, "NSEW"]],
["bridge", [2, 1, "EW"], [2, 2, "EW"], [5, 3, "SN"]],
["turn", [1, 5, "NW"], [2, 4, "NE"], [4, 2, "NW"], [5, 1, "SE"]]]
const maps = [[map1, 3], [map2, 3], [map3, 3], [map4, 1], [map5, 1]]

function map7x7() {
    resetVariables()
    initializeMap(7)
    let rand = getRandomInt(0, 4)
    let m = maps[rand][0]
    let n = 49 - maps[rand][1]
    for (let i = 0; i < m.length; i++) {
        for (let j = 1; j < m[i].length; j++) {
            map[m[i][j][0]][m[i][j][1]][1] = m[i][0];
            map[m[i][j][0]][m[i][j][1]][3] = m[i][j][2];

            if (m[i][0] == "puddle") {
                emptySpace.splice(((m[i][j][0] + 1) * m[i][j][1]), 1)
            }
        }
    }



    topScores(7)
    allPlaced = n
    resetWithoutRails = structuredClone(map);
    generateTable(7)

}