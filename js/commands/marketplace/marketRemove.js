import queryData from "../../helper/query.js";
import { activeCommand, deactiveCommand } from "../../helper/setActiveCommand.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

async function marketRemove(message, args) {
    if (args[0] === 'remove') {
        let id = args[1];
        if(!id) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide list id!`) };
        let itemExist = await queryData(`SELECT marketplace.id, marketplace.is_sold, marketplace.item_id, item.name, item.emoji FROM marketplace LEFT JOIN item ON (marketplace.item_id=item.id) WHERE marketplace.id="${id}" AND player_id=${message.author.id} LIMIT 1`);
        itemExist = itemExist.length > 0 ? itemExist[0] : undefined;
        if (!itemExist) { return message.channel.send(`${emojiCharacter.noEntry} | There is no such id:\`${id}\` on your listing!`) };
        if(itemExist.is_sold) { return message.channel.send(`${emojiCharacter.noEntry} | Cannot remove item that already sold!`) };
        
        message.reply(`Are you sure to remove ${itemExist.emoji}**${itemExist.name} • id**:\`${itemExist.id}\` from marketplace list? (yes/no)`)
            .then(() => {
                activeCommand(message.author.id);
                let filter = m => m.author.id === message.author.id
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                })
                    .then(message => {
                        message = message.first();
                        if (message.content.toLowerCase() == 'y' || message.content.toLowerCase() == 'yes') {
                            queryData(`DELETE FROM marketplace WHERE id="${id}" LIMIT 1`);
                            queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${itemExist.item_id}, 1)`);
                
                            message.channel.send(`You have been removed ${itemExist.emoji}**${itemExist.name} • id**:\`${itemExist.id}\` from marketplace list.`);
                        } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') {
                            message.channel.send(`Transaction cancelled`);
                        } else {
                            message.channel.send(`Transaction cancelled: Invalid Response`);
                        }
                        deactiveCommand(message.author.id)
                    })
                    .catch(collected => {
                        deactiveCommand(message.author.id)
                        // message.channel.send('Timeout, transaction cancelled');
                    });
            });

    }
}

export default marketRemove;