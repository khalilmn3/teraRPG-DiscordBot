import queryData from "./helper/query.js";
import { activeCommand, deactiveCommand } from "./helper/setActiveCommand.js";
import Discord from 'discord.js'
import currencyFormat from "./helper/currency.js";
import addExpGold from "./helper/addExp.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import { cooldownMessage } from "./embeddedMessage.js";
import setCooldowns from "./helper/setCooldowns.js";

async function junken(message) {
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
        let isUserRegistered = await queryData(`SELECT id FROM player WHERE id="${player2.id}" && is_active="1" LIMIT 1`);
        if (isUserRegistered.length > 0) {
            if (isUserRegistered[0].is_active === 0) { message.reply(`you can't junken with banned user`); return }
            
            let embed = new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 10115509,
                fields: [{
                    name: `Ready`,
                    value: `Junken pon, check DM and choose your moves, \nresult will shown after both players have chosen.`,
                    inline: false,
                }]
            });
            let junkenResult = {
                player1: '',
                player2: ''
            }
            activeCommand([message.author.id, player2.id]);
            await message.channel.send(`Invite <@${player2.id}> to play junken, react ✅ to accept!`)
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
                                setCooldowns(player1.id, 'junken');
                                setCooldowns(player2.id, 'junken');
                                let dm1 = new Promise(async (resolve, reject) => {
                                    junkenResult.player1 = await play(message.author);
                                    resolve();
                                })
                                let dm2 =  new Promise(async (resolve, reject) => {
                                    junkenResult.player2 = await play(player2);
                                    resolve();
                                })
                                await Promise.all([dm1, dm2]); // wait result
                                let winner;
                                if (junkenResult.player1 === junkenResult.player2) {
                                    winner = 'Draw';
                                } else if (junkenResult.player1 === '✊' && junkenResult.player2 === '✌️') {
                                    winner = message.author;
                                } else if (junkenResult.player2 === '✊' && junkenResult.player1 === '✌️') {
                                    winner = player2;
                                } else if (junkenResult.player1 === '✊' && junkenResult.player2 === '🖐️') {
                                    winner = player2;
                                } else if (junkenResult.player2 === '✊' && junkenResult.player1 === '🖐️') {
                                    winner = message.author;
                                } else if (junkenResult.player1 === '🖐️' && junkenResult.player2 === '✌️') {
                                    winner = player2;
                                } else if (junkenResult.player2 === '🖐️' && junkenResult.player1 === '✌️') {
                                    winner = message.author;
                                } else if (junkenResult.player1 === 0) {
                                    winner = player2;
                                } else if (junkenResult.player2 === 0) {
                                    winner = message.author;
                                }
                                
                                let data = await queryData(`SELECT level, basic_hp, basic_mp, hp, mp, current_experience FROM stat WHERE player_id="${winner.id}" LIMIT 1`);
                                data = data[0]
                                let exp = (50 * Math.pow(data.level, 3) - 150 * Math.pow(data.level, 2) + 400 * (data.level)) / 3 / 20
                                let resultEmbed = new Discord.MessageEmbed({
                                    type: "rich",
                                    description: `Janken **${message.author.username}** vs **${player2.username}**`,
                                    url: null,
                                    color: 10115509,
                                    fields: [{
                                        name: `__Result__`,
                                        value: `${message.author.username} ${junkenResult.player1} --- ${junkenResult.player2} ${player2.username}`,
                                        inline: false,
                                    },{
                                        name: `__Rewards__`,
                                        value: `+${currencyFormat(exp)} EXP`,
                                        inline: false,
                                    }]
                                });
                                message.channel.send(`> <@${winner.id}> Win`, resultEmbed)
                                addExpGold(message, winner, data, exp, 0, data)
                            }
                            deactiveCommand([message.author.id, player2.id])
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
        }
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
            return await message2.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    return reaction.emoji.name;
                })
                .catch(collected => {
                    return 0;
                });
    
        }).catch(function () {
            //Something
        });
}
export default junken;