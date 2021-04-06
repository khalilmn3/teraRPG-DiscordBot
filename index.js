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
import hunt from './js/commands/hunt.js';
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
import reforge from './js/reforge.js';
import log from './js/helper/logs.js';
import give from './js/adminCommands/giveItem.js';
import armory from './js/commands/armory.js';
import unOrEquip from './js/commands/un_equip.js';
import booster from './js/adminCommands/booster.js';
import trade from './js/commands/trade.js';
import adventure from './js/adventure.js';
import smelt from './js/commands/smelt.js';
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
    voteRewardsSend(client,vote.user,vote.isWeekend)
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
    let content = message.content.toLowerCase();
    if (message.author.bot) {
        return;
    }
    // ================================================================================================================================
    // CO COMMAND
    
    if (content.startsWith(teraRPGPrefix)) {
        const commandBody = message.content.slice(teraRPGPrefix.length).toLowerCase();
        const args = commandBody.trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const prefixCommand = teraRPGPrefix + command;
        const body = message.content.replace(prefixCommand, '');
        if (message.author.id === '668740503075815424') {
            if (command === "repost") {
                message.channel.send(body);
                message.delete();
                return;
            } else if (command === "prepare") {
                if (args[0] === 'set') {
                    message.delete;
                    client.channels.cache.get("818359215562424330").setName(`\\🟡-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\🟡 Bot is Preparing for Maintenance`)
                    await queryData(`update configuration set value=1 where id=1;`);
                    message.channel.send(`Server set prepare maintenance`);
                } else if (args[0] === 'unset') {
                    message.delete;
                    client.channels.cache.get("818359215562424330").setName(`\\🟢-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\🟢 Bot Online`)
                    await queryData(`update configuration set value=0 where id=1;`);
                    message.channel.send(`Server unset prepare maintenance`);
                }
            }  else if (command === "maintenance") {
                if (args[0] === 'set') {
                    message.delete;
                    client.channels.cache.get("818359215562424330").setName(`\\🔴-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\🔴 Bot Offline\n-Under Maintenance `)
                    await queryData(`update configuration set value=0 where id=1;`);
                    await queryData(`update configuration set value=1 where id=6;`);
                    message.channel.send(`Server set maintenance`);
                } else if (args[0] === 'unset') {
                    message.delete;
                    client.channels.cache.get("818359215562424330").setName(`\\🟢-Status`)
                    client.channels.cache.get("818359215562424330").send(`\\🟢 Bot Online`)
                    await queryData(`update configuration set value=0 where id=6;`);
                    message.channel.send(`Server unset maintenance`);
                }
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
                message.channel.send(`Player <@${args[0]}> unbanned`);
                return;
            } else if (command === "level") {
                if (args.length > 0) {
                    if (!isNaN(args[0])) {
                        if (args.length > 1) {
                            if (args[0].length < 5 && args[0] > 0) {
                                queryData(`UPDATE stat SET level="${args[0]}" WHERE player_id="${args[1]}" LIMIT 1`);

                                message.delete();
                                message.channel.send(`Player <@${args[1]}>'s level has been set to ${args[0]}`);
                            } else {
                                message.channel.send('Failed!')
                            }
                        } else {
                            queryData(`UPDATE stat SET level="${args[0]}" WHERE player_id="${message.author.id}" LIMIT 1`);
        
                            message.delete();
                            message.channel.send(`Level has been set to ${args[0]}`);
                        }
                    }
                }
                return;
            } else if (command === "math") {
                try {
                    const num = eval(body);
                    message.reply(num);
                } catch (error) {
                    return;
                }
            }  else if (command === "give") {
                give(message, args);
            } else if (command === 'booster') {
                booster(message, args);
            }
        }
        if (command != '') {
            // FIND USER REGISTRATION
            let isUserRegistred = await queryData(`SELECT id, active_command, depth, zone_id, max_zone, sub_zone, is_active, stat.gold, stat.level, stat.basic_hp, stat.basic_mp, stat.current_experience FROM player LEFT JOIN stat ON (player.id = stat.player_id) WHERE id=${message.author.id} LIMIT 1`)
            if (waitingTime.has(message.author.id)) {
                message.reply("Wait at least 1 second before getting typing this again.");
                return;
            }
            if (isUserRegistred.length > 0) {
                let stat = isUserRegistred[0];
                if (isUserRegistred[0].is_active) { // Check Banned User
                    let configuration = await queryData(`SELECT value FROM configuration WHERE id IN (1,6) ORDER BY id LIMIT 2`);
                    let prepareMaintenance = configuration.length > 0 ? configuration[0].value : false;
                    let maintenance = configuration.length > 0 ? configuration[1].value : false;
                    if (isUserRegistred[0].active_command === 1) {
                        message.reply(`you have an active command, end it before processing another!`)
                        return;
                    }
                    if (maintenance && message.author.id !== '668740503075815424') {
                        message.channel.send('🛠️ | Bot is under maintenance...!');
                        return;
                    }
                    if (prepareMaintenance && message.author.id !== '668740503075815424') {
                        message.channel.send('🛠️ | Bot is preparing for maintenance...!');
                        return;
                    }
                    if (command === "ping") {
                        log(message, commandBody);
                        let timeTaken = Date.now() - message.createdTimestamp;
                        if (timeTaken < 0) {
                            timeTaken = -timeTaken;
                        }
                        message.channel.send(`Pong! ${timeTaken}ms.`);
                    } else if (command === 'help') {
                        log(message, commandBody);
                        help(message, client);
                    } else if (command === 'start') {
                        log(message, commandBody);
                        message.reply(`You already registered, type \`${teraRPGPrefix} help\` for more commands`)
                    } else if (command === 'p' | command === 'profile') {
                        log(message, commandBody);
                        profile(message, client, message.author.id, message.author.avatar, args[0]);
                    } else if (command === 'explore' | command === 'exp') {
                        log(message, commandBody);
                        hunt(message, 0, message.author.id, message.author.username);
                    } else if (command === 'heal') {
                        log(message, commandBody);
                        healingPotion(message, 0, message.author.id, message.author.username);
                    } else if (command === 'mine' || command === 'chop') {
                        log(message, commandBody);
                        work(message, command, isUserRegistred[0].zone_id);
                    } else if (command === 'backpack' || command === 'bp') {
                        log(message, commandBody);
                        backpack(message, args[0]);
                    } else if (command === 'workspace' || command === 'ws') {
                        log(message, commandBody);
                        workspace(message, args[0]);
                    } else if (command === 'tool' || command === 'tools') {
                        log(message, commandBody);
                        tools(message, args[0]);
                    } else if (command === 'craft') {
                        log(message, commandBody);
                        crafting(message, commandBody, args[0], args[1], args[2]); 
                    } else if (command === 'zone' || command === 'z') {
                        log(message, commandBody);
                        teleport(message, stat, args);
                    } else if (command === 'sell') {
                        log(message, commandBody);
                        // let itemName = commandBody.slice(command.length + 1)
                        // console.log(itemName);
                        sellItem(message, args)
                    } else if (command === `cf`) {
                        // log(message, commandBody);
                        coinFlip(message, args)
                    } else if (command === 'vote' || command === 'hourly' || command === 'daily' || command === 'weekly') {
                        log(message, commandBody);
                        rewards(message, command, isUserRegistred[0]);
                    } else if (command === 'cd' || command === 'cooldowns' || command === 'rd' || command === 'ready') {
                        log(message, commandBody);
                        cooldowns(message, command, args[0]);
                    } else if (command === 'lottery') {
                        log(message, commandBody);
                        lottery(message, client, args, stat)
                    } else if (command === 'fish') {
                        log(message, commandBody);
                        fishing(message, stat);
                    } else if (command === 'open') {
                        log(message, commandBody);
                        openCrate(client, message, args);
                    } else if (command === 'invite') {
                        log(message, commandBody);
                        invite(message);
                    } else if (command === 'dungeon') {
                        log(message, commandBody);
                        dungeon(message, stat);
                    } else if (command === 'junken') {
                        log(message, commandBody);
                        junken(message, stat);
                    } else if (command === 'report') {
                        log(message, commandBody);
                        report(message, client, body);
                    } else if (command === 'suggest') {
                        log(message, commandBody);
                        suggest(message, client, body);
                    } else if (command === 'upgrade') {
                        log(message, commandBody);
                        upgrade(message, args[0]);
                    } else if (command === 'ranks') {
                        log(message, commandBody);
                        ranks(message, args[0]);
                    } else if (command === 'market') {
                        log(message, commandBody);
                        market(message);
                    }  else if (command === 'shop') {
                        log(message, commandBody);
                        shop(message);
                    } else if (command === 'buy') {
                        log(message, commandBody);
                        buy(message, args[0], args[1], args[2]);
                    } else if (command === 'deposit') {
                        log(message, commandBody);
                        deposit(message, args[0]);
                    } else if (command === 'withdraw' || command === 'wd') {
                        log(message, commandBody);
                        withdraw(message, args[0]);
                    } else if (command === 'bank') {
                        log(message, commandBody);
                        bank(message);
                    } else if (command === 'booster') {
                        log(message, commandBody);
                        bonus(message);
                    } else if (command === 'reforge') {
                        log(message, commandBody);
                        reforge(message, args[0], args[1]);
                    }
                    else if (command === 'armory') {
                        log(message, commandBody);
                        armory(message, args[0]);
                    }
                    else if (command === 'equip' || command === 'unequip') {
                        log(message, commandBody);
                        unOrEquip(message, command, args[0], args[1]);
                    } else if (command === 'minex' || command === 'me' || command === 'adventure' || command === 'adv') {
                        log(message, commandBody);
                        adventure(message,stat);
                    } else if (command === 'trade') {
                        log(message, commandBody);
                        trade(message,stat, args);
                    } else if (command === 'smelt') {
                        log(message, commandBody);
                        smelt(message, args);
                    }
                }
            } else if (command === 'start') {
                // INSERT USER
                let log = await queryData(`CALL start_procedure("${message.author.id}","${message.author.tag}")`)
                log = log.length > 0 ? log[0][0].log : 0;
                let m = `Welcome to teraRPG, type \`${teraRPGPrefix}exp\` to begin your journey\nYou can also see other commands with \`${teraRPGPrefix}help\`. Oh almost forgot, \nhere is a present for you, hope it can help you through the cruelty of the world`
                let embed = new Discord.MessageEmbed({
                    type: "rich",
                    title: null,
                    description: null,
                    url: null,
                    color: 10115509,
                    fields: [
                        {
                            name: `Register reward`,
                            value: `\`x1\` \\🎁\`starter pack\``,
                            inline: false
                        },
                        {
                            name: `Info`,
                            value: `use \`tera open starter pack\` to open it`,
                            inline: false
                        },
                    ],
                    footer: {
                        text: '\`tera invite\` to get help on support server'
                    },
                })
                message.reply(m,embed)
                
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
        async function agendaRun(message, command, textMessage, time) {
            agenda.define(`${command} ${message.author.id}`, async job => {
                await message.channel.send(`<@${message.author.id}>, ${textMessage}`);
            });
        
            await agenda.start();
            await agenda.cancel({ name: `${command} ${message.author.id}` });
            await agenda.schedule(time, `${command} ${message.author.id}`);
        }
    
        async function boosterExpire(message, command, textMessage, time) {
            agenda.define(`${command} ${message.author.id}`, async job => {
                queryData(`UPDATE configuration SET value=0 WHERE id=3 LIMIT 1`);
            });
        
            await agenda.start();
            await agenda.cancel({ name: `${command} ${message.author.id}` });
            await agenda.schedule(time, `${command} ${message.author.id}`);
        }
    
        
    async function cooldownsReminder(item, message) {
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
                    
                    addReminder(message.author.id,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                } else if (time.includes('h')) {
                    htos = parseFloat(time.split(' ')[0]) * 60 * 60 * 1000;
                    mtos = parseFloat(time.split(' ')[1]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[2]) * 1000;
                    totalSec = htos + mtos + sec;   

                    addReminder(message.author.id,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                } else if (time.includes('m')) {
                    mtos = parseFloat(time.split(' ')[0]) * 60 * 1000;
                    sec = parseFloat(time.split(' ')[1]) * 1000;
                    totalSec = mtos + sec;
                    
                    addReminder(message.author.id,`rpg ${item}`, `Time for \`RPG ${item.toUpperCase()}\` !!!`, totalSec);
                }
            }
    }

    function rpgProsessReminder(data) {
        message.channel.send(`<@${data.id}>, ${data.textMessage}`);
    }

    async function addReminder(message, command, textMessage, delay) {
        await rpgReminder.removeJobs(
            {
                id: message.author.id,
                textMessage: textMessage,
                command: command
            }
        );
        rpgReminder.re(
            {
                id: message.author.id,
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