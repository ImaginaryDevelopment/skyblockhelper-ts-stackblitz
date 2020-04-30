// todo: show bases, recipes, level aug, duration aug
import React from 'react';

import * as Types from './Types'
import {distinct,copyUpdate,getTargetValue,sort} from './Shared';
import {TabContainer,Diagnostic,Table} from './SharedComponents';

import {Potion,potions,getBases,modifiers,PotModifier} from './BrewingReference'


let AllBases = (props:{}) => (
  <ul>
    {getBases('').map(b =>(
      <li key={b}>{b}</li>
    ))}
  </ul>
)
type BrewBasesProps ={
  tpot:TargetPotion
  onTPotStateChange: <TKey extends keyof TargetPotion>(k:TKey) => TargetPotionUpdate<TKey>;
}
let BrewBases = (props:BrewBasesProps) => (
  <select onChange={getTargetValue('BrewBases',props.onTPotStateChange('tbase'))}>
    <option value=''>Bases...</option>
    {
      getBases(props.tpot.name).map(b => (
        <option key={b} selected={props.tpot.tbase==b} value={b}>{b}</option>
      ))
    }
  </select>
);

type TargetPotion = {
  name?:string
  // base potion used
  tbase?:string
  // level based on component used to choose this potion
  tlvl?:number
  // duration mod
  dmod?:string
  // level mod
  lmod?:string
  // is splash
  splash?:boolean
}

export type BrewingState = {
  subtab: 'Brew' | 'Reference' | 'Modifications'
  // target potion
  tpot?:TargetPotion
  showDebuffs:boolean
}

export type BrewingProps = {
  theme:string
  state:BrewingState
  onStateChange:Types.Action1<BrewingState>
}

export let initBrewingState : BrewingState = {
  showDebuffs:false,
  tpot:null,
  subtab:'Brew'
}

let ShowSource = (props:{tpot:TargetPotion}) => {
  let pot = potions.find(x => x.name == props.tpot.name);
  return (
  <span>{pot.levels.map(lvl => lvl.lvl + '-' + lvl.source).reduce((x,y) => x + ',' + y)} </span>
);};

let Reference = (props:{}) => (
  <div>
    <pre>
    {JSON.stringify(potions,undefined,4)}
    </pre>
  </div>
);

type TargetPotionUpdate<TKey extends keyof TargetPotion> = (v:TargetPotion[TKey]) => void;

type BrewProps = {
  tpot?:TargetPotion
  showDebuffs:boolean
  //name of property on Target Potion type that is changing
  onTPotStateChange: <TKey extends keyof TargetPotion>(k:TKey) => TargetPotionUpdate<TKey>;
}

let sorted : Potion[] = sort<Potion>(potions,(x,y)=> x.name < y.name? -1 : x.name > y.name? 1 : 0);

let TargetSelector = (props:{tpot:TargetPotion,showDebuffs:boolean, onTPotStateChange:BrewProps['onTPotStateChange']}) => (
    (() => {
      try{
        console.log('targetselector')
        console.log('targetselector.props.tpot', props.tpot,sorted);
        return (
            <select className='select' value={props.tpot != null ? props.tpot.name : ''}  
                    onChange={getTargetValue('Brew.name',props.onTPotStateChange('name'))}>
              <option value=''>Potions...</option>
              {          
                  ((props.showDebuffs == true ? sorted : sorted.filter(x => x.isDebuff != true)).map(pot => (
                    <option key={pot.name} value={pot.name}>{pot.name}</option>
              )))}
      </select>);
      }
      catch(e){
          return (<div>{JSON.stringify(e,null,4)}</div>);
      }
    })());

let Brew = (props:BrewProps) => (
  <div>
  <h1 className='is-large'>Target</h1>
      <TargetSelector tpot={props.tpot || {}} showDebuffs={props.showDebuffs} onTPotStateChange={props.onTPotStateChange} /><pre>{props.tpot != null ? <ShowSource tpot={props.tpot} /> : ''}</pre>
      <h2 className='h2'>Base - <a className='a' href='https://hypixel-skyblock.fandom.com/wiki/Brews'>wiki</a> - <a href="http://www.minecraft101.net/t/potion-brewer.html">automation</a></h2>
        {(props.tpot != null && props.tpot.name != '' ? <BrewBases tpot={props.tpot} onTPotStateChange={props.onTPotStateChange} /> : <AllBases />)
        }
  </div>
);

let ModDisplay = (props: { mod: PotModifier['mod']; }) => {
  let mods = modifiers.filter(x => x.mod == props.mod);
  console.log('ModDisplay', props.mod, mods);
  return (<div>
          <h3 className='is-size-3'>{props.mod}</h3>
          <Table headers={['Material','Value']}>
            { mods.map(m =>(
              <tr><td>{m.mat}</td><td>{ ('duration' in m) ? (m.duration + 'min - ' + m.level + ' levels') : m.value}</td></tr>)
            )}
          </Table>
  </div>);
};

let Modifications = (props:{}) => (
    <div className="bd-outline">
      {distinct(modifiers.map(x => x.mod)).map(mod => (<ModDisplay mod={mod} />))}
    </div>
);

export let BrewingComponent = (props:BrewingProps) => {
  let stdTabs = {names:['Brew','Reference','Modifications'],active:props.state.subtab,onClick:(x:BrewingState['subtab']) => props.onStateChange(copyUpdate(props.state,'subtab',x))};

  let copyUpdateTPot = <TKey extends keyof TargetPotion>(key:TKey) => (value:TargetPotion[TKey]) => props.onStateChange(copyUpdate(props.state,'tpot',copyUpdate(props.state.tpot,key,value)));

  let tab = props.state.subtab == 'Brew'? <Brew showDebuffs={props.state.showDebuffs} tpot={props.state.tpot} onTPotStateChange={copyUpdateTPot} /> : 
      props.state.subtab == 'Reference' ? <Reference /> :
      props.state.subtab == 'Modifications' ? <Modifications /> :
      (<div>unmapped menu {props.state.subtab} </div>);
  return (<div className={props.theme}>
    <TabContainer stdTabs={stdTabs} addedClasses={props.theme} >
    </TabContainer>
    <div className={props.theme}>
      {tab}
    </div>
      
    <Diagnostic value={props.state} show={true} />
  </div>);
}