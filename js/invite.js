import Discord from "discord.js";

function invite(message) {
    message.channel.send(new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [{
            name: `Bip boop!!!`,
            value: `Do you want to invite me to your guild? [Bot link](https://discord.com/oauth2/authorize?client_id=804295231838355466&permissions=537192512&scope=bot) \nJoin the Support server and get more reward [Support link!](https://discord.gg/bTAV8HMuxf) `,
            inline: false,
        }]
    }))
}
export default invite