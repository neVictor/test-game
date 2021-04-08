// поиск html блоков 
// основные
let scene = document.getElementById('scene');
let hero = document.getElementById('hero');
// блоки и персонажи
let levelBlocks = scene.getElementsByClassName('scene__block');
let levelСharacters = scene.getElementsByClassName('scene__character');
// инвентарь 
let inventory = document.getElementById('inventory');
let inventoryButton = document.getElementById('inventory-button');
// диалоговые окна 
let speakingWindow = document.getElementById('speaking-window');
let speakingName = document.getElementById('speaking-name');
let speakingText = document.getElementById('speaking-text');
let speakingButtonNext = document.getElementById('speaking-button-next')

// сет для нажатых клавишь
let KeyPressed = new Set();
let testClass = new TestClass(inventory);

// состояние обьектов игры
let sceneInformation = {
    x: -400,
    y: -400,
    step: 6,
}
let heroInformation = {
    stringCount: 0,
    interlocutorName: "",
    activeSprite: 'stand',
    activeSpeaking: false
};
let inventoryItems = [
    { name: '', purpose: '', img: '' },
    { name: '', purpose: '', img: '' },
    { name: '', purpose: '', img: '' },
    { name: '', purpose: '', img: '' },
];
let heroClientRect = hero.getBoundingClientRect();
// отслеживание нажатий
// для клавиатуры: 
document.addEventListener('keydown', (event) => {
    KeyPressed.add(event.code);
    heroVectorCheck();
    if (event.code == 'KeyE') {
        inventory.classList.toggle('inventory__active');
    }
});
document.addEventListener('keyup', (event) => { KeyPressed.delete(event.code); heroVectorCheck() });
// для экрана:
document.addEventListener("pointerdown", (event) => {
    KeyPressed.add(event.target.id);
    heroVectorCheck();
    if (event.target.closest('div').classList.contains('scene__character')) {
        KeyPressed.add("KeyF");
        if (event.target.closest('div').id != '' && heroInformation.interlocutorName == '') heroInformation.interlocutorName = event.target.closest('div').id;
    }
});
document.addEventListener("pointerup", (event) => {
    KeyPressed.delete(event.target.id);
    if (event.target.closest('div').classList.contains('scene__character')) { KeyPressed.delete("KeyF") };
});

// события нажатий на сцене
speakingButtonNext.onclick = () => {
    testClass.scenarioWork(scenario, heroInformation.interlocutorName, heroInformation.stringCount, (scenarioObj, script, status) => {
        if (!status || heroInformation.interlocutorName == '') {
            KeyPressed.delete('KeyF')
            heroInformation.activeSpeaking = false;
            heroInformation.interlocutorName = '';
            heroInformation.stringCount = 0;
            speakingWindow.classList.remove('speaking-window-active');
            return;
        }
        speakingText.innerHTML = scenarioObj.text;
        speakingName.innerHTML = scenarioObj.name;
        if (script === null) {
            console.info(`name: ${heroInformation.interlocutorName}, stringCount: ${heroInformation.stringCount}; script is null`)
        } else {
            script(character, heroClientRect, inventoryItems);
        };
        heroInformation.stringCount++;
    });
}
inventoryButton.onclick = () => {
    inventory.classList.toggle('inventory__active');
}
inventory.onclick = (event) => {
    if (event.target.closest('.inventory__object').children.length == 0) return;
    let inventoryObj = event.target.closest('.inventory__object');
    inventoryItems[inventoryObj.id.split('_')[1]] = {};
    inventory.children[inventoryObj.id.split('_')[1]].innerHTML = '';
    console.log(inventoryObj.id.split('_')[1]);
}

// изменеие (поворот, смена спрайта) персонажа, в зависимости от напраления движения 
function heroVectorCheck() {
    KeyPressed.forEach((value) => {
        if (value == 'KeyA') { hero.getElementsByClassName(heroInformation.activeSprite)[0].style.transform = 'rotateY(180deg)' };
        if (value == 'KeyD') { hero.getElementsByClassName(heroInformation.activeSprite)[0].style.transform = 'rotateY(0)' };

        if ((value == 'KeyA' || value == 'KeyD') && KeyPressed.size <= 1) {
            hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.remove('hero-sprites__img-active');
            heroInformation.activeSprite = 'rotate'
            hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.add('hero-sprites__img-active');
            return;
        };
        if (value == 'KeyW') {
            hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.remove('hero-sprites__img-active');
            heroInformation.activeSprite = 'back';
            hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.add('hero-sprites__img-active')
        };
        if (value == 'KeyS') {
            if (KeyPressed.size <= 1) {
                hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.remove('hero-sprites__img-active');
                heroInformation.activeSprite = 'stand'
                hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.add('hero-sprites__img-active');
                return;
            };
            hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.remove('hero-sprites__img-active');
            heroInformation.activeSprite = 'rotate'
            hero.getElementsByClassName(heroInformation.activeSprite)[0].classList.add('hero-sprites__img-active');
        };
    });
}

setInterval(() => {
    heroClientRect = hero.getBoundingClientRect();
}, 500);

//основная функция игры (обновление разз в 10 милисикунд)
setInterval(() => {
    // не включать цикл без нажатых клавиш
    if (KeyPressed.size == 0) return;
    sceneStep = KeyPressed.size >= 2 ? (sceneInformation.step * 0.7) : sceneInformation.step;
    // проверка на нахождение героя возле персонажей  
    for (character of levelСharacters) {
        let characterClientRect = character.getBoundingClientRect();
        // проверка расстояний 
        if (testClass.checkCollision(characterClientRect, heroClientRect, 50, 50)) {
            character.classList.add('scene__character-near');
            // проверка на в F в сете и другие активные диалоги
            if (KeyPressed.has('KeyF') && heroInformation.interlocutorName == '') heroInformation.interlocutorName = character.id;

            if (KeyPressed.has('KeyF') && !heroInformation.activeSpeaking && heroInformation.interlocutorName != '') {
                testClass.scenarioWork(scenario, heroInformation.interlocutorName, heroInformation.stringCount, (scenarioObj, script, status) => {
                    heroInformation.activeSpeaking = true;
                    speakingWindow.classList.add('speaking-window-active');
                    speakingText.innerHTML = scenarioObj.text;
                    speakingName.innerHTML = scenarioObj.name;
                    if (script === null) {
                        console.info(`name: ${heroInformation.interlocutorName}, stringCount: ${heroInformation.stringCount}; script is null`)
                    } else {
                        script(character, heroClientRect, inventory);
                    };
                    heroInformation.stringCount++;
                });
            }
        } else {
            if (heroInformation.interlocutorName == character.id) {
                heroInformation.activeSpeaking = false;
                heroInformation.stringCount = 0;
                heroInformation.interlocutorName = '';
                speakingWindow.classList.remove('speaking-window-active');
            }
            // если персонаж отошел то: 
            character.classList.remove('scene__character-near');
        }
    };
    // изменение положения карты (не игрока!)
    if (KeyPressed.has('KeyW')) { scene.style.top = (sceneInformation.y += sceneStep) + 'px' }
    if (KeyPressed.has('KeyS')) { scene.style.top = (sceneInformation.y -= sceneStep) + 'px' }
    if (KeyPressed.has('KeyD')) { scene.style.left = (sceneInformation.x -= sceneStep) + 'px' }
    if (KeyPressed.has('KeyA')) { scene.style.left = (sceneInformation.x += sceneStep) + 'px' }
    // проверка на колизию с блоками 
    for (block of levelBlocks) {
        let blockClientRect = block.getBoundingClientRect();
        if (testClass.checkCollision(heroClientRect, blockClientRect, 0, -100)) {

            if (KeyPressed.has('KeyD')) scene.style.left = (sceneInformation.x += sceneStep) + 'px';
            if (KeyPressed.has('KeyA')) scene.style.left = (sceneInformation.x -= sceneStep) + 'px';
            if (KeyPressed.has('KeyS')) scene.style.top = (sceneInformation.y += sceneStep) + 'px';
            if (KeyPressed.has('KeyW')) scene.style.top = (sceneInformation.y -= sceneStep) + 'px';
        }
    };
}, 10);

