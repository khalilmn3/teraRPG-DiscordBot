import queryData from "./query.js";

async function calculateArmor(playerId) {
    let armor = await queryData(`SELECT IFNULL(helmet.def,0) as helmetDef, IFNULL(shirt.def,0) as shirtDef, IFNULL(pants.def,0) as pantsDef,
        IF(helmet.armor_set_id=shirt.armor_set_id AND shirt.armor_set_id=pants.armor_set_id, armor_set.bonus_set, 0) as bonus_armor_set,
        stat.level, stat.basic_def
         FROM equipment
        LEFT JOIN armor as helmet ON (equipment.helmet_id=helmet.id)
        LEFT JOIN armor as shirt ON (equipment.shirt_id=shirt.id)
        LEFT JOIN armor as pants ON (equipment.pants_id=pants.id)
        LEFT JOIN armor_set ON (helmet.armor_set_id=armor_set.id)
        LEFT JOIN stat ON (equipment.player_id=stat.player_id)
        WHERE equipment.player_id="${playerId}" LIMIT 1`);
    armor = armor.length > 0 ? armor[0] : 0;
    let totalArmor = 0;
    if (armor !== 0) {
        totalArmor = parseInt(armor.helmetDef) + parseInt(armor.shirtDef) + parseInt(armor.pantsDef) + parseInt(armor.bonus_armor_set) + parseInt(armor.level) + parseInt(armor.basic_def);
    }
    return isNaN(totalArmor) ? 0 : totalArmor;
}

export default calculateArmor;