import { cooldownMessage } from "./embeddedMessage.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import setCooldowns from "./helper/setCooldowns.js";
import Discord from 'discord.js'
import queryData from "./helper/query.js";
import currencyFormat from "./helper/currency.js";

async function rewards(message,command, stat) {
    if (command == 'vote') {
        let cooldowns = await isCommandsReady(message.author.id, 'vote');
        if (cooldowns.isReady) {
            setCooldowns(message.author.id, 'vote');
        } else {
            message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Vote', cooldowns.waitingTime));
        }
    
    // TODO hourly reward
    // } else if (command === 'hourly') {
    //     let cooldowns = await isCommandsReady(message.author.id, 'hourly');
    //     // if (cooldowns.isReady) {
    //         setCooldowns(message.author.id, 'hourly');
    //         let mp = 5 * stat.level;
    //         message.channel.send(new Discord.MessageEmbed({
    //             type: "rich",
    //             description: null,
    //             url: null,
    //             color: 10115509,
    //             fields: [{
    //                 name: 'Claimed hourly reward',
    //                 value: `\`+${mp} MP\``,
    //                 inline: false,
    //             }],
    //             author: {
    //                 name: `${message.author.username}`,
    //                 url: null,
    //                 iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
    //                 proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
    //             },
    //         }));
        // } else {
        //     message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Hourly', cooldowns.waitingTime));
        // }
    } else if (command === 'daily') {
        let cooldowns = await isCommandsReady(message.author.id, 'daily');
        if (cooldowns.isReady) {
            setCooldowns(message.author.id, 'daily');
            let streak = await queryData(`SELECT daily_streak FROM cooldowns WHERE player_id="${message.author.id}" LIMIT 1`);
            streak = streak.length > 0 ? streak[0].daily_streak : 1;
            let isStreak = cooldowns.timeCooldowns <= 172800;
            let dailyStreak = isStreak ? streak + 1 : 1;
            let multiply = 150;
            let gold = 2000 + (dailyStreak > 100 ? 100 * multiply : dailyStreak * multiply);
            // add diamond if user check in for 7 days in a row
            if ((dailyStreak % 7) === 0) {
                queryData(`UPDATE stat SET diamond=diamond + 1, gold=gold + ${gold} WHERE player_id="${message.author.id}" LIMIT 1`);
            } else {
                queryData(`UPDATE stat SET gold=gold + ${gold} WHERE player_id="${message.author.id}" LIMIT 1`);
            }
            await queryData(`UPDATE cooldowns SET daily_streak="${dailyStreak}" WHERE player_id="${message.author.id}" LIMIT 1`)
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 10115509,
                fields: [{
                    name: 'Claimed daily reward',
                    value: `<:gold_coin:801440909006209025> \`+${currencyFormat(gold)} gold\` ${dailyStreak >= 100 ? '[max]' : ''}` + ((dailyStreak % 7) === 0 ? '\n<:diamond:801441006247084042> \`+1 diamond\` [ :tada:bonus ]' : ''),
                    inline: false,
                }],
                author: {
                    name: `${message.author.username}`,
                    url: null,
                    iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                    proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                },
                footer: {
                    text: `Daily streak: #${dailyStreak} \nClaim daily reward for 7 days in a row to get bonus reward.`,
                    iconURL: null,
                    proxyIconURL: null
                },
                files: []
            }));
        } else {
            message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Daily', cooldowns.waitingTime));
        }
    } else if (command === 'weekly') {
        let cooldowns = await isCommandsReady(message.author.id, 'weekly');
        if (cooldowns.isReady) {
        setCooldowns(message.author.id, 'weekly');
        let multiply = 100 * stat.zone_id;
        let gold = 2500 + multiply;
        let exp = (50 * Math.pow(stat.level,3) - 150 * Math.pow(stat.level, 2) + 400 * (stat.level)) / 3 / 2
        let totalExp = parseInt(exp) + parseInt(stat.current_experience);
        let levelEXP = await queryData(`SELECT experience, id FROM level WHERE id=${stat.level + 1} LIMIT 1`)
        let levelUPmessage = '';
        if (levelEXP.length > 0 && totalExp >= levelEXP[0].experience) {
            // LEVEL UP
            let data = await queryData(`SELECT id, experience FROM level WHERE experience<=${totalExp} ORDER BY id DESC LIMIT 1`)
            let nLevel = levelEXP[0].id;
            let cExp = totalExp - levelEXP[0].experience;
            let maxHp = 5 * (nLevel + stat.basic_hp);
            let maxMp = 5 * (nLevel + stat.basic_mp);
            queryData(`UPDATE stat SET level="${nLevel}", current_experience=${cExp}, gold=gold + ${gold},  hp="${maxHp}", mp="${maxMp}" WHERE player_id="${message.author.id}" LIMIT 1`);
            levelUPmessage = `> :tada: | **${message.author.username}** Level up +${nLevel - stat.level}, HP restored`
        } else {
            queryData(`UPDATE stat SET current_experience=${totalExp}, gold=gold + ${gold} WHERE player_id="${message.author.id}" LIMIT 1`);
        }
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [{
                name: 'Claimed weekly reward',
                value: `<:gold_coin:801440909006209025> \`+${currencyFormat(gold)} gold\` \n<:exp:808837682561548288> \`+${currencyFormat(exp)} experience\``,
                inline: false,
            }],
            author: {
                name: `${message.author.username}`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            timestamp: new Date(),
            files: []
        }));
        message.channel.send(levelUPmessage);
        } else {
            message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'Weekly', cooldowns.waitingTime));
        }
    }
}

export default rewards;