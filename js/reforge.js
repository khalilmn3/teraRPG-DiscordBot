import Discord from 'discord.js';
import myCache from './cache/leaderboardChace.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import randomizeModifier from './helper/randomizeModifier.js';
async function reforge(message, args1, args2) {
    if (args1 === 'weapon') {
        processReforge(message, 1,1);
    } else if (args1 === 'helmet') {
        processReforge(message, 2,1);
    } else if (args1 === 'shirt') {
        processReforge(message, 3,1);
    } else if (args1 === 'pants') {
        processReforge(message, 4,1);
    } else if (args1 === 'info' && args2 === '2') {
        message.channel.send(listEmbedArmor());
    } else if (args1 === 'info') {
        message.channel.send(listEmbedWeapon());
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
        let item = await queryData(`SELECT stat.level, item.id, item.emoji, item.name, gold, IFNULL(cost,500) as cost FROM stat
                                LEFT JOIN equipment ON (stat.player_id=equipment.player_id)
                                ${queryCondition}
                                LEFT JOIN ${joinField} ON (equipment.${field}=${joinField}.id)
                                WHERE stat.player_id=${message.author.id} LIMIT 1`);
        item = item.length > 0 ? item[0] : 0;
        if (item !== 0) {
            if (item.level >= 5) {
                if (item.name) {
                    if (item.id == '278' || item.id == '279' || item.id == '280' || item.id == '281') {
                        return message.channel.send(`\\⛔ | **${message.author.username}**, you can't reforge **starter** equipment!`)
                    }
                    if (item.gold > item.cost) {
                        let forgeList = '';
                        if (equipmentSlot == 1) {
                            forgeList = myCache.get('forgeWeaponList');
                            if (forgeList == undefined) {
                                forgeList = await queryData(`SELECT id,name,chance1,chance2,chance3,cost FROM modifier_weapon`);
                                myCache.set('forgeWeaponList', forgeList);
                                // console.log('weponUndef')
                            }
                            forgeList = myCache.get('forgeWeaponList');
                        } else {
                            forgeList = myCache.get('forgeArmorList');
                            if (forgeList == undefined) {
                                forgeList = await queryData(`SELECT id,name,chance1,chance2,chance3,cost FROM modifier_armor`);
                                myCache.set('forgeArmorList', forgeList);
                                forgeList = myCache.get('forgeArmorList');
                            }
                        }
                        let modifier = await randomizeModifier(forgeList, modifierMode);
                        let nextCost = currencyFormat(modifierMode * modifier.cost);

                        // Update Enchant
                        queryData(`UPDATE stat SET gold=gold-${item.cost} WHERE player_id=${message.author.id} LIMIT 1`);
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
                
            } else {
                message.reply('your hand is not strong enough,\n you must be level 5 and above to reforge equipment!')
            }
        }
    }
}

function listEmbedWeapon() {
    return new Discord.MessageEmbed({
        type: "rich",
        title: 'Reforge Weapon',
        description: null,
        url: null,
        color: 10115509,
        fields: [
            {
                name:`__\`Modifier            Stat                Cost\`__`,
                value: `\`Broken------------[ -25% ]-----------[    100 ]\`
                        \`Shoddy------------[ -10% ]-----------[    300 ]\`
                        \`Weak--------------[  -5% ]-----------[    350 ]\`
                        \`Damaged-----------[   1% ]-----------[    400 ]\`
                        \`Keen--------------[   5% ]-----------[    500 ]\`
                        \`Ruthless----------[  10% ]-----------[    700 ]\`
                        \`Zealous-----------[  25% ]-----------[  1.000 ]\`
                        \`Hurtful-----------[  45% ]-----------[  1.500 ]\`
                        \`Strong------------[  70% ]-----------[  3.000 ]\`
                        \`Forceful----------[ 100% ]-----------[  7.000 ]\`
                        \`Unpleasant--------[ 135% ]-----------[ 15.000 ]\`
                        \`Demonic-----------[ 175% ]-----------[ 35.000 ]\`
                        \`Superior----------[ 220% ]-----------[ 50.000 ]\`
                        \`Godly-------------[ 250% ]-----------[ 75.000 ]\``,
                inline: true
            },
            {
                value: `use \`tera reforge weapon\`\narmor reforge info use \`reforge info 2\`\nyou must at least level 5 to reforge equipment`,
                name: 'Info'
            }
        ],
        provider: null,
        // timestamp: new Date(),
    })
}
function listEmbedArmor() {
    return new Discord.MessageEmbed({
        type: "rich",
        title: 'Reforge Armor',
        description: null,
        url: null,
        color: 10115509,
        fields: [ 
            {
                name:`__\`Modifier           Stat               Cost\`__`,
                value: `\`Hard--------------[ +1 ]-----------[  1.000 ]\`
                        \`Guarding----------[ +2 ]-----------[  3.000 ]\`
                        \`Armored-----------[ +4 ]-----------[ 15.000 ]\`
                        \`Warding-----------[ +8 ]-----------[ 35.000 ]\`
                        \`Defender----------[+16 ]-----------[ 70.000 ]\``,
                inline: false,
            }, 
            {
                value: `use \`tera reforge helmet/shirt/pants\`\nweapon reforge info use \`reforge info 1\`\nyou must at least level 5 to reforge equipment`,
                name: 'Info'
            }
        ],
        provider: null,
        // timestamp: new Date(),
    })
}
export default reforge;