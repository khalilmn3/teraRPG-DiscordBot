import queryData from "./helper/query.js";
import { activeCommand, deactiveCommand } from "./helper/setActiveCommand.js";
import Discord from 'discord.js'
import currencyFormat from "./helper/currency.js";
import addExpGold from "./helper/addExp.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import { cooldownMessage } from "./embeddedMessage.js";
import setCooldowns from "./helper/setCooldowns.js";
import emojiCharacter from "./utils/emojiCharacter.js";
import errorCode from "./utils/errorCode.js";

async function junken(message,stat) {
    let player2 = message.mentions.users.first();
    let player1 = message.author;
    if (player2 && player2.id != message.author.id) {
        let cooldowns = await isCommandsReady(player1.id, 'junken');
        let cooldowns2 = await isCommandsReady(player2.id, 'junken');
        if (!cooldowns.isReady) {
            message.channel.send(cooldownMessage(player1.id, player1.username, player1.avatar, 'Junken', cooldowns.waitingTime));
            return;
        }
        if (!cooldowns2.isReady) {
            message.channel.send(cooldownMessage(player2.id, player2.username, player2.avatar, 'Junken', cooldowns2.waitingTime));
            return;
        }

        let isPlayer2Registered = await queryData(`SELECT id, level FROM player LEFT JOIN stat ON (player.id = stat.player_id)  WHERE id="${player2.id}" && is_active="1" LIMIT 1`);
        
        if (isPlayer2Registered.length > 0) {
            let lowLevelPlayer = stat.level > isPlayer2Registered[0].level ? player2 : player1;
            if (isPlayer2Registered[0].is_active === 0) { message.reply(`you can't junken with banned user`); return }
            if (stat.level < 5 || isPlayer2Registered[0].level < 5) {
                message.reply('Both user has to be level 5 above to do junken!');
                return;
            }
            let embed = new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 'RANDOM',
                fields: [{
                    name: `Ready, round will begin in 5 seconds`,
                    value: `Junken pon, check DM and choose your moves, \nresult will shown after both players have chosen.`,
                    inline: false,
                }]
            });
            let junkenResult = {
                player1: '',
                player2: ''
            }
            let embedRound = new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 10115509,
                fields: [{
                    name: `Round`,
                    value: `How many round do you want\n ${emojiCharacter[1]} round\n${emojiCharacter[3]} round\n${emojiCharacter[5]} round`,
                    inline: false,
                }]
            });
            let round = 1;
            activeCommand([player1.id]);
            await message.channel.send(embedRound).then((msgRound)=>{
                msgRound.react(emojiCharacter[1])
                msgRound.react(emojiCharacter[3])
                msgRound.react(emojiCharacter[5])
                const filterRound = (reaction, user) => { return [emojiCharacter[1],emojiCharacter[3], emojiCharacter[5]].includes(reaction.emoji.name) && user.id === player1.id }
                msgRound.awaitReactions(filterRound, { max: 1, time: 15000, errors: ['time'] })
                    .then(async collected => {
                        const reactionRound = await collected.first();
                        if (reactionRound.emoji.name == emojiCharacter[1]) {
                            round = 1;
                        } else if (reactionRound.emoji.name == emojiCharacter[3]) {
                            round = 3;
                        } else if (reactionRound.emoji.name == emojiCharacter[5]) {
                            round = 5;
                        }
                        msgRound.delete();
                activeCommand([message.author.id, player2.id]);
                await message.channel.send(`Invite <@${player2.id}> to play ${round} round of junken, react ✅ to accept!`)
                    .then(function (message2) {
                        message2.react('✅')
                        message2.react('❎')
                        const filter = (reaction, user) => { return ['✅', '❎'].includes(reaction.emoji.name) && user.id === player2.id}
                        message2.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then(async collected => {
                                const reaction = collected.first();
                                if ( reaction.emoji.name == '❎') {
                                    message2.delete();
                                    message2.channel.send('declined')
                                } else {
                                    message2.delete();
                                    message2.channel.send(embed)
                                    
                                    let winner;
                                    let player1winCount = 0;
                                    let player2winCount = 0;
                                    let count = 1;
                                    var myFunc01 = async function () {
                                        setTimeout(async function () {
                                            let dm1 = new Promise(async (resolve, reject) => {
                                                junkenResult.player1 = await play(message.author);
                                                resolve();
                                            })
                                            let dm2 = new Promise(async (resolve, reject) => {
                                                junkenResult.player2 = await play(player2);
                                                resolve();
                                            })
                                                
                                            await Promise.all([dm1, dm2]); // wait result
                                            
                                            if (junkenResult.player1 == 1 || junkenResult.player2 == 1) {
                                                deactiveCommand([player1.id, player2.id])
                                                return;
                                            }
                                            if (count == 1) {
                                                setCooldowns(player1.id, 'junken');
                                                setCooldowns(player2.id, 'junken');
                                            }
                                            if (junkenResult.player1 == 0) {
                                                console.log('player1 not responding')
                                            }
                                            if (junkenResult.player2 == 0) {
                                                console.log('player2 not responding')
                                            }
                                            if (junkenResult.player1 === junkenResult.player2) {
                                                winner = 'Draw';
                                                // player1winCount++;
                                            } else if (junkenResult.player1 === '✊' && junkenResult.player2 === '✌️') {
                                                winner = message.author;
                                                player1winCount++;
                                            } else if (junkenResult.player2 === '✊' && junkenResult.player1 === '✌️') {
                                                winner = player2;
                                                player2winCount++;
                                            } else if (junkenResult.player1 === '✊' && junkenResult.player2 === '🖐️') {
                                                winner = player2;
                                                player2winCount++;
                                            } else if (junkenResult.player2 === '✊' && junkenResult.player1 === '🖐️') {
                                                winner = message.author;
                                                player1winCount++;
                                            } else if (junkenResult.player1 === '🖐️' && junkenResult.player2 === '✌️') {
                                                winner = player2;
                                                player2winCount++;
                                            } else if (junkenResult.player2 === '🖐️' && junkenResult.player1 === '✌️') {
                                                winner = message.author;
                                                player1winCount++;
                                            } else if (junkenResult.player1 === 0) {
                                                winner = player2;
                                                player2winCount++;
                                            } else if (junkenResult.player2 === 0) {
                                                winner = message.author;
                                                player1winCount++;
                                            }
                                            
                                            let winResult = winner == 'Draw' ? `> Round ${count} : **Draw**` : `Round ${count} winner : <@${winner.id}>`;
                                            if (junkenResult.player1 == 0 && junkenResult.player2 == 0) {
                                                message.channel.send('Both user not responding the DM, Junken cancelled!');
                                                deactiveCommand([player1.id, player2.id])
                                            } else {
                                                if (count < round) {
                                                    let resultEmbed = new Discord.MessageEmbed({
                                                        type: "rich",
                                                        description: `Janken **${message.author.username}** vs **${player2.username}**`,
                                                        url: null,
                                                        color: 'RANDOM',
                                                        fields: [{
                                                            name: `🪧__Round ${count} Result__`,
                                                            value: `[${player1winCount}] \`${message.author.username} ${junkenResult.player1} --- ${junkenResult.player2} ${player2.username}\` [${player2winCount}]`,
                                                            inline: false,
                                                        }, {
                                                            name: `__Next Round begin in 5 seconds__`,
                                                            value: `Junken pon, check DM and choose your moves, \nresult will shown after both players have chosen.`,
                                                            inline: false,
                                                        }]
                                                    });
                                                    message.channel.send(winResult, resultEmbed).then((sent) => {
                                                        player1.send(`Check result: https://discord.com/channels/${sent.guild.id}/${sent.channel.id}/${sent.id}`);
                                                        player2.send(`Check result: https://discord.com/channels/${sent.guild.id}/${sent.channel.id}/${sent.id}`);
                                                    })
                                                    myFunc01();
                                                } else {
                                                    let finalWinner = player1winCount > player2winCount ? player1 : player1winCount < player2winCount ? player2 : lowLevelPlayer;
                                                    let finalLooser = finalWinner == player1 ? player2 : player1;
                                                    console.log(lowLevelPlayer);
                                                    let data = await queryData(`SELECT level, basic_hp, basic_mp, hp, mp, current_experience FROM stat WHERE player_id="${finalWinner.id}" LIMIT 1`);
                                                    data = data[0]
                                                    let exp = (50 * Math.pow(data.level, 3) - 150 * Math.pow(data.level, 2) + 400 * (data.level)) / 3 / 20
                                                    let winnerTag = `\`${finalWinner.tag}\``;
                                                    let rewards = `\`+${currencyFormat(exp)} exp\``;
                                                    // DRAW RESULT
                                                    if (player1winCount == player2winCount) {
                                                        exp = exp / 2;
                                                        winnerTag = '\`Draw\`'
                                                        rewards = `\`+${currencyFormat(exp)} exp each player\``;
                                                        let data1 = await queryData(`SELECT level, basic_hp, basic_mp, hp, mp, current_experience FROM stat WHERE player_id="${player1.id}" LIMIT 1`);
                                                        let data2 = await queryData(`SELECT level, basic_hp, basic_mp, hp, mp, current_experience FROM stat WHERE player_id="${player2.id}" LIMIT 1`);
                                                        
                                                        addExpGold(message, player1, data1, exp, 0, data1)
                                                        addExpGold(message, player2, data2, exp, 0, data2)
                                                    } else { 
                                                        addExpGold(message, finalWinner, data, exp, 0, data)
                                                        
                                                        queryData(`INSERT junken SET win=win+1, player_id="${finalWinner.id}" ON DUPLICATE KEY UPDATE win=win+1`)
                                                        queryData(`INSERT junken SET lose=lose+1, player_id="${finalLooser.id}" ON DUPLICATE KEY UPDATE lose=lose+1`)
                                                    }
                                                    let finalResultEmbed = new Discord.MessageEmbed({
                                                        type: "rich",
                                                        description: `Janken **${message.author.username}** vs **${player2.username}**`,
                                                        url: null,
                                                        color: 'RANDOM',
                                                        fields: [{
                                                            name: `🪧__Final Result__`,
                                                            value: `[${player1winCount}] \`${message.author.username} ${junkenResult.player1} --- ${junkenResult.player2} ${player2.username}\` [${player2winCount}]`,
                                                            inline: false,
                                                        },
                                                        {
                                                            name: `\\🏆 __Winner__`,
                                                            value: winnerTag,
                                                            inline: false,
                                                        }
                                                            , {
                                                            name: `__Rewards__`,
                                                            value: rewards,
                                                            inline: false,
                                                        }]
                                                    });
                                                    message.channel.send(winResult, finalResultEmbed).then((sent) => {
                                                        player1.send(`Check result: https://discord.com/channels/${sent.guild.id}/${sent.channel.id}/${sent.id}`);
                                                        player2.send(`Check result: https://discord.com/channels/${sent.guild.id}/${sent.channel.id}/${sent.id}`);
                                                    })
                                                    deactiveCommand([player1.id, player2.id])
                                                }
                                                count++
                                            }
                                        }, 5000)
                                    }
                                    myFunc01();
                                }
                            })
                            .catch(collected => {
                                message2.delete();
                                message2.channel.send('Timeout, cancelled')
                                deactiveCommand([message.author.id, player2.id])
                            });
                
                    }).catch(function () {
                        deactiveCommand([message.author.id, player2.id])
                        //Something
                    });
                })
            }).catch((err) => {
                console.log('(junken)'+message.author.id+': '+errorCode[err.code]);
            });
        }
    } else {
        message.channel.send(`Correct use \`tera junken @user`);
    }
}

async function play(player, result) {    
    let choose = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [{
            name: `Choose your move`,
            value: `✊ Rock \n🖐️ Paper \n✌️ Scissors`,
            inline: false,
        }]
    });
    return await player.send(choose)
        .then(async function (message2) {
            message2.react('✊')
            message2.react('🖐️')
            message2.react('✌️')
            const filter = (reaction, user) => { return ['✊','🖐️','✌️'].includes(reaction.emoji.name) && user.id === player.id}
            return await message2.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    return reaction.emoji.name;
                })
                .catch(collected => {
                    return 0;
                });
    
        }).catch((err) => {
            console.log('(junken)' + player.id + ': ' + errorCode[err.code]);
            message.channel.send(`${emojiCharacter.noEntry} | Duel cancelled,cannot send DM to user <@${player.id}>\n **Make sure to not:** \n- Blocked the bot.\n- Disabled dms in the privacy settings. `)
            return 1;
        });
}
export default junken;