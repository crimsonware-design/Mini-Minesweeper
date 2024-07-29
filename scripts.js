'use strict';
const container = document.getElementById("container-main");
const modal = document.querySelector(".modal")
const retry= document.querySelector('.retry')

let boardSize = 14;

// please stop reading my god awful code

function init() {
    for (let i = 0; i < boardSize; i++) {
        let rowHTML = `<div class="container container${i+101}">`;
        for (let j = 1; j <= boardSize; j++) {
            const tileClass = (i + j) % 2 === 0 ? 'even' : 'odd';
            rowHTML += `<div class="${tileClass} square tile${j}"></div>`;
        }
        rowHTML += '</div>';
        container.insertAdjacentHTML('afterbegin', rowHTML);
    }
}

function indexTile(container, tile) {
    const cont = document.querySelector(`.container${container+100}`);
    return cont?.querySelector(`.tile${tile}`);
}

function generateMines(mines) {
    for (let i = 0; i < mines; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * boardSize) + 1;
            y = Math.floor(Math.random() * boardSize) + 1;
        } while (indexTile(x, y).classList.contains('mine') || indexTile(x, y).classList.contains('revealed'));

        const tile = indexTile(x, y);
        tile.classList.add('mine');
        // tile.innerHTML = 'M'; // used to test if mines work
    }
}

function checkTile(surroundingTiles) {
    let counter = 0;
    surroundingTiles.forEach(tile => {
        if (indexTile(tile[1], tile[0])?.classList.contains('mine')) {
            counter++;
        }
    });
    return counter;
}

function getSurroundingTiles(x, y) {
    return [
        [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
        [x - 1, y], [x + 1, y],
        [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
    ];
}

let revealedTiles = 0;
function revealTile(x, y) {
    const tile = indexTile(y, x);
    if (tile && !tile.classList.contains('revealed') && !tile.classList.contains('mine') && !tile.classList.contains('flagged')) {
        tile.classList.add('revealed');
        const surroundingMines = checkSurroundingTiles(x, y);
        if (surroundingMines === 0) {
            getSurroundingTiles(x, y).forEach(([nx, ny]) =>{
                revealTile(nx, ny)
            }) 
        } else {
            tile.innerHTML = surroundingMines;
        }
    }
}

function checkSurroundingTiles(x, y) {
    const surroundingTiles = getSurroundingTiles(x, y);
    return checkTile(surroundingTiles);
}

function getTarget(target) {
    const targetNum = +target.classList[2].replace('tile', '');
    let parentTargetNum = target.parentNode.classList[1].replace('container', '') - 100;
    return [targetNum, parentTargetNum];
}

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    const target = e.target.closest('.square').classList;
    target.contains('flagged') ? target.remove('flagged') : target.add('flagged');
});

retry.addEventListener('click', () => location.reload())

let firstClick = true;
document.addEventListener('click', function (e) {
    const target = e.target.closest('.square');
    if (!target.classList.contains('flagged')) {
        const [x, y] = getTarget(target);
        if(target.classList.contains('mine')){
            retry.classList.remove('hidden')
        }
        if (firstClick) {
            generateMines(40);
            firstClick = false;
        }
        revealTile(x, y);
    }
});

init();
