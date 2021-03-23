import db from '../db_config.js'
import Discord from 'discord.js'

async function tools(message) {
    const avatar = message.author.avatar;
    const id = message.author.id;
    const username = message.author.username;
    const query = `SELECT 
    item1.name as pickaxeName, IFNULL(item1.emoji,"") as pickaxeEmoji, item1.tier as pickaxeTier,
    tools.pickaxe_exp,tools.pickaxe_level,tools.axe_level, tools.axe_exp, pickaxeTier.exp as pickaxeTierExp, axeTier.exp as axeTierExp,
    item2.name as axeName, IFNULL(item2.emoji,"") as axeEmoji, item2.tier as axeTier,
    stat.depth, layers.name as depthName, 
    fishing.name as fishingName, fishing_pole.level as fishingLevel, fishing_pole.exp as fishingExp, fishing.tier as fishingTier, fishing.emoji as fishingEmoji
        FROM tools
            LEFT JOIN stat ON (tools.player_id = stat.player_id)
            LEFT JOIN layers ON (stat.depth >= layers.depth)
            LEFT JOIN fishing_pole ON (tools.player_id = fishing_pole.player_id)
            LEFT JOIN item as fishing ON (fishing_pole.item_id = fishing.id)
            LEFT JOIN item as item1 ON (tools.item_id_pickaxe = item1.id)
            LEFT JOIN item as item2 ON (tools.item_id_axe = item2.id)
            LEFT JOIN tool_tier as pickaxeTier ON (item1.tier = pickaxeTier.id)
            LEFT JOIN tool_tier as axeTier ON (item2.tier = axeTier.id)
        WHERE tools.player_id="${id}"`
    let data;
    // Get Data
    db.query(query, async function (err, result) {
        if (err) throw err;
        data = await result[0];
        let tools = "";
        let craftingStations = "";
        let pickaxeExpNextLevel = parseInt(data.pickaxe_level) * 300;
        let axeExpNextLevel = parseInt(data.axe_level) * 250;
        // let fishingPoolNextLevel = parseInt(data.fishingLevel) * 250;
        // console.log(data)

        message.channel.send(new Discord.MessageEmbed({
                "type": "rich",
                "title": null,
                "description": null,
                "url": null,
                "color": 10115509,
                "timestamp": null,
                "fields":
                [
                    {
                        "value": `**Tier** : ${data.pickaxeTier} \n**Depth** : ${data.depth}m [${data.depthName}] \n**Level** : ${data.pickaxe_level}\n**EXP** : ${data.pickaxe_exp} / ${pickaxeExpNextLevel}\n${generateIcon(data.pickaxe_exp, pickaxeExpNextLevel)}`,
                        "name": `${data.pickaxeEmoji} **${data.pickaxeName}**`,
                        "inline": false
                    },
                    {
                        "value":`**Tier** : ${data.axeTier}\n**Level** : ${data.axe_level}\n**EXP** : ${data.axe_exp} / ${axeExpNextLevel} \n${generateIcon(data.axe_exp, axeExpNextLevel)}`,
                        "name": `${data.axeEmoji} **${data.axeName}**`,
                        "inline": false
                    },
                    {
                        "value":`**Tier** : ${data.fishingTier}\n**Level** : ${data.fishingLevel}\n**EXP** : ${200}/${200} \n${generateIcon(200,200)}`,
                        "name": `${data.fishingEmoji} **${data.fishingName}**`,
                        "inline": false
                    },
                ],
                "thumbnail": null,
                "image": null,
                "video": null,
                "author": {
                    "name": `${username}'s Tools`,
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
function generateIcon(current, max) {
    let point = Math.round((current / max) * 10);
    point = point < 1 && point > 0 ? 1 : point;
    let lost = 10 - point;
    let pointEmoji = ''
    let lostEmoji = ''
    for (let index = 0; index < point; index++) {
        pointEmoji +=':green_square:';
    }
    for (let index = 0; index < lost; index++) {
        lostEmoji += ':red_square:';
    }
    return pointEmoji + lostEmoji;
}

export default tools;