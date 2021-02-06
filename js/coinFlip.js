import currencyFormat from "./helper/currency.js";
import queryData from "./helper/query.js";
import Discord from 'discord.js';

async function coinFlip(message, args) {
    if (args.length > 0) {
        let bet = args[1];
        if (bet > 0 && (args[0].toLowerCase() === 'head' || args[0].toLowerCase() === 'tail')) {
            let currentGold = await queryData(`SELECT gold FROM stat WHERE player_id="${message.author.id}" LIMIT 1`);
            if (!currentGold.length > 0) return;
            if (currentGold[0].gold >= bet) {
                let chance = Math.random();
                let side = args[0].toLowerCase();
                if (side === 'heads' || side === 'head') {
                    if (chance <= 0.5) {
                        queryData(`UPDATE stat SET gold=gold + ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        // message.channel.send(`**Heads**! You got ${bet} gold.`);
                        message.channel.send(new Discord.MessageEmbed({
                            "type": "rich",
                            "title": null,
                            "description": null,
                            "url": null,
                            "color": 10115509,
                            "fields":
                                [
                                    {
                                        "value": `You got ${bet} gold! \n :tada::tada::tada::tada::tada:`,
                                        "name": `:coin: **Heads** :coin:`,
                                        "inline": false
                                    
                                    },
                                ],
                            "thumbnail": null,
                            "image": null,
                            "video": null,
                            "author": {
                                "name": `${message.author.username}'s Coin Flips`,
                                "url": null,
                                "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                                "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                            },
                            "provider": null,
                            "files": []
                
                        }))
                    } else {
                        queryData(`UPDATE stat SET gold=gold - ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        message.channel.send(`**Tails**! You lost ${bet} gold.`);
                    }
                } else if (side === 'tails' || side === 'tail') {
                    if (chance <= 0.5) {
                        queryData(`UPDATE stat SET gold=gold + ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        message.channel.send(`**Tails**! You got ${bet} gold.`)
                    } else {
                        queryData(`UPDATE stat SET gold=gold - ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        message.channel.send(`**Heads**! You lost ${bet} gold.`);
                    }                    
                }
            } else {
                message.reply(`Nice try! your maximum bet is **${currencyFormat(currentGold[0].gold)}** gold!`)
            }
        }
    }
}

export default coinFlip;