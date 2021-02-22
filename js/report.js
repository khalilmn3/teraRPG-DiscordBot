import Discord from 'discord.js';
function report(message, client, body) {
    let id = 0;
    client.channels.cache.get('813247405503938601').send(new Discord.MessageEmbed({
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
    }));
    message.reply('Your report has been submitted!')
}

export default report;