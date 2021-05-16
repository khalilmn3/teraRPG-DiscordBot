import currencyFormat from "../helper/currency.js";
import { getMaxHP } from "../helper/getBattleStat.js";
import queryData from "../helper/query.js";
import emojiCharacter from "../utils/emojiCharacter.js";

async function eatFood(message, stat, commandsBody) {
    let argument = commandsBody
    let qty = argument.match(/\d+/g);
    qty = qty ? qty[0] : 1;
    let arrayName = argument.match(/[a-zA-Z]+/g);
    let itemName = '';
    arrayName = arrayName.splice(1);
    arrayName.forEach(element => {
        if (itemName) {
            itemName += ' ';
        }
        if (element != 'all') {
            itemName += element;
        }
    });
    if (!itemName) { return  message.channel.send(`${emojiCharacter.noEntry} | please provide the item you want to eat!`) }
    let isItemExist = await queryData(`SELECT name FROM item WHERE name="${itemName}" LIMIT 1`);
    if (!isItemExist.length > 0) { return message.channel.send(`${emojiCharacter.noEntry} | Invalid item name!`) };

    let item = await queryData(`SELECT IFNULL(quantity,0) as quantity, item.emoji, item.name,item.id, IFNULL(food.hp,0) as hp
    FROM item
    LEFT JOIN food ON (item.id=food.item_id)
    LEFT JOIN backpack ON (item.id=backpack.item_id) WHERE player_id=${message.author.id} AND name="${itemName}" LIMIT 1`);
    item = item.length > 0 ? item[0] : undefined;
    if (!item || item.quantity < qty) {
        return message.channel.send(`${emojiCharacter.noEntry} | you don't have that much items on your backpack!`);
    }
    let itemHP = item.hp * qty;
    let maxHP = getMaxHP(stat.basic_hp, stat.level);
    let restoredHP = parseInt(itemHP);
    restoredHP = parseInt(stat.hp) + parseInt(restoredHP) > maxHP ? maxHP - stat.hp : restoredHP;
    if (restoredHP <= 0) { return message.channel.send(`**${message.author.username}** current HP is maxed out.`) };
    let qtyUsed = Math.ceil(restoredHP / item.hp);
    queryData(`UPDATE backpack SET quantity=quantity-${qtyUsed} WHERE player_id=${message.author.id} AND item_id=${item.id} LIMIT 1`)
    queryData(`UPDATE stat SET hp=hp+${restoredHP} WHERE player_id=${message.author.id} LIMIT 1`)
    message.channel.send(`**${message.author.username}**, has eaten x${qtyUsed} ${item.emoji}**${item.name}** and restored __${currencyFormat(restoredHP)}__ HP\n current HP __${parseInt(stat.hp) + parseInt(restoredHP)}/${maxHP}__!`);
}

export default eatFood;