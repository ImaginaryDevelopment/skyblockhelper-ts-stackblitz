import React from 'react';

import { StorageAccess, Rarities, copyUpdate, toggleArrayValue } from "../Shared"

import * as Types from '../Types'
import { FoldMaster, TabContainer, FoldTarget } from '../SharedComponents';

type Weapon = {
    name:string,
    rarity: Types.Rarity,
    slayer?: 'Zombie'|'Spider'|'Wolf'
    collection?: string
    upgradesTo?:string // can this weapon be crafted into a higher version
}
let swords: Weapon[] = [

    {name:'Yeti Sword', rarity:'Legendary'},
    {name:'Reaper Scythe', rarity:'Legendary',slayer:'Zombie', collection:'Zombie Slayer 7'},
    {name:'Pooch Sword', rarity:'Legendary',slayer:'Wolf', collection:'Wolf Slayer 6'},
    {name:'Pigman Sword', rarity:'Legendary',collection:'Porkchop 9'},
    {name:'Midas Sword', rarity:'Legendary'},
    {name:'Aspect of the Dragon', rarity:'Legendary'},
    {name:'Silk-edge Sword', rarity:'Epic'},
    {name:'Shaman Sword', rarity:'Epic',slayer:'Wolf', collection:'Wolf Slayer 3', upgradesTo:'Pooch Sword'},
    {name:'Scorpion Foil', rarity:'Epic',slayer:'Spider', collection:'Spider Slayer 6'},
    {name:'Reaper Falchion', rarity:'Epic',slayer:'Zombie', collection:'Zombie Slayer 6'},
    {name:'Ornage Zombie Sword', rarity:'Epic'},
    {name:'Leaping Sword', rarity:'Epic', collection:'Spider Eye 9'},
    {name:'Ink Wand', rarity:'Epic', collection:'Ink Sack 9'},
    {name:'End Stone Sword', rarity:'Epic', collection:'End Stone 9'},
    {name:'Emerald Blade', rarity:'Epic', collection:'Emerald 8'},
    {name:'Ember Rod', rarity:'Epic'},
    {name:'Zombie Sword', rarity:'Rare', collection:'Rotten Flesh 7', upgradesTo:'Ornate Zombie Sword'},
    {name:'Tactician\'s Sword', rarity:'Rare', upgradesTo:'Thick Tactician\'s Sword'},
    {name:'Revenant Falchion', rarity:'Rare',upgradesTo:'Reaper Falchion', collection:'Zombie Slayer 3'},
    {name:'Recluse Fang', rarity:'Rare', collection:'Spider Slayer 2'},
    {name:'Raider Axe', rarity:'Rare'},
    {name:'Golem Sword', rarity:'Rare', collection:'Iron 8'},
    {name:'Frozen Scythe', rarity:'Rare', collection:'Ice 8'},
    {name:'Edible Mace', rarity:'Rare', slayer:'Wolf', collection:'Wolf Slayer 5'},
    {name:'Aspect of the End', rarity:'Rare', collection:'Ender Pearl 8'},
    {name:'Silver Fang', rarity:'Uncommon', collection:'Ghast Tear 6'},
    {name:'Prismarine Blade', rarity:'Uncommon', collection:'Prismarine Shard 2'},
    {name:'Hunter Knife', rarity:'Uncommon'},
    {name:'Flaming Sword', rarity:'Uncommon'},
    {name:'End Sword', rarity:'Uncommon'},
    {name:'Cleaver', rarity:'Uncommon', collection:'Gold 2'},
    {name:'Undead Sword',rarity:'Common',slayer:'Zombie',upgradesTo:'Revenant Falchion'},
    {name:'Spider Sword',rarity:'Common',slayer:'Spider',upgradesTo:'Recluse Fang'},
    {name:'Rogue Sword',rarity:'Common'},
    {name:'Fancy Sword',rarity:'Common'},
    {name:'Aspect of the Jerry',rarity:'Common',upgradesTo:'Thick Aspect of the Jerry'}
]
let bows: Weapon[] = [
    {name:'Wither',rarity:'Uncommon'},
    {name:'Decent',rarity:'Uncommon'},
    {name:'Savanna',rarity:'Uncommon',collection:'Acacia 7'}
]
type WeaponType = 'Sword' | 'Bow'

type WeaponComponentState = {
  subtab: WeaponType,
  bowChecked: string[],
  swordChecked: string[]
  bowFolded: Readonly<Types.Rarity[]>,
  swordFolded:Readonly<Types.Rarity[]>
}

let initState : WeaponComponentState = {
    subtab: 'Sword',
    bowChecked: [],
    swordChecked: [],
    bowFolded: Rarities.all,
    swordFolded: Rarities.all
}
type WeaponComponentProps = {
  getStorage:<T>(key:string) => StorageAccess<T>
}

let FoldyListItem = (props:{name:string,title:string,folded:boolean,onToggle:Types.Action, children:React.ReactNode}) =>
  (<li key={props.name} className='list-item'>
  <div className='columns'>
    <div className='column'>
  <FoldMaster title={props.title} isFolded={props.folded} onToggle={props.onToggle} />
  </div><FoldTarget isFolded={props.folded}><div className='column is-a-fifth'>
      {props.children}
      </div>
      </FoldTarget>
  </div>
</li>);
let DisplayWeapon = (props:{item:Weapon, checked:string[],onChange: Types.Action1<string>}) => (
    <li key={props.item.name} className='list-item' title={props.item.name}>
      <div className="columns">
          <div className="column">
            <input  className='checkbox' type='checkbox'
                    checked={props.checked.includes(props.item.name)}
                    onChange={() => props.onChange(props.item.name)} />
            {props.item.name}
            </div>
            <div className="column" title='collection'>
              {props.item.collection}
            </div>
            <div className="column" title='Slayer'>
              {props.item.slayer}
            </div>
            <div className="column" title='Upgrades'>
              {props.item.upgradesTo != null ? 'upgrades to ' + props.item.upgradesTo : ''}
            </div>
            </div>
            </li>
);

let DisplayChecks = (props:{items:Weapon[],checked:string[], onChange:Types.Action1<string>}) => (
    <ul className='is-horizontal list'>
    {props.items.map(p => (<DisplayWeapon item={p} checked={props.checked} onChange={props.onChange} />)) }

</ul>);

export const WeaponComponent = (props:WeaponComponentProps) =>{
  const weaponStorage = props.getStorage<WeaponComponentState>('WeaponComponent');
  const oldState :WeaponComponentState = weaponStorage.readIt(initState);
  const [state,setState] = React.useState<WeaponComponentState>(oldState);
  let update = (next:WeaponComponentState) =>
    {
        weaponStorage.storeIt(next);
        setState(next);
    }
  let copyUp = <T extends keyof WeaponComponentState>(key:T) =>
    (value:WeaponComponentState[T]) =>
    update(copyUpdate(state,key,value));
  let tabChange = (name:WeaponType) => copyUp('subtab')(name);
  let onToggle = <T extends 'swordFolded' | 'bowFolded'>(wt:T) => (r: Types.Rarity) => copyUp(wt)(toggleArrayValue(state[wt],r));
  let onChange = <T extends 'swordChecked' | 'bowChecked'>(wt:T) => (name:string) => copyUp(wt)(toggleArrayValue(state[wt],name));
  let tab = state.subtab == 'Sword' ?
    <div>
        <ul>
            {Rarities.all.map(r => <FoldyListItem key={r}
                name={r} title={r} onToggle={() => onToggle('swordFolded')(r)}
                folded={(state.swordFolded as Types.Rarity[]).includes(r)} >
                    <DisplayChecks checked={state.swordChecked} onChange={onChange('swordChecked')} items={swords.filter(w => w.rarity == r)} />
            </FoldyListItem>)}
        </ul>
    </div> : 
    state.subtab == 'Bow'?
    <div>
        <ul>
            {Rarities.all.filter(r => bows.map(b => b.rarity).includes(r)).map(r => <FoldyListItem key={r}
                name={r} title={r} onToggle={() => onToggle('bowFolded')(r)}
                folded={(state.bowFolded as Types.Rarity[]).includes(r)} >
                    <DisplayChecks checked={state.bowChecked} onChange={onChange('bowChecked')} items={bows.filter(w => w.rarity == r)} />
            </FoldyListItem>)}
        </ul>
        </div>
                :
    <div>Unmapped tab {state.subtab}</div>;
  return (<div>
          <TabContainer stdTabs={{names:['Sword','Bow'],onClick:tabChange, active:state.subtab}}>
          </TabContainer>
              {tab}

      </div>);
}
