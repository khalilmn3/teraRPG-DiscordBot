
import Discord from 'discord.js';
import queryData from '../helper/query.js';
import emojiCharacter from '../utils/emojiCharacter.js';

async function armory(message) {
    let armory = await queryData(`SELECT
        armory2.id, item.emoji,IF(item.type_id=9,IFNULL(weapon.attack,0), IFNULL(armor.def,0)) as atdef, IFNULL(modifier.stat_change,0) as statChange,
        IF(item.type_id=9, IFNULL(weapon.level_required,0), IFNULL(armor.level_required,0)) as level,
        ROUND(IF(item.type_id=9,IFNULL(weapon.attack,0), IFNULL(armor.def,0))  +  IF(item.type_id=9,(IFNULL(weapon.attack,0) * IFNULL(modifier.stat_change,0)), IFNULL(modifier.stat_change,0))) as stat,
        TRIM(CONCAT(IFNULL(modifier.name,"")," ",item.name)) as name, item_types.id as type_id
        FROM armory2
        LEFT JOIN item ON (armory2.item_id=item.id)
        LEFT JOIN item_types ON (item.type_id=item_types.id)
        LEFT JOIN weapon ON (armory2.item_id=weapon.item_id)
        LEFT JOIN armor ON (armory2.item_id=armor.item_id)
        LEFT JOIN modifier ON (armory2.modifier_id=modifier.id)
        WHERE player_id=${message.author.id}
        AND armory2.item_id>0
        `)
    let weapon = '';
    let helmet = '';
    let shirt = '';
    let pants = '';
    let weaponCount = 0
    armory.forEach(element => { 
        // weapon
        if (element.type_id == 9) {
            weaponCount++;
            weapon += `\`${element.id}\` ${element.emoji} \`[+${element.stat}] ${element.name} L${element.level}\`\n`
        }
    })
    let helmetCount = 0
    armory.forEach(element => { 
        // Helmet
        if (element.type_id == 21) {
            helmetCount++;
            helmet += `\`${element.id}\` ${element.emoji} \`[+${element.stat}] ${element.name} L${element.level}\`\n`
        }
    })
    let shirtCount = 0
    armory.forEach(element => { 
        // shirt
        if (element.type_id == 22) {
            shirtCount++;
            shirt += `\`${element.id}\` ${element.emoji} \`[+${element.stat}] ${element.name} L${element.level}\`\n`
        }
    })
    let pantsCount = 0
    armory.forEach(element => {
        // pants
        if (element.type_id == 23) {
            pantsCount++;
            pants += `\`${element.id}\` ${element.emoji} \`[+${element.stat}] ${element.name} L${element.level}\`\n`
        }
    });

    // // Generate empty slot
    // for (let i = 0; i < 5; i++){
    //     weapon += `◽ \`empty slot\`\n`;
    // }
    // for (let i = 0; i < (helmetCount - 5); i++){
    //     helmet += `◽ \`empty slot\`\n`;
    // }
    // for (let i = 0; i < (shirtCount - 5); i++){
    //     shirt += `◽ \`empty slot\`\n`;
    // }
    // for (let i = 0; i < (pantsCount - 5); i++){
    //     pants += `◽ \`empty slot\`\n`;
    // }
    setTimeout(() => {
        message.channel.send(new Discord.MessageEmbed({
            "type": "rich",
            "title": null,
            "description": null,
            "url": null,
            "color": 10115509,
            "timestamp": null,
            "fields": [
                {
                    "value": weapon ? weapon : `◽ \`empty slot\``,
                    "name": `__ID__ ${emojiCharacter.blank} __[att] Weapon__ [max 5]`,
                    "inline": false
                },
                {
                    "value": helmet ? helmet : `◽ \`empty slot\``,
                    "name": `__ID__ ${emojiCharacter.blank} __[def] Helmet__ [max 5]`,
                    "inline": false
                },
                // {
                //     "value": '\u200B',
                //     "name": '\u200B'
                // },
                {
                    "value": shirt ? shirt : `◽ \`empty slot\``,
                    "name": `__ID__ ${emojiCharacter.blank} __[def] Shirt__ [max 5]`,
                    "inline": false
                },
                {
                    "value": pants ? pants : `◽ \`empty slot\``,
                    "name": `__ID__ ${emojiCharacter.blank} __[def] Pants__ [max 5]`,
                    "inline": false
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
            },
            footer: {
                text: 'Use \'tera info armory\' for more detail'
            }
        }))
        
    }, 500);
}

export default armory;