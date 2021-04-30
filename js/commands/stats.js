import queryData from "../helper/query.js";
import Discord from 'discord.js'
import currencyFormat from "../helper/currency.js";
import errorCode from "../utils/errorCode.js";

async function stats(message, stat) {
    let statistic = await queryData(`SELECT stat2.*, IFNULL(votes.vote_count,0) as vote FROM stat2 LEFT JOIN votes ON (stat2.player_id = votes.player_id) WHERE stat2.player_id=${message.author.id} LIMIT 1`);
    statistic = statistic ? statistic[0] : undefined;
    if (!statistic) { return message.channel.send('No data record found') }
    let totalExp = (50 * (stat.level - 1) ** 3 - 150 * (stat.level - 1) ** 2 + 400 * (stat.level - 1)) / 3;
    totalExp = totalExp + stat.current_experience;
    let embed = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [
            {
                name: `\\🐲Monster Kills`,
                value: `➥ ${currencyFormat(statistic.monster_kills)}`,
                inline: true,
            },
            {
                name: `\\🕵️Player Kills`,
                value: `➥ ${currencyFormat(statistic.player_kills)}`,
                inline: true,
            },
            {
                name: `\\🏟️Boss Kills`,
                value: `➥ ${currencyFormat(statistic.boss_kills)}`,
                inline: true,
            },
            {
                name: `\\📜Quest Completed`,
                value: `➥ ${currencyFormat(statistic.quest_completed)}`,
                inline: true,
            },
            {
                name: `\\💰Market Trades`,
                value: `➥ ${currencyFormat(statistic.market_trade)}`,
                inline: true,
            },
            {
                name: `\\📦Crate Opened`,
                value: `➥ ${currencyFormat(statistic.crate_opened)}`,
                inline: true,
            },
            {
                name: `\\🗓️Daily Strikes`,
                value: `➥ ${currencyFormat(statistic.daily_strikes)}`,
                inline: true,
            },
            {
                name: `\\🔺Total Vote`,
                value: `➥ ${currencyFormat(statistic.vote)}`,
                inline: true,
            },
            {
                name: `<:exp:808837682561548288> Total Exp`,
                value: `➥ ${currencyFormat(totalExp)}`,
                inline: true,
            },
        ],
        thumbnail: {
            url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
            height: 70,
            width: 40
        },
        author: {
            name: `${message.author.username}'s stats`,
            url: null,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=512`,
            proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`
        },
        timestamp: new Date()
    });

    message.channel.send(embed)
    .catch((err) => {
        console.log('(stats)' + message.author.id + ': ' + errorCode[err.code]);
    });
}

export default stats;