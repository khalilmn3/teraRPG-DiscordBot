import randomizeChance from "../helper/randomize.js";
import Discord from 'discord.js';
import queryData from "../helper/query.js";
import currencyFormat from "../helper/currency.js";
import setCooldowns from '../helper/setCooldowns.js';
import isCommandsReady from '../helper/isCommandsReady.js';
import { cooldownMessage } from '../embeddedMessage.js';
import randomNumber from '../helper/randomNumberWithMinMax.js';
import addExpGold from '../helper/addExp.js';
import calculateBonusExpBank from '../helper/calculateBonusExpBank.js';
import { addBonusExpGold } from '../helper/configuration.js';
import myCache from '../cache/leaderboardChace.js';
import { getAttack, getDefense, getMaxHP, getMaxMP } from '../helper/getBattleStat.js';
import questProgress from "../utils/questProgress.js";
import { updateStat2 } from "../utils/processQuery.js";
import errorCode from "../utils/errorCode.js";

async function hunt(message) {
    let cooldowns = await isCommandsReady(message.author.id, 'explore');
    if (cooldowns.isReady) {
        setCooldowns(message.author.id, 'explore');
        let stat = await queryData(`SELECT stat.*, zone.name as biome, IFNULL(itemWeapon.emoji, '') as wEmoji, CONCAT(IFNULL(weapon_modifier.name,"")," ",itemWeapon.name) as weaponName,
            weapon.attack,armor1.def as helmetDef,armor2.def as chestDef,armor3.def as pantsDef, utility.bug_net,
            IFNULL(weapon_modifier.stat_change,0) as weapon_modifier,
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
            LEFT JOIN modifier as weapon_modifier ON (equipment.weapon_modifier_id=weapon_modifier.id)
            LEFT JOIN modifier as helmet_modifier ON (equipment.helmet_modifier_id=helmet_modifier.id)
            LEFT JOIN modifier as shirt_modifier ON (equipment.shirt_modifier_id=shirt_modifier.id)
            LEFT JOIN modifier as pants_modifier ON (equipment.pants_modifier_id=pants_modifier.id) 
            LEFT JOIN armor_set ON (armor1.armor_set_id=armor_set.id)
            LEFT JOIN utility ON (stat.player_id=utility.player_id)
            LEFT JOIN zone ON (stat.zone_id=zone.id)
            WHERE stat.player_id="${message.author.id}" LIMIT 1`);
        stat = stat[0];
        let monsterData = myCache.get('monsterData');
        if (monsterData == undefined) {
            monsterData = await queryData(`SELECT * FROM enemy WHERE is_boss="0" AND zone_id=${stat.zone_id}`)
            myCache.set('monsterData', monsterData);
        } else if (monsterData[0].zone_id != stat.zone_id) {
            monsterData = await queryData(`SELECT * FROM enemy WHERE is_boss="0" AND zone_id=${stat.zone_id}`)
            myCache.set('monsterData', monsterData);
        }
        let activeBooster = await queryData(`SELECT * FROM configuration WHERE value>0 AND id IN (2,3,4,5)`);
        let monster = await randomizeChance(monsterData);
        let weapon = stat.weaponName ? `${stat.wEmoji} ${stat.weaponName}` : '\\👊bare hand'
        let playerAttack = getAttack(stat.basic_attack, stat.attack, stat.level, stat.weapon_modifier);
        let playerDef = getDefense(stat.basic_def, stat.level, stat.helmetDef, stat.shirtDef, stat.pantsDef, stat.bonus_armor_set, stat.helmet_modifier, stat.shirt_modifier, stat.pants_modifier);
        let playerMaxHP = getMaxHP(stat.basic_hp, stat.level);
        let subArea = stat.sub_zone;
        let monsterDamage = subArea >= 2 ? randomNumber(monster.min_damage, monster.max_damage) : monster.min_damage;
        let exp = subArea >= 2 ? randomNumber(monster.min_exp, monster.max_exp) : monster.min_exp;
        let bonusExp = calculateBonusExpBank(stat.bank); // bonus from bank
        let gold = subArea >= 2 ? randomNumber(monster.min_coin, monster.max_coin) : monster.min_coin;
        exp = Math.round(exp + bonusExp);
        let booster = await addBonusExpGold(message, exp, gold); // bonus from booster
        exp = booster.exp
        gold = booster.gold // bonus from booster
        monster.hp = parseInt(monster.hp) - parseInt(playerAttack)
        let dmgToPlayer = monster.hp > 0 && monsterDamage - playerDef > 0 ? monsterDamage - playerDef : 0;
        let playerHP = stat.hp - dmgToPlayer > 0 ? stat.hp - dmgToPlayer : 0;
        let battleLog = `\nand successfully beaten ${monster.emoji}**${monster.name}\n** with **${weapon}** current HP __${playerHP}/${playerMaxHP}__`;
        let reward = ``;

        if (playerHP <= 0) {
            playerHP = 1;
            reward = ``;
            gold = 0;
            exp = 0;
            if (stat.level > 1) {
                let maxHp = getMaxHP(stat.basic_hp, stat.level - 1);
                let maxMp = getMaxMP(stat.basic_mp, stat.level - 1);
                queryData(`UPDATE stat SET hp=${maxHp}, mp=${maxMp}, level=level - 1, current_experience=0 WHERE player_id="${message.author.id}"`);
                battleLog = `\n${monster.emoji}**${monster.name}** beaten **${message.author.username}** down \nyou just die and drop a level.`;
                // logMsg = `${message.author.sername} Lost in battle with ${monster.emoji} ** ${monster.name} **\nyou got nothig but a shameful and your level drop by 1.`;
                return messageSend(message, stat, battleLog, reward, activeBooster);
            } else {
                queryData(`UPDATE stat SET hp=1, current_experience=0 WHERE player_id="${message.author.id}"`);
                battleLog = `\n${monster.emoji}**${monster.name}** beaten **${message.author.username}** down \nyou got nothing but a shameful`;
                // logMsg = `:skull_crossbones: | **${username}** Lost in battle with ${monster.emoji} ** ${monster.name} **,\n Be carefull next time and make sure \n you already prepared before going to wild.`;
                return messageSend(message, stat, battleLog, reward, activeBooster);
            }
        }
        // QUEST PROGRESS
        questProgress(message.author.id, 1);
        // UPDATE STAT
        updateStat2(message.author.id, 'monster_kills', '1');
        
        let dropItemList = await queryData(`SELECT id,emoji, name, chance FROM item WHERE id=${monster.drop_item_id} LIMIT 1`);
        let randomDropItem = randomizeChance(dropItemList);
        let dropItemMsg = '';
        if (randomDropItem) {
            queryData(`CALL insert_item_backpack_procedure(${message.author.id}, ${randomDropItem.id}, "1")`);
            dropItemMsg = `\n\`+1\`${randomDropItem.emoji}\`${randomDropItem.name}\``
        }
        reward = `\n__**Rewards**__:${dropItemMsg}\n\`+${currencyFormat(exp)} 𝑒𝓍𝓅\`\n\`+${currencyFormat(gold)} 𝑔𝑜𝓁𝒹\``;
        addExpGold(message, message.author, stat, exp, gold, { hp: playerHP });
        messageSend(message, stat, battleLog, reward, activeBooster);

    } else {
        message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'explore', cooldowns.waitingTime));
    }
}

function messageSend(message, stat, battleLog, reward, booster) {
    message.channel.send(new Discord.MessageEmbed({
        type: 'rich',
        color: 10275563,
        timestamp: null,
        fields: [
            {
                name: 'Explore',
                value: `${message.author.username} exploring ${stat.biome} biome `+battleLog+reward,
                inline: false,
            },
        ],
        footer: {
            text: booster.length > 0 ? `Booster is active cek with [tera booster]` : null
        }
    })).catch((err) => {
        console.log('(hunt)' + message.author.id + ': ' + errorCode[err.code]);
    });
}
export default hunt;