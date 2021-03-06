import currencyFormat from "./helper/currency.js";
import queryData from "./helper/query.js";
import Discord from 'discord.js';
import errorCode from "./utils/errorCode.js";
import randomNumber from "./helper/randomNumberWithMinMax.js";

async function coinFlip(message, args) {
    if (args.length > 0) {
        let bet = args[1];
        if (bet > 500000) {
            message.reply(`You can't bet more than 500.000 gold`);
            return;
        }
        if (bet > 0 && (args[0].toLowerCase() === 'head' || args[0].toLowerCase() === 'tail' || args[0].toLowerCase() === 'h' || args[0].toLowerCase() === 't')) {
            let currentGold = await queryData(`SELECT gold FROM stat WHERE player_id="${message.author.id}" LIMIT 1`);
            if (!currentGold.length > 0) return;
            if (currentGold[0].gold >= bet) {
                let chance = randomNumber(1, 2);
                let side = args[0].toLowerCase();
                if (side === 'heads' || side === 'head' || side === 'h') {
                    if (chance == 1) {
                        queryData(`UPDATE stat SET gold=gold + ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        // message.channel.send(`**Heads**! You got ${bet} gold.`);
                        messageEmbed(message, bet, side, 'Heads', 1)
                    } else {
                        queryData(`UPDATE stat SET gold=gold - ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        messageEmbed(message, bet, side, 'Tails', 0)
                    }
                } else if (side === 'tails' || side === 'tail' || side === 't') {
                    if (chance == 1) {
                        queryData(`UPDATE stat SET gold=gold + ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        messageEmbed(message, bet, side, 'Tails', 1)
                    } else {
                        queryData(`UPDATE stat SET gold=gold - ${bet} WHERE player_id="${message.author.id}" LIMIT 1`)
                        messageEmbed(message, bet, side, 'Heads', 0)
                    }                    
                }
            } else {
                message.reply(`Nice try! your maximum bet is **${currencyFormat(currentGold[0].gold)}** gold!`)
            }
        }
    }
}

function messageEmbed(message, bet, playerSide, gotSide, isWin) {
    message.channel.send(new Discord.MessageEmbed({
        "type": "rich",
        "title": null,
        "description": null,
        "url": null,
        "color": 10115509,
        "fields":
            [
                {
                    "value": isWin === 1 ? `You got ${bet} gold! \n :tada::tada::tada::tada::tada:` : `You lost ${bet} gold! \n :thumbsdown::thumbsdown::thumbsdown::thumbsdown::thumbsdown:`,
                    "name": `:coin: **${gotSide}** :coin:`,
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

    })).catch((err) => {
        console.log('(CF)'+message.author.id+': '+errorCode[err.code]);
    });
}

export default coinFlip;