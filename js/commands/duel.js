import queryData from "../helper/query.js";
import { activeCommand, deactiveCommand } from "../helper/setActiveCommand.js";
import Discord from 'discord.js'
import currencyFormat from "../helper/currency.js";
import addExpGold from "../helper/addExp.js";
import isCommandsReady from "../helper/isCommandsReady.js";
import { cooldownMessage } from "../embeddedMessage.js";
import setCooldowns from "../helper/setCooldowns.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import { getAttack, getDefense, getMaxExp, getMaxHP } from "../helper/getBattleStat.js";
import randomNumber from "../helper/randomNumberWithMinMax.js";
import generateHPEmoji from "../helper/emojiGenerate.js";
import questProgress from "../utils/questProgress.js";

async function duel(message,stat) {
    let player2 = message.mentions.users.first();
    let player1 = message.author;
    if (player2 && player2.id != message.author.id) {
        let cooldowns = await isCommandsReady(player1.id, 'junken');
        let cooldowns2 = await isCommandsReady(player2.id, 'junken');
        if (!cooldowns.isReady) {
            message.channel.send(cooldownMessage(player1.id, player1.username, player1.avatar, 'Duel', cooldowns.waitingTime));
            return;
        }
        if (!cooldowns2.isReady) {
            message.channel.send(cooldownMessage(player2.id, player2.username, player2.avatar, 'Duel', cooldowns2.waitingTime));
            return;
        }

        let isPlayer2Registered = await queryData(`SELECT id, level FROM player LEFT JOIN stat ON (player.id = stat.player_id)  WHERE id="${player2.id}" && is_active="1" LIMIT 1`);
        
        if (isPlayer2Registered.length > 0) {
            let lowLevelPlayer = stat.level > isPlayer2Registered[0].level ? player2 : player1;
            if (isPlayer2Registered[0].is_active === 0) { message.reply(`you can't junken with banned user`); return }
            // if (stat.level < 5 || isPlayer2Registered[0].level < 5) {
            //     message.reply('Both user has to be level 5 above to do junken!');
            //     return;
            // }

            
            let junkenResult = {
                player1: '',
                player2: ''
            }
                activeCommand([message.author.id, player2.id]);
                await message.channel.send(`Challenging <@${player2.id}> to 1vs1 battle, react ✅ to accept!`)
                    .then(function (message2) {
                        message2.react('✅')
                        message2.react('❎')
                        const filter = (reaction, user) => { return ['✅', '❎'].includes(reaction.emoji.name) && user.id === player2.id}
                        message2.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then(async collected => {
                                const reaction = collected.first();
                                if ( reaction.emoji.name == '❎') {
                                    message2.delete();
                                    message2.channel.send('Challenge, declined')
                                } else {
                                    message2.delete();
                                    // Load player data from DB
                                    let playerData = await getPlayerData(player1, player2);
                                    setCooldowns(player1.id, 'junken');
                                    setCooldowns(player2.id, 'junken');
                                    let player1Stat = {
                                        id: player1,
                                        level: playerData[0].level,
                                        attack: getAttack(playerData[0].basic_attack, playerData[0].attack, playerData[0].level, playerData[0].weapon_modifier),
                                        def : getDefense(playerData[0].basic_def, playerData[0].level, playerData[0].helmetDef, playerData[0].shirtDef, playerData[0].pantsDef, playerData[0].bonus_armor_set, playerData[0].helmet_modifier, playerData[0].shirt_modifier, playerData[0].pants_modifier),
                                        hp: playerData[0].hp,
                                        maxHP: getMaxHP(playerData[0].basic_hp, playerData[0].level),
                                        mp: playerData[0].mp,
                                        sub_zone: playerData[0].sub_zone,
                                        rating: playerData[0].points,
                                        buff: 0
                                    }

                                    let player2Stat = {
                                        id: player2,
                                        level: playerData[1].level,
                                        attack: getAttack(playerData[1].basic_attack, playerData[1].attack,  playerData[1].level, playerData[1].weapon_modifier),
                                        def : getDefense(playerData[1].basic_def, playerData[1].level, playerData[1].helmetDef, playerData[1].shirtDef, playerData[1].pantsDef, playerData[1].bonus_armor_set, playerData[1].helmet_modifier, playerData[1].shirt_modifier, playerData[1].pants_modifier),
                                        hp: playerData[1].hp,
                                        maxHP: getMaxHP(playerData[1].basic_hp, playerData[1].level),
                                        mp : playerData[1].mp,
                                        sub_zone: playerData[1].sub_zone,
                                        rating: playerData[1].points
                                    }
                                    let embed = new Discord.MessageEmbed({
                                        type: "rich",
                                        description: null,
                                        url: null,
                                        color: 'RANDOM',
                                        fields: [{
                                            name: `Duel between ${player1.username} vs ${player2.username}`,
                                            value: `Prepare your self!!!`,
                                            inline: false,
                                        },
                                        {
                                            name: `${player1.username}`,
                                            value: `HP: ${player1Stat.hp}/${player1Stat.maxHP}\n${generateHPEmoji(player1Stat.hp, player1Stat.maxHP, true)}\n🎖️Rating: ${player1Stat.rating}\n🗡️Attack: ${Math.floor(player1Stat.attack)}\n🛡️Defence: ${player1Stat.def}`,
                                            inline: true,
                                        },
                                        {
                                            name: `${player2.username}`,
                                            value: `HP: ${player2Stat.hp}/${player2Stat.maxHP}\n${generateHPEmoji(player2Stat.hp, player2Stat.maxHP, true)}\n🎖️Rating: ${player2Stat.rating}\n🗡️Attack: ${Math.floor(player2Stat.attack)}\n🛡️Defence: ${player2Stat.def}`,
                                            inline: true,
                                            }],
                                        footer: {
                                            text: `Battle will begins in 5 minutes`
                                        }
                                    });
                                    message2.channel.send(embed)
                                    var repeat = async function () {
                                        setTimeout(async () => {
                                            let dm1 = new Promise(async (resolve, reject) => {
                                                junkenResult.player1 = await play(player1);
                                                resolve();
                                            })
                                            let dm2 = new Promise(async (resolve, reject) => {
                                                junkenResult.player2 = await play(player2);
                                                resolve();
                                            })
                                                
                                            await Promise.all([dm1, dm2]); // wait result
                                            if (junkenResult.player1 == 0) {
                                                console.log('player1 not responding')
                                            }
                                            if (junkenResult.player2 == 0) {
                                                console.log('player2 not responding')
                                            }
                                            
                                            let combat1Title = '';
                                            let combat1Detail = '';
                                            let combat2Title = '';
                                            let combat2Detail = '';

                                            // '🗡️','🛡️','🤺','🆓','♿'
                                            // Plyaer 1 Combat detail
                                            if (junkenResult.player1 === '🗡️') { // ATTACK
                                                let damage = Math.floor(calculateDamage(player1Stat.attack, player2Stat.def));
                                                combat1Detail = `Basic attack dealt ${damage} dmg`;
                                                let randomCrit = randomNumber(1, 100);
                                                if (randomCrit <= 15) {
                                                    damage = damage * 3; // Apply critical 300%
                                                    combat1Detail = `Critical attack deal ${damage} dmg`;
                                                }
                                                combat1Title = `${player1.username} using basic attack`;
                                                if (junkenResult.player2 === '🛡️') {
                                                    let chance = randomNumber(1, 100)
                                                    // Full counter apply
                                                    if (chance <= 25) {
                                                        combat2Detail = `Full counter apply and reflect 100% damage taken`;
                                                        player1Stat.hp = player1Stat.hp - damage;
                                                    } else {
                                                        combat2Detail = `Reflect 50% damage taken and deal ${Math.floor(damage / 2)} dmg`;
                                                        player2Stat.hp = player2Stat.hp - (damage / 2);
                                                        player1Stat.hp = player1Stat.hp - (damage / 2);
                                                    }
                                                } else if (junkenResult.player2 === '🤺') { // Dodge
                                                    let chance = randomNumber(1, 100);
                                                    if (chance <= 40) {
                                                        combat2Detail = `Successfully dodge the attack and take no damage`;
                                                        if (chance <= 5) {
                                                            let damage = Math.floor(calculateDamage(player2Stat.attack, player2Stat.def));
                                                            player1Stat.hp = player1Stat.hp - damage;
                                                            combat2Detail = `Successfully dodge the attack and using stab deal ${damage} dmg `
                                                        }
                                                        combat1Detail = `Basic attack dealt 0 dmg`;
                                                    } else {
                                                        combat2Detail = `Failed dodge the attack and received ${damage} dmg`;
                                                        player1Stat.hp = player1Stat.hp - damage;
                                                    }
                                                } else {
                                                    player2Stat.hp = player2Stat.hp - damage;
                                                }
                                            } else if (junkenResult.player1 === '🛡️') { // STANCE
                                                let damage = calculateDamage(player2Stat.attack, player1Stat.def) / 2;
                                                // player1Stat.hp = player1Stat.hp - damage;
                                                // player2Stat.hp = player2Stat.hp - damage;
                                                combat1Title = `${player1.username} using stance`;
                                                if (junkenResult.player2 === '🛡️' || junkenResult.player2 === '🤺') {
                                                    combat1Detail = `Nothing happen`;    
                                                }
                                            } else if (junkenResult.player1 === '🤺') { // DODGE
                                                combat1Title = `${player1.username} using dodge`;
                                                if (junkenResult.player2 === '🛡️' || junkenResult.player2 === '🤺') {
                                                    combat1Detail = `Nothing happen`;    
                                                }
                                            } else if (junkenResult.player1 === '♿') { // FLEE
                                                combat1Title = `${player1.username} flee from the battle`;
                                                combat1Detail = `Lost`;
                                            }


                                            // Player 2 Combat detail
                                            if (junkenResult.player2 === '🗡️') { // ATTACK
                                                let damage = Math.floor(calculateDamage(player2Stat.attack, player1Stat.def));
                                                combat2Title = `${player2.username} using basic attack`;
                                                combat2Detail = `Basic attack dealt ${damage} dmg`;
                                                let randomCrit = randomNumber(1, 100);
                                                if (randomCrit <= 15) {
                                                    damage = damage * 3; // Apply critical 300%
                                                    combat2Detail = `Critical attack deal ${damage} dmg`;
                                                }
                                                if (junkenResult.player1 === '🛡️') {
                                                    let chance = randomNumber(1, 100)
                                                    // Full counter apply
                                                    if (chance <= 25) {
                                                        combat1Detail = `Full counter triggered and reflect 100% damage taken`;
                                                        player2Stat.hp = player2Stat.hp - damage;
                                                    } else {
                                                        damage = Math.floor(damage / 2);
                                                        combat1Detail = `Reflect 50% damage taken and deal ${damage} dmg`;
                                                        player2Stat.hp = player2Stat.hp - damage;
                                                        player1Stat.hp = player1Stat.hp - damage;
                                                    }
                                                } else if (junkenResult.player1 === '🤺') { // Dodge
                                                    let chance = randomNumber(1, 100);
                                                    if (chance <= 40) {
                                                        combat1Detail = `Successfully dodge the attack and take no damage`;
                                                        if (chance <= 5) {
                                                            let damage = Math.floor(calculateDamage(player1Stat.attack, player1Stat.def));
                                                            player2Stat.hp = player2Stat.hp - damage;
                                                            combat1Detail = `Successfully dodge the attack and using stab deal ${damage} dmg `
                                                        }
                                                        combat2Detail = `Basic attack dealt 0 dmg`;
                                                    } else {
                                                        combat1Detail = `Failed to dodge the attack and received ${damage} dmg`;
                                                        player2Stat.hp = player2Stat.hp - damage;
                                                    }
                                                } else {
                                                    player1Stat.hp = player1Stat.hp - damage;
                                                }
                                            } else if (junkenResult.player2 === '🛡️') { // STANCE
                                                let damage = calculateDamage(player1Stat.attack, player2Stat.def) / 2;
                                                // player2Stat.hp = player2Stat.hp - damage;
                                                // player1Stat.hp = player1Stat.hp - damage;
                                                combat2Title = `${player2.username} using stance`;
                                                if (junkenResult.player1 === '🛡️' || junkenResult.player1 === '🤺') {
                                                    combat2Detail = `Nothing happen`;    
                                                }
                                                
                                            } else if (junkenResult.player2 === '🤺') { // DODGE
                                                combat2Title = `${player2.username} using dodge`;

                                                if (junkenResult.player1 === '🛡️' || junkenResult.player1 === '🤺') {
                                                    combat2Detail = `Nothing happen`;    
                                                }
                                                // combat2Detail = `you successfully dodge the attack`;
                                            } else if (junkenResult.player2 === '♿') { // FLEE
                                                combat2Title = `${player2.username} flee from the battle`;
                                                combat2Detail = `Lost`;
                                            }
                                            
                                            
                                            player1Stat.hp = player1Stat.hp > 0 ? player1Stat.hp : 0;
                                            player2Stat.hp = player2Stat.hp > 0 ? player2Stat.hp : 0;
                                            if (junkenResult.player1 == 0 && junkenResult.player2 == 0) {
                                                message.channel.send('Both user not responding the DM, Duel cancelled!');
                                                deactiveCommand([player1.id, player2.id])
                                            } else {
                                                let footerText = '';
                                                let status1 = '';
                                                let status2 = '';
                                                let rewards1 = '';
                                                let rewards2 = '';
                                                let rating1 = 0;
                                                let rating2 = 0;
                                                let fieldRewards = null;
                                                if (player2Stat.hp > 0 && player1Stat.hp > 0 && junkenResult.player1 !== '♿' && junkenResult.player2 !== '♿') {
                                                    footerText = `Next round will begins in 5 seconds!`;
                                                    repeat();
                                                } else {
                                                    let pointsWin = 0;
                                                    let rewards = '';
                                                    let exp = 0;
                                                    if (player1Stat.hp <= 0 || junkenResult.player1 === '♿') {
                                                        combat1Title = junkenResult.player1 === '♿' ? `🪦 ${player1.username} has flee away` : `🪦 ${player1.username} has knock down`
                                                        combat1Detail = `and cannot continue the battle`
                                                        status1 = '🪦 '
                                                        status2 = '👑 '
                                                        pointsWin = (player1Stat.level - player2Stat.level) > 5 ? 27 :  (player1Stat.level - player2Stat.level) < -5 ? 19 : 25;
                                                        rating1 = player1Stat.rating - pointsWin;
                                                        rating2 = player2Stat.rating + pointsWin;
                                                        rewards1 = `\n\n**Rating**\n\`${rating1} (-${pointsWin})\``;
                                                        rewards2 = `\n\n**Rating**\n\`${rating2} (+${pointsWin})\``;
                                                        // calculate exp rewards
                                                        exp = getMaxExp(player2Stat.level);
                                                        exp = (exp * 5) / 100;
                                                        exp = exp < 5 ? 5 : exp;
                                                        rewards = `\`+${exp} ${emojiCharacter.exp}\``
                                                        footerText = `${player2.username} has winning the battle!\nRewards: ${rewards}`
                                                        addExpGold(message, player2, playerData[1], exp, 0, null);
                                                        queryData(`INSERT duel SET player_id=${player1.id}, points=${rating1}, battles=1 ON DUPLICATE KEY UPDATE points=${rating1}, battles=battles+1`);
                                                        queryData(`INSERT duel SET player_id=${player2.id}, points=${rating2}, battles=1 ON DUPLICATE KEY UPDATE points=${rating2}, battles=battles+1`);
                                                    } else if (player2Stat.hp <= 0 ||  junkenResult.player2 === '♿') {
                                                        
                                                        combat2Title = junkenResult.player2 === '♿' ? `🪦 ${player2.username} has flee away` : `🪦 ${player2.username} has knock down`
                                                        combat2Detail = `and cannot continue the battle`
                                                        status1 = '👑 '
                                                        status2 = '🪦 '
                                                        pointsWin = (player2Stat.level - player1Stat.level) > 5 ? 27 : (player2Stat.level - player1Stat.level) < -5 ? 19 : 25;
                                                        rating1 = player1Stat.rating + pointsWin;
                                                        rating2 = player2Stat.rating - pointsWin;
                                                        rewards1 = `\n\n**Rating**\n\`${rating1}(+${pointsWin})\``;
                                                        rewards2 = `\n\n**Rating**\n\`${rating2}(-${pointsWin})\``;
                                                        // calculate exp rewards
                                                        exp = getMaxExp(player1Stat.level);
                                                        exp = (exp * 5) / 100;
                                                        exp = exp < 5 ? 5 : exp;
                                                        rewards = `\`+${exp} ${emojiCharacter.exp}\``
                                                        footerText = `${player1.username} has winning the battle!\nRewards: ${rewards}`
                                                        addExpGold(message, player1, playerData[0], exp, 0, null);
                                                        queryData(`INSERT duel SET player_id=${player2.id}, points=${rating1}, battles=1 ON DUPLICATE KEY UPDATE points=${rating1}, battles=battles+1`);
                                                        queryData(`INSERT duel SET player_id=${player1.id}, points=${rating2}, battles=1 ON DUPLICATE KEY UPDATE points=${rating2}, battles=battles+1`);
                                                    }
                                                    fieldRewards = exp > 0 ? { name: '__👑Rewards__', value: rewards } : null;
                                                    deactiveCommand([player1.id, player2.id])
                                                    
                                                    // QUEST PROGRESS
                                                    questProgress(message.author.id, 2);
                                                }
                                                let player1HPBar = generateHPEmoji(player1Stat.hp, player1Stat.maxHP, true)
                                                    let player2HPBar = generateHPEmoji(player2Stat.hp, player2Stat.maxHP, true)
                                                    let resultEmbed = new Discord.MessageEmbed({
                                                        type: "rich",
                                                        description: `Battle **${player1.username}** vs **${player2.username}**`,
                                                        url: null,
                                                        color: 'RANDOM',
                                                        fields: [
                                                            {
                                                                name: combat1Title,
                                                                value: combat1Detail,
                                                                inline: false,
                                                            },
                                                            {
                                                                name: combat2Title,
                                                                value: combat2Detail,
                                                                inline: false,
                                                            },
                                                            {
                                                                name: status1 + player1.username,
                                                                value: `HP: ${player1Stat.hp}/${player1Stat.maxHP}\n${player1HPBar}${rewards1}`,
                                                                inline: true
                                                            },
                                                            {
                                                                name: status2 + player2.username,
                                                                value: `HP: ${player2Stat.hp}/${player2Stat.maxHP}\n${player2HPBar}${rewards2}`,
                                                                inline: true,
                                                            }
                                                        ],
                                                        footer: {
                                                            text: footerText
                                                        }
                                                    });
                                                    message.channel.send(resultEmbed).then((sent) => {
                                                        player1.send(`Check result: https://discord.com/channels/${sent.guild.id}/${sent.channel.id}/${sent.id}`);
                                                        player2.send(`Check result: https://discord.com/channels/${sent.guild.id}/${sent.channel.id}/${sent.id}`);
                                                    })
                                            }
                                        },5000)
                                    }
                                    repeat();
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
                    
            })
        }
    } else {
        message.channel.send(`Correct use \`tera duel @user`);
    }
}

async function play(player, stat, result) {    
    let choose = new Discord.MessageEmbed({
        type: "rich",
        description: null,
        url: null,
        color: 10115509,
        fields: [{
            name: `Choose your move`,
            value: `🗡️ | \`Attack\` 100% attack power and 15% chance to deals critical damage
🛡️ | \`Stance\` reduce 50% damage taken and 25% chance to full counter
🤺 | \`Dodge\` 40% chance to not taken any damage and 5% chance to use \`stab\` deals 50% dmg from opponent attack
♿ | \`Flee\` Flee from current battle`,
            
            inline: false,
        }]
    });
    return await player.send(choose)
        .then(async function (message2) {
            message2.react('🗡️')
            message2.react('🛡️')
            message2.react('🤺')
            // message2.react('🆓')
            message2.react('♿')
            const filter = (reaction, user) => { return ['🗡️','🛡️','🤺','♿'].includes(reaction.emoji.name) && user.id === player.id}
            return await message2.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
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

function calculateDamage(attack, defTarget) {
    let damage = attack - (defTarget * 0.5);
    damage = damage >= 1 ? damage : 1;
    return damage;
}

async function getPlayerData(player1, player2) {
    let playerData = await queryData(`SELECT player.is_active, hp, mp, current_experience, level, basic_hp, basic_mp, basic_attack, basic_def, weapon.attack, zone_id, sub_zone,
             IF(armor1.armor_set_id=armor2.armor_set_id AND armor2.armor_set_id=armor3.armor_set_id, armor_set.bonus_set, 0) as bonus_armor_set,
            IFNULL(armor1.def,0) as helmetDef,
            IFNULL(armor2.def,0) as shirtDef,
            IFNULL(armor3.def,0) as pantsDef,
            IFNULL(modifier_weapon.stat_change,0) as weapon_modifier,
            IFNULL(helmet_modifier.stat_change,0) as helmet_modifier,
            IFNULL(shirt_modifier.stat_change,0) as shirt_modifier,
            IFNULL(pants_modifier.stat_change,0) as pants_modifier,
            IFNULL(duel.points,1500) as points
            FROM stat
            LEFT JOIN duel ON (stat.player_id=duel.player_id)
            LEFT JOIN equipment ON (stat.player_id = equipment.player_id)
            LEFT JOIN armor as armor1 ON (equipment.helmet_id = armor1.id)
            LEFT JOIN armor as armor2 ON (equipment.shirt_id = armor2.id)
            LEFT JOIN armor as armor3 ON (equipment.pants_id = armor3.id)
            LEFT JOIN weapon ON (equipment.weapon_id = weapon.id)
            LEFT JOIN item as itemArmor1 ON (armor1.item_id = itemArmor1.id)
            LEFT JOIN item as itemArmor2 ON (armor2.item_id = itemArmor2.id)
            LEFT JOIN item as itemArmor3 ON (armor3.item_id = itemArmor3.id)
            LEFT JOIN item as itemWeapon ON (weapon.item_id = itemWeapon.id)
            LEFT JOIN modifier_weapon ON (equipment.weapon_modifier_id=modifier_weapon.id)
            LEFT JOIN modifier_armor as helmet_modifier ON (equipment.helmet_modifier_id=helmet_modifier.id)
            LEFT JOIN modifier_armor as shirt_modifier ON (equipment.shirt_modifier_id=shirt_modifier.id)
            LEFT JOIN modifier_armor as pants_modifier ON (equipment.pants_modifier_id=pants_modifier.id) 
            LEFT JOIN armor_set ON (armor1.armor_set_id=armor_set.id)
            LEFT JOIN utility ON (stat.player_id=utility.player_id)
            LEFT JOIN zone ON (stat.zone_id=zone.id)
            LEFT JOIN player ON (stat.player_id = player.id)
            WHERE stat.player_id IN ('${player2.id}', '${player1.id}') ORDER BY FIELD(stat.player_id,'${player1.id}', '${player2.id}') LIMIT 2`);
    
    return playerData;
}

export default duel;