import Discord from "discord.js";

function reply(client, message, args, body) {
    let replyText = body.replace(args[0], '');
    replyText = replyText.replace(args[1], '');
    console.log(replyText);
    let channelId = '';
    if (args[0] == 'suggest') {
        channelId = '818360315493613580';
    } else if(args[0] == 'report') {
        channelId = '818360338063163402';
    }
    if (!isNaN(args[1])) {

        console.log(args[0])
        client.channels.cache.get(channelId).messages.fetch(args[1])
            .then((msg) => {
                let embed = new Discord.MessageEmbed(msg.embeds[0]);
                embed.addField('➥ _Reply_', `_${replyText}_`);
                msg.edit(embed);
            })
            .catch(() => {
                message.channel.send('Cannot find the message!')
            });
    } else {
        message.channel.send('Please provide the message id to reply!')
    }
}
export default reply;