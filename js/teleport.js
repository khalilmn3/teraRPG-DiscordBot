import Discord from "discord.js";
import queryData from "./helper/query.js";
import emojiCharacter from "./utils/emojiCharacter.js";

// Command to teleport to specific Zone
async function teleport(message, stat, args) {
    if (!isNaN(args[0])) {
        if (args.length > 0) {
            console.log(args);
            let zone = '';
            let subZone = '1';
            if (args[0] % 1 != 0) {
                let parseZone = args[0].toString().split('.');
                zone = parseZone[0];
                subZone = parseZone[1];
            } else {
                zone = Math.floor(args[0]);
                subZone = args[1];
            }
            if(isNaN(subZone) || subZone <= 0 || subZone > 2) { return message.channel.send(`${emojiCharacter.noEntry} | **${message.author.username}**, Invalid sub zone`)}
            if (!zone) { return message.channel.send(`**${message.author.username}**, please specify which **zone** you want to teleport \n Format \`teleport <zone> <sub_zone>\` \n eg. \`teleport 2 2\` | available zone: 1 - 7 `) }
            if (zone > 7 || subZone >2) { return  message.reply(`\\🚫 | invalid zone!`)}
            let maxZone = stat.max_zone;
            let currentZone = `${stat.zone_id}${stat.sub_zone}`;
            let toZone = parseInt(`${zone}${subZone}`);
            let pylon = await queryData(`SELECT pylon FROM utility WHERE player_id="${message.author.id}" AND pylon=TRUE LIMIT 1`);
            maxZone = maxZone.toString().split('|');
            maxZone = maxZone[0] + maxZone[1];
            console.log(maxZone);
            console.log(toZone);
            if (pylon) {
                if (currentZone != toZone) {
                    if (maxZone >= toZone || message.author.id === '668740503075815424') {
                        await queryData(`UPDATE stat SET zone_id=${zone}, sub_zone=${subZone} WHERE player_id="${message.author.id}"`)
                        message.channel.send(`**${message.author.username}** using <:Forest_Pylon:826645637788598294> pylon and teleported to Zone ${zone}-${subZone}.`)
                    } else {
                        message.channel.send(`${emojiCharacter.noEntry} | **${message.author.username}**, you haven't unlocked this zone yet, \nplease check your discorvered zones with \nthe command \`tera zone\``)
                    }
                } else {
                    message.channel.send(`${emojiCharacter.noEntry} | **${message.author.username}**, you are already in this zone!`)
                }
            } else {
                message.channel.send(`${emojiCharacter.noEntry} | **${message.author.username}**, you can't teleporting without <:Forest_Pylon:826645637788598294> **pylon**\n<:Forest_Pylon:826645637788598294> **pylon** is available on market.`)
            }
        } else {
            message.reply(`please specify which **zone** you want to teleport \n Format \`teleport <zone> <sub_zone>\` \n eg. \`teleport 2 2\` | available zone: 1 - 7 `)
        }
    } else {
        let zone = await queryData(`SELECT * FROM zone ORDER BY id`);
        let val = '';
        let maxZone = stat.max_zone.split('|');
        let count = 0;
        zone.forEach(element => {
            if (element.id < 8) {
                count++
                if (maxZone[0] >= element.id) {
                    val += `\`${count}.\`\\✅ | ${element.emoji}\`${element.name} Biome\` ${stat.zone_id == element.id ? `<a:run2:837252808726020136>(you're here)` : ''}\n`;
                } else {
                    val += `~~\`${count}.\`~~\\⛔ | ${element.emoji}~~\`${element.name} Biome\`~~\n`;
                }
            }
        });
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [
            {
                name: `Discovered Zones`,
                value: val,
                        // <:Ring:824176323219292220> \`Ring\` | \`Marrie me!!!-----------------------------------\` 175 <:diamond:801441006247084042>`,
                inline: false,
                },
                {
                    name: `Info`,
                    value: `use \`tera zone <zone> <sub zone\` to move to specific zone\ne.g. \`tera zone 1 2\``,
                            // <:Ring:824176323219292220> \`Ring\` | \`Marrie me!!!-----------------------------------\` 175 <:diamond:801441006247084042>`,
                    inline: false,
                }],
            author: {
                name: `${message.author.username}'s Zones`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            // thumbnail: {
            //     url: `https://cdn.discordapp.com/attachments/811586577612275732/824172741758287872/Traveling_Merchant.png?size=512`,
            //     proxyURL: `https://cdn.discordapp.com/attachments/811586577612275732/824172741758287872/Traveling_Merchant.png`,
            //     height: 0,
            //     width: 0
            // },
            // footer: {
            //     text: `use \`tera zone <zone> <sub zone\`\ne.g. tera zone 1 2`,
            //     iconURL: null,
            //     proxyIconURL: null
            // },
        })).catch((err) => {
            console.log('(teleport)' + message.author.id + ': ' + errorCode[err.code]);
        });
    }
}

export default teleport;