import queryData from "./helper/query.js";
import Discord from "discord.js";
import { variable, materialList } from "./helper/variable.js";
import questProgress from "./utils/questProgress.js";

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

async function crafting(message, commandsBody, args1, args2, args3) {
    commandsBody = commandsBody.slice(6);
    // console.log(commandsBody);
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
    } else if (commandsBody === 'ice blade'
        || commandsBody === 'mandible blade'
        || commandsBody === 'blade of grass'
        || commandsBody === 'night edge'
        || commandsBody === 'blood butcherer'
        || commandsBody === 'fiery greatsword'
        || args2 === 'sword'
    ) {
        let existEq = await cekEquipment('sword', message.author.id);
        if (existEq) {
            return message.channel.send(`\\⛔ | **${message.author.username}**, there is no slot on your equipment \nfree up the slot than try again, you can \`sell/unequip\` it`)
        }
        craftWeapon(message, id, username, commandsBody, args1, args2)
    } else if (args2 === 'helmet' || (args1 === 'wooden' && args2 === 'breastplate') || args2 === 'chainmail' || args2 === 'greaves'
        || args2 === 'leggings'
        || commandsBody === 'frost helmet'
        || commandsBody === 'frost breastplate'
        || commandsBody === 'frost leggings'
        || commandsBody === 'fossil helmet'
        || commandsBody === 'fossil plate'
        || commandsBody === 'fossil greaves'
        || commandsBody === 'jungle hat'
        || commandsBody === 'jungle shirt'
        || commandsBody === 'jungle pants'
        || commandsBody === 'shadow helmet'
        || commandsBody === 'shadow scalemail'
        || commandsBody === 'shadow greaves'
        || commandsBody === 'crimson helmet'
        || commandsBody === 'crimson scalemail'
        || commandsBody === 'crimson greaves'
        || commandsBody === 'forbidden mask'
        || commandsBody === 'forbidden robes'
        || commandsBody === 'forbidden treads') {
        let existEq = await cekEquipment(args2, message.author.id);
        if (existEq) {
            return message.channel.send(`\\⛔ | **${message.author.username}**, there is no slot on your equipment \nfree up the slot than try again, you can \`sell/unequip\` it`)
        }
        craftArmor(message, id, username, commandsBody, args1, args2)
    } else if (args1 === 'list') {
        if (args2 === '2') {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 2 [Equipments], \`available list <1,2,3,4,5>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Copper_Broadsword:822687359131844630>[+15 att]__copper sword__ : 10 <:Copper_Bar:803907956478836817> + 2 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Copper_Helmet:822686919574028318>[+2 def]__copper helmet__ : 15 <:Copper_Bar:803907956478836817> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Copper_Chainmail:822686919603388426>[+3 def]__copper chainmail__ : 20 <:Copper_Bar:803907956478836817> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Copper_Greaves:822686919636680714>[+1 def]__copper greaves__ : 18 <:Copper_Bar:803907956478836817> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 5 [bonus: +5 def ]",
                        inline: false
                    },
                    {
                        value: `<:Ice_Blade:827782178099298325>[+20 att]__ice blade__ : 10 <:Copper_Bar:803907956478836817> + 10 <:Frost_Core:827782125553057802> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Frost_Helmet:827782125549125662>[+2 def]__frost helmet__ : 15 <:Copper_Bar:803907956478836817> + 2 <:Frost_Core:827782125553057802> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Frost_Breastplate:827782125453312010>[+4 def]__frost breastplate__ : 20 <:Copper_Bar:803907956478836817> + 4 <:Frost_Core:827782125553057802> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n <:Frost_Leggings:827782125553320016>[+1 def]__frost leggings__ : 18 <:Copper_Bar:803907956478836817> + 3 <:Frost_Core:827782125553057802> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 7 [bonus: +7 def ]",
                        inline: false
                    },
                    {
                        value: `<:Iron_Broadsword:822685694995464202>[+33 att]__iron sword__ : 7 <:Iron_Bar:803907956528906241> + 5 <:Wood:804704694420766721>➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Iron_Helmet:822686919607058463>[+3 def]__iron helmet__ : 6 <:Iron_Bar:803907956528906241> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Iron_Chainmail:822686919611514881>[+6 def]__iron chainmail__ : 10 <:Iron_Bar:803907956528906241> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Iron_Greaves:822686919623573525>[+2 def]__iron greaves__ : 5 <:Iron_Bar:803907956528906241> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 10 [bonus: +10 def ]",
                        inline: false
                    }
                ],
                provider: null,
                // timestamp: new Date(),
            }))
        } else if (args2 === '3') {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 2 [Equipments], \`available list <1,2,3,4,5>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Mandible_Blade:827804986934951946>[+40 att]__mandible blade__ : 7 <:Iron_Bar:803907956528906241> + 10 <:Sturdy_Fossil:827782125158924289> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Fossil_Helmet:827782125629472769>[+3 def]__fossil helmet__ : 6 <:Iron_Bar:803907956528906241> + 2 <:Sturdy_Fossil:827782125158924289> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Fossil_Plate:827782125548863498>[+7 def]__fossil plate__ : 10 <:Iron_Bar:803907956528906241> + 4 <:Sturdy_Fossil:827782125158924289> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Fossil_Greaves:827782125390528513>[+2 def]__fossil greaves__ : 5 <:Iron_Bar:803907956528906241> + 3 <:Sturdy_Fossil:827782125158924289> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 12 [bonus: +12 def ]",
                        inline: false
                    },
                    {
                        value: `<:Silver_Shortsword:822687140777295874>[+51 att]__silver sword__ : 6 <:Silver_Bar:803907956663910410> + 15 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Silver_Helmet:822686919371784223>[+6 def]__silver helmet__ : 5 <:Silver_Bar:803907956663910410> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Silver_Chainmail:822686919855046656>[+8 def]__silver chainmail__ : 9 <:Silver_Bar:803907956663910410> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Silver_Greaves:822686920168701982>[+4 def]__silver greaves__ : 4 <:Silver_Bar:803907956663910410> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 15 [bonus: +15 def ]",
                        inline: false
                    },
                    {
                        value: `<:Blade_of_Grass:827782177982251018>[+60 att]__blade of grass__ : 6 <:Silver_Bar:803907956663910410> + 10 <:Stinger:827782125705101343> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Jungle_Hat:827782125485817926>[+6 def]__jungle hat__ : 5 <:Silver_Bar:803907956663910410> + 2 <:Stinger:827782125705101343> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Jungle_Shirt:827782125469171762>[+9 def]__jungle shirt__ : 9 <:Silver_Bar:803907956663910410> + 5 <:Stinger:827782125705101343> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Jungle_Pants:827782125461831700>[+4 def]__jungle pants__ : 4 <:Silver_Bar:803907956663910410> + 3 <:Stinger:827782125705101343> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 17 [bonus: +17 def ]",
                        inline: false
                    }
                ],
                provider: null,
                // timestamp: new Date(),
            }))
        }  else if (args2 === '4') {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 3 [Equipments], \`available list <1,2,3,4,5>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Tungsten_Broadsword:822687254890938378>[+72 att]__tungsten sword__ : 5 <:Tungsten_Bar:803907956252344331> + 25 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Tungsten_Helmet:822686919431028799>[+8 def]__tungsten helmet__ : 4 <:Tungsten_Bar:803907956252344331> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Tungsten_Chainmail:822686919980875786>[+10 def]__tungsten chainmail__ : 8 <:Tungsten_Bar:803907956252344331> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Tungsten_Greaves:822686919967375384>[+6 def]__tungsten greaves__ : 3 <:Tungsten_Bar:803907956252344331> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 25 [bonus: +21 def ]",
                        inline: false
                    },
                    {
                        value: `<:Night27s_Edge:827782178255536179>[+80 att]__night edge__ : 5 <:Tungsten_Bar:803907956252344331> + 10 <:Shadow_Scale:827782125398786068> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Shadow_Helmet:827782125595131945>[+8 def]__shadow helmet__ : 4 <:Tungsten_Bar:803907956252344331> + 2 <:Shadow_Scale:827782125398786068> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Shadow_Scalemail:827782125599064074>[+11 def]__shadow scalemail__ : 8 <:Tungsten_Bar:803907956252344331> + 4 <:Shadow_Scale:827782125398786068> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Shadow_Greaves:827782125440598036>[+6 def]__shadow greaves__ : 3 <:Tungsten_Bar:803907956252344331> + 3 <:Shadow_Scale:827782125398786068> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 27 [bonus: +24 def ]",
                        inline: false
                    },
                    {
                        value: `<:Gold_Broadsword:822687140823040066>[+89 att]__gold sword__ : 4 <:Gold_Bar:803907956424441856> + 35 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Gold_Helmet:822686919607451708>[+8 def]__gold helmet__ : 3 <:Gold_Bar:803907956424441856> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Gold_Chainmail:822686919510589441>[+12 def]__gold chainmail__ : 7 <:Gold_Bar:803907956424441856> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Gold_Greaves:822686919611514880>[+8 def]__gold greaves__ : 2 <:Gold_Bar:803907956424441856> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 35 [bonus: +27 def ]",
                        inline: false
                    },],
                provider: null,
                // timestamp: new Date(),
            }))
        }  else if (args2 === '5') {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 3 [Equipments], \`available list <1,2,3,4,5>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Blood_Butcherer:827782178129444874>[+99 att]__blood butcherer__ : 4 <:Gold_Bar:803907956424441856> + 10 <:Tissue_Sample:827782125637599252> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Crimson_Helmet:827782125531955210>[+8 def]__crimson helmet__ : 3 <:Gold_Bar:803907956424441856> + 2 <:Tissue_Sample:827782125637599252> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Crimson_Scalemail:827782125162987563>[+13 def]__crimson scalemail__ : 7 <:Gold_Bar:803907956424441856> + 4 <:Tissue_Sample:827782125637599252> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Crimson_Greaves:827782125670891550>[+8 def]__crimson greaves__ : 2 <:Gold_Bar:803907956424441856> + 3 <:Tissue_Sample:827782125637599252> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 37 [bonus: +30 def ]",
                        inline: false
                    },
                    {
                        value: `<:Platinum_Broadsword:822687140797874246>[+101 att]__platinum sword__ : 3 <:Platinum_Bar:803907956327317524> + 50 <:Wood:804704694420766721> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Platinum_Helmet:822686919820967977>[+12 def]__platinum helmet__ : 2 <:Platinum_Bar:803907956327317524> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Platinum_Chainmail:822686919552008203>[+15 def]__platinum chainmail__ : 5 <:Platinum_Bar:803907956327317524> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Platinum_Greaves:822686919787544627>[+11 def]__platinum greaves__ : 1 <:Platinum_Bar:803907956327317524> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 50 [bonus: +35 def ]",
                        inline: false
                    },
                    {
                        value: `<:Fiery_Greatsword:827782178154086430>[+150 att]__fiery greatsword__ : 1000 <:Wood:804704694420766721> + 1 <:Ice_Blade:827782178099298325> + 1 <:Mandible_Blade:827804986934951946> + 1 <:Blade_of_Grass:827782177982251018> + 1 <:Night27s_Edge:827782178255536179> + 1 <:Blood_Butcherer:827782178129444874> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "Level 55",
                        inline: false
                    },
                    {
                        value: `<:Forbidden_Mask:827782125557514240>[+12 def]__forbidden mask : 2 <:Platinum_Bar:803907956327317524> + 2 <:Forbidden_Fragment:827782125578092604> + 5 <:Stinger:827782125705101343> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Forbidden_Robes:827782125268500501>[+18 def]__forbidden robes__ : 5 <:Platinum_Bar:803907956327317524> + 2 <:Forbidden_Fragment:827782125578092604> + 4 <:Sturdy_Fossil:827782125158924289> + 10 <:Tissue_Sample:827782125637599252> ➜ <:Iron_Anvil:804145327435284500>` +
                            `\n<:Forbidden_Treads:827782125351600169>[+11 def]__forbidden treads__ : 1 <:Platinum_Bar:803907956327317524> + 4 <:Frost_Core:827782125553057802> + 6 <:Shadow_Scale:827782125398786068> ➜ <:Iron_Anvil:804145327435284500>`,
                        name: "[bonus: +50 def ]",
                        inline: false
                    }],
                provider: null,
                // timestamp: new Date(),
            }))
        }  else {
            message.channel.send(new Discord.MessageEmbed({
                type: "rich",
                title: null,
                description: 'Craft list 1 , \`available list <1,2,3,4,5>\`',
                url: null,
                color: 10115509,
                fields: [
                    {
                        value: `<:Wooden_Sword:805054340435148800>[+5 att]__wooden sword__ : 20 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>` +
                            `\n<:Wood_Helmet:805054256063315969>[+1 def]__wooden helmet__ : 15 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>` +
                            `\n<:Wood_Breastplate:805054297435275264>[+2 def]__wooden breastplate__ : 25 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>` +
                            `\n<:Wood_Greaves:805054271736250439>[+1 def]__wooden greaves__ : 20 <:Wood:804704694420766721> ➜ <:Work_Bench:804145756918775828>`,
                        name: "Equipments",
                        inline: false
                    },
                    {
                        value: `<:Work_Bench:804145756918775828>__work bench__ : 10 <:Wood:804704694420766721> ➜ hand\n<:Furnace:804145327513796688> __furnace__ : 7 <:Wood:804704694420766721> + 15 <:copper_ore:835767578021462078> ➜ <:Work_Bench:804145756918775828>\n<:Iron_Anvil:804145327435284500>__anvil__ : 5 <:Iron_Bar:803907956528906241> ➜ <:Furnace:804145327513796688>\n`,
                        name: "Tools",
                        inline: false
                    },
                    {
                        value: '<:Copper_Bar:803907956478836817>__copper bar__ : 10 <:copper_ore:835767578021462078> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Iron_Bar:803907956528906241>__iron bar__ : 10 <:iron_ore:835768116927135744> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Silver_Bar:803907956663910410>__silver bar__ : 10 <:silver_ore:835764438991765524> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Tungsten_Bar:803907956252344331>__tungsten bar__ : 10 <:tungsten_ore:835768117132001301> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Gold_Bar:803907956424441856>__gold bar bar__ : 10 <:gold_ore:835767578621247488> ➜ <:Furnace:804145327513796688>' +
                            '\n<:Platinum_Bar:803907956327317524>__platinum bar__ : 10 <:platinum_ore:835768116889124905> ➜ <:Furnace:804145327513796688>',
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
                message.channel.send(`<:Furnace:804145327513796688> | **${username}** has successfully crafted x${qty} ${emoji} **${args1} ${args2}**, \nYou now have x${amount} ${emoji} **${args1} ${args2}** in your backpack\nuse\`smelt\` to smelting item bar`)

                // QUEST PROGRESS ITEM COPPER BAR
                if (itemIdCrafted == 22) {
                    questProgress(message.author.id, 7, qty);
                }
            } else {
                message.reply(`:no_entry_sign: | you don't have enough materials to craft x${qty} ${emoji} **${args1} ${args2}**,\ngo work and get the materials it need, you can also check crafter material receipts with \`tera craft\`!`)
            }
        } else {
            message.reply(`:no_entry_sign: | you need <:Furnace:804145327513796688> **furnace** to craft this item!`)
        }
}

async function craftWeapon(message, playerId, username, commandsBody, args1, args2) {
    const weaponList = await queryData('SELECT weapon.id, weapon.level_required,  item.name, item.emoji FROM weapon LEFT JOIN item ON (weapon.item_id = item.id)');
    let weaponCraft;
    weaponList.forEach(element => {
        let name = element.name;
        if (name.toString().toLowerCase() === `${commandsBody}`) {
            weaponCraft = element
        }
    });
    // console.log(weaponList);
    if (!weaponCraft) return message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`);
    let existStations = [];
    if (args1 === 'wooden') {
        existStations = await queryData(`SELECT item_id_work_bench FROM tools WHERE player_id="${playerId}" AND item_id_work_bench="170" LIMIT 1`);
    } else {
        existStations = await queryData(`SELECT item_id_anvil FROM tools WHERE player_id="${playerId}" AND item_id_anvil=173 LIMIT 1`);
    }
    let level = await queryData(`SELECT level FROM stat WHERE player_id=${playerId} LIMIT 1`);
    // console.log('level:' + level);
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
            if (commandsBody === 'wooden sword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.woodenSword, 1, 1);
            } else if (commandsBody === 'copper sword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.copperSword, 1, 2);
            } else if (commandsBody === 'iron sword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.ironSword, 1, 3);
            } else if (commandsBody === 'silver sword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.silverSword, 1, 4);
            } else if (commandsBody === 'tungsten sword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.tungstenSword, 1, 5);
            } else if (commandsBody === 'gold sword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.goldSword, 1, 6);
            } else if (commandsBody === 'platinum sword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.platinumSword, 1, 7);
            } else if (commandsBody === 'ice blade') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.iceBlade, 1, 18);
            } else if (commandsBody === 'mandible blade') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.mandibleBlade, 1, 19);
            } else if (commandsBody === 'blade of grass') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.bladeGrass, 1, 20);
            } else if (commandsBody === 'night edge') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.nightEdge, 1, 21);
            } else if (commandsBody === 'blood butcherer') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.bloodButcherer, 1, 22);
            } else if (commandsBody === 'fiery greatsword') {
                queryEquipment(message, playerId, level, weaponCraft, materialList.fieryGreatsword, 1, 23);
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

async function craftArmor(message, playerId, username, commandsBody, args1, args2) {
    const armorList = await queryData('SELECT armor.id, item.name, item.emoji FROM armor LEFT JOIN item ON (armor.item_id = item.id) WHERE armor.armor_set_id>0');
    let armorCraft;
    // console.log(armorList)
    // console.log(commandsBody);
    armorList.forEach(element => {
        let name = element.name;
        if (name.toString().toLowerCase() === `${commandsBody}`) {
            armorCraft = element
        }
    });
    // console.log(armorList)
    if (!armorCraft) return message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`);
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
        if (commandsBody === 'wooden helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.woodenHelmet, 2, 1);
        } else if (commandsBody === 'wooden breastplate') {
            queryEquipment(message, playerId, level, armorCraft, materialList.woodenBreastplate, 3, 2);
        } else if (commandsBody === 'wooden greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.woodenGreaves, 4, 3);
        }  else if (commandsBody === 'copper helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.copperHelmet, 2, 4);
        } else if (commandsBody === 'copper chainmail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.copperChainmail, 3, 5);
        } else if (commandsBody === 'copper greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.copperGreaves, 4, 6);
        }else if (commandsBody === 'iron helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.ironHelmet, 2, 7);
        } else if (commandsBody === 'iron chainmail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.ironChainmail, 3, 8);
        } else if (commandsBody === 'iron greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.ironGreaves, 4, 9);
        } else if (commandsBody === 'silver helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.silverHelmet, 2, 10);
        } else if (commandsBody === 'silver chainmail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.silverChainmail, 3, 11);
        } else if (commandsBody === 'silver greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.silverGreaves, 4, 12);
        } else if (commandsBody === 'tungsten helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.tungstenHelmet, 2, 13);
        } else if (commandsBody === 'tungsten chainmail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.tungstenChainmail, 3, 14);
        } else if (commandsBody === 'tungsten greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.tungstenGreaves, 4, 15);
        } else if (commandsBody === 'gold helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.goldHelmet, 2, 16);
        } else if (commandsBody === 'gold chainmail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.goldChainmail, 3, 17);
        } else if (commandsBody === 'gold greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.goldGreaves, 4, 18);
        } else if (commandsBody === 'platinum helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.platinumHelmet, 2, 19);
        } else if (commandsBody === 'platinum chainmail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.platinumChainmail, 3, 20);
        } else if (commandsBody === 'platinum greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.platinumGreaves, 4, 21);
        } else if (commandsBody === 'frost helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.frostHelmet, 2, 28);
        } else if (commandsBody === 'frost breastplate') {
            queryEquipment(message, playerId, level, armorCraft, materialList.frostBreastplate, 3, 29);
        } else if (commandsBody === 'frost leggings') {
            queryEquipment(message, playerId, level, armorCraft, materialList.frostLeggings, 4, 30);
        } else if (commandsBody === 'fossil helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.fossilHelmet, 2, 31);
        } else if (commandsBody === 'fossil plate') {
            queryEquipment(message, playerId, level, armorCraft, materialList.fossilPlate, 3, 32);
        } else if (commandsBody === 'fossil greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.fossilGreaves, 4, 33);
        } else if (commandsBody === 'jungle hat') {
            queryEquipment(message, playerId, level, armorCraft, materialList.jungleHat, 2, 34);
        } else if (commandsBody === 'jungle shirt') {
            queryEquipment(message, playerId, level, armorCraft, materialList.jungleShirt, 3, 35);
        } else if (commandsBody === 'jungle pants') {
            queryEquipment(message, playerId, level, armorCraft, materialList.junglePants, 4, 36);
        } else if (commandsBody === 'shadow helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.shadowHelmet, 2, 37);
        } else if (commandsBody === 'shadow scalemail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.shadowScalemail, 3, 38);
        } else if (commandsBody === 'shadow greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.shadowGreaves, 4, 39);
        } else if (commandsBody === 'crimson helmet') {
            queryEquipment(message, playerId, level, armorCraft, materialList.crimsonHelmet, 2, 40);
        } else if (commandsBody === 'crimson scalemail') {
            queryEquipment(message, playerId, level, armorCraft, materialList.crimsonScalemail, 3, 41);
        } else if (commandsBody === 'crimson greaves') {
            queryEquipment(message, playerId, level, armorCraft, materialList.crimsonGreaves, 4, 42);
        } else if (commandsBody === 'forbidden mask') {
            queryEquipment(message, playerId, level, armorCraft, materialList.forbiddenMask, 2, 43);
        } else if (commandsBody === 'forbidden robes') {
            queryEquipment(message, playerId, level, armorCraft, materialList.forbiddenRobes, 3, 44);
        } else if (commandsBody === 'forbidden treads') {
            queryEquipment(message, playerId, level, armorCraft, materialList.forbiddenTreads, 4, 45);
        } else {
            message.channel.send(`What are you trying to craft,\nUse \'craft list\' to see craftable item`)
        }
    } else {
        let stations = '';
        if (args1 === 'wooden') {
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
    let modifierField = '';
    if (equipmentTypeId === 4 || equipmentTypeId === 7 || equipmentTypeId === 10
        || equipmentTypeId === 13 || equipmentTypeId === 16 || equipmentTypeId === 19
        || equipmentTypeId === 28 || equipmentTypeId === 31 || equipmentTypeId === 34
        || equipmentTypeId === 37 || equipmentTypeId === 40 || equipmentTypeId === 43) {
        modifierField = ',helmet_modifier_id=0'
    } else if (equipmentTypeId === 5 || equipmentTypeId === 8 || equipmentTypeId === 11
        || equipmentTypeId === 14 || equipmentTypeId === 17 || equipmentTypeId === 20
        || equipmentTypeId === 29 || equipmentTypeId === 32 || equipmentTypeId === 35
        || equipmentTypeId === 38 || equipmentTypeId === 41 || equipmentTypeId === 44) {
        modifierField = ',shirt_modifier_id=0'
    } else if (equipmentTypeId === 6 || equipmentTypeId === 9 || equipmentTypeId === 12
        || equipmentTypeId === 15 || equipmentTypeId === 18 || equipmentTypeId === 21
        || equipmentTypeId === 30 || equipmentTypeId === 33 || equipmentTypeId === 36
        || equipmentTypeId === 39 || equipmentTypeId === 42 || equipmentTypeId === 45) {
        modifierField = ',pants_modifier_id=0'
    }
    if (equipmentSlot > 1) { //ARMOR
        if (level < armorCraft.level_required) {
            message.reply(`⛔ | your level is not eligable to craft this item!`);
            return;
        }
    } else { // WEAPON
        modifierField = ',weapon_modifier_id=0'
        if (level < armorCraft.level_required) {
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
    let exist = 1;
    if (equipmentTypeId == 23 && equipmentSlot == 1) {
        let cekItem = await queryData(`SELECT * FROM armory WHERE player_id="${playerId}" AND weapon_id IN (18,19,20,21,22) ORDER BY weapon_id LIMIT 5`);
        let cekEach = '';
        cekItem.forEach(element => {
            if (element.weapon_id == '18') {
                cekEach += 'e';
            } else if (element.weapon_id == '19') {
                cekEach += 'x';
            } else if (element.weapon_id == '20') {
                cekEach += 'i';
            } else if (element.weapon_id == '21') {
                cekEach += 's';
            } else if (element.weapon_id == '22') {
                cekEach += 't';
            }
        });
        if (cekEach == 'exist') {
            exist = 1;
        } else {
            exist = 0;
        }
    } else {
        let existMaterials = [];
        // let exist = new Promise((resolve, reject) => {
        for (const element of materialList) {
            existMaterials = await queryData(`SELECT item_id FROM backpack WHERE player_id="${playerId}" AND (item_id=${element.id} AND quantity>=${element.quantity}) LIMIT 1`);
            if (!existMaterials.length > 0) {
                exist = 0;
            }
        }
    }
    if (exist) {
        if (equipmentTypeId == 23 && equipmentSlot === 1) {
            queryData(`UPDATE armory SET weapon_id=0 WHERE player_id="${playerId}" LIMIT 5`);
            materialList.forEach((value) => {
                queryData(`UPDATE backpack SET quantity=quantity - ${value.quantity} WHERE player_id="${playerId}" AND item_id=${value.id} LIMIT 1`);
            });
        } else {
            materialList.forEach((value) => {
                queryData(`UPDATE backpack SET quantity=quantity - ${value.quantity} WHERE player_id="${playerId}" AND item_id=${value.id} LIMIT 1`);
            });
        }
        queryData(`INSERT INTO equipment SET ${equipmentType}=${equipmentTypeId} ${modifierField}, player_id="${playerId}" ON DUPLICATE KEY UPDATE ${equipmentType}=${equipmentTypeId} ${modifierField}`)
        message.channel.send(`**${message.author.username}** has successfuly crafted ${armorCraft.emoji} **${armorCraft.name}**`);
        return;
    } else {
        message.reply(`:no_entry_sign: | you don't have enough materials to craft ${armorCraft.emoji} **${armorCraft.name}**,\ngo work and get the materials it need, you can also check crafter material receipts with \`tera craft list\`!`)
        return;
    } 
}

async function cekEquipment(type, playerId) {
    let eqSlot = 0;
    if (type === 'sword') {
        eqSlot = 'weapon_id';
    } else if (type === 'helmet') {
        eqSlot = 'helmet_id';
    } else if (type === 'breastplate' || type === 'chainmail') {
        eqSlot = 'shirt_id';
    } else if (type === 'greaves') {
        eqSlot = 'pants_id';
    }
    let equipment = await queryData(`SELECT * FROM equipment WHERE player_id="${playerId}" AND ${eqSlot}>0 LIMIT 1`);
    
    return equipment.length > 0 ;
}


export default crafting