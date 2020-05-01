import React from 'react';
import {ArmorComponent} from './collections/Armors'
import { StorageAccess, copyUpdate } from './Shared';
import { TabContainer } from './SharedComponents';
import { WeaponComponent } from './collections/Weapons';


type CollectionComponentState = {
  subtab: 'Armor' | 'Weapons'
}
type CollectionComponentProps = {
  getStorage:<T>(key:string) => StorageAccess<T>
}
let getTab = (subtab:CollectionComponentState['subtab'],props:CollectionComponentProps) => {
  let getStorage = <T,>(key:string) => props.getStorage<T>('CollectionComponent.' + key);
  switch(subtab){
    case 'Armor': return (<ArmorComponent getStorage={getStorage} />);
    case 'Weapons': return(<WeaponComponent getStorage={getStorage} />);
  }
}
export const CollectionComponent = (props:CollectionComponentProps) => {
  const collectionStorage = props.getStorage<CollectionComponentState>('CollectionComponent');
  const oldState : CollectionComponentState= collectionStorage.readIt({subtab:'Armor'});
  const [state,setState] = React.useState<CollectionComponentState>(oldState);
  let update = <T extends keyof CollectionComponentState>(key:T) => (value:CollectionComponentState[T]) => {
    let next = copyUpdate(state,key, value);
    collectionStorage.storeIt(next);
    setState(next);
  }
    // export type WrappedComponentT<TProps,TState> = (fState:Types.Func1<TProps,TState>,render:ComRenderer<TState>) => (props:TProps) => React.Component<TProps,TState>
    // let Armor = makeArmorCom('Collections',props.store);
    let tab = getTab(state.subtab,props);
    if(!React.isValidElement(tab)) console.error('bad element',tab);
    console.log('making collection tracker')
    return (<div>Collections 
      <TabContainer stdTabs={{names:['Armor','Weapons'], onClick: x => update('subtab')(x), active:state.subtab}}>
      </TabContainer>
        { tab }
      </div>);
};
