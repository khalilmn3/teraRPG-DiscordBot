import Discord from 'discord.js';
import queryData from './helper/query.js';
import { limitedTimeUse } from './helper/variable.js';
import errorCode from './utils/errorCode.js';
import { getTimeNow,secondsToDHms } from "./utils/utils.js";
async function bonus(message) {
    let bonus = await queryData(`SELECT * FROM configuration WHERE type="2"`);
    
    let timeNow = getTimeNow();
    let booster = await queryData(`SELECT * FROM booster WHERE player_id=${message.author.id} AND time>${timeNow}`);
    let privateGold = '';
    if (booster.length > 0) {
        booster.forEach(element => {
            if (element.booster_type == 1) {
                privateGold = `${limitedTimeUse.luckyCoinEmoji}Lucky coin: __\`+${element.percent}%\`__ | \`(${(secondsToDHms(booster[0].time - timeNow))})\``
            }
        })
    }

    let serverExp = 0;
    let globalExp = 0;
    let serverGold = 0;
    let globalGold = 0;
    bonus.forEach(element => {
        if (element.id == 2) {
            globalExp = element.value;
        } else if (element.id == 3) {
            serverExp = element.value;
        } else if (element.id == 4) {
            globalGold = element.value;
        } else if (element.id == 5) {
            serverGold = element.value;
        }   
    });
    let gold = '[no active booster]';
    let exp = '[no active booster]';
    if (serverGold > 0 || globalGold > 0 || privateGold) {
        gold = `${serverGold > 0 ? '<:server:834619390384799834>Server: __\`+' + serverGold + '%\`__' : ''}
${globalGold > 0 ? '🌏Global: __\`+' + globalGold + '%\`__' : ''}
${privateGold ? privateGold : ''}`
    }
    if (serverExp > 0 || globalExp > 0) {
        exp = `${serverExp > 0 ? '<:server:834619390384799834>Server: __\`+' + serverExp+'%\`__' : ''}
${globalExp > 0 ? '🌏Global: __\`+' + globalExp+'%\`__' : ''}`
    }
    message.channel.send(new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [{
            name: `__exp__`,
            value: exp,
            inline: true,
        },{
            name: `__gold__`,
            value: gold,
            inline: true,
        },
        {
            name: `Info`,
            value: `You can obtain server booster when playing on [Tera-RPG Official Server](https://discord.gg/ezcM7MKQu4)`,
            inline: false,
        }],
        author: {
            "name": `${message.author.username}'s boosters`,
            "url": null,
            "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        // footer: {
        //     text: `USER ID: ${message.author.id} | #${id}`,
        //     iconURL: null,
        //     proxyIconURL: null
        // },
        // timestamp: new Date()
    })).catch((err) => {
        console.log('(Booster)'+message.author.id+': '+errorCode[err.code]);
    });
}

export default bonus;