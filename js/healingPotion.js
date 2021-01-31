
import db from '../db_config.js'
import Discord from 'discord.js';

async function healingPotion(message, client, id, username) { 
    
    const query = `SELECT stat.*, armor.def, level.experience FROM level,stat LEFT JOIN armor ON (stat.armor_id = armor.id) WHERE level.id > stat.level AND stat.player_id="${id}" LIMIT 1`;
    db.query(query, async (err, result) => {
        if (err) throw err;
        let stat = await result[0];
        console.log(stat);
        let def = stat.basic_def * stat.level + stat.def + (stat.def * stat.armor_enchant * 0.3);
        let maxHp = 5 * (stat.level + stat.basic_hp);
        let maxMp = 5 * (stat.level + stat.basic_mp);
        let bHp = stat.hp;
        // PLAYER DIED
        if (bHp < maxHp) {
            db.query(`UPDATE stat SET hp=${maxHp} WHERE player_id="${id}"`);
            message.channel.send(`:adhesive_bandage: | **${username}** HP has been restored.`)
        } else {
            message.channel.send(`**${username}** current HP is maxed out.`)
        }
    })
}

export default healingPotion;