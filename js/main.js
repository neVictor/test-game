"use strict";

let containerHTML = document.getElementById("container");

const CookieMaxAge = 2147483647;

function appendHeroHTML(heroContainerHTML, heroSpritesClassCSS, objectWithSprites, otherClasses = null) {
    for (let heroSpritesId in objectWithSprites) {
        let heroSpritesImageHTML = objectWithSprites[heroSpritesId];
        heroSpritesImageHTML.classList.add(heroSpritesClassCSS);
        heroSpritesImageHTML.setAttribute("id", heroSpritesId);

        if (otherClasses !== null) {
            for (let index = 0; index < otherClasses.length; index++) {
                let className = otherClasses[index];
                heroSpritesImageHTML.classList.add(className);
            }
        }

        heroContainerHTML.append(heroSpritesImageHTML);
    }
    heroContainerHTML.lastElementChild.classList.add(heroSpritesClassCSS + "-active")
}

function appendCharactersHTML(charactersContainerHTML, characterClassCSS, objectWithCharacter, otherClasses = null) {
    for (let characterId in objectWithCharacter) {

        let characterDivHTML = document.createElement("div");
        characterDivHTML.classList.add(characterClassCSS);
        characterDivHTML.setAttribute("id", characterId);

        let characterImageHTML = objectWithCharacter[characterId];
        characterImageHTML.classList.add(characterClassCSS + "-image");
        characterImageHTML.setAttribute("alt", characterId);

        if (otherClasses !== null) {
            for (let index = 0; index < otherClasses.length; index++) {
                let className = otherClasses[index];
                characterDivHTML.classList.add(className);
            }
        }
        characterDivHTML.append(characterImageHTML);
        charactersContainerHTML.append(characterDivHTML);
    }
}

function createBlocksHTML(blocksClassCSS, blocksIdCSS, containerElementHTML, blocksNumber, blocksWithTexture = null) {
    for (let blockIndex = 1; blockIndex <= blocksNumber; blockIndex++) {
        let blockDivHTML = document.createElement("div");
        blockDivHTML.classList.add(blocksClassCSS);
        blockDivHTML.setAttribute("id", blocksIdCSS + "_" + blockIndex);

        if (blocksWithTexture !== null && Object.hasOwnProperty.call(blocksWithTexture, (blocksIdCSS + "_" + blockIndex))) {
            let blockTextureImageHTML = blocksWithTexture[blocksIdCSS + "_" + blockIndex];
            blockTextureImageHTML.classList.add(blocksClassCSS + "-image");
            blockDivHTML.append(blockTextureImageHTML);
        }

        containerElementHTML.append(blockDivHTML);
    }
}

function spriteChangerHTML(heroContainerHTML, spritesClassCSS, sriteNameHTML, rotateYdeg) {
    for (let heroSprite in heroContainerHTML.childNodes) {
        if (Object.hasOwnProperty.call(heroContainerHTML.childNodes, heroSprite)) {
            if (heroContainerHTML.childNodes[heroSprite].id == sriteNameHTML) {

                heroContainerHTML.childNodes[heroSprite].classList.add(spritesClassCSS + "-active")
                heroContainerHTML.childNodes[heroSprite].style.transform = `rotateY(${rotateYdeg}deg)`;
            } else {
                heroContainerHTML.childNodes[heroSprite].classList.remove(spritesClassCSS + "-active")

            }
        }
    }
}

function checkCollisionHTML(firstObject, secondObject, allowableMiss = 0, allowableMissY = 0) {
    if ((firstObject.x + firstObject.width + allowableMiss) >= secondObject.x &&
        firstObject.x <= (secondObject.x + secondObject.width + allowableMiss) &&
        (firstObject.y + firstObject.height + allowableMiss) >= secondObject.y &&
        firstObject.y <= (secondObject.y + secondObject.height + allowableMissY)) {
        return true;
    } else return false;
}

function getParametersByClassName(requiredClassName) {
    let foundElementsHTML = document.getElementsByClassName(requiredClassName);
    let objectWithParameters = new Object();

    for (let elementIndex in foundElementsHTML) {
        if (Object.hasOwnProperty.call(foundElementsHTML, elementIndex)) {
            let elementHTML = foundElementsHTML[elementIndex];

            objectWithParameters[elementHTML.id] = {
                left: elementHTML.offsetLeft,
                top: elementHTML.offsetTop,
                width: elementHTML.offsetWidth,
                height: elementHTML.offsetHeight,
            }
        }
    }
    return objectWithParameters;
}

function setItemToInventoryElementHTML(inventoryElementHTML, itemClass, itemId, itemImageHTML) {
    let itemContainerHTML = document.createElement("div");
    itemContainerHTML.classList.add(itemClass + "__item");
    itemContainerHTML.setAttribute("id", itemId);

    let localItemImageHTML = itemImageHTML.cloneNode(true);
    localItemImageHTML.classList.add(itemClass + "__item-image");

    itemContainerHTML.append(localItemImageHTML);
    inventoryElementHTML.append(itemContainerHTML);
}

function getDialogueObject(pathToDialogueArray, scenarioObject) {
    let dialogueObject = new Object();
    dialogueObject = scenarioObject[pathToDialogueArray[0]["dialogueObjectKey"]][pathToDialogueArray[0]["stringIndex"]];

    for (let index = 1; index < pathToDialogueArray.length; index++) {
        dialogueObject = dialogueObject["choice"][pathToDialogueArray[index]["dialogueObjectKey"]]["answer"][pathToDialogueArray[index]["stringIndex"]];
    }

    return dialogueObject;
}

function dialogueReader(informationWindowHTML, informationWindowName, informationWindowClassId, levelInformationObject, itemsListIconsObject, dialogueObject) {
    if (dialogueObject === undefined) {
        console.error("There is no scenario for this character");
        return;
    }

    informationWindowName.innerHTML = dialogueObject["name"];

    if (dialogueObject["event-type"] === undefined) {
        if (document.getElementById(informationWindowClassId + "-choice") !== null) document.getElementById(informationWindowClassId + "-choice").remove();
        if (document.getElementById(informationWindowClassId + "-market") !== null) document.getElementById(informationWindowClassId + "-market").remove();

        if (document.getElementById(informationWindowClassId + "-text") === null) {
            let textBoxElementHTML = document.createElement("p");
            textBoxElementHTML.setAttribute("id", informationWindowClassId + "-text")
            textBoxElementHTML.classList.add(informationWindowClassId + "__text")
            textBoxElementHTML.innerHTML = dialogueObject["text"];
            informationWindowHTML.append(textBoxElementHTML);
        } else {
            document.getElementById(informationWindowClassId + "-text").innerHTML = dialogueObject["text"];
        }
    }
    if (dialogueObject["event-type"] == "market") {
        if (document.getElementById(informationWindowClassId + "-choice") !== null) document.getElementById(informationWindowClassId + "-choice").remove();
        if (document.getElementById(informationWindowClassId + "-text") !== null) document.getElementById(informationWindowClassId + "-text").remove();

        let marketBareElementHTML = document.createElement("div");
        marketBareElementHTML.setAttribute("id", informationWindowClassId + "-market");
        marketBareElementHTML.classList.add(informationWindowClassId + "__market");

        let marketDiscardButtonHTML = document.createElement("button");
        marketDiscardButtonHTML.setAttribute("id", informationWindowClassId + "-market-discard");
        marketDiscardButtonHTML.classList.add(informationWindowClassId + "__market-discard");
        marketDiscardButtonHTML.innerHTML = "Dis";

        let itemsListObject = levelInformationObject[dialogueObject["items-list"]];
        for (let itemIndex in itemsListObject) {
            let itemContainerHTML = document.createElement("div");
            itemContainerHTML.setAttribute("id", itemIndex);
            itemContainerHTML.classList.add(informationWindowClassId + "__market-goods");

            let itemIconHTML = itemsListIconsObject[itemsListObject[itemIndex]["icon-name"]].cloneNode(true);
            itemIconHTML.classList.add(informationWindowClassId + "__market-image");

            let itemDescriptionHTML = document.createElement("p");
            itemDescriptionHTML.classList.add(informationWindowClassId + "__market-description");
            itemDescriptionHTML.innerHTML = "<strong>" + itemsListObject[itemIndex]["name"]; + "</strong>"
            itemDescriptionHTML.innerHTML += "</br>" + itemsListObject[itemIndex]["description"];

            itemContainerHTML.append(itemIconHTML);
            itemContainerHTML.append(itemDescriptionHTML);
            marketBareElementHTML.append(itemContainerHTML);
        }

        marketBareElementHTML.append(marketDiscardButtonHTML)
        informationWindowHTML.append(marketBareElementHTML);
    }
    if (dialogueObject["event-type"] == "choice") {
        if (document.getElementById(informationWindowClassId + "-market") !== null) document.getElementById(informationWindowClassId + "-market").remove();
        if (document.getElementById(informationWindowClassId + "-text") !== null) document.getElementById(informationWindowClassId + "-text").remove();

        let choiceBareElementHTML = document.createElement("div");
        choiceBareElementHTML.classList.add(informationWindowClassId + "__choice");
        choiceBareElementHTML.setAttribute("id", informationWindowClassId + "-choice");

        for (let choiceObjectKey in dialogueObject["choice"]) {
            let choiceButtonElementHTML = document.createElement("button");
            choiceButtonElementHTML.setAttribute("id", choiceObjectKey)
            choiceButtonElementHTML.classList.add(informationWindowClassId + "__button-choice")
            choiceButtonElementHTML.innerHTML = dialogueObject["choice"][choiceObjectKey]["question"];
            choiceBareElementHTML.append(choiceButtonElementHTML)
        }

        informationWindowHTML.append(choiceBareElementHTML);
    }
    if (dialogueObject["event-type"] == "script") {
        document.getElementById(informationWindowClassId + "-text").innerHTML = dialogueObject["text"];
        window[dialogueObject["script-name"]](dialogueObject["script-value"]);
    }
}

function imageLoader(imageSrc) {
    return new Promise((resolve, reject) => {
        let loadedImage = new Image();
        loadedImage.src = imageSrc;
        loadedImage.onload = (err) => reject(err);
        loadedImage.onload = () => resolve(loadedImage);
    })
}

async function elementLoader(objectWithResources) {
    let objectWithLoadedElements = new Object();
    for (let elementName in objectWithResources) {
        await imageLoader(objectWithResources[elementName]).then(result => {
            objectWithLoadedElements[elementName] = result;
        }).catch(error => {
            console.error("In the " + elementName + " occurred the error: " + error);
        })
    }
    return objectWithLoadedElements;
}

function scriptLoader(scriptSrcArray) {
    for (let index = 0; index < scriptSrcArray.length; index++) {
        let script = document.createElement("script");
        script.src = scriptSrcArray[index];
        document.documentElement.appendChild(script);
    }
}

function styleLoader(styleSrcArray) {
    for (let index = 0; index < styleSrcArray.length; index++) {
        let style = document.createElement("link");
        style.href = styleSrcArray[index];
        style.setAttribute("rel", "stylesheet");
        document.head.append(style);
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
    options = {
        path: "/",
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}