// поиск html блоков 
let scene = document.getElementById('scene');
let hero = document.getElementById('hero-sprites');
let levelBlocks = scene.getElementsByClassName('scene__block');
let controlls = document.getElementById('controlls');


let KeyPressed = new Set();

let scenePosition = {
    x: 0,
    y: 0,
    step: 6,
}

let heroDesc = { activeSprite: 'stand' };

document.addEventListener('keydown', (event) => { KeyPressed.add(event.code); heroVectorCheck() });
document.addEventListener('keyup', (event) => { KeyPressed.delete(event.code); heroVectorCheck() });

controlls.addEventListener("pointerdown", (event) => { KeyPressed.add(event.target.id); if (event.target.id == "controlls") KeyPressed.clear(); heroVectorCheck()});
controlls.addEventListener("pointerup", (event) => { KeyPressed.delete(event.target.id); if (event.target.id == "controlls") KeyPressed.clear(); heroVectorCheck()});
controlls.addEventListener("pointerleave", (event) => { if (event.target.id == "controlls") KeyPressed.clear()} );


function heroVectorCheck() {
    function vectorСhange(heroObj, activeClass, newSpriteName) {
        document.getElementById(heroObj.activeSprite).classList.remove(activeClass);
        document.getElementById(newSpriteName).classList.add(activeClass);
        heroObj.activeSprite = newSpriteName;
    }

    KeyPressed.forEach((value) => {
        if (value == 'KeyA') { document.getElementById(heroDesc.activeSprite).classList.add('rotete') };
        if (value == 'KeyD') { document.getElementById(heroDesc.activeSprite).classList.remove('rotete') };

        if (value == 'KeyS' && KeyPressed.size <= 1) { vectorСhange(heroDesc, 'hero-sprites__img-active', 'stand'); return };
        if ((value == 'KeyA' || value == 'KeyD') && KeyPressed.size <= 1) { vectorСhange(heroDesc, 'hero-sprites__img-active', 'rotate'); return; };

        if (value == 'KeyW') { vectorСhange(heroDesc, 'hero-sprites__img-active', 'back') };
        if (value == 'KeyS') { vectorСhange(heroDesc, 'hero-sprites__img-active', 'rotate') };
    });
}

//основная функция игры (обновление разз в 10 милисикунд)
setInterval(() => {
    if (KeyPressed.size == 0) return;
    scenePosition.step = KeyPressed.size >= 2 ? 4 : 5;

    KeyPressed.forEach((value) => {
        let heroClientRect = hero.getBoundingClientRect();

        // изменение положения карты (не игрока!)
        if (value == 'KeyW') { scene.style.top = (scenePosition.y += scenePosition.step) + 'px' }
        if (value == 'KeyS') { scene.style.top = (scenePosition.y -= scenePosition.step) + 'px' }
        if (value == 'KeyD') { scene.style.left = (scenePosition.x -= scenePosition.step) + 'px' }
        if (value == 'KeyA') { scene.style.left = (scenePosition.x += scenePosition.step) + 'px' }

        // проверка на колизию с блоками 
        for (block of levelBlocks) {
            let blockClientRect = block.getBoundingClientRect();

            // лево - право
            if (value == 'KeyA' && (blockClientRect.x + blockClientRect.width) >= heroClientRect.x &&
                blockClientRect.x <= heroClientRect.x &&
                heroClientRect.y <= (blockClientRect.y + blockClientRect.height) &&
                (heroClientRect.y + heroClientRect.height) >= blockClientRect.y) {
                scene.style.left = (scenePosition.x -= scenePosition.step) + 'px';

            }
            if (value == 'KeyD' && (heroClientRect.x + heroClientRect.width) >= blockClientRect.x &&
                heroClientRect.x <= blockClientRect.x &&
                heroClientRect.y <= (blockClientRect.y + blockClientRect.height) &&
                (heroClientRect.y + heroClientRect.height) >= blockClientRect.y) {
                scene.style.left = (scenePosition.x += scenePosition.step) + 'px';
            }
            // вверх - вниз
            if (value == 'KeyS' && (heroClientRect.y + heroClientRect.height) >= blockClientRect.y &&
                heroClientRect.y <= blockClientRect.y &&
                heroClientRect.x <= (blockClientRect.x + blockClientRect.width) &&
                (heroClientRect.x + heroClientRect.width) >= blockClientRect.x) {
                scene.style.top = (scenePosition.y += scenePosition.step) + 'px';
            }
            if (value == 'KeyW' && (blockClientRect.y + blockClientRect.height) >= heroClientRect.y &&
                blockClientRect.y <= heroClientRect.y &&
                heroClientRect.x <= (blockClientRect.x + blockClientRect.width) &&
                (heroClientRect.x + heroClientRect.width) >= blockClientRect.x) {
                scene.style.top = (scenePosition.y -= scenePosition.step) + 'px';
            }
        }
    });
}, 10);