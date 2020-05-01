import {distinct} from './Shared'

type PotionLevel = {source:string;lvl:number}

export type Potion = {
  name: string
  isVanilla: boolean
  bases: string[],
  isDebuff: boolean,
  levels: PotionLevel[]
}

let potPh = (name:Potion['name'],isVanilla:Potion['isVanilla'],lvl1source:string,isDebuff:boolean = false,bases?:string[]) : Potion => (
  {
    name: name, isVanilla: isVanilla,
    isDebuff: isDebuff,
    bases: bases || ['Awkward'],
    levels: [{source:lvl1source, lvl:1}]
  }
);

export let potions : Potion[] = [
  {name:"Speed",isVanilla:true, isDebuff:false,
    bases:[
      'Awkward',
      'Cheap Coffee',
      'Decent Coffee'
    ],
    levels:[
      {source:'sugar',lvl:1},
      {source:'esugar', lvl:3},
      {source:'eSugarcane', lvl:5}
    ]
  },
  {
    name:'Jump Boost', isVanilla:true,isDebuff:false,
    bases:[

    ],
    levels:[
      {source:'Rabbit\'s Foot',lvl:1}
    ]
  },
  {
    name:'Healing', isVanilla: true,isDebuff:false,
    bases:[],
    levels:[
      {source:'Glistering Melon',lvl:1},
      {source:'Encahnted Melon', lvl:3},
      {source:'Encahnted Glistering Melon', lvl:5}
    ]
    },
  potPh('Poison', true,'Spider Eye',true),
  { name:'Water Breathing', isVanilla: true,isDebuff:false,
    bases:[],
    levels:[
      {source:'Pufferfish',lvl:1},
      {source:'Enchanted Pufferfish',lvl:3},]
  },
  potPh('Fire Resistance', true,'Magma Cream',false),
  potPh('Night Vision', true,'Golden Carrot',false),
  {name:'Strength', isVanilla: true,isDebuff:false,
    bases:[],
    levels:[
      {source:'Blazing Powder',lvl:1},
      {source:'Enchanted Blazing Powder',lvl:3},
      {source:'Enchanted Blazing Rod',lvl:5}
    ]},
  potPh('Invisibility', true,'Fermented Spider Eye',false,['Night Vision']),
  {name:'Regeneration', isVanilla: true, isDebuff:false,
  bases:[],
  levels:[
    {source:'Ghast Tear',lvl:1},
    {source:'Enchanted Ghast Tear',lvl:5},
  ]},
  { name:'Weakness', isVanilla: true, isDebuff:true,
    bases:[],
    levels:[
      {source:'Fermented Spider Eye',lvl:1},
      {source:'Enchanted Spider Eye', lvl:3},
      {source:'Enchanted Fermented Spider Eye',lvl:5},
    ]
  },
  potPh('Slowness', true,'Fermented Spider Eye',true,['Speed']),
  potPh('Damage', true,'Fermented Spider Eye',true,['Health']),
  // start nonVanilla
  potPh('Haste', false,'Coal'),
  {name:'Rabbit',isVanilla: false, isDebuff:false,
    bases:[],
    levels:[
      {source:'Raw Rabbit',lvl:1},
      {source:'Enchanted Rabbit\'s Foot',lvl:3},
    ]
  },
  potPh('Burning', false,'Red Sand',true),
  potPh('Knockback', false,'Slimeball'),
  potPh('Venomous', false,'Poisonous Potato',true),
  potPh('Stun', false,'Obsidian'),
  potPh('Archery', false,'Feather'),
  {name:'Absorption', isVanilla: false, isDebuff: false,
    bases:[],
    levels:[
      {source:'Gold Ingot',lvl:1},
      {source:'Enchanted Gold', lvl:3},
      {source:'Enchanted Gold Block',lvl:5}
    ]
  },
  {name:'Adrenaline', isVanilla: false, isDebuff: false,
    bases:[],
    levels:[
      {source:'Cocoa Beans',lvl:1},
      {source:'Enchanted Cocoa Beans', lvl:3},
      {source:'Enchanted Cookie',lvl:5}
    ]
  },
  {name:'Critical',isVanilla:false,isDebuff:false,
    bases:[],
    levels:[{source:'Flint',lvl:1}]
  },
  potPh('Dodge', false,'Raw Salmon'),
  potPh('Agility', false,'Enchanted Cake'),
  potPh('Wounded', false,'Netherrack',true),
  potPh('Experience', false,'Lapis Lazuli'),
  {name:'Resistance', isVanilla: false, isDebuff: false,
    bases:[],
    levels:[
      {source:'Cactus',lvl:1},
      {source:'Enchanted Cactus Green', lvl:3},
      {source:'Enchanted Cactus',lvl:5}
    ]
  },
  {name:'Mana', isVanilla: false, isDebuff: false,
    bases:[],
    levels:[
      {source:'Raw Mutton',lvl:1},
      {source:'Enchanted Mutton', lvl:3},
      {source:'Enchanted Cooked Mutton',lvl:5}
    ]
  },
  potPh('Stamina', false,'Foul Flesh'),
  {name:'Blindness', isVanilla: false, isDebuff: true,
    bases:[],
    levels:[
      {source:'Ink Sack',lvl:1},
      {source:'Enchanted Ink Sack', lvl:3},
    ]
  },
  potPh('True Resistance', false,'True Essence'),
]
interface SplashMod {mod:'Splash', value:string}
interface ValueModifier {mod:'Duration' | 'Level', value:number}
interface DualModifier{
  duration:number,level:number
}
export type PotModifier = {mat:string,mod:'Duration'|'Level'|'Splash'} & (DualModifier | ValueModifier| SplashMod)
export let modifiers:PotModifier[] = [
  {mod:'Duration', mat:'Redstone',value:8},// duration in minutes
  {mod:'Duration', mat:'Enchanted Redstone', value:16},
  {mod:'Duration', mat:'Enchanted Redstone Block', value:40},
  {mod:'Duration', mat:'Enchanted Redstone Lamp', value:16},
  {mod:'Level', mat:'Glowstone Dust', value:1},
  {mod:'Level', mat:'Enchanted Glowstone Dust', value:2},
  {mod:'Level', mat:'Enchanted Glowstone', value:3},
  {mod:'Level', mat:'Enchanted Redstone Lamp', duration:16,level:3},
  {mod:'Splash', mat:'Gunpowder', value:'splash+ duration penalty'},
  {mod:'Splash', mat:'Enchanted Gunpowder', value:'splash'}
]

export let getBases = (selected:string) : string[] => 
  selected != '' ? potions.find(p => p.name == selected).bases : distinct(potions.map(p => p.bases).flat());