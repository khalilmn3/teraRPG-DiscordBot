import Discord from "discord.js";
import queryData from "../helper/query.js";
import { emojiName, variable } from "../helper/variable.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import questProgress from "../utils/questProgress.js";
import symbol from "../utils/symbol.js";

async function smelt(message, args) {
    if (args[0] === 'copper'
        || args[0] === 'iron'
        || args[0] === 'silver'
        || args[0] === 'tungsten'
        || args[0] === 'gold'
        || args[0] === 'platinum') {
        
        if (args[1] === 'bar') {
            let qty = !isNaN(args[2]) ? parseInt(args[2]) : 1;
            if (args[0] === 'copper') {
                processSmelt(message, variable.copperBarId, variable.copperOreId, qty, emojiName.copperBar);
            } else if (args[0] === 'iron') {
                processSmelt(message, variable.ironBarId, variable.ironOreId, qty, emojiName.ironBar);
            } else if (args[0] === 'silver') {
                processSmelt(message, variable.silverBarId, variable.silverOreId, qty, emojiName.silverBar);
            } else if (args[0] === 'tungsten') {
                processSmelt(message, variable.tungstenBarId, variable.tungstenOreId, qty, emojiName.tungstenBar);
            } else if (args[0] === 'gold') {
                processSmelt(message, variable.goldBarId, variable.goldOreId, qty, emojiName.goldBar);
            } else if (args[0] === 'platinum') {
                processSmelt(message, variable.platinumBarId, variable.platinumOreId, qty, emojiName.platinumBar);
            }
        } else {
            message.channel.send('What are you trying to smelt? correct use \`tera smelt [item bar] [amount]\`\n e.g. \`tera smelt iron bar 10\`, smelt will give 80% item ore from crafting') 
        }
    } else {
        message.channel.send('What are you trying to smelt? correct use \`tera smelt [item bar] [amount]\`\n e.g. \`tera smelt iron bar 10\`, smelt will give 80% item ore from crafting')
    }
}

async function processSmelt(message, itemID, itemIDTo, quantity, emojiNames) {
    let furnaceExist = await queryData(`SELECT item_id_furnace FROM tools WHERE player_id="${message.author.id}" AND item_id_furnace="${variable.furnaceId}" LIMIT 1`);
    furnaceExist = furnaceExist.length > 0 ? 1 : 0;
    if (!furnaceExist) {
        return message.channel.send(`${emojiCharacter.noEntry} | you need ${emojiName.furnace} to craft this item!`);
    }
    let itemExist = await queryData(`SELECT item.name, item.emoji FROM backpack INNER JOIN item ON (backpack.item_id=item.id)
                    WHERE player_id="${message.author.id}" AND item_id="${itemID}" AND quantity>=${quantity} LIMIT 1`);
    itemExist = itemExist.length > 0 ? itemExist[0] : undefined;
    if (itemExist) {
        let qtyAfterSmelt = quantity * 10 * 80 / 100;
        let item = await queryData(`SELECT emoji, name FROM item WHERE id="${itemIDTo}" LIMIT 1`);
        let embed = new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 11115879,
            fields: [{
                name: 'Smelthing Bar',
                value: `-${quantity} ${itemExist.emoji} \`${itemExist.name}\`\n+${qtyAfterSmelt} ${item[0].emoji} \`${item[0].name}\``,
                inline: false,
            }],
            // footer: {
            //     text: `Find more rewards on \`tera daily/weekly/vote\``,
            //     iconURL: null,
            //     proxyIconURL: null
            // },
        });

        // QUEST PROGRESS ITEM COPPER BAR
        if (itemID == 22) {
            questProgress(message.author.id, 8, quantity);
        }

        queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${itemIDTo}, ${qtyAfterSmelt})`);
        queryData(`UPDATE backpack SET quantity=quantity-${quantity} WHERE player_id="${message.author.id}" AND item_id="${itemID}" LIMIT 1`);
        // message.channel.send(embed);
        message.channel.send(`${emojiCharacter.furnace} | **${message.author.username}** has smelted x${quantity} ${itemExist.emoji} **${itemExist.name}** ${symbol.arrowRight} x${qtyAfterSmelt} ${item[0].emoji} **${item[0].name}**!`)
    } else {
        message.channel.send(`${emojiCharacter.noEntry} | You don't have ${quantity} ${emojiNames} to smelt in your backpack!`);
    }
}

export default smelt;