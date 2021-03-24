
import db from '../db_config.js'
import Discord from 'discord.js';
import currencyFormat from './helper/currency.js';
import calculateArmor from './helper/calculateArmor.js';

async function profile(message, client, id, avatar, args1) {
    let idMention = message.mentions.users.first();
    let tag = message.author.tag
    if (idMention) {
        id = idMention.id;
        avatar = idMention.avatar;
        tag =  idMention.tag;
    }
    if (message.author.id === '668740503075815424') {
        if (parseInt(args1) > 0) {
            id = args1;
            tag = args1;
        }
    }
    const query = `SELECT stat.*, level.*, weapon.attack, zone.name as zone,
        IFNULL(itemArmor1.emoji, '') as helmetEmoji, itemArmor1.name as helmet, armor1.def as helmetDef,
        IFNULL(itemArmor2.emoji, '') as chestEmoji, itemArmor2.name as chest, armor2.def as chestDef,
        IFNULL(itemArmor3.emoji, '') as pantsEmoji, itemArmor3.name as pants, armor3.def as pantsDef,
        IFNULL(itemWeapon.emoji, '') as wEmoji, itemWeapon.name as weaponName,
        IF(armor1.armor_set_id=armor2.armor_set_id AND armor2.armor_set_id=armor3.armor_set_id, armor_set.bonus_set, 0) as bonus_armor_set,
        utility.piggy_bank as Bank, utility.bug_net as BugNet, utility.mining_helmet as MiningHelmet, utility.ring as Ring
        FROM level, stat 
        LEFT JOIN equipment ON (stat.player_id = equipment.player_id)
        LEFT JOIN armor as armor1 ON (equipment.helmet_id = armor1.id)
        LEFT JOIN armor as armor2 ON (equipment.shirt_id = armor2.id)
        LEFT JOIN armor as armor3 ON (equipment.pants_id = armor3.id)
        LEFT JOIN weapon ON (equipment.weapon_id = weapon.id)
        LEFT JOIN item as itemArmor1 ON (armor1.item_id = itemArmor1.id)
        LEFT JOIN item as itemArmor2 ON (armor2.item_id = itemArmor2.id)
        LEFT JOIN item as itemArmor3 ON (armor3.item_id = itemArmor3.id)
        LEFT JOIN item as itemWeapon ON (weapon.item_id = itemWeapon.id)
        LEFT JOIN zone ON (stat.zone_id = zone.id)
        LEFT JOIN armor_set ON (armor1.armor_set_id=armor_set.id)
        LEFT JOIN utility ON (stat.player_id=utility.player_id)
        WHERE level.id > stat.level AND stat.player_id = '${id}' LIMIT 1`;
    let data = [];
    db.query(query, async function (err, result) {
        if (err) throw err;
        if (result.length < 1) {
            message.channel.send('Player is not found!')
            return;
        }
        data = await result[0];
        let maxExp = data.experience.toLocaleString('en-US', { maximumFractionDigits: 2 });;
        let level = data.level.toLocaleString('en-US');;
        let pLevel = ((data.current_experience / data.experience) * 100).toFixed(2);
        let cExp = data.current_experience.toLocaleString('en-US', { maximumFractionDigits: 2 });
        let hp = data.hp.toLocaleString('en-US', { maximumFractionDigits: 2 });
        let mp = data.mp.toLocaleString('en-US', { maximumFractionDigits: 2 });
        let def = await calculateArmor(message.author.id);
        def = data.bonus_armor_set > 0 ? def - data.bonus_armor_set : def;
        let attack = data.basic_attack + data.level + data.attack + (data.attack * (data.weapon_enchant * 0.3));
        let maxHp = 5 * (data.level + data.basic_hp);
        let maxMp = 5 * (data.level + data.basic_mp);
        let hpBar = generateIcon(hp, maxHp, true);
        let mpBar = generateIcon(mp, maxMp, false);
        let helmet = data.helmet ? `\n${data.helmetEmoji} [+${data.helmetDef}] **${data.helmet}**` : '\n◽ [no helmet]';
        let chest = data.chest ? `\n${data.chestEmoji} [+${data.chestDef}] **${data.chest}**` : '\n◽ [no chest]';
        let pants = data.pants ? `\n${data.pantsEmoji} [+${data.pantsDef}] **${data.pants}**` : '\n◽ [no pants]';
        let currentZone = `${data.zone_id}.${data.sub_zone} [${data.zone}]`
        let bonusSetArmorText = data.bonus_armor_set > 0 ? `+ ${data.bonus_armor_set} [Set Bonus]` : '';
        let embedded = new Discord.MessageEmbed({
            type: "rich",
            title: null,
            description: null,
            url: null,
            color: 10115509,
            timestamp: null,
            fields: [
                // TODO MP
                // {
                //     value: `\n[ HP: ${hp} / ${maxHp} ] \n${hpBar} \n[ MP: ${mp} / ${maxMp} ] \n${mpBar} \n** Level **: ${level} (${pLevel} %) \n** XP **: ${cExp} / ${maxExp}\n** Zone **: ${currentZone}`,
                //     name: "__STATUS__",
                //     inline: false
                // },
                {
                    value: `\n[ HP: ${hp} / ${maxHp} ] \n${hpBar}\n** Level **: ${level} (${pLevel} %) \n** XP **: ${cExp} / ${maxExp}\n** Zone **: ${currentZone}`,
                    name: "__STATUS__",
                    inline: false
                },
                {
                    value: ` <:gold_coin:801440909006209025> ** Gold **: ${currencyFormat(data.gold)}\n<:diamond:801441006247084042> ** Diamond **: ${currencyFormat(data.diamond)}\n${data.Bank > 0 ? '<:piggy_bank:801444684194906142> ** Bank **:'+currencyFormat(data.bank) : ''}`,
                    name: "__MONEY__",
                    inline: true
                },
                {
                    value: `${data.MiningHelmet > 0 ? `<:Mining_Helmet:824176323194650624> **Mining Helmet**` : '◽ [empty]'}${data.BugNet ? `\n<:Bug_Net:824176322908913687> ** Bug Net **` : '\n◽ [empty]'}${data.Ring > 0 ? `\n<:Ring:824176323219292220> **Ring**` : ''}`,
                    name: "__UTILITY__",
                    inline: true
                },
                {
                    value: (data.weaponName ? `${data.wEmoji} [+${data.attack}] **${data.weaponName}**` : '◽ [no weapon]') + helmet + chest + pants,
                    name: "__EQUIPMENT__",
                    inline: false
                },
                {
                    value: ` <:so_sword:801443762130780170> ** AT **: ${currencyFormat(attack)}\n<:so_shield:801443854254342154> ** DEF **: ${currencyFormat(def)} ${bonusSetArmorText}`,
                    name: "__STATS__",
                    inline: true
                }],
            thumbnail: {
                url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
                proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`,
                height: 0,
                width: 0
            },
            image: null,
            video: null,
            author: null,
            // author: {
            //     name: `${username}'s profile`,
            //     url: null,
            //     iconURL: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
            //     proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`
            // },
            provider: null,
            footer: {
                text: `More commands on \`tera help\``,
                iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/DIxgPOIeSdmfHuboNFOPhyAJyjRQ9bUoQMePmqundGg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
            },
            timestamp: new Date(),
            files: []
        });
        message.channel.send(`> **Displaying [ ${tag} ] profile...**`, embedded)
    });
}

function generateIcon(current, max, isHp) {
    let point = Math.round((current / max) * 10);
    point = point < 1 && point > 0 ? 1 : point;
    let lost = 10 - point;
    let pointEmoji = ''
    let lostEmoji = ''
    for (let index = 0; index < point && index < 10; index++) {
        pointEmoji += isHp ? ':green_square:' : ':blue_square:';
    }
    for (let index = 0; index < lost && index < 10; index++) {
        lostEmoji += isHp ? ':red_square:' :':white_large_square:';
    }
    return pointEmoji + lostEmoji;
}

export default profile;