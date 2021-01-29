import queryData from './helper/query.js';
import randomizeChance from './helper/randomize.js';

async function work(message, workingCommand, playerStat) {
    let discoveredArea = Math.floor(playerStat.discovered_area);
    // Get player's tools
    let data = await queryData(`SELECT
                 item.name as pickaxeName, IFNULL(item.emoji,"") as pickaxeEmoji, item.tier as pickaxeTier,
                 item2.name as axeName, IFNULL(item2.emoji,"") as axeEmoji, item2.tier as axeTier
            FROM tools 
            LEFT JOIN item ON (tools.item_id_pickaxe = item.id)
            LEFT JOIN item as item2 ON (tools.item_id_axe = item2.id) WHERE player_id='${message.author.id}' LIMIT 1`);

    data = data[0];

    if (data) {
        if (workingCommand === 'mine') {
            // get item drop list
            let itemDropList = await queryData(`SELECT * FROM item WHERE available_area_id<="${discoveredArea}" AND type_id="7"`);
            let itemDrop = randomizeChance(itemDropList, discoveredArea);
                    
            let maxGainingItem = itemDrop.id === 1 ? 3 * itemDrop.tier : 3;
            let gainingItem = Math.round(Math.random() * (maxGainingItem - 1) + 1); // get random item gaining
            if (itemDrop !== 0) {
                if (data.pickaxeTier >= itemDrop.tier) {
                    queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${itemDrop.id}", ${gainingItem})`);
                    queryData(`UPDATE tools SET pickaxe_exp=pickaxe_exp + ${itemDrop.exp} WHERE player_id="${message.author.id}"`);
                    message.channel.send(`${data.pickaxeEmoji} | **${message.author.username}** is working with his **${data.pickaxeName}**,\n${itemDrop.emoji} | Found **${gainingItem} ${itemDrop.name}** and gaining **${itemDrop.exp}xp**`)
                } else {
                    queryData(`UPDATE tools SET pickaxe_exp=pickaxe_exp + ${(itemDrop.exp / 2)} WHERE player_id="${message.author.id}"`);
                    message.channel.send(`${data.axeEmoji} | **${message.author.username}** is working with his **${data.axeName}**,\n${itemDrop.emoji} | Found **${itemDrop.name}** but it harder than your tool, lucky you still gaining **${Math.round(itemDrop.exp / 2)}xp**`)
                }
            } else {
                queryData(`UPDATE tools SET pickaxe_exp=pickaxe_exp + ${itemDrop.exp} WHERE player_id="${message.author.id}"`);
                message.channel.send(`${data.pickaxeEmoji} | **${message.author.username}** is working with his **${data.pickaxeName}** \nand strike a rock gaining **1xp**`)
            }
        } else if (workingCommand === 'chop') {
            // get item drop list
            let itemDropList = await queryData(`SELECT * FROM item WHERE available_area_id<="${discoveredArea}" AND type_id="11"`);
            let itemDrop = randomizeChance(itemDropList, discoveredArea);
            let maxGainingItem = itemDrop.id === 1 ? 3 * itemDrop.tier : 3;
            let gainingItem = Math.round(Math.random() * (maxGainingItem - 1) + 1); // get random item gaining
            if (itemDrop !== 0) {
                if (data.axeTier >= itemDrop.tier) {
                    queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${itemDrop.id}", ${gainingItem})`);
                    queryData(`UPDATE tools SET axe_exp=axe_exp + ${(itemDrop.exp / 2)} WHERE player_id="${message.author.id}"`);
                    message.channel.send(`${data.axeEmoji} | **${message.author.username}** working with his **${data.axeName}**,\n${itemDrop.emoji} | got **${gainingItem} ${itemDrop.name}** and gaining **${itemDrop.exp}xp**`)
                } else {
                    queryData(`UPDATE tools SET axe_exp=axe_exp + ${(itemDrop.exp / 2)} WHERE player_id="${message.author.id}"`);
                    message.channel.send(`${data.axeEmoji} | **${message.author.username}** working with his **${data.axeName}**,\n${itemDrop.emoji} | strike **${itemDrop.name}** but he didn't have stamina left to take it, \ncause by low tier tool, lucky you still gaining **${Math.round(itemDrop.exp / 2)}xp**`)
                }
            } else {
                queryData(`UPDATE tools SET axe_exp=axe_exp + ${(itemDrop.exp)} WHERE player_id="${message.author.id}"`);
                message.channel.send(`${data.axeEmoji} | **${message.author.username}** is working with his **${data.axeName}** \nbut he was too exhausted, at least he gaining **1xp**`)
            }
        }
    }
}


export default work;