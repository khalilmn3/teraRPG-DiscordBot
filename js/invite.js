import Discord from "discord.js";

function invite(message) {
    message.channel.send(new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [{
            name: `Bip boop!!!`,
            value: `Do you want to invite me to your guild? \n[Click me!](http://bit.ly/teraRPG)`,
            inline: false,
        }]
    }))
}
export default invite