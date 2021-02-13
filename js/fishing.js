import { cooldownMessage } from "./embeddedMessage.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import queryData from "./helper/query.js";
import randomizeChance from "./helper/randomize.js";
import setCooldowns from "./helper/setTime.js";

async function fishing(message,stat) {
    let cooldowns = await isCommandsReady(message.author.id, 'fish');
    if (cooldowns.isReady) {
        let fishingPole = await queryData(`SELECT fishing_pole.level, item.name, item.emoji, item.tier FROM fishing_pole
        LEFT JOIN item ON (fishing_pole.item_id = item.id)
        WHERE player_id="${message.author.id}" LIMIT 1`);
        if (fishingPole.length > 0) {
            setCooldowns(message.author.id, 'fish');
            fishingPole = fishingPole[0];
            let catchList = await queryData(`SELECT item.id, item.emoji, item.name,item.type_id, item.chance, item.exp FROM item WHERE item_group_id=6 AND tier<=${fishingPole.tier} AND available_area_id LIKE "%${stat.zone_id}%"`);
            let itemCatch = randomizeChance(catchList);
            if (itemCatch === 0) {
                let randomJunk = Math.round(Math.random() * (2 - 0) + 0);
                let junk = catchList.filter(item => item.type_id === 14);
                queryData(`UPDATE fishing_pole SET exp=exp+${junk[randomJunk]['exp']} WHERE player_id="${message.author.id}" LIMIT 1`)
                message.channel.send(`${fishingPole.emoji} | **${message.author.username}** Cast **${fishingPole.name}** and caught a ${junk[randomJunk]['emoji']} **${junk[randomJunk]['name']}**. \na junk? you just trow it away...`)
            } else {
                queryData(`UPDATE fishing_pole SET exp=exp+${itemCatch.exp} WHERE player_id="${message.author.id}" LIMIT 1`)
                queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${itemCatch.id}", "1")`);
                message.channel.send(`${fishingPole.emoji} | **${message.author.username}** Cast **${fishingPole.name}** and caught a ${itemCatch.emoji} **${itemCatch.name}**.`)
            }
        } else {
            message.reply(`You didn't have Fishing Pole, \nType \`tera craft list\` to see full list of item craft`);
        }
    } else {
        message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Fish', cooldowns.waitingTime));
    }
}
export default fishing;