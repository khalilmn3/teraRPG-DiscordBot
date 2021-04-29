import { getTimeNow } from "../utils/utils.js";
import { getMaxExp, getMaxHP, getMaxMP } from "./getBattleStat.js";
import queryData from "./query.js";

async function addExpGold(message, player, stat, expAdd, goldAdd, currentPlayerStat) {
    let nLevel = stat.level;
    let totalExp = parseInt(expAdd) + parseInt(stat.current_experience);
    let expNeedToNextLevel = getMaxExp(nLevel);
    let levelUPmessage = '';
    let addHP = '';
    if (currentPlayerStat) {
        addHP= `, hp='${currentPlayerStat.hp}'`
    }
    if (totalExp >= expNeedToNextLevel) {
        // LEVEL UP
            while (totalExp >= expNeedToNextLevel) {
                totalExp = totalExp - expNeedToNextLevel;
                nLevel++;
                expNeedToNextLevel = getMaxExp(nLevel);
            }
        
        let maxHp = getMaxHP(stat.basic_hp, nLevel);
        let maxMp = getMaxMP(stat.basic_mp, nLevel);
        queryData(`UPDATE stat SET level="${nLevel}", current_experience='${totalExp}', gold=gold + ${goldAdd},  hp="${maxHp}", mp="${maxMp}" WHERE player_id="${player.id}" LIMIT 1`);
        levelUPmessage = `> :tada: | **${player.username}** Level up +${nLevel - stat.level}, HP restored`;
        setTimeout(() => {
            message.channel.send(levelUPmessage);
        },500);
    } else {
        queryData(`UPDATE stat SET current_experience=${totalExp}${addHP}, gold=gold + ${goldAdd} WHERE player_id="${player.id}" LIMIT 1`);
    }
}

export default addExpGold;