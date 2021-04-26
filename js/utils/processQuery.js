import queryData from "../helper/query.js"

function updateStat2(playerId, statField, statValue) {
    queryData(`INSERT stat2 SET player_id=${playerId}, ${statField}=${statValue} ON DUPLICATE KEY UPDATE ${statField}=${statField} + ${statValue}`);
}

function equipProcedure(slotField, playerId, equipId, armoryId, armoryItemId, equipmentItemId, armoryModifierId, equipmentModifierId) {
    queryData(`CALL equip_procedure(${playerId}, ${equipId}, ${armoryId}, ${armoryItemId}, ${equipmentItemId}, ${armoryModifierId}, ${equipmentModifierId}, "${slotField}")`);
}

function unequipProcedure(playerId, itemID, modifierID, equipTypeName) {
    queryData(`CALL unequip_procedure(${playerId}, ${itemID}, ${modifierID}, "${equipTypeName}")`)
}

export {
    updateStat2,
    equipProcedure,
    unequipProcedure
}
