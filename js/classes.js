class TestClass {
    constructor(inventory) {
        this._inventory = inventory;
    }
    checkCollision(firstObject, secondObject, allowableMiss = 0, allowableMissY = 0) {
        if ((firstObject.x + firstObject.width + allowableMiss) >= secondObject.x &&
            firstObject.x <= (secondObject.x + secondObject.width + allowableMiss) &&
            (firstObject.y + firstObject.height + allowableMiss) >= secondObject.y &&
            firstObject.y <= (secondObject.y + secondObject.height + allowableMissY)) {
            return true;
        } else return false;
    }

    scenarioWork(scenario, eventName, stringCount, callback = null) {
        if (callback !== null) {
            if (stringCount >= scenario[eventName].length) {
                callback('text', 'script', false);
                return false;
            }
            if (scenario[eventName][stringCount].script !== undefined) {
                callback(scenario[eventName][stringCount], scenario[eventName][stringCount].script, true);
                return true;
            }
            callback(scenario[eventName][stringCount], null, true);
            return true;
        } else {
            if (scenario[eventName] === undefined || scenario[eventName][stringCount] === undefined) {
                return false;
            } else {
                return true;
            };
        }
    }

    giveItem(inventory, count) {
        let icon = new Image();
        icon.src = inventory[count].img;
        icon.onload = () => {
            icon.classList.add('inventory__img');
            this._inventory.children[count].append(icon);
        };
    }
}
