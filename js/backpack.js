
import Discord from 'discord.js';
import queryData from './helper/query.js';

async function backpack(message, args1) {
    let items = "";
    let consumables = "";
    let nextConsumables = "";
    let nextItems = "";
    let bait = '';
    let nextBait = '';
    let avatar = message.author.avatar;
    let id = message.author.id;
    let username = message.author.username;
    
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
            username = args1;
        }
    }
    let data = await queryData(`SELECT item.name, item.type_id, IFNULL(item.emoji,"") as emoji, item.tier, item.item_group_id, backpack.quantity FROM backpack LEFT JOIN item ON (backpack.item_id = item.id) WHERE player_id="${id}"`);
    // Sort item by TIER
    data.sort((a, b) => {
  
        if (a.type_id < b.type_id) {
            return -1;
        } else if (a.type_id > b.type_id) {
            return 1;
        }
        
        if (a.tier < b.tier) {
            return -1;
        } else if (a.tier > b.tier) {
            return 1;
        }
  
        return 0;
    });
    if (data.length > 0) {
        for (const key of data) {
            if (key.item_group_id === 1) {
                if (key.quantity > 0) {
                    items += `${nextItems}${key.emoji} **${key.name}**: ${key.quantity}`;
                    nextItems = "\n"
                }
            } else if (key.item_group_id === 2 || key.item_group_id === 6) {
                if (key.quantity > 0) {
                    consumables += `${nextConsumables}${key.emoji} **${key.name}**: ${key.quantity}`;
                    nextConsumables = "\n"
                }
            } else if (key.type_id === 17) {
                if (key.quantity > 0) {
                    bait += `${nextBait}${key.emoji} **${key.name}**: ${key.quantity}`;
                    nextBait = "\n"
                }
            }
        }
    } else {
        items = "Empty";
        consumables = "Empty";
    }

    message.channel.send(new Discord.MessageEmbed({
        "type": "rich",
        "title": null,
        "description": null,
        "url": null,
        "color": 10115509,
        "timestamp": null,
        "fields": [{
            "value": items ? items : 'Empty',
            "name": "__MATERIALS__",
            "inline": true
        }, {
            "value": consumables ? consumables : 'Empty',
            "name": "__CONSUMABLES__",
            "inline": true
        }, {
            "value": bait ? bait : 'Empty',
            "name": "__BAIT__",
            "inline": true
        }],
        "thumbnail": null,
        "image": null,
        "video": null,
        "author": {
            "name": `${username}'s backpack`,
            "url": null,
            "iconURL": `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`
        },
        "provider": null,
        "footer": null,
        "files": []
    }))
}

export default backpack;