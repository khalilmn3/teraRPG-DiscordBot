import Discord from 'discord.js';
import queryData from './helper/query.js';
async function bonus(message) {
    let bonus = await queryData(`SELECT * FROM configuration WHERE type="2"`);
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
    if (serverGold > 0 || globalGold > 0) {
        gold = `${serverGold > 0 ? '\`Server\`: \`+' + serverGold + '%\`' : ''}
                ${globalGold > 0 ? '\`Global\`: \`+' + globalGold + '%\`' : ''}`
    }
    if (serverExp > 0 || globalExp > 0) {
        exp = `${serverExp > 0 ? '\`Server\`: \`+' + serverExp+'%\`' : ''}
                ${globalExp > 0 ? '\`Global\`: \`+' + globalExp+'%\`' : ''}`
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
            "name": `${message.author.username}'s booster`,
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
    }));
}

export default bonus;