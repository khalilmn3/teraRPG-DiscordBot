import queryData from "./helper/query.js";
import randomizeChance from "./helper/randomize.js";
import Discord from 'discord.js';
import randomNumber from "./helper/randomNumberWithMinMax.js";
import currencyFormat from "./helper/currency.js";

async function openCrate(client, message, args) {
    if (args.length > 0) {
        let type = args[0].toLowerCase();
        let qty = args.length > 1 && parseInt(args[2]) > 0 ? args[2] : 1;
        let itemId = 'x';
        if (args[1] === 'crate') {
            if (type === 'wooden') {
                itemId = 222
            } else if (type === 'iron') {
                itemId = 223
            } else if (type === 'golden') {
                itemId = 224
            }
            if (itemId === 'x') {
                message.reply('what are you trying to open?\nthe correct argument is \`tera open [crate name] [amount]\` \nex: \`tera open wooden crate 10\`')
                return;
            }
            if (qty > 10) {
                message.reply('you can only open up to 10 crates!');
                return;
            }
            let crate = await queryData(`SELECT item_id, name, emoji, quantity FROM backpack LEFT JOIN item ON (backpack.item_id = item.id) WHERE player_id="${message.author.id}" AND item_id="${itemId}" LIMIT 1`);
            if (crate.length > 0) {
                if (crate[0].quantity >= qty) {
                    // reduce crate from backpack
                    queryData(`UPDATE backpack SET quantity=quantity - ${qty} WHERE player_id="${message.author.id}" AND item_id="${itemId}"`)
                    let item = await queryData(`SELECT crate_item.id_sort, item.id, item.emoji, item.name as itemName, crate_item.chance, crate_item.min, crate_item.max FROM crate_item 
                        LEFT JOIN item ON (crate_item.item_id=item.id)
                        LEFT JOIN item as crate ON (crate_item.crate_item_id=item.id)
                        WHERE crate_item.crate_item_id="${itemId}"`)
                    let randomItem = 0;
                    let itemGot = [];
                    for (let x = 0; x < qty; x++) {
                        randomItem = randomizeChance(item)
                        if (randomItem !== 0) {
                            let qtyX = randomNumber(randomItem.min, randomItem.max);
                            if (itemGot.length > 0) {
                                let sum = false;
                                for (let i = 0; i < itemGot.length; i++) {
                                    if (randomItem.id === itemGot[i].id) {
                                        itemGot[i].qty += qtyX
                                        sum = true;
                                        break;
                                    }
                                }
                                if (!sum) {
                                    itemGot.push({
                                        id_sort: randomItem.id_sort,
                                        id: randomItem.id,
                                        name: randomItem.itemName,
                                        emoji: randomItem.emoji,
                                        qty: qtyX
                                    });
                                }
                            } else {
                                itemGot.push({
                                    id_sort: randomItem.id_sort,
                                    id: randomItem.id,
                                    name: randomItem.itemName,
                                    emoji: randomItem.emoji,
                                    qty: qtyX
                                });
                            }
                        }
                    }

                    // sorting item
                    itemGot.sort((a, b) => {
                        if (a.id_sort < b.id_sort) {
                            return -1;
                        } else if (a.id_sort > b.id_sort) {
                            return 1;
                        }
                
                        return 0;
                    });

                    let itemData = '';
                    itemGot.forEach(element => {
                        itemData += `${element.emoji} ${element.name} x${currencyFormat(element.qty)}\n`
                        // add item into backpack
                        if (element.id == '264') {
                            // gold coin
                            queryData(`UPDATE stat SET gold = gold + ${element.qty} WHERE player_id="${message.author.id}" LIMIT 1`)
                        } else {
                            queryData(`CALL insert_item_backpack_procedure("${message.author.id}", "${element.id}", "${element.qty}")`);
                        }
                    });
                    if (itemData !== '') {
                        let itemMessage = new Discord.MessageEmbed({
                            type: "rich",
                            description: null,
                            url: null,
                            color: 10115509,
                            fields: [{
                                name: 'Crate opened!',
                                value: itemData,
                                inline: false,
                            }],
                            files: []
                        });
                        message.channel.send(`${crate[0].emoji} | **${message.author.username}** is opening ${qty} **${crate[0].name}**...`, itemMessage)
                    } else {
                        message.reply('no data found')
                    }
                } else {
                    message.reply(`You dont have that much item on your backpack`)
                }
            } else {
                message.reply(`You dont have that item on your backpack`)
            }
        } else if (args[0] === 'starter' && args[1] === 'pack' || args[0] === 'sp') {
            let cekStarterPack = await queryData(`SELECT quantity FROM backpack WHERE player_id="${message.author.id}" AND item_id="282" AND quantity>0 LIMIT 1`);
            if (cekStarterPack.length > 0) {
                let itemMessage = new Discord.MessageEmbed({
                    type: "rich",
                    description: null,
                    url: null,
                    color: 10115879,
                    fields: [{
                        name: '🎁 Starter pack opened!',
                        value: `
                        \`x1\`  <:hand_knife:826083566881472552> \`hand knife\`       
                        \`x1\`  <:Angler_Hat:826083566906638426> \`cool hat\`
                        \`x1\`  <:Angler_Vest:826083566940979200> \`black shirt\`
                        \`x1\`  <:Angler_Pants:826083566525349919> \`black pants\`
                        \`x10\` <:Healing_Potion:810747622859735100> \`healing potion\`
                        `,
                        inline: false,
                    }],
                    files: [],
                    footer: {
                        text: `Find more rewards on \`tera daily/weekly/vote\``,
                        iconURL: null,
                        proxyIconURL: null
                    },
                });
                let equipment = await queryData(`SELECT * FROM equipment WHERE player_id="${message.author.id}" LIMIT 1`);
                if (equipment.length > 0 && (equipment[0].helmet_id || equipment[0].weapon_id || equipment[0].shirt_id || equipment[0].pants_id)) {
                    return message.channel.send(`\\⛔ | **${message.author.username}**, you can't open 🎁**starter pack** while wearing\nan armor/weapon, unequipped it than try again`)
                }
                let weaponID = 'weapon_id="16"';
                let helmetID = 'helmet_id="22"';
                let shirtID = 'shirt_id="23"';
                let pantsID = 'pants_id="24"';
                queryData(`INSERT equipment SET ${weaponID}, ${helmetID}, ${shirtID}, ${pantsID}, player_id="${message.author.id}"
                    ON DUPLICATE KEY UPDATE ${weaponID}, ${helmetID}, ${shirtID}, ${pantsID}`);
                queryData(`UPDATE backpack SET quantity=0 WHERE player_id="${message.author.id}" AND item_id="282" LIMIT 1`);
                queryData(`CALL insert_item_backpack_procedure(${message.author.id}, 266, 10)`);

                message.channel.send(itemMessage);
            } else {
                message.channel.send('You have opened your 🎁**starter pack**!');
            }
        }
    }
}


export default openCrate;