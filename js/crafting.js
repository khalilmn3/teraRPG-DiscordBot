import queryData from "./helper/query.js";
import Discord from "discord.js";

const furnaceId = '171';
const workbenchId = '170';
const anvilId = '173';
const copperBarId = '22';
const ironBarId = '24';
const copperOreId = '1';
const ironOreId = '3';
const silverOreId = '5';
const silverBarId = '26';
const tungstenOreId = '6';
const tungstenBarId = '27';
const goldOreId = '7';
const goldBarId = '28';
const platinumOreId = '8';
const platinumBarId = '30';
let date = new Date();

async function crafting(message, args1, args2, args3) {
    const id = message.author.id;
    const username = message.author.username;
    const avatar = message.author.avatar;
    if (args1 === 'work' && args2 === 'bench') {
        let existTools = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${id}" AND item_id_work_bench="170" LIMIT 1`);
        // console.log(existTools);
        if (existTools.length > 0) {
            message.reply(`you already had this item in your workspace`);
        } else {
            let existMaterials = await queryData(`SELECT item_id FROM backpack WHERE item_id="179" AND player_id="${id}" AND quantity>="10"`);
            if (existMaterials.length > 0) {
                queryData(`UPDATE tools SET item_id_work_bench="170" WHERE player_id="${id}"`)
                queryData(`UPDATE backpack SET quantity=quantity-10 WHERE player_id="${id}" AND item_id="179"`)
                message.channel.send(`**${message.author.username}** has successfully crafted <:Work_Bench:804145756918775828> **${args1} ${args2}**`)
            } else {
                message.reply(`you don't have enough materials to craft <:Work_Bench:804145756918775828> **${args1} ${args2}**,\ngo work and get the materials it need!`)

                // TODO Check material required
                // message.channel.send(new Discord.MessageEmbed({
                //     "type": "rich",
                //     "title": null,
                //     "description": null,
                //     "url": null,
                //     "color": 10115509,
                //     "timestamp": null,
                //     "fields": [{
                //         "value": `:white_check_mark: Wood x10`,
                //         "name": "Materials required (Work Bench)",
                //         "inline": true
                //     }],
                //     "thumbnail": null,
                //     "image": null,
                //     "video": null,
                //     "author": null,
                //     "provider": null,
                //     "footer": {
                //         text: `${username} | Today at ${date.getHours()}:${date.getMinutes()}`
                //     },
                //     "files": []
                // }))
            }
        }
    } else if (args1 === 'furnace') {
        let existTools = await queryData(`SELECT item_id_furnace FROM tools WHERE player_id="${id}" AND item_id_furnace="171" LIMIT 1`);
        if (existTools.length > 0) {
            message.reply(`you already had this item in your workspace`);
        } else {
            let existWorkbench = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${id}" AND item_id_work_bench="170" LIMIT 1`);
            if (existWorkbench.length > 0) {
                let existMaterials = await queryData(`SELECT item_id FROM backpack WHERE player_id="${id}" AND (item_id="179" AND quantity>="7" OR item_id="1" AND quantity>="15")`);
                if (existMaterials.length > 1) {
                    queryData(`UPDATE tools SET item_id_furnace="171" WHERE player_id="${id}"`)
                    queryData(`UPDATE backpack SET quantity=quantity-7 WHERE player_id="${id}" AND item_id="179"`) //wood
                    queryData(`UPDATE backpack SET quantity=quantity-15 WHERE player_id="${id}" AND item_id="1"`) // copper ore
                    message.channel.send(`**${message.author.username}** has successfully crafted <:Furnace:804145327513796688> **${args1}**`)
                } else {
                    message.reply(`you don't have enough materials to craft <:Furnace:804145327513796688> **${args1}**,\ngo work and get the materials it need`)
                }
            } else {
                message.reply(`:no_entry_sign: | you need <:Work_Bench:804145756918775828> **work bench** to craft this item.`)
            }
        }
    } else if (args1 === 'anvil') {
        let existTools = await queryData(`SELECT item_id_anvil FROM tools WHERE player_id="${id}" AND item_id_anvil="173" LIMIT 1`);
        if (existTools.length > 0) {
            message.reply(`you already had this item in your workspace`);
        } else {
            let existWorkbench = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${id}" AND item_id_work_bench="170" LIMIT 1`);
            if (existWorkbench.length > 0) {
                let existMaterials = await queryData(`SELECT item_id FROM backpack WHERE player_id="${id}" AND item_id="24" AND quantity>="5"`);
                if (existMaterials.length > 0) {
                    queryData(`UPDATE tools SET item_id_anvil="173" WHERE player_id="${id}"`)
                    queryData(`UPDATE backpack SET quantity=quantity-5 WHERE player_id="${id}" AND item_id="24"`)
                    message.channel.send(`**${message.author.username}** has successfully crafted <:Iron_Anvil:804145327435284500> **${args1}**`)
                } else {
                    message.reply(`you don't have enough materials to craft <:Iron_Anvil:804145327435284500> **${args1}**,\ngo work and get the materials it need`)
                }
            } else {
                message.reply(`:no_entry_sign: | you need <:Work_Bench:804145756918775828> **work bench** to craft this item.`)
            }
        }

        // Craft Bar
    } else if (args1 === 'copper' && args2 === 'bar') {
        craftBar(message, id, username, copperBarId, copperOreId, '<:Copper_Bar:803907956478836817>', args1, args2, args3);
    } else if (args1 === 'iron' && args2 === 'bar') {
        craftBar(message, id, username, ironBarId, ironOreId, '<:Iron_Bar:803907956528906241>', args1, args2, args3);
    } else if (args1 === 'silver' && args2 === 'bar') {
        craftBar(message, id, username, silverBarId, silverOreId, '<:Silver_Bar:803907956663910410>', args1, args2, args3);
    } else if (args1 === 'tungsten' && args2 === 'bar') {
        craftBar(message, id, username, tungstenBarId, tungstenOreId, '<:Tungsten_Bar:803907956252344331>', args1, args2, args3);
    } else if (args1 === 'gold' && args2 === 'bar') {
        craftBar(message, id, username, goldBarId, goldOreId, '<:Gold_Bar:803907956424441856>', args1, args2, args3);
    } else if (args1 === 'platinum' && args2 === 'bar') {
        craftBar(message, id, username, platinumBarId, platinumOreId, '<:Platinum_Bar:803907956327317524>', args1, args2, args3);
    } else if (args2 === 'sword') {
        craftWeapon(message, id, username, args1, args2)
    } else if (args2 === 'helmet' || args2 === 'breastplate' || args2 === 'chainmail' || args2 === 'greaves') {
        craftArmor(message, id, username, args1, args2)
    } else if (args1 === 'list') {
    }else if (args1 === 'list') {
        if (args2 === '2') {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 2 [Equipments], \`available list <1,2,3>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Copper_Broadsword:822687359131844630>__copper sword__ : 10 <:Copper_Bar:803907956478836817> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Copper_Helmet:822686919574028318>__copper helmet__ : 15 <:Copper_Bar:803907956478836817> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Copper_Chainmail:822686919603388426>__copper chainmail__ : 20 <:Copper_Bar:803907956478836817> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Copper_Greaves:822686919636680714>__copper greaves__ : 18 <:Copper_Bar:803907956478836817> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 5",
                        inline: false
                    },{
                        value: `<:Iron_Broadsword:822685694995464202>__iron sword__ : 10 <:Iron_Bar:803907956528906241> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Iron_Helmet:822686919607058463>__iron helmet__ : 15 <:Iron_Bar:803907956528906241> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Iron_Chainmail:822686919611514881>__iron chainmail__ : 25 <:Iron_Bar:803907956528906241> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Iron_Greaves:822686919623573525>__iron greaves__ : 20 <:Iron_Bar:803907956528906241> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 10",
                        inline: false
                    },{
                        value: `<:Silver_Shortsword:822687140777295874>__silver sword__ : 12 <:Silver_Bar:803907956663910410> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Silver_Helmet:822686919371784223>__silver helmet__ : 15 <:Silver_Bar:803907956663910410> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Silver_Chainmail:822686919855046656>__silver chainmail__ : 27 <:Silver_Bar:803907956663910410> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Silver_Greaves:822686920168701982>__silver greaves__ : 21 <:Silver_Bar:803907956663910410> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 15",
                        inline: false
                    }],
                provider: null,
                // timestamp: new Date(),
            }))
        }
        else if (args2 === '3') {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 3 [Equipments], \`available list <1,2,3>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Tungsten_Broadsword:822687254890938378>__tungsten sword__ : 20 <:Tungsten_Bar:803907956252344331> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Tungsten_Helmet:822686919431028799>__tungsten helmet__ : 15 <:Tungsten_Bar:803907956252344331> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Tungsten_Chainmail:822686919980875786>__tungsten chainmail__ : 25 <:Tungsten_Bar:803907956252344331> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Tungsten_Greaves:822686919967375384>__tungsten greaves__ : 20 <:Tungsten_Bar:803907956252344331> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 25",
                        inline: false
                    },{
                        value: `<:Gold_Broadsword:822687140823040066>__gold sword__ : 20 <:Gold_Bar:803907956424441856> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Gold_Helmet:822686919607451708>__gold helmet__ : 15 <:Gold_Bar:803907956424441856> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Gold_Chainmail:822686919510589441>__gold chainmail__ : 25 <:Gold_Bar:803907956424441856> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Gold_Greaves:822686919611514880>__gold greaves__ : 20 <:Gold_Bar:803907956424441856> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 35",
                        inline: false
                    },{
                        value: `<:Platinum_Broadsword:822687140797874246>__platinum sword__ : 25 <:Platinum_Bar:803907956327317524> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Platinum_Helmet:822686919820967977>__platinum helmet__ : 30 <:Platinum_Bar:803907956327317524> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Platinum_Chainmail:822686919552008203>__platinum chainmail__ : 50 <:Platinum_Bar:803907956327317524> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Platinum_Greaves:822686919787544627>__platinum greaves__ : 40 <:Platinum_Bar:803907956327317524> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 50",
                        inline: false
                    }],
                provider: null,
                // timestamp: new Date(),
            }))
        } else {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 1 , \`available list <1,2,3>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Wooden_Sword:805054340435148800>__wooden sword__ : 20 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>` +
                            `\n<:Wood_Helmet:805054256063315969>__wooden helmet__ : 15 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>` +
                            `\n<:Wood_Breastplate:805054297435275264>__wooden breastplate__ : 25 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>` +
                            `\n<:Wood_Greaves:805054271736250439>__wooden greaves__ : 20 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>`,
                        name: "Equipments",
                        inline: false
                    },
                    {
                        value: `<:Work_Bench:804145756918775828>__work bench__ : 10 <:Wood:804704694420766721> ➜ hand\n<:Furnace:804145327513796688> __furnace__ : 7 <:Wood:804704694420766721> + 15 <:Copper_Ore:803930190266630144> ➜ <:Work_Bench:804145756918775828>\n<:Iron_Anvil:804145327435284500>__anvil__ : 5 <:Iron_Bar:803907956528906241> ➜ <:Furnace:804145327513796688>\n`,
                        name: "Tools",
                        inline: false
                    },
                    {
                        value: '<:Copper_Bar:803907956478836817>__copper bar__ : 10 <:Copper_Ore:803930190266630144> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Iron_Bar:803907956528906241>__iron bar__ : 10 <:Iron_Ore:803930082782609439> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Silver_Bar:803907956663910410>__silver bar__ : 10 <:Silver_Ore:803930635613372416> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Tungsten_Bar:803907956252344331>__tungsten bar__ : 10 <:Tungsten_Ore:803930285187006495> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Gold_Bar:803907956424441856>__gold bar bar__ : 10 <:Gold_Ore:803930116270587914> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Platinum_Bar:803907956327317524>__platinum bar__ : 10 <:Platinum_Ore:803930281547399229> ➜ <:Furnace:804145327513796688>',
                        name: "Bars",
                        inline: false
                    }],
                provider: null,
                // timestamp: new Date(),
            }))
        }
    } else {
        message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
    }
}


async function craftBar(message,playerId,username, itemIdCrafted, itemIdMaterial, emoji,  args1, args2, args3) {
    let existWorkbench = await queryData(`SELECT item_id_furnace FROM tools WHERE player_id="${playerId}" AND item_id_furnace="${furnaceId}" LIMIT 1`);
        let qty = 1;
        if (parseInt(args3) > 0) {
            qty = parseInt(args3);
        }
        let materialsReq = qty * 10;
        if (existWorkbench.length > 0) {
            let existMaterials = await queryData(`SELECT item_id, quantity FROM backpack WHERE player_id="${playerId}" AND item_id="${itemIdMaterial}" AND quantity>="${materialsReq}"`);
            if (existMaterials.length > 0) {
                if (args3 === 'all') {
                    qty = Math.round(existMaterials[0].quantity / 10);
                    materialsReq = qty * 10;
                }
                let amount = await queryData(`CALL insert_item_backpack_procedure("${playerId}", "${itemIdCrafted}", "${qty}")`);
                amount = amount.length > 0 ? amount[0][0]['@qty'] : 0;
                queryData(`UPDATE backpack SET quantity=quantity-${materialsReq} WHERE player_id="${playerId}" AND item_id="${itemIdMaterial}"`)
                message.channel.send(`<:Furnace:804145327513796688> | **${username}** has successfully crafted x${qty} ${emoji} **${args1} ${args2}**, \nYou now have x${amount} ${emoji} **${args1} ${args2}** in your backpack`)
            } else {
                message.reply(`:no_entry_sign: | you don't have enough materials to craft x${qty} ${emoji} **${args1} ${args2}**,\ngo work and get the materials it need, you can also check crafter material receipts with \`tera craft\`!`)
            }
        } else {
            message.reply(`:no_entry_sign: | you need <:Furnace:804145327513796688> **furnace** to craft this item!`)
        }
}

async function craftWeapon(message, playerId, username, args1, args2) {
    const weaponList = await queryData('SELECT weapon.id, item.name, item.emoji FROM weapon LEFT JOIN item ON (weapon.item_id = item.id) WHERE weapon.id<=7');
    let weaponCraft;
    weaponList.forEach(element => {
        let name = element.name;
        if (name.toString().toLowerCase() === `${args1} ${args2}`) {
            weaponCraft = element
        }
    });
    // console.log(weaponList);
    if (!weaponCraft) return;
    let existStations = [];
    if (args1 === 'wooden') {
        existStations = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${playerId}" AND item_id_work_bench="170" LIMIT 1`);
    } else {
        existStations = await queryData(`SELECT item_id_anvil FROM tools WHERE player_id="${playerId}" AND item_id_anvil=173 LIMIT 1`);
    }
    let level = await queryData(`SELECT level FROM stat WHERE player_id=${playerId} LIMIT 1`);
    console.log('level:' + level);
    if (level.length > 0) {
        level = level[0].level;
    } else {
        level = 0;
    }
    if (existStations.length > 0) {
        let existItem = await queryData(`SELECT weapon_id FROM equipment WHERE player_id="${playerId}" AND weapon_id=${weaponCraft.id} LIMIT 1`);
        if (existItem.length > 0) {
            message.channel.send(`**${username}**, you already have this item`)
        } else {
            if (args1 === 'wooden' && args2 === 'sword') {
                let materialList = [
                    { id: 179, name: 'wood', quantity: 20 }
                ];
                queryEquipment(message, playerId, level, weaponCraft, materialList, 1, 1);
            } else if (args1 === 'copper' && args2 === 'sword') {
                let materialList = [
                    { id: copperBarId, name: 'copper bar', quantity: 10 }
                ];
                queryEquipment(message, playerId, level, weaponCraft, materialList, 1, 2);
            } else if (args1 === 'iron' && args2 === 'sword') {
                let materialList = [
                    { id: ironBarId, name: 'iron bar', quantity: 10 }
                ];
                queryEquipment(message, playerId, level, weaponCraft, materialList, 1, 3);
            } else if (args1 === 'silver' && args2 === 'sword') {
                let materialList = [
                    { id: silverBarId, name: 'silver bar', quantity:12 }
                ];
                queryEquipment(message, playerId, level, weaponCraft, materialList, 1, 4);
            } else if (args1 === 'tungsten' && args2 === 'sword') {
                let materialList = [
                    { id: tungstenBarId, name: 'tungsten bar', quantity: 20 }
                ];
                queryEquipment(message, playerId, level, weaponCraft, materialList, 1, 5);
            } else if (args1 === 'gold' && args2 === 'sword') {
                let materialList = [
                    { id: goldBarId, name: 'gold bar', quantity: 20 }
                ];
                queryEquipment(message, playerId, level, weaponCraft, materialList, 1, 6);
            } else if (args1 === 'platinum' && args2 === 'sword') {
                let materialList = [
                    { id: platinumBarId, name: 'platinum bar', quantity: 25 }
                ];
                queryEquipment(message, playerId, level, weaponCraft, materialList, 1, 7);
            } 
        }
    } else {
        let stations = '';
        if (args1 === 'wooden' && args2 === 'sword') {
            stations = '<:Work_Bench:804145756918775828> **Work Bench**';
        } else {
            stations = '<:Iron_Anvil:804145327435284500> **Anvil**';
        }
        message.reply(`:no_entry_sign: | you need ${stations} to craft this item!`)
    }
}

async function craftArmor(message, playerId, username, args1, args2) {
    const armorList = await queryData('SELECT armor.id, item.name, item.emoji FROM armor LEFT JOIN item ON (armor.item_id = item.id) WHERE armor.armor_set_id<=9');
    let armorCraft;
    armorList.forEach(element => {
        let name = element.name;
        if (name.toString().toLowerCase() === `${args1} ${args2}`) {
            armorCraft = element
        }
    });
    // console.log(armorList)
    if (!armorCraft) return;
    let existStations = [];
    if (args1 === 'wooden') {
        existStations = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${playerId}" AND item_id_work_bench="170" LIMIT 1`);
    } else {
        existStations = await queryData(`SELECT item_id_anvil FROM tools WHERE player_id="${playerId}" AND item_id_anvil=173 LIMIT 1`);
    }
    let level = await queryData(`SELECT level FROM stat WHERE player_id=${playerId} LIMIT 1`);
    if (level.length > 0) {
        level = level[0].level;
    } else {
        level = 0;
    }
    if (existStations.length > 0) {
            if (args1 === 'wooden') {
                if (args2 === 'helmet') {
                    let materialList = [
                        {id: 179, name: 'wood', quantity: 15}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 2, 1);
                } else if (args2 === 'breastplate') {
                    let materialList = [
                        {id: 179, name: 'wood', quantity: 25}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 3, 2);
                } else if (args2 === 'greaves') {
                    let materialList = [
                        {id: 179, name: 'wood', quantity: 20}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 4, 3);
                } else {
                    message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
                }
            } else if (args1 === 'cooper') {
                if (args2 === 'helmet') {
                    let materialList = [
                        {id: 22, name: 'cooper bar', quantity: 15}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 2, 4);
                } else if (args2 === 'chainmail') {
                    let materialList = [
                        {id: 22, name: 'cooper bar', quantity: 25}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 3, 5);
                } else if (args2 === 'greaves') {
                    let materialList = [
                        {id: 22, name: 'cooper bar', quantity: 20}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 4, 6);
                } else {
                    message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
                }
            } else if (args1 === 'iron') {
                if (args2 === 'helmet') {
                    let materialList = [
                        {id: 24, name: 'iron bar', quantity: 15}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 2, 7);
                } else if (args2 === 'chainmail') {
                    let materialList = [
                        {id: 24, name: 'iron bar', quantity: 25}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 3, 8);
                } else if (args2 === 'greaves') {
                    let materialList = [
                        {id: 24, name: 'iron bar', quantity: 20}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 4, 9);
                } else {
                    message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
                }
            } else if (args1 === 'silver') {
                if (args2 === 'helmet') {
                    let materialList = [
                        {id: 26, name: 'silver bar', quantity: 15}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 2, 10);
                } else if (args2 === 'chainmail') {
                    let materialList = [
                        {id: 26, name: 'silver bar', quantity: 27}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 3, 11);
                } else if (args2 === 'greaves') {
                    let materialList = [
                        {id: 26, name: 'silver bar', quantity: 21}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 4, 12);
                } else {
                    message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
                }
            } else if (args1 === 'tungsten') {
                if (args2 === 'helmet') {
                    let materialList = [
                        {id: 27, name: 'tungsten bar', quantity: 15}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 2, 13);
                } else if (args2 === 'chainmail') {
                    let materialList = [
                        {id: 27, name: 'tungsten bar', quantity: 25}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 3, 14);
                } else if (args2 === 'greaves') {
                    let materialList = [
                        {id: 27, name: 'tungsten bar', quantity: 20}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 4, 15);
                } else {
                    message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
                }
            } else if (args1 === 'gold') {
                if (args2 === 'helmet') {
                    let materialList = [
                        {id: 28, name: 'gold bar', quantity: 15}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 2, 16);
                } else if (args2 === 'chainmail') {
                    let materialList = [
                        {id: 28, name: 'gold bar', quantity: 25}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 3, 17);
                } else if (args2 === 'greaves') {
                    let materialList = [
                        {id: 28, name: 'gold bar', quantity: 20}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 4, 18);
                } else {
                    message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
                }
            } else if (args1 === 'platinum') {
                if (args2 === 'helmet') {
                    let materialList = [
                        {id: 30, name: 'platinum bar', quantity: 30}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 2, 19);
                } else if (args2 === 'chainmail') {
                    let materialList = [
                        {id: 30, name: 'platinum bar', quantity: 50}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 3, 20);
                } else if (args2 === 'greaves') {
                    let materialList = [
                        {id: 30, name: 'platinum bar', quantity: 40}
                    ]
                    queryEquipment(message, playerId, level, armorCraft, materialList, 4, 21);
                } else {
                    message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
                }
            } else {
                message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
            }
        
    } else {
        let stations = '';
        if (args1 === 'wooden' && args2 === 'sword') {
            stations = '<:Work_Bench:804145756918775828> **Work Bench**';
        } else {
            stations = '<:Iron_Anvil:804145327435284500> **Anvil**';
        }
        message.reply(`:no_entry_sign: | you need ${stations} to craft this item!`)
    }
}

async function queryEquipment(message, playerId, level, armorCraft, materialList, equipmentSlot, equipmentTypeId) {
    // EQUIPMENT SLOT
    // 1 = WEAPON
    // 2 = HELMET
    // 3 = SHIRT
    // 4 = PANTS
    // console.log(equipmentSlot);
    // console.log(level);
    if (equipmentSlot > 1) { //ARMOR
        if ((equipmentTypeId == 4 || equipmentTypeId == 5 || equipmentTypeId == 6) && level < 5) {
            message.reply(`⛔ | your level is not eligable to craft this item!`);
            return;
        } else if ((equipmentTypeId == 7 || equipmentTypeId == 8 || equipmentTypeId == 9) && level < 10) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if ((equipmentTypeId == 10 || equipmentTypeId == 11 || equipmentTypeId == 12) && level < 15) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if ((equipmentTypeId == 13 || equipmentTypeId == 14 || equipmentTypeId == 15) && level < 25) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if ((equipmentTypeId == 16 || equipmentTypeId == 17 || equipmentTypeId == 18) && level < 35) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if ((equipmentTypeId == 19 || equipmentTypeId == 20 || equipmentTypeId == 21) && level < 50) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        }
    } else { // WEAPON
        if (equipmentTypeId == 2 && level < 5) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if (equipmentTypeId == 3 && level < 10) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if (equipmentTypeId == 4 && level < 15) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if (equipmentTypeId == 5 && level < 25) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if (equipmentTypeId == 6 && level < 35) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        } else if (equipmentTypeId == 7 && level < 55) {
            message.reply(`⛔ | your level is not eligable to craft this item!`)
            return;
        }
    }
    let equipmentType = equipmentSlot == 1 ? 'weapon_id' : equipmentSlot == 2 ? 'helmet_id' : equipmentSlot == 3 ? 'shirt_id' : 'pants_id';
    let existItem = await queryData(`SELECT ${equipmentType} FROM equipment WHERE player_id="${playerId}" AND ${equipmentType}=${equipmentTypeId} LIMIT 1`);
    if (existItem.length > 0) {
        message.channel.send(`**${message.author.username}**, you already have this item`);
        return;
    }
    let parameters1 = '';
    materialList.forEach((value) => {
        parameters1 += ` AND item_id=${value.id} AND quantity>=${value.quantity}`;
    })
    let existMaterials = await queryData(`SELECT item_id FROM backpack WHERE player_id="${playerId}" ${parameters1} LIMIT 1`);
    if (existMaterials.length > 0) { 
        materialList.forEach((value) => {
            queryData(`UPDATE backpack SET quantity=quantity - ${value.quantity} WHERE player_id="${playerId}" AND item_id=${value.id} LIMIT 1`);
        });
        queryData(`INSERT INTO equipment SET ${equipmentType}=${equipmentTypeId}, player_id="${playerId}" ON DUPLICATE KEY UPDATE ${equipmentType}=${equipmentTypeId}`)
        message.channel.send(`**${message.author.username}** has successfuly crafted ${armorCraft.emoji} **${armorCraft.name}**`);
        return;
    } else {
        message.reply(`:no_entry_sign: | you don't have enough materials to craft ${armorCraft.emoji} **${armorCraft.name}**,\ngo work and get the materials it need, you can also check crafter material receipts with \`tera craft list\`!`)
        return;
    } 
}


export default crafting