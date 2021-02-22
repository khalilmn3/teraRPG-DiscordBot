import queryData from "./helper/query.js";
import { activeCommand, deactiveCommand } from "./helper/setActiveCommand.js";
import Discord from 'discord.js'
import currencyFormat from "./helper/currency.js";
import addExpGold from "./helper/addExp.js";
import isCommandsReady from "./helper/isCommandsReady.js";
import { cooldownMessage } from "./embeddedMessage.js";
import setCooldowns from "./helper/setCooldowns.js";

async function ladder(message) {
    let player2 = message.mentions.users.first();
    let player1 = message.author;
    if (player2 && player2.id != message.author.id) {
        let cooldowns = await isCommandsReady(player1.id, 'ladder');
        let cooldowns2 = await isCommandsReady(player2.id, 'ladder');
        if (!cooldowns.isReady) {
            message.channel.send(cooldownMessage(player1.id, player1.username, player1.avatar, 'Ladder', cooldowns.waitingTime));
            return;
        }
        if (!cooldowns2.isReady) {
            message.channel.send(cooldownMessage(player2.id, player2.username, player2.avatar, 'Ladder', cooldowns2.waitingTime));
            return;
        }
        let isUserRegistered = await queryData(`SELECT id FROM player WHERE id="${player2.id}" && is_active="1" LIMIT 1`);
        if (isUserRegistered.length > 0) {
            if (isUserRegistered[0].is_active === 0) { message.reply(`you can't ladder with banned user`); return }
            
            let embed = new Discord.MessageEmbed({
                type: "rich",
                description: null,
                url: null,
                color: 10115509,
                fields: [{
                    name: `Ready`,
                    value: `Ladder pon, check DM and choose your moves, \nresult will shown after both players have chosen.`,
                    inline: false,
                }]
            });
            let junkenResult = {
                player1: '',
                player2: ''
            }
            activeCommand([message.author.id, player2.id]);
            await message.channel.send(`Invite <@${player2.id}> to play ladder, react ✅ to accept!`)
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
                                setCooldowns(player1.id, 'ladder');
                                setCooldowns(player2.id, 'ladder');
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
            message2.react(':one:')
            message2.react(':two:')
            message2.react(':three:')
            message2.react('🔀')
            message2.react('⏭️')
            message2.react('🏃‍♂️')
            const filter = (reaction, user) => { return [':one:',':two:',':three:', '🔀', '⏭️', '🏃‍♂️'].includes(reaction.emoji.name) && user.id === player.id}
            return await message2.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name === ':one:') {
                        
                    } else if (reaction.emoji.name === ':two:') {
                        
                    } else if (reaction.emoji.name === ':three:') {
                        
                    } else if (reaction.emoji.name === '🔀') {
                        
                    } else if (reaction.emoji.name === '⏭️') {
                        
                    } else {

                    }
                    return reaction.emoji.name;
                })
                .catch(collected => {
                    return 0;
                });
    
        }).catch(function () {
            //Something
        });
}
async function status(msg, player1Stat, player2Stat, maxPlayer1Stat, maxPlayer2Stat, bossStat, maxBossStat, player, turnX) {
    let turn = '';
    let playerId = '';
    let player1 = player1Stat.id;
    let player2 = player2Stat.id;
    let commandList = [];
    if (player === 1) {
        turn = `> [Fighter] - <@${player1.id}> turn`;
        playerId = player1.id
        commandList = ['slash', 'stance']
    } else if (player === 2) {
        turn = `> [Support] - <@${player2.id}> turn`;
        playerId = player2.id
        commandList = ['heal', 'great heal', 'buff']
    }
    let commandMsg = new Discord.MessageEmbed({
        type: "rich",
        color: 10115509,
        fields: [{
            name: 'Commands list',
            value: `\`\`\`Fighter Command \n- Slash | 100% Att \n- Stance | Reflect 50% damage taken \nSupport Command\n- Heal | HP +100% Att \n- Great Heal | HP +200% Att\n- Buff | Fighter Att +50%\`\`\``,
            inline: false,
        }],
    })
    const filter = (response) => {
        return commandList.some(answer => answer.toLowerCase() === response.content.toLowerCase() && [playerId].includes(response.author.id));
    };
    return await msg.channel.send(turn, commandMsg).then(async () => {
        return await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ['time']
        })
            .then(message => {
                message = message.first();
                let dmgToBoss = 0;
                let commandMessageLog = ``;
                let heal = 0;
                let dgmToPlayer1 = damage(bossStat.attack, player1Stat.def);
                let dgmToPlayer2 = damage(bossStat.attack, player2Stat.def);
                if (message.content.toLowerCase() == 'slash' || message.content.toLowerCase() == 'stance') {
                    dgmToPlayer1 = message.content.toLowerCase() == 'stance' ? dgmToPlayer1 - (dgmToPlayer1 * 50 / 100) : dgmToPlayer1;
                    dgmToPlayer2 = message.content.toLowerCase() == 'stance' ? dgmToPlayer2 - (dgmToPlayer2 * 50 / 100) : dgmToPlayer2;
                    player1Stat.hp = (player1Stat.hp - dgmToPlayer1) > 0 ? player1Stat.hp - dgmToPlayer1 : 0;
                    player2Stat.hp = (player2Stat.hp - dgmToPlayer2) > 0 ? player2Stat.hp - dgmToPlayer2 : 0
                    player1Stat.mp = (player1Stat.mp - 20) >= 0 ? (player1Stat.mp - 20) : 0;
                    let player1DeadMessage = player1Stat.hp <= 0 ? `\n☠️ **${player1.username}** has died` : '';
                    let player2DeadMessage = player2Stat.hp <= 0 ? `\n☠️ **${player2.username}** has died` : '';
                    let dmgBossMessage = `\n💥 ${bossStat.name} using stomp deals total ${dgmToPlayer1 + dgmToPlayer2} dmg to all players`;
                    if (player1Stat.mp >= 0) {
                        dmgToBoss = damage(parseInt(player1Stat.attack) + parseInt(player1Stat.buff), bossStat.def);
                        dmgToBoss = message.content.toLowerCase() == 'stance' ? dmgToBoss - (dmgToBoss * 50 / 100) : dmgToBoss; // reduce damage to boss
                        let dmgDealMessage = message.content.toLowerCase() == 'slash' ? `\n🗡️ ${message.author.username} using slash, deals ${dmgToBoss} dmg to ${bossStat.name} ` : `\n🛡️ ${message.author.username} using stance, reflect damage taken by ${dgmToPlayer1} [50%] dmg  `
                        bossStat.hp = (bossStat.hp - dmgToBoss) > 0 ? bossStat.hp - dmgToBoss : 0;
                        player1Stat.buff = 0;
                        if (message.content.toLowerCase() == 'stance') {
                            if (bossStat.hp > 0) {
                                dmgBossMessage = bossStat.hp > 0 ? dmgBossMessage : `\n☠️ ${bossStat.name} has been defeated`;
                                commandMessageLog = `__⚔️**Battle log**⚔️__${dmgBossMessage}${dmgDealMessage}${player2DeadMessage}${player1DeadMessage}`;
                            } else {
                                commandMessageLog = `__⚔️**Battle log**⚔️__${dmgBossMessage}${dmgDealMessage}${player2DeadMessage}${player1DeadMessage}\n☠️ ${bossStat.name} has been defeated`;
                            }
                        } else {
                            dmgBossMessage = bossStat.hp > 0 ? dmgBossMessage : `\n☠️ ${bossStat.name} has been defeated`;
                            commandMessageLog = `__⚔️**Battle log**⚔️__${dmgDealMessage}${dmgBossMessage}${player2DeadMessage}${player1DeadMessage}`;
                        }
                    } else {
                        commandMessageLog = `__⚔️**Battle log**⚔️__\n🗡️**${message.author.username}** don't have enough **MP** to **Fight**\n💥 ${bossStat.name} using stomp deals total ${dgmToPlayer1 + dgmToPlayer2} dmg to all players${player2DeadMessage}${player1DeadMessage}`
                    }
                    
                } else if (message.content.toLowerCase() == 'heal' || message.content.toLowerCase() == 'great heal' || message.content.toLowerCase() == 'buff') {
                    if (player2Stat.mp >= 0) {
                        let attackPercent = message.content.toLowerCase() == 'heal' ? 100 : 200;
                        let spellMessage = '';
                        if (message.content.toLowerCase() == 'great heal') {
                            dgmToPlayer1 = dgmToPlayer1 - dgmToPlayer1 * 50 / 100;
                            dgmToPlayer2 = dgmToPlayer2 - dgmToPlayer2 * 50 / 100;
                            spellMessage = ` restore ${heal} HP to all players and reduce damage taken by 50%`
                        }
                        if (message.content.toLowerCase() == 'buff') {
                            player1Stat.buff = player1Stat.attack * 50 / 100;
                            spellMessage = ` increase fighter attack by 50% in next turn`;
                        }
                        if(message.content.toLowerCase() == 'heal' || message.content.toLowerCase() == 'great heal') {
                            heal = (player2Stat.attack * attackPercent) / 100;
                            player1Stat.hp = player1Stat.hp + heal <= maxPlayer1Stat.hp ? player1Stat.hp + heal : maxPlayer1Stat.hp;
                            player2Stat.hp = player2Stat.hp + heal <= maxPlayer2Stat.hp ? player2Stat.hp + heal : maxPlayer2Stat.hp;
                            spellMessage = ` restore ${heal} HP to all players`;
                        }
                        player1Stat.hp = (player1Stat.hp - dgmToPlayer1) > 0 ? player1Stat.hp - dgmToPlayer1 : 0;
                        player2Stat.hp = (player2Stat.hp - dgmToPlayer2) > 0 ? player2Stat.hp - dgmToPlayer2 : 0;
                        player2Stat.mp = (player2Stat.mp - 20) >= 0 ? (player2Stat.mp - 20) : 0;
                        let player1DeadMessage = player1Stat.hp <= 0 ? `\n🪦 **${player1.username}** has died` : '';
                        let player2DeadMessage = player2Stat.hp <= 0 ? `\n🪦 **${player2.username}** has died` : '';
                        commandMessageLog = `__⚔️**Battle log**⚔️__\n💗 **${message.author.username}** using **${message.content.toLowerCase()} spell**,${spellMessage}\n💥 ${bossStat.name} using stomp deals total ${dgmToPlayer1 + dgmToPlayer2} dmg to all players${player2DeadMessage}${player1DeadMessage}`
                    } else {
                        let player1DeadMessage = player1Stat.hp <= 0 ? `\n🪦 **${player1.username}** has died` : '';
                        let player2DeadMessage = player2Stat.hp <= 0 ? `\n🪦 **${player2.username}** has died` : '';
                        commandMessageLog = `__⚔️**Battle log**⚔️__\n**${message.author.username}** don't have enough **MP** to **Heal**\n💥 ${bossStat.name} using stomp deals total ${dgmToPlayer1 + dgmToPlayer2} dmg to all players${player2DeadMessage}${player1DeadMessage}`
                    }
                    
                }
                let statusMessage =  new Discord.MessageEmbed({
                    type: "rich",
                    description: `**Dungeon Boss**`,
                    color: 10115509,
                    fields: [{
                        name: `${bossStat.emoji} ${bossStat.name}`,
                        value: `${generateIcon(bossStat.hp,maxBossStat.hp, true)} ${bossStat.hp}/${maxBossStat.hp} 💗\n--------------------------------------------------------\n**${player1Stat.id.username}** [lvl.${player1Stat.level}]\n${generateIcon(player1Stat.hp,maxPlayer1Stat.hp, true)}  HP ${player1Stat.hp}/${maxPlayer1Stat.hp} 💗 \n${generateIcon(player1Stat.mp,maxPlayer1Stat.mp, false)} MP ${player1Stat.mp}/${maxPlayer1Stat.mp} \n**${player2Stat.id.username}** [lvl.${player2Stat.level}]\n${generateIcon(player2Stat.hp,maxPlayer2Stat.hp, true)}  HP ${player2Stat.hp}/${maxPlayer2Stat.hp} 💗\n${generateIcon(player2Stat.mp,maxPlayer2Stat.mp, false)} MP ${player2Stat.mp}/${maxPlayer2Stat.mp}\n--------------------------------------------------------\n${commandMessageLog}`,
                        inline: false,
                    }],
                    footer: {
                        text: `Turn ${turnX}`,
                        iconURL: null,
                        proxyIconURL: null,
                    },
                })
                message.channel.send(statusMessage)
                return 1;
            })
            .catch(errors => {
                
                return 0;
            });
    })
}
export default ladder;