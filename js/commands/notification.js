import Discord from 'discord.js';
import queryData from '../helper/query.js';
async function notification(message) {
    let notifUrl = await queryData(`SELECT value FROM configuration WHERE id=7 LIMIT 1`);

    let embed = new Discord.MessageEmbed({
        type: "rich",
        url: null,
        color: 10115870,
        author: {
            name: `${message.author.username}'s notification`,
            url: null,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        image: {
          url: notifUrl[0].value
        },
    });

    message.channel.send(embed);
}

export default notification;