import Discord from 'discord.js';
import config from './config.js';
// Agenda 
import Agenda from 'agenda'
import mongoClient from 'mongodb';
// const dbRPG = 'mongodb://127.0.0.1:27017';
const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
// const MongoClient = new mongoClient.MongoClient;
const agenda = new Agenda({ db: { address: mongoConnectionString } });

//TOP GG
import Topgg  from "@top-gg/sdk";
import express from "express";
import DBL from 'dblapi.js';
import AutoPoster from 'topgg-autoposter';
// https://discord.com/api/webhooks/822314548291698718/4pmafrE03jh1nB8Ee_66WTyPKWC3M_hD-nbL9SZIgYTMl_5adXmo_YB4aqYaxi1mDSVL

// const app = express();
// const webhook = new Topgg.Webhook("Bot123TeraRPG");

// app.post("/dblwebhook", webhook.middleware(), (req, res) => {
//   // req.vote will be your vote object, e.g
//     console.log('kjkjk');
//   console.log(req.vote.user); // 395526710101278721 < user who voted
// });

// app.listen(5555);

//=====================================
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
import voteRewardsSend from './js/voteRewardsSend.js';
import upgrade from './js/upgrade.js';
import ranks from './js/leaderboards.js';
import myCache from './js/cache/leaderboardChace.js';
import market from './js/market.js';
import buy from './js/buy.js';
import deposit from './js/deposit.js';
import shop from './js/shop.js';
import withdraw from './js/withdraw.js';
import bank from './js/bank.js';
import bonus from './js/bonus.js';
// Discord
const client = new Discord.Client();
const ap = AutoPoster(config.DBL_TOKEN, client) // your discord.js or eris client

// optional
ap.on('posted', () => { // ran when succesfully posted
    console.log('Posted stats to top.gg')
  })
const guildMember = new Discord.GuildMember();

client.login(config.BOT_TOKEN);

const dbl = new DBL(config.DBL_TOKEN, { webhookPort: 5555, webhookAuth: '11211' });
dbl.webhook.on('vote', (vote)=>{
    voteRewardsSend(client,vote.user)
    const webhook = new Discord.WebhookClient('822314548291698718', '4pmafrE03jh1nB8Ee_66WTyPKWC3M_hD-nbL9SZIgYTMl_5adXmo_YB4aqYaxi1mDSVL');
    webhook.send(`${vote.user} has voted`)
})
// Command Prefix
const teraRPGPrefix = config.PREFIX;
client.on('ready', () => {
    console.log('Ready');
    if (config.SHOW_ACTIVITY) {
        client.user.setActivity({
            type: "LISTENING",
            name: `${teraRPGPrefix}help`,
        });
    }
    // Reset active command
    queryData(`UPDATE player SET active_command=0`);
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
        const commandBody = message.content.slice(teraRPGPrefix.length).toLowerCase();
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();
        const prefixCommand = teraRPGPrefix + command;
        const body = message.content.replace(prefixCommand, '');
        if (authorID === '668740503075815424') {
            if (command === "repost") {
                message.channel.send(body);
                return;
            } else if (command === "member") {
                let member = await queryData(`SELECT count(*) as totalMember FROM player`);
                // console.log(member[0].totalMember);
                message.channel.send(`total member : ${member[0].totalMember}`);
                return;
            } else if (command === "delete") {
                queryData(`DELETE FROM player WHERE id="${args[0]}" LIMIT 1`);
                
                message.delete();
                message.channel.send(`Player <@${args[0]}> has been delete from database`);
                return;
            } else if (command === "ban") {
                queryData(`UPDATE player SET is_active="0" WHERE id="${args[0]}" LIMIT 1`);
                
                message.delete();
                message.channel.send(`Player <@${args[0]}> has been banned`);
                return;
            } else if (command === "unban") {
                queryData(`UPDATE player SET is_active="1" WHERE id="${args[0]}" LIMIT 1`);

                message.delete();
                console.log(args);
                message.channel.send(`Player <@${args[0]}> unbanned`);
                return;
            } else if (command === "level") {
                if (!isNaN(args[0])) {
                    queryData(`UPDATE stat SET level="${args[0]}" WHERE player_id="${args[1]}" LIMIT 1`);

                    message.delete();
                    console.log(args);
                    message.channel.send(`Player <@${args[1]}>'s level has been set`);
                }
                return;
            } else if (command === "math") {
                try {
                    const num = eval(body);
                    message.reply(num);
                } catch (error) {
                    return;
                }
            } 
        }
        if (command != '') {
            // FIND USER REGISTRATION
            let isUserRegistred = await queryData(`SELECT id, active_command,  zone_id, is_active, stat.gold, stat.level, stat.basic_hp, stat.basic_mp, stat.current_experience FROM player LEFT JOIN stat ON (player.id = stat.player_id) WHERE id=${authorID} LIMIT 1`)
            if (waitingTime.has(message.author.id)) {
                message.reply("Wait at least 1 second before getting typing this again.");
                return;
            }
            if (isUserRegistred.length > 0) {
                let stat = isUserRegistred[0];
                if (isUserRegistred[0].is_active) { // Check Banned User
                    let configuration = await queryData(`SELECT value FROM configuration WHERE name="is_prepare_maintenance" LIMIT 1`);
                    let prepareMaintenance = configuration.length > 0 ? configuration[0].value : false;
                    if (isUserRegistred[0].active_command === 1) {
                        message.reply(`you have an active command, end it before processing another!`)
                        return;
                    }
                    if (prepareMaintenance && authorID !== '668740503075815424') {
                        message.channel.send('🛠️ | Bot is preparing for maintenance...!');
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
                    } else if (command === 'p' | command === 'profile') {
                        profile(message, client, authorID, message.author.avatar, args[0]);
                    } else if (command === 'explore' | command === 'exp') {
                        hunt(message, 0, authorID, authorUsername);
                    } else if (command === 'heal') {
                        healingPotion(message, 0, authorID, authorUsername);
                    } else if (command === 'mine' || command === 'chop') {
                        work(message, command, isUserRegistred[0].zone_id);
                    } else if (command === 'backpack' || command === 'bp') {
                        backpack(message, args[0]);
                    } else if (command === 'workspace' || command === 'ws') {
                        workspace(message);
                    } else if (command === 'tool' || command === 'tools') {
                        tools(message, args[0]);
                    } else if (command === 'craft') {
                        crafting(message, args[0], args[1], args[2]);
                    } else if (command === 'teleport' || command === 'tel') {
                        teleport(message, args);
                    } else if (command === 'sell') {
                        let itemName = commandBody.slice(command.length + 1)
                        // console.log(itemName);
                        sellItem(message, itemName)
                    } else if (command === `cf`) {
                        coinFlip(message, args)
                    } else if (command === 'vote' || command === 'hourly' || command === 'daily' || command === 'weekly') {
                        rewards(message, command, isUserRegistred[0]);
                    } else if (command === 'cd' || command === 'cooldowns' || command === 'rd' || command === 'ready') {
                        cooldowns(message, command)
                    } else if (command === 'lottery') {
                        lottery(message, client, args, stat)
                    } else if (command === 'fish') {
                        fishing(message, stat);
                    } else if (command === 'open') {
                        openCrate(message, args);
                    } else if (command === 'invite') {
                        invite(message);
                    } else if (command === 'dungeon') {
                        dungeon(message, stat);
                    } else if (command === 'junken') {
                        junken(message, stat);
                    } else if (command === 'report') {
                        report(message, client, body);
                    } else if (command === 'suggest') {
                        suggest(message, client, body);
                    } else if (command === 'upgrade') {
                        upgrade(message, args[0]);
                    } else if (command === 'ranks') {
                        ranks(message, args[0]);
                    } else if (command === 'market') {
                        market(message);
                    } else if (command === 'buy') {
                        buy(message, args[0], args[1], args[2]);
                    } else if (command === 'deposit') {
                        deposit(message, args[0]);
                    } else if (command === 'withdraw' || command === 'wd') {
                        withdraw(message, args[0]);
                    } else if (command === 'bank') {
                        bank(message);
                    } else if (command === 'booster') {
                        bonus(message);
                    }
                }
            } else if (command === 'start') {
                // INSERT USER
                let log = await queryData(`CALL start_procedure("${authorID}","${message.author.tag}")`)
                log = log.length > 0 ? log[0][0].log : 0;
                message.reply(`Welcome to teraRPG, type \`${teraRPGPrefix}exp\` to begin your hunting\nYou can also see other commands with \`${teraRPGPrefix}help\``)
                if (log <= 0) return;
                client.channels.cache.get('818360247647076382').send(
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