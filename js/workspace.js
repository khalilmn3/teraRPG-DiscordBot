import db from '../db_config.js'
import Discord from 'discord.js'

async function workspace(message) {
    const avatar = message.author.avatar;
    const id = message.author.id;
    const username = message.author.username;
    const query = `SELECT 
    item1.name as pickaxeName, IFNULL(item1.emoji,"") as pickaxeEmoji, item1.tier as pickaxeTier,
    item2.name as axeName, IFNULL(item2.emoji,"") as axeEmoji, item2.tier as axeTier,
    item3.name as workBenchName, IFNULL(item3.emoji,"") as workBenchEmoji, item3.tier as workBenchTier,
    item4.name as furnaceName, IFNULL(item4.emoji,"") as furnaceEmoji, item4.tier as furnaceTier,
    item5.name as anvilName, IFNULL(item5.emoji,"") as anvilEmoji, item5.tier as anvilTier,
    item6.name as tinkererName, IFNULL(item6.emoji,"") as tinkererEmoji, item6.tier as tinkererTier
        FROM tools
            LEFT JOIN item as item1 ON (tools.item_id_pickaxe = item1.id)
            LEFT JOIN item as item2 ON (tools.item_id_axe = item2.id)
            LEFT JOIN item as item3 ON (tools.item_id_work_bench = item3.id)
            LEFT JOIN item as item4 ON (tools.item_id_furnace = item4.id)
            LEFT JOIN item as item5 ON (tools.item_id_anvil = item5.id)
            LEFT JOIN item as item6 ON (tools.item_id_tinkerer_workshop = item6.id)
        WHERE player_id="${id}"`
    let data;
    // Get Data
    db.query(query, async function (err, result) {
        if (err) throw err;
        data = await result;
        let tools = "";
        let craftingStations = "";
        // console.log(data)
        if (data.length > 0) {
            for (const key of data) {
                tools = `${key.pickaxeEmoji} **${key.pickaxeName}** [Tier: ${key.pickaxeTier}]\n${key.axeEmoji} **${key.axeName}** [Tier: ${key.axeTier}]`;
                craftingStations = key.workBenchName ? `${key.workBenchEmoji} **${key.workBenchName}** [Tier: ${key.workBenchTier}]` : '[ No Work Bench ]';
                craftingStations += key.furnaceName ? `\n${key.furnaceEmoji} **${key.furnaceName}** [Tier: ${key.furnaceTier}]` : '\n[ No Furnace ]';
                craftingStations += key.anvilName ? `\n${key.anvilEmoji} **${key.anvilName}** [Tier: ${key.anvilTier}]` : '\n[ No Anvil ]';
                craftingStations += key.tinkererName ? `\n${key.tinkererEmoji} **${key.tinkererName}** [Tier: ${key.tinkererTier}]` : '\n[ No Tinkerer\'s Workshop ]';
            }
        } else {
            tools = "Empty";
        }

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
                        "value": tools ? tools : 'Empty',
                        "name": "Tools Tier",
                        "inline": true
                    },  
                    {
                        "value": craftingStations,
                        "name": "Crafting Stations",
                        "inline": true
                    }
                ],
                "thumbnail": null,
                "image": null,
                "video": null,
                "author": {
                    "name": `${username}'s Workspace`,
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

export default workspace;