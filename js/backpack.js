
import db from '../db_config.js'
import Discord from 'discord.js';

async function backpack(message) {
    const avatar = message.author.avatar;
    const id = message.author.id;
    const username = message.author.username;
    const query = `SELECT * FROM backpack LEFT JOIN item ON (backpack.item_id = item.id) WHERE player_id="${id}"`
    let data;
    db.query(query, async function (err, result) {
        if (err) throw err;
        data = await result;
        let items = "";
        let consumables = "";
        let nextConsumables = "";
        let nextItems = "";
        if (data.length > 0) {
                for (const key of data) {
                    if (key.is_material == 1) {
                        if (key.quantity > 0) {
                            items += `${nextItems}${key.emoji} **${key.name}**: ${key.quantity}`;
                            nextItems = "\n"
                        }
                    } else if (key.is_consumable == 1) {
                        if (key.quantity > 0) {
                            consumables += `${nextConsumables}${key.emoji} **${key.name}**: ${key.quantity}`;
                            nextConsumables = "\n"
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
                    "name": "MATERIALS",
                    "inline": true
                }, {
                    "value": consumables ? consumables : 'Empty',
                    "name": "CONSUMABLES",
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
    });
}

export default backpack;