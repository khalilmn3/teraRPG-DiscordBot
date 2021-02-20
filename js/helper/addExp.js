import queryData from "./query.js";

async function addExpGold(message,player, stat, expAdd, goldAdd, playerStat) {
    let totalExp = parseInt(expAdd) + parseInt(stat.current_experience);
    let levelEXP = await queryData(`SELECT experience, id FROM level WHERE id=${stat.level + 1} LIMIT 1`)
    let levelUPmessage = '';
    if (levelEXP.length > 0 && totalExp >= levelEXP[0].experience) {
        // LEVEL UP
        let nLevel = levelEXP[0].id;
        let cExp = totalExp - levelEXP[0].experience;
        let maxHp = 5 * (nLevel + stat.basic_hp);
        let maxMp = 5 * (nLevel + stat.basic_mp);
        queryData(`UPDATE stat SET level="${nLevel}", current_experience='${cExp}', gold=gold + ${goldAdd},  hp="${maxHp}", mp="${maxMp}" WHERE player_id="${player.id}" LIMIT 1`);
        levelUPmessage = `> :tada: | **${player.username}** Level up +${nLevel - stat.level}, HP restored`;
        
        message.channel.send(levelUPmessage);
    } else {
        queryData(`UPDATE stat SET current_experience=${totalExp}, hp='${playerStat.hp}', mp='${playerStat.mp}', gold=gold + ${goldAdd} WHERE player_id="${player.id}" LIMIT 1`);
    }
}

export default addExpGold;