
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
import currencyFormat from './helper/currency.js';
import questProgress from './utils/questProgress.js';

async function adventure(message) {
    let cooldowns = await isCommandsReady(message.author.id, 'expedition');
    if (cooldowns.isReady) {
        setCooldowns(message.author.id, 'expedition');
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
        WHERE stat.player_id="${message.author.id}" LIMIT 1`);
        stat = stat[0];
               
        let monsterData = myCache.get(`monsterMineExp${stat.zone_id}`);
        if (monsterData == undefined) {
            monsterData = await queryData(`SELECT * FROM enemy_mine_expedition WHERE zone_id=${stat.zone_id}`)
            myCache.set(`monsterMineExp${stat.zone_id}`, monsterData);
        } else if (monsterData[0].zone_id != stat.zone_id) {
            monsterData = await queryData(`SELECT * FROM enemy_mine_expedition WHERE zone_id=${stat.zone_id}`)
            myCache.set(`monsterMineExp${stat.zone_id}`, monsterData);
        } 
        let monster = await randomizeChance(monsterData);
        let playerAtt = getAttack(stat.basic_attack, stat.attack, stat.level, stat.weapon_modifier);
        stat.playerAtt = playerAtt;
        let playerDef = getDefense(stat.basic_def, stat.level, stat.helmetDef, stat.shirtDef, stat.pantsDef, stat.bonus_armor_set, stat.helmet_modifier, stat.shirt_modifier, stat.pants_modifier);
        let playerMaxHP = getMaxHP(stat.basic_hp, stat.level);
        let playerMaxMP = getMaxMP(stat.basic_mp, stat.level);
        let playerHP = stat.hp;
        let subArea = stat.sub_zone;
        let monsterDamage = subArea >= 2 ? randomNumber(monster.min_damage, monster.max_damage) : monster.min_damage;
        monster.attack = monsterDamage;
        let exp = subArea >= 2 ? randomNumber(monster.min_exp, monster.max_exp) : monster.min_exp;
        // Add bonus exp 
        let bonusExp = calculateBonusExpBank(stat.bank);
        exp = Math.round(exp + bonusExp);
        exp = await addBonusExp(message, exp); //booster
        let depth = stat.depth > 100000 ? 100000 : stat.depth;
        let gold = depth * (monster.gold * subArea)
        gold = Math.round(parseInt(gold) + ((gold * stat.zone_id) / 2));
        gold = await addBonusGold(message, gold); //booster
        monster.hp = subArea >= 2 ? monster.hp * 2 : monster.hp;
        let monsterCurrentHP = monster.hp;
        monster.currentHP = monsterCurrentHP;
        let dmgToMonster = (playerAtt - monster.def) > 0 ? playerAtt - monster.def : 1;
        let dmgToPlayer = monsterDamage - playerDef > 0 ? monsterDamage - playerDef : 1;
        let playerCurrentHP = playerHP;
        stat.currentHP = playerCurrentHP;
        stat.maxHP = playerMaxHP;
        let turn = 1;
        let logMsg = '';
        logMsg = `**${message.author.username}** encountered ${monster.emoji} **${monster.name}**,\n preparing for battle...`;        
        await message.channel.send(messageSend(message, logMsg, stat, monster, monsterCurrentHP, turn)).then((msg) => {
            do {
                if (turn > 10) {
                    dmgToPlayer = dmgToPlayer + turn;
                }
                monsterCurrentHP = monsterCurrentHP - dmgToMonster > 0 ? monsterCurrentHP - dmgToMonster : 0;
                playerCurrentHP = playerCurrentHP - dmgToPlayer > 0 ? playerCurrentHP - dmgToPlayer : 0;
                turn++
                // console.log('mhp: ' + mCHp + ' chp: ' + cHp + ' turn: ' + turn);
            } while (monsterCurrentHP > 0 && playerCurrentHP > 0 && turn < 25);
            
            let playerLostHP = playerHP - playerCurrentHP;
            let HPLostMsg = playerLostHP > 0 ? `\n**${message.author.username}** lost ${playerLostHP} HP, remaining HP is ${playerCurrentHP} / ${playerMaxHP}` : "";
            let weaponMsg = stat.weaponName ? `swing ${stat.wEmoji} **${stat.weaponName}**` : 'using 👊**bare hand**'
            // PLAYER DIED
            if (playerCurrentHP <= 0) {
                playerCurrentHP = 1;
                if (stat.level > 1) {
                    playerMaxHP = getMaxHP(stat.basic_hp, stat.level - 1);
                    playerMaxMP = getMaxMP(stat.basic_mp, stat.level - 1);
                    queryData(`UPDATE stat SET hp=${playerMaxHP}, mp=${playerMaxMP}, level=level - 1, current_experience=0 WHERE player_id="${message.author.id}"`);
                    logMsg = `${monster.emoji} ** ${monster.name} ** smack you down \nyou got nothing but a shameful and your level drop by 1.`;
                    setTimeout(() => {
                        msg.embeds[0].fields[0].value = `HP: ${monsterCurrentHP}/${monster.hp}\nAttack: ${Math.round((monster.min_damage + monster.max_damage) / 2)}`;
                        msg.embeds[0].fields[1].value = `HP: ${playerCurrentHP}/${playerMaxHP}\nAttack: ${Math.round(playerAtt)}`;
                        msg.embeds[0].fields[2].value = logMsg;
                        msg.embeds[0].footer.text = `Turn: ${turn}\nNote: rewards based on your mining depth and zone`;
                        msg.edit(msg.embeds[0])
                    }, 1000);
                } else {
                    queryData(`UPDATE stat SET hp=1, current_experience=0 WHERE player_id="${message.author.id}"`);
                    logMsg = `:skull_crossbones: | ${monster.emoji} ** ${monster.name} ** smack you down,\n Be carefull next time and make sure \n you already prepared before going to wild.`;
                      
                    setTimeout(() => {
                        msg.embeds[0].fields[0].value = `HP: ${monsterCurrentHP}/${monster.hp}\nAttack: ${Math.round((monster.min_damage + monster.max_damage) / 2)}`;
                        msg.embeds[0].fields[1].value = `HP: ${playerCurrentHP}/${playerMaxHP}\nAttack: ${Math.round(playerAtt)}`;
                        msg.embeds[0].fields[2].value = logMsg;
                        msg.embeds[0].footer.text = `Turn: ${turn}\nNote: rewards based on your mining depth and zone`;
                        msg.edit(msg.embeds[0])
                    }, 1000);
                }
                return;
            }
            
            let reward = `\n__**Rewards**__\n\`+${currencyFormat(exp)} 𝑔𝑜𝓁𝒹\n+${currencyFormat(gold)} 𝑒𝓍𝓅\``;
            setTimeout(() => {
                logMsg = `**${message.author.username}** ${weaponMsg}\n${monster.emoji} **${monster.name}** has knocked down${reward}`;
                msg.embeds[0].fields[0].value = `HP: ${monsterCurrentHP}/${monster.hp}\nAT: ${Math.round((monster.min_damage + monster.max_damage) / 2)}`;
                msg.embeds[0].fields[1].value = `HP: ${playerCurrentHP}/${playerMaxHP}\nAT: ${Math.round(playerAtt)}`;
                msg.embeds[0].fields[2].value = logMsg;
                msg.embeds[0].footer.text = `Turn: ${turn}\nNote: rewards based on your mining depth and zone`;
                msg.edit(msg.embeds[0])
                
                addExpGold(message, message.author, stat, exp, gold, { hp: playerCurrentHP });
                // QUEST PROGRESS
                questProgress(message.author.id, 3);
            }, 1500);
        });        
    } else {
        message.channel.send(cooldownMessage(message.author.id, message.author.username, message.author.avatar, 'expedition', cooldowns.waitingTime));
    }
}

function messageSend(message, msgSend, stat, monsterInfo, monsterCurrentHp, turn) {
    let embed = new Discord.MessageEmbed({
        type: 'rich',
        description: null,
        url: null,
        color: 10233863,
        timestamp: null,
        fields: [
            {
                name: `${monsterInfo.name}`,
                value: `HP: ${monsterInfo.currentHP}/${monsterInfo.hp}\nAttack: ${Math.round((monsterInfo.min_damage + monsterInfo.max_damage) / 2)}`,
                inline: true,
            },
            {
                name: `Player`,
                value: `HP: ${stat.currentHP}/${stat.maxHP}\nAT: ${stat.playerAtt}`,
                inline: true,
            },
            {
            name: '__Log__',
            value: msgSend,
            inline: false
            }
        ],
        author: {
            name: `${message.author.username} begin expedition on mining cave`, 
            iconURL : `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
            proxyIconURL : `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        footer: {
            text: `Turn : ${turn}`,
        },
    })
    return embed;
}
export default adventure;