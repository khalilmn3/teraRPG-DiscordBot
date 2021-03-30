import queryData from "../helper/query.js";

async function unOrEquip(message, command, args1, args2) {
    if (command === 'equip'){
            if (args1 === 'weapon') {
                queryEquip(message, args1, args2, 1);
            } else if (args1 === 'helmet') {
                queryEquip(message, args1, args2, 1);
            } else if (args1 === 'shirt') {
                queryEquip(message, args1, args2, 1);
            } else if (args1 === 'pants') {
                queryEquip(message, args1, args2, 1);
            } else {
                message.channel.send(`use \`equip <eq type> <armory ID>\`, e.g. \`equip shirt 0\``);
            }
    } else if (command === 'unequip') {
            if (args1 === 'weapon') {
                queryUnequip(message, args1, args2, 2);
            } else if (args1 === 'helmet') {
                queryUnequip(message, args1, args2, 2);
            } else if (args1 === 'shirt') {
                queryUnequip(message, args1, args2, 2);
            } else if (args1 === 'pants') {
                queryUnequip(message, args1, args2, 2);
            } else {
                message.channel.send(`use \`unequip <eq type>\`, e.g. \`equip weapon\``);
            }
    }
}

async function queryEquip(message, args1, args2, type) {
    let slotField = '';
    let typeField = '';
    if (args1 === 'weapon') {
        typeField = 'weapon';
        slotField = 'weapon';
    } else if (args1 === 'helmet') {
        typeField = 'armor';
        slotField = 'helmet';
    } else if (args1 === 'shirt') {
        typeField = 'armor';
        slotField = 'shirt';
    } else if (args1 === 'pants') {
        typeField = 'armor';
        slotField = 'pants';
    }

    let cekEquipment = await queryData(`SELECT item.emoji, CONCAT(IFNULL(modifier_${typeField}.name,"")," ",item.name) as name FROM equipment
        LEFT JOIN ${typeField} ON (equipment.${slotField}_id=${typeField}.id)
        LEFT JOIN item ON (${typeField}.item_id=item.id)
        LEFT JOIN modifier_${typeField} ON (equipment.${slotField}_modifier_id=modifier_${typeField}.id)
        WHERE player_id="${message.author.id}" AND equipment.${slotField}_id>0 LIMIT 1`);
    if (cekEquipment.length > 0) {
        return message.channel.send(`\\⛔ | **${message.author.username}**, you have already wearing ${cekEquipment[0].emoji}\`${cekEquipment[0].name}\`\nplease \`unequip\` it before \`equip\` another!`);
    }
    let cekArmory = await queryData(`SELECT item.name, item.emoji, ${slotField}_id as id,${slotField}_modifier_id as modifier_id FROM armory
        LEFT JOIN ${typeField} ON (armory.${slotField}_id=${typeField}.id)
        LEFT JOIN item ON (${typeField}.item_id=item.id)
        WHERE player_id="${message.author.id}" ORDER BY armory.id ASC LIMIT 5`);
    if (cekArmory.length > args2) {
        if (cekArmory[args2].id) {
            queryData(`CALL equip_${slotField}_procedure(${message.author.id}, ${cekArmory[args2].id}, ${cekArmory[args2].modifier_id})`);
            message.channel.send(`**${message.author.username}** take out ${cekArmory[args2].emoji}${cekArmory[args2].name} from armory then wearing it.`)
        } else {
            message.reply('armory ID not found, please recheck your armory!');
        }
    } else {
        message.reply('armory ID not found, please recheck your armory!');
    }
}

async function queryUnequip(message, args1, args2, type) {
    let slotField = '';
    let typeField = '';
    if (args1 === 'weapon') {
        typeField = 'weapon';
        slotField = 'weapon';
    } else if (args1 === 'helmet') {
        typeField = 'armor';
        slotField = 'helmet';
    } else if (args1 === 'shirt') {
        typeField = 'armor';
        slotField = 'shirt';
    } else if (args1 === 'pants') {
        typeField = 'armor';
        slotField = 'pants';
    }
    let cekArmorySpace = await queryData(`SELECT COUNT(*) as Total FROM armory WHERE player_id="${message.author.id}" AND ${slotField}_id>0 LIMIT 5`);
    if (cekArmorySpace[0].Total >= 5) {
        return message.reply(`⛔ | can't unequip this type of equipment, sell it or leave it.\nyou can only store max 5 items in armory for each type!`);
    }

    let cekEquipment = await queryData(`SELECT item.emoji,${slotField}_id, ${slotField}_modifier_id, CONCAT(IFNULL(modifier_${typeField}.name,"")," ",item.name) as name FROM equipment
        LEFT JOIN ${typeField} ON (equipment.${slotField}_id=${typeField}.id)
        LEFT JOIN item ON (${typeField}.item_id=item.id)
        LEFT JOIN modifier_${typeField} ON (equipment.${slotField}_modifier_id=modifier_${typeField}.id)
        WHERE player_id="${message.author.id}" AND ${slotField}_id>0 LIMIT 1`);
    if (cekEquipment.length > 0) {
        cekEquipment = cekEquipment[0];
        // let cekArmory = await queryData(`SELECT ${slotField}_id as id,${slotField}_modifier_id as modifier_id FROM armory WHERE player_id="${message.author.id}" ORDER BY id ASC LIMIT 5`);
        // if (cekArmory.length > 0) {
            queryData(`CALL unequip_${slotField}_procedure(${message.author.id}, ${cekEquipment[slotField+'_id']}, ${cekEquipment[slotField+'_modifier_id']})`);
            message.channel.send(`**${message.author.username}** dismantling ${cekEquipment.emoji}${cekEquipment.name} and put it into armory.`)
        // } else {
        //     queryData(`CALL unequip_${slotField}_procedure(${message.author.id}, ${cekEquipment[0]}.${slotField}_id, ${cekEquipment[0]}.${slotField}_modifier_id)`);
        //     message.channel.send('done2')
        // }
    } else {    
        return message.channel.send(`\\⛔ | **${message.author.username}**, you are not wearing any equipment!`);
    }
}

export default unOrEquip;