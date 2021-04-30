import Discord from 'discord.js';
import currencyFormat from './helper/currency.js';
import queryData from './helper/query.js';
import setCooldowns from './helper/setCooldowns.js';
async function voteRewardsSend(client, player_id, isWeekend) {
    await queryData(`INSERT INTO votes SET player_id="${player_id}", vote_count=1, last_updates=NOW() ON DUPLICATE KEY UPDATE vote_count= vote_count + 1, last_updates=NOW()`);
    let userExist = await queryData(`SELECT level FROM stat WHERE player_id="${player_id}" LIMIT 1`);
    if (userExist.length > 0) {
        // REWARDS
        // 10 * level Potion / ID: 266
        // 1500 * level GOLD / 
        // 1 iron crate / ID:223
        // 1 diamond /
        let multiplyWeekend = 1;
        if (isWeekend) {
            multiplyWeekend = 2;
        }
        let gold = (1352 * parseInt(userExist[0].level)) * multiplyWeekend;
        let diamond = 1 * multiplyWeekend;
        let ironCrate = 1 * multiplyWeekend;
        let potion = Math.floor(((parseInt(userExist[0].level) / 2 ) + 2) * multiplyWeekend);
        potion = potion > 100 ? 100 : potion;
        gold = gold > 200000 ? 200000 : gold;
        queryData(`CALL insert_item_backpack_procedure("${player_id}", "266", ${potion})`);
        queryData(`CALL insert_item_backpack_procedure("${player_id}", "223", ${ironCrate})`);
        queryData(`UPDATE stat SET gold=gold + ${gold}, diamond=diamond + ${diamond} WHERE player_id="${player_id}" LIMIT 1`);
        queryData(`UPDATE votes SET rewards_sent_count=rewards_sent_count + 1 WHERE player_id="${player_id}" LIMIT 1`);
        setCooldowns(player_id, 'vote');
        
        // DM User
        client.users.fetch(`${player_id}`).then((user) => {
            user.send(new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 10115509,
                fields: [{
                    name: `Thanks for upvote teraRPG`,
                    value: `this is some rewards for you`,
                    inline: false,
                },
                {
                    name: isWeekend ? 'Weekend Rewards' : 'Rewards',
                    value: `- <:diamond:801441006247084042> ${diamond} diamond\n- <:Iron_Crate:810034071307943976> ${ironCrate} iron crate\n- <:Healing_Potion:810747622859735100> ${currencyFormat(potion)} potion\n- <:gold_coin:801440909006209025> ${currencyFormat(gold)} gold`,
                    inline: false,
                }],
                timestamp: new Date()
            })).catch((err) => {
                console.log('(VoteSend)'+player_id+': '+errorCode[err.code]);
            });
        });
    }
}

export default voteRewardsSend;