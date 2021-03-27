
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
    const query = `SELECT stat.*, level.*, IFNULL(weapon.attack,0) as attack, zone.name as zone,
        IFNULL(itemArmor1.emoji, '') as helmetEmoji, CONCAT(IFNULL(helmet_modifier.name,"")," ",itemArmor1.name) as helmet, IFNULL(armor1.def,0) as helmetDef,
        IFNULL(itemArmor2.emoji, '') as shirtEmoji, CONCAT(IFNULL(shirt_modifier.name,"")," ",itemArmor2.name) as shirt, IFNULL(armor2.def,0) as shirtDef,
        IFNULL(itemArmor3.emoji, '') as pantsEmoji, CONCAT(IFNULL(pants_modifier.name,"")," ",itemArmor3.name) as pants, IFNULL(armor3.def,0) as pantsDef,
        IFNULL(itemWeapon.emoji, '') as wEmoji, CONCAT(IFNULL(modifier_weapon.name,"")," ",itemWeapon.name) as weaponName,
        IF(armor1.armor_set_id=armor2.armor_set_id AND armor2.armor_set_id=armor3.armor_set_id, armor_set.bonus_set, 0) as bonus_armor_set,
        utility.piggy_bank as Bank, utility.bug_net as BugNet, utility.mining_helmet as MiningHelmet, utility.ring as Ring,
        IFNULL(modifier_weapon.stat_change,0) as weapon_modifier,
        IFNULL(helmet_modifier.stat_change,0) as helmet_modifier,
        IFNULL(shirt_modifier.stat_change,0) as shirt_modifier,
        IFNULL(pants_modifier.stat_change,0) as pants_modifier
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
        LEFT JOIN modifier_weapon ON (equipment.weapon_modifier_id=modifier_weapon.id)
        LEFT JOIN modifier_armor as helmet_modifier ON (equipment.helmet_modifier_id=helmet_modifier.id)
        LEFT JOIN modifier_armor as shirt_modifier ON (equipment.shirt_modifier_id=shirt_modifier.id)
        LEFT JOIN modifier_armor as pants_modifier ON (equipment.pants_modifier_id=pants_modifier.id)
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
        // console.log(data);
        let maxExp = data.experience.toLocaleString('en-US', { maximumFractionDigits: 2 });;
        let level = data.level.toLocaleString('en-US');;
        let pLevel = ((data.current_experience / data.experience) * 100).toFixed(2);
        let cExp = data.current_experience.toLocaleString('en-US', { maximumFractionDigits: 2 });
        let hp = data.hp.toLocaleString('en-US', { maximumFractionDigits: 2 });
        let mp = data.mp.toLocaleString('en-US', { maximumFractionDigits: 2 });
        let totalModifierArmor = parseInt(data.helmet_modifier) + parseInt(data.shirt_modifier) + parseInt(data.pants_modifier);
        let def = parseInt(data.helmetDef) + parseInt(data.shirtDef) + parseInt(data.pantsDef) + parseInt(data.level) + parseInt(data.basic_def) + parseInt(totalModifierArmor);
        // let def = await calculateArmor(id);
        let weaponModifier = data.attack * data.weapon_modifier;
        let attack = data.basic_attack + data.level + data.attack + weaponModifier;
        let maxHp = 5 * (data.level + data.basic_hp);
        let maxMp = 5 * (data.level + data.basic_mp);
        let hpBar = generateIcon(hp, maxHp, true);
        let mpBar = generateIcon(mp, maxMp, false);
        let helmet = data.helmet ? `\n${data.helmetEmoji} [+${data.helmetDef + data.helmet_modifier}] **${data.helmet}**` : '\n◽ [no helmet]';
        let shirt = data.shirt ? `\n${data.shirtEmoji} [+${data.shirtDef + data.shirt_modifier}] **${data.shirt}**` : '\n◽ [no shirt]';
        let pants = data.pants ? `\n${data.pantsEmoji} [+${data.pantsDef + data.pants_modifier}] **${data.pants}**` : '\n◽ [no pants]';
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
                    value: ` <:gold_coin:801440909006209025> ** Gold **: ${currencyFormat(data.gold)}\n<:diamond:801441006247084042> ** Diamond **: ${currencyFormat(data.diamond)}\n${data.Bank > 0 ? '<:piggy_bank:801444684194906142> ** Bank **: '+currencyFormat(data.bank) : ''}`,
                    name: "__MONEY__",
                    inline: false
                },
                {
                    value: (data.weaponName ? `${data.wEmoji} [+${Math.round(data.attack + weaponModifier)}] **${data.weaponName}**` : '◽ [no weapon]') + helmet + shirt + pants,
                    name: "__EQUIPMENT__",
                    inline: false
                },
                {
                    value: ` <:so_sword:801443762130780170> ** Attack **: ${currencyFormat(Math.round(attack))}\n<:so_shield:801443854254342154> ** Defence **: ${currencyFormat(def)} ${bonusSetArmorText}\n<:Platinum_Pickaxe:803907956675575828> ** Mining depth **: ${data.depth}`,
                    name: "__STATS__",
                    inline: true
                },
                {
                    value: `${data.MiningHelmet > 0 ? `<:Mining_Helmet:824176323194650624> **Mining Helmet**` : '◽ [empty]'}${data.BugNet ? `\n<:Bug_Net:824176322908913687> ** Bug Net **` : '\n◽ [empty]'}${data.Ring > 0 ? `\n<:Ring:824176323219292220> **Ring**` : ''}`,
                    name: "__UTILITY__",
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