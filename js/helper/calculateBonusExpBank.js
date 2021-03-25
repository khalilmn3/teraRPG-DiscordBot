import roundFloat from "./roundFloat.js";

function calculateBonusExpBank(val) {
    let bonusExp = 0;
    if (!isNaN(val) && val > 0) {
        if (val <= 1000) {
            bonusExp = roundFloat (val / 1000);
        } else if (val <= 10000) {
            bonusExp = roundFloat(val / 10000) + 1;
        } else if (val <= 100000) {
            bonusExp = roundFloat(val / 100000) + 2;
        } else if (val <= 1000000) {
            bonusExp = roundFloat(val / 1000000) + 3;
        } else if (val <= 10000000) {
            bonusExp = roundFloat(val / 10000000) + 4;
        } else if (val <= 100000000) {
            bonusExp = roundFloat(val / 100000000) + 5;
        } else if (val <= 1000000000) {
            bonusExp = roundFloat(val / 1000000000) + 6;
        } else if (val <= 10000000000) {
            bonusExp = roundFloat(val / 10000000000) + 7;
        } else if (val <= 100000000000) {
            bonusExp = roundFloat(val / 100000000000) + 8;
        } else if (val > 100000000000) {
            bonusExp = 10;
        }
    }
    return bonusExp;
}

export default calculateBonusExpBank;