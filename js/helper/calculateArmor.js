import queryData from "./query.js";

async function calculateArmor(playerId) {
    let armor = await queryData(`SELECT IFNULL(helmet.def,0) as helmetDef, IFNULL(shirt.def,0) as shirtDef, IFNULL(pants.def,0) as pantsDef,
        IF(helmet.armor_set_id=shirt.armor_set_id AND shirt.armor_set_id=pants.armor_set_id, armor_set.bonus_set, 0) as bonus_armor_set,
        stat.level, stat.basic_def, IFNULL(modifier_weapon.stat_change,0) as weapon_modifier,
        IFNULL(helmet_modifier.stat_change,0) as helmet_modifier,
        IFNULL(shirt_modifier.stat_change,0) as shirt_modifier,
        IFNULL(pants_modifier.stat_change,0) as pants_modifier
         FROM equipment
        LEFT JOIN armor as helmet ON (equipment.helmet_id=helmet.id)
        LEFT JOIN armor as shirt ON (equipment.shirt_id=shirt.id)
        LEFT JOIN armor as pants ON (equipment.pants_id=pants.id)
        LEFT JOIN armor_set ON (helmet.armor_set_id=armor_set.id)
        LEFT JOIN stat ON (equipment.player_id=stat.player_id)
        LEFT JOIN modifier_weapon ON (equipment.weapon_modifier_id=modifier_weapon.id)
        LEFT JOIN modifier_armor as helmet_modifier ON (equipment.helmet_modifier_id=helmet_modifier.id)
        LEFT JOIN modifier_armor as shirt_modifier ON (equipment.shirt_modifier_id=shirt_modifier.id)
        LEFT JOIN modifier_armor as pants_modifier ON (equipment.pants_modifier_id=pants_modifier.id)
        WHERE equipment.player_id="${playerId}" LIMIT 1`);
    armor = armor.length > 0 ? armor[0] : 0;
    let totalArmor = 0;
    if (armor !== 0) {
        let totalModifierArmor = parseInt(armor.helmet_modifier) + parseInt(armor.shirt_modifier) + parseInt(armor.pants_modifier);
        totalArmor = parseInt(armor.helmetDef) + parseInt(armor.shirtDef) + parseInt(armor.pantsDef) + parseInt(armor.bonus_armor_set) + parseInt(armor.level) + parseInt(armor.basic_def) + totalModifierArmor;
    }
    return isNaN(totalArmor) ? 0 : totalArmor;
}

export default calculateArmor;