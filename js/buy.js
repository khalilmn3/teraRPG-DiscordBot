import queryData from './helper/query.js';
function buy(message, args1, args2, args3) {
    if (args1 === 'piggy' && args2 === 'bank') {
        queryCheckExistItem(message, message.author.id, 1)
    } else if (args1 === 'bug' && args2 === 'net') {
        queryCheckExistItem(message, message.author.id, 2)
    } else if (args1 === 'mining' && args2 === 'helmet') {
        queryCheckExistItem(message, message.author.id, 3)
    }
    // else if (args1 === 'ring') {
    //     queryCheckExistItem(message, message.author.id, 4)
    // }
    else if (args1 === 'healing' && args2 === 'potion') {
        queryAddItem(message,message.author.id,1,args3)
    } else if (args1 === 'apprentice' && args2 === 'bait') {
        queryAddItem(message,message.author.id,2,args3)
    } else {
        message.reply.send('What are you trying to buy, \nCheck the item name with \`tera market\`!');
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


async function queryAddItem(message, playerId,toBuyId, amount){
    let gold = await queryData(`SELECT gold FROM stat WHERE player_id="${playerId}" LIMIT 1`);
    gold = gold.length > 0 ? gold[0].gold : 0;
    amount = isNaN(amount) || amount == '0' ? 1 : parseInt(amount);
    if (amount > 0) {
        let itemId = '';
        let itemName = '';
        let price = 0
        if (toBuyId == 1) {
            price = 35;
            itemId = 266 // healing potion
            itemName = 'healing potion';
        } else if (toBuyId == 2) {
            price = 75;
            itemId = 271 // apprentice bait
            itemName = 'apprentice bait';
        }
        price = price * amount;
        if (gold >= price) {
            queryData(`CALL insert_item_backpack_procedure("${playerId}", "${itemId}", ${amount})`);
            queryData(`UPDATE stat SET gold=gold-${price} WHERE player_id="${playerId}" LIMIT 1`);
            message.channel.send(`**${message.author.username}** successfully bought **x${amount} ${itemName}** for <:gold_coin:801440909006209025>${price}`);
        } else {
            message.reply('you don\'t have enough **gold** to buy this item');
        }
    }
}

export default buy;