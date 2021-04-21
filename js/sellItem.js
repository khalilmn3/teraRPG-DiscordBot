import currencyFormat from "./helper/currency.js";
import queryData from "./helper/query.js";
import { activeCommand, deactiveCommand } from "./helper/setActiveCommand.js";

async function sellItem(message, args) {
    // let args = itemName.split(' ');
    let value = 1;
    let itemName = '';
    if (args[0] === 'weapon' || args[0] === 'helmet' || args[0] === 'shirt' || args[0] === 'pants') {
        return sellEquipment(message, args[0], args[1])
    } else {
        if (parseInt(args[1]) > 0) {
            value = args[1];
            itemName = args[0];
        } else if (parseInt(args[2]) > 0) {
            value = args[2];
            itemName = `${args[0]} ${args[1]}`;
        } else if (parseInt(args[3]) > 0) {
            value = args[3];
            itemName = `${args[0]} ${args[1]} ${args[2]}`;
        } else if (args.length > 1 && args[1].toString().toUpperCase() === 'ALL') {
            value = args[1].toUpperCase();
            itemName = args[0];
        } else if (args.length > 2 && args[2].toString().toUpperCase() === 'ALL') {
            value = args[2].toUpperCase();
            itemName = `${args[0]} ${args[1]}`;
        } else if (args.length > 3 && args[3].toString().toUpperCase() === 'ALL') {
            value = args[3].toUpperCase();
            itemName = `${args[0]} ${args[1]} ${args[2]}`;
        }
    }

    let itemExist = await queryData(`
        SELECT 
            a.name, a.sell_price,
            b.quantity, b.item_id 
        FROM
            item a 
            LEFT JOIN 
            (SELECT 
                c.item_id, c.quantity
            FROM
                backpack c
            WHERE c.player_id = "${message.author.id}" AND c.quantity >= ${value == "ALL" ? 1 : value}) b 
            ON a.id = b.item_id 
        WHERE a.name = "${itemName}" LIMIT 1`);
    // console.log(itemExist)
    // console.log(value)
    if (itemExist.length > 0) {
        if (itemExist[0].sell_price > 0) {
            console.log(itemExist)
            if (itemExist[0].quantity >= value || (value === 'ALL' && itemExist[0].quantity > 0)) {
                if (value === 'ALL') { value = itemExist[0].quantity }
                let totalPrice = value * itemExist[0].sell_price
                let filter = m => m.author.id === message.author.id
                activeCommand(message.author.id);
                await message.reply(`Are you sure to sell x${value} **${itemName}** for **${totalPrice}** gold? \`YES\` / \`NO\``).then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first();
                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                queryData(`UPDATE backpack SET quantity = quantity - ${value} WHERE player_id="${message.author.id}" AND item_id="${itemExist[0].item_id}" LIMIT 1`);
                                queryData(`UPDATE stat SET gold= gold + ${totalPrice} WHERE player_id="${message.author.id}" LIMIT 1`);
                                message.channel.send(`**${message.author.username}** sold x${value} **${itemName}** for **${totalPrice}** gold`)
                            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                                message.channel.send(`Terminated`);
                            } else {
                                message.channel.send(`Terminated: Invalid Response`);
                            }
                            deactiveCommand(message.author.id)
                        })
                        .catch(collected => {
                            deactiveCommand(message.author.id)
                            message.channel.send('Timeout, transaction cancelled');
                        });
                })
            } else {
                message.reply(`You dont have that much **${itemName}** in your backpack`);
            }
        } else {
            message.reply(`you can't sell this item`)
        }
    } else {
        message.reply(`what are you trying to sell?\ndon't forget to provide the amount`);
    }
}

async function sellEquipment(message, args1, args2) {
    let equipmentItem = '';
    let data = '';
    let modifier = '';
    let mainTable = isNaN(parseInt(args2)) ? 'equipment' : 'armory';
    args2 = isNaN(parseInt(args2)) ? 0 : args2;

    if (args1 === 'weapon') {
        data = await query(message.author.id, mainTable, 'weapon', 'weapon');
        equipmentItem = 'weapon_id'
        modifier = 'weapon_modifier_id';
    } else if (args1 === 'helmet') {
        data = await query(message.author.id, mainTable, 'helmet', 'armor');
        equipmentItem = 'helmet_id'
        modifier = 'helmet_modifier_id';
    } else if (args1 === 'shirt') {
        data = await query(message.author.id, mainTable, 'shirt', 'armor');
        equipmentItem = 'shirt_id'
        modifier = 'shirt_modifier_id';
    } else if (args1 === 'pants') {
        data = await query(message.author.id, mainTable, 'pants', 'armor');
        equipmentItem = 'pants_id'
        modifier = 'pants_modifier_id';
    }
    if (data) {
        if (data[args2].id) {
            let modifier = data[args2].modifier_id > 0 ? data[args2].modifier_id : 1;
            let price = parseInt(data[args2].sell_price) * modifier;
            let filter = m => m.author.id === message.author.id
                activeCommand(message.author.id);
                await message.reply(`Are you sure to sell ${data[args2].emoji} **${data[args2].name}** for **${currencyFormat(price)}** gold? \`YES\` / \`NO\``).then(() => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 15000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first();
                            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                                queryData(`UPDATE ${mainTable} SET ${equipmentItem}=0, ${modifier}=0  WHERE player_id="${message.author.id}" AND ${equipmentItem}="${data[args2].id}" AND ${modifier}=${data[args2].modifier_id} LIMIT 1`);
                                queryData(`UPDATE stat SET gold=gold+${price} WHERE player_id="${message.author.id}" LIMIT 1`);
                                
                                message.channel.send(`**${message.author.username}**, sold ${data[args2].emoji}\`${data[args2].name}\` for <:gold_coin:801440909006209025> **${currencyFormat(price)}**`)
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

async function query(playerId, tableArmoryOrEquipment, itemToFind, table) {
    let data =  await queryData(`SELECT CONCAT(IFNULL(modifier_${table}.name,"")," ",item.name) as name, item.emoji, ${tableArmoryOrEquipment}.${itemToFind}_id as id, ${tableArmoryOrEquipment}.${itemToFind}_modifier_id as modifier_id,IFNULL(item.sell_price,1) as sell_price FROM ${tableArmoryOrEquipment} 
        LEFT JOIN ${table} ON (${tableArmoryOrEquipment}.${itemToFind}_id=${table}.id)
        LEFT JOIN modifier_${table} ON (${tableArmoryOrEquipment}.${itemToFind}_modifier_id=modifier_${table}.id)
        LEFT JOIN item ON (${table}.item_id=item.id)
        WHERE player_id="${playerId}" ORDER BY ${tableArmoryOrEquipment}.id ASC LIMIT 5`);
    
    data = data.length > 0 ? data: 0;
    return data;
}

export default sellItem;