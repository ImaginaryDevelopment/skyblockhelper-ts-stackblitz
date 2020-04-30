import './style.css';

import React, { Component } from 'react';
// https://stackblitz.com/edit/font-awesome for reference
// https://fontawesome.com/icons?d=gallery&m=free for icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFlask, faDollarSign, faHatWizard, faCalendarAlt, faBone, faWarehouse } from '@fortawesome/free-solid-svg-icons';

import { render } from 'react-dom';
import {copyUpdate,getTargetValue, createStorageAccess} from './Shared'

import {TabContainer,TabLink,TabTextLink,Diagnostic,CreateFunctionalComponent} from './SharedComponents';

import {BazaarState,bazaarStateInit,Bazaar} from './Bazaar';
import {BrewingState,initBrewingState,BrewingComponent} from './Brewing'
import {EnchantsMenuState,enchantsMenuInit,EnchantsMenu} from './Enchants';
import {EventCalc} from './Events';
import {MinionTab, MinionTabState, initMinionTabState} from './Minions';
import {CollectionTracker} from './Collections';


// type Components = 'Bazaar' | 'Enchants' | 'Minions' | 'Events' | 'Potions'
interface AppProps { }
interface AppComponents{
  enchantsState:EnchantsMenuState
  bazaarState:BazaarState
  brewingState:BrewingState
  eventState: {days:number,hours:number,minutes:number}
  minionState: MinionTabState,
  
}

interface AppState {
  activeTab:string
  colorRecommendations:boolean
  showTextMenus:boolean
  theme:string

  components:AppComponents
}

let initState : AppState = {
  activeTab: 'Bazaar',
  //enchantState:initEnchantState,
  colorRecommendations: true,
  showTextMenus: false,
  theme:'',
  components:{
      enchantsState: enchantsMenuInit,
      bazaarState: bazaarStateInit,
      eventState: {days:2,hours:3,minutes:30},
      minionState: initMinionTabState,
      brewingState: initBrewingState
  }
};
let getStorage = <T,>(key:string) => createStorageAccess(window)<T>(key);

// hooks : https://levelup.gitconnected.com/usetypescript-a-complete-guide-to-react-hooks-and-typescript-db1858d1fb9c
const App : React.FC = () => {
  const appStorage = getStorage<AppState>('App');
  const [state,setState] = React.useState<AppState>(appStorage.readIt(initState));
  const update = <T extends keyof AppState>(prop:T,value:AppState[T]) =>{
    let next = copyUpdate(state,prop,value);
    appStorage.storeIt(next);
    setState(next);
  }
  const handleTabClick = (name: string) => () =>{
     console.log('handling tab click', name);
     update('activeTab',name);
  }
  const handleComponentUpdate = <T extends keyof AppComponents> (name:T) => 
      (value:AppComponents[T]) : void =>{
        console.log('handleComponentUpdate', name,value);
        let nextcomponents = copyUpdate(state.components, name,value);
        update('components',nextcomponents);
  };

  const tabSelector = (state:AppState) => (active:AppState['activeTab']) =>{
    console.log('tabSelector', active);
    try{
      switch(active){
        case 'Brewing':
          return (()  => {
          const handleUpdate = handleComponentUpdate('brewingState');
          return (<BrewingComponent theme={state.theme == 'callout'? 'bd-callout': ''} state={state.components.brewingState} onStateChange={handleUpdate} />)
        })();
        case 'Enchants':
          return (() => {
          const handleUpdate = handleComponentUpdate('enchantsState');
          return (<EnchantsMenu 
            state={state.components.enchantsState}
            onStateChange={handleUpdate}
            />); 
          })();

        case 'Bazaar': return (() =>{
          const handleUpdate = handleComponentUpdate('bazaarState');
          return (<Bazaar theme={state.theme == 'callout'? 'bd-callout': ''} state={state.components.bazaarState} onStateChange={handleUpdate} />)
        })();

        case 'Minions': return (() =>{
          const handleUpdate = handleComponentUpdate('minionState');
          return (<MinionTab state={state.components.minionState} onStateChange={handleUpdate} />);
        })();

        case 'Events': return (() =>{
          const handleUpdate = handleComponentUpdate('eventState');
          return (<EventCalc theme={state.theme} state={state.components.eventState} onStateChange={handleUpdate} />)
        })();
        case 'Collections': return (() =>{
          return (<CollectionTracker getStorage={key=> getStorage('Collections' + '.' + key)} />);
        })();
      }
    }
    catch(e){
      return <div>{JSON.stringify(e,null,4)}</div>;
    }

    return (<div>Tab not mapped {active}</div>);

  }

  let tabs = [
    {name:'Bazaar',icon:faDollarSign},
    {name:'Brewing',icon:faFlask},
    {name:'Enchants',icon:faHatWizard},
    {name:'Events',icon:faCalendarAlt},
    {name:'Minions',icon:faBone},
    {name:'Collections',icon:faWarehouse}
  ]


  let TabIt = (props:{name:string,activeTab:string,icon:IconProp}) => 
    <TabLink name={props.name} active={state.activeTab} onClick={handleTabClick(props.name)}><FontAwesomeIcon icon={props.icon} /></TabLink>;

  return (<div>
    <TabContainer>
      {
        tabs.map(x => state.showTextMenus? <TabTextLink name={x.name} active={state.activeTab} onClick={handleTabClick(x.name)} />:
        <TabIt key={x.name} name={x.name} icon={x.icon} activeTab={state.activeTab} />)
      }

      <li className='select is-pulled-right'><select className='' onChange={getTargetValue('theme select', x => update('theme',x))} value={state.theme}>
        <option value=''>Themes...</option>
        <option value='callout'>Callout</option>
        <option value='text'>Text</option>
      </select></li>
      <li className='m-left'><label className='checkbox'>
        <input type="checkbox" checked={state.showTextMenus} onClick={() => update('showTextMenus',state.showTextMenus == false)} />
        Text menus
      </label></li>
    </TabContainer>
    <h2 className='is-size-2 has-text-centered'>{state.activeTab}</h2>
    {tabSelector(state)(state.activeTab)}
  </div>);
};

// this version of react/typescript complains about using App directly even though it works fine
// let A = App as any
render(<App /> as any, document.getElementById('root'));
