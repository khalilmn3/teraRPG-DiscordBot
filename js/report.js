import Discord from 'discord.js';
import queryData from './helper/query.js';
import errorCode from './utils/errorCode.js';
async function report(message, client, args, body) {
    if (!args[0]) { return message.channel.send('Usage \`tera report [report]\`.') }
    queryData(`INSERT report SET player_id=${message.author.id}, report="${body}"`);
    let id = await queryData(`SELECT * FROM report WHERE player_id=${message.author.id} ORDER BY id DESC LIMIT 1`);
    id = id.length > 0 ? id[0].id : 0;
    client.channels.cache.get('818360338063163402').send(new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [{
            name: `Submitter`,
            value: `${message.author.tag}`,
            inline: false,
        },
        {
            name: `Report`,
            value: `${body}`,
            inline: false,
        }],
        thumbnail: {
            url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
            height: 0,
            width: 0
        },
        footer: {
            text: `USER ID: ${message.author.id} | #${id}`,
            iconURL: null,
            proxyIconURL: null
        },
        timestamp: new Date()
    })).catch((err) => {
        console.log('(report)' + message.author.id + ': ' + errorCode[err.code]);
    });
    message.reply('Your report has been submitted!')
}

export default report;