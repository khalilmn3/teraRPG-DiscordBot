import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import { activeCommand, deactiveCommand } from './helper/setActiveCommand.js';
import { limitedTimeUse, priceList } from './helper/variable.js';
import symbol from './utils/symbol.js';
function buy(message, commandsBody) {
    let argument = commandsBody
    let qty = argument.match(/\d+/g);
    qty = qty ? qty[0] : 1;
    let arrayName = argument.match(/[a-zA-Z]+/g);
    let itemName = '';
    arrayName = arrayName.splice(1);
    arrayName.forEach(element => {
        if (itemName) {
            itemName += ' ';
        }
        if (element != 'all') {
            itemName += element;
        } else {
            qty = 'all';
        }
    });
    // MARKET ITEM
    if (itemName == 'piggy bank') {
        queryCheckExistItem(message, message.author.id, 1)
    } else if (itemName == 'bug net') {
        queryCheckExistItem(message, message.author.id, 2)
    } else if (itemName == 'mining helmet') {
        queryCheckExistItem(message, message.author.id, 3)
    } else if (itemName == 'pylon') {
        queryCheckExistItem(message, message.author.id, 5)
    }
    // else if (args1 === 'ring') {
    //     queryCheckExistItem(message, message.author.id, 4)
    // }
    // SHOP ITEM
    else if (itemName == 'healing potion') {
        // queryAddItem(message,message.author.id,itemName,priceList.healingPotion.id,priceList.healingPotion.price,qty)
        message.channel.send('This item is currently out of stock');
    }
    else if (itemName == 'apricot') {
        queryAddItem(message,message.author.id,itemName,priceList.apricot.id,priceList.apricot.price, qty)
    } else if (itemName == 'apple') {
        queryAddItem(message,message.author.id,itemName,priceList.apple.id,priceList.apple.price, qty)
    } else if (itemName == 'cookie') {
        queryAddItem(message,message.author.id,itemName,priceList.cookie.id,priceList.cookie.price,qty)
    } else if (itemName == 'apple pie') {
        queryAddItem(message,message.author.id,itemName,priceList.applePie.id,priceList.applePie.price,qty)
    } else if (itemName == 'apprentice bait') {
        queryAddItem(message,message.author.id,itemName,priceList.apprenticeBait.id,priceList.apprenticeBait.price,qty)
    } else {
        message.reply('What are you trying to buy, \nCheck the item name with \`tera market\` and \`tera shop\`!');
    }
}


async function queryCheckExistItem(message, playerId, toBuyId){
    let item = await queryData(`SELECT utility.*, stat.diamond FROM stat LEFT JOIN utility ON (stat.player_id=utility.player_Id) WHERE stat.player_id="${playerId}" LIMIT 1`);
    item = item.length > 0 ? item[0] : 0;
    let isExist = false;
    let queryField = '';
    let itemName = '';
    let reqDiamond = 0;
    if (toBuyId == 1) {
        isExist = item.piggy_bank > 0;
        queryField = 'piggy_bank';
        itemName = '<:piggy_bank:801444684194906142> Piggy bank.\nUse \`tera deposit <amount>\` to deposit your gold';
        reqDiamond = 2;
    } else if (toBuyId == 2) {
        isExist = item.bug_net > 0;
        queryField = 'bug_net';
        itemName = '<:Bug_Net:824176322908913687> Bug net.'
        reqDiamond = 10;
    } else if (toBuyId == 3) {
        isExist = item.mining_helmet > 0;
        queryField = 'mining_helmet';
        itemName = '<:Mining_Helmet:824176323194650624> Mining helmet.'
        reqDiamond = 35;
    } else if (toBuyId == 4) {
        isExist = item.ring > 0;
        queryField = 'ring';
        itemName = '<:Ring:824176323219292220> Ring, \n use \`tera married <@user>\` to marry with other player.'
        reqDiamond = 175;
    } else if (toBuyId == 5) {
        isExist = item.pylon > 0;
        queryField = 'pylon';
        itemName = '<:Forest_Pylon:826645637788598294> Pylon, \n use \`zone <zone> <sub_zone>\`.'
        reqDiamond = 1;
    }
// 
    if (isExist) {
        message.reply('🚫 | You already have this item!');
    } else if (item.diamond < reqDiamond) {
        message.reply('you don\'t have enough **diamonds** to buy this item');
    } else {
        queryData('INSERT utility SET player_id="'+playerId+'",'+queryField+'=TRUE ON DUPLICATE KEY UPDATE '+queryField+'=1');
        queryData(`UPDATE stat SET diamond=diamond-${reqDiamond} WHERE player_id="${playerId}" LIMIT 1`);
        message.reply(`you have successfully bought ${itemName}`)
    }
}


async function queryAddItem(message, playerId, itemName, itemId, price, amount) {
    let discountCard = await queryData(`SELECT * FROM backpack WHERE player_id=${message.author.id} AND item_id=${limitedTimeUse.dicountCardId} AND quantity>0 LIMIT 1`);
    discountCard = discountCard.length > 0 ? 20 : 0;
    let gold = await queryData(`SELECT gold FROM stat WHERE player_id="${playerId}" LIMIT 1`);
    gold = gold.length > 0 ? gold[0].gold : 0;
    amount = isNaN(amount) || amount == '0' ? 1 : parseInt(amount);
    if (amount > 0) {
        let discPrice = discountCard ? price - (price * 20 / 100) : price;
        price = price * amount;
        discPrice = discPrice * amount;
        let msgDiscountCard = '';
        if (discountCard) {
            await message.channel.send(`You have ${limitedTimeUse.dicountCardEmoji}**discount card** 20%\nDo you want to use it ? \`yes\`/\`no\`\ndisc. price ~~*${currencyFormat(price)}*~~ ${currencyFormat(discPrice)}`)
                .then(() => {
                    let filter = m => m.author.id === message.author.id
                    activeCommand(message.author.id);
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 15000,
                        errors: ['time']
                    })
                        .then(message => {
                            message = message.first();
                            if (message.content.toLowerCase() == 'yes' || message.content.toLowerCase() == 'y') {
                                msgDiscountCard = `${limitedTimeUse.dicountCardEmoji}Discount card applied __*20%*__\n`
                                price = discPrice;
                                if (gold >= price) {
                                    queryData(`UPDATE backpack SET quantity=quantity-1 WHERE player_id="${playerId}" AND item_id=${limitedTimeUse.dicountCardId} LIMIT 1`);
                                }
                            } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') {
                        
                            } else {
                                deactiveCommand(message.author.id)
                                return message.channel.send('Invalid response, Transaction cancelled')
                            }

                            
                            if (gold >= price) {
                                queryData(`CALL insert_item_backpack_procedure("${playerId}", "${itemId}", ${amount})`);
                                queryData(`UPDATE stat SET gold=gold-${price} WHERE player_id="${playerId}" LIMIT 1`);
                                message.channel.send(`${msgDiscountCard}**${message.author.username}** successfully bought **x${amount} ${itemName}** for <:gold_coin:801440909006209025>${currencyFormat(price)}`);
                            } else {
                                message.reply('you don\'t have enough **gold** to buy this item');
                            }
                            deactiveCommand(message.author.id)
                        })
                        .catch(collected => {
                            deactiveCommand(message.author.id)
                            message.channel.send('Timeout, transaction cancelled');
                        });
                });
        } else {
            if (gold >= price) {
                queryData(`CALL insert_item_backpack_procedure("${playerId}", "${itemId}", ${amount})`);
                queryData(`UPDATE stat SET gold=gold-${price} WHERE player_id="${playerId}" LIMIT 1`);
                message.channel.send(`${msgDiscountCard}**${message.author.username}** successfully bought **x${amount} ${itemName}** for <:gold_coin:801440909006209025>${currencyFormat(price)}`);
            } else {
                message.reply('you don\'t have enough **gold** to buy this item');
            }
        }

    }
}

export default buy;