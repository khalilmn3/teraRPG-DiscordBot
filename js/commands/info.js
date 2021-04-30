import { limitedTimeUse } from "../helper/variable.js";
import Discord from 'discord.js';
import emojiCharacter from "../utils/emojiCharacter.js";
import errorCode from "../utils/errorCode.js";

function info(message, args, commandBody) {
    commandBody = commandBody.slice(5);
    let name = '';
    let info = '';
    let obtain = '';
    if(!args){ return message.channel.send('Correct usage \`tera info [item name]\`')}
    if (commandBody === 'lucky coin') {
        name = limitedTimeUse.luckyCoinEmoji+'Lucky coin';
        info = 'Item gold booster that gives you 25% more gold \nwhen using \`explore\` and \`mining expedition\`\n - **usage** \`use lucky coin\`';
        obtain = '\`code\`, \`pirates invasion\'s drop\`'
    } else if (commandBody === 'discount card') {
        name = limitedTimeUse.dicountCardEmoji+'Discount card';
        info = 'Discount 25% item shop, \nit one time use when buying item shop';
        obtain = '\`code\`, \`pirates invasion\'s drop\`'
    } else if (commandBody === 'diamond') {
        name = '<:diamond:801441006247084042> Diamond';
        info = 'Currency item for buy item on market';
        obtain = '\`7 daily strike\`, \`vote rewards\`'
    } else if (commandBody === 'piggy bank') {
        name = '<:piggy_bank:801444684194906142> Piggy bank';
        info = 'Deposit your gold and got bonus exp\ndepending on how much gold deposited\n- **usage** \`bank\`,\`deposit\`, \`withdraw\`';
        obtain = '\`market\`'
    } else if (commandBody === 'mining helmet') {
        name = '<:Mining_Helmet:824176323194650624> Mining helmet';
        info = 'Grant you ores when using \`mine\`\nbye-bye rock';
        obtain = '\`market\`'
    } else if (commandBody === 'bug net') {
        name = '<:Bug_Net:824176322908913687> Bug net';
        info = 'Have 20% chance to get bait when using \`chop\`';
        obtain = '\`market\`'
    } else if (commandBody === 'pylon') {
        name = '<:Forest_Pylon:826645637788598294> Pylon';
        info = 'Using for teleport to any discovered \`zone/sub zone\`\n- **Usage**: \`zone\`';
        obtain = '\`market\`'
    } else if (commandBody === 'healing potion') {
        name = '<:Healing_Potion:810747622859735100> Healing potion';
        info = 'Restores your HP';
        obtain = '\`shop\`, \`vote\`'
    } else if (commandBody === 'apprentice bait') {
        name = '<:Apprentice_Bait:824271452056059985> Apprentice bait';
        info = 'Using on \`fish\`, it have 15% bait power';
        obtain = '\`shop\`'
    } else if (commandBody === 'monarch butterfly') {
        name = '<:Monarch_Butterfly:824268384937312277> Monarch butterfly';
        info = 'Using on \`fish\`, it have 5% bait power';
        obtain = '\`chop\` when you have bug net'
    } else if (commandBody === 'grasshopper') {
        name = '<:Grasshopper:824268384979779596> Grasshopper';
        info = 'Using on \`fish\`, it have 10% bait power';
        obtain = '\`chop\` when you have bug net'
    } else if (commandBody === 'black dragonfly') {
        name = '<:Black_Dragonfly:824268377576702002> Black dragonfly';
        info = 'Using on \`fish\`, it have 15% bait power';
        obtain = '\`chop\` when you have bug net'
    
    } else if (commandBody === 'ladybug') {
        name = '<:Ladybug:824268377425707048> Ladybug';
        info = 'Using on \`fish\`, it have 20% bait power';
        obtain = '\`chop\` when you have bug net'
    } else if (commandBody === 'worm') {
        name = '<:Worm:824268370139414529> Worm';
        info = 'Using on \`fish\`, it have 35% bait power';
        obtain = '\`chop\` when you have bug net'
    } else if (commandBody === 'gold worm') {
        name = '<:Gold_Worm:824268369876221954> Gold worm';
        info = 'Using on \`fish\`, it have 50% bait power';
        obtain = '\`chop\` when having bug net'
    } else if (commandBody === 'bait power') {
        name = 'Bait power';
        info = 'Bait power influences the quality of the catch\nHigher bait powers means higher quality of the catch';
        obtain = '\`bait\`'
    } else if (commandBody === 'bait') {
        name = 'Bait';
        info = 'Bait is using on \`fish\`, If the player has multiple bait items in their inventory\nthey are used from the bottom slot of the backpack to the top.\nTherefore, the bottom bait item will be used first.';
        obtain = '\`shop\`, \`chop\` when having bug net';
    }  else if (commandBody === 'marketplace') {
        name = 'Marketplace';
        info = `a Place to buy and sell items on TeraRPG\n\n**Usage**\n**• tera marketplace\n\` Display list of marketplace\`\n• tera marketplace add [item name] [price]*\n\` List an item to the marketplace\`\n• tera marketplace buy [id]\n\` Buy an item from marketplace\`\n• tera marketplace remove [id]\n\` Remove an item from marketplace\`\n• tera marketplace search [item name]\n\` Search items from marketplace\`\n• tera marketplace list\n\` Display own list on marketplace\`\n• tera marketplace @[user]\n\` Display other user list on marketplace\`**`;
        obtain = '*Level 5';
    } else if (commandBody === 'armory') {
        name = 'Armory';
        info = `Put your equipment here, you can only store max 5 items\nfor each equipment type.\n**Usage**\n**• tera equip [id/name]\n\`equip an item from armory\`\n• tera unequip [equip type]\n**equip type: \`weapon\`,\`helmet\`,\`shirt\`,\`pants\`\n**• tera sell armory [id]\n\`sell an item from armory\`**`;
        obtain = 'Anywhere';
    } else {
        return message.channel.send(`Cannot found info related!`);
    }
    
    message.channel.send(embed(message, name, info, obtain))
        .catch((err) => {
            console.log('(info)' + message.author.id + ': ' + errorCode[err.code]);
        });
}

function embed(message, name, info, obtain) {
    let embed = new Discord.MessageEmbed({
        type: "rich",
        description: `ℹ️ __Information__`,
        color: 1752220,
        fields: [
            {
                name: name,
                value: info,
                inline: false,
            },
            {
                name: 'Obtain from',
                value: obtain,
                inline: false,
            },
        ],
        // author: {
        //     name: `${message.author.username}'s Code ${code}`,
        //     url: null,
        //     iconURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=512`,
        //     proxyIconURL: `https://images-ext-1.discordapp.net/external/ZU6e2R1XAieBZJvWrjd-Yj2ARoyDwegTLHrpzT3i5Gg/%3Fsize%3D512/https/cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        // },
        // footer: {
        //     text: `Find more rewards on \`tera daily/weekly/vote\``,
        //     iconURL: null,
        //     proxyIconURL: null
        // },
    });

    return embed;
}

export default info;