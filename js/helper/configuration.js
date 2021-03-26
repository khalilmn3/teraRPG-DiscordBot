import queryData from "./query.js";

async function addBonusExp(message, exp) {
    let configuration = await queryData(`SELECT * FROM configuration WHERE type="2"`);
    let globalExp = 0;
    let serverExp = 0;
    configuration.forEach(element => {
        if (element.id == 2) { //global exp
            globalExp = element.value;
        }
        if (element.id == 3) { //server exp
            serverExp = element.value;
        }
    });

    exp = exp + (exp * globalExp / 100);
    if (message.guild.id == '818358160926310400') {
        exp = exp + (exp * serverExp / 100);
    }
    exp = Math.round(exp);
    if (isNaN(exp)){
        return 0;
    }
    return exp;
}

async function addBonusGold(message, gold) {
    let configuration = await queryData(`SELECT * FROM configuration WHERE type="2"`);
    let globalGold = 0;
    let serverGold = 0;
    configuration.forEach(element => {
        if (element.id == 4) { //global gold
            globalGold = element.value;
        }
        if (element.id == 5) { //server gold
            serverGold = element.value;
        }
    });

    gold = gold + (gold * globalGold / 100);
    if (message.guild.id == '818358160926310400') {
        gold = gold + (gold * serverGold / 100);
    }
    gold = Math.round(gold);
    if (isNaN(gold)){
        return 0;
    }
    return gold;
}
export {
    addBonusExp,
    addBonusGold
}