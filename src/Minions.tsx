import React from 'react';
import {copyUpdate,getTargetInfo,getTargetValue,toggleArrayValue,formatNumber} from './Shared'
import {HField,StatefulProps,NumberInput,Diagnostic} from './SharedComponents'

let ItemSelector = ({items,targetItemName,targetItemCost,onSelected}) =>(
  <div className='select'>
    <select className='select' onChange={onSelected}>
      <option value=''>Items</option>
      {
        items.map(item =>
          <option value={item.name} selected={targetItemName == item.name && targetItemCost == item.resourceAmount} > {item.name} </option>
        )
      }
    </select>
  </div>
);
let minions = [

]
type TargetItem = {
  name:string
  resource:string
}

let item = (name,resource,resourceAmount) => (
  {name,resource,resourceAmount});
let items : TargetItem[] = [
  item('Runaan\'s Bow(s)','String',36864),
  item('Runaan\'s Bow(b)','Bone', 30720),
  item('Leaping Sword','Spider Eye', 245760),
  item('Treecapitator', 'Obsidian', 81920)
];

let initState = {
  minionTime:22,
  minionCount:3,
  minionProduction:1,
  minionBazaarPlain:2,
  selectedItem:items[2],
  itemCost:245760
};
let FuelColumn = props =>{
  let fuelCoinOverage = +props.unfueledCoins * +props.multiplier - +props.unfueledCoins;
  // let perMinionFuelProfitPerHr = fuelProfitFullPerHr / props.minionCount;
  let breakeven = +fuelCoinOverage * +props.durationHr;
  let fuelproduces = +props.unfueledCoins * +props.multiplier;
  
  return (<div className='column'><span title={"break-even point " + (props.asterisk || '')} className={props.asterisk != null ? 'star':''}>{props.name}</span><span> &lt; {formatNumber(breakeven)} then buy. {formatNumber((props.multiplier - 1)*100,0)}% fuel makes </span>
        {formatNumber(+props.unfueledCoins * +props.multiplier)} coins per hour with {formatNumber((props.multiplier - 1)*100,0)}% fuel. Fuel Earns {formatNumber(fuelCoinOverage,1)} in 1 hour.
      </div>);
};

let FuelAnalysis = props =>{
  let unfueledCoins = props.productionPerHr * props.minionBazaarPlain;
  let fuels = [
    {name:"Coal",multiplier:1.05, durationHr:0.5},
    {name:"Block of Coal",multiplier:1.05, durationHr:5},
    {name:"Enchanted Bread", multiplier:1.05, durationHr:12},
    {name:"Enchanted Coal", multiplier: 1.1, durationHr:24},
    {name:"Enchanted Charcoal", multiplier:1.2, durationHr:36},
    // benefits analysis here must shift to how long you are willing to wait for it to pay for itself, not cost
    // {name:"Solar Panel", multiplier:1.25, durationHr:36,asterisk:'only during the day'},
    {name:"Hamster Wheel", multiplier:1.5, durationHr:24},
    {name:"Foul Flesh", multiplier:1.9, durationHr:5},
    {name:"Catalyst", multiplier:2, durationHr:3},
  ];
  return (
  <div>
      <div className='column'>
        {formatNumber(props.productionPerHr)} items per hour
      </div>
      <div className='column'>
        {formatNumber(unfueledCoins)} coins per hour
      </div>
      {
        fuels.map(fuel =>(
          <FuelColumn name={fuel.name} unfueledCoins={unfueledCoins} durationHr={fuel.durationHr} multiplier={fuel.multiplier} 
          asterisk={fuel.asterisk} />
        ))
      }
      
    </div>);
};
export type MinionTabState = {
  minionDelay:number
  minionCount:number
  minionProduction:number
  plainvalue:number
  resourceAmount:number
  selectedItem:any
  
}

// <HField input={delay} label='Delay' />
// <HField input={count} label='Count' title='How many of this minion at this tier do you have?'/>
// <HField label='Production' title='How much is produced after a delay?' input={prod} />
// <HField  label='Est. Value' title='Estimated item sale value' input={value} />

export const initMinionTabState : MinionTabState = {
  minionDelay:26,
  minionCount:1,
  minionProduction:1,
  plainvalue: 10,
  resourceAmount:245760,
  selectedItem:items[2]
}

export let MinionTab = (props:StatefulProps<MinionTabState>) => {
  if(props == null || props.state.minionDelay == null) {
    return (<div>Bad minionTab input: {JSON.stringify(props && props.state? props.state:props,undefined,4)}</div>);
  }
  let setState = <TProp extends keyof MinionTabState>(name:TProp) => (value:MinionTabState[TProp]) => props.onStateChange(copyUpdate(props.state,name,value));
  type Value<T> = {value:T};
  let setValueState = <TProp extends keyof MinionTabState>
    (name:TProp) => 
    (nv) =>
    props.onStateChange(copyUpdate(props.state,name,nv.value));
  // let delay = (<NumberInput name='minionDelay' value={props.state.minionDelay} onChange={getTargetValue('minionDelay', setState('minionDelay'))} />);
  // let count = (<NumberInput name='minionCount' value={props.state.minionCount} onChange={getTargetValue('minionCount')} />);
  // let prod = (<NumberInput name='minionProduction' value={props.state.minionProduction} onChange={getTargetValue('minionProduction')} />);
  // let value = (<NumberInput name='plainvalue' value={props.state.plainvalue} onChange={getTargetValue('plainvalue')} />);

  let productionPerHrPerMinion = props.state.minionProduction * 3600 / 2 / props.state.minionDelay;
  let reqHours = +props.state.selectedItem.resourceAmount / +(productionPerHrPerMinion*props.state.minionCount);
  let reqDays = reqHours > 24 ?  reqHours / 24 : 0;
  console.log('hours', reqHours, props.state.selectedItem && props.state.selectedItem.resourceAmount, productionPerHrPerMinion);
  
  let fields : {name:keyof MinionTabState,label:string,title?:string}[] = [
      {name:'minionDelay', label:'Delay'},
      {name:'minionProduction', label:'Production', title:'How much is produced after a delay?'},
      {name:'plainvalue', label:'Est. Value', title:'How much do you think 1 unit would sell for?'},
      {name:'minionCount', label:'Minion Count', title:'How many of this minion at this tier do you have?'},
  ];
  let updateSelectedItem = getTargetValue('itemSelector', x => setState('selectedItem')(items.find(item => item.name == x)));
  return (
    <div>
      <div className='bd-callout'>
        {fields.map(item =>(
          <HField label={item.label} input={<NumberInput name={item.name} value={props.state[item.name]} onChange={setValueState(item.name)} />} title={item.title} />
        ))}
      </div>
      <FuelAnalysis productionPerHr={productionPerHrPerMinion} minionBazaarPlain={props.state.plainvalue} />
      <hr />
      <div className="column">
          <ItemSelector
              items={items} 
              targetItemName={props.state.selectedItem.name} 
              targetItemCost={props.state.selectedItem.resourceAmount} 
              onSelected={updateSelectedItem}
              append={props.state.selectedItem.resource}
          />
          <span className="span">
            {props.state.selectedItem.resource}
          </span>
        </div>
        <div className="columns">
          <div className="column">
            {formatNumber(props.state.plainvalue,0)}
          </div>
          <div className="column">
            {formatNumber(reqDays,1)} days
          </div>
          <div className="column">
            or {formatNumber(reqHours)} hours
          </div>
        </div>
        <Diagnostic show={true} value={props.state} />
    </div>);
}