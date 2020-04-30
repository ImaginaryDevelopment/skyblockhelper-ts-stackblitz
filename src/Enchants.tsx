import React from 'react';
import {copyUpdate,getTargetInfo,toggleArrayValue} from './Shared'
import {TabContainer,TabTextLink} from './SharedComponents'
import * as Types from './Types'

declare global {
    interface Array<T> {
        flat(this: T[] | T[][],depth?:Number): Array<T>;
        includes(this:T[],x:T): boolean;
    }
}

type Roman = 'I' | 'II' | 'III' | 'IV' | 'V'

interface EnchantBase {
  name:string
  targetLvl:Roman
  vendorTitle?:string
  isRecommended?:boolean
}

interface CraftableEnchant extends EnchantBase 
{
  type:'Craftable'
  minEnchantTbl: Number,
  collection:string,
  craftlvlcreated:Roman,
  components:string,
}
interface Enchant1 extends EnchantBase {
  type:'Enchant'
}
type Enchant = CraftableEnchant | Enchant1
let cEnchant = (name:EnchantBase['name'],targetLvl:Enchant['targetLvl'], minEnchantTbl:CraftableEnchant['minEnchantTbl'], collection:CraftableEnchant['collection'], craftlvlcreated:CraftableEnchant['craftlvlcreated'],components:CraftableEnchant['components'], adds:{vendorTitle?:CraftableEnchant['vendorTitle'],isRecommended?:CraftableEnchant['isRecommended']} | undefined = {}):CraftableEnchant =>(
  { name,
    type:'Craftable',
    targetLvl,
    minEnchantTbl,
    collection,
    craftlvlcreated,
    components,
    vendorTitle:adds.vendorTitle,
    isRecommended:adds.isRecommended
  }
)

let enchant = (name:EnchantBase['name'],targetLvl:EnchantBase['targetLvl'], adds:{vendorTitle?:EnchantBase['vendorTitle'],isRecommended?:EnchantBase['isRecommended']} | undefined = {}) : EnchantBase =>(
  {name,targetLvl,vendorTitle:adds.vendorTitle,isRecommended:adds.isRecommended});
  
let senchants : Enchant[][] = [
  [
    cEnchant('Critical','V',44,'Diamond 5', 'IV', '8 Enchanted Diamond',{vendorTitle:'VI - Sven Packmaster - Wolf Slayer IV required',isRecommended:true}),
    cEnchant('Sharpness','V',44,'Gravel 4','IV', 'Iron Sword + 8 Flint', {vendorTitle:'VI - Dark Auction',isRecommended:true}),
    cEnchant('Execute','V', 40, 'Diamond 2', 'IV', '40 Flint + 40 Diamond',{isRecommended:true}),
    cEnchant('Giant Killer','V',40, 'Ghast 3', 'IV', '8 Ghast Tears',{vendorTitle:'VI - Dark Auction',isRecommended:true}),
    cEnchant('First Strike', 'IV', 24, 'Gravel 6', 'III', '4 Enchanted Flint',{isRecommended:true}),
    cEnchant('Lethality', 'V', 40, 'Obsidian 2', 'IV', '24 Obsidian',{isRecommended:true}),
    cEnchant('Cubism', 'V', 44, 'Pumpkin 4', 'IV', '32 Pumpkin',{isRecommended:true}),
    cEnchant('Ender Slayer', 'V', 48, 'Ender Pearl 3', 'IV', '8 Enchanted Ender Pearls',{vendorTitle:'VI - Pearl Dealer - $1.5m',isRecommended:true}),
    cEnchant('Impaling', 'III', 32, 'Prismarine Shard 1', 'II', '20 Prismarine Shards')
  ],
  [
    cEnchant('Life Steal', 'III', 36, 'None needed', 'II', '2 Enchanted Golden Apple'),
    cEnchant('Vampirism', 'V', 40, 'Ghast 5', 'IV', '8 Enchanted Ghast', {vendorTitle:'VI - Spooky Festival'}),
    cEnchant('Luck', 'V', 40, 'Rabbit 5', 'IV', '8 Rabbit Hide', {vendorTitle: 'IV from gifts'}),
    cEnchant('Looting', 'III', 28, 'Gold 3', 'II', '4 Gold Block', {vendorTitle: 'IV from gifts'}),
    cEnchant('Scavenger', 'III', 18, 'Gold 6', 'II', 'Golden Sword', {vendorTitle: 'IV from gifts'}),
    cEnchant('Experience', 'III', 24, 'Lapis 3', 'II', '2 Lapis'),
    cEnchant('Venomous', 'V',46, 'Spider Eye 6', 'IV', '8 Enchanted Spider Eye'),
    cEnchant('Thunderlord', 'V',15, 'Gunpowder 5','IV', '8 Enchanted Gunpowder')
  ],
  [
    cEnchant('Cleave', 'V', 40, 'Pufferfish 3', 'IV', '40 Pufferfish')
  ]
];
let aenchants : Enchant[][] = [
  [
    cEnchant('Protection', 'V',40, 'Iron 3', 'IV', '8 Iron',{vendorTitle:'VI - Dark Auction'}),
    cEnchant('Growth', 'V',40, 'Dark Oak 7', 'IV', '8 Enchanted Dark Oak', {vendorTitle:'VI - Dark Auction'}),
    cEnchant('Depth Strider(boots)','III',30,'Pufferfish 4', 'II', '2 Salmon, 2 Lily Pad'),
    cEnchant('Feather Fall(boots)','V', 42, 'Feather 2','IV','40 feathers')
  ],
  [
    {name:'True Protection(chest)', type:'Enchant',targetLvl: 'I',vendorTitle:'Birch Park - Howling Cave - $900k'}
  ]
]

let benchants : Enchant[][] = [
  [
    cEnchant('Power','V',38,'Bone 3', 'IV','40 bone', {vendorTitle:'VI - Dark Auction'}),
    cEnchant('Aiming', 'V',48,'Feather 6', 'IV', '1 Compass and 8 Arrows'),
    cEnchant('Infinite Quiver', 'V', 44, 'String 6', 'IV', '1 Bow'),
    cEnchant('Piercing', 'I', 23, 'Cactus 6','I','10 Cacti and 1 arrow'),
    cEnchant('Cubism', 'V', 44, 'Pumpkin 4', 'IV', '32 Pumpkin',{isRecommended:true}),
    cEnchant('Snipe', 'III', 27, 'Feather 8','II','2 Feather and 2 arrow'),
    cEnchant('Impaling', 'III', 32, 'Prismarine Shard 1', 'II', '20 Prismarine Shards')
  ]
]

export type TRStrikeProps = {
  isStruck:boolean
  children: JSX.Element[]
}
let TRStrike = (props:TRStrikeProps) => (<tr className={props.isStruck?'strikethrough':''}>
  {props.children}
</tr>);

type EnchantRowProps = {
  e:Enchant
  struck:string[]
  colorRecommendations:boolean
  onEnchantClick:Types.Action1<string>
}
let EnchantRow = (props:EnchantRowProps) => {
  let color = props.colorRecommendations && props.e.isRecommended;
  return(
    <TRStrike key={props.e.name} isStruck={props.struck.includes(props.e.name)}>
                  <td className={color ?'has-text-success':''}>
                    <button onClick={() => props.onEnchantClick(props.e.name)} className={"button " + (color ?' has-text-success':'') + (props.struck.includes(props.e.name)? ' strikethrough': '')} name={props.e.name}>{props.e.name}</button>
                  </td>
                  <td>{props.e.targetLvl}</td>
                  <td>{props.e.type == 'Craftable'? props.e.minEnchantTbl:''}</td>
                  <td title={props.e.vendorTitle}><div className={props.e.vendorTitle != null?'star':''}>{props.e.type == 'Craftable'? props.e.collection:''}</div></td>
                  <td>{props.e.type == 'Craftable'? props.e.craftlvlcreated:''}</td>
                  <td>{props.e.type == 'Craftable'? props.e.components:''}</td>
                </TRStrike>
  )
}
type EnchantTableProps = {
  enchants: Enchant[][]
  struck:string[]
  colorRecommendations?: boolean
  onEnchantClick: Types.Action1<string>
  onEnchantClear: Types.Action
}

let EnchantTable = (props:EnchantTableProps) =>(
  <div>
    <table className='table'>
      <thead>
        <tr>
          <td>Enchant name</td>
          <td title='Does not include special books'>Max Craft Level</td>
          <td title='Minimum enchant level for the max craft level to appear on the table'>Min Enchant Tbl</td>
          <td title='Craft collection for unlock'>Collection</td>
          <td title='If crafted from components, what level book is created'>Craft Level Created</td>
          <td title='If crafting, what besides paper is required'>Special Components</td>
        </tr>
      </thead>
      <tbody>
        {
          props.enchants.map(group =>(
              group.map(we =>(
                <EnchantRow key={we.name} struck={props.struck} colorRecommendations={props.colorRecommendations} e={we} onEnchantClick={props.onEnchantClick} />
              ))
          ))
        }
      </tbody>
    </table>
    <button className="button" onClick={props.onEnchantClear}>Clear</button>
  </div>
);

type EnchantsProps = {
  onEnchantClick: Types.Action1<string>
  onEnchantClear: Types.Action
  struck:string[]
  colorRecommendations:boolean
}

interface SwordEnchantsProps extends EnchantsProps {
  colorRecommendations:boolean,
  toggleColors:Types.ActionAny
}

let SwordEnchants = (props:SwordEnchantsProps) =>(
  <div>
    <div>
      <input type='checkbox' checked={props.colorRecommendations === true} onClick={props.toggleColors as any} />Color Recommendation Levels 
    </div>
    <div>9 recommended damage enchants, found {senchants.flat().length} total</div>
    <EnchantTable 
        colorRecommendations={props.colorRecommendations}
        enchants={senchants}
        struck={props.struck} 
        onEnchantClick={props.onEnchantClick}
        onEnchantClear={props.onEnchantClear}
    />
    <ul>
      <li key='Enchantments'>
        <a href='https://hypixel-skyblock.fandom.com/wiki/Enchantments'>Enchantments wiki</a>
      </li>
    </ul>
  </div>
);

let ArmorEnchants = (props:EnchantsProps) =>(
    <div>
      <EnchantTable colorRecommendations={false} enchants={aenchants} struck={props.struck} onEnchantClick={props.onEnchantClick} onEnchantClear={props.onEnchantClear} />
    </div>
);

type EnchantType = 'Armor' | 'Bow' | 'Sword'

interface StruckTracker {
  //[e:Enchants]:string[]
  //(e:Enchants):string[]
  Armor:string[]
  Bow:string[]
  Sword:string[]
}

export type EnchantsMenuState = {
    submenu:EnchantType
    struck:StruckTracker
    colorRecommendations:boolean
}

export const enchantsMenuInit : Readonly<EnchantsMenuState> = {
    submenu:'Sword',
    colorRecommendations:true,
    struck:{
      Armor:[],
      Bow:[],
      Sword:[]
    }
};
// export const updateEnchantState = {
//     submenu: createLens<EnchantsMenuState,'submenu'>('submenu'),
//     struck: createLens<EnchantsMenuState,'struck'>('struck'),
//     state: createLens<EnchantsMenuProps,'state'>('state')
// }
export type StateHandler = Types.ComponentEventHandler<EnchantsMenuState>;

type EnchantsMenuProps = {
  state:EnchantsMenuState,
  onStateChange:StateHandler
};

export let EnchantsMenu = (props:EnchantsMenuProps) =>{
  console.log('em',props);
  if(props == null || props.state == null)
    return <div>EnchantsMenu - invalid props</div>

  let setState = <TProp extends keyof EnchantsMenuState>(name:TProp) => (value:EnchantsMenuState[TProp]) => copyUpdate(props.state,name,value);
  let onEnchantClear = () =>{
    
    let nextState = setState('struck')(copyUpdate(props.state.struck,props.state.submenu,[]));
    props.onStateChange(nextState);
  }
  let onEnchantClick = (x:string) => {
    let nextStruck = toggleArrayValue<string>(props.state.struck[props.state.submenu] as string[],x);
    let nextStruckWhole = copyUpdate(props.state.struck,props.state.submenu,nextStruck);
    let nextState = setState('struck')(nextStruckWhole);
    //console.log('enchantClick', x, nextState);
    props.onStateChange(nextState);
  };

  // props.onEnchantClick.bind(null,props.state,'struck');
  let struck = props.state.struck[props.state.submenu];
  return (
    <div>
      <TabContainer addedClasses="is-small">
        <ul>
          {['Armor','Bow','Sword',].map(n => <TabTextLink name={n} active={props.state.submenu} onClick={(x:EnchantType) => props.onStateChange(copyUpdate(props.state,'submenu',x))} />
          )}
        </ul>
      </TabContainer>
      <div>
      {
        props.state.submenu=='Sword'?
          <SwordEnchants colorRecommendations={props.state.colorRecommendations} struck={struck} onEnchantClick={onEnchantClick} toggleColors={() => props.onStateChange(setState('colorRecommendations')(props.state.colorRecommendations === false))} onEnchantClear={onEnchantClear} /> :
          props.state.submenu=='Armor'?
          <ArmorEnchants onEnchantClick={onEnchantClick} struck={struck} onEnchantClear={onEnchantClear} colorRecommendations={false} /> :
          props.state.submenu=='Bow'?
          <EnchantTable enchants={benchants} colorRecommendations={false} struck={struck} onEnchantClick={onEnchantClick} onEnchantClear={onEnchantClear} />:
          <div>Unmapped Menu</div>
      }
      </div>
    </div>
  );
};

