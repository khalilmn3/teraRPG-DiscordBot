import queryData from "../helper/query.js";

function questProgress(playerId, questId, required) {
    let multiProgress = 1;
    if (required > 1) {
        multiProgress = required;
    }
    queryData(`UPDATE active_quest SET required_done=required_done+${multiProgress} WHERE player_id=${playerId} AND quest_id=${questId} LIMIT 1`)
}

export default questProgress;