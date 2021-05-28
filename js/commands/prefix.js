import myCache from "../cache/leaderboardChace.js";
import queryData from "../helper/query.js";
import en from "../lang/en.js";
import emojiCharacter from "../utils/emojiCharacter.js";

function prefix(message, args) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        let prefix = args[0]
        let isStringByte4 = /[\u{10000}-\u{10FFFF}]/u.test(prefix);

        if(isStringByte4){ return message.channel.send(`${emojiCharacter.noEntry} | Invalid character`);}
        if(!args[0]){
            return message.channel.send(`${emojiCharacter.noEntry} | Correct usage \`tera prefix [new prefix]\``);
        }
        if (args[0].length > 4) {
           return message.channel.send(`${emojiCharacter.noEntry} | ${en.prefix.allowedLength}`)
        }
        queryData(`INSERT prefix SET prefix="${args[0]}", guild_id=${message.guild.id} ON DUPLICATE KEY UPDATE prefix="${args[0]}"`)
        myCache.set(`prefix${message.guild.id}`, args[0]);
        message.channel.send(`${en.prefix.setup} \`${prefix}\``);
    } else {
        message.channel.send(`${emojiCharacter.noEntry} | ${en.prefix.dontHavePermission}`)
    }
}
export default prefix;