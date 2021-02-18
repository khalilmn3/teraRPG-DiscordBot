function damage(attack, targetDef) {
    if (isNaN(attack) || isNaN(targetDef)) {
        return 0;
    } else {
        let dmg =  parseInt(attack) - (parseInt(targetDef) * 0.5)
        return dmg > 0 ? dmg : 1;
    }
}

export default damage;