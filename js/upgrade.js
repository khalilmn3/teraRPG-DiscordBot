import Discord from 'discord.js';
import queryData from './helper/query.js';
import { materialUpgradeTool } from './helper/variable.js';


function upgrade(message, args1) {
    if (args1 === 'pickaxe') {
        upgradeTools(message, message.author.id, 1)
    } else if (args1 === 'axe') {
        message.channel.send('Axe tools cannot be upgrade right now \nWe will add it on the next update')
        // upgradeTools(message, message.author.id, 2)
    } else if (args1 === 'list') {
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            title: null,
            description: 'Tools Upgrade',
            url: null,
            color: 10115509,
            fields: [
                {
                    value: `<:Copper_Pickaxe:803907956424835124> ➜ <:Iron_Pickaxe:805727630564786186> : 25 <:Iron_Bar:803907956528906241> + 15 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                        `\n<:Iron_Pickaxe:805727630564786186> ➜ <:Silver_Pickaxe:805727630769782794> : 20 <:Silver_Bar:803907956663910410> + 20 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                        `\n<:Silver_Pickaxe:805727630769782794> ➜ <:Tungsten_Pickaxe:803907956571504681> : 15 <:Tungsten_Bar:803907956252344331> + 35 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                        `\n<:Tungsten_Pickaxe:803907956571504681> ➜ <:Gold_Pickaxe:803907956734165012> : 10 <:Gold_Bar:803907956424441856> + 50 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>`,
                        // `\n<:Gold_Pickaxe:803907956734165012> ➜ <:Platinum_Pickaxe:803907956675575828> : 5 <:Platinum_Bar:803907956327317524> + 75 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>`,
                    name: "Pickaxe",
                    inline: false
                },],
            provider: null,
            // timestamp: new Date(),
        }))
    } else {
        message.reply('what are you trying to upgrade?\n try `tera upgrade pickaxe`.')
    }
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
            let materialList = '';
            let upgradeToId = '';
            if (toolsTier == 1) {
                upgradeToId = id == 1 ? 48 : 91;
                materialList = materialUpgradeTool.ironPickaxe;
            } else if (toolsTier == 2) {
                upgradeToId = id == 1 ? 50 : 93;
                materialList = materialUpgradeTool.silverPickaxe
            } else if (toolsTier == 3) {
                upgradeToId = id == 1 ? 51 : 94;
                materialList = materialUpgradeTool.tungstenPickaxe
            } else if (toolsTier == 4) {
                upgradeToId = id == 1 ? 52 : 95;
                materialList = materialUpgradeTool.goldPickaxe
            }
            // else if (toolsTier == 5) {
            //     upgradeToId = id == 1 ? 56 : 96;
            //     materialList = 30;
            // }
            let existMaterials = [];
            let exist = 1;
            // let exist = new Promise((resolve, reject) => {
            for (const element of materialList) {
                existMaterials = await queryData(`SELECT item_id FROM backpack WHERE player_id="${playerId}" AND (item_id=${element.id} AND quantity>=${element.quantity}) LIMIT 1`);
                if (!existMaterials.length > 0) {
                    exist = 0;
                }
            }
            // let existMaterials1 = await queryData(`SELECT item_id FROM backpack WHERE player_id="${playerId}" AND (item_id=${materialList[0].id} AND quantity>=${materialList[0].quantity}) LIMIT 1`);
            // let existMaterials2 = await queryData(`SELECT item_id FROM backpack WHERE player_id="${playerId}" AND (item_id=${materialList[1].id} AND quantity>=${materialList[1].quantity}) LIMIT 1`);
            if (exist) {
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
                message.reply(`:no_entry_sign: | you don't have enough materials to upgrade your **${toolsName}**,\ngo work and get the materials it need, you can also check upgrade material needs with \`tera upgrade list\`!`);
            }
        } else {
            message.reply(`:no_entry_sign: | you need <:Iron_Anvil:804145327435284500> **anvil** to upgrade **${toolsName}**!`)
        }
    } else {
        message.reply(`:no_entry_sign: | your **${toolsName}** is on the maximum tier\nyou cannot upgrade it anymore`);
    }
}

export default upgrade;