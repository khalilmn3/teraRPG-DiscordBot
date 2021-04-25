import Discord from "discord.js";
import queryData from "../helper/query.js";
import { limitedTimeUse } from "../helper/variable.js";
import emojiCharacter from "../utils/emojiCharacter.js";

async function code(message, args) {
    let code = args[0];
    let rewards = '';
    if (code === 'lucky') {
        let cekCodeX = await cekCode(message.author.id, code)
        if (!cekCodeX) {
            rewards = `\`x1\` ${limitedTimeUse.luckyCoinEmoji} \`lucky coin\` \n\n**Usage**\n\`use lucky coin\`\n\`info lucky coin\``
            message.channel.send(embed(message, rewards, code));
            queryData(`INSERT code SET player_id=${message.author.id}, code="${code}"`)

            // ADD ITEM TO BACKPACK
            queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${limitedTimeUse.luckyCoinId}, 1)`);
        } else {
            message.channel.send(`${emojiCharacter.noEntry} | You have already claimed this code!!!`);
        }
    } else {
        message.channel.send(`Invalid code!`);
    }
}

async function cekCode(playerID, code) {
    let cek = await queryData(`SELECT * FROM code WHERE player_id=${playerID} AND code="${code}" LIMIT 1`);
    cek = cek.length > 0 ? cek[0] : undefined;

    return cek;
}

function embed(message, rewards, code) {
    let embed = new Discord.MessageEmbed({
        type: "rich",
        // description: `\`${code}\``,
        url: null,
        color: 10115879,
        fields: [{
            name: '🎁 Claimed rewards!',
            value: rewards,
            inline: false,
        }],
        author: {
            name: `${message.author.username}'s Code ${code}`,
            url: null,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        files: [],
        footer: {
            text: `Find more rewards on \`tera daily/weekly/vote\``,
            iconURL: null,
            proxyIconURL: null
        },
    });

    return embed;
}

export default code;