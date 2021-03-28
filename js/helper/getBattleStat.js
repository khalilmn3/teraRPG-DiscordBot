

function getAttack(basicAttack, attack, level, weaponEnchant) {
    basicAttack = parseInt(basicAttack) > 0 ? parseInt(basicAttack) : 0;
    attack = parseInt(attack) > 0 ? parseInt(attack) : 0;
    weaponEnchant = !isNaN(parseFloat(weaponEnchant)) ? parseFloat(weaponEnchant) : 0;
    level = parseInt(level) > 0 ? parseInt(level) : 0;
    let modifier = attack * weaponEnchant;
    let att = basicAttack + level + attack + modifier
    return att
}

function getDefense(basicDef, level, helmetDef, shirtDef, pantsDef, bonusArmorSet, helmetModifier, shirtModifier, pantsModifier) {
    basicDef = parseInt(basicDef) > 0 ? parseInt(basicDef) : 0;
    level = parseInt(level) > 0 ? parseInt(level) : 0;
    helmetDef = parseInt(helmetDef) > 0 ? parseInt(helmetDef) : 0;
    shirtDef = parseInt(shirtDef) > 0 ? parseInt(shirtDef) : 0;
    pantsDef = parseInt(pantsDef) > 0 ? parseInt(pantsDef) : 0;
    bonusArmorSet = parseInt(bonusArmorSet) > 0 ? parseInt(bonusArmorSet) : 0;
    helmetModifier = parseInt(helmetModifier) > 0 ? parseInt(helmetModifier) : 0;
    shirtModifier = parseInt(shirtModifier) > 0 ? parseInt(shirtModifier) : 0;
    pantsModifier = parseFloat(pantsModifier) > 0 ? parseFloat(pantsModifier) : 0;
    let totalModifierArmor = helmetModifier + shirtModifier + pantsModifier;
    let totalArmor = basicDef + level + helmetDef + shirtDef + pantsDef + totalModifierArmor;
    return totalArmor;
}

function getMaxHP(basicHp, level) {
    basicHp = parseInt(basicHp) > 0 ? parseInt(basicHp) : 0;
    level = parseInt(level) > 0 ? parseInt(level) : 0;
    return 10 * (basicHp + level);
}

function getMaxMP(basicMp, level) {
    basicMp = parseInt(basicMp) > 0 ? parseInt(basicMp) : 0;
    level = parseInt(level) > 0 ? parseInt(level) : 0;
    return 10 * (basicMp + level);
}

function getMaxExp(level) {
    let expNeedToNextLevel = 0;
    if (!isNaN(parseInt(level))) {
        expNeedToNextLevel = (50 * (level) ** 3 - 150 * (level) ** 2 + 400 * (level)) / 3;   
    }
    return expNeedToNextLevel;
}
export {
    getAttack, 
    getDefense,
    getMaxHP,
    getMaxMP,
    getMaxExp
 }