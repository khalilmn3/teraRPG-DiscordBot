import currencyFormat from "../../helper/currency.js";
import queryData from "../../helper/query.js";
import { activeCommand, deactiveCommand } from "../../helper/setActiveCommand.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

async function marketBuy(message, args, stat) {
    let id = args[1];
    if(!id) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide list id!`) };
    let marketItem = await queryData(`SELECT marketplace.player_id, item.emoji, item.name, marketplace.id, marketplace.item_id,  marketplace.price FROM marketplace 
        LEFT JOIN item ON (marketplace.item_id=item.id)
        WHERE marketplace.id="${id}" LIMIT 1`);
    marketItem = marketItem.length > 0 ? marketItem[0] : undefined;

    if (!marketItem) { return message.channel.send(`${emojiCharacter.noEntry} | There is no such id:\`${id}\` on listing!`) };
    if (marketItem.player_id == message.author.id) { return message.channel.send(`${emojiCharacter.noEntry} | You can't buy your own list!`) };
    if (stat.gold < marketItem.price) { return message.channel.send(`${emojiCharacter.noEntry} | Nice try, your gold is not enough for that item!`) };

    message.reply(`Are you sure to buy **${marketItem.emoji}${marketItem.name}** for ${emojiCharacter.gold2}\`${currencyFormat(marketItem.price)}\`?(yes/no)`)
        .then(() => {
            activeCommand(message.author.id);
            let filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            })
                .then(message => {
                    message = message.first();
                    if (message.content.toLowerCase() == 'yes' || message.content.toLowerCase() == 'y') {
                        // Update sold status item from list
                        queryData(`UPDATE marketplace SET is_sold=1 WHERE id="${id}" LIMIT 1`);
                        // Add item into player backpack
                        queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${marketItem.item_id}, 1)`);
                        
                        message.channel.send(`**${message.author.username}** has bought **${marketItem.emoji}${marketItem.name}** for ${emojiCharacter.gold2}\`${currencyFormat(marketItem.price)}\`!`);
                    } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') {
                        message.channel.send(`Transaction cancelled`);
                    } else {
                        message.channel.send(`Transaction cancelled: Invalid response`);
                    }
                    deactiveCommand(message.author.id)
                })
                .catch(collected => {
                    deactiveCommand(message.author.id)
                    message.channel.send('Timeout, transaction cancelled');
                });
        })
}

export default marketBuy;