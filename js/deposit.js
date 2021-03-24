import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
async function deposit(message, args1) {
    if (!isNaN(args1)) {
        let amount = parseInt(args1);
        let gold = await queryData(`SELECT gold, IFNULL(utility.piggy_bank,false) as piggy_bank FROM stat LEFT JOIN utility ON (stat.player_id=utility.player_id) WHERE stat.player_id="${message.author.id}" LIMIT 1`);
        gold = gold.length > 0 ? gold[0] : 0;
        if (gold !== 0) {
            if (gold.piggy_bank) { 
                if (gold.gold >= amount) {
                    queryData(`UPDATE stat SET gold=gold-${amount}, bank=bank+${amount} WHERE player_id="${message.author.id}" LIMIT 1`);
                    message.channel.send(`You have been deposit <:gold_coin:801440909006209025>${currencyFormat(amount)} ➜ <:piggy_bank:801444684194906142>.`)
                } else {
                    message.reply(`come on...! you don't have that much gold!`);
                }
            } else {
                message.reply('You don\'t have <:piggy_bank:801444684194906142>**piggy bank**!');
            }
        }
    }
}

export default deposit;