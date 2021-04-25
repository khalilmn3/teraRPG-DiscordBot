import queryData from "../../helper/query.js";
import Discord from 'discord.js';
import emojiCharacter from "../../utils/emojiCharacter.js";
import currencyFormat from "../../helper/currency.js";

async function marketplace(message, args) {
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
    if (args[0] == 'list') {
        playerMarketQuery = `WHERE player_id=${message.author.id}`;
        soldStatusQuery = '';
    } else if (args[0] === 'search') {
        let arrayName = args.slice(1);
        arrayName.forEach(element => {
            if (searchItem) {
                searchItem += ' ';
            }
            searchItem += element;
        });
        searchQuery = `${soldStatusQuery ? 'AND' : 'WHERE'} item.name LIKE "%${searchItem}%" `;
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
                                ${soldStatusQuery}
                                ${searchQuery}
                                ${playerMarketQuery}
                                ${orderQuery}`);
        totalPage = Math.ceil(totalPage[0]['total'] / 15);

        let list = await queryData(`SELECT marketplace.player_id, marketplace.is_sold, marketplace.id, IFNULL(item_types.name,"unknown") as type, marketplace.price, item.name, item.emoji FROM marketplace 
                                LEFT JOIN item ON (marketplace.item_id=item.id)
                                LEFT JOIN item_types ON (item.type_id=item_types.id)
                                ${soldStatusQuery}
                                ${searchQuery}
                                ${playerMarketQuery}
                                ${orderQuery}
                                LIMIT ${(page * 15) - 15}, 15`);
        let items = 'Type \`tera info marketplace\` for more info\n\n<id>　<name>　<type>　<price>';
        if (list.length > 0) {
            list.forEach(element => {
                let soldStatus = element.is_sold ? '_**sold**_' : '';
                items += `\n`
                items += `\`${element.id}\`　${element.emoji}${element.name}${element.player_id == message.author.id ? '*' : ''}　|　${element.type}　|　${soldStatus ? `${soldStatus}` : `${emojiCharacter.gold2}${currencyFormat(element.price)}`}`
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
                text: `[Page ${page} - ${totalPage}]\n${args[0] == 'list' ? 'type claim to claim your profits' : 'type mn or mb to navigate'}`,
                iconURL: null,
                proxyIconURL: null
            },
            timestamp: new Date()
        });

        

        message.channel.send(embed)
            .then(() => {
                let filter = false;
                if (args[0] == 'list') {
                    filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'claim');
                } else {
                    filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == 'mn' || m.content.toLowerCase() == 'mb');        
                }
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            })
                .then(async message => {
                    message = message.first();
                    if (message.content.toLowerCase() == 'claim') {
                        let profit = await queryData(`SELECT IFNULL(SUM(price),0) as profit FROM marketplace WHERE player_id=${message.author.id} AND is_sold=1`);
                        profit = profit[0];
                        if (profit.profit <= 0) { return message.channel.send(`There is no item sold on your listing!`) };
                            // ADD GOLD
                            queryData(`UPDATE stat SET gold=gold+${profit.profit} WHERE player_id=${message.author.id} LIMIT 1`);
                            // Delete list
                            queryData(`DELETE FROM marketplace WHERE player_id=${message.author.id} AND is_sold=1`);
                            
                            message.channel.send(`Profit profit profit\nYou got total ${emojiCharacter.gold2}**${currencyFormat(profit.profit)}**`);
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