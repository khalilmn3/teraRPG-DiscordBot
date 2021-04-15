// import { Message } from "discord.js";
import queryData from "./helper/query.js";
import Discord from 'discord.js';

async function cooldowns(message, command, args1) {
    let mentions = message.mentions.users.first();
    let user = mentions ? mentions : message.author;
    let id = user.id;
    let username = user.username;
    if (message.author.id === '668740503075815424') {
        if (parseInt(args1) > 0) {
            id = args1;
            username = args1;
        }
    }
    let cooldowns = await queryData(`SELECT * FROM cooldowns WHERE player_id="${id}" LIMIT 1`);
    let currentTime = Math.round(new Date().getTime() / 1000);
    cooldowns = cooldowns.length > 0 ? cooldowns[0] : 0;
    let explore = (currentTime - cooldowns.explore) > 60 ? 0 : 60 - (currentTime - cooldowns.explore);
    let expedition = (currentTime - cooldowns.expedition) > 1800 ? 0 : 1800 - (currentTime - cooldowns.expedition);
    let work = (currentTime - cooldowns.work) > 300 ? 0 : 300 - (currentTime - cooldowns.work);
    // TODO hourly reward
        // let hourly = (currentTime - cooldowns.hourly) > 3600 ? 0 : 3600 - (currentTime - cooldowns.hourly);
        let junken = (currentTime - cooldowns.junken) > 3600 ? 0 : 3600 - (currentTime - cooldowns.junken);
        let fish = (currentTime - cooldowns.fish) > 5400 ? 0 : 5400 - (currentTime - cooldowns.fish);
        let dungeon = (currentTime - cooldowns.dungeon) > 43200 ? 0 : 43200 - (currentTime - cooldowns.dungeon);
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
                    name: `-----------**GRINDING**-----------\nExplore [ exp ]`,
                    inline: false
                },
                {
                    value: expedition > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(expedition)}` : `:white_check_mark: | READY`,
                    name: `Mine Expedition [ me ]`,
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
                {
                    value: junken > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(junken)}` : `:white_check_mark: | READY`,
                    name: `Junken | Duel`,
                    inline: false
                },
                {
                    value: dungeon > 0 ? `:hourglass_flowing_sand: | ${secondsToDHms(dungeon)}` : `:white_check_mark: | READY`,
                    name: `Dungeon | Servant`,
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
                    name: `-----------**REWARDS**-----------\nDaily`,
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
                name: `${username}'s cooldowns`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${user.avatar}.png`
            },
            footer: {
                text: `Short version \`tera rd\``,
                iconURL: null,
                proxyIconURL: null
            },
            files: []
        }));
    } else {
        let grindings = (explore === 0 ? `**Explore** \n:white_check_mark: | READY \n` : '') + 
                (expedition === 0 ? `**Mine Expedition** \n:white_check_mark: | READY \n` : '') +
                (work === 0 ? `**Work [ mine | chop ]** \n:white_check_mark: | READY \n` : '') +
                (fish === 0 ? `**Fish** \n:white_check_mark: | READY \n` : '') +
                (junken === 0 ? `**Junken | Duel** \n:white_check_mark: | READY \n` : '') +
                (dungeon === 0 ? `**Dungeon | Servant** \n:white_check_mark: | READY \n` : '')
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
                name: `-----------**GRINDING**-----------`,
                inline: false
            },);  
        } 
        if (rewards !== '') {
            fields.push({
                value: rewards,
                name: `-----------**REWARDS**-----------`,
                inline: false
            });
        }
        if (rewards === '' && grindings === '') {
            fields.push({
                value: 'All commands in cooldown',
                name: `-----------**COMMANDS**-----------`,
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
                name: `${username}'s ready`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${user.avatar}.png`
            },
            footer: {
                text: `Long version \`tera cd\``,
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