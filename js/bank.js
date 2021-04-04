import Discord from 'discord.js';
import calculateBonusExpBank from './helper/calculateBonusExpBank.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
async function bank(message) {
    let bank = await queryData(`SELECT bank, gold, IFNULL(utility.piggy_bank,false) as piggy_bank FROM stat LEFT JOIN utility ON (stat.player_id=utility.player_id) WHERE stat.player_id="${message.author.id}" LIMIT 1`);
    bank = bank.length > 0 ? bank[0] : 0;
    if (bank.piggy_bank) {
        let expBonus = calculateBonusExpBank(bank.bank);

        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [
                {
                    name: `__BALANCE__`,
                    value: `<:gold_coin:801440909006209025> **Gold**: ${currencyFormat(bank.gold)}\n<:piggy_bank:801444684194906142> **Bank**: ${currencyFormat(bank.bank)}\n ➥ **Benefit**: ${expBonus.toFixed(2)}%`,
                    inline: false,
                },
                {
                    name: `Bank commands`,
                    value: `\`deposit <amount>\`: deposit gold to piggy bank
            \`withdraw <amount>\`: withdraw gold from piggy bank`,
                    inline: false,
                }],
            author: {
                "name": `${message.author.username}'s piggy bank`,
                "url": null,
                "iconURL": `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                "proxyIconURL": `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            footer: {
                text: `Benefit will be convert as exp bonus when explore`,
                iconURL: null,
                proxyIconURL: null
            },
        }));
    } else {
        message.reply(`you don't have <:piggy_bank:801444684194906142> **piggy bank**,\nbuy one with \`buy piggy bank\``)
    }
}

export default bank;