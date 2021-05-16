import Discord from 'discord.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import { limitedTimeUse, priceList } from './helper/variable.js';
import emojiCharacter from './utils/emojiCharacter.js';
import errorCode from './utils/errorCode.js';
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
                value: `<:Apricot:837562146124595222> \`Apricot\` | \`restore +7 HP -----------\` <:gold_coin:801440909006209025>${cekDiscountCard ? `~~*${priceList.apricot.price}*~~ ${priceList.apricot.price - (priceList.apricot.price * 20 / 100)}` : priceList.apricot.price}
<:Apple:837562146497232906> \`Apple\` | \`restore +10 HP-------------\` <:gold_coin:801440909006209025>${cekDiscountCard ? `~~*${priceList.apple.price}*~~ ${priceList.apple.price - (priceList.apple.price * 20 / 100)}` : priceList.apple.price}
<:cookie:837564243695894528> \`Cookie\` | \`restore +30 HP------------\` <:gold_coin:801440909006209025>${cekDiscountCard ? `~~*${priceList.cookie.price}*~~ ${priceList.cookie.price - (priceList.cookie.price * 20 / 100)}` : priceList.cookie.price}
<:Apple_Pie:837563511135666227> \`Apple Pie\` | \`restore +100 HP--------\` <:gold_coin:801440909006209025>${cekDiscountCard ? `~~*${priceList.applePie.price}*~~ ${priceList.applePie.price - (priceList.applePie.price * 20 / 100)}` : priceList.applePie.price}
<:Apprentice_Bait:824271452056059985> \`Apprentice Bait\` | \`15% bait power---\` <:gold_coin:801440909006209025>${cekDiscountCard ? `~~*${priceList.apprenticeBait.price}*~~ ${priceList.apprenticeBait.price - (priceList.apprenticeBait.price * 20 / 100)}` : priceList.apprenticeBait.price}`,
                
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
    })).catch((err) => {
        console.log('(shop)' + message.author.id + ': ' + errorCode[err.code]);
    });
}

export default shop;