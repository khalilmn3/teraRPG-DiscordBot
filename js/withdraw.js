import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
async function withdraw(message, args1) {
    if (!isNaN(args1)) {
        let amount = parseInt(args1);
        let bank = await queryData(`SELECT bank, IFNULL(utility.piggy_bank,false) as piggy_bank FROM stat LEFT JOIN utility ON (stat.player_id=utility.player_id) WHERE stat.player_id="${message.author.id}" LIMIT 1`);
        bank = bank.length > 0 ? bank[0] : 0;
        if (bank !== 0 && amount > 0) {
            if (bank.piggy_bank) { 
                if (bank.bank >= amount) {
                    queryData(`UPDATE stat SET gold=gold+${amount}, bank=bank-${amount} WHERE player_id="${message.author.id}" LIMIT 1`);
                    message.channel.send(`You have been withdraw <:piggy_bank:801444684194906142> ➜ <:gold_coin:801440909006209025>${currencyFormat(amount)}.`)
                } else {
                    message.reply(`come on...! you don't have that much gold on your piggy bank!`);
                }
            } else {
                message.reply('You don\'t have <:piggy_bank:801444684194906142>**piggy bank**!');
            }
        }
    } else if (args1 === 'all') {
        let bank = await queryData(`SELECT bank, IFNULL(utility.piggy_bank,false) as piggy_bank FROM stat LEFT JOIN utility ON (stat.player_id=utility.player_id) WHERE stat.player_id="${message.author.id}" LIMIT 1`);
        bank = bank.length > 0 ? bank[0] : 0;
        if (bank !== 0) {
            if (bank.piggy_bank) { 
                    queryData(`UPDATE stat SET gold=gold+bank, bank=0 WHERE player_id="${message.author.id}" LIMIT 1`);
                    message.channel.send(`You have been withdraw <:piggy_bank:801444684194906142> ➜ <:gold_coin:801440909006209025>${currencyFormat(bank.bank)}.`)
            } else {
                message.reply('You don\'t have <:piggy_bank:801444684194906142>**piggy bank**!');
            }
        }
    }
}

export default withdraw;