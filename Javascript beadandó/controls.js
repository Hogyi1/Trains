const maintitle = document.querySelector('.thumbnail-text');
const backgroundBlur = document.querySelector('.thumbnail')
const mainMenu = document.querySelector('.menu')
const title = document.querySelector('.title2');

setTimeout(() => {
    maintitle.classList.add('visible');
}, 1000); 


document.addEventListener('click', triggerAnimation);
document.addEventListener('keydown', triggerAnimation);

function triggerAnimation(){
    maintitle.classList.remove('visible');
    backgroundBlur.classList.add('visible');


    document.removeEventListener('click', triggerAnimation);
    document.removeEventListener('keydown', triggerAnimation);


    setTimeout(() => {
        mainMenu.style.display = 'flex'
        backgroundBlur.style.display = 'none'
        mainMenu.classList.add('revealed')
    }, 1000); 

}





//Buttons
const newGameButton = document.querySelector('#NewGame');
const savedGameButton = document.querySelector('#SavedGame');
const descriptionButton = document.querySelector('#Description');
const scoreBoardButton = document.querySelector('#ScoreBoard');
const backBtn = document.querySelector('#BackBtn');

//Menus
const descriptionMenu = document.querySelector('.DescriptionMenu');
const startMenu = document.querySelector('.StartMenu');
const optionMenu = document.querySelector('.OptionMenu');
const savedGameMenu = document.querySelector('.SavedGameMenu');
const scoreBoardMenu = document.querySelector('.ScoreBoardMenu');
const Game = document.querySelector('.game');
const sideBarMenu = document.querySelector('.sideGameBar');
const Menus = [descriptionMenu, startMenu, savedGameMenu, scoreBoardMenu, sideBarMenu];
let popUpOpened2 = false;
const upIcon2 = document.querySelector('.Up2');
const downIcon2 = document.querySelector('.Down2');
const leftIcon2 = document.querySelector('.Left2');
const rightIcon2 = document.querySelector('.Right2');
let currentImageIndex2 = 0;
let rotation2 = 0;
const images2 = ['./pics/tiles/straight_rail.png', './pics/tiles/curve_rail.png'];
const popupImage2 = document.querySelector('#popup2 img');
optionMenu.classList.add('revealed')


function savedGames() {
    const tableBody2 = document.querySelector('.tbody2');
    tableBody2.innerHTML = "";
    SavedGames.reverse()
    for (const game of SavedGames) {
        const row = tableBody2.insertRow();
        const nameCell = row.insertCell();
        const timeCell = row.insertCell();
        const diffCell = row.insertCell();
        const btnCell = row.insertCell();
        nameCell.textContent = game.name;
        timeCell.textContent = game.time;
        diffCell.textContent = game.difficulty == 5 ? 'Easy' : 'Hard'

        const button = document.createElement('button');
        button.textContent = 'Play';
        button.addEventListener('click', () => {
            continuePlaying(game.name, game.time, game.map, game.emptySp, game.allPlac)
        });
        button.classList.add('btn', 'playbtn')
        btnCell.appendChild(button);

        let minutes = parseInt(game.time / 60, 10);
        let seconds = parseInt(game.time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timeCell.textContent = minutes + ":" + seconds;

    }
    if (SavedGames.length == 0) {
        const row = tableBody2.insertRow();
        const nameCell = row.insertCell();
        const timeCell = row.insertCell();
        const diffCell = row.insertCell();
        const btnCell = row.insertCell();
        nameCell.textContent = 'None';
        timeCell.textContent = 'None';
        diffCell.textContent = 'None';
        btnCell.textContent = 'None';
    }
}

function scoreBoard() {
    const tableBody01 = document.querySelector('.tbody3');
    const tableBody02 = document.querySelector('.tbody4')
    let easy = 1;
    let hard = 1;
    tableBody01.innerHTML = "";
    tableBody02.innerHTML = "";
    topList.sort((a, b) => b.time - a.time);
    topList.reverse()
    for (const player of topList) {
        let minutes = parseInt(player.time / 60, 10);
        let seconds = parseInt(player.time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (player.difficulty == 5 && easy <= 11) {
            const row = tableBody01.insertRow();
            const idCell = row.insertCell();
            const nameCell = row.insertCell();
            const timeCell = row.insertCell();
            nameCell.textContent = player.name;
            timeCell.textContent = minutes + ":" + seconds;
            idCell.textContent = "#" + easy 

            easy++;

        } else if (player.difficulty == 7 && hard <= 11){
            const row2 = tableBody02.insertRow();
            const idCell2 = row2.insertCell();
            const nameCell2 = row2.insertCell();
            const timeCell2 = row2.insertCell();
            nameCell2.textContent = player.name;
            timeCell2.textContent = minutes + ":" + seconds;
            idCell2.textContent = "#" + hard 
            hard++;
        }
    }
    if (easy == 1) {
        const row = tableBody01.insertRow();
        const idCell = row.insertCell();
        const nameCell = row.insertCell();
        const timeCell = row.insertCell();
        nameCell.textContent = 'None';
        timeCell.textContent = 'None';
        idCell.textContent = "#0"
    }
    if (hard == 1) {
        const row = tableBody02.insertRow();
        const idCell = row.insertCell();
        const nameCell = row.insertCell();
        const timeCell = row.insertCell();
        nameCell.textContent = 'None';
        timeCell.textContent = 'None';
        idCell.textContent = "#0"
    }
}

newGameButton.addEventListener('click', () => {
    optionMenu.classList.remove('revealed');
    title.style.top = "50px";
    mainMenu.style.width = "50vw"
    setTimeout(() => {
        optionMenu.style.display = "none";
        startMenu.style.display = 'flex'
        startMenu.classList.add('revealed');
        backBtn.classList.add('revealed')
    }, 500);

});

savedGameButton.addEventListener('click', () => {
    optionMenu.classList.remove('revealed');
    title.style.top = "50px";
    mainMenu.style.width = "50vw"
    mainMenu.style.height = "100vh"

    savedGames()
    setTimeout(() => {
        optionMenu.style.display = "none";
        savedGameMenu.style.display = 'flex'
        savedGameMenu.classList.add('revealed');
    }, 500);
    backBtn.classList.add('revealed')

});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {

        currentImageIndex2 = (currentImageIndex2 + 1) % images2.length;
        popupImage2.src = images2[currentImageIndex2];
    } else if (event.key === 'ArrowDown') {

        currentImageIndex2 = (currentImageIndex2 - 1 + images2.length) % images2.length;
        popupImage2.src = images2[currentImageIndex2];
    } else if (event.key === 'ArrowRight') {
        if ((rotation2 + 90) == 450) {
            popupImage2.style.transition = 'none'
        }
        rotation2 = (rotation2 + 90) % 450
        popupImage2.style.rotate = JSON.stringify(rotation2) + "deg"
        setTimeout(() => {
            popupImage2.style.transition = '0.3s'
        }, 10)
    } else if (event.key === 'ArrowLeft') {
        if ((rotation2 - 90) == -450) {
            popupImage2.style.transition = 'none'
        }
        rotation2 = (rotation2 - 90) % 450
        popupImage2.style.rotate = JSON.stringify(rotation2) + "deg"
        setTimeout(() => {
            popupImage2.style.transition = '0.3s'
        }, 10)
    }
});

upIcon2.addEventListener('click', (event) => {
    currentImageIndex2 = (currentImageIndex2 + 1) % images2.length;
    popupImage2.src = images2[currentImageIndex2];

});

downIcon2.addEventListener('click', () => {


    currentImageIndex2 = (currentImageIndex2 - 1 + images2.length) % images2.length;
    popupImage2.src = images2[currentImageIndex2];

});

leftIcon2.addEventListener('click', () => {

    if (rotation2 - 90 == -450) {
        popupImage2.style.transition = 'none'
    }
    rotation2 = (rotation2 - 90) % 450
    popupImage2.style.rotate = JSON.stringify(rotation2) + "deg"
    setTimeout(() => {
        popupImage2.style.transition = '0.3s'
    }, 10)

});

rightIcon2.addEventListener('click', () => {

    if ((rotation2 + 90) == 450) {
        popupImage2.style.transition = 'none'
    }
    rotation2 = (rotation2 + 90) % 450
    popupImage2.style.rotate = JSON.stringify(rotation2) + "deg"
    setTimeout(() => {
        popupImage2.style.transition = '0.3s'
    }, 10)

});

descriptionButton.addEventListener('click', () => {
    optionMenu.classList.remove('revealed');
    title.style.top = "50px";
    mainMenu.style.width = "80vw"
    mainMenu.style.height = "100vh"

    setTimeout(() => {
        optionMenu.style.display = "none";
        descriptionMenu.classList.add('revealed');
        descriptionMenu.style.display = 'flex'
        backBtn.classList.add('revealed');
    }, 500);


});

scoreBoardButton.addEventListener('click', () => {
    optionMenu.classList.remove('revealed');
    title.style.top = "50px";
    mainMenu.style.width = "50vw"
    mainMenu.style.height = "100vh"
    scoreBoard()
    setTimeout(() => {
        optionMenu.style.display = "none";
        scoreBoardMenu.style.display = 'flex'
        scoreBoardMenu.classList.add('revealed');
    }, 500);
    backBtn.classList.add('revealed')

});

backBtn.addEventListener('click', () => {
    const display = document.querySelector('.timerText')
    mainMenu.style.width = "30vw"
    mainMenu.style.height = "80vh"
    Game.classList.add('zoomOut')
    for (let i = 0; i < Menus.length; i++) {
        Menus[i].classList.remove('revealed')
    }
    setTimeout(() => {
        for (let i = 0; i < Menus.length; i++) {
            Menus[i].style.display = "none";
        }
        optionMenu.style.display = "flex";
        optionMenu.classList.add('revealed');
        Game.style.display = 'none'
    }, 600);
    title.style.top = "20%";
    display.classList.remove('plusTime')
    backBtn.classList.remove('revealed')
});


