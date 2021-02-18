function attack(basicAttack, attack,  weaponEnchant, level) {
    basicAttack = parseInt(basicAttack) > 0 ? parseInt(basicAttack) : 0;
    attack = parseInt(attack) > 0 ? parseInt(attack) : 0;
    weaponEnchant = parseInt(weaponEnchant) > 0 ? parseInt(weaponEnchant) : 0;
    level = parseInt(level) > 0 ? parseInt(level) : 0;
    let att = parseInt(basicAttack) + parseInt(level) + parseInt(attack) + (parseInt(attack) * ((parseInt(weaponEnchant) ? parseInt(weaponEnchant) : 0) * 0.3))
    return att
}

function defense(basicDef, helmDef, chestDef, pantsDef, level) {
    basicDef = parseInt(basicDef) > 0 ? parseInt(basicDef) : 0;
    basicDef = parseInt(helmDef) > 0 ? parseInt(helmDef) : 0;
    basicDef = parseInt(chestDef) > 0 ? parseInt(chestDef) : 0;
    basicDef = parseInt(pantsDef) > 0 ? parseInt(pantsDef) : 0;
    basicDef = parseInt(level) > 0 ? parseInt(level) : 0;
    let def = parseInt(basicDef) + parseInt(helmDef) + parseInt(chestDef) + parseInt(pantsDef) + parseInt(level)
    return def;
}

function hitPoint(basicHp, level) {
    basicHp = parseInt(basicHp) > 0 ? parseInt(basicHp) : 0;
    level = parseInt(level) > 0 ? parseInt(level) : 0;
    return 5 * (basicHp + level);
}

function manaPoint(basicMp, level) {
    basicMp = parseInt(basicMp) > 0 ? parseInt(basicMp) : 0;
    level = parseInt(level) > 0 ? parseInt(level) : 0;
    return 5 * (basicMp + level);
}
export {
    attack, 
    defense,
    hitPoint,
    manaPoint
 }