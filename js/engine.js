"use strict";


document.getElementById("preloader").remove();

let blocksParameters = getParametersByClassName("scene__blocks");
let charactersParameters = getParametersByClassName("scene__character");
let sceneCharacters = document.getElementsByClassName("scene__character");
let interactionWindow = document.getElementById("interaction-window");
let inventory = document.getElementById("inventory");
let interactionWindowName = document.getElementById("interaction-window-name");

let KeyPressed = new Set();

let heroInformation = new Object();
heroInformation["inventory"] = new Object();
heroInformation["basket"] = new Object();
heroInformation["scenario-position"] = new Array();

const InventorySize = 5;
let sceneInformation = {
    x: parseInt(sceneElementHTML.offsetLeft),
    y: parseInt(sceneElementHTML.offsetTop),
    step: 10,
};

document.addEventListener("keydown", (event) => { KeyPressed.add(event.code) });
document.addEventListener("keyup", (event) => { KeyPressed.delete(event.code) });

document.addEventListener("pointerdown", (event) => {
    if (event.target.closest("div").classList.contains("interaction-window__market-goods")) {
        let itemsList = getDialogueObject(heroInformation["scenario-position"], levelInformation["scenario"])["items-list"];
        if (itemsList === undefined || InventorySize - Object.keys(heroInformation["inventory"]).length <= Object.keys(heroInformation["basket"]).length) return;
        heroInformation["basket"]["item_" + (Object.keys(heroInformation["basket"]).length)] = {
            itemsList: itemsList,
            itemKey: event.target.id,
            itemIcon: levelInformation[itemsList][event.target.closest("div").id]["icon-name"],
        }

        let numberOfItemHTML = document.createElement("span");
        numberOfItemHTML.classList.add("interaction-window__market-goods-number");
        numberOfItemHTML.innerHTML = "*";
        event.target.closest("div").insertAdjacentElement("afterbegin", numberOfItemHTML)
    }

    if (event.target.classList.contains("interaction-window__button-choice")) {
        heroInformation["scenario-position"].push({ dialogueObjectKey: event.target.id, stringIndex: 0 });

        dialogueReader(interactionWindow, interactionWindowName, "interaction-window", levelInformation, itemsListIcons, getDialogueObject(heroInformation["scenario-position"], levelInformation["scenario"]));
    }

    if (event.target.id == "interaction-window-market-discard") {
        let numbersOfItemHTML = document.querySelectorAll(".interaction-window__market-goods-number");

        for (let itemKey in heroInformation["basket"]) {
            if (Object.hasOwnProperty.call(heroInformation["basket"], itemKey)) {
                delete heroInformation["basket"][itemKey];
            }
        }
        for (let index = 0; index < numbersOfItemHTML.length; index++) {
            numbersOfItemHTML[index].remove();

        }
    }

    if (event.target.closest("div").classList.contains("inventory__item")) {
        delete heroInformation["inventory"][event.target.closest("div").id]
        event.target.closest("div").remove();
    }

    if (event.target.closest("div").classList.contains("scene__character") && event.target.closest("div").classList.contains("scene__character-near")) {
        heroInformation["scenario-position"].push({ "dialogueObjectKey": event.target.closest("div").id, stringIndex: 0 });
        interactionWindow.style.display = "block";
        dialogueReader(interactionWindow, interactionWindowName, "interaction-window", levelInformation, itemsListIcons, getDialogueObject(heroInformation["scenario-position"], levelInformation["scenario"]));
    }

    if (event.target.closest("div").classList.contains("controls-panel")) {
        KeyPressed.add(event.target.closest("div").id)
    }

    // controls-panel
});

document.addEventListener("pointerup", (event) => {
    if (event.target.closest("div").classList.contains("controls-panel")) {
        KeyPressed.delete(event.target.closest("div").id)
    }
});

document.getElementById("interaction-window-button-next").onclick = () => {
    heroInformation["stringIndex"]++;
    heroInformation["scenario-position"][heroInformation["scenario-position"].length - 1]["stringIndex"]++;
    let dialogueObject = getDialogueObject(heroInformation["scenario-position"], levelInformation["scenario"]);


    if (dialogueObject === undefined) {
        interactionWindow.style.display = "none";
        heroInformation["scenario-position"].length = 0;

        if (Object.keys(heroInformation["basket"]).length > 0) {
            for (let itemKey in heroInformation["basket"]) {
                if (Object.hasOwnProperty.call(heroInformation["basket"], itemKey)) {
                    delete heroInformation["basket"][itemKey];
                }
            }
        }
        return;
    }

    if (Object.keys(heroInformation["basket"]).length > 0) {
        for (let itemKey in heroInformation["basket"]) {
            if (Object.keys(heroInformation["inventory"]).length >= InventorySize) continue;
            for (let index = 0; index < InventorySize; index++) {
                if (heroInformation["inventory"]["item_" + index] !== undefined || heroInformation["basket"][itemKey] === undefined) continue;
                heroInformation["inventory"]["item_" + index] = heroInformation["basket"][itemKey];
                setItemToInventoryElementHTML(inventory, "inventory", "item_" + index, itemsListIcons[heroInformation["basket"][itemKey]["itemIcon"]]);
                delete heroInformation["basket"][itemKey];
            }
        }
    }
    dialogueReader(interactionWindow, interactionWindowName, "interaction-window", levelInformation, itemsListIcons, dialogueObject);
}

heroElementHTML.onclick = () => {
    inventory.classList.toggle("inventory-active");
}

// для устранения ошибок с событием "keyup"
// solution to the problem with "keyup" event
window.onblur = () => KeyPressed.clear();
// сохранение позииции игрока (сцены) в файлы куки
// saving hero (scene) position in cookie
window.onbeforeunload = () => {
    setCookie('current-level', JSON.stringify({ date: Date.now(), index: 1, scenePositionX: parseInt(sceneElementHTML.offsetLeft), scenePositionY: parseInt(sceneElementHTML.offsetTop) }), { secure: true, 'max-age': CookieMaxAge });
}

setInterval(() => {
    if (KeyPressed.size == 0) return;

    sceneInformation.step = KeyPressed.size >= 2 ? 6 : 10;

    if (KeyPressed.has("KeyS")) {
        sceneElementHTML.style.top = (sceneInformation.y -= sceneInformation.step) + "px";
        spriteChangerHTML(heroElementHTML, "hero-element__image", "rei_stand")
    }
    if (KeyPressed.has("KeyA")) {
        sceneElementHTML.style.left = (sceneInformation.x += sceneInformation.step) + "px";
        spriteChangerHTML(heroElementHTML, "hero-element__image", "rei_rotate", 180)
    }
    if (KeyPressed.has("KeyD")) {
        sceneElementHTML.style.left = (sceneInformation.x -= sceneInformation.step) + "px";
        spriteChangerHTML(heroElementHTML, "hero-element__image", "rei_rotate", 0)
    }
    if (KeyPressed.has("KeyW")) {
        sceneElementHTML.style.top = (sceneInformation.y += sceneInformation.step) + "px";
        spriteChangerHTML(heroElementHTML, "hero-element__image", "rei_back")
        if (KeyPressed.has("KeyA")) spriteChangerHTML(heroElementHTML, "hero-element__image", "rei_back", 180);
        if (KeyPressed.has("KeyD")) spriteChangerHTML(heroElementHTML, "hero-element__image", "rei_back", 0);
    }

    for (let sceneCharacterNameHTML in charactersParameters) {
        if (checkCollisionHTML({
            x: (window.innerWidth / 2) - (heroElementHTML.offsetWidth / 2),
            y: (window.innerHeight / 2) - (heroElementHTML.offsetHeight / 2),
            width: heroElementHTML.offsetWidth,
            height: heroElementHTML.offsetHeight,
        }, {
            x: (sceneInformation.x + window.innerWidth / 2) + charactersParameters[sceneCharacterNameHTML].left,
            y: (sceneInformation.y + window.innerHeight / 2) + charactersParameters[sceneCharacterNameHTML].top,
            width: charactersParameters[sceneCharacterNameHTML].width,
            height: charactersParameters[sceneCharacterNameHTML].height,
        }, 5, 5)) {
            sceneCharacters[sceneCharacterNameHTML].classList.add("scene__character-near");

            if (KeyPressed.has("KeyF") && heroInformation["scenario-position"].length == 0) {
                if (levelInformation["scenario"][sceneCharacterNameHTML] !== undefined) {
                    heroInformation["scenario-position"].push({ "dialogueObjectKey": sceneCharacterNameHTML, stringIndex: 0 });
                    interactionWindow.style.display = "block";
                    dialogueReader(interactionWindow, interactionWindowName, "interaction-window", levelInformation, itemsListIcons, getDialogueObject(heroInformation["scenario-position"], levelInformation["scenario"]));
                }
            }
        } else {
            sceneCharacters[sceneCharacterNameHTML].classList.remove("scene__character-near");
            if (heroInformation["scenario-position"][0] !== undefined && heroInformation["scenario-position"][0]["dialogueObjectKey"] == sceneCharacterNameHTML) {
                interactionWindow.style.display = "none";
                heroInformation["scenario-position"].length = 0;
            }
        }
    }
    // проверка на коллизию с блоками 
    for (let blockNameHTML in blocksParameters) {
        if (checkCollisionHTML({
            x: (window.innerWidth / 2) - (heroElementHTML.offsetWidth / 2),
            y: (window.innerHeight / 2) - (heroElementHTML.offsetHeight / 2),
            width: heroElementHTML.offsetWidth,
            height: heroElementHTML.offsetHeight,
        }, {
            x: (sceneInformation.x + window.innerWidth / 2) + blocksParameters[blockNameHTML].left,
            y: (sceneInformation.y + window.innerHeight / 2) + blocksParameters[blockNameHTML].top,
            width: blocksParameters[blockNameHTML].width,
            height: blocksParameters[blockNameHTML].height,
        }, -5, -100)) {
            if (KeyPressed.has("KeyW")) sceneElementHTML.style.top = (sceneInformation.y -= sceneInformation.step) + "px";
            if (KeyPressed.has("KeyS")) sceneElementHTML.style.top = (sceneInformation.y += sceneInformation.step) + "px";
            if (KeyPressed.has("KeyA")) sceneElementHTML.style.left = (sceneInformation.x -= sceneInformation.step) + "px";
            if (KeyPressed.has("KeyD")) sceneElementHTML.style.left = (sceneInformation.x += sceneInformation.step) + "px";
        }
    }
}, 15);
