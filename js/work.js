
import db from '../db_config.js'
import Discord from 'discord.js';

async function work(message, workingCommand) {
    let itemID = [
        {
            id: 1,
            name: 'Rock',
            min: 0,
            max: 0,
            xp: 8,
            icon: '<:baby_slime:801079278132527144>'
        },
        {
            id: 2,
            name: 'Copper Ore',
            min: 1,
            max: 3,
            xp: 9,
            icon: '<:slime:801079335569457182>'
        },
        {
            id: 3,
            name: 'Tin Ore',
            min: 1,
            max: 3,
            xp: 9,
            icon: ':bat:'
        },
        {
            id: 4,
            name: 'Iron Ore',
            min: 1,
            max: 3,
            xp: 9,
            icon: ':crab:'
        },
        {
            id: 5,
            name: 'Lead Ore',
            min: 1,
            max: 3,
            xp: 9,
            icon: ':wolf:'
        }
    ]

    let x = Math.random() * (5 - 1) + 1;
    x = Math.round(x);
    let y = Math.random();
    let item = '';
    if (y < 0.5) { // 50%
        item = itemID[0];
    } else if (y < 0.7) { // 20%
        item = itemID[1];
    } else if (y < 0.85) { // 15%
        item = itemID[2];
    } else if (y < 0.95) { // 10%
        item = itemID[3];
    } else { // 5 %
        item = itemID[4];
    }

    const query = `SELECT
                 item.name as pickaxeName, IFNULL(item.emoji,"") as pickaxeEmoji, item.tier as pickaxeTier,
                 item2.name as axeName, IFNULL(item2.emoji,"") as axeEmoji, item2.tier as axeTier
            FROM tools 
            LEFT JOIN item ON (tools.item_id_pickaxe = item.id)
            LEFT JOIN item as item2 ON (tools.item_id_axe = item2.id) WHERE player_id='${message.author.id}'`

    
    // Get Data
    db.query(query, async function (err, result) {
        if (err) throw err;
        let data = await result[0];

        if (data) {
            let gainingItem = Math.round(Math.random() * (item.max - item.min) + item.min);
            if (workingCommand === 'mine') {
                if (item === itemID[0]) {
                    message.channel.send(`${data.pickaxeEmoji} | **${message.author.username}** working with his **${data.pickaxeName}** \nand strike a rock gaining **${item.xp}xp**`)
                } else {
                    // db.query(`CALL insert_item_backpack_procedure("${message.author.id}", "${item.id}", ${gainingItem})`);
                    message.channel.send(`${data.pickaxeEmoji} | **${message.author.username}** working with his **${data.pickaxeName}**,\n${item.icon} | Found **${gainingItem} ${item.name}** and gaining **${item.xp}xp**`)
                }
            } else if (workingCommand === 'chop') {
                if (item === itemID[0]) {
                    message.channel.send(`${data.axeEmoji} | **${message.author.username}** working with his **${data.axeName}** \nand strike a rock gaining **${item.xp}xp**`)
                } else {
                    message.channel.send(`${data.axeEmoji} | **${message.author.username}** working with his **${data.axeName}**,\n${item.icon} | Found **${gainingItem} ${item.name}** and gaining **${item.xp}xp**`)
                }
            }
    
        }
    });
}


export default work;