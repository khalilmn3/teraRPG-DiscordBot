import Discord from 'discord.js';
function market(message) {
    message.channel.send(new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [
        {
            name: `Market`,
            value: `<:piggy_bank:801444684194906142> \`Piggy Bank\` | \`get additional EXP based on deposit amount-  2 \`<:diamond:801441006247084042>
<:Bug_Net:824176322908913687> \`Bug Net\` | \`have 25% chance to catch bug when chopping---- 10 \`<:diamond:801441006247084042>
<:Mining_Helmet:824176323194650624> \`Mining Helmet\` | \`eliminate rock when mining-------------- 35 \`<:diamond:801441006247084042>
<:Forest_Pylon:826645637788598294>  \`Pylon\` | \`using for teleport to any discovered zone-------- 1 \`<:diamond:801441006247084042>`,
                    // <:Ring:824176323219292220> \`Ring\` | \`Marrie me!!!-----------------------------------\` 175 <:diamond:801441006247084042>`,
            inline: false,
        }],
        author: {
            name: `TERA MARKET`,
            url: null,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        thumbnail: {
            url: `https://cdn.discordapp.com/attachments/811586577612275732/824172741758287872/Traveling_Merchant.png?size=512`,
            proxyURL: `https://cdn.discordapp.com/attachments/811586577612275732/824172741758287872/Traveling_Merchant.png`,
            height: 0,
            width: 0
        },
        footer: {
            text: `use \`tera shop\` to buy item with gold`,
            iconURL: null,
            proxyIconURL: null
        },
    }));
}

export default market;