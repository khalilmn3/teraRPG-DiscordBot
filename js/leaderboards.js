import Discord from 'discord.js';
import myCache from './cache/leaderboardChace.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import errorCode from './utils/errorCode.js';
async function ranks(message, args1) {
    let orderBy = '';
    let topTitle = '';
    let titleStart = '';
    let titleEnd = '';
    let ranks;
    let data;

    if (args1 === 'gold' || args1 === 'level' || args1 === 'depth') {
        if (args1 === 'gold') {
            orderBy = 'gold';
            topTitle = 'GOLD';
            titleStart = '<:gold_coin:801440909006209025>';
            titleEnd = 'gold';
        
            
            data = myCache.get('rank_gold');
            if (data == undefined) {
                ranks = await queryData(`SELECT username, SUM(gold+bank) as gold FROM message.author LEFT JOIN stat ON (message.author.id=stat.player_id) GROUP BY player_id ORDER BY ${orderBy} DESC LIMIT 10`);
                myCache.set('rank_gold', ranks, 3600);
                data = myCache.get('rank_gold');
            }
        } else if (args1 === 'level') {
            topTitle = 'LEVEL';
            orderBy = 'level';
            titleStart = 'Level';
            titleEnd = '';
            
            
            data = myCache.get('rank_level');
            if (data == undefined) {
                ranks = await queryData(`SELECT username, level FROM message.author LEFT JOIN stat ON (message.author.id=stat.player_id) ORDER BY ${orderBy} DESC LIMIT 10`);
                myCache.set('rank_level', ranks, 3600);
                data = myCache.get('rank_level');
            }
        } else if (args1 === 'depth') {
            topTitle = 'DEPTH';
            orderBy = 'depth';
            titleStart = '<:Platinum_Pickaxe:803907956675575828>';
            titleEnd = 'ft';
            
            
            data = myCache.get('rank_depth');
            if (data == undefined) {
                ranks = await queryData(`SELECT username, depth FROM message.author LEFT JOIN stat ON (message.author.id=stat.player_id) ORDER BY ${orderBy} DESC LIMIT 10`);
                myCache.set('rank_depth', ranks, 3600);
                data = myCache.get('rank_depth');
            }
        }


        if (data !== undefined) {
            let value = '';
            let count = 0;
            data.forEach(element => {
                count++;
                value += `${count}. ${element.username} ➜ ${titleStart} ${currencyFormat(element[orderBy])} ${titleEnd}\n`
            });

            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                description: '__🏆 **TERA LEADERBOARD** 🏆__',
                url: null,
                color: 10115509,
                fields: [{
                    name: `TOP 10 [${topTitle}]`,
                    value: value,
                    inline: false,
                },
                {
                    name: `Other ranks`,
                    value: `level, gold, depth\ne.g. \`ranks level\`, \`ranks gold\``,
                    inline: false,
                }],
                // thumbnail: {
                //     url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                //     proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                //     height: 0,
                //     width: 0
                // },
                footer: {
                    text: `The leaderboards are updates every hour`,
                    iconURL: null,
                    proxyIconURL: null
                },
                timestamp: new Date()
            })).catch((err) => {
                console.log('(leaderboard)' + message.author.id + ': ' + errorCode[err.code]);
            });
        }
    } else {
        message.channel.send('Available ranks: \`level\`, \`depth\`, \`gold\`')
    }
}

export default ranks;