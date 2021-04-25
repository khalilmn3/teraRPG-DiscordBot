import queryData from "../helper/query.js";
import Discord from 'discord.js'

async function stats(message) {
    let statistic = await queryData(`SELECT stat2.*, IFNULL(votes.vote_count,0) as vote FROM stat2 LEFT JOIN votes ON (stat2.player_id = votes.player_id) WHERE stat2.player_id=${message.author.id} LIMIT 1`);
    statistic = statistic ? statistic[0] : undefined;
    if (!statistic) { return message.channel.send('No data record found') }
    
    let embed = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [
            {
                name: `\\📜Monster Kills`,
                value: `<:blank:835528030683922472> ${statistic.monster_kills}`,
                inline: true,
            },
            {
                name: `\\📜Player Kills`,
                value: `<:blank:835528030683922472> ${statistic.player_kills}`,
                inline: true,
            },
            {
                name: `\\📜Boss Kills`,
                value: `<:blank:835528030683922472> ${statistic.boss_kills}`,
                inline: true,
            },
            {
                name: `\\📜Quest Completed`,
                value: `<:blank:835528030683922472> ${statistic.quest_completed}`,
                inline: true,
            },
            {
                name: `\\📜Market Trades`,
                value: `<:blank:835528030683922472> ${statistic.market_trade}`,
                inline: true,
            },
            {
                name: `\\📜Crate Opened`,
                value: `<:blank:835528030683922472> ${statistic.crate_opened}`,
                inline: true,
            },
            {
                name: `\\📜Daily Strikes`,
                value: `<:blank:835528030683922472> ${statistic.daily_strikes}`,
                inline: true,
            },
            {
                name: `\\📜Total Vote`,
                value: `<:blank:835528030683922472> ${statistic.vote}`,
                inline: true,
            },
        ],
        author: {
            name: `${message.author.username}'s stats`,
            url: null,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=512`,
            proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`
        },
        timestamp: new Date()
    });

    message.channel.send(embed)
}

export default stats;