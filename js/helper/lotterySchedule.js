import queryData from "./query.js";
import Discord from 'discord.js';
import currencyFormat from "./currency.js";

async function lotteryWinnerRunSchedule(client) {
    let lottery = await queryData(`SELECT player_id, ticket, username FROM lottery`);
    let basePrize = 500;
    let totalTicketSold = 0;
    let totalParticipant = 0;
    lottery.forEach(element => {
        totalTicketSold += element.ticket
        totalParticipant++
    });
    let prize = basePrize * totalTicketSold;
    let accumulatedChance = 0;
    let randomNumber = Math.random();
    let winner = lottery.find((element) => { 
        accumulatedChance += (100 / totalTicketSold * element.ticket / 100) 
        return accumulatedChance >= randomNumber 
    })
    if (winner) {
        await queryData(`INSERT INTO lottery_draw SET player_id="${winner.player_id}", username="${winner.username}", total_prize=${prize}, last_draw_at=NOW()`)
        queryData(`TRUNCATE TABLE lottery`);
        client.channels.cache.get('818359912790229002').send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [{
                name: `:confetti_ball: __LOTTERY WINNER__ :confetti_ball: `,
                value: `**${winner.username}** - <:gold_coin:801440909006209025> **${currencyFormat(prize)}**`,
                inline: false,
            }],
            footer: {
                text: `Ticket sold: ${currencyFormat(totalTicketSold)}\nParticipants: ${currencyFormat(totalParticipant)} \n`,
                iconURL: null,
                proxyIconURL: null
            },
            timestamp: new Date()
        }));
        // SEND DM TO THE WINNER
        client.users.cache.get(winner.player_id).send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [
            {
                name: `:tada:__Congratulations ${client.users.cache.get(winner.player_id).username}__:tada:`,
                value: `You win the Lottery -- <:gold_coin:801440909006209025> **${currencyFormat(prize)}**`,
                inline: false,
                }],
            timestamp: new Date()
        })).catch((err) => {
            console.log('(Lottery)'+winner.player_id+': '+errorCode[err.code]);
        });
    } else {
        client.channels.cache.get('818359912790229002').send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [{
                name: `:confetti_ball: __FAILED TO GET LOTTERY WINNER__ :confetti_ball: `,
                value: `**No one joining the lottery**`,
                inline: false,
            }],
            footer: {
                text: `Ticket sold: ${currencyFormat(totalTicketSold)}\nParticipants: ${currencyFormat(totalParticipant)} \n`,
                iconURL: null,
                proxyIconURL: null
            },
            timestamp: new Date()
        }));
    }
}

export default lotteryWinnerRunSchedule;