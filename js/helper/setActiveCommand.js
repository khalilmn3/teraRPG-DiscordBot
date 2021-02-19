import queryData from "./query.js";

function activeCommand(playerIdList) {
    let length = Array.isArray(playerIdList) ? playerIdList.length : 1;
    queryData(`UPDATE player SET active_command=1 WHERE id IN (${playerIdList.toString()}) LIMIT ${length}`);
}

function deactiveCommand(playerIdList) {
    let length = Array.isArray(playerIdList) ? playerIdList.length : 1;
    queryData(`UPDATE player SET active_command=0 WHERE id IN (${playerIdList.toString()}) LIMIT ${length}`);
}

async function statusCommand(playerId) {
    let status = await queryData(`SELECT active_command FROM player WHERE id="${playerId}" LIMIT 1`);
    return status[0].active_command;
}

export {
    activeCommand,
    deactiveCommand,
    statusCommand
}