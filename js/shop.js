import Discord from 'discord.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import { limitedTimeUse } from './helper/variable.js';
import emojiCharacter from './utils/emojiCharacter.js';
async function shop(message, stat) {
    let cekDiscountCard = await queryData(`SELECT * FROM backpack WHERE player_id=${message.author.id} AND item_id=${limitedTimeUse.dicountCardId} AND quantity>0 LIMIT 1`);
    cekDiscountCard = cekDiscountCard.length > 0 ? 20 : 0;

    message.channel.send(new Discord.MessageEmbed({
        type: "rich",
        description: 'Use \`tera buy [item] [amount]\` for buying items from shop',
        url: null,
        color: 10115509,
        fields: [
            {
                name: `*Balance*: ${emojiCharacter.gold2}${currencyFormat(stat.gold)}`,
                value: `*Discount card*: ${limitedTimeUse.dicountCardEmoji}${cekDiscountCard}%`
            },
            {
                name: `Shop`,
                value: `<:Healing_Potion:810747622859735100>  \`Healing Potion\` | \`restore heal point-\` ${cekDiscountCard ? `~~*35*~~ 28` : '35'} <:gold_coin:801440909006209025> 
<:Apprentice_Bait:824271452056059985> \`Apprentice Bait\` | \`15% bait power----\` ${cekDiscountCard ? `~~*75*~~ 60` : '75'} <:gold_coin:801440909006209025>`,
                
// <:Mining_Helmet:824176323194650624> \`Mining Helmet\` | \`eliminate rock when mining--------------\` 35 <:diamond:801441006247084042>`,`
// <:Ring:824176323219292220> \`Ring\` | \`Marrie me!!!-----------------------------------\` 175 <:diamond:801441006247084042>`,
                inline: false,
            }
        ],
        author: {
            name: `TERA SHOP`,
            url: null,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        thumbnail: {
            url: `https://cdn.discordapp.com/attachments/811586577612275732/824173097858236416/Merchant.png?size=512`,
            proxyURL: `https://cdn.discordapp.com/attachments/811586577612275732/824173097858236416/Merchant.png`,
            height: 0,
            width: 0
        },
        footer: {
            text: `use \`tera market\` to buy item with diamond`,
            iconURL: null,
            proxyIconURL: null
        },
    }));
}

export default shop;