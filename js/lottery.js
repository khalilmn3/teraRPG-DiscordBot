import queryData from "./helper/query.js";
import Discord from 'discord.js';
import currencyFormat from "./helper/currency.js";
import secondsToDHms from "./helper/secondsToDHms.js";

async function lottery(message, client, args, stat) {
    if (args.length > 0 && args[0] === 'buy') {
        let qty = 1;
        if (args.length > 1 && parseInt(args[1]) > 0) {
            qty = args[1];
        }
        let totalTicketPrice = 100 * qty;
        let ticketHold = await queryData(`SELECT ticket FROM lottery WHERE player_id="${message.author.id}" LIMIT 1`);
        ticketHold = ticketHold.length > 0 ? ticketHold[0].ticket : 0;
        if ((parseInt(ticketHold) + parseInt(qty)) <= 10) {
            if (stat.gold >= totalTicketPrice) {
                queryData(`UPDATE stat SET gold=gold - ${totalTicketPrice} WHERE player_id="${message.author.id}" LIMIT 1`)
                await queryData(`INSERT INTO lottery SET player_id="${message.author.id}", username="${message.author.tag}", ticket=${qty} ON DUPLICATE KEY UPDATE username="${message.author.tag}", ticket=ticket + ${qty}`)
                let lotteryList = await queryData(`SELECT SUM(ticket) as totalTicketSold, COUNT(player_id) as totalParticipant FROM lottery`);
                let totalPrice = lotteryList.length > 0 ? lotteryList[0].totalTicketSold * 500 : 0;
                let ticketHold = await queryData(`SELECT ticket FROM lottery WHERE player_id="${message.author.id}" LIMIT 1`);
                ticketHold = ticketHold.length > 0 ? ticketHold[0].ticket : 0;
                // console.log(lotteryList);
                message.channel.send(new Discord.MessageEmbed({
                    type: "rich",
                    description: null,
                    url: null,
                    color: 10115509,
                    fields: [{
                        name: `You bought lottery ticket`,
                        value: `:tickets: | **Ticket hold**: ${ticketHold} \n:moneybag: | **Current well**: ${currencyFormat(totalPrice)} \n:busts_in_silhouette: | **Current participants**: ${lotteryList[0].totalParticipant}`,
                        inline: false,
                    }],
                    author: {
                        name: `${message.author.username}`,
                        url: null,
                        iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                        proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    },
                    footer: {
                        text: `Lottery draw everyday at 09:00 UTC`,
                        iconURL: null,
                        proxyIconURL: null
                    },
                }));
            } else {
                message.reply(`:no_entry_sign: | You don't have enough gold, 1 lottery ticket costs **100** gold`)
            }
        } else {
            message.reply(`:no_entry_sign: | You can only have maks. 10 Lottery ticket!`)   
        }
    } else {
        let lotteryList = await queryData(`SELECT SUM(ticket) as totalTicketSold, COUNT(player_id) as totalParticipant FROM lottery`);
        let totalTicketSold = lotteryList.length > 0 ? lotteryList[0].totalTicketSold : 0;
        let totalParticipant = lotteryList.length > 0 ? lotteryList[0].totalParticipant : 0;
        let totalPrice = lotteryList.length > 0 ? lotteryList[0].totalTicketSold * 500 : 0;
        let lotteryDraw = await queryData(`SELECT * FROM lottery_draw ORDER BY id DESC LIMIT 1`);
        let lastWinner = lotteryDraw.length > 0 ? lotteryDraw[0].username : '';
        let lastPrize = lotteryDraw.length > 0 ? lotteryDraw[0].total_prize : 0;
        let cDate = new Date();
        let h = cDate.getUTCHours();
        let m = cDate.getUTCMinutes();
        let s = cDate.getUTCSeconds();
        let hSeconds = h * 60 * 60;
        let mSeconds = m * 60;
        let totalSeconds = hSeconds + mSeconds + s;
        let nextDraw = 'Invalid Time';
        if (h > 1 && m > 0) {
            nextDraw = secondsToDHms(86400 - totalSeconds);
        } else {
            nextDraw = secondsToDHms( 1 * 60 * 60 - totalSeconds);
        }
        message.channel.send(new Discord.MessageEmbed({
            type: "rich",
            description: null,
            url: null,
            color: 10115509,
            fields: [{
                name: `__LOTTERY STATUS__`,
                value: `:tickets: | **Ticket sold**: ${currencyFormat(totalTicketSold)} \n:moneybag: | **Current well**: ${currencyFormat(totalPrice)} \n:busts_in_silhouette: | **Current participants**: ${currencyFormat(totalParticipant)}`,
                inline: false,
            },
            {
                name: `__LAST WINNER__`,
                value: `:bust_in_silhouette: | ${lastWinner} \n<:gold_coin:801440909006209025> | ${currencyFormat(lastPrize)}`,
                inline: false,
            },
            {
                name: `__INFO__`,
                value: `Type \`tera lottery buy [amount]\` to participate in lottery \nYou can buy up to 10 lottery tickets.`,
                inline: false,
            }],
            footer: {
                text: `Next drawn in ${nextDraw}`,
                iconURL: null,
                proxyIconURL: null
            },
        }));
    }
}

export default lottery;