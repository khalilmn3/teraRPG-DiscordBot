import queryData from "../helper/query.js";
import emojiCharacter from "../utils/emojiCharacter.js";
import { equipProcedure, unequipProcedure } from "../utils/processQuery.js";

async function unOrEquip(message, command, args1, commandBody, stat) {
    if (command === 'equip'){
        if (args1) {
            let arrayName = commandBody.match(/[a-zA-Z]+/g);
            let itemName = '';
            arrayName = arrayName.splice(1);
            
            arrayName.forEach(element => {
                if (itemName) {
                    itemName += ' ';
                }
                itemName += element;
            });
            
            let item = isNaN(parseInt(args1)) ? itemName : args1;
                    
            queryEquip(message, item, stat);
        } else {
            message.channel.send(`use \`equip <armory ID>\`, e.g. \`tera equip 3\``);
        }
    } else if (command === 'unequip') {
            if (args1 === 'weapon') {
                queryUnequip(message, args1);
            } else if (args1 === 'helmet') {
                queryUnequip(message, args1);
            } else if (args1 === 'shirt') {
                queryUnequip(message, args1);
            } else if (args1 === 'pants') {
                queryUnequip(message, args1);
            } else {
                message.channel.send(`use \`unequip <eq type>\`, e.g. \`weapon\`|\`helmet\`|\`shirt\`|\`pants\``);
            }
    }
}

async function queryEquip(message, args1, stat) {
    let slotField = '';
    let typeField = '';
    let queryItem = isNaN(parseInt(args1)) ? `TRIM(CONCAT(IFNULL(modifier.name,''),' ',item.name)) LIKE "${args1}%"` : `armory2.id=${args1}`;
    let cekArmory = await queryData(`SELECT TRIM(CONCAT(IFNULL(modifier.name,''),' ',item.name)) as name,
         item.emoji, item.type_id, armory2.id,
         armory2.modifier_id, armory2.item_id, IFNULL(armor.id,weapon.id) as equip_id,
         IF(item.type_id=9,weapon.level_required, armor.level_required) as level
        FROM armory2
        LEFT JOIN item ON (armory2.item_id=item.id)
        LEFT JOIN armor ON (item.id=armor.item_id)
        LEFT JOIN weapon ON (item.id=weapon.item_id)
        LEFT JOIN modifier ON (armory2.modifier_id=modifier.id)
        WHERE player_id="${message.author.id}"
        AND ${queryItem}
        ORDER BY armory2.id ASC
        LIMIT 1`);
    cekArmory = cekArmory ? cekArmory[0] : undefined;

    if (cekArmory) {
        if (cekArmory.type_id == 9) {
            slotField = 'weapon'
            typeField = 'weapon';
        } else if (cekArmory.type_id == 21) {
            typeField = 'armor';
            slotField = 'helmet'
        } else if (cekArmory.type_id == 22) {
            typeField = 'armor';
            slotField = 'shirt'
        } else if (cekArmory.type_id == 23) {
            typeField = 'armor';
            slotField = 'pants'
        }
        if (cekArmory.level > stat.level) { return message.channel.send(`${emojiCharacter.noEntry} | You are not a high enough level to equip this item.`) };
        // Get equipped item
        let cekEquipment = await queryData(`SELECT COUNT(*) as count, item.emoji, IFNULL(item.id,0) as item_id, IFNULL(equipment.${slotField}_modifier_id,0) as modifier_id, CONCAT(IFNULL(modifier_${typeField}.name,"")," ",item.name) as name FROM equipment
            LEFT JOIN ${typeField} ON (equipment.${slotField}_id=${typeField}.id)
            LEFT JOIN item ON (${typeField}.item_id=item.id)
            LEFT JOIN modifier_${typeField} ON (equipment.${slotField}_modifier_id=modifier_${typeField}.id)
            WHERE player_id="${message.author.id}" AND equipment.${slotField}_id>0 LIMIT 1`);
        
        cekEquipment = cekEquipment.length > 0 ? cekEquipment[0] : undefined;
        equipProcedure(slotField, message.author.id, cekArmory.equip_id, cekArmory.id, cekArmory.item_id, cekEquipment.item_id, cekArmory.modifier_id, cekEquipment.modifier_id);

        // equipProcedure(slotField, message.author.id, cekArmory.equip_id, cekArmory.id, cekArmory.item_id, cekEquipment.item_id, cekArmory.modifier_id, cekEquipment[`${slotField}_modifier_id`], `${slotField}_id`, `${slotField}_modifier_id`);
        message.channel.send(`📥 | equipped ${cekArmory.emoji}**${cekArmory.name}**.`)
    } else {
        message.reply('Item not found, please recheck your armory!');
    }
}

async function queryUnequip(message, args1) {
    let slotField = '';
    let typeField = '';
    let typeId = 0;
    if (args1 === 'weapon') {
        typeField = 'weapon';
        slotField = 'weapon';
        typeId = 9;
    } else if (args1 === 'helmet') {
        typeField = 'armor';
        slotField = 'helmet';
        typeId = 21;
    } else if (args1 === 'shirt') {
        typeField = 'armor';
        slotField = 'shirt';
        typeId = 22;
    } else if (args1 === 'pants') {
        typeField = 'armor';
        slotField = 'pants';
        typeId = 23;
    }

    
    let cekArmorySpace = await queryData(`SELECT COUNT(*) as Total FROM armory2
        LEFT JOIN item ON (armory2.item_id=item.id)
        WHERE player_id="${message.author.id}" AND item.type_id=${typeId} LIMIT 5`);
    
    if (cekArmorySpace[0].Total >= 5) {
        return message.reply(`⛔ | **${slotField}** armory is full\nyou can only store max 5 items in armory for each type!`);
    }

    let cekEquipment = await queryData(`SELECT item.id as item_id, item.emoji, ${slotField}_id, ${slotField}_modifier_id as modifier_id, CONCAT(IFNULL(modifier_${typeField}.name,"")," ",item.name) as name FROM equipment
        LEFT JOIN ${typeField} ON (equipment.${slotField}_id=${typeField}.id)
        LEFT JOIN item ON (${typeField}.item_id=item.id)
        LEFT JOIN modifier_${typeField} ON (equipment.${slotField}_modifier_id=modifier_${typeField}.id)
        WHERE player_id="${message.author.id}" AND ${slotField}_id>0 LIMIT 1`);
    cekEquipment = cekEquipment.length > 0 ? cekEquipment[0] : undefined;
    if (!cekEquipment) { return message.channel.send(`\\⛔ | **${message.author.username}**, you are not wearing *${slotField}*!`) };
    // let cekArmory = await queryData(`SELECT ${slotField}_id as id,${slotField}_modifier_id as modifier_id FROM armory WHERE player_id="${message.author.id}" ORDER BY id ASC LIMIT 5`);
    // if (cekArmory.length > 0) {
        unequipProcedure(message.author.id, cekEquipment.item_id, cekEquipment.modifier_id, slotField);
        message.channel.send(`📤 | Unequipped ${cekEquipment.emoji}**${cekEquipment.name}**.`)
    // } else {
    //     queryData(`CALL unequip_${slotField}_procedure(${message.author.id}, ${cekEquipment[0]}.${slotField}_id, ${cekEquipment[0]}.${slotField}_modifier_id)`);
    //     message.channel.send('done2')
    // }
    
}

export default unOrEquip;