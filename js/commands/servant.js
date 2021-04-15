import Discord from "discord.js";
import { cooldownMessage } from "../embeddedMessage.js";
import currencyFormat from "../helper/currency.js";
import { getAttack } from "../helper/getBattleStat.js";
import isCommandsReady from "../helper/isCommandsReady.js";
import queryData from "../helper/query.js";
import randomNumber from "../helper/randomNumberWithMinMax.js";
import setCooldowns from "../helper/setCooldowns.js";

async function servant(message) {
    let player1 = message.author;
    let playerJoins = message.mentions.users;
    console.log(playerJoins)
    // if (player2 && player2.id != message.author.id) {
    let isCooldown = false;
    if (playerJoins) {
        let loopi = await playerJoins.forEach(async function loop(values, keys) {
            console.log('awal');
            if(isCooldown){return}
            let cooldowns = await isCommandsReady(keys, 'dungeon');
            if (!cooldowns.isReady) {
                isCooldown = true;
                console.log(isCooldown);
                return message.channel.send(cooldownMessage(values.id, values.username, values.avatar, 'Servant', cooldowns.waitingTime));
            }
            console.log(keys);
        })
    await Promise.all([loopi]);
    }
    if (isCooldown) { return };
    console.log('after');
    console.log(isCooldown);
    let cooldowns = await isCommandsReady(player1.id, 'dungeon');
        // let cooldowns2 = await isCommandsReady(player2.id, 'dungeon');
    if (!cooldowns.isReady) {
        return message.channel.send(cooldownMessage(player1.id, player1.username, player1.avatar, 'Dungeon', cooldowns.waitingTime));
    }
    setCooldowns(message.author.id, 'dungeon');
    let servants = await queryData(`SELECT * FROM servants`);
    let stat = await queryData(`SELECT stat.*, IFNULL(weapon.attack,0) as attack, zone.name as zone,
                            IFNULL(itemWeapon.emoji, '') as wEmoji, CONCAT(IFNULL(modifier_weapon.name,"")," ",itemWeapon.name) as weaponName,
                            IFNULL(modifier_weapon.stat_change,0) as weapon_modifier
                            FROM stat 
                            LEFT JOIN equipment ON (stat.player_id = equipment.player_id)
                            LEFT JOIN weapon ON (equipment.weapon_id = weapon.id)
                            LEFT JOIN item as itemWeapon ON (weapon.item_id = itemWeapon.id)
                            LEFT JOIN modifier_weapon ON (equipment.weapon_modifier_id=modifier_weapon.id)
                            LEFT JOIN zone ON (stat.zone_id = zone.id)
                            WHERE stat.player_id = '${message.author.id}' LIMIT 1`)
    let randomInt = randomNumber(0, 13);
    stat = stat[0];
    servants = servants[randomInt];
    let randomNumberParty = randomNumber(10000,99999)
    let attack = await getAttack(stat.basic_attack, stat.attack, stat.level, stat.weapon_modifier);
    let embed = new Discord.MessageEmbed({
        type: "rich",
        title: null,
        description: null,
        url: null,
        color: 10115509,
        fields: [
            {
                value: `__Att : ${attack + 3}__\n\nType \`join ${randomNumberParty}\` to help **${message.author.username}**, \nthe more player join in, the higher the chance of winning`,
                name: `${servants.emoji} ${servants.name} has spawned`
            },
        ],
        // thumbnail: {
        //     url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`,
        //     proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`,
        //     height: 0,
        //     width: 0
        // },
        author: {
            name: `${message.author.username} summoning servant`,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
        },
        provider: null,
        // footer: {
        //     iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=512`,
        //     proxyIconURL: `https://images-ext-1.discordapp.net/external/DIxgPOIeSdmfHuboNFOPhyAJyjRQ9bUoQMePmqundGg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
        // },
        // timestamp: new Date(),
    
    });
    
    let randomGold = randomNumber(100, 500);
    let gold = (stat.level * 1000) + randomGold;
    let maxRandomGold = stat.level > 20 ? 10000 : 1000;
    let randomSlayerGold = randomNumber(100, maxRandomGold);
    let slayersGold = Math.round(gold / 10) + randomSlayerGold;
    let playerJoin = '';
    let chance = 35;
    let randomBattleResult = randomNumber(1, 100);
    let embedResult = '';

    await message.channel.send(embed).then(async (msg) => {
        const filter = (response) => {
            return response.content.toLowerCase() === `join ${randomNumberParty}`
        };
        
         return await msg.channel.awaitMessages(filter, { max:9, time: 20000 })
             .then(collected => {
                 collected.forEach(element => {
                     let player = element.author
                     if (randomBattleResult <= chance) {
                         if (player.username !== message.author.username) {
                             chance += 5;
                             playerJoin += `\`${player.username}\`,`;
                             queryData(`UPDATE stat SET gold=gold+${randomSlayerGold} WHERE player_id="${player.id}" LIMIT 1`);
                         }
                     }
                });
            })
            .catch(collected => {
                return 0;
            });
    });
    let slayers = playerJoin ? `\n\n**Slayer/s**: ${playerJoin}\n**Rewards**\n\`+${currencyFormat(randomSlayerGold)} gold\`` : '';
    let embedWin = new Discord.MessageEmbed({
        type: "rich",
        title: null,
        description: null,
        url: null,
        color: 10185509,
        fields: [
            {
                value: `**Summoner**: \`${message.author.username}\`\n**Rewards**\n\`+${currencyFormat(gold)} gold\`${slayers}`,
                name: `${servants.emoji} ${servants.name} has been defeated`
            },
        ],
        author: {
            name: `${message.author.username} servant`,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
        },
        provider: null
    
    });

    let embedLose =  new Discord.MessageEmbed({
        type: "rich",
        title: null,
        description: null,
        url: null,
        color: 10185509,
        fields: [
            {
                value: `You failed to defeat the servant, \ntry again next time with more of people join`,
                name: `${servants.emoji}** ${servants.name}** has been running away`
            },
        ],
        author: {
            name: `${message.author.username} servant`,
            iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
        },
        provider: null
    });
    
    if (randomBattleResult <= chance) {
        embedResult = embedWin;
        queryData(`UPDATE stat SET gold=gold+${gold} WHERE player_id="${message.author.id}" LIMIT 1`);
    } else {
        embedResult = embedLose;
    }

    message.channel.send(embedResult)
}

export default servant;