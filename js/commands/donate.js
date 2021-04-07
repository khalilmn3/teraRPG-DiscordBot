import Discord from "discord.js";

function donate(message) {
    let embed = new Discord.MessageEmbed({
                    type: "rich",
                    description: null,
                    url: null,
                    color: 10115509,
                    fields: [{
                        name: 'Donate',
                        value: `Support us with become our patron and get in game benefits\nhttps://www.patreon.com/TeraRPG`,
                        inline: false,
                    }],
                    // author: {
                    //     name: `${message.author.username}`,
                    //     url: null,
                    //     iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                    //     proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    // },
    });
    message.channel.send(embed);
}

export default donate;