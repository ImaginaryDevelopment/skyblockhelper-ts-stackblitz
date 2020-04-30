import React, { Component } from 'react';
import * as Types from '../Types';
import { createStorageAccess,isValueString,StorageAccess, toggleArrayValue, copyUpdate} from '../Shared';
import {FoldMaster,FoldTarget,createStoredComponent,ComRenderer} from '../SharedComponents';
// track armor collections
// needs local storage

// perhaps only track ones that have a good use + allow custom additions?
type ArmorType = 'Utility' | 'General' | 'Slayer'

type ArmorPart = 'Helm' | 'Chest' | 'Leg' | 'Boots'
type NamedPart = {name:string, part:ArmorPart}
let allParts : ArmorPart[] = ['Helm', 'Chest', 'Leg', 'Boots' ]

type ArmorSet = string | {name:string,parts:(NamedPart|ArmorPart)[],special?:string}
let namedPart  = (name:string,part:ArmorPart) : NamedPart => ({name:name,part:part});
let partedSet = (helm: string,chest: string,leg: string,boots: string) : NamedPart[] =>
  [namedPart(helm,'Helm'),namedPart(chest,'Chest'),namedPart(leg,'Leg'),namedPart(boots,'Boots')];
let makeSet = (name: string,helm: string,chest: string,leg: string,boots: string,special: string) => ({name:name,parts:partedSet(helm,chest,leg,boots),special:special})
let makeStdSet = (name: string,special: string) => ({name:name,parts:allParts,special:special});
let armorSets : ArmorSet[] = [
  'Hardened Diamond',
  'Lapis',
  'Snow Suit',
  'Spooky',
  'Bat Person',
  'Diver\'s',
  'Protector Dragon',
  'Old Dragon',
  'Wise Dragon',
  'Strong Dragon',
  'Unstable Dragon',
  'Superior Dragon',

  {name:'Revenant',parts:['Chest','Leg','Boots'],special:'Zombie Set'},
  {name:'Mastiff',parts:allParts,special:'Wolf Set'},
  {name:'Tarantula',parts:allParts,special:'Spider Set'},
  makeSet('Monster Hunter','Skeleton\'s Helmet','Guardian Chestplate','Creeper Pants','Spider\'s Boots', '-30% dmg taken, + 30% dmg to monsters'),
  makeSet('Monster Raider', 'Skeleton\'s Helmet','Guardian Chestplate','Creeper Pants','Spider\'s Boots', '-35% dmg taken, + 35% dmg to monsters'),
  'Pack',
  makeStdSet('Cheap Tuxedo','Max health set to 75, Deal 50% more damage'),
  makeStdSet('Fancy Tuxedo','Max health set to 150, Deal 100% more damage'),
  makeStdSet('Elegant Tuxedo', 'Max health set to 250, Deal 150% more damage'),

];
let getATitle = (x:ArmorSet) => typeof x == 'string' ? x : x.name;
let getPartTitle = (x:NamedPart|ArmorPart) => typeof x == 'string' ? x : x.name;
let getPartType = (x:NamedPart|ArmorPart) => typeof x =='string'? x : x.part;
let getParts = (a:ArmorSet) => typeof a == 'string'? allParts: a.parts;
let displayChecks = (a:ArmorSet, checkedParts:ArmorPart[]) => (<ul className='is-horizontal list'>
  {getParts(a).map(p => (<li key={getPartTitle(p)} className='list-item' title={getPartTitle(p)}><input className='checkbox' type='checkbox'
   checked={checkedParts.includes(getPartType(p))} />{getPartType(p)}</li>))}
</ul>);

type ArmorDisplayProps = {
  folded:boolean
  onToggle:Types.Action
  armor:ArmorSet
  checkedParts:ArmorPart[]
}

let ArmorDisplay = (props:ArmorDisplayProps) => {
  let title = (typeof props.armor == 'string') ?
      props.armor :
    props.armor.name;
  return(<li key={getATitle(props.armor)} className='list-item'>
  <div className='columns'>
    <div className='column'>
  <FoldMaster title={title} isFolded={props.folded} onToggle={props.onToggle} />
  </div><FoldTarget isFolded={props.folded}><div className='column is-a-fifth'>{displayChecks(props.armor, props.checkedParts)}</div></FoldTarget>
  </div>
</li>);

}

type ArmorComponentState = {
  folded:string[]

}
type ArmorComponentProps = {
  getStorage:<T>(key:string) => StorageAccess<T>
}

type IStringDict<T> = {
  [name:string]: (T | undefined)
}

const render = (store:Types.Action1<ArmorComponentState>): ComRenderer <ArmorComponentProps,ArmorComponentState>  => (props,state,dispatch) => {
  console.log('rendering armor!');
  let onToggle = (a: ArmorSet) =>{
    let next = copyUpdate(state,'folded',toggleArrayValue(state.folded,getATitle(a)));
    store(next);
    dispatch(next);
  };

  return (<div>Armor
      {armorSets.map(a => <ArmorDisplay key={getATitle(a)} armor={a} checkedParts={[]}
        folded={state.folded.includes(getATitle(a))} onToggle={() => onToggle(a)} />)}
  </div>)
};

export const ArmorComponent = (props:ArmorComponentProps) =>{
  const armorStorage = props.getStorage<ArmorComponentState>('ArmorComponent');
  const [state,setState] = React.useState(() => armorStorage.readIt({folded:[]}));
  return render(armorStorage.storeIt)(props,state,setState);
}
