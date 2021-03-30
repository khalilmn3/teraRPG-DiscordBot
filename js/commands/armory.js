
import Discord from 'discord.js';
import queryData from '../helper/query.js';

async function armory(message) {
    let armory = await queryData(`SELECT 
        IFNULL(itemArmor1.emoji, '') as helmetEmoji, CONCAT(IFNULL(helmet_modifier.name,"")," ",itemArmor1.name) as helmet, armor1.id as helmetId,
        IFNULL(itemArmor2.emoji, '') as shirtEmoji, CONCAT(IFNULL(shirt_modifier.name,"")," ",itemArmor2.name) as shirt, armor2.id as shirtId,
        IFNULL(itemArmor3.emoji, '') as pantsEmoji, CONCAT(IFNULL(pants_modifier.name,"")," ",itemArmor3.name) as pants, armor3.id as pantsId,
        IFNULL(itemWeapon.emoji, '') as wEmoji, CONCAT(IFNULL(modifier_weapon.name,"")," ",itemWeapon.name) as weaponName, weapon.id as weaponId,
        IFNULL(modifier_weapon.stat_change,0) as weapon_modifier,
        IFNULL(helmet_modifier.stat_change,0) as helmet_modifier,
        IFNULL(shirt_modifier.stat_change,0) as shirt_modifier,
        IFNULL(pants_modifier.stat_change,0) as pants_modifier
        FROM stat 
        LEFT JOIN armory ON (stat.player_id = armory.player_id)
        LEFT JOIN armor as armor1 ON (armory.helmet_id = armor1.id)
        LEFT JOIN armor as armor2 ON (armory.shirt_id = armor2.id)
        LEFT JOIN armor as armor3 ON (armory.pants_id = armor3.id)
        LEFT JOIN weapon ON (armory.weapon_id = weapon.id)
        LEFT JOIN item as itemArmor1 ON (armor1.item_id = itemArmor1.id)
        LEFT JOIN item as itemArmor2 ON (armor2.item_id = itemArmor2.id)
        LEFT JOIN item as itemArmor3 ON (armor3.item_id = itemArmor3.id)
        LEFT JOIN item as itemWeapon ON (weapon.item_id = itemWeapon.id)
        LEFT JOIN modifier_weapon ON (armory.weapon_modifier_id=modifier_weapon.id)
        LEFT JOIN modifier_armor as helmet_modifier ON (armory.helmet_modifier_id=helmet_modifier.id)
        LEFT JOIN modifier_armor as shirt_modifier ON (armory.shirt_modifier_id=shirt_modifier.id)
        LEFT JOIN modifier_armor as pants_modifier ON (armory.pants_modifier_id=pants_modifier.id)
        WHERE stat.player_id = '${message.author.id}'
        ORDER BY armory.id ASC
        LIMIT 5`);
    let weapon = '';
    let helmet = '';
    let shirt = '';
    let pants = '';
    for (let i = 0; i < 5; i++) {
        if (armory[i]) {
            //weapon
            if (armory[i].weaponName) {
                weapon += `\`${i}\` ${armory[i].wEmoji} \`${armory[i].weaponName}\`\n`
            } else {
                weapon += `◽ \`empty slot\`\n`
            }
            // Helmet
            if (armory[i].helmet) {
                helmet += `\`${i}\` ${armory[i].helmetEmoji} \`${armory[i].helmet}\`\n`
            } else {
                helmet += `◽ \`empty slot\`\n`
            }
            // Shirt
            if (armory[i].shirt) {
                shirt += `\`${i}\` ${armory[i].shirtEmoji} \`${armory[i].shirt}\`\n`
            } else {
                shirt += `◽ \`empty slot\`\n`
            }
            // Pants
            if (armory[i].pants) {
                pants += `\`${i}\` ${armory[i].pantsEmoji} \`${armory[i].pants}\`\n`
            } else {
                pants += `◽ \`empty slot\`\n`
            }
        } else {
            weapon += `◽ \`empty slot\`\n`;
            helmet += `◽ \`empty slot\`\n`;
            shirt += `◽ \`empty slot\`\n`;
            pants += `◽ \`empty slot\`\n`;
        }
    }
    message.channel.send(new Discord.MessageEmbed({
        "type": "rich",
        "title": null,
        "description": null,
        "url": null,
        "color": 10115509,
        "timestamp": null,
        "fields": [
            {
                "value": weapon,
                "name": "__ID | Weapon__",
                "inline": true
            },
            {
                "value": helmet,
                "name": "__ID | Helmet__",
                "inline": true
            },
            {
                "value": '\u200B',
                "name": '\u200B'
            },
            {
                "value": shirt,
                "name": "__ID | Shirt__",
                "inline": true
            },
            {
                "value": pants,
                "name": "__ID | Pants__",
                "inline": true
            },
        ],
        thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/811586577612275732/826315909403639828/armory.png',
            proxyURL: 'https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https://cdn.discordapp.com/attachments/811586577612275732/826315909403639828/armory.png',
            height: 0,
            width: 0,
        },
        "image": null,
        "video": null,
        "author": {
            "name": `${message.author.username}'s armory`,
            "url": null,
            "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        }
    }))
}

export default armory;