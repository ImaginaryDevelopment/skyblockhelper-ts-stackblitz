import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faBars } from '@fortawesome/free-solid-svg-icons';

import * as Types from './Types'

import {copyUpdate,getTargetInfo,getTargetValue,formatNumber,distinct,isValueString} from './Shared'

import {NumberInput,TabContainer,TabTextLink,Diagnostic,Table} from './SharedComponents'
import {preconfigurations,referenceValues} from './SalesReference'



type BazaarMode = 'Buy' | 'Sell'

type RateDisplayProps = {
  mode:BazaarMode
  
  values:{name:string,value:number, div:number}[]
}

let RateDisplay = (props:RateDisplayProps) => {
  if(!props.values.some(() => true))
    return (<div />);
  return (<div className="bd-outline">
    <table className="table">
    <thead><tr>
        <th>Name</th>
        <th>{props.mode} Value</th>
    </tr></thead>
    <tbody>
    {
      props.values.map( x => (<tr key={x.name}>
          <td>{x.name}</td><td>{formatNumber(x.value/x.div,2)}</td>
          </tr>))
    }
    </tbody>
    </table>
  </div>);
}

type PreconfiguredState = {
  selected:string
  category:string
  values:{
    [index:string]:Number | undefined
  }
}
type PreconfiguredProps = {
  state:PreconfiguredState,
  onStateChange:Types.Action1<PreconfiguredState>
  mode:BazaarMode
}


let BazaarTable = (props:{preHeaders?:string[], addedHeaders?:string[],children:React.ReactNode}) => (
  <Table headers={[...(props.preHeaders || []), 'Label','Value','Divisor','Vendor', ...(props.addedHeaders || [])]}>
    {props.children}
  </Table>
)

let Preconfigured = (props:PreconfiguredProps) =>{
  let forms = preconfigurations.find(x => x.name == props.state.selected).forms;
  let getValueKey = (lbl:string) => props.state.selected + '.' + lbl;
  let getKeyValue = (lbl:string) : number => +props.state.values[getValueKey(lbl)];
  let valueUpdate = <TProp extends keyof PreconfiguredState>(prop:TProp) => (getTargetValue('Preconfigured.select', (x:string)=> props.onStateChange(copyUpdate(props.state,prop,x as any as PreconfiguredState[TProp]))));
  // let valueUpdate = <TProp extends keyof PreconfiguredState>(prop:TProp) : Types.Action1<PreconfiguredState[TProp]> => (getTargetValue('Preconfigured.select',
    // (x:any) => props.onStateChange(copyUpdate(props.state,prop,x as any asPreconfiguredState[TProp]))));

  let formTypes = distinct(preconfigurations, x => x.category);
  let items = props.state.category != null && props.state.category != '' ? preconfigurations.filter(x => x.category == props.state.category) : preconfigurations;
  return (<div>
    <select className='select' value={props.state.category} onChange={valueUpdate('category')}>
      <option value=''>Filter...</option>
      {
        formTypes.map(x => <option key={x} value={x}>{x}</option>)
      }
    </select>
    <select name='selected' className='select' value={props.state.selected} onChange={getTargetInfo('Preconfigured.selected',x => props.onStateChange(copyUpdate(props.state,'selected', x.value))) as Types.Action1<any>}>
      <option value=''>Item</option>
      {items.map(pre =><option key={pre.name} value={pre.name}>{pre.name}</option>)}
    </select>
    <div>{props.state.selected}
      <BazaarTable>
          {
            forms.map(form =>(
              <tr key={form.label} className="tr">
                <td title={form.asterisk} className={(form.asterisk != null ? 'star' : '') + ' td'}>{form.label}</td>
                <td><NumberInput name={form.label} value={getKeyValue(form.label)} onChange={x => props.onStateChange(copyUpdate(props.state,'values',copyUpdate(props.state.values,getValueKey(form.label),+x.value)))} /></td>
                <td>{form.div}</td>
                <td>{form.vend}</td>
              </tr>
            ))
          }
      </BazaarTable>
    </div>
    <RateDisplay mode={props.mode} values={forms
        .map(form =>({name:form.label,value:getKeyValue(form.label), div:form.div}))
        .filter(x => x.value > 0)
        .sort((x,y) => {
          let xval = +x.value / +x.div;
          let yval = +y.value/+y.div
          return props.mode == 'Sell'?
          +yval - +xval :(
          +xval - +xval);
        }
        )} />
    <hr />
    <Diagnostic show={true} value={props.state} />
  </div>);
}

export type Submenu = 'Preconfigured' | 'Custom' | 'Merchants'

type CustomItem = {
  label:string
  value:number
  div:number
  vendor?:number
}

type CustomState = {
  items:CustomItem[]
  newItem:CustomItem
}
type CustomProps = {
  state:CustomState
  onCustomStateChange:Types.Action1<CustomState>
}
let initNewItem = {label:'', value:1, div:1}
let initCustomState:CustomState = {
  items:[],
  newItem: initNewItem
}

let Custom = (props:CustomProps) => {
  let onUpdate = <T extends keyof CustomState>(k:T) =>
    (x:CustomState[T]) => props.onCustomStateChange(copyUpdate(props.state,k,x))
  let onNewUpdate = <T extends keyof CustomItem>(k:T) => (x:CustomItem[T]) => onUpdate('newItem')(copyUpdate(props.state.newItem,k,x));
  let CustomTdInput = <T extends keyof CustomItem>(props: { name: T; type: string; value: CustomItem[T]}) => (
      <td key={props.name}>
        <input type={props.type} name={props.name} className='input' defaultValue={props.value} onChange={getTargetValue('Custom.TdInput.'+props.name,x => onNewUpdate(props.name)(x as any as CustomItem[T]))} />
      </td>
  );

  let addNew = () =>
    {
      if(isValueString(props.state.newItem.label) && props.state.items.find(item => item.label == props.state.newItem.label) == null) 
      {
        let nextItems = [props.state.newItem, ...props.state.items];
        let newItem : CustomItem = copyUpdate(props.state.newItem,'label','');
        props.onCustomStateChange({newItem:newItem,items:nextItems});
      }
      else {}
    };
  return (
    <div>
        <BazaarTable preHeaders={['']}>
          {props.state.items.map(x => (<tr key={x.label}><td>{x.label}</td><td>{x.value}</td><td>{x.div}</td><td>{x.vendor}</td></tr>))}
          <tr key='new'>
            <td><button className='button' onClick={addNew}><FontAwesomeIcon icon={faSave} className={'has-text-info'} /></button></td>
            <CustomTdInput type='text' name='label' value={props.state.newItem.label} />
            <CustomTdInput type='number' name='value' value={props.state.newItem.value} />
          </tr>
        </BazaarTable>
    </div>
)};

let MerchantInfo = (props: any) => {
  //let merchants = referenceValues.map(x => x)
  return (<div>
  {
    referenceValues.map(r =>(
    <div> {r.name}
    <ul className='list ul bd-outline'>
      {
        r.values.map(x => <li className='list-item'>{x.name} - {x.value}</li>)
      }
    </ul>
    </div>))
  }
  </div>);
};
export type BazaarState = {
  submenu:Submenu
  mode: BazaarMode
  preconfigured:PreconfiguredState
  customState: CustomState
}

type BazaarProps = {
  theme:string
  state:BazaarState,
  onStateChange: Types.Action1<BazaarState>
}

export const bazaarStateInit : BazaarState = {
  submenu:'Preconfigured',
  mode:'Sell',
  preconfigured:{category:'',selected:'Ice',values:{}},
  customState: initCustomState
}

let updateState = <TProp extends keyof BazaarState>(state:BazaarState,f:Types.Action1<BazaarState>) => (property:TProp) =>  (value:BazaarState[TProp]):void =>
  f(copyUpdate(state,property,value));

export let Bazaar = (props:BazaarProps) => {
  // let onTabClick = (x:Submenu) => props.onStateChange(copyUpdate(props.state,'submenu', x));
  let onUpdate = updateState(props.state,props.onStateChange);
  let onTabClick : Types.Action1<BazaarState['submenu']> = onUpdate('submenu');
  let tab = props.state.submenu == 'Preconfigured'? <Preconfigured mode={props.state.mode} state={props.state.preconfigured} onStateChange={onUpdate('preconfigured')} /> : 
    props.state.submenu == 'Custom' ? <Custom state={props.state.customState} onCustomStateChange={onUpdate('customState')} /> :
    props.state.submenu == 'Merchants' ? <MerchantInfo /> :
    (<div>unmapped menu {props.state.submenu}</div>);
  return(<div>
    <select value={props.state.mode} onChange={getTargetValue<BazaarMode,void>('Bazaar.select.mode',x => onUpdate('mode')(x) as any)}>
      {
        ['Buy','Sell'].map(n => (<option key={n} value={n} >{n}</option>))
      }
    </select>
    {props.state.mode}
    <TabContainer addedClasses={props.theme}>
      {
        ['Preconfigured','Custom','Merchants'].map( (name:Submenu) => (
        <TabTextLink name={name} key={name} active={props.state.submenu} onClick={onTabClick} />
      ))}
    </TabContainer>
    <div className={props.theme}>
    {tab}
    </div>
    <Diagnostic show={true} value={props.state} />
  </div>
  );
}