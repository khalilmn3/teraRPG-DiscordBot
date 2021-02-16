// import { Message } from "discord.js";
import queryData from "./helper/query.js";
import Discord from 'discord.js';

async function cooldowns(message, playerId, command) {
        let cooldowns = await queryData(`SELECT * FROM cooldowns WHERE player_id="${playerId}" LIMIT 1`);
        let currentTime = Math.round(new Date().getTime() / 1000);
        cooldowns = cooldowns.length > 0 ? cooldowns[0] : 0;
        let explore = (currentTime - cooldowns.explore) > 60 ? 0 : 60 - (currentTime - cooldowns.explore);
    let work = (currentTime - cooldowns.work) > 300 ? 0 : 300 - (currentTime - cooldowns.work);
    // TODO hourly reward
        // let hourly = (currentTime - cooldowns.hourly) > 3600 ? 0 : 3600 - (currentTime - cooldowns.hourly);
        let fish = (currentTime - cooldowns.fish) > 5400 ? 0 : 5400 - (currentTime - cooldowns.fish);
        let daily = (currentTime - cooldowns.daily) > 86400 ? 0 : 86400 - (currentTime - cooldowns.daily);
        let weekly = (currentTime - cooldowns.weekly) > 604800 ? 0 : 604800 - (currentTime - cooldowns.weekly);
    let vote = (currentTime - cooldowns.vote) > 43200 ? 0 : 43200 - (currentTime - cooldowns.vote);
    
    if (command === 'cd' || command === 'cooldowns') {
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [
                {
                    value: explore > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(explore)}` : `:white_check_mark: | READY`,
                    name: `-------------------**GRINDING**-------------------\nExplore`,
                    inline: false
                },
                {
                    value: work > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(work)}` : `:white_check_mark: | READY`,
                    name: `Work [ mine | chop ]`,
                    inline: false
                },
                {
                    value: fish > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(fish)}` : `:white_check_mark: | READY`,
                    name: `Fish`,
                    inline: false
                },
                // TODO hourly
                // {
                //     value: hourly > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(hourly)}` : `:white_check_mark: | READY`,
                //     name: `-------------------**REWARDS**-------------------\nHourly`,
                //     inline: false
                // },
                {
                    value: daily > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(daily)}` : `:white_check_mark: | READY`,
                    name: `-------------------**REWARDS**-------------------\nDaily`,
                    inline: false
                },
                {
                    value: weekly > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(weekly)}` : `:white_check_mark: | READY`,
                    name: `Weekly`,
                    inline: false
                },
                {
                    value: vote > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(vote)}` : `:white_check_mark: | READY`,
                    name: `Vote`,
                    inline: false
                },],
            author: {
                name: `${message.author.username}'s cooldowns`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            footer: {
                text: `You can also check commands ready with \`tera rd\``,
                iconURL: null,
                proxyIconURL: null
            },
            files: []
        }));
    } else {
        let grindings = (explore === 0 ? `**Explore** \n:white_check_mark: | READY \n` : '') + 
                (work === 0 ? `**Work** \n:white_check_mark: | READY \n` : '') +
                (fish === 0 ? `**Fish** \n:white_check_mark: | READY \n` : '')
        let rewards =
                // TODO hourly
                // (hourly === 0 ? `**Hourly** \n:white_check_mark: | READY \n` : '') +
                (daily === 0 ? `**Daily** \n:white_check_mark: | READY \n` : '') +
                (weekly === 0 ? `**Weekly** \n:white_check_mark: | READY \n` : '') +
            (vote === 0 ? `**Vote** \n:white_check_mark: | READY` : '');
        let fields = [];
        if (grindings !== '') {
            fields.push({
                value: grindings,
                name: `-----------------------**GRINDING**-----------------------`,
                inline: false
            },);  
        } 
        if (rewards !== '') {
            fields.push({
                value: rewards,
                name: `-----------------------**REWARDS**-----------------------`,
                inline: false
            });
        }
        if (rewards === '' && grindings === '') {
            fields.push({
                value: 'All commands in cooldown',
                name: `-----------------------**COMMANDS**-----------------------`,
                inline: false
            });
        }
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: fields,
            author: {
                name: `${message.author.username}'s ready`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            footer: {
                text: `You can also check all commands cooldown with \`tera cd\``,
                iconURL: null,
                proxyIconURL: null
            },
            files: []
        }));
    }
}

function secondsToDHms(second) {
    second = Number(second);
    let d = Math.floor(second / 86400);
    let h = Math.floor(second % 86400 / 3600);
    let m = Math.floor(second % 3600 / 60);
    let s = Math.floor(second % 3600 % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") + (h > 0  || m > 0 || s > 0 ? ", " : "") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay +  hDisplay + mDisplay + sDisplay; 
}

export default cooldowns;