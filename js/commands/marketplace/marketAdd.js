import currencyFormat from "../../helper/currency.js";
import queryData from "../../helper/query.js";
import emojiCharacter from "../../utils/emojiCharacter.js";

async function marketAdd(message, args, commandBody, stat) {
    let argument = commandBody;
    let arrayPrice = argument.match(/\d+/g);
    let arrayName = argument.match(/[a-zA-Z]+/g);
    arrayName = arrayName.splice(2);
    if (args[0] === 'add') {
        if (stat.level < 5) { return message.channel.send(`${emojiCharacter.noEntry} | Level 5+ is required to use this command!`) };
        if (!arrayName.length > 0) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide the item name!\n${emojiCharacter.blank} usage \`tera marketplace add [item name] [price]\``) };
        if (!arrayPrice) { return message.channel.send(`${emojiCharacter.noEntry} | Please provide the price!\n${emojiCharacter.blank} usage \`tera marketplace add [item name] [price]\``) }
        let itemName = '';
        let price = parseInt(arrayPrice[0]);
        if(price <= 0){ return message.channel.send(`${emojiCharacter.noEntry} | You cannot list item with zero price!`) }
        arrayName.forEach(element => {
            if (itemName) {
                itemName += ' ';
            }
            itemName += element;
        });

        // Cek item if Equipment
        let itemEquipment = await queryData(`SELECT TRIM(CONCAT(IFNULL(modifier_weapon.name,''), ' ', item.name)) as weaponName,
            TRIM(CONCAT(IFNULL(helmet_modifier.name,''), ' ', item.name)) as helmetName,
            TRIM(CONCAT(IFNULL(shirt_modifier.name,''), ' ', item.name)) as shirtName,
            TRIM(CONCAT(IFNULL(pants_modifier.name,''), ' ', item.name)) as pantsName
            FROM item
                LEFT JOIN armor ON (item.id = armor.item_id)
                LEFT JOIN weapon ON (item.id = weapon.item_id)
                LEFT JOIN armory as armoryWeapon ON (weapon.id = armoryWeapon.weapon_id)
                LEFT JOIN armory as armoryHelmet ON (armor.id = armoryHelmet.helmet_id)
                LEFT JOIN armory as armoryShirt ON (armor.id = armoryShirt.shirt_id)
                LEFT JOIN armory as armoryPants ON (armor.id = armoryPants.pants_id)
                LEFT JOIN modifier_weapon ON (armoryWeapon.weapon_modifier_id=modifier_weapon.id)
                LEFT JOIN modifier_armor as helmet_modifier ON (armoryHelmet.helmet_modifier_id=helmet_modifier.id)
                LEFT JOIN modifier_armor as shirt_modifier ON (armoryShirt.shirt_modifier_id=shirt_modifier.id)
                LEFT JOIN modifier_armor as pants_modifier ON (armoryPants.pants_modifier_id=pants_modifier.id)
            WHERE armoryWeapon.player_id=${message.author.id} 
            AND armoryHelmet.player_id=${message.author.id} 
            AND armoryShirt.player_id=${message.author.id}
            AND armoryPants.player_id=${message.author.id}`);
        console.log(itemEquipment);
        
        let cekItem = await queryData(`SELECT item.id, item.type_id, item.emoji, item.name, item.is_tradeable, IFNULL(backpack.quantity,0) as quantity FROM item 
            LEFT JOIN backpack ON (item.id = backpack.item_id)
            WHERE backpack.player_id=${message.author.id} AND item.name="${itemName}" LIMIT 1`);
        cekItem = cekItem ? cekItem[0] : undefined;

        if (cekItem) {
            if (cekItem.quantity <= 0) { return message.channel.send(`${emojiCharacter.noEntry} | You don't have this item!`) };
            if (!cekItem.is_tradeable) { return message.channel.send(`${emojiCharacter.noEntry} | This item is not tradeable!`) };
            // Cek limit 
            let marketList = await queryData(`SELECT * FROM marketplace WHERE player_id=${message.author.id} LIMIT 5`);
            if (marketList.length >= 5 && message.author.id !== '668740503075815424') { return message.channel.send(`${emojiCharacter.noEntry} | You can't add more than 5 items on marketplace.`) }
            // Listing the item on market
            queryData(`INSERT marketplace SET guild_id=${message.guild.id}, player_id=${message.author.id}, item_id=${cekItem.id}, price=${price}`)
            // Remove item from player backpack
            queryData(`UPDATE backpack SET quantity = quantity - 1 WHERE player_id=${message.author.id} AND item_id=${cekItem.id} LIMIT 1`);
            
            message.channel.send(`**${message.author.username}** has listing ${cekItem.emoji}**${cekItem.name}** •${emojiCharacter.gold2}__${currencyFormat(price)}__ into the marketplace.`);
        } else {
            message.channel.send(`${emojiCharacter.noEntry} | Cannot recognize the item name!`)
        }
    }
}

export default marketAdd;