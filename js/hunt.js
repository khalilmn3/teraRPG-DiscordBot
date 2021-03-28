
import db from '../db_config.js'
import Discord from 'discord.js';
import queryData from './helper/query.js';
import randomizeChance from './helper/randomize.js';
import setCooldowns from './helper/setCooldowns.js';
import isCommandsReady from './helper/isCommandsReady.js';
import { cooldownMessage } from './embeddedMessage.js';
import randomNumber from './helper/randomNumberWithMinMax.js';
import addExpGold from './helper/addExp.js';
import calculateBonusExpBank from './helper/calculateBonusExpBank.js';
import { addBonusExp, addBonusGold } from './helper/configuration.js';
import myCache from './cache/leaderboardChace.js';
import { getAttack, getDefense, getMaxHP, getMaxMP } from './helper/getBattleStat.js';

async function hunt(message, client, id, username, zone) {
    let cooldowns = await isCommandsReady(id, 'explore');
    if (cooldowns.isReady) {
        setCooldowns(id, 'explore');
        let stat = await queryData(`SELECT stat.*, zone.name as biome, IFNULL(itemWeapon.emoji, '') as wEmoji, CONCAT(IFNULL(modifier_weapon.name,"")," ",itemWeapon.name) as weaponName,
        weapon.attack,armor1.def as helmetDef,armor2.def as chestDef,armor3.def as pantsDef, utility.bug_net,
        IFNULL(modifier_weapon.stat_change,0) as weapon_modifier,
        IFNULL(helmet_modifier.stat_change,0) as helmet_modifier,
        IFNULL(shirt_modifier.stat_change,0) as shirt_modifier,
        IFNULL(pants_modifier.stat_change,0) as pants_modifier
        FROM stat
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
        WHERE stat.player_id="${id}" LIMIT 1`);
        stat = stat[0];
        
        let monsterData = myCache.get('monsterData');
        if (monsterData == undefined) {
            monsterData = await queryData(`SELECT image_url, emoji, zone_id, name, def, hp, min_damage, max_damage, min_exp, max_exp, min_coin, max_coin, chance FROM enemy WHERE is_boss="0" AND zone_id=${stat.zone_id}`)
            myCache.set('monsterData', monsterData);
        } else if (monsterData[0].zone_id != stat.zone_id) {
            monsterData = await queryData(`SELECT image_url, emoji,zone_id, name, def, hp, min_damage, max_damage, min_exp, max_exp, min_coin, max_coin, chance FROM enemy WHERE is_boss="0" AND zone_id=${stat.zone_id}`)
            myCache.set('monsterData', monsterData);
        }
        let monster = await randomizeChance(monsterData);
    
        let attack = getAttack(stat.basic_attack, stat.attack, stat.level, stat.weapon_modifier);
        let def = getDefense(stat.basic_def, stat.level, stat.helmetDef, stat.shirtDef, stat.pantsDef, stat.bonus_armor_set, stat.helmet_modifier, stat.shirt_modifier, stat.pants_modifier);
        let maxHp = getMaxHP(stat.basic_hp, stat.level);
        let maxMp = getMaxMP(stat.basic_mp, stat.level);
        let bHp = stat.hp;
        let subArea = stat.sub_zone;
        let damage = subArea >= 2 ? randomNumber(monster.min_damage, monster.max_damage) : monster.min_damage;
        monster.attack = damage;
        let exp = subArea >= 2 ? randomNumber(monster.min_exp, monster.max_exp) : monster.min_exp;
        // Add bonus exp 
        let bonusExp = calculateBonusExpBank(exp);
        exp = Math.round(exp + bonusExp);
        exp = await addBonusExp(message, exp);
        let coin = subArea >= 2 ? randomNumber(monster.min_coin, monster.max_coin) : monster.min_coin;
        coin = await addBonusGold(message, coin);
        monster.hp = subArea >= 2 ? monster.hp * 2 : monster.hp;
        let mCHp = monster.hp;
        let dmgToMonster = (attack - monster.def) > 0 ? attack - monster.def : 1;
        let dmgToPlayer = damage - def > 0 ? damage - def : 1;
        let cHp = bHp;
        let turn = 1;
        let logMsg = '';
        logMsg = `**${username}** encountered a ${monster.emoji} **${monster.name}**,\n preparing for battle...`;        
        await message.channel.send(messageSend(message, logMsg, stat, monster, mCHp, turn)).then((msg) => {
            do {
                if (turn > 10) {
                    dmgToPlayer = dmgToPlayer + turn;
                }
                mCHp = mCHp - dmgToMonster > 0 ? mCHp - dmgToMonster : 0;
                cHp = cHp - dmgToPlayer > 0 ? cHp - dmgToPlayer : 0;
                turn++
                console.log('mhp: ' + mCHp + ' chp: ' + cHp + ' turn: ' + turn);
            } while (mCHp > 0 && cHp > 0 && turn < 25);
            
            let lostHP = bHp - cHp;
            let hpLost = lostHP > 0 ? `\n**${username}** lost ${lostHP} HP, remaining HP is ${cHp} / ${maxHp}` : "";
            let weapon = stat.weaponName ? `${stat.wEmoji} ${stat.weaponName}` : '👊bare hand'
            // PLAYER DIED
            if (cHp <= 0) {
                cHp = 0;
                if (stat.level > 1) {
                    maxHp = getMaxHP(stat.basic_hp, stat.level - 1);
                    maxMp = getMaxMP(stat.basic_mp, stat.level - 1);
                    db.query(`UPDATE stat SET hp=${maxHp}, mp=${maxMp}, level=level - 1, current_experience=0 WHERE player_id="${id}"`);
                    logMsg = `${username} Lost in battle with ${monster.emoji} ** ${monster.name} **,\nalso lost level by 1, \nBe carefull next time and make sure \nyou already prepared before going to wild.`;
                    // messageSend(message, logMsg, stat, monster, mCHp, turn); 
                    setTimeout(() => {
                        // logMsg = `**${username}** swing **${weapon}** \n${monster.emoji} **${monster.name}** knocked down ${hpLost} HP \nGained **${coin}** 𝑔𝑜𝓁𝒹 and **${exp}** 𝑒𝓍𝓅`;
                        msg.embeds[0].fields[1].value = logMsg;
                        const newLogs = new Discord.MessageEmbed(msg.embeds[0]);
                        msg.edit(msg.embeds[0])
                    }, 1500);
                } else {
                    db.query(`UPDATE stat SET hp=1, current_experience=0 WHERE player_id="${id}"`);
                    logMsg = `:skull_crossbones: | **${username}** Lost in battle with ${monster.emoji} ** ${monster.name} **,\n Be carefull next time and make sure \n you already prepared before going to wild.`;
                    // messageSend(message, logMsg, stat, monster, mCHp, turn);
                      
                    setTimeout(() => {
                        // logMsg = `**${username}** swing **${weapon}** \n${monster.emoji} **${monster.name}** knocked down ${hpLost} HP \nGained **${coin}** 𝑔𝑜𝓁𝒹 and **${exp}** 𝑒𝓍𝓅`;
                        msg.embeds[0].fields[1].value = logMsg;
                        const newLogs = new Discord.MessageEmbed(msg.embeds[0]);
                        msg.edit(msg.embeds[0])
                    }, 1500);
                }
                return;
            }                
            setTimeout(() => {
                logMsg = `**${username}** swing **${weapon}** \n${monster.emoji} **${monster.name}** knocked down ${hpLost} HP \nGained **${coin}** 𝑔𝑜𝓁𝒹 and **${exp}** 𝑒𝓍𝓅`;
                msg.embeds[0].fields[1].value = logMsg;
                msg.embeds[0].footer.text = `turn: ${turn}`;
                const newLogs = new Discord.MessageEmbed(msg.embeds[0]);
                msg.edit(msg.embeds[0])
                        
                let cStat = {
                    hp: cHp 
                }
                addExpGold(message, message.author, stat, exp, coin, cStat);
            }, 1500);
        });

        // logMsg = `**${username}** encountered a ${monster.emoji} **${monster.name}** and \nsuccessfully beaten it down with **${weapon}** ${hpLost} \nGained **${coin}** 𝑔𝑜𝓁𝒹 and **${exp}** 𝑒𝓍𝓅`;
        // messageSend(message, logMsg, stat, monster, mCHp, turn);
        // message.channel.send(`**${username}** encountered a ${monster.emoji} **${monster.name}** and \nsuccessfully beaten it down with **${weapon}** ${hpLost} \nGained **${coin}** 𝑔𝑜𝓁𝒹 and **${exp}** 𝑒𝓍𝓅`)
        
        // BUG CATCH
        let bugCatch = '';
        if (stat.bug_net) {
            let random = Math.floor(Math.random() * 100);
            if (random <= 15) {
                let baitData = myCache.get('baitData');
                if (baitData == undefined) {
                    let data = await queryData(`SELECT id, emoji, name, chance FROM item WHERE type_id="17" AND dropable=TRUE`);
                    myCache.set('baitData', data);
                    baitData = data;
                }
                let bait = await randomizeChance(baitData);
                // console.log(bait);
                if (bait != 0) {
                    queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${bait.id}", 1)`);
                    bugCatch = `${message.author.username} catched ${bait.emoji} ${bait.name} while exploring`;
                }
            }
        }
        if (bugCatch) {
            message.channel.send(bugCatch);
        }
    } else {
        message.channel.send(cooldownMessage(id, username, message.author.avatar, 'Explore', cooldowns.waitingTime));
    }
}

function messageSend(message, msgSend, stat, monsterInfo, monsterCurrentHp, turn) {
    let embed = new Discord.MessageEmbed({
        type: 'rich',
        // title: `Exploring ${stat.biome} biome [${stat.sub_zone > 1 ? 'Hard' : 'Normal'}]`,
        description: null,
        url: null,
        color: 10276863,
        timestamp: null,
        fields: [
            {
                name: `${monsterInfo.name}`,
                // value: `HP: ${monsterCurrentHp}/${monsterInfo.hp}\nAttack: ${Math.round((monsterInfo.min_damage + monsterInfo.max_damage) / 2)}`,
                value: `HP: ${monsterInfo.hp}\nAttack: ${Math.round((monsterInfo.min_damage + monsterInfo.max_damage) / 2)}`,
                inline: false,
            },
            {
            name: 'log',
            value: msgSend,
            inline: true
            }
        ],
        // thumbnail: {
        //     url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
        //     proxyURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
        //     height: 0,
        //     width: 0
        // },
        author: {
            name: `${message.author.username} Exploring ${stat.biome} biome [${stat.sub_zone > 1 ? 'Hard' : 'Normal'}]`, 
            iconURL : `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyIconURL : `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        // image: {
        //     url: `${monsterInfo.image_url}`,
        //     proxyURL: `https://images-ext-2.discordapp.net/external/x-zut8t2u6esGWxWBBOyZYXq59BmTg9lEZHwM21iOfQ/%3Fv%3D26/${monsterInfo.image_url}`,
        //     height: 0,
        //     width: 0
        // },
        footer: {
            text: `turn : ${turn}`,
            iconURL: undefined,
            proxyIconURL: undefined
        },
    })
    return embed;
    message.channel.send(embed).then((msg) => {
        setTimeout(()=>{
            msg.edit(embed)
        }, 1500)
    });
}
function batlling() {
    do {
        console.log(dmgToMonster)
        console.log(mCHp);
        console.log(dmgToPlayer)
        console.log(cHp);
        if (turn > 10) {
            dmgToPlayer = dmgToPlayer + turn;
        }
        mCHp = mCHp - dmgToMonster > 0 ? mCHp - dmgToMonster : 0;
        cHp = cHp - dmgToPlayer > 0 ? cHp - dmgToPlayer : 0;
        turn++
        console.log('mhp: ' + mCHp + ' chp: ' + cHp + ' turn: ' + turn);
    } while (mCHp > 0 && cHp > 0 && turn < 25);
}
export default hunt;