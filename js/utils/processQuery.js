import queryData from "../helper/query.js"

function updateStat2(playerId, statField, statValue) {
    queryData(`INSERT stat2 SET player_id=${playerId}, ${statField}=${statValue} ON DUPLICATE KEY UPDATE ${statField}=${statField} + ${statValue}`);
}

export {
    updateStat2
}
