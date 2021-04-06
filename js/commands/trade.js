import Discord from "discord.js";
import queryData from "../helper/query.js";
import { variable } from "../helper/variable.js";

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
            nameTo = '<:Copper_Ore:803930190266630144>\`copper ore\`'
        } else if (args[0] === 'b') {
            itemIDFrom = variable.copperOreId;
            itemIDTo = variable.woodId
            qtyFrom = maxZone <= 3 ? maxZone : maxZone == 4 ? 2 : 3;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:Copper_Ore:803930190266630144>\`copper ore\`'
            nameTo =  '<:Wood:804704694420766721>\`wood\`'
        } else if (args[0] === 'c') {
            itemIDFrom = variable.copperOreId;
            itemIDTo = variable.ironOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:Copper_Ore:803930190266630144>\`copper ore\`'
            nameTo = '<:Iron_Ore:803930082782609439>\`iron ore\`'
        } else if (args[0] === 'd') {
            itemIDFrom = variable.ironOreId;
            itemIDTo = variable.copperOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:Iron_Ore:803930082782609439>\`iron ore\`'
            nameTo = '<:Copper_Ore:803930190266630144>\`copper ore\`'
        } else if (args[0] === 'e') {
            itemIDFrom = variable.ironOreId;
            itemIDTo = variable.silverOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:Iron_Ore:803930082782609439>\`iron ore\`'
            nameTo = '<:Silver_Ore:803930635613372416>\`silver ore\`'
        } else if (args[0] === 'f') {
            itemIDFrom = variable.silverOreId;
            itemIDTo = variable.ironOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:Silver_Ore:803930635613372416>\`silver ore\`'
            nameTo = '<:Iron_Ore:803930082782609439>\`iron ore\`'
        } else if (args[0] === 'g') {
            itemIDFrom = variable.silverOreId
            itemIDTo = variable.tungstenOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:Silver_Ore:803930635613372416>\`silver ore\`'
            nameTo = '<:Tungsten_Ore:803930285187006495>\`tungsten ore\`'
        } else if (args[0] === 'h') {
            itemIDFrom = variable.tungstenOreId;
            itemIDTo = variable.silverOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:Tungsten_Ore:803930285187006495>\`tungsten ore\`'
            nameTo = '<:Silver_Ore:803930635613372416>\`silver ore\`'
        } else if (args[0] === 'i') {
            itemIDFrom = variable.tungstenOreId;
            itemIDTo = variable.goldOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:Tungsten_Ore:803930285187006495>\`tungsten ore\`'
            nameTo = '<:Gold_Ore:803930116270587914>\`gold ore\`'
        } else if (args[0] === 'j') {
            itemIDFrom = variable.goldOreId;
            itemIDTo = variable.tungstenOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:Gold_Ore:803930116270587914>\`gold ore\`'
            nameTo = '<:Tungsten_Ore:803930285187006495>\`tungsten ore\`'
        } else if (args[0] === 'k') {
            itemIDFrom = variable.goldOreId;
            itemIDTo = variable.platinumOreId
            qtyFrom = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            qtyTo = 1
            amount = qty * qtyFrom;
            nameFrom = '<:Gold_Ore:803930116270587914>\`gold ore\`'
            nameTo = '<:Platinum_Ore:803930281547399229>\`platinum ore\`'
        } else if (args[0] === 'l') {
            itemIDFrom = variable.platinumOreId;
            itemIDTo = variable.goldOreId
            qtyFrom = 1
            qtyTo = maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5;
            amount = qty * qtyFrom;
            nameFrom = '<:Platinum_Ore:803930281547399229>\`platinum ore\`'
            nameTo = '<:Gold_Ore:803930116270587914>\`gold ore\`'
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
//                     value: `__a__ ⇢ \`2\` <:Wood:804704694420766721>\`wood         \`⇄ 1 <:Copper_Ore:803930190266630144>\`copper ore   \` ⇠ __b__
// ${maxZone >= 2 ? `__c__ ⇢ \`5\` <:Copper_Ore:803930190266630144>\`copper ore   \`⇄ 1 <:Iron_Ore:803930082782609439>\`iron ore     \` ⇠ __d__` : ''}
// ${maxZone >= 3 ? `__e__ ⇢ \`5\` <:Iron_Ore:803930082782609439>\`iron ore     \`⇄ 1 <:Silver_Ore:803930635613372416>\`silver ore   \` ⇠ __f__` : ''}
// ${maxZone >= 4 ? `__g__ ⇢ \`5\` <:Silver_Ore:803930635613372416>\`silver ore   \`⇄ 1 <:Tungsten_Ore:803930285187006495>\`tungsten ore \` ⇠ __h__` : ''}
// ${maxZone >= 5 ? `__i__ ⇢ \`5\` <:Tungsten_Ore:803930285187006495>\`tungsten ore \`⇄ 1 <:Gold_Ore:803930116270587914>\`gold ore      \` ⇠ __j__` : ''}
// ${maxZone >= 6 ? `__k__ ⇢ \`5\` <:Gold_Ore:803930116270587914>\`gold ore     \`⇄ 1 <:Platinum_Ore:803930281547399229>\`platinum ore \` ⇠ __l__` : ''}`,
//                     inline: true
//                 },
            {
name: `__\`ID      TRADE      ID\`__`,
value: `__a__ ⇢ \`${maxZone <= 3 ? maxZone : maxZone == 4 ? 2 : 3}\` <:Wood:804704694420766721> ⇄ <:Copper_Ore:803930190266630144> \`1\` ⇠ __b__
${maxZone >= 1 ? `__c__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:Copper_Ore:803930190266630144> ⇄ <:Iron_Ore:803930082782609439> \`1\` ⇠ __d__` : ''}
${maxZone >= 2 ? `__e__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:Iron_Ore:803930082782609439> ⇄ <:Silver_Ore:803930635613372416> \`1\` ⇠ __f__` : ''}
${maxZone >= 3 ? `__g__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:Silver_Ore:803930635613372416> ⇄ <:Tungsten_Ore:803930285187006495> \`1\` ⇠ __h__` : ''}
${maxZone >= 4 ? `__i__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:Tungsten_Ore:803930285187006495> ⇄ <:Gold_Ore:803930116270587914> \`1\` ⇠ __j__` : ''}
${maxZone >= 5 ? `__k__ ⇢ \`${maxZone <= 3 ? 5 : maxZone == 4 ? 3 : 5}\` <:Gold_Ore:803930116270587914> ⇄ <:Platinum_Ore:803930281547399229> \`1\` ⇠ __l__` : ''}`,
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
        }));
    }
}

export default trade;