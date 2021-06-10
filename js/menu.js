'use strict';


const PathToLevels = document.location.origin + '/levels/';
const LevelFolderName = 'level_';

let gameNavHTML = document.getElementById('game-nav');
let gameStartButtonHTML = document.getElementById('start-button');
let resetPositionButtonHTML = document.getElementById('reset-button');;

window.onload = () => {
    if(document.cookie == "") {
        resetPositionButtonHTML.style.display = "none";
    }
}

resetPositionButtonHTML.onclick = () => {
    setCookie('current-level', JSON.stringify({ date: Date.now(), index: JSON.parse(getCookie('current-level')).index, scenePositionX: -400, scenePositionY: -400}), { secure: true, 'max-age': CookieMaxAge });
}

gameStartButtonHTML.onclick = () => {
    if (document.cookie == '') {
        setCookie('current-level', JSON.stringify({ date: Date.now(), index: 1, scenePositionX: -400, scenePositionY: -400}), { secure: true, 'max-age': CookieMaxAge });
        setCookie('game-information', JSON.stringify({ levelFolderName: LevelFolderName, pathToLevels: PathToLevels }), { secure: true, 'max-age': CookieMaxAge });
        document.location.href = PathToLevels + LevelFolderName + JSON.parse(getCookie('current-level')).index + '/index.html';
        return;
    }

    document.location.replace(PathToLevels + LevelFolderName + JSON.parse(getCookie('current-level')).index + '/index.html');
    console.log(document.cookie);
}

/*



document.addEventListener('click', (event) => {
    if (event.target.nodeName == 'BUTTON' && event.target.classList.contains('levelButton')) {
        console.log(PathToLevels + event.target.value + '/index.html');
        document.location.href = PathToLevels + event.target.value + '/index.html';
    }
})

let blockDivHTML = document.createElement('div');

blockDivHTML.classList.add(blocksClassCSS);
        blockDivHTML.setAttribute('id', blocksIdCSS + '_' + blockIndex);
        availableLevelsHTML.append(blockDivHTML);

*/