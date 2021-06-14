import currencyFormat from "../../helper/currency.js";
import queryData from "../../helper/query.js";
import { activeCommand, deactiveCommand } from "../../helper/setActiveCommand.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

async function marketBuy(message, args, stat) {
    let id = args[1];
    if(!id) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide list id!`) };
    let marketItem = await queryData(`SELECT marketplace.player_id, IFNULL(marketplace.modifier_id,0) as modifier_id, item.type_id, item.item_group_id, item.emoji,
    TRIM(CONCAT(IFNULL(modifier.name,"")," ",item.name)) as name, marketplace.id, marketplace.item_id, marketplace.is_reserved, marketplace.price, marketplace.is_sold
        FROM marketplace
        LEFT JOIN item ON (marketplace.item_id=item.id)
        LEFT JOIN modifier ON (marketplace.modifier_id=modifier.id)
        WHERE marketplace.id="${id}" LIMIT 1`);
    marketItem = marketItem.length > 0 ? marketItem[0] : undefined;

    if (!marketItem) { return message.channel.send(`${emojiCharacter.noEntry} | There is no such id:\`${id}\` on the list!`) };
    if(marketItem.is_sold){ return message.channel.send(`${emojiCharacter.noEntry} | too late, this item has been sold!`) };
    if (marketItem.player_id == message.author.id) { return message.channel.send(`${emojiCharacter.noEntry} | You can't buy your own list!`) };
    if(marketItem.is_reserved){ return message.channel.send(`${emojiCharacter.noEntry} | **${message.author.username}**, You can't buy this item, it's already reserved!`) };
    if (stat.gold < marketItem.price) { return message.channel.send(`${emojiCharacter.noEntry} | Nice try, your gold is not enough for that item!`) };

    message.reply(`Are you sure to buy **${marketItem.emoji}${marketItem.name}** for ${emojiCharacter.gold2}\`${currencyFormat(marketItem.price)}\`?(yes/no)`)
        .then(() => {
            activeCommand(message.author.id);
            // Prevent other player to buy the same item
            queryData(`UPDATE marketplace SET is_reserved=1 WHERE id="${id}" LIMIT 1`);
            let filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            })
                .then(async message => {
                    message = message.first();
                    if (message.content.toLowerCase() == 'yes' || message.content.toLowerCase() == 'y') {
                        if (marketItem.item_group_id == 3) {
                            let armory = await queryData(`SELECT COUNT(*) as count FROM armory2
                                LEFT JOIN item ON (armory2.item_id=item.id)
                                WHERE player_id=${message.author.id} AND item.type_id=${marketItem.type_id}`);
                            let armoryCount = armory.length ? armory[0].count : 0;
                            if (armoryCount >= 5) { return message.channel.send(`${emojiCharacter.noEntry} | There is not enough space in your armory!`) };
                            // Add item into player armory
                            queryData(`INSERT armory2 SET item_id=${marketItem.item_id}, player_id=${message.author.id}, modifier_id="${marketItem.modifier_id}"`);
                        } else {
                            // Add item into player backpack
                            queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${marketItem.item_id}, 1)`);
                        }
                        // Update sold status item from list
                        queryData(`UPDATE marketplace SET is_sold=1 WHERE id="${id}" LIMIT 1`);
                        // reduce gold from player
                        queryData(`UPDATE stat SET gold=gold-${marketItem.price} WHERE player_id=${message.author.id} LIMIT 1`);
                        
                        message.channel.send(`**${message.author.username}** has bought **${marketItem.emoji}${marketItem.name}**!`);
                    } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') {
                        queryData(`UPDATE marketplace SET is_reserved=0 WHERE id="${id}" LIMIT 1`);
                        message.channel.send(`Transaction cancelled`);
                    } else {
                        queryData(`UPDATE marketplace SET is_reserved=0 WHERE id="${id}" LIMIT 1`);
                        message.channel.send(`Transaction cancelled: Invalid response`);
                    }
                    deactiveCommand(message.author.id)
                })
                .catch(collected => {
                    deactiveCommand(message.author.id)
                    queryData(`UPDATE marketplace SET is_reserved=0 WHERE id="${id}" LIMIT 1`);
                    message.channel.send('Timeout, transaction cancelled');
                });
        })
}

export default marketBuy;