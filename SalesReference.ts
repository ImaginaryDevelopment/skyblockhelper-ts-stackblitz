let crm = (name:string,div:number) =>(
    {name,div: div == 0 ? 1 : +div}
);

type Category = 'Farming' | 'Mining' | 'Combat' | 'Woods & Fishes'
export let referenceDivs = [
  crm("Unpacked Ice",0.111111),
  crm("Enchanted Paper", 640),
  crm("Enchanted Bread", 60)
]
export interface ItemForm {
  label:string
  div:number
  vend?:number
  asterisk?:string
}
export type Preconfiguration = {
  name:string,
  category:string | undefined,
  forms:ItemForm[]
}
let crv= (name:string,value:number) =>(
    {name,value}
);
let makeSimple = (name:string,category:Category) : Preconfiguration => ({
  name:name,
  category:category,
  forms:[
    {label:name,div:1}
  ]
});

let makeDual = (name:string,category:Category,emult?:number) : Preconfiguration => ({
  name:name,
  category:category,
  forms:[
    {label:name,div:1},
    {label:'Enchanted ' + name, div:emult || 160}
  ]
});

// type Suffixes = {plain?:string,enchanted?:string,eblock?:string}
let makeStandardForms  = (name:string,adds?:{plainsuffix?:string,blockname?:string}) : ItemForm[] => [
      {label: name + (adds && adds.plainsuffix != null? ' ' + adds.plainsuffix: ''), div:1},
      {label:'Enchanted ' + name, div:160},
      {label:(adds && adds.blockname? adds.blockname : ('Enchanted ' + name + ' Block')), div:160*160}
];

let makeStandardMining = (name:string,plainsuffix?:string) : Preconfiguration  => ({
  name:name,
  category:'Mining',
  forms:makeStandardForms(name,{plainsuffix})
});

export let preconfigurations : Preconfiguration[] = [
  {
    name:'Wheat',
    category:'Farming',
    forms:[
      {label:'Wheat', div:1},
      {label:'Enchanted Bread', div:60},
      {label:'Hay Bale', div:9},
      {label:'Enchanted Hay Bale', div:9*16*9}
    ]
  },
  {
    name:'Carrot',
    category:'Farming',
    forms:[
      {label:'Carrot', div:1, vend:3/7},
      {label:'Enchanted Carrot', div:160},
      {label:'Enchanted Carrot on a Stick', div:NaN},
      {label:'Enchanted Golden Carrot', div:NaN}
    ]
  },
  {
    name:'Potato',
    category:'Farming',
    forms:makeStandardForms("Potato",{blockname:'Enchanted Baked Potato'})
  },
  makeDual('Pumpkin','Farming'),
  {
    name:'Melon',
    category:'Farming',
    forms:[
      {label:'Melon', div:1},
      {label:'Enchanted Melon', div:160},
      {label:'Enchanted Glistening Melon', div:NaN},
      {label:'Enchanted Melon Block', div:160*160}
    ]
  },
  makeDual('Seeds', 'Farming'),
  {
    name:'Red Mushrooms',
    category:'Farming',
    forms:[
      {label:'Red Mushroom', div:1},
      {label:'Enchanted Red Mushroom', div:160},
      {label:'Red Mushroom Block', div:9},
      {label:'Enchanted Red Mushroom Block', div:9*64*9}
    ]
  },{
    name:'Brown Mushrooms',
    category:'Farming',
    forms:[
      {label:'Brown Mushroom', div:1},
      {label:'Enchanted Brown Mushroom', div:160},
      {label:'Brown Mushroom Block', div:9},
      {label:'Enchanted Brown Mushroom Block', div:9*64*9}
    ]
  },{
    name:'Cocoa Beans',
    category:'Farming',
    forms:[
      {label:'Cocoa Beans', div:1},
      {label:'Enchanted Cocoa Beans', div:160},
      {label:'Enchanted Cookie', div:NaN,asterisk:'Requires Wheat'},
    ]
  },{
    name:'Cactus',
    category:'Farming',
    forms:[
      {label:'Cactus', div:1},
      {label:'Enchanted Cactus Green', div:160},
      {label:'Enchanted Cactus', div:160*160},
    ]
  },{
    name:'Sugar Cane',
    category:'Farming',
    forms:[
      {label:'Sugar Cane', div:1},
      {label:'Enchanted Sugar', div:160},
      {label:'Enchanted Paper', div:64 * 3},
      {label:'Enchanted Sugar Cane', div:160*160},
    ]
  },
  makeDual('Feather','Farming'),
  makeDual('Leather', 'Farming'),
  makeDual('Raw Beef', 'Farming'),
  {
    name:'Pork',
    category:'Farming',
    forms:[
      {label:'Raw Pork', div:1},
      {label:'Enchanted Pork', div:160},
      {label:'Enchanted Grilled Pork', div:160 * 160},
    ]
  },
  {
    name:'Chicken(Egg)',
    category:'Farming',
    forms:[
      {label:'Enchanted Egg', div:1,asterisk:'144(16*9) eggs'},
      {label:'EnchantedCake',div:NaN,asterisk:'Needs Enchanted Eggs, Wheat, Milk, & Enchanted Sugar'},
      {label:'Super Enchanted Egg', div:16*9,asterisk:'20,736 eggs'},
      // {label:'Enchanted Grilled Pork', div:160 * 160},
    ]
  },
  makeDual('Raw Chicken', 'Farming'),
  {
    name:'Cobblestone',
    category:'Mining',
    forms:[
      {label:'Cobblestone',div:1},
      {label:'Enchanted Cobblestone', div:160},
      {label:'Auto Smelter',asterisk:'Needs 1 coal', div:64},
    ]
  },{
    name:'Mutton',
    category:'Farming',
    forms:[
      {label:'Raw Mutton',div:1},
      {label:'Enchanted Mutton',div:160},
      {label:'Enchanted Cooked Mutton',div:160*160},
    ]
  },{
    name:'Rabbit',
    category:'Farming',
    forms:[
      {label:'Raw Rabbit',div:1},
      {label:'Enchanted Raw Rabbit',div:160},
    ]
  },{
    name:'Rabbit(Feetsies)',
    category:'Farming',
    forms:[
      {label:'Rabbit\'s Foot',div:1},
      {label:'Enchanted Rabbit Foot',div:160},
    ]
  },{
    name:'Rabbit(Hide)',
    category:'Farming',
    forms:[
      {label:'Rabbit Hide',div:1},
      {label:'Enchanted Rabbit Hide',div:160},
    ]
  },
  makeDual('Nether Wart','Farming'),
  {
    name:'Coal',
    category:'Mining',
    forms:[
      {label:'Coal Ore', div:1},
      {label:'Enchanted Coal', div:160},
      {label:'Enchanted Charcoal', div:128*160,asterisk:'Needs 32 Wood'},
      {label:'Enchanted Block of Coal', div:160*160, asterisk:'Made from Enchanted Coal'}
    ]
  },
  makeStandardMining('Iron','Ingot'),
  makeStandardMining('Gold','Ingot'),
  makeStandardMining('Lapis'),
  makeStandardMining('Emerald'),
  makeStandardMining('Redstone'),
  makeStandardMining('Quartz'),
  makeDual('Obsidian', 'Mining'),
  {
    name:'Glowstone',
    category:'Mining',
    forms:[
      {label: 'Glowstone Dust', div:1},
      {label:'Enchanted Glowstone Dust', div:160},
      {label:'Enchanted Glowstone', div: 48 * 4 * 160 }
    ]
  },
  makeSimple('Gravel','Mining'),
  makeDual('Flint','Mining'),
  {
    name:'Ice',
    category:'Mining',
    forms:[
      {label:'Ice',div:1},
      // is there a packed ice -> enchanted ice recipe?
      {label:'Packed Ice',div:9},
      {label:'Enchanted Ice', div:160},
      {label:'Enchanted Packed Ice', div: 160 * 160}
      // use costs to determine price from 
      // {label:'Frost Walker book', isCost:true, uses:'Ice',vend:""},
      // {label:'Ice Minion I', isCost:true, uses:'Ice', vend:""}
    ]
  },
  makeSimple('Netherrack','Mining'),
  makeDual('Sand', 'Mining'),
  makeDual('End Stone','Mining'),
  {
    name:'Snow',
    category:'Mining',
    forms:[
      {label:'Snowball', div:1},
      {label:'Snow Block', div:4},
      {label:'Enchanted Snow Block', div: 4 * 160}
    ]
  },
  makeDual('Rotten Flesh','Combat'),
  makeDual('Bone', 'Combat'),
  makeDual('String', 'Combat'),
  {
    name:'Spider Eye',
    category:'Combat',
    forms:[
      {label:'Spider Eye', div:1},
      {label:'Enchanted Spider Eye', div:160},
      {label:'Enchanted Fermented Spider Eye', div:64,asterisk:'Needs 64 sugar and 64 brown mushrooms'}
    ]
  },
  {
    name:'Gunpowder',
    category:'Combat',
    forms:[
      {label:'Gunpowder', div:1},
      {label:'Enchanted Gunpowder', div:160},
      {label:'Enchanted Firework Rocket', div:160*64, asterisk:'Needs 16 paper'},
    ]
  },
  {
    name:'Ender Pearl',
    category:'Combat',
    forms:[
      {label:'Ender Pearl',div:1},
      {label:'Enchanted Ender Pearl',div:4*5},
      {label:'Enchanted Eye of Ender', div:4*5*16, asterisk:'Needs 64 Blaze Powder (32 Blaze Rods)'}
    ]
  },
  makeDual('Ghast Tear', 'Combat', 5),
  {
    name:'Slimeball',
    category:'Combat',
    forms:makeStandardForms('Slimeball',{blockname:'Enchanted Slime Block'})
  },
  {
    name:'Blaze Rod',
    category:'Combat',
    forms:[
      {label:'Blaze Rod',div:1},
      {label:'Enchanted Blaze Powder',div:160},
      {label:'Enchanted Blaze Rod', div:160 * 160}
    ]
  },
  makeDual('Magma Cream','Combat'),
  makeDual('Oak','Woods & Fishes'),
  makeDual('Spruce', 'Woods & Fishes'),
  makeDual('Birch', 'Woods & Fishes'),
  makeDual('Dark Oak', 'Woods & Fishes'),
  makeDual('Acacia', 'Woods & Fishes'),
  makeDual('Jungle', 'Woods & Fishes'),
  {
    name:'Raw Fish',
    category: 'Woods & Fishes',
    forms:makeStandardForms('Raw Fish',{blockname:'Enchanted Cooked Fish'})
  },
  {
    name:'Salmon',
    category:'Woods & Fishes',
    forms:makeStandardForms('Salmon', {blockname:'Enchanted Cooked Salmon'})
  },
  makeDual('Clownfish','Woods & Fishes'),
  makeDual('Pufferfish','Woods & Fishes'),
  makeDual('Prismarine Shard','Woods & Fishes'),
  makeDual('Prismarine Crystals','Woods & Fishes'),
]

export interface VendorReference {
  name:string,
  values:{name:string,value:number}[]
}
export let referenceValues : VendorReference[] = [
    {name:"Adventurer",values:[
      crv("Rotten flesh",8),
      crv("Bone",8),
      crv("String",10),
      crv("Gunpowder",10)
    ]},
    {name:"Lumber Merchant",values:[
      crv("Oak Wood",5),
      crv("Birch Wood",5),
      crv("Spruce Wood",5),
      crv("Dark Oak Wood",5),
      crv("Acacia Wood",5),
      crv("Jungle Wood",5)
    ]},
    {name:"Farm Merchant",values:[
      crv("Wheat", 2.33),
      crv("Carrot",2.33),
      crv("Potato",2.33),
      crv("Melon",2),
      crv("Sugar Cane",5),
      crv("Pumpkin",8),
      crv("Cocoa Beans",5),
      crv("Red Mushroom",12),
      crv("Brown Mushroom",12),
      crv("Sand",4),
      crv("Enchanted Bonemeal",2),
    ]},
    {name:"Mine Merchant",values:[
      crv("Coal", 8 / 2),
      crv("Iron Ingot", 22 / 4),
      crv("Gold Ingot", 12 / 2),
      crv("Gravel", 12 / 2),
      crv("Cobblestone", 3),
    ]},
    {name: "Fish Merchant", values:[
      crv("Raw Fish", 20),
      crv("Raw Salmon", 30),
      crv("Clownfish", 100),
      crv("Pufferfish", 40),
    ]}
];

