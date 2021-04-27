var variable =
{
        workBenchId: '170',
        furnaceId: '171',
        anvilId: '173',
        woodId: '179',
        copperOreId: '1',
        ironOreId: '3',
        silverOreId: '5',
        tungstenOreId: '6',
        goldOreId: '7',
        platinumOreId: '8',
        copperBarId: '22',
        ironBarId: '24',
        silverBarId: '26',
        tungstenBarId: '27',
        goldBarId: '28',
        platinumBarId: '30',
        cobweb: '311',
        frostCore: '312',
        sturdyFossil: '313',
        stinger: '314',
        shadowScale: '315',
        tissueSample: '316',
        forbiddenFragment: '317',
        iceBladeId: '305',
        mandibleBladeId: '306',
        bladeGrassId: '307',
        nightEdgeId: '308',
        bloodButchererId: '309',
        fieryGreatswordId: '310',
        woodenSwordId: '201',
        copperSwordId: '202',
        ironSwordId: '203',
        silverSwordId: '204',
        tungstenSwordId: '205',
        goldSwordId: '206',
        platinumSwordId: '207',
}
var  materialList = {
        woodenSword:[
                { id: variable.woodId, name: 'platinum bar', quantity: 25 }
        ],
        woodenHelmet:[
                { id: variable.woodId, name: 'platinum bar', quantity: 15 }
        ],
        woodenBreastplate:[
                { id: variable.woodId, name: 'platinum bar', quantity: 25 }
        ],
        woodenGreaves:[
                { id: variable.woodId, name: 'platinum bar', quantity: 20 }
        ],
        copperSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 2 },
                { id: variable.copperBarId, name: 'platinum bar', quantity: 10 }
        ],
        copperHelmet: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 15 },
        ],
        copperChainmail: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 20 },
        ],
        copperGreaves: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 18 },
        ],
        iceBlade: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 10 },
                { id: variable.frostCore, name: 'platinum bar', quantity: 10 }
        ],
        frostHelmet: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 15 },
        ],
        frostBreastplate: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 20 },
        ],
        frostLeggings: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 18 },
        ],
        ironSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 5 },
                { id: variable.ironBarId, name: 'platinum bar', quantity: 7 }
        ],
        ironHelmet: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 6 },
        ],
        ironChainmail: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 10 },
        ],
        ironGreaves: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 5 },
        ],
        mandibleBlade: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 7 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 10 },
        ],
        fossilHelmet: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 6 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 2 },
        ],
        fossilPlate: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 10 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 4 },
        ],
        fossilGreaves: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 3 },
        ],
        silverSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 15 },
                { id: variable.silverBarId, name: 'platinum bar', quantity: 6 }
        ],
        silverHelmet: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 5 },
        ],
        silverChainmail: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 9 },
        ],
        silverGreaves: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 4 },
        ],
        bladeGrass: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 6 },
                { id: variable.stinger, name: 'platinum bar', quantity: 10 }
        ],
        jungleHat: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.stinger, name: 'platinum bar', quantity: 2 }
        ],
        jungleShirt: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 9 },
                { id: variable.stinger, name: 'platinum bar', quantity: 5 }
        ],
        junglePants: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 4 },
                { id: variable.stinger, name: 'platinum bar', quantity: 3 }
        ],
        tungstenSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 25 },
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 5 }
        ],
        tungstenHelmet: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 4 }
        ],
        tungstenChainmail: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 8 }
        ],
        tungstenGreaves: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 3 }
        ],
        nightEdge: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 10 }
        ],
        shadowHelmet: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 4 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 2 }
        ],
        shadowScalemail: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 8 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 4 }
        ],
        shadowGreaves: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 3 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 3 }
        ],
        goldSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 35 },
                { id: variable.goldBarId, name: 'platinum bar', quantity: 4 } 
        ],
        goldHelmet: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 3 } 
        ],
        goldChainmail: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 7 } 
        ],
        goldGreaves: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 2 } 
        ],
        bloodButcherer: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 4 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 10 }
        ],
        crimsonHelmet: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 3 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 2 }
        ],
        crimsonScalemail: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 7 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 4 }
        ],
        crimsonGreaves: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 2 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 3 }
        ],
        platinumSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 50 },
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 3 }
        ],
        platinumHelmet: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 2 }
        ],
        platinumChainmail: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 5 }
        ],
        platinumGreaves: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 1 }
        ],
        fieryGreatsword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 1000 },
                // { id: iceBladeId, name: 'platinum bar', quantity: 1 },
                // { id: mandibleBladeId, name: 'platinum bar', quantity: 1 },
                // { id: bladeGrassId, name: 'platinum bar', quantity: 1 },
                // { id: nightEdgeId, name: 'platinum bar', quantity: 1 },
                // { id: bloodButchererId, name: 'platinum bar', quantity: 1 },
        ],
        forbiddenMask: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 2 },
                { id: variable.forbiddenFragment, name: 'platinum bar', quantity: 2 }
        ],
        forbiddenRobes: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 4 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 10 },
                { id: variable.forbiddenFragment, name: 'platinum bar', quantity: 2 }
        ],
        forbiddenTreads: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 1 },
                { id: variable.frostCore, name: 'platinum bar', quantity: 4 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 6 }
        ],
}
var materialUpgradeTool= {
        ironPickaxe: [ 
                {id:variable.ironBarId, name: 'bar', quantity: 25},
                {id:variable.woodId, name: 'wood', quantity: 15}
        ],
        silverPickaxe: [ 
                {id:variable.silverBarId, name: 'bar', quantity: 20},
                {id:variable.woodId, name: 'wood', quantity: 20}
        ],
        tungstenPickaxe: [ 
                {id:variable.tungstenBarId, name: 'bar', quantity: 15},
                {id:variable.woodId, name: 'wood', quantity: 35}
        ],
        goldPickaxe: [ 
                {id:variable.goldBarId, name: 'bar', quantity: 10},
                {id:variable.woodId, name: 'wood', quantity: 50}
        ],
        platinumPickaxe: [ 
                {id:variable.platinumBarId, name: 'bar', quantity: 5},
                {id:variable.woodId, name: 'wood', quantity: 75}
        ],
}
var emojiName = {
        workBench: '<:Work_Bench:804145756918775828> **work bench**',
        anvil: '<:Iron_Anvil:804145327435284500> **anvil**',
        furnace: '<:Furnace:804145327513796688> **furnace**',
        copperBar: '<:Copper_Bar:803907956478836817> **copper bar**',
        ironBar: '<:Iron_Bar:803907956528906241> **iron bar**',
        silverBar: '<:Silver_Bar:803907956663910410> **silver bar**',
        tungstenBar: '<:Tungsten_Bar:803907956252344331> **tungsten bar**',
        goldBar: '<:Gold_Bar:803907956424441856> **gold bar**',
        platinumBar: '<:Platinum_Bar:803907956327317524> **platinum bar**',
}

var limitedTimeUse = {
        luckyCoinEmoji: '<:Lucky_Coin:833189137179344897>',
        dicountCardEmoji: '<:Discount_Card:833189137141334036>',
        luckyCoinId: '319',
        dicountCardId: '320'
}
                


export {
        variable,
        materialList,
        materialUpgradeTool,
        emojiName,
        limitedTimeUse
}