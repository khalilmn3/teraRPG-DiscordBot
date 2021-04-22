import { getTimeNow } from "../utils/utils.js";
import queryData from "./query.js";

async function addBonusExpGold(message, exp, gold) {
    // GLOBAL/SERVER BOOSTER
    console.log('exp'+exp)
    console.log('gold'+gold)
    let configuration = await queryData(`SELECT * FROM configuration WHERE type="2"`);
    let globalExp = 0;
    let serverExp = 0;
    let globalGold = 0;
    let serverGold = 0;
    configuration.forEach(element => {
        if (element.id == 2) { //global exp
            globalExp = parseInt(element.value);
        }
        if (element.id == 3) { //server exp
            serverExp = parseInt(element.value);
        }
        if (element.id == 4) { //global gold
            globalGold = parseInt(element.value);
        }
        if (element.id == 5) { //server gold
            serverGold = parseInt(element.value);
        }
    });

    // PERSONAL BOOSTER
    let personalExp = 0;
    let personalGold = 0;
    let timeNow = getTimeNow();
    let personalBooster = await queryData(`SELECT * FROM booster WHERE player_id=${message.author.id} AND time>${timeNow} AND is_global=0`);
    personalBooster = personalBooster.length > 0 ? personalBooster : undefined;
    if (personalBooster) {
        personalBooster.forEach(element => {
            if (element.booster_type == 1) {
                personalGold = parseInt(element.percent);
            } else if (booster_type == 2) {
                personalExp = parseInt(element.percent);
            }
        });
    }
    // CALCULATE EXP
    let totalPercentEXP = globalExp + personalExp;
    let totalExp = 0;
    totalExp = exp + (exp * totalPercentEXP / 100);
    if (message.guild.id == '818358160926310400') {
        totalExp = exp + (exp * (totalPercentEXP + serverExp) / 100);
    }
    totalExp = Math.floor(totalExp);
    if (isNaN(totalExp)){
        totalExp = 0;
    }

    // CALCULATE GOLD
    let totalPercentGold = globalGold + personalGold;
    let totalGold = 0;
    totalGold = gold + (gold * totalPercentGold / 100);
    if (message.guild.id == '818358160926310400') {
        totalGold = gold + (gold * (totalPercentGold + serverGold) / 100);
    }
    totalGold = Math.floor(totalGold);
    if (isNaN(totalGold)){
        totalGold = 0;
    }
    console.log('Pexp'+globalExp)
    console.log('Pgold'+personalGold)
    console.log('TPexp'+totalPercentEXP)
    console.log('TPgold'+totalPercentGold)

    console.log('Texp'+totalExp)
    console.log('Tgold'+totalGold)
    
    return {
        exp: totalExp,
        gold: totalGold
    }
}

async function addBonusGold(message, gold) {
    let configuration = await queryData(`SELECT * FROM configuration WHERE type="2"`);
    let globalGold = 0;
    let serverGold = 0;
    configuration.forEach(element => {
        if (element.id == 4) { //global gold
            globalGold = parseInt(element.value);
        }
        if (element.id == 5) { //server gold
            serverGold = parseInt(element.value);
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
    addBonusExpGold,
    addBonusGold
}