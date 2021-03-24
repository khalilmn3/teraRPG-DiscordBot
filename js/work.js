import isCommandsReady from './helper/isCommandsReady.js';
import queryData from './helper/query.js';
import randomizeChance from './helper/randomize.js';
import setCooldowns from './helper/setCooldowns.js';
import { cooldownMessage } from './embeddedMessage.js';
import randomNumber from './helper/randomNumberWithMinMax.js';

async function work(message, workingCommand, zone_id) {
    let cooldowns = await isCommandsReady(message.author.id, 'work');
    if (cooldowns.isReady) {
        let discoveredZone = zone_id;
        const notFoundItemXP = 1;
        // Get player's tools
        let data = await queryData(`SELECT
                 item.name as pickaxeName, IFNULL(item.emoji,"") as pickaxeEmoji, item.tier as pickaxeTier, stat.depth,
                 item2.name as axeName, IFNULL(item2.emoji,"") as axeEmoji, item2.tier as axeTier,
                 utility.mining_helmet
            FROM tools
            LEFT JOIN item ON (tools.item_id_pickaxe = item.id)
            LEFT JOIN stat ON (tools.player_id = stat.player_id)
            LEFT JOIN utility ON (tools.player_id=utility.player_id)
            LEFT JOIN item as item2 ON (tools.item_id_axe = item2.id) WHERE tools.player_id='${message.author.id}' LIMIT 1`);

        data = data[0];

        if (data) {
            setCooldowns(message.author.id, 'work')
            if (workingCommand === 'mine') {
                // get item drop list
                let itemDropList = await queryData(`SELECT item.* FROM discoverable_ore LEFT JOIN item ON (discoverable_ore.item_id=item.id) 
                            WHERE discoverable_ore.min_depth<=${data.depth} AND type_id="7" AND dropable="1"`);
                let levelPickaxe = await queryData(`SELECT pickaxe_exp, pickaxe_level FROM tools WHERE player_id="${message.author.id}" LIMIT 1`);
                // grant get item when using mining helmet
                if (data.mining_helmet) {
                    let totalChance = 0;
                    itemDropList.forEach(element => {
                        totalChance += element.chance;
                    });
                    if (totalChance < 100) {
                        let dsChance = 100 - totalChance;
                        for (let i = 0; i < itemDropList.length; i++) {
                            if (itemDropList[i].id == 1) {
                                itemDropList[i].chance = (itemDropList[i].chance + dsChance).toFixed(2);
                            }
                        }
                    }
                }
                let itemDrop = randomizeChance(itemDropList, discoveredZone);
                levelPickaxe = levelPickaxe.length > 0 ?  levelPickaxe[0] : [];
                let maxItemBasedOnTier = (3 + (levelPickaxe.pickaxe_level * 0.3)) / itemDrop.tier;
                let maxGainingItem = itemDrop.id === 1 ? 3 * levelPickaxe.pickaxe_level : 3;
                let gainingItem = randomNumber(1, maxItemBasedOnTier);// get random item gaining
                let expGot = parseInt(itemDrop.exp) * gainingItem;
                let totalExp = expGot + parseInt(levelPickaxe.pickaxe_exp);
                let expNextLevel = parseInt(levelPickaxe.pickaxe_level) * 300;
                let nextLevel = levelPickaxe.pickaxe_level;
                if (itemDrop !== 0) {
                    if ((data.pickaxeTier + 1) >= itemDrop.tier) {
                        if (totalExp > expNextLevel) {
                            totalExp = Math.round(totalExp - expNextLevel);
                            nextLevel = parseInt(levelPickaxe.pickaxe_level) + 1;
                        }
                        queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${itemDrop.id}", ${gainingItem})`);
                        queryData(`UPDATE tools SET pickaxe_exp=${totalExp}, pickaxe_level=${nextLevel} WHERE player_id="${message.author.id}" LIMIT 1`);
                        message.channel.send(`${data.pickaxeEmoji} | **${message.author.username}** is working with his **${data.pickaxeName}**,\n${itemDrop.emoji} | Found **${gainingItem} ${itemDrop.name}** and gaining **${expGot}xp**`)
                    } else {
                        totalExp = Math.round((parseInt(itemDrop.exp) / 2) + parseInt(levelPickaxe.pickaxe_exp));
                        if (totalExp > expNextLevel) {
                            totalExp = Math.round(totalExp - expNextLevel);
                            nextLevel = parseInt(levelPickaxe.pickaxe_level) + 1;
                        }
                        queryData(`UPDATE tools SET pickaxe_exp=${totalExp}, pickaxe_level=${nextLevel} WHERE player_id="${message.author.id}" LIMIT 1`);
                        message.channel.send(`${data.axeEmoji} | **${message.author.username}** is working with his **${data.axeName}**,\n${itemDrop.emoji} | Found **${itemDrop.name}** but it harder than your tool, lucky you still gaining **${Math.round(itemDrop.exp / 2)}xp**`)
                    }
                } else {
                    totalExp = Math.round(notFoundItemXP + parseInt(levelPickaxe.pickaxe_exp));
                    if (totalExp > expNextLevel) {
                        totalExp = Math.round(totalExp - expNextLevel);
                        nextLevel = parseInt(levelPickaxe.pickaxe_level) + 1;
                    }
                    queryData(`UPDATE tools SET pickaxe_exp=${totalExp}, pickaxe_level=${nextLevel} WHERE player_id="${message.author.id}" LIMIT 1`);
                    message.channel.send(`${data.pickaxeEmoji} | **${message.author.username}** is working with his **${data.pickaxeName}** \nand strike a rock gaining **1xp**`)
                }
                queryData(`UPDATE stat SET depth=depth + ${5 + (data.pickaxeTier * 0.3)} WHERE player_id="${message.author.id}"`);
            } else if (workingCommand === 'chop') {
                // get item drop list
                let itemDropList = await queryData(`SELECT * FROM item WHERE available_area_id<="${discoveredZone}" AND type_id="11" AND dropable="1"`);
                let itemDrop = randomizeChance(itemDropList, discoveredZone);
                let levelAxe = await queryData(`SELECT axe_level, axe_exp FROM tools WHERE player_id="${message.author.id}" LIMIT 1`);
                levelAxe = levelAxe.length > 0 ?  levelAxe[0] : [];
                let maxItemBasedOnTier = (3 + (levelAxe.axe_level * 0.3)) / itemDrop.tier;
                let maxGainingItem = itemDrop.id === 1 ? 3 * itemDrop.tier : 3;
                let gainingItem = randomNumber(1, maxItemBasedOnTier); // get random item gaining
                let expGot = parseInt(itemDrop.exp) * gainingItem;
                let totalExp = expGot + parseInt(levelAxe.axe_exp);
                let expNextLevel = parseInt(levelAxe.axe_level) * 250;
                let nextLevel = levelAxe.axe_level;
                if (itemDrop !== 0) {
                    if (data.axeTier >= itemDrop.tier) {
                        if (totalExp > expNextLevel) {
                            totalExp = Math.round(totalExp - expNextLevel);
                            nextLevel = parseInt(levelAxe.axe_level) + 1;
                        }
                        queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${itemDrop.id}", ${gainingItem})`);
                        queryData(`UPDATE tools SET axe_exp=${totalExp}, axe_level=${nextLevel} WHERE player_id="${message.author.id}" LIMIT 1`);
                        message.channel.send(`${data.axeEmoji} | **${message.author.username}** working with his **${data.axeName}**,\n${itemDrop.emoji} | got **${gainingItem} ${itemDrop.name}** and gaining **${expGot}xp**`)
                    } else {
                        totalExp = Math.round((parseInt(itemDrop.exp) / 2) + parseInt(levelAxe.axe_exp));
                        if (totalExp > expNextLevel) {
                            totalExp = Math.round(totalExp - expNextLevel);
                            nextLevel = parseInt(levelAxe.axe_level) + 1;
                        }
                        queryData(`UPDATE tools SET axe_exp=${totalExp}, axe_level=${nextLevel} WHERE player_id="${message.author.id}" LIMIT 1`);
                        message.channel.send(`${data.axeEmoji} | **${message.author.username}** working with his **${data.axeName}**,\n${itemDrop.emoji} | strike **${itemDrop.name}** but he didn't have stamina left to take it, \ncause by low tier tool, lucky you still gaining **${Math.round(itemDrop.exp / 2)}xp**`)
                    }
                } else {
                    totalExp = Math.round(notFoundItemXP + parseInt(levelAxe.axe_exp));
                    if (totalExp > expNextLevel) {
                        totalExp = Math.round(totalExp - expNextLevel);
                        nextLevel = parseInt(levelAxe.axe_level) + 1;
                    }
                    queryData(`UPDATE tools SET axe_exp=${totalExp}, axe_level=${nextLevel} WHERE player_id="${message.author.id}" LIMIT 1`);
                    message.channel.send(`${data.axeEmoji} | **${message.author.username}** is working with his **${data.axeName}** \nbut he was too exhausted, at least he gaining **${notFoundItemXP}xp**`)
                }
            }
        }
    } else {
        message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Work', cooldowns.waitingTime));
    }
}


export default work;