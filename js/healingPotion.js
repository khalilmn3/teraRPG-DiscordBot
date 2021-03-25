
import db from '../db_config.js';
import queryData from './helper/query.js';

async function healingPotion(message, client, id, username) { 
    
    const query = `SELECT stat.*, armor.def, level.experience, IFNULL(Backpack.quantity,0) as healing_potion FROM level,stat 
                LEFT JOIN armor ON (stat.armor_id = armor.id)
                LEFT JOIN (SELECT quantity,player_id FROM backpack WHERE item_id="266" AND player_id="${id}" LIMIT 1) as Backpack ON (stat.player_id = Backpack.player_id)
                WHERE level.id > stat.level AND stat.player_id="${id}" LIMIT 1`;
    db.query(query, async (err, result) => {
        if (err) throw err;
        let stat = await result[0];
        let maxHp = 5 * (stat.level + stat.basic_hp);
        let bHp = stat.hp;
        // PLAYER DIED
        if (stat.healing_potion > 0) {
            if (bHp < maxHp) {
                db.query(`UPDATE stat SET hp=${maxHp} WHERE player_id="${id}"`);
                queryData(`UPDATE backpack SET quantity=quantity - 1 WHERE player_id="${id}" AND item_id="266" LIMIT 1`);
                message.channel.send(`:adhesive_bandage: | **${username}** HP has been restored.`)
            } else {
                message.channel.send(`**${username}** current HP is maxed out.`)
            }
        } else {
            message.reply(`you don't have <:Healing_Potion:810747622859735100>**healing potion**\nbuy some on \`shop\``);
        }
    })
}

export default healingPotion;