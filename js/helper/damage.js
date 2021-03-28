function damage(attack, targetDef) {
    const defMultiplier = 1;
    if (isNaN(attack) || isNaN(targetDef)) {
        return 0;
    } else {
        let dmg =  parseInt(attack) - (parseInt(targetDef) * defMultiplier)
        return dmg > 0 ? dmg : 1;
    }
}

export default damage;