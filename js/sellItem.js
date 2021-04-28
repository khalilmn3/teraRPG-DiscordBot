import currencyFormat from "./helper/currency.js";
import queryData from "./helper/query.js";
import { activeCommand, deactiveCommand } from "./helper/setActiveCommand.js";
import emojiCharacter from "./utils/emojiCharacter.js";

async function sellItem(message, args, commandsBody) {
    let argument = commandsBody
    let sellQty = argument.match(/\d+/g);
    sellQty = sellQty ? sellQty[0] : 1;
    let arrayName = argument.match(/[a-zA-Z]+/g);
    let itemName = '';
    arrayName = arrayName.splice(1);
    arrayName.forEach(element => {
        if (itemName) {
            itemName += ' ';
        }
        if (element != 'all') {
            itemName += element;
        } else {
            sellQty = 'all';
        }
    });
    
    if (args[0] === 'weapon' || args[0] === 'helmet' || args[0] === 'shirt' || args[0] === 'pants' || args[0] === 'armory') {
        if( args[0] == 'armory' && !(!isNaN(parseInt(args[1])))){ return message.channel.send(`${emojiCharacter.noEntry} | Please provide armory **id**\ne.g. \`tera armory 23\``)}
        let armoryID = args[1]; // convert item name to id
        return sellEquipment(message, args[0], args[1], armoryID)
    }

    let itemExist = await queryData(`
        SELECT 
            a.name, a.sell_price, a.emoji,
            b.quantity, b.item_id, a.item_group_id
        FROM
            item a 
            LEFT JOIN 
            (SELECT 
                c.item_id, c.quantity
            FROM
                backpack c
            WHERE c.player_id = "${message.author.id}") b 
            ON a.id = b.item_id 
        WHERE a.name = "${itemName}" LIMIT 1`);
    // console.log(itemExist)
    // console.log(sellQty)
if (itemExist.length > 0) {
        itemExist = itemExist[0]
        if (itemExist.sell_price > 0) {
            if (itemExist.quantity >= sellQty || (sellQty === 'all' && itemExist.quantity > 0)) {
                if (sellQty === 'all') { sellQty = itemExist.quantity }
                let totalPrice = sellQty * itemExist.sell_price
                let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() === 'y' || m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'n' || m.content.toLowerCase() === 'no');
                activeCommand(message.author.id);
                await message.reply(`Are you sure to sell __x${sellQty}__ ${itemExist.emoji}**${itemExist.name}** for ${emojiCharacter.gold2}__${totalPrice}__? (y/n)`).then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first();
                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                queryData(`UPDATE backpack SET quantity = quantity - ${sellQty} WHERE player_id="${message.author.id}" AND item_id="${itemExist.item_id}" LIMIT 1`);
                                queryData(`UPDATE stat SET gold= gold + ${totalPrice} WHERE player_id="${message.author.id}" LIMIT 1`);
                                message.channel.send(`**${message.author.username}** sold __x${sellQty}__ ${itemExist.emoji}**${itemExist.name}** for ${emojiCharacter.gold2}__${totalPrice}__.`)
                            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                message.channel.send(`Transaction cancelled`);
                            } else {
                                message.channel.send(`Transaction cancelled: Invalid Response`);
                            }
                            deactiveCommand(message.author.id)
                        })
                        .catch(collected => {
                            deactiveCommand(message.author.id)
                            message.channel.send('Timeout, transaction cancelled');
                        });
                })
            } else if (itemExist.item_group_id == 3) {
                return sellEquipment(message, args[0], args[1], itemName)
                // return message.channel.send(`${emojiCharacter.noEntry} | Use \`tera sell armory [id]\` to sell item in armory\nand \`tera sell [weapon/helmet/shirt/pants]\` to sell item you have already equipped!`);
            } else {
                message.reply(`You dont have that much **${itemName}** in your backpack`);
            }
        } else {
            message.reply(`you can't sell this item`)
        }
    } else {
        message.reply(`what are you trying to sell?`);
    }
}

async function sellEquipment(message, args1, args2, itemName) {
    let equipmentItem = '';
    let data = '';
    let modifierField = '';
    let mainTable = isNaN(parseInt(args2)) ? 'equipment' : 'armory2';
    args2 = isNaN(parseInt(args2)) ? 0 : args2;
    let isArmory = false;
    // sell item from equipped
    if (args1 === 'weapon') {
        data = await query(message, mainTable, 'weapon', 'weapon',itemName);
        equipmentItem = 'weapon_id'
        modifierField = 'weapon_modifier_id';
    } else if (args1 === 'helmet') {
        data = await query(message, mainTable, 'helmet', 'armor',itemName);
        equipmentItem = 'helmet_id'
        modifierField = 'helmet_modifier_id';
    } else if (args1 === 'shirt') {
        data = await query(message, mainTable, 'shirt', 'armor',itemName);
        equipmentItem = 'shirt_id'
        modifierField = 'shirt_modifier_id';
    } else if (args1 === 'pants') {
        data = await query(message, mainTable, 'pants', 'armor',itemName);
        equipmentItem = 'pants_id'
        modifierField = 'pants_modifier_id';
    } else {
        // sell item from armory
        isArmory = true;
        data = await query(message, '', '', '',itemName, isArmory);
    }
    if(!data && !isArmory){return message.channel.send(`${emojiCharacter.noEntry} | You are not wearing a/an ${args1}!\n to sell armory item, use \`tera sell armory [id]\`.`)}
    if (data) {
        if (data.id) {
            let modifier = data.modifier_id > 0 ? data.modifier_id : 1;
            let price = parseInt(data.sell_price) * modifier;
            let filter = m => m.author.id === message.author.id && (m.content.toLowerCase() === 'y' || m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'n' || m.content.toLowerCase() === 'no');
                activeCommand(message.author.id);
                await message.reply(`Are you sure to sell ${data.emoji} **${data.name}** for **${currencyFormat(price)}** gold? (y/n)`).then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 15000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first();
                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                if (itemName && isArmory) {
                                    queryData(`DELETE FROM armory2 WHERE id=${data.armory_id} AND player_id=${message.author.id} LIMIT 1`);
                                } else {
                                    queryData(`UPDATE equipment SET ${equipmentItem}=0, ${modifierField}=0  WHERE player_id="${message.author.id}" LIMIT 1`);
                                }
                                
                                queryData(`UPDATE stat SET gold=gold+${price} WHERE player_id="${message.author.id}" LIMIT 1`);
                                
                                message.channel.send(`**${message.author.username}**, sold ${data.emoji}\`${data.name}\` for <:gold_coin:801440909006209025> **${currencyFormat(price)}**`)
                            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                message.channel.send(`Transaction cancelled`);
                            } else {
                                message.channel.send(`Transaction cancelled: Invalid Response`);
                            }
                            deactiveCommand(message.author.id)
                        })
                        .catch(collected => {
                            deactiveCommand(message.author.id)
                            message.channel.send('Timeout, transaction cancelled');
                        });
                })
        } else {
            message.channel.send(`\\🚫 | Can't find your item, make sure you have the item before selling it`)
        }
    } else {
        message.channel.send(`\\🚫 | Can't find your item, make sure you have the item before selling it`)
    }
    

}

async function query(message, tableArmoryOrEquipment, itemToFind, table, itemName, isArmory) {
    // let data =  await queryData(`SELECT CONCAT(IFNULL(modifier_${table}.name,"")," ",item.name) as name, item.emoji, ${tableArmoryOrEquipment}.${itemToFind}_id as id, ${tableArmoryOrEquipment}.${itemToFind}_modifier_id as modifier_id,IFNULL(item.sell_price,1) as sell_price FROM ${tableArmoryOrEquipment} 
    //     LEFT JOIN ${table} ON (${tableArmoryOrEquipment}.${itemToFind}_id=${table}.id)
    //     LEFT JOIN modifier_${table} ON (${tableArmoryOrEquipment}.${itemToFind}_modifier_id=modifier_${table}.id)
    //     LEFT JOIN item ON (${table}.item_id=item.id)
    //     WHERE player_id="${playerId}" ORDER BY ${tableArmoryOrEquipment}.id ASC LIMIT 5`);
    let queryJoin = '';
    let queryWhere = '';
    if (itemName && isArmory) {
        queryJoin = 'LEFT JOIN modifier ON (armory2.modifier_id=modifier.id)';
        let queryFind = isNaN(parseInt(itemName)) ? `TRIM(CONCAT(IFNULL(modifier.name,"")," ",item.name))="${itemName}"` : `armory2.id=${itemName}`;
        queryWhere = `WHERE armory2.player_id=${message.author.id} AND ${queryFind}`
    } else {
        queryJoin = `LEFT JOIN equipment ON (${table}.id=equipment.${itemToFind}_id) 
        LEFT JOIN modifier ON (equipment.${itemToFind}_modifier_id=modifier.id)`;
        queryWhere = `WHERE equipment.player_id=${message.author.id} AND equipment.${itemToFind}_id>0`
    }
    let item = await queryData(`SELECT TRIM(CONCAT(IFNULL(modifier.name,"")," ",item.name)) as name, item.sell_price,
        item.id, item.emoji, IF(modifier.modifier_type_id>14,modifier.id-14,modifier.id) as modifier_id, modifier.modifier_type_id,
        armory2.id as armory_id
        FROM item
        LEFT JOIN armory2 ON (item.id=armory2.item_id)
        LEFT JOIN weapon ON (item.id=weapon.item_id)
        LEFT JOIN armor ON (item.id=armor.item_id)
        ${queryJoin}
        ${queryWhere}
        LIMIT 1`)
    
    item = item.length > 0 ? item[0] : undefined;
    console.log(itemName);
    console.log(item);
    return item;
}

export default sellItem;