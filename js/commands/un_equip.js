import queryData from "../helper/query.js";

async function unOrEquip(message, command, args1, args2) {
    if (command === 'equip'){
        if (!isNaN(parseInt(args2))) {
            if (args1 === 'weapon' && !isNaN(parseInt(args2))) {
                queryEquip(message, args1, args2, 1);
            } else if (args1 === 'helmet') {
                queryEquip(message, args1, args2, 1);
            } else if (args1 === 'shirt') {
                queryEquip(message, args1, args2, 1);
            } else if (args1 === 'pants') {
                queryEquip(message, args1, args2, 1);
            }
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

    let cekEquipment = await queryData(`SELECT item.emoji, CONCAT(IFNULL(modifier_${slotField}.name,"")," ",item.name) as name FROM equipment
        LEFT JOIN ${typeField} ON (equipment.${slotField}_id=${typeField}.id)
        LEFT JOIN item ON (weapon.item_id=item.id)
        LEFT JOIN modifier_${typeField} ON (equipment.${slotField}_modifier_id=modifier_${typeField}.id)
        WHERE player_id="${message.author.id}" AND weapon_id>0 LIMIT 1`);
    console.log(cekEquipment);
    if (cekEquipment.length > 0) {
        return message.channel.send(`\\⛔ | **${message.author.username}**, you have already equip ${cekEquipment[0].emoji}\`${cekEquipment[0].name}\`\nplease unequip it before equip another!`);
    }
    let cekArmory = await queryData(`SELECT ${slotField}_id as id,${slotField}_modifier_id as modifier_id FROM armory WHERE player_id="${message.author.id}" ORDER BY id ASC LIMIT 5`);
    if (cekArmory.length > args2) {
        queryData(`CALL equip_${slotField}_procedure(${message.author.id}, ${cekArmory[args2].id}, ${cekArmory[args2].modifier_id})`);
        message.channel.send('done')
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

    let cekEquipment = await queryData(`SELECT item.emoji, CONCAT(IFNULL(modifier_${slotField}.name,"")," ",item.name) as name FROM equipment
        LEFT JOIN ${typeField} ON (equipment.${slotField}_id=${typeField}.id)
        LEFT JOIN item ON (weapon.item_id=item.id)
        LEFT JOIN modifier_${typeField} ON (equipment.${slotField}_modifier_id=modifier_${typeField}.id)
        WHERE player_id="${message.author.id}" AND weapon_id>0 LIMIT 1`);
    if (cekEquipment.length > 0) {
        let cekArmory = await queryData(`SELECT ${slotField}_id as id,${slotField}_modifier_id as modifier_id FROM armory WHERE player_id="${message.author.id}" ORDER BY id ASC LIMIT 5`);
        if (cekArmory.length < 5) {
            queryData(`CALL unequip_${slotField}_procedure(${message.author.id}, ${cekArmory[args2].id}, ${cekArmory[args2].modifier_id})`);
            message.channel.send('done')
        } else {
             message.reply('your armory is full');
        }
    } else {    
        return message.channel.send(`\\⛔ | **${message.author.username}**, you are not equipped any weapon!`);
    }
}

export default unOrEquip;