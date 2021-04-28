import queryData from "../../helper/query.js";
import Discord from 'discord.js';
import emojiCharacter from "../../utils/emojiCharacter.js";
import currencyFormat from "../../helper/currency.js";
import { updateStat2 } from "../../utils/processQuery.js";

async function marketplace(message, args, stat) {
    let idMention = message.mentions.users.first();
    let tag = message.author.tag
    let id = '';
    let avatar = '';
    if (idMention) {
        id = idMention.id;
        avatar = idMention.avatar;
        tag =  idMention.tag;
    } else if (message.author.id === '668740503075815424') {
        if (parseInt(args[0]) && args[0].length == 18) {
            id = args[0];
            tag = args[0];
        }
    }
    //Search Item
    let searchQuery = '';
    let searchItem = '';
    let orderQuery = 'ORDER BY marketplace.id DESC';
    let playerMarketQuery = '';
    let soldStatusQuery = 'WHERE is_sold=0';
    var footer = `Balance: ${currencyFormat(stat.gold)}`
    var profit = 0;
    var profitList = '';
    let fee = 0;
    if (args[0] == 'list') {
        playerMarketQuery = `WHERE player_id=${message.author.id}`;
        soldStatusQuery = '';

        // Profit
        profitList = await queryData(`SELECT COUNT(*) as total_item_sold, IFNULL(SUM(price),0) as profit FROM marketplace WHERE player_id=${message.author.id} AND is_sold=1`);
        profitList = profitList.length > 0 ? profitList[0] : 0;
        fee = 0.02;
        fee = Math.floor(profitList.profit * fee);
        profit = profitList.profit - fee;
        footer = `Sold: ${profitList.total_item_sold} • Profits: ${currencyFormat(profit)} • Fee(2%): ${currencyFormat(fee)}`

    } else if (args[0] === 'search') {
        let arrayName = args.slice(1);
        arrayName.forEach(element => {
            if (searchItem) {
                searchItem += ' ';
            }
            searchItem += element;
        });
        searchQuery = `${soldStatusQuery ? 'AND' : 'WHERE'} TRIM(CONCAT(IFNULL(modifier.name,'')," ",item.name)) LIKE "%${searchItem}%" `;
        orderQuery = `ORDER BY marketplace.price ASC`
    } else {
        //player market
        playerMarketQuery = id ? `AND player_id=${id}` : '';
    }
    let embed = '';
    let page = 1;
    var marketplace = async function (page) {
        let totalPage = await queryData(`SELECT COUNT(*) as total FROM marketplace 
            LEFT JOIN item ON (marketplace.item_id=item.id)
            LEFT JOIN item_types ON (item.type_id=item_types.id)
            LEFT JOIN modifier ON (marketplace.modifier_id=modifier.id)
            ${soldStatusQuery}
            ${searchQuery}
            ${playerMarketQuery}
            ${orderQuery}`);
        totalPage = Math.ceil(totalPage[0]['total'] / 10);

        let list = await queryData(`SELECT marketplace.player_id, marketplace.is_sold, marketplace.id, IFNULL(item_types.name,"unknown") as type, marketplace.price,
            TRIM(CONCAT(IFNULL(modifier.name,'')," ",item.name)) as name, item.emoji, IF(item.type_id=9,"att","def") as type_id,
            IFNULL(IF(item.type_id=9,weapon.level_required, armor.level_required),1) as level,
            ROUND(IF(item.type_id=9,IFNULL(weapon.attack,0), IFNULL(armor.def,0))  +  IF(item.type_id=9,(IFNULL(weapon.attack,0) * IFNULL(modifier.stat_change,0)), IFNULL(modifier.stat_change,0))) as stat
            FROM marketplace
            LEFT JOIN item ON (marketplace.item_id=item.id)
            LEFT JOIN item_types ON (item.type_id=item_types.id)
            LEFT JOIN weapon ON (item.id=weapon.item_id)
            LEFT JOIN armor ON (item.id=armor.item_id)
            LEFT JOIN modifier ON (marketplace.modifier_id=modifier.id)
            ${soldStatusQuery}
            ${searchQuery}
            ${playerMarketQuery}
            ${orderQuery}
            LIMIT ${(page * 10) - 10}, 10`);
        let items = 'Type \`tera info marketplace\` for more info\n\n__**\`ID　   Name　                               Price    \`**__';
        
        if (list.length > 0) {
            list.forEach(element => {
                let soldStatus = element.is_sold ? '_**sold**_' : '';
                items += `\n`
                
                let stat = element.stat ? `| *${element.type_id} +${element.stat}*` : '';
                let gold = soldStatus ? soldStatus : `\`${currencyFormat(element.price)}\``;
                let name = `${element.name}${element.player_id == message.author.id ? '*' : ''}`
                let totalLength = 40 - (gold.length + name.length);
                let space = '';
                for (let i = 0; i < totalLength; i++) {
                    space += '-';                    
                }
                items += `\`${element.id}\`　${element.emoji}\`${name}${space}\`${emojiCharacter.gold2}${gold}\n　　　➥ *level ${element.level}* | *${element.type.toLowerCase()}* ${stat}`
            });
        } else {
            items = 'Listings not available';
        }
        embed = new Discord.MessageEmbed({
            type: "rich",
            title: `**__${id || args[0] == 'list' ? `${tag}'s ` : ''}Marketplace__**`,
            description: items,
            url: null,
            color: 10113879,
            // author: {
            //     name: `${message.author.username}'s Code ${code}`,
            //     url: null,
            //     iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            //     proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            // },
            footer: {
                text: `[Page ${page} - ${totalPage}] • ${footer}\n${args[0] == 'list' ? 'type claim to claim your profits' : 'type mn or mb to navigate'}`,
                iconURL: null,
                proxyIconURL: null
            },
            timestamp: new Date()
        });

        message.channel.send(embed)
            .then(() => {
                let filter = false;
                if (args[0] == 'list') {
                    filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'claim' || m.content.toLowerCase() == 'mn' || m.content.toLowerCase() == 'mb');
                } else {
                    filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'mn' || m.content.toLowerCase() == 'mb');        
                }
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            })
                .then( message => {
                    message = message.first();
                    if (message.content.toLowerCase() == 'claim') {
                        if (profit <= 0) { return message.channel.send(`There is no item sold on your listing!`) };
                        // ADD GOLD
                        queryData(`UPDATE stat SET gold=gold+${profit} WHERE player_id=${message.author.id} LIMIT 1`);
                        // Delete list
                        queryData(`DELETE FROM marketplace WHERE player_id=${message.author.id} AND is_sold=1`);
                        // Fee
                        queryData(`INSERT marketplace_fee SET player_id=${message.author.id}, total_fee=${fee} ON DUPLICATE KEY UPDATE total_fee=total_fee+${fee}`);
                        // add to stat
                        updateStat2(message.author.id, 'market_trade', profitList.total_item_sold);
                        message.channel.send(`Profit profit profit\nYou got total ${emojiCharacter.gold2}**${currencyFormat(profit)}**`);
                    } else if (message.content.toLowerCase() == 'mn' && page < totalPage) {
                        page += 1;
                        marketplace(page)
                    } else if (message.content.toLowerCase() == 'mb' && page > 1) {
                        page -= 1;
                        marketplace(page)
                    } else {
                        message.channel.send(`${emojiCharacter.noEntry} | Page out of range`);
                    }
                    // deactiveCommand(message.author.id)
                })
                .catch(collected => {
                    // deactiveCommand(message.author.id)
                    // message.channel.send('Timeout, transaction cancelled');
                });
        });
    }
    await marketplace(page);
    
}

export default marketplace;