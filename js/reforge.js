import Discord from 'discord.js';
import myCache from './cache/leaderboardChace.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import randomizeModifier from './helper/randomizeModifier.js';
async function reforge(message,command, args1) {
    if (args1 === 'weapon') {
        processReforge(message, 1,1);
    } else if (args1 === 'helmet') {
        processReforge(message, 2,1);
    } else if (args1 === 'shirt') {
        processReforge(message, 3,1);
    } else if (args1 === 'pants') {
        processReforge(message, 4,1);
    } else {
        message.channel.send(`I don't get it, make sure you type the correct equipment to reforge\ne.g. \`tera reforge weapon/helmet\``)
    }
}

async function processReforge(message, equipmentSlot,  modifierMode) {
    let queryCondition = '';
    let eqMsg = '';
    let field = '';
    let joinField = '';
    if (equipmentSlot == 1) {
        queryCondition = 'LEFT JOIN weapon ON (equipment.weapon_id=weapon.id) LEFT JOIN item ON (weapon.item_id=item.id)';
        eqMsg = 'weapon';
        field = 'weapon_modifier_id';
        joinField = 'modifier_weapon';
    } else if (equipmentSlot == 2) {
        queryCondition = 'LEFT JOIN armor ON (equipment.helmet_id=armor.id) LEFT JOIN item ON (armor.item_id=item.id)';
        eqMsg = 'helmet armor';
        field = 'helmet_modifier_id';
        joinField = 'modifier_armor';
    } else if (equipmentSlot == 3) {
        queryCondition = 'LEFT JOIN armor ON (equipment.shirt_id=armor.id) LEFT JOIN item ON (armor.item_id=item.id)';
        eqMsg = 'shirt armor';
        field = 'shirt_modifier_id';
        joinField = 'modifier_armor';
    } else if (equipmentSlot == 4) {
        queryCondition = 'LEFT JOIN armor ON (equipment.pants_id=armor.id) LEFT JOIN item ON (armor.item_id=item.id)';
        eqMsg = 'pants armor';
        field = 'pants_modifier_id';
        joinField = 'modifier_armor';
    }

    if (equipmentSlot > 0) {
        let item = await queryData(`SELECT item.emoji, item.name, gold, cost FROM stat
                                LEFT JOIN equipment ON (stat.player_id=equipment.player_id)
                                ${queryCondition}
                                LEFT JOIN ${joinField} ON (equipment.${field}=${joinField}.id)
                                WHERE stat.player_id=${message.author.id} LIMIT 1`);
        item = item.length > 0 ? item[0] : 0;
        if (item !== 0) {
            if (item.name) {
                if (item.gold > item.cost) {
                    let forgeList = '';
                    if (equipmentSlot == 1) {
                        forgeList = myCache.get('forgeWeaponList');
                        if (forgeList == undefined) {
                            forgeList = await queryData(`SELECT id,name,chance1,chance2,chance3,cost FROM modifier_weapon`);
                            myCache.set('forgeWeaponList', forgeList);
                            console.log('weponUndef')
                        }
                        forgeList = myCache.get('forgeWeaponList');
                    } else {
                        forgeList = myCache.get('forgeArmorList');
                        if (forgeList == undefined) {
                            forgeList = await queryData(`SELECT id,name,chance1,chance2,chance3,cost FROM modifier_armor`);
                            myCache.set('forgeArmorList', forgeList);
                            console.log('armornUndef')
                        }
                        forgeList = myCache.get('forgeArmorList');
                    }
                    let modifier = await randomizeModifier(forgeList, modifierMode);
                    let nextCost = currencyFormat(modifierMode * modifier.cost);

                    // Update Enchant
                    queryData(`UPDATE equipment SET ${field}="${modifier.id}" WHERE player_id="${message.author.id}" LIMIT 1`);
            
                    message.channel.send(new Discord.MessageEmbed({
                        type: "rich",
                        description: null,
                        url: null,
                        color: 10115509,
                        fields: [{
                            name: `Result`,
                            value: `${item.emoji} | ${modifier.name} ${item.name} \n========================\nnext reforge cost: <:gold_coin:801440909006209025> ${nextCost}`,
                            inline: false,
                        }],
                        thumbnail: {
                            url: `https://static.wikia.nocookie.net/terraria_gamepedia/images/1/12/Reforge.png/revision/latest?cb=20161017115112`,
                            proxyURL: `https://cdn.discordapp.com/attachments/811586577612275732/824990018292547644/Reforge.png`,
                            height: 0,
                            width: 0
                        },
                        author: {
                            "name": `${message.author.username}'s Reforge`,
                            "url": null,
                            "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                        }
                    }));
                } else {
                    message.reply(`Check your wallet, your gold may run out elsewhere`)
                }
            } else {
                message.reply(`you don't have a ${eqMsg} to reforge!`);
            }
        }
    }
}
export default reforge;