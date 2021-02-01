
import db from '../db_config.js'
import Discord from 'discord.js';

async function profile(message, client, id, username, avatar, rank, title) {
    const query = `SELECT stat.*, level.*, IFNULL(itemWeapon.emoji, '') as wEmoji, itemWeapon.name as weapon, weapon.attack, zone.name as zone,
        IFNULL(itemArmor1.emoji, '') as helmetEmoji, itemArmor1.name as helmet, armor1.def as helmetDef,
        IFNULL(itemArmor2.emoji, '') as chestEmoji, itemArmor2.name as chest, armor2.def as chestDef,
        IFNULL(itemArmor3.emoji, '') as pantsEmoji, itemArmor3.name as pants, armor3.def as pantsDef
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
        WHERE level.id > stat.level AND stat.player_id = '${id}' LIMIT 1`;
    let data;
    db.query(query, async function (err, result) {
        if (err) throw err;
        data = await result[0];
        console.log(data);
        let maxExp = data.experience.toLocaleString('en-US', {maximumFractionDigits:2});;
        let level = data.level.toLocaleString('en-US');;
        let pLevel = ((data.current_experience / data.experience) * 100).toFixed(2);
        let cExp = data.current_experience.toLocaleString('en-US', {maximumFractionDigits:2});
        let hp = data.hp.toLocaleString('en-US', {maximumFractionDigits:2});
        let mp = data.mp.toLocaleString('en-US', {maximumFractionDigits:2});
        let def = data.basic_def + data.level + data.helmetDef + data.chestDef + data.pantsDef;
        let attack = data.basic_attack + data.level + data.attack + (data.attack * (data.weapon_enchant * 0.3));
        let maxHp = 5 * (data.level + data.basic_hp);
        let maxMp = 5 * (data.level + data.basic_mp);
        let hpBar = generateIcon(hp, maxHp, true);
        let mpBar = generateIcon(mp, maxMp, false);
        let helmet = data.helmet ? `\n${data.helmetEmoji} [+${data.helmetDef}] **${data.helmet}**` : '\n:white_medium_small_square: [no helmet]';
        let chest = data.chest ? `\n${data.chestEmoji} [+${data.chestDef}] **${data.chest}**` : '\n:white_medium_small_square: [no chest]';
        let pants = data.pants ? `\n${data.pantsEmoji} [+${data.pantsDef}] **${data.pants}**` : '\n:white_medium_small_square: [no pants]';
        let currentZone = `${data.zone_id}.${data.sub_zone} [${data.zone}]` 
        let embedded = new Discord.MessageEmbed({
            type: "rich",
            title: null,
            description: null,
            url: null,
            color: 10115509,
            timestamp: null,
            fields: [
                {
                    value: `\n[ HP: ${hp} / ${maxHp} ] \n${hpBar} \n[ MP: ${mp} / ${maxMp} ] \n${mpBar} \n** Level **: ${level} (${pLevel} %) \n** XP **: ${cExp} / ${maxExp}\n** Zone **: ${currentZone}`,
                    name: "__STATUS__",
                    inline: false
                },
                {
                    value: ` <:gold_coin:801440909006209025> ** Gold **: ${data.gold}\n<:diamond:801441006247084042> ** Diamond **: ${data.diamond}\n<:piggy_bank:801444684194906142> ** Bank **: ${data.bank}`,
                    name: "__MONEY__",
                    inline: false
                },
                {
                    value: (data.weapon ? `${data.wEmoji} [+${data.attack}] **${data.weapon}**` : ':white_medium_small_square: [no weapon]') + helmet + chest + pants,
                    name: "__EQUIPMENT__",
                    inline: true
                },
                {
                    value: ` <:so_sword:801443762130780170> ** AT **: ${attack}\n<:so_shield:801443854254342154> ** DEF **: ${def}`,
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
        message.channel.send(`> **Displaying [ ${message.author.tag} ] profile...**`, embedded)
    });
}

function generateIcon(current, max, isHp) {
    let point = Math.round((current / max) * 10);
    point = point < 1 && point > 0 ? 1 : point;
    let lost = 10 - point;
    let pointEmoji = ''
    let lostEmoji = ''
    for (let index = 0; index < point; index++) {
        pointEmoji += isHp ? ':red_square:' : ':blue_square:';
    }
    for (let index = 0; index < lost; index++) {
        lostEmoji += ':white_large_square:';
    }
    return pointEmoji + lostEmoji;
}

export default profile;