import Discord from 'discord.js';

function help(message, client) {
    message.channel.send(new Discord.MessageEmbed({
        type: "rich",
            title: null,
            description: null,
            url: null,
            color: 10115509,
            fields: [
                {
                    value:`\`profile\`,\`tools\`,\`workspace\`,\`backpack\`,\`cooldown\`,\n\`ready\`,\`armory\`,\`zone\`,\`booster\`, \`info\``,
                    name: ":information_source:  __STATUS__",
                    inline: false
                },
                {
                    value: `\`explore\`,\`fish\`,\`heal\`,\`dungeon <@player>\`,\`servant\`,\n\`mine expedition [me]\`, \`junken <@player>\`,\`duel @player\``,
                    name: ":crossed_swords: __GRINDING__",
                    inline: false
                },
                {
                    value: `\`chop\`,\` mine\``,
                    name: ":pick: __WORKING__",
                    inline: false
                },
                {
                    value: `\`craft <item_name>\`,\`craft list\`,\`smelt\`,\`upgrade <pickaxe>\`,\n\`upgrade list\`,\`reforge info <1/2>\``,
                    name: ":tools: __CRAFTING__",
                    inline: false
                },
                {
                    value: `\`market\`, \`marketplace\`, \`shop\`,\`deposit\`,\`withdraw\`,\`bank\`,\n\`buy <item_name>\`,\`sell <item_name>\`,\`open <crate> <amount>\`,\`trade\``,
                    name: ":moneybag: __ECONOMY__",
                    inline: false
                },
                {
                    value: `\`cf <h/t> <amount>\`, \`blackjack <amount>\`,\`lottery\``,
                    name: ":moneybag: __MINI GAMES__",
                    inline: false
                },
                {
                    value: `\`vote\`,\`daily\`,\`weekly\``,
                    name: ":gift: __CLAIM REWARDS__",
                    inline: false
                },
                {
                    value: `\`ping\`,\`invite\`,\`report\`,\`suggest\`,\`donate\`, \`notification\`, \`prefix\``,
                    name: ":gear: __UTILITY__",
                    inline: false
                }],
            thumbnail: {
                url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`,
                proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`,
                height: 0,
                width: 0
            },
            author: {
                name: `Tera RPG available commands list`
            },
            provider: null,
            footer: {
                iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/DIxgPOIeSdmfHuboNFOPhyAJyjRQ9bUoQMePmqundGg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
            },
            // timestamp: new Date(),
    })).catch((err) => {
        console.log('(help)'+message.author.id+': '+errorCode[err.code]);
    });
}

export default help;