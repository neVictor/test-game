// поиск html блоков 
let gameMap = document.getElementById('game-map');
let hero = document.getElementById('hero');
let levelBlocks = gameMap.getElementsByClassName('game-map__block');
let relativePos = document.getElementById('relative-pos');

let KeyPressed = new Set();

let gameMapPosition = {
    x: 100,
    y: 100,
    step: 6,
}

let heroDesc = { activeSprite: 'stand' };

document.addEventListener('keydown', (event) => { KeyPressed.add(event.code); heroVectorCheck() });
document.addEventListener('keyup', (event) => { KeyPressed.delete(event.code); heroVectorCheck() });


function heroVectorCheck() {
    function vectorСhange(heroObj, activeClass, newSpriteName) {
        document.getElementById(heroObj.activeSprite).classList.remove(activeClass);
        document.getElementById(newSpriteName).classList.add(activeClass);
        heroObj.activeSprite = newSpriteName;
    }

    KeyPressed.forEach((value) => {
        if (value == 'KeyA') { document.getElementById(heroDesc.activeSprite).classList.add('rotete') };
        if (value == 'KeyD') { document.getElementById(heroDesc.activeSprite).classList.remove('rotete') };

        if (value == 'KeyS' && KeyPressed.size <= 1) { vectorСhange(heroDesc, 'hero__img-active', 'stand'); return };
        if ((value == 'KeyA' || value == 'KeyD') && KeyPressed.size <= 1) { vectorСhange(heroDesc, 'hero__img-active', 'rotate'); return; };

        if (value == 'KeyW') { vectorСhange(heroDesc, 'hero__img-active', 'back') };
        if (value == 'KeyS') { vectorСhange(heroDesc, 'hero__img-active', 'rotate') };
    });
}

//основная функция игры (обновление разз в 10 милисикунд)
setInterval(() => {
    if (KeyPressed.size == 0) return;
    gameMapPosition.step = KeyPressed.size >= 2 ? 4 : 6;

    KeyPressed.forEach((value) => {
        let heroClientRect = hero.getBoundingClientRect();

        // изменение положения карты (не игрока!)
        if (value == 'KeyW') { gameMap.style.top = (gameMapPosition.y += gameMapPosition.step) + 'px' }
        if (value == 'KeyS') { gameMap.style.top = (gameMapPosition.y -= gameMapPosition.step) + 'px' }
        if (value == 'KeyD') { gameMap.style.left = (gameMapPosition.x -= gameMapPosition.step) + 'px' }
        if (value == 'KeyA') { gameMap.style.left = (gameMapPosition.x += gameMapPosition.step) + 'px' }

        // проверка на колизию с блоками 
        for (block of levelBlocks) {
            let blockClientRect = block.getBoundingClientRect();

            // лево - право
            if (value == 'KeyA' && (blockClientRect.x + blockClientRect.width) >= heroClientRect.x &&
            blockClientRect.x <= heroClientRect.x &&
            heroClientRect.y <= (blockClientRect.y + blockClientRect.height) &&
            (heroClientRect.y + heroClientRect.height) >= blockClientRect.y) {
                gameMap.style.left = (gameMapPosition.x -= gameMapPosition.step) + 'px';
                
            }
            if (value == 'KeyD' && (heroClientRect.x + heroClientRect.width) >= blockClientRect.x && 
            heroClientRect.x <= blockClientRect.x && 
            heroClientRect.y <= (blockClientRect.y + blockClientRect.height) &&
            (heroClientRect.y + heroClientRect.height) >= blockClientRect.y) {
                gameMap.style.left = (gameMapPosition.x += gameMapPosition.step) + 'px';  
            }
            // вверх - вниз
            if (value == 'KeyS' && (heroClientRect.y + heroClientRect.height) >= blockClientRect.y && 
            heroClientRect.y <= blockClientRect.y && 
            heroClientRect.x <= (blockClientRect.x + blockClientRect.width) &&
            (heroClientRect.x + heroClientRect.width) >= blockClientRect.x) {
                gameMap.style.top = (gameMapPosition.y += gameMapPosition.step) + 'px';
            }
            if (value == 'KeyW' && (blockClientRect.y + blockClientRect.height) >= heroClientRect.y &&
            blockClientRect.y <= heroClientRect.y &&
            heroClientRect.x <= (blockClientRect.x + blockClientRect.width) &&
            (heroClientRect.x + heroClientRect.width) >= blockClientRect.x) {
                gameMap.style.top = (gameMapPosition.y -= gameMapPosition.step) + 'px';
            } 
        }      
    });
}, 10);