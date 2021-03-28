// поиск html блоков 
let scene = document.getElementById('scene');
let hero = document.getElementById('hero-sprites');

let levelBlocks = scene.getElementsByClassName('scene__block');
let levelСharacters = scene.getElementsByClassName('scene__character');

let controlls = document.getElementById('controlls');

let speakingWindow = document.getElementById('speaking-window');
let speakingName = document.getElementById('speaking-name');
let speakingText = document.getElementById('speaking-text');
let speakingButtonNext = document.getElementById('speaking-button-next')

// сет для нажатых клавишь
let KeyPressed = new Set();

// СОСтояние сцены 
let scenePosition = {
    x: 0,
    y: 0,
    step: 6,
}

// состояние героя
let heroDesc = {
    stringCount: 0,
    interlocutorName: "",
    activeSprite: 'stand',
    activeSpeaking: false
};

// отслеживание нажатий
// для клавиатуры: 
document.addEventListener('keydown', (event) => { KeyPressed.add(event.code); heroVectorCheck() });
document.addEventListener('keyup', (event) => { KeyPressed.delete(event.code); heroVectorCheck() });
// для экрана:
document.addEventListener("pointerdown", (event) => {
    KeyPressed.add(event.target.id);
    heroVectorCheck();

    if (event.target.id == "controlls") KeyPressed.clear();

    if (event.target.closest('div').classList.contains('scene__character')) {
        let character = event.target.closest('div');
        let heroClientRect = hero.getBoundingClientRect();
        let characterClientRect = character.getBoundingClientRect();

        // код повторяется, нужно решить это (потом)
        if ((characterClientRect.x - 50) < (heroClientRect.x + heroClientRect.width) &&
            (characterClientRect.x + characterClientRect.width + 50) > heroClientRect.x &&
            (characterClientRect.y - 50) < (heroClientRect.x + heroClientRect.height) &&
            (characterClientRect.y + characterClientRect.height + 50) > heroClientRect.y) {

            character.classList.add('scene__character-near');

            // проверка на в F в сете и другие активные диалоги
            if (!heroDesc.activeSpeaking && heroDesc.interlocutorName == '') {
                heroDesc.activeSpeaking = true;
                heroDesc.interlocutorName = character.id;

                speakingWindow.classList.add('speaking-window-active');

                speakingName.innerHTML = scenario[character.id][heroDesc.stringCount].name;
                speakingText.innerHTML = scenario[character.id][heroDesc.stringCount].text;
                heroDesc.stringCount++;
            }

        } else {
            if (heroDesc.interlocutorName == character.id) {
                heroDesc.activeSpeaking = false;
                heroDesc.interlocutorName = '';
                speakingWindow.classList.remove('speaking-window-active');
            }
            // если персонаж отошел то: 
            character.classList.remove('scene__character-near');
        }
    };

});
document.addEventListener("pointerup", (event) => { KeyPressed.delete(event.target.id); if (event.target.id == "controlls") KeyPressed.clear(); heroVectorCheck() });
document.addEventListener("pointerleave", (event) => { if (event.target.id == "controlls") KeyPressed.clear() });

// нажатие на кнопку продвижения диалога
speakingButtonNext.onclick = () => {
    speakingCheck(heroDesc, scenario)
}

// изменеие (поворот, смена спрайта) персонажа, в зависимости от напраления движения 

function vectorСhange(heroObj, activeClass, newSpriteName) {
    document.getElementById(heroObj.activeSprite).classList.remove(activeClass);
    document.getElementById(newSpriteName).classList.add(activeClass);
    heroObj.activeSprite = newSpriteName;
}

function heroVectorCheck() {
    KeyPressed.forEach((value) => {
        if (value == 'KeyA') { document.getElementById(heroDesc.activeSprite).classList.add('rotete') };
        if (value == 'KeyD') { document.getElementById(heroDesc.activeSprite).classList.remove('rotete') };

        if (value == 'KeyS' && KeyPressed.size <= 1) { vectorСhange(heroDesc, 'hero-sprites__img-active', 'stand'); return };
        if ((value == 'KeyA' || value == 'KeyD') && KeyPressed.size <= 1) { vectorСhange(heroDesc, 'hero-sprites__img-active', 'rotate'); return; };

        if (value == 'KeyW') { vectorСhange(heroDesc, 'hero-sprites__img-active', 'back') };
        if (value == 'KeyS') { vectorСhange(heroDesc, 'hero-sprites__img-active', 'rotate') };
    });
}
// функция для прокрутки диалога
function speakingCheck(heroDesc, scenario) {
    if (heroDesc.stringCount >= scenario[heroDesc.interlocutorName].length) {
        heroDesc.activeSpeaking = false;
        heroDesc.interlocutorName = '';
        heroDesc.stringCount = 0;
        speakingWindow.classList.remove('speaking-window-active');
        return;
    }
    speakingName.innerHTML = scenario[heroDesc.interlocutorName][heroDesc.stringCount].name;
    speakingText.innerHTML = scenario[heroDesc.interlocutorName][heroDesc.stringCount].text;
    heroDesc.stringCount++;
}

//основная функция игры (обновление разз в 10 милисикунд)
setInterval(() => {
    if (KeyPressed.size == 0) return;
    scenePosition.step = KeyPressed.size >= 2 ? 4 : 5;

    KeyPressed.forEach((value) => {
        let heroClientRect = hero.getBoundingClientRect();

        // проверка на нахождение героя возле персонажей  
        for (character of levelСharacters) {
            let characterClientRect = character.getBoundingClientRect();

            // проверка расстояний 
            if ((characterClientRect.x - 50) < (heroClientRect.x + heroClientRect.width) &&
                (characterClientRect.x + characterClientRect.width + 50) > heroClientRect.x &&
                (characterClientRect.y - 50) < (heroClientRect.x + heroClientRect.height) &&
                (characterClientRect.y + characterClientRect.height + 50) > heroClientRect.y) {

                character.classList.add('scene__character-near');

                // проверка на в F в сете и другие активные диалоги
                if (value == 'KeyF' && !heroDesc.activeSpeaking && heroDesc.interlocutorName == '') {

                    heroDesc.activeSpeaking = true;
                    heroDesc.interlocutorName = character.id;

                    speakingWindow.classList.add('speaking-window-active');

                    speakingName.innerHTML = scenario[character.id][heroDesc.stringCount].name;
                    speakingText.innerHTML = scenario[character.id][heroDesc.stringCount].text;
                    heroDesc.stringCount++;
                }

            } else {
                if (heroDesc.interlocutorName == character.id) {
                    heroDesc.activeSpeaking = false;
                    heroDesc.interlocutorName = '';
                    speakingWindow.classList.remove('speaking-window-active');
                }
                // если персонаж отошел то: 
                character.classList.remove('scene__character-near');
            }
        };

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
        };
    });
}, 10);