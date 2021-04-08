// тестовый сценарий для разных героев
let scenario = {
    "character-1": [
        {
            name: "Сырно сильнейшая", text: "Приветики~~"
        },
        {
            name: "Рей", text: "Привет Сырно"
        },
        {
            name: "Сырно сильнейшая", text: "Удачи тебе ❤️"
        },
        {
            name: "Рей", text: "Тебе тоже ❤️❤️❤️"
        }
    ],
    "character-2": [
        {
            name: "Кыра", text: "Привет блин блинский"
        },
        {
            name: "Рей", text: "Привет, что ты тут делаешь?"
        },
        {
            name: "Кыра", text: "Я пришел сюда погреться "
        },
        {
            name: "Рей", text: "Ну тогда удачи тебе"
        },
        {
            name: "Кыра", text: "И тебе блин блинский"
        }
    ],
    "character-3": [
        {
            name: "Рей", text: "(она просто танцует, не нужно мешать)"
        },
    ],
    "character-4": [
        {
            name: "Рей", text: "Я хочу купить булочку с маком"
        },
        {
            name: "Продавщица булочек", text: "Сегодня бесплатно"
        },
        {
            name: "Рей", text: "Спасибо ❤️"
        },
        {
            name: "Продавщица булочек", text: "На здоровье ❤️", script(hero, character, inventory) {
                for (let count = 0; count < inventory.length; count++) {
                    if (inventory[count].name == '' || inventory[count].name == undefined) {
                        inventory[count] = ItemList['bulka_s_makom'];
                        testClass.giveItem(inventory, count);
                        count = inventory.length
                        return;
                    };
                }
            },
        },
    ]
};