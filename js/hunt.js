
import db from '../db_config.js'
import Discord from 'discord.js';
import queryData from './helper/query.js';
import randomizeChance from './helper/randomize.js';
import setCooldowns from './helper/setCooldowns.js';
import isCommandsReady from './helper/isCommandsReady.js';
import { cooldownMessage } from './embeddedMessage.js';
import randomNumber from './helper/randomNumberWithMinMax.js';
import calculateArmor from './helper/calculateArmor.js';
import addExpGold from './helper/addExp.js';
import calculateBonusExpBank from './helper/calculateBonusExpBank.js';
import { addBonusExp, addBonusGold } from './helper/configuration.js';
import myCache from './cache/leaderboardChace.js';

async function hunt(message, client, id, username, zone) {
    let cooldowns = await isCommandsReady(id, 'explore');
    if (cooldowns.isReady) {
        setCooldowns(id, 'explore');
        let stat = await queryData(`SELECT stat.*, level.*, IFNULL(itemWeapon.emoji, '') as wEmoji, itemWeapon.name as weapon, weapon.attack, 
        armor1.def as helmetDef,armor2.def as chestDef,armor3.def as pantsDef, utility.bug_net
        FROM level, stat
        LEFT JOIN equipment ON (stat.player_id = equipment.player_id)
        LEFT JOIN armor as armor1 ON (equipment.helmet_id = armor1.id)
        LEFT JOIN armor as armor2 ON (equipment.shirt_id = armor2.id)
        LEFT JOIN armor as armor3 ON (equipment.pants_id = armor3.id)
        LEFT JOIN weapon ON (equipment.weapon_id = weapon.id)
        LEFT JOIN item as itemArmor1 ON (armor1.item_id = itemArmor1.id)
        LEFT JOIN item as itemArmor2 ON (armor2.item_id = itemArmor2.id)
        LEFT JOIN item as itemArmor3 ON (armor3.item_id = itemArmor3.id)
        LEFT JOIN item as itemWeapon ON (weapon.item_id = itemWeapon.id)
        LEFT JOIN utility ON (stat.player_id=utility.player_id)
        WHERE level.id > stat.level AND stat.player_id="${id}" LIMIT 1`);
        stat = stat[0];
        
        let monsterData = myCache.get('monsterData');
        if (monsterData == undefined) {
            monsterData = await queryData(`SELECT emoji, zone_id, name, min_damage, max_damage, min_exp, max_exp, min_coin, max_coin, chance FROM enemy WHERE is_boss="0" AND zone_id=${stat.zone_id}`)
            myCache.set('monsterData', monsterData);
        } else if (monsterData[0].zone_id != stat.zone_id) {
            monsterData = await queryData(`SELECT emoji,zone_id, name, min_damage, max_damage, min_exp, max_exp, min_coin, max_coin, chance FROM enemy WHERE is_boss="0" AND zone_id=${stat.zone_id}`)
            myCache.set('monsterData', monsterData);
        }
        let monster = await randomizeChance(monsterData);
    
        let def = await calculateArmor(message.author.id);
        let maxHp = 5 * (stat.level + stat.basic_hp);
        let maxMp = 5 * (stat.level + stat.basic_mp);
        let bHp = stat.hp;
        let subArea = stat.sub_zone;
        let damage = subArea >= 2 ? randomNumber(monster.min_damage, monster.max_damage) : monster.min_damage;
        let exp = subArea >= 2 ? randomNumber(monster.min_exp, monster.max_exp) : monster.min_exp;
        // Add bonus exp 
        let bonusExp = calculateBonusExpBank(exp);
        exp = Math.round(exp + bonusExp);
        exp = await addBonusExp(message, exp);
        let coin = subArea >= 2 ? randomNumber(monster.min_coin, monster.max_coin) : monster.min_coin;
        coin = await addBonusGold(message, coin);

        let cHp = bHp - ((damage - def) > 0 ? (damage - def) : 0);
        
        let lostHP = bHp - cHp;
        // PLAYER DIED
        if (cHp <= 0) {
            cHp = 0;
            if (stat.level > 1) {
                maxHp = 5 * ((stat.level - 1) + stat.basic_hp);
                maxMp = 5 * ((stat.level - 1) + stat.basic_mp);
                db.query(`UPDATE stat SET hp=${maxHp}, mp=${maxMp}, level=level - 1, current_experience=0 WHERE player_id="${id}"`);
                message.channel.send(`${username} Lost in battle with ${monster.emoji} ** ${monster.name} **,\nalso lost level by 1, \nBe carefull next time and make sure \nyou already prepared before going to wild.`);
                
            } else {
                db.query(`UPDATE stat SET hp=1, current_experience=0 WHERE player_id="${id}"`);
                message.channel.send(`:skull_crossbones: | **${username}** Lost in battle with ${monster.emoji} ** ${monster.name} **,\n Be carefull next time and make sure \n you already prepared before going to wild.`);
                
            }
            return;
        }
        let weapon = stat.weapon ? `${stat.wEmoji} ${stat.weapon}` : '👊bare hand'
        let hpLost = lostHP > 0 ? `\nbut also lost ${lostHP} HP, remaining HP is ${cHp} / ${maxHp}` : "";
        
        // BUG CATCH
        let bugCatch = '';
        if (stat.bug_net) {
            let random = Math.floor(Math.random() * 100);
            if (random <= 25) {
                let baitData = await queryData(`SELECT id, emoji, name, chance FROM item WHERE type_id="17" AND dropable=TRUE`);
                let bait = await randomizeChance(baitData);
                // console.log(bait);
                if (bait != 0) {
                    queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${bait.id}", 1)`);
                    bugCatch = `${message.author.username} catched ${bait.emoji} ${bait.name} while exploring`;
                }
            }
        }
        message.channel.send(`**${username}** encountered a ${monster.emoji} **${monster.name}** and \nsuccessfully beaten it down with **${weapon}** ${hpLost} \nGained **${coin}** 𝑔𝑜𝓁𝒹 and **${exp}** 𝑒𝓍𝓅`)
        if (bugCatch) {
            message.channel.send(bugCatch);
        }
        let cStat = {
            hp: cHp 
        }
        addExpGold(message, message.author, stat, exp, coin, cStat);
    } else {
        message.channel.send(cooldownMessage(id, username, message.author.avatar, 'Explore', cooldowns.waitingTime));
    }
}


export default hunt;