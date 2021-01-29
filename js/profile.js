
import db from '../db_config.js'
import Discord from 'discord.js';

async function profile(message, client, id, username, avatar, rank, title) {
    const query = "SELECT * FROM level, stat LEFT JOIN armor ON (stat.armor_id = armor.id) LEFT JOIN weapon ON (stat.weapon_id = weapon.id) WHERE level.id > stat.level AND stat.player_id = '"+id+"' LIMIT 1";
    let data;
    db.query(query, async function (err, result) {
        if (err) throw err;
        data = await result[0];
        let maxExp = data.experience.toLocaleString('en-US', {maximumFractionDigits:2});;
        let level = data.level.toLocaleString('en-US');;
        let pLevel = ((data.current_experience / data.experience) * 100).toFixed(2);
        let cExp = data.current_experience.toLocaleString('en-US', {maximumFractionDigits:2});
        let hp = data.hp.toLocaleString('en-US', {maximumFractionDigits:2});
        let mp = data.mp.toLocaleString('en-US', {maximumFractionDigits:2});
        let def = data.basic_def * data.level + data.def + (data.def * data.armor_enchant * 0.3);
        let attack = data.basic_attack * data.level + data.attack + (data.attack * data.weapon_enchant * 0.3);
        let maxHp = 5 * (data.level + data.basic_hp);
        let maxMp = 5 * (data.level + data.basic_mp);

        message.reply(new Discord.MessageEmbed({
            type: "rich",
            title: title,
            description: null,
            url: null,
            color: 10115509,
            timestamp: null,
            fields: [
                {
                    value: ` ** Level **: ${level} (${pLevel} %) \n** XP **: ${cExp} / ${maxExp}\n** Area **: Jungle \n** Time travels **: 1`,
                    name: "PROGRESS",
                    inline: false
                },
                {
                    value: ` <:so_sword:801443762130780170> ** AT **: ${attack}\n<:so_shield:801443854254342154> ** DEF **: ${def}\n<:so_heart:801442362962083840> ** HP **: ${hp} / ${maxHp} \n<:mana:801442446814740480> ** MP **: ${mp} / ${maxMp}`,
                    name: "STATS",
                    inline: true
                },
                {
                    value: ` <:basic_sword:800980367015542814> [+${data.weapon_enchant}] \n<:basic_armor:800981013668823050> [+${data.armor_enchant}] \n:unicorn: [Epic]`,
                    name: "EQUIPMENT",
                    inline: true
                },
                {
                    value: ` <:gold_coin:801440909006209025> ** Gold **: ${data.gold}\n<:diamond:801441006247084042> ** Diamond **: ${data.diamond}\n<:piggy_bank:801444684194906142> ** Bank **: ${data.bank}`,
                    name: "MONEY",
                    inline: false
                }],
            thumbnail: {
                url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
                proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`,
                height: 0,
                width: 0
            },
            image: null,
            video: null,
            author: {
                name: `${username}'s profile`,
                url: null,
                iconURL: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${id}/${avatar}.png`
            },
            provider: null,
            footer: {
                text: `RANK: ${rank}`,
                iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`,
                proxyIconURL: `https://images-ext-1.discordapp.net/external/DIxgPOIeSdmfHuboNFOPhyAJyjRQ9bUoQMePmqundGg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
            },
            files: []
        }))
    });
}

export default profile;