import queryData from "../../helper/query.js";
import { activeCommand, deactiveCommand } from "../../helper/setActiveCommand.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

async function marketRemove(message, args) {
    if (args[0] === 'remove') {
        let id = args[1];
        if(!id) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide list id!`) };
        let itemExist = await queryData(`SELECT marketplace.id, marketplace.is_reserved, marketplace.is_sold, marketplace.item_id, item.emoji, item.item_group_id, item.type_id,
            TRIM(CONCAT(IFNULL(modifier.name,'')," ",item.name)) as name, modifier_id
            FROM marketplace
            LEFT JOIN item ON (marketplace.item_id=item.id)
            LEFT JOIN modifier ON (marketplace.modifier_id=modifier.id)
            WHERE marketplace.id="${id}" AND player_id=${message.author.id} LIMIT 1`);
        itemExist = itemExist.length > 0 ? itemExist[0] : undefined;
        if (!itemExist) { return message.channel.send(`${emojiCharacter.noEntry} | There is no such id:\`${id}\` on your listing!`) };
        if(itemExist.is_reserved){ return message.channel.send(`${emojiCharacter.noEntry} | **${message.author.username}**, You can't remove this item, it's already reserved!`) };
        if(itemExist.is_sold) { return message.channel.send(`${emojiCharacter.noEntry} | Cannot remove item that already sold!`) };
        
        message.reply(`Are you sure to remove ${itemExist.emoji}**${itemExist.name} • id**:\`${itemExist.id}\` from marketplace list? (yes/no)`)
            .then(() => {
                activeCommand(message.author.id);
                // Prevent other player to buy the same item
                queryData(`UPDATE marketplace SET is_reserved=1 WHERE id="${id}" LIMIT 1`);
                let filter = m => m.author.id === message.author.id
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 15000,
                    errors: ['time']
                })
                    .then(async message => {
                        message = message.first();
                        if (message.content.toLowerCase() == 'y' || message.content.toLowerCase() == 'yes') {
                            if (itemExist.item_group_id == 3) {
                                let cekArmorySpace = await queryData(`SELECT COUNT(*) as Total FROM armory2
                                LEFT JOIN item ON (armory2.item_id=item.id)
                                WHERE player_id="${message.author.id}" 
                                AND item.type_id=${itemExist.type_id}
                                AND armory2.item_id>0 LIMIT 5`);
                            
                                if (cekArmorySpace[0].Total >= 5) {
                                    return message.reply(`\\⛔ | **${slotField}** ${en.equipment.armoryFull}`);
                                }
                                queryData(`INSERT armory2 set item_id=${itemExist.item_id}, modifier_id=${itemExist.modifier_id}, player_id=${message.author.id}`);
                            } else { 
                                queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${itemExist.item_id}, 1)`);
                            }
                            
                            queryData(`DELETE FROM marketplace WHERE id="${id}" LIMIT 1`);
                
                            message.channel.send(`You have been removed ${itemExist.emoji}**${itemExist.name} • id**:\`${itemExist.id}\` from marketplace list.`);
                        } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') {
                            // Prevent other player to buy the same item
                            queryData(`UPDATE marketplace SET is_reserved=0 WHERE id="${id}" LIMIT 1`);
                            message.channel.send(`Transaction cancelled`);
                        } else {
                            // Prevent other player to buy the same item
                            queryData(`UPDATE marketplace SET is_reserved=0 WHERE id="${id}" LIMIT 1`);
                            message.channel.send(`Transaction cancelled: Invalid Response`);
                        }
                        deactiveCommand(message.author.id)
                    })
                    .catch(collected => {
                        // Prevent other player to buy the same item
                        queryData(`UPDATE marketplace SET is_reserved=0 WHERE id="${id}" LIMIT 1`);
                        deactiveCommand(message.author.id)
                        // message.channel.send('Timeout, transaction cancelled');
                    });
            });

    }
}

export default marketRemove;