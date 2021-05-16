import Discord from "discord.js"
import currencyFormat from "../helper/currency.js";
import queryData from "../helper/query.js";
import randomNumber from "../helper/randomNumberWithMinMax.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import errorCode from "../utils/errorCode.js";

async function pirate(message, stat) {
    let embed = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 1231235,
        fields: [
            {
                name: 'Pirate invasion',
                value: `The pirates have arrived!\nType \`fight\` to fight the pirates \nget rewards depend of how much player join in`
            }
        ],
        thumbnail: {
            url: `https://cdn.discordapp.com/attachments/828836250286817280/833188536122998804/Flying_Dutchman.png`
        }
    });
    let embedNotif1 = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 12312355,
        fields: [
            {
                name: 'ALERT!!!',
                value: "Pirates are approaching from the west!"
            }
        ],
        thumbnail: {
            url: `https://cdn.discordapp.com/attachments/828836250286817280/833188536122998804/Flying_Dutchman.png`
        },
        footer: {
            text: `Prepare your self, they are close enough`
        }
    });

    let embedNotif2 = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 12312355,
        fields: [
            {
                name: 'ALERT!!!',
                value: "Pirates are approaching from the east!"
            }
        ],
        thumbnail: {
            url: `https://cdn.discordapp.com/attachments/828836250286817280/833188536122998804/Flying_Dutchman.png`
        },
        footer: {
            text: `Prepare your self, they are close enough`
        }
    });
        message.channel.send(embedNotif1)
    setTimeout(() => {
        console.log(`pirate has landing on: ${message.guild.id}`)
        let users = [];
        let userExist = [];
        message.channel.send(embed).then(async (msg) => {
            const filter = (response) => {
                console.log('filter');
                if (!userExist.includes(response.author)) {
                    userExist.push(response.author);
                    return response.content.toLowerCase() === `fight`    
                } else {
                    return false;
                }
            };
            
            let usersJoin = 0;
            let winChance = 60;
            let randomGold = randomNumber(500, 1000);
            let goldWin = (randomGold * stat.level) / 10;
            await msg.channel.awaitMessages(filter, { max: 5, time: 20000 })
                .then(collected => {
                    let message = collected.first();
                    collected.forEach((element) => { 
                        let player = element.author;
                        if (!users.includes(player)) {
                            usersJoin++;
                            winChance += 5;
                            users.push(player);
                        }
                    })
                })
            winChance = winChance > 100 ? 100 : winChance;
            // console.log(winChance);
            goldWin = Math.floor(goldWin * usersJoin);
            let luckyCoinWin = '';
            let discountCardWin = '';
            let cutlassWin = '';
            let uniqueDropChance = randomNumber(1, 100);
            if (uniqueDropChance <= winChance) {
                if (usersJoin >= 2) {
                    let random1 = '';
                    let random2 = '';
                    let random3 = randomNumber(0, usersJoin - 1);
                    // console.log(uniqueDropChance);
                    // drop chance discount card
                    if (uniqueDropChance <= 10) {
                        random2 = randomNumber(0, usersJoin - 1);
                        if (random2 != random1) {
                            discountCardWin = users[random2];
                            queryData(`CALL insert_item_backpack_procedure(${discountCardWin.id}, 320, 1)`)
                        }
                    }

                    // drop chance lucky coin
                    if (uniqueDropChance <= 15) {
                        random1 = randomNumber(0, usersJoin - 1);
                        luckyCoinWin = users[random1];
                        queryData(`CALL insert_item_backpack_procedure(${luckyCoinWin.id}, 319, 1)`)
                    }
                    
                    // drop chance cutlass
                    if(uniqueDropChance <= 16)
                    if (random3 != random2 && random3 != random1) {
                        cutlassWin = users[random3];
                        let armorySlot = await queryData(`SELECT * FROM armory2 LEFT JOIN item ON (armory2.item_id=item.id) WHERE player_id=${cutlassWin.id} AND item.type_id=9 limit 5`);
                        if (armorySlot.length > 0) {
                            let freeSlot = 0;
                            armorySlot.forEach(element => {
                                if (element.item_id == 0) {
                                    freeSlot = 1;
                                }
                            })
                            if (freeSlot > 0) {
                                queryData(`UPDATE armory2 SET item_id=321 WHERE player_id=${cutlassWin.id} AND item_id=0 LIMIT 1`);
                            } else if (armorySlot.length < 5) {
                                queryData(`INSERT armory2 SET player_id=${cutlassWin.id}, item_id=321`);    
                            }
                        } else {
                            queryData(`INSERT armory2 SET player_id=${cutlassWin.id}, item_id=321`);
                        }
                    }
                }
            }
            let gold = [];
            let playerGold = '';
            users.forEach((element) => {
                if (element != luckyCoinWin && element != discountCardWin && element != cutlassWin) {
                    gold.push(element);
                    if (playerGold) { playerGold += ', ' }
                    playerGold += element.username;
                    queryData(`UPDATE stat SET gold=gold+${goldWin} WHERE player_id=${element.id} LIMIT 1`);
                }
            })
            
            let embed2 = new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 1231235,
                fields: [
                    {
                        name: 'PIRATES HAS BEEN DEFEATED!',
                        value: `**Rewards**\n${luckyCoinWin ? `<:Lucky_Coin:833189137179344897> \`lucky coin\`: ${luckyCoinWin.username}\n` : ''}${discountCardWin ? `<:Discount_Card:833189137141334036> \`discount card\`: ${discountCardWin.username}\n` : ''}${cutlassWin ? `<:Cutlass:833189137213423636> cutlass: ${cutlassWin.username}\n` : ''}${playerGold ? `${emojiCharacter.gold2} \`+${currencyFormat(goldWin)} ${emojiCharacter.gold}\`: ${playerGold}` : ''}`
                    }
                ],
                // footer: {
                //     text: `${textFooter}`
                // }
            });
            let embed3 = new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 1231235,
                fields: [
                    {
                        name: 'Pirates has not been defeated!!!',
                        value: `Nobody got rewards`
                    }
                ],
                // footer: {
                //     text: `${textFooter}`
                // }
            });
            if (playerGold || luckyCoinWin || discountCardWin || cutlassWin) {
                let winRandom = randomNumber(1, 100);
                // console.log(winRandom)
                if (winRandom <= winChance) {
                    message.channel.send(embed2)
                    .catch((err) => {
                        console.log('(pirate2)' + message.author.id + ': ' + errorCode[err.code]);
                    });
                } else {
                    message.channel.send(embed3)
                    .catch((err) => {
                        console.log('(pirate3)' + message.author.id + ': ' + errorCode[err.code]);
                    });
                }
            } else {
                message.channel.send(embed3)
                .catch((err) => {
                    console.log('(pirate4)' + message.author.id + ': ' + errorCode[err.code]);
                });
            }
        })
        //     .catch((err) => {
        //     // console.log('(pirate)' + message.author.id + ': ' + errorCode[err.code]);
        // });
    }, 10000)
}

export default pirate;