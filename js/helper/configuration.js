import queryData from "./query.js";

async function addBonusExp(message, exp) {
    let configuration = await queryData(`SELECT * FROM configuration`);
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

export {
    addBonusExp
}