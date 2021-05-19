import Discord from "discord.js";
import queryData from "../helper/query.js";
import { variable } from "../helper/variable.js";
import errorCode from "../utils/errorCode.js";

async function trade(message, stat, args) {
    let maxZone = stat.max_zone.split('|');
    maxZone = parseInt(maxZone[0]);
    if ((args[0] === 'a' || args[0] === 'b')
        || ((args[0] === 'c' || args[0] === 'd') && maxZone >= 1)
        || ((args[0] === 'e' || args[0] === 'f') && maxZone >= 2)
        || ((args[0] === 'g' || args[0] === 'g') && maxZone >= 3)
        || ((args[0] === 'i' || args[0] === 'j') && maxZone >= 4)
        || ((args[0] === 'k' || args[0] === 'l') && maxZone >= 5)) {
        let qty = args[1] > 0 ? parseInt(args[1]) : 1;
        let isAll = args[1] == 'all';
        let amount = 1;
        let nameFrom = '';
        let nameTo = '';
        let itemIDFrom;
        let itemIDTo;
        let qtyFrom;
        let qtyTo;
        if (args[0] === 'a') {
            itemIDFrom = variable.woodId;
            itemIDTo = variable.copperOreId
            qtyFrom = maxZone <= 3 ? maxZone : maxZone == 4 ? 2 : 3;
            qtyTo = 1
            amount = qty * qtyFrom
            nameFrom = '<:Wood:804704694420766721>\`wood\`'
            nameTo = '<:copper_ore:835767578021462078>\`copper ore\`'
        } else if (args[0] === 'b') {
            itemIDFrom = variable.copperOreId;
            itemIDTo = variable.woodId
            qtyTo = maxZone <= 3 ? maxZone : maxZone == 4 ? 2 : 3;
            qtyFrom = 1
            amount = qty * qtyFrom;
            nameFrom = '<:copper_ore:835767578021462078>\`copper ore\`'
            nameTo =  '<:Wood:804704694420766721>\`wood\`'
        } else if (args[0] === 'c') {
            itemIDFrom = variable.copperOreId;
            itemIDTo = variable.ironOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:copper_ore:835767578021462078>\`copper ore\`'
            nameTo = '<:iron_ore:835768116927135744>\`iron ore\`'
        } else if (args[0] === 'd') {
            itemIDFrom = variable.ironOreId;
            itemIDTo = variable.copperOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:iron_ore:835768116927135744>\`iron ore\`'
            nameTo = '<:copper_ore:835767578021462078>\`copper ore\`'
        } else if (args[0] === 'e') {
            itemIDFrom = variable.ironOreId;
            itemIDTo = variable.silverOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:iron_ore:835768116927135744>\`iron ore\`'
            nameTo = '<:silver_ore:835764438991765524>\`silver ore\`'
        } else if (args[0] === 'f') {
            itemIDFrom = variable.silverOreId;
            itemIDTo = variable.ironOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:silver_ore:835764438991765524>\`silver ore\`'
            nameTo = '<:iron_ore:835768116927135744>\`iron ore\`'
        } else if (args[0] === 'g') {
            itemIDFrom = variable.silverOreId
            itemIDTo = variable.tungstenOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:silver_ore:835764438991765524>\`silver ore\`'
            nameTo = '<:tungsten_ore:835768117132001301>\`tungsten ore\`'
        } else if (args[0] === 'h') {
            itemIDFrom = variable.tungstenOreId;
            itemIDTo = variable.silverOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:tungsten_ore:835768117132001301>\`tungsten ore\`'
            nameTo = '<:silver_ore:835764438991765524>\`silver ore\`'
        } else if (args[0] === 'i') {
            itemIDFrom = variable.tungstenOreId;
            itemIDTo = variable.goldOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:tungsten_ore:835768117132001301>\`tungsten ore\`'
            nameTo = '<:gold_ore:835767578621247488>\`gold ore\`'
        } else if (args[0] === 'j') {
            itemIDFrom = variable.goldOreId;
            itemIDTo = variable.tungstenOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:gold_ore:835767578621247488>\`gold ore\`'
            nameTo = '<:tungsten_ore:835768117132001301>\`tungsten ore\`'
        } else if (args[0] === 'k') {
            itemIDFrom = variable.goldOreId;
            itemIDTo = variable.platinumOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:gold_ore:835767578621247488>\`gold ore\`'
            nameTo = '<:platinum_ore:835768116889124905>\`platinum ore\`'
        } else if (args[0] === 'l') {
            itemIDFrom = variable.platinumOreId;
            itemIDTo = variable.goldOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:platinum_ore:835768116889124905>\`platinum ore\`'
            nameTo = '<:gold_ore:835767578621247488>\`gold ore\`'
        }

        let item = await queryData(`SELECT quantity FROM backpack WHERE item_id="${itemIDFrom}" AND quantity>=${amount} AND player_id="${message.author.id}" LIMIT 1`);
        item = item.length > 0 ? item[0].quantity : 0;
        if (item < amount) {
            return message.channel.send(`Oh dear, I can't trade with what you have now <@${message.author.id}>!`);
        }
        queryData(`CALL trade_procedure(${itemIDFrom},${amount}, ${itemIDTo}, ${qtyTo * qty}, ${message.author.id})`);
        message.channel.send(`${message.author.username} has trade \`x${amount}\` ${nameFrom} ⇢ \`x${qtyTo * qty}\` ${nameTo}`)

        
    } else {
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: `Do you want to trade something **${message.author.username}**?`,
            url: null,
            color: 10115509,
            fields: [
//                 {
//                     name: `__\`ID                   TRADE                  ID\`__`,
//                     value: `__a__ ⇢ \`2\` <:Wood:804704694420766721>\`wood         \`⇄ 1 <:copper_ore:835767578021462078>\`copper ore   \` ⇠ __b__
// ${maxZone >= 2 ? `__c__ ⇢ \`5\` <:copper_ore:835767578021462078>\`copper ore   \`⇄ 1 <:iron_ore:835768116927135744>\`iron ore     \` ⇠ __d__` : ''}
// ${maxZone >= 3 ? `__e__ ⇢ \`5\` <:iron_ore:835768116927135744>\`iron ore     \`⇄ 1 <:silver_ore:835764438991765524>\`silver ore   \` ⇠ __f__` : ''}
// ${maxZone >= 4 ? `__g__ ⇢ \`5\` <:silver_ore:835764438991765524>\`silver ore   \`⇄ 1 <:tungsten_ore:835768117132001301>\`tungsten ore \` ⇠ __h__` : ''}
// ${maxZone >= 5 ? `__i__ ⇢ \`5\` <:tungsten_ore:835768117132001301>\`tungsten ore \`⇄ 1 <:gold_ore:835767578621247488>\`gold ore      \` ⇠ __j__` : ''}
// ${maxZone >= 6 ? `__k__ ⇢ \`5\` <:gold_ore:835767578621247488>\`gold ore     \`⇄ 1 <:platinum_ore:835768116889124905>\`platinum ore \` ⇠ __l__` : ''}`,
//                     inline: true
//                 },
            {
name: `__\`ID      TRADE      ID\`__`,
value: `__a__ ⇢ \`${maxZone <= 3 ? maxZone : maxZone == 4 ? 2 : 3}\` <:Wood:804704694420766721> ⇄ <:copper_ore:835767578021462078> \`1\` ⇠ __b__
${maxZone >= 1 ? `__c__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:copper_ore:835767578021462078> ⇄ <:iron_ore:835768116927135744> \`1\` ⇠ __d__` : ''}
${maxZone >= 2 ? `__e__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:iron_ore:835768116927135744> ⇄ <:silver_ore:835764438991765524> \`1\` ⇠ __f__` : ''}
${maxZone >= 3 ? `__g__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:silver_ore:835764438991765524> ⇄ <:tungsten_ore:835768117132001301> \`1\` ⇠ __h__` : ''}
${maxZone >= 4 ? `__i__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:tungsten_ore:835768117132001301> ⇄ <:gold_ore:835767578621247488> \`1\` ⇠ __j__` : ''}
${maxZone >= 5 ? `__k__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:gold_ore:835767578621247488> ⇄ <:platinum_ore:835768116889124905> \`1\` ⇠ __l__` : ''}`,
inline: true
},
                {
                    value: `use \`tera trade <id> <amount>\``,
                    name: 'Info'
                }
            ],
            // author: {
            //     name: `Trade`,
            //     url: null,
            //     iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            //     proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            // },
            thumbnail: {
                url: `https://cdn.discordapp.com/attachments/811586577612275732/824173097858236416/Merchant.png?size=512`,
                proxyURL: `https://cdn.discordapp.com/attachments/811586577612275732/824173097858236416/Merchant.png`,
                height: 0,
                width: 0
            }
        }))
        .catch((err) => {
            console.log('(trade)' + message.author.id + ': ' + errorCode[err.code]);
        });
    }
}

export default trade;