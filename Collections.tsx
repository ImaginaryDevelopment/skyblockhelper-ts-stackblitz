import React from 'react';
import {ArmorComponent} from './collections/Armors'
import { StorageAccess } from './Shared';


type CollectionTrackerProps = {
  getStorage:<T>(key:string) => StorageAccess<T>
}
export let CollectionTracker = (props:CollectionTrackerProps) =>
  {
    // export type WrappedComponentT<TProps,TState> = (fState:Types.Func1<TProps,TState>,render:ComRenderer<TState>) => (props:TProps) => React.Component<TProps,TState>
    // let Armor = makeArmorCom('Collections',props.store);
    let armor = (<ArmorComponent getStorage={props.getStorage} />);
    if(!React.isValidElement(armor)) console.error('bad element',armor);
    console.log('making collection tracker')
    return (<div>Collections {armor}</div>);
  };
