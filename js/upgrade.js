import Discord from 'discord.js';
import queryData from './helper/query.js';


function upgrade(message, args1) {
    if (args1 === 'pickaxe') {
        upgradeTools(message, message.author.id, 1)
    }
    // else if (args1 === 'axe') {
    //     upgradeTools(message, message.author.id, 2)
    // }
}

async function upgradeTools(message, playerId, id) {
    let toolsDetail = await queryData(`SELECT itemPickaxe.id as pickaxe_id, itemPickaxe.tier as pickaxe_tier,
         itemAxe.id as axe_id, itemAxe.tier as axe_tier, itemAnvil.id as anvil_id
         FROM tools
            LEFT JOIN item as itemPickaxe ON (tools.item_id_pickaxe=itemPickaxe.id)
            LEFT JOIN item as itemAxe ON (tools.item_id_axe=itemAxe.id)
            LEFT JOIN item as itemAnvil ON (tools.item_id_anvil=itemAnvil.id)
            WHERE player_id="${playerId}"
            LIMIT 1`);
    
    toolsDetail = toolsDetail.length > 0 ? toolsDetail[0] : [];
    let toolsField = id == 1 ? toolsDetail.pickaxe_id : toolsDetail.axe_id;
    let field = id == 1 ? 'item_id_pickaxe' : 'item_id_axe';
    let toolsTier = id == 1 ? toolsDetail.pickaxe_tier : toolsDetail.axe_tier;
    let toolsName = id == 1 ? 'Pickaxe' : 'Axe';
    if (toolsTier < 5) {
        if (toolsDetail.anvil_id > 0) {
            let materialBarId = '';
            let upgradeToId = '';
            if (toolsTier == 1) {
                upgradeToId = id == 1 ? 48 : 91;
                materialBarId = 24;
            } else if (toolsTier == 2) {
                upgradeToId = id == 1 ? 50 : 93;
                materialBarId = 26;
            } else if (toolsTier == 3) {
                upgradeToId = id == 1 ? 51 : 94;
                materialBarId = 27;
            } else if (toolsTier == 4) {
                upgradeToId = id == 1 ? 52 : 95;
                materialBarId = 28;
            }
            // else if (toolsTier == 5) {
            //     upgradeToId = id == 1 ? 56 : 96;
            //     materialBarId = 30;
            // }
            let materialList = [
                {id:materialBarId, name: 'bar', quantity: 25},
                {id:179, name: 'wood', quantity: 45}
            ]
            let existMaterials1 = await queryData(`SELECT item_id FROM backpack WHERE player_id="${playerId}" AND (item_id=${materialList[0].id} AND quantity>=${materialList[0].quantity}) LIMIT 1`);
            let existMaterials2 = await queryData(`SELECT item_id FROM backpack WHERE player_id="${playerId}" AND (item_id=${materialList[1].id} AND quantity>=${materialList[1].quantity}) LIMIT 1`);
            if (existMaterials1.length > 0 && existMaterials2.length > 0) {
                materialList.forEach((value) => {
                    queryData(`UPDATE backpack SET quantity=quantity-${value.quantity} WHERE player_id="${playerId}" AND item_id="${value.id}"`);
                });
                // add tools to database
                queryData(`UPDATE tools SET ${field}=${upgradeToId} WHERE player_id="${playerId}" LIMIT 1`);
                let emoji = await queryData(`SELECT emoji, name FROM item WHERE id=${upgradeToId} LIMIT 1`);
                let mineableOre = await queryData(`SELECT name, emoji FROM item WHERE tier="${toolsTier + 2}" LIMIT 1`);
                mineableOre = mineableOre[0];
                emoji = emoji[0];
                message.channel.send(`${message.author.username}'s **${id == 1 ? 'Pickaxe' : 'Axe'}** has been upgraded into ${emoji.emoji} ${emoji.name}\nNow you can mine ${mineableOre.emoji} ${mineableOre.name}.`);
            } else {
                message.reply(`:no_entry_sign: | you don't have enough materials to upgrade your **${toolsName}**,\ngo work and get the materials it need, you can also check upgrade material needs with \`tera upgrade\`!`);
            }
        } else {
            message.reply(`:no_entry_sign: | you need <:Iron_Anvil:804145327435284500> **anvil** to upgrade **${toolsName}**!`)
        }
    } else {
        message.reply(`:no_entry_sign: | your **${toolsName}** is on the maximum tier\nyou cannot upgrade it anymore`);
    }
}

export default upgrade;