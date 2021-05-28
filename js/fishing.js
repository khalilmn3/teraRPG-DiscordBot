import { cooldownMessage } from "./embeddedMessage.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import queryData from "./helper/query.js";
import randomizeChance from "./helper/randomize.js";
import randomNumber from "./helper/randomNumberWithMinMax.js";
import setCooldowns from "./helper/setCooldowns.js";

async function fishing(message, stat) {
    let cooldowns = await isCommandsReady(message.author.id, 'fish');
    if (cooldowns.isReady) {
        let fishingPole = await queryData(`SELECT fishing_pole.exp, fishing_pole.level, Bait.bait_id, IFNULL(Bait.quantity,0) as bait, SUM(IFNULL(Bait.bait_power,0) + IFNULL(cfg_fishing_pole.bait_power,0)) as bait_power, fishing_pole.level, item.name, item.emoji, item.tier FROM fishing_pole
                        LEFT JOIN item ON (fishing_pole.item_id = item.id)
                        LEFT JOIN cfg_fishing_pole ON (fishing_pole.item_id = cfg_fishing_pole.item_id)
                        LEFT JOIN
                            (SELECT backpack.player_id, item.id as bait_id, backpack.quantity, bait.bait_power FROM backpack
                                LEFT JOIN item ON (backpack.item_id=item.id)
                                LEFT JOIN bait ON (item.id=bait.item_id)
                                WHERE item.type_id=17 AND backpack.quantity > 0 AND player_id=${message.author.id}
                                ORDER BY bait.bait_power DESC
                                LIMIT 1) AS Bait
                            ON (fishing_pole.player_id=Bait.player_id)
                        WHERE fishing_pole.player_id="${message.author.id}" LIMIT 1`);
        if (fishingPole.length > 0) {
            fishingPole = fishingPole[0];
            if (fishingPole.bait > 0) {
                setCooldowns(message.author.id, 'fish');
                let expNextLevel = parseInt(fishingPole.level) * 450;
                let level = fishingPole.level;
                let baitPower = fishingPole.bait_power;
                let catchList = await queryData(`SELECT item.id, item.emoji, item.name,item.type_id, item.chance, item.exp FROM item WHERE item_group_id=6 AND tier<=${fishingPole.tier} AND available_area_id LIKE "%${stat.zone_id}%"`);
                for (let index = 0; index < catchList.length; index++) {
                    let increaseChance = Math.round((parseInt(catchList[index].chance) * parseInt(baitPower)) / 100);
                    if (catchList[index].chance > 0) {
                        catchList[index].chance = parseInt(catchList[index].chance) + parseInt(increaseChance);
                    }
                }
                queryData(`UPDATE backpack SET quantity=quantity-1 WHERE item_id="${fishingPole.bait_id}" AND player_id=${message.author.id} LIMIT 1`);
                let itemCatch = randomizeChance(catchList);
                if (itemCatch === 0) {
                    let randomJunk = randomNumber(0, 2);
                    let junk = catchList.filter(item => item.type_id === 14);
                    let expGain = junk[randomJunk]['exp'];
                    let totalExp = parseInt(expGain) + parseInt(fishingPole.exp);
                    if (totalExp >= expNextLevel) {
                        totalExp = parseInt(expNextLevel) - parseInt(totalExp);
                        level = fishingPole.level + 1;
                    }
                    queryData(`UPDATE fishing_pole SET exp=${totalExp}, level=${level} WHERE player_id="${message.author.id}" LIMIT 1`)
                    message.channel.send(`${fishingPole.emoji} | **${message.author.username}** Cast **${fishingPole.name}** and caught a ${junk[randomJunk]['emoji']} **${junk[randomJunk]['name']}**. \na junk? you just throw it away...`)
                } else {
                    let expGain = itemCatch.exp;
                    let totalExp = parseInt(expGain) + parseInt(fishingPole.exp);
                    if (totalExp >= expNextLevel) {
                        totalExp = parseInt(expNextLevel) - parseInt(totalExp);
                        level = fishingPole.level + 1;
                    }
                    queryData(`UPDATE fishing_pole SET exp=${totalExp}, level=${level} WHERE player_id="${message.author.id}" LIMIT 1`)
                    queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${itemCatch.id}", "1")`);
                    message.channel.send(`${fishingPole.emoji} | **${message.author.username}** Cast **${fishingPole.name}** and caught a ${itemCatch.emoji} **${itemCatch.name}**.`)
                }
            } else {
                message.reply(`you don't have bait on your backpack,\nbuy some on \`shop\` or catch it with **bug net**!`)
            }
        } else {
            message.reply(`You didn't have Fishing Pole, \nType \`tera craft list\` to see full list of item craft`);
        }
    } else {
        message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Fish', cooldowns.waitingTime));
    }
}
export default fishing;