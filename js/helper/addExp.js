import { getMaxExp, getMaxHP } from "./getBattleStat.js";
import queryData from "./query.js";

async function addExpGold(message, player, stat, expAdd, goldAdd, currentPlayerStat) {
    let nLevel = stat.level + 1;
    let expNeedToNextLevel = getMaxExp(stat.level);
    let totalExp = parseInt(expAdd) + parseInt(stat.current_experience);

    let levelUPmessage = '';
    if (totalExp >= expNeedToNextLevel) {
        // LEVEL UP
        let cExp = totalExp - expNeedToNextLevel;
        let maxHp = getMaxHP(stat.basic_hp, nLevel);
        let maxMp = getMaxMP(stat.basic_mp, nLevel);
        queryData(`UPDATE stat SET level="${nLevel}", current_experience='${cExp}', gold=gold + ${goldAdd},  hp="${maxHp}", mp="${maxMp}" WHERE player_id="${player.id}" LIMIT 1`);
        levelUPmessage = `> :tada: | **${player.username}** Level up +${nLevel - stat.level}, HP restored`;
        
        message.channel.send(levelUPmessage);
    } else {
        queryData(`UPDATE stat SET current_experience=${totalExp}, hp='${currentPlayerStat.hp}', gold=gold + ${goldAdd} WHERE player_id="${player.id}" LIMIT 1`);
    }
}

export default addExpGold;