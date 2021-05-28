import { limitedTimeUse } from "../helper/variable.js";
import Discord from 'discord.js';
import emojiCharacter from "../utils/emojiCharacter.js";
import errorCode from "../utils/errorCode.js";
import en from "../lang/en.js";

function info(message, args, commandBody) {
    let arrayName = commandBody.match(/[a-zA-Z]+/g);
    let itemName = '';
    arrayName = arrayName.splice(1);
    arrayName.forEach(element => {
        if (element) {
            itemName += element;
        }
    });
    let name = '';
    let info = '';
    let obtain = '';
    if(!args){ return message.channel.send('Correct usage \`tera info [item name]\`')}
    if (itemName === 'lucky coin') {
        name = en.info.luckyCoin.name;
        info = en.info.luckyCoin.info;
        obtain = en.info.luckyCoin.obtain
    } else if (itemName === 'discount card') {
        name = en.info.discountCard.name;
        info = en.info.discountCard.info;
        obtain = en.info.discountCard.obtain;
    } else if (itemName === 'diamond') {
        name = en.info.diamond.name;
        info = en.info.diamond.info;
        obtain = en.info.diamond.obtain;
    } else if (itemName === 'piggy bank') {
        name = en.info.piggyBank.name;
        info = en.info.piggyBank.info;
        obtain = en.info.piggyBank.obtain;
    } else if (itemName === 'mining helmet') {
        name = en.info.miningHelmet.name;
        info = en.info.miningHelmet.info;
        obtain = en.info.miningHelmet.obtain;
    } else if (itemName === 'bug net') {
        name = en.info.bugNet.name;
        info = en.info.bugNet.info;
        obtain = en.info.bugNet.obtain;
    } else if (itemName === 'pylon') {
        name = en.info.pylon.name;
        info = en.info.pylon.info;
        obtain = en.info.pylon.obtain;
    } else if (itemName === 'healing potion') {
        name = en.info.healingPotion.name;
        info = en.info.healingPotion.info;
        obtain = en.info.healingPotion.obtain;
    } else if (itemName === 'apprentice bait') {
        name = en.info.apprenticeBait.name;
        info = en.info.apprenticeBait.info;
        obtain = en.info.apprenticeBait.obtain;
    } else if (itemName === 'monarch butterfly') {
        name = en.info.monarchButterfly.name;
        info = en.info.monarchButterfly.info;
        obtain = en.info.monarchButterfly.obtain;
    } else if (itemName === 'grasshopper') {
        name = en.info.grasshopper.name;
        info = en.info.grasshopper.info;
        obtain = en.info.grasshopper.obtain;
    } else if (itemName === 'black dragonfly') {
        name = en.info.blackDragonfly.name;
        info = en.info.blackDragonfly.info;
        obtain = en.info.blackDragonfly.obtain;
    
    } else if (itemName === 'ladybug') {
        name = en.info.ladybug.name;
        info = en.info.ladybug.info;
        obtain = en.info.ladybug.obtain;
    } else if (itemName === 'worm') {
        name = en.info.worm.name;
        info = en.info.worm.info;
        obtain = en.info.worm.obtain;
    } else if (itemName === 'gold worm') {
        name = en.info.goldWorm.name;
        info = en.info.goldWorm.info;
        obtain = en.info.goldWorm.obtain;
    } else if (itemName === 'bait power') {
        name = en.info.baitPower.name;
        info = en.info.baitPower.info;
        obtain = en.info.baitPower.obtain;
    } else if (itemName === 'bait') {
        name = en.info.bait.name;
        info = en.info.bait.info;
        obtain = en.info.bait.obtain;
    }  else if (itemName === 'marketplace') {
        name = en.info.marketplace.name;
        info = en.info.marketplace.info;
        obtain = en.info.marketplace.obtain;
    } else if (itemName === 'armory') {
        name = en.info.armory.name;
        info = en.info.armory.info;
        obtain = en.info.armory.obtain;
    } else {
        return message.channel.send(en.info.infoNotFound);
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