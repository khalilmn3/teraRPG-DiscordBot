import { getMaxHP } from './helper/getBattleStat.js';
import queryData from './helper/query.js';

async function healingPotion(message, client, id, username) { 
    
    let stat = await queryData(`SELECT stat.*, IFNULL(Backpack.quantity,0) as healing_potion FROM stat 
                LEFT JOIN (SELECT quantity,player_id FROM backpack WHERE item_id="266" AND player_id="${id}" LIMIT 1) as Backpack ON (stat.player_id = Backpack.player_id)
                WHERE stat.player_id="${id}" LIMIT 1`);
    if(stat.length > 0){ 
        stat = stat[0];
        let maxHp = getMaxHP(stat.basic_hp, stat.level);
        // PLAYER DIED
        if (stat.healing_potion > 0) {
            if (stat.hp < maxHp) {
                queryData(`UPDATE stat SET hp=${maxHp} WHERE player_id="${id}" LIMIT 1`);
                queryData(`UPDATE backpack SET quantity=quantity - 1 WHERE player_id="${id}" AND item_id="266" LIMIT 1`);
                message.channel.send(`<:Healing_Potion:810747622859735100> | **${username}** using **healing potion**... \nHP has been restored.`)
            } else {
                message.channel.send(`**${username}** current HP is maxed out.`)
            }
        } else {
            message.reply(`you don't have <:Healing_Potion:810747622859735100>**healing potion**\nbuy some on \`shop\``);
        }
    } else {
        message.reply(`you don't have <:Healing_Potion:810747622859735100>**healing potion**\nbuy some on \`shop\``);
    }
}

export default healingPotion;