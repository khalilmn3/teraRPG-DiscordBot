
import db from '../db_config.js'
import Discord from 'discord.js';
import queryData from './helper/query.js';

async function hunt(message, client, id, username) { 
    let monsterID = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let monsterData = [
        {
            id: 1,
            name: 'Baby Slime',
            minDamage: 10,
            maxDamage: 20,
            minExp: 5,
            maxExp: 10,
            minCoin: 20,
            maxCoin: 80,
            icon: '<:baby_slime:801079278132527144>'
        },
        {
            id: 2,
            name: 'Slime',
            minDamage: 15,
            maxDamage: 25,
            minExp: 7,
            maxExp: 12,
            minCoin: 40,
            maxCoin: 100,
            icon: '<:slime:801079335569457182>'
        },
        {
            id: 3,
            name: 'Bat',
            minDamage: 13,
            maxDamage: 23,
            minExp: 10,
            maxExp: 15,
            minCoin: 60,
            maxCoin: 120,
            icon: ':bat:'
        },
        {
            id: 4,
            name: 'Crab',
            minDamage: 5,
            maxDamage: 12,
            minExp: 8,
            maxExp: 18,
            minCoin: 80,
            maxCoin: 140,
            icon: ':crab:'
        },
        {
            id: 5,
            name: 'Wolf',
            minDamage: 15,
            maxDamage: 30,
            minExp: 10,
            maxExp: 25,
            minCoin: 100,
            maxCoin: 160,
            icon: ':wolf:'
        }
    ]

    let x = Math.random() * (5 - 1) + 1;
    x = Math.round(x);
    let y = Math.random();
    let monster = '';
    if (y < 0.5) { // 50%
        monster = monsterData[0];
    } else if (y < 0.7) { // 20%
        monster = monsterData[1];
    } else if (y < 0.85) { // 15%
        monster = monsterData[2];
    } else if (y < 0.95) { // 10%
        monster = monsterData[3];
    } else { // 5 %
        monster = monsterData[4];
    }

    const query = `SELECT stat.*, armor.def, level.experience, item.name as weapon FROM level,stat 
    LEFT JOIN armor ON (stat.armor_id = armor.id)
    LEFT JOIN weapon ON (stat.weapon_id = weapon.id)
    LEFT JOIN item ON (weapon.item_id = item.id)
    WHERE level.id > stat.level AND stat.player_id="${id}" LIMIT 1`;
    db.query(query, async (err, result) => {
        if (err) throw err;
        let stat = await result[0];
        console.log(stat);
        let def = stat.basic_def * stat.level + stat.def + (stat.def * stat.armor_enchant * 0.3);
        let maxHp = 5 * (stat.level + stat.basic_hp);
        let maxMp = 5 * (stat.level + stat.basic_mp);
        let bHp = stat.hp;
        let damage = Math.round(Math.random() * (monster.maxDamage - monster.minDamage) + monster.minDamage);
        let exp = Math.round(Math.random() * (monster.maxExp - monster.minExp) + monster.minExp);
        let coin = Math.round(Math.random() * (monster.maxCoin - monster.minCoin) + monster.minCoin);

        let cHp = bHp - ((damage - def) > 0 ? (damage - def) : 0);
        
        let lostHP = bHp - cHp;
        let totalXP = stat.current_experience + exp;
        console.log("damage :"+damage);
        console.log("def :"+def);
        console.log("hp :" + cHp);
        let levelUPmessage = '';
        // PLAYER DIED
        if (cHp <= 0) {
            cHp = 0;
            if (stat.level > 1) {
                maxHp = 5 * ((stat.level - 1) + stat.basic_hp);
                maxMp = 5 * ((stat.level - 1) + stat.basic_mp);
                db.query(`UPDATE stat SET hp=${maxHp}, mp=${maxMp}, level=level - 1, current_experience=0 WHERE player_id="${id}"`);
                message.channel.send(`${username} Lost in battle, he also lost his level by 1, \nBe carefull next time and make sure \nyou already prepared before going to wild.`);
                
            } else {
                db.query(`UPDATE stat SET hp=1, current_experience=0 WHERE player_id="${id}"`);
                message.channel.send(`:skull_crossbones: | **${username}** Lost in battle with ${monster.icon} ** ${monster.name} **,\n Be carefull next time and make sure \n you already prepared before going to wild.`);
                
            }
            return;
        }
        if (totalXP >= stat.experience) {
            // LEVEL UP
            let data = await queryData(`SELECT id, experience FROM level WHERE experience<=${totalXP} ORDER BY id DESC LIMIT 1`)
            let nLevel = data[0].id;
            let cExp = totalXP - data[0].experience;
            maxHp = 5 * (nLevel + stat.basic_hp);
            maxMp = 5 * (nLevel + stat.basic_mp);
            queryData(`UPDATE stat SET level="${nLevel}", current_experience=${cExp}, hp="${maxHp}", mp="${maxMp}" WHERE player_id="${id}"`);
            levelUPmessage = `${username} Level up +${result[0].id - stat.level}, HP restored`
        }
        let weapon = stat.weapon ? stat.weapon : '👊bare hand'
        let hpLost = lostHP > 0 ? `\nbut also lost ${lostHP} HP, remaining HP is ${cHp} / ${maxHp}` : "";
        // Update data
        queryData(`UPDATE stat SET hp="${cHp}", gold=gold+${coin}, current_experience=current_experience + ${exp} WHERE player_id="${id}"`);
        message.channel.send(`**${username}** encountered a ${monster.icon} ** ${monster.name} ** and \nsuccessfully beaten it down with **${weapon}** ${hpLost} \nGained **${coin}** 𝑔𝑜𝓁𝒹 and **${exp}** 𝑒𝓍𝓅`,levelUPmessage)
    })
}


export default hunt;