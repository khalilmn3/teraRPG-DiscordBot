import Discord from 'discord.js';
import config from './config.js';
import db from './db_config.js';
// Agenda 
import Agenda from 'agenda'
import mongoClient from 'mongodb';
const dbRPG = 'mongodb://127.0.0.1:27017';
const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const MongoClient = new mongoClient.MongoClient;
const agenda = new Agenda({ db: { address: mongoConnectionString } });

// LIMITER
const waitingTime = new Set();
// Command
import profile from './js/profile.js';
import hunt from './js/hunt.js';
import work from './js/work.js';
import healingPotion from './js/healingPotion.js';
import backpack from './js/backpack.js';
import tools from './js/tools.js';
import crafting from './js/crafting.js';
import queryData from './js/helper/query.js';
import teleport from './js/teleport.js';
import help from './js/help.js';
import workspace from './js/workspace.js';
import sellItem from './js/sellItem.js';
import coinFlip from './js/coinFlip.js';
import rewards from './js/rewards.js';
import cooldowns from './js/cooldowns.js';
import lottery from './js/lottery.js';
import lotteryWinnerRunSchedule from './js/helper/lotterySchedule.js';
// Discord
const client = new Discord.Client();
const guildMember = new Discord.GuildMember();

client.login(config.BOT_TOKEN);
// Command Prefix
const prefix = "!";
const rpgPrefix = 'rpg ';
const teraRPGPrefix = 'tera ';
client.on('ready', () => {
    client.user.setActivity({
        type: "LISTENING",
        name: "tera help",
    });
    lotterySchedule(client);
})
client.on("message", async function (message) {
    
    const authorID = message.author.id;
    let authorUsername = message.author.username;
    const data = {
        authorID: message.author.id
    };
    if (message.author.bot) {
    
        // if (message.author.id === '172002275412279296') {
        //     console.log(message.content)
        //     console.log(message.embeds)
        //     message.reply(message.content)
        //     message.reply(message.embeds)
        //     return;
        // }
        if (message.author.id === '555955826880413696') {
            if (message.embeds) {
                // if (message.embeds.length > 0) {
                //     console.log('hm');
                //     MongoClient.connect(dbRPG, function (err, db) {
                //         if (err) throw err;
                //         // message.reply(message.embeds);
                //         var dbo = db.db("mydb");
                //         var myobj = { name: "Company Inc", address: "Highway 37" };
                //         if (message.embeds.length > 0) {
                //             dbo.collection('eRPG').insertOne(message.embeds[0], function (err, res) {
                //                 if (err) throw err;
                //                 console.log(message.embeds[0]);
                //                 db.close();
                //             });
                //         }
                //     });
                //     return;
                // }
                // }
                if (message.embeds.length > 0) {
                    if (message.embeds[0].author === undefined || message.embeds[0].author === null) return;
                    const authorName = message.embeds[0].author.name;
                    const authorStatus = authorName.split(' ');
                    if (authorStatus < 1) return;
                
                    let author = [];
                    let iconURL = message.embeds[0].author.iconURL;
                    let authorGenerate = iconURL.split('/');
                    let enchantAuthorId = authorGenerate[4];
                
                    // ENCHANT
                    if (authorStatus[1] === 'enchant') {
                        const textMessage = message.embeds[0].fields[0].name.toLowerCase();
                        const enchantRank = {
                            'normie': 1,
                            'good': 2,
                            'great': 3,
                            'mega': 4,
                            'epic': 5,
                            'hyper': 6,
                            'ultimate': 7,
                            'perfect': 8,
                            'edgy': 9,
                            'ultra-edgy': 10,
                            'omega': 11,
                            'ultra-omega': 12,
                            'godly': 13,
                        }
                        let enchantRankNumMessage = 1;
                        let enchantRankMessage = 'normie';
                        let enchantRankNumAuthor = '';
            
                        let query = "SELECT * FROM user WHERE id='" + enchantAuthorId + "'";
                        db.query(query, async function (err, result) {
                            author = await result[0];
                            enchantRankNumAuthor = await enchantRank[author.enchant_rank];
                            enchantTypeAuthor = await enchantRank[author.enchant_type];
                            // ENCHANT
                            if (author) {
                                if (author.id === enchantAuthorId && author.is_enchant_notify) {
                                    Object.keys(enchantRank).forEach(function (key) {
                                        if (textMessage.includes(key)) {
                                            enchantRankMessage = key;
                                            enchantRankNumMessage = enchantRank[key];
                                        }
                                    });
                                    if (parseFloat(enchantRankNumMessage) >= parseFloat(enchantRankNumAuthor) && textMessage.includes(enchantTypeAuthor)) {
                                        const MutedRole = '797311102383030302';
                    
                                        if (parseFloat(enchantRankNumMessage) === parseFloat(enchantRankNumAuthor)) {
                                            message.channel.send(`You got \`${enchantRankMessage.toUpperCase()}\` enchant you wanted !!! <@${enchantAuthorId}> `);
                                        } else if (parseFloat(enchantRankNumMessage) > parseFloat(enchantRankNumAuthor)) {
                                            message.channel.send(`WOW!!! <@${enchantAuthorId}> got \`${enchantRankMessage.toUpperCase()}\`, it\'s even better than \`${author.enchant_type.toUpperCase()}\`!!!`);
                                        }

                                        message.guild.members.fetch(author.id).then(async (discordUser) => {
                                            await discordUser.roles.set([MutedRole]).then(result => {
                                                channel.send(`You muted for 5 seconds`);
                                                setTimeout(() => {
                                                    message.guild.members.fetch(author.id).then((discordUser) => {
                                                        discordUser.roles.remove([MutedRole]);
                                                    });
                                                }, 5000);
                                            }).catch(error => {
                                                console.log(error)
                                                message.channel.send(
                                                    `> Sorry <@${enchantAuthorId}>, I couldn't mute you because I don't have permission to do that :persevere:.`
                                                );
                                            });
                                        });
                                    }
                                }
                
                                if (err) throw err;
                            }
                        });
                    } else if (authorStatus[1] === 'cooldowns') {
                        // cooldownsReminder('daily', enchantAuthorId);
                        // cooldownsReminder('weekly', enchantAuthorId);
                        // cooldownsReminder('lootbox', enchantAuthorId);
                        // cooldownsReminder('vote', enchantAuthorId);
                        // cooldownsReminder('hunt', enchantAuthorId);
                        // cooldownsReminder('adventure', enchantAuthorId);
                        // cooldownsReminder('training', enchantAuthorId);
                        // cooldownsReminder('duel', enchantAuthorId);
                        // cooldownsReminder('quest', enchantAuthorId);
                        // cooldownsReminder('worker', enchantAuthorId);
                        // cooldownsReminder('horse', enchantAuthorId);
                        // cooldownsReminder('arena', enchantAuthorId);
                        // cooldownsReminder('dungeon', enchantAuthorId);
                    }
                
                    // EPIC GUARD CHECK
                }
                else if (message.content.includes('stop there')) {
                    message.channel.send(':man_police_officer: : ***THERE IS POLICE OFFICER NEARBY !!!***');
                } else if (message.content.includes('you are in the')) {
                    message.channel.send(':man_police_officer: : ***YOU ARE IN THE JAIL NOW !!!***, lets protest before you got ***Death Penalty***');
                }
            }
        }
        return;
        
    };
    // USING PREFIX 
    if (message.content.startsWith(prefix)) {
    
        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        const prefixCommand = prefix + command;
        const body = message.content.replace(prefixCommand, '');

        if (command === "ping") {
            let timeTaken = Date.now() - message.createdTimestamp;
            if (timeTaken < 0) {
                timeTaken = -timeTaken;
            }
            message.reply(`Pong! ${timeTaken}ms.`);
        } else if (command === "math") {
            try {
                const num = eval(body);
                message.reply(num);
            } catch (error) {
                return;
            }
        } else if (command === "mute") {
            const role = '797311102383030302';
            message.member.roles.add(role)
                .then(console.log)
                .catch(console.error);
            setTimeout(() => {
                message.member.roles.remove(role)
                    .then(console.log)
                    .catch(console.error);
            }, 5000)
        } else if (command === 'enchant') {
            if (args.length > 0) {
                if (args[0].toLowerCase() === 'armor' || args[0].toLowerCase() === 'sword') {
                    if (args.length > 1) {
                        if (args[1].toLowerCase() === 'normie' || args[1].toLowerCase() === 'good' || args[1].toLowerCase() === 'great' || args[1].toLowerCase() === 'mega'
                            || args[1].toLowerCase() === 'epic' || args[1].toLowerCase() === 'hyper' || args[1].toLowerCase() === 'ultimate' || args[1].toLowerCase() === 'perfect'
                            || args[1].toLowerCase() === 'edgy' || args[1].toLowerCase() === 'ultra-edgy' || args[1].toLowerCase() === 'omega' || args[1].toLowerCase() === 'ultra-omega' || args[1].toLowerCase() === 'godly') {
                        
                        
                            // INSERT USER
                            let sql = "INSERT INTO user (id, username, is_enchant_notify, enchant_type, enchant_rank) VALUES ('" + authorID + "', '" + authorUsername + "', true, '" + args[0].toLowerCase() + "', '" + args[1].toLowerCase() + "') ON DUPLICATE KEY UPDATE username='" + authorUsername + "', is_enchant_notify=true, enchant_type='" + args[0].toLowerCase() + "', enchant_rank='" + args[1].toLowerCase() + "'";
                            db.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log("1 record inserted");
                            });

                            message.reply(`I'll notify and mute you 5 seconds if you get: \`${args[0].toUpperCase()}, ${args[1].toUpperCase()}\` enchant or better.`);
                        } else {
                            message.reply(`Please provide \`Enchant Rank\` you need. \n > ex: ${prefix}enchant ${args[0]} hyper`);
                        }
                    } else {
                        message.reply(`Please provide \`Enchant Rank\` you need. \n > ex: ${prefix}enchant ${args[0]} hyper`);
                    }
                } else {
                    message.reply(`Please provide \`Sword\` or \`Armor\` then followed by \`Enchant Rank\` you need. \n > ex: ${prefix}enchant armor hyper`);
                }
            }
        }
    }

    // RPG COMMAND
    let content = message.content.toLowerCase();
    if (content.startsWith(rpgPrefix)) {
        const commandBody = message.content.slice(rpgPrefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        const prefixCommand = rpgPrefix + command;
        const body = message.content.replace(prefixCommand, '');
        let delay;
        if (command === 'hunt') {

            agendaRun(authorID, 'rpg hunt', `time for \`RPG ${command.toUpperCase()}\` :ghost: !!!`, '60s');
        
        } else if (command === 'adv' || command === 'adventure') {

            agendaRun(authorID, 'rpg adventure', `time for \`RPG ${command.toUpperCase()}\` :park: !!!`, '1h');

        } else if (command === 'axe' || command === 'chop' || command === 'bowsaw' || command === 'chainsaw'
            || command === 'fish' || command === 'net' || command === 'boat' || command === 'bigboat'
            || command === 'mine' || command === 'pickaxe' || command === 'drill' || command === 'dynamite'
            || command === 'pickup' || command === 'ladder' || command === 'tractor' || command === 'greenhouse') {
            
            agendaRun(authorID, 'rpg work', `time for \`RPG ${command.toUpperCase()}\` :man_farmer: !!!`, '5m');
        } else if (command === 'vote') {

            agendaRun(authorID, 'rpg vote', `time for \`RPG ${command.toUpperCase()}\` :chart_with_downwards_trend: !!!`, '12h');

        } else if (command === 'daily') {

            agendaRun(authorID, 'rpg daily', `time for \`RPG ${command.toUpperCase()}\` !!!`, '1d');

        } else if (command === 'weekly') {

            agendaRun(authorID, 'rpg weekly', `time for \`RPG ${command.toUpperCase()}\` !!!`, '7d');

        } else if (command === 'tr' || command === 'training' || command === 'ultraining') {

            agendaRun(authorID, 'rpg tr', `time for \`RPG ${command.toUpperCase()}\`!!!`, '15m');

        } else if (command === 'duel') {

            agendaRun(authorID, 'rpg duel', `time for \`RPG ${command.toUpperCase()}\`!!!`, '15m');

        } else if (command === 'dungeon') {

            agendaRun(authorID, 'rpg dungeon', `time for \`RPG ${command.toUpperCase()}\`!!!`, '12h');

        } else if (command === 'quest' || command === 'epic quest') {

            agendaRun(authorID, 'rpg quest', `time for \`RPG ${command.toUpperCase()}\`!!!`, '3h');

        } else if (command === 'guild upgrade' || command === 'guild raid') {

            agendaRun(authorID, 'rpg guild', `time for \`RPG ${command.toUpperCase()}\`!!!`, '2h');

        } else if (command === 'duel') {

            agendaRun(authorID, 'rpg duel', `time for \`RPG ${command.toUpperCase()}\`!!!`, '2h');

        } else if (command === 'buy ed lb' || command === 'buy common lootbox' || command === 'buy edgy lootbox' || command === 'buy uncommon lootbox'
            || command === 'buy rare lootbox' || command === 'buy epic lootbox') {

            agendaRun(authorID, 'rpg lootbox', `time for \`RPG ${command.toUpperCase()}\`!!!`, '3h');

        }
    }
    // ================================================================================================================================
    // CO COMMAND
    if (content.startsWith(teraRPGPrefix)) {
        const commandBody = message.content.slice(teraRPGPrefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        const prefixCommand = teraRPGPrefix + command;
        const body = message.content.replace(prefixCommand, '');
        
        // FIND USER REGISTRATION
        let isUserRegistred = await queryData(`SELECT id, zone_id, is_active, stat.gold, stat.level, stat.basic_hp, stat.basic_mp, stat.current_experience FROM player LEFT JOIN stat ON (player.id = stat.player_id) WHERE id=${authorID} LIMIT 1`)
        if (waitingTime.has(message.author.id)) {
            message.reply("Wait at least 1 second before getting typing this again.");
            return;
        }

        if (isUserRegistred.length > 0) {
            if (isUserRegistred[0].is_active) { // Check Banned User  
                if (command === "ping") {
                    let timeTaken = Date.now() - message.createdTimestamp;
                    if (timeTaken < 0) {
                        timeTaken = -timeTaken;
                    }
                    message.channel.send(`Pong! ${timeTaken}ms.`);
                } else if (command === 'help') {
                    help(message, client);
                } else if (command === 'start') {
                    message.reply(`You already registered, type \`${teraRPGPrefix} help\` for more commands`)
                } else if (command === 'p') {
                    profile(message, client, authorID, authorUsername, message.author.avatar, 0, 'Noob');
                } else if (command === 'explore' | command === 'exp') {
                    hunt(message, 0, authorID, authorUsername);
                } else if (command === 'heal') {
                    healingPotion(message, 0, authorID, authorUsername);
                } else if (command === 'mine' || command === 'chop') {
                    work(message, command, isUserRegistred[0].zone_id);
                } else if (command === 'backpack' || command === 'bp') {
                    backpack(message);
                } else if (command === 'workspace' || command === 'ws') {
                    workspace(message);
                } else if (command === 'tool' || command === 'tools') {
                    tools(message);
                } else if (command === 'craft') {
                    crafting(message, args[0], args[1], args[2]);
                } else if (command === 'teleport' || command === 'tel') {
                    teleport(message, args);
                } else if (command === 'sell') {
                    let itemName = commandBody.slice(command.length + 1)
                    // console.log(itemName);
                    sellItem(message, itemName)
                } else if (command === `flip`) {
                    coinFlip(message, args)
                } else if (command === 'vote' || command === 'hourly' || command === 'daily' || command === 'weekly') {
                    rewards(message, command, isUserRegistred[0]);
                } else if (command === 'cd' || command === 'cooldowns' || command === 'rd' || command === 'ready') {
                    cooldowns(message, authorID, command)
                } else if (command === 'lottery')
                    lottery(message, client, args, isUserRegistred[0]);
            }
        } else if (command === 'start') {
            // INSERT USER
            let log = await queryData(`CALL start_procedure("${authorID}","${authorUsername}")`)
            log = log.length > 0 ? log[0][0].log : 0;
            message.reply(`Welcome to teraRPGPrefix, type \`${teraRPGPrefix} hunt\` to begin your hunting`)
            if (log <= 0) return;
            client.channels.cache.get('805591887821799434').send(
                new Discord.MessageEmbed({
                    type: "rich",
                    title: null,
                    description: null,
                    url: null,
                    color: 10115509,
                    fields: [
                        {
                            value: `:bust_in_silhouette: ${message.author.tag} | :id: ${message.author.id}`,
                            name: 'User',
                            inline: true
                        },
                    ],
                    author: {
                        name: ` #${log} | User Registered`,
                        url: null,
                        iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
                        proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
                    },
                    provider: null,
                    timestamp: new Date(),
                })
            )
        } else {
            message.reply(`you are not registered yet, to start playing type \`${teraRPGPrefix}start\``)
        }

        // Adds the user to the set so that they can't type for a second
        waitingTime.add(message.author.id);
        setTimeout(() => {
            // Removes the user from the set after a second
            waitingTime.delete(message.author.id);
        }, 1200);
    }




    // ======================================================================================/=
     // FUNCTION
        async function agendaRun(authorID, command, textMessage, time) {
            agenda.define(`${command} ${authorID}`, async job => {
                await message.channel.send(`<@${authorID}>, ${textMessage}`);
            });
        
            await agenda.start();
            await agenda.cancel({ name: `${command} ${authorID}` });
            await agenda.schedule(time, `${command} ${authorID}`);
        }
    
        
    async function cooldownsReminder(item, authorID) {
        let a = null;
        let b = null;
        switch (item) {
            case "daily":
                a = 0;
                b = 0;
            break;
            case "weekly":
                a = 0;
                b = 1;
            break;
            case "lootbox":
                a = 0;
                b = 2;
            break;
            case "vote":
                a = 0;
                b = 3;
            break;
            case "hunt":
                a = 1;
                b = 0;
            break;
            case "adventure":
                a = 1;
                b = 1;
            break;
            case "training":
                a = 1;
                b = 2;
            break;
            case "duel":
                a = 1;
                b = 3;
            break;
            case "quest":
                a = 1;
                b = 4;
            break;
            case "worker":
                a = 2;
                b = 0;
            break;
            case "horse":
                a = 2;
                b = 1;
            break;
            case "arena":
                a = 2;
                b = 2;
            break;
            case "dungeon":
                a = 2;
                b = 3;
        }
            
            if (message.embeds[0].fields[a].value.split('\n')[b].includes(':clock4:')) {
                let time = message.embeds[0].fields[a].value.split('\n')[b].split('(**').pop().split('**)')[0];
                let dtos = 0;
                let htos = 0;
                let mtos = 0;
                let sec = 0;
                let totalSec = 10;
                if (time.includes('d')) {
                    dtos = parseFloat(time.split(' ')[0]) * 24 * 60 * 60 * 1000;
                    htos = parseFloat(time.split(' ')[1]) * 60 * 60 * 1000;
                    mtos = parseFloat(time.split(' ')[2]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[3]) * 1000;
                    totalSec = dtos + htos + mtos + sec;
                    
                    addReminder(authorID,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                } else if (time.includes('h')) {
                    htos = parseFloat(time.split(' ')[0]) * 60 * 60 * 1000;
                    mtos = parseFloat(time.split(' ')[1]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[2]) * 1000;
                    totalSec = htos + mtos + sec;   

                    addReminder(authorID,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                } else if (time.includes('m')) {
                    mtos = parseFloat(time.split(' ')[0]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[1]) * 1000;
                    totalSec = mtos + sec;
                    
                    addReminder(authorID,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                }
            }
    }

    function rpgProsessReminder(data) {
        message.channel.send(`<@${data.id}>, ${data.textMessage}`);
    }

    async function addReminder(authorID, command, textMessage, delay) {
        await rpgReminder.removeJobs(
            {
                id: authorID,
                textMessage: textMessage,
                command: command
            }
        );
        rpgReminder.re(
            {
                id: authorID,
                textMessage: textMessage,
                command: command
            },
            {delay: delay}
        );
    }

});                                     
async function lotterySchedule(client) {
    agenda.define(`lotteryWinner`, async job => {
        job.repeatEvery('* 9 * * *', {
            skipImmediate: true
        });
        await lotteryWinnerRunSchedule(client);
        await job.save();
    });

    await agenda.start();
    await agenda.cancel({ name: `lotteryWinner` });
    // await agenda.every('tomorrow at 5pm', `lottery`);
    await agenda.schedule('at 9am', `lotteryWinner`);
}

client.login(config.BOT_TOKEN);