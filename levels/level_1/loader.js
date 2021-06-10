"use strict";

let heroElementHTML = document.getElementById("hero-element");
let sceneElementHTML = document.getElementById("scene");
let itemsListIcons = new Object();

let gameLocation = document.location.origin + "/test-game";
let blocksNumberHTML = 1;

let levelInformation = fetch("./level-information.json")
    .then((response) => {
        return response.json();
    }).then((data) => {
        levelInformation = data;
    });


styleLoader([gameLocation + "/css/style.css", "./level-style.css"]);

// Я действительно (пока что) не знаю как сделать загрузку ресурсов лучше
// I really don"t know how to load resources better, sorry

elementLoader({
    "background-1": gameLocation + "/img/background.png",
    "block_1": gameLocation + "/img/fire_gif.webp",
}).then(blockLoadedTexture => {
    createBlocksHTML("scene__blocks", "block", sceneElementHTML, blocksNumberHTML, blockLoadedTexture);
    if (blockLoadedTexture["background-1"] !== undefined) {
        blockLoadedTexture["background-1"].setAttribute("id", "scene-background-image");
        sceneElementHTML.append(blockLoadedTexture["background-1"])
    }

    sceneElementHTML.style.top = JSON.parse(getCookie("current-level")).scenePositionY + "px";
    sceneElementHTML.style.left = JSON.parse(getCookie("current-level")).scenePositionX + "px";

    elementLoader({
        "rei_back": gameLocation + "/img/rei_back.png",
        "rei_rotate": gameLocation + "/img/rei_rotate.png",
        "rei_stand": gameLocation + "/img/rei_stand.png",
    }).then(heroLoadedSprites => {
        appendHeroHTML(heroElementHTML, "hero-element__image", heroLoadedSprites);
        elementLoader({
            "character-1": gameLocation + "/img/cirno_sit.png",
            "character-2": gameLocation + "/img/kira_stay.png",
            "character-3": gameLocation + "/img/naoto_vibing.gif",
            "character-4": gameLocation + "/img/bulki_s_makom.png",
        }).then(characterLoadedSprites => {
            appendCharactersHTML(sceneElementHTML, "scene__character", characterLoadedSprites, ["scene__blocks"]);
            elementLoader({
                "bulochka-s-makom": gameLocation + "/img/bulochka-s-makom.png",
                "bulochka-s-koriczej": gameLocation + "/img/bulochka-s-koriczej.png"
            }).then(itemsListLoadedIcons => {
                itemsListIcons = itemsListLoadedIcons;
                scriptLoader([gameLocation + "/js/engine.js", "./other-function.js"]);
            });
        })
    });
});
