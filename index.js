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
import fishing from './js/fishing.js';
import openCrate from './js/openCrate.js';
import invite from './js/invite.js';
import dungeon from './js/dungeon.js';
import { statusCommand } from './js/helper/setActiveCommand.js';
import junken from './js/junken.js';
import report from './js/report.js';
import suggest from './js/suggest.js';
// Discord
const client = new Discord.Client();
const guildMember = new Discord.GuildMember();

client.login(config.BOT_TOKEN);
// Command Prefix
const teraRPGPrefix = 'tera ';
client.on('ready', () => {
    console.log('Ready');
    client.user.setActivity({
        type: "LISTENING",
        name: "tera help",
    });
    lotterySchedule(client);
})
client.on("message", async function (message) {
    
    const authorID = message.author.id;
    let authorUsername = message.author.username;
    let content = message.content.toLowerCase();

    const data = {
        authorID: message.author.id
    };
    if (message.author.bot) {
        return;
    };
    // ================================================================================================================================
    // CO COMMAND
    
    if (content.startsWith(teraRPGPrefix)) {
        const commandBody = message.content.slice(teraRPGPrefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        const prefixCommand = teraRPGPrefix + command;
        const body = message.content.replace(prefixCommand, '');
        
        // FIND USER REGISTRATION
        let isUserRegistred = await queryData(`SELECT id, active_command,  zone_id, is_active, stat.gold, stat.level, stat.basic_hp, stat.basic_mp, stat.current_experience FROM player LEFT JOIN stat ON (player.id = stat.player_id) WHERE id=${authorID} LIMIT 1`)
        if (waitingTime.has(message.author.id)) {
            message.reply("Wait at least 1 second before getting typing this again.");
            return;
        }

        if (isUserRegistred.length > 0) {
            let stat = isUserRegistred[0];
            if (isUserRegistred[0].is_active) { // Check Banned User
                if (isUserRegistred[0].active_command === 1) {
                    message.reply(`you have an active command, end it before processing another!`)
                    return;
                }
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
                    cooldowns(message, command)
                } else if (command === 'lottery') {
                    lottery(message,client,args,stat)
                } else if (command === 'fish') {
                    fishing(message, stat);   
                } else if (command === 'open') {
                    openCrate(message, args);   
                } else if (command === 'invite') {
                    invite(message);   
                } else if (command === "math") {
                    try {
                        const num = eval(body);
                        message.reply(num);
                    } catch (error) {
                        return;
                    }
                } else if (command === 'dungeon') {
                    dungeon(message, stat);
                } else if (command === 'junken') {
                    junken(message, stat);
                } else if (command === 'report') {
                    report(message, client, body);
                } else if (command === 'suggest') {
                    suggest(message, client, body);
                }
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
        job.repeatEvery('24 hours', {
            skipImmediate: true
        });
        await lotteryWinnerRunSchedule(client);
        await job.save();
    });

    await agenda.start();
    await agenda.cancel({ name: `lotteryWinner` });
    await agenda.schedule('at 9am', `lotteryWinner`);
}

client.login(config.BOT_TOKEN);