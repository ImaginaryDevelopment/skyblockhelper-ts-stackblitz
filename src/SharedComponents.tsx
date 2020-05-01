import React, { Component, PropsWithChildren } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';

import * as Types from './Types'

import {getTargetInfo,createStorageAccess,StorageAccess} from './Shared'
// use React.cloneElement to take a component and add tags
// {React.cloneElement(props.input,{className:'' + (props.input.className || '') + ' input '})}

// export type ComponentEventHandler<TComponentState> = (next:TComponentState) => void;

// https://bulma.io/documentation/modifiers/syntax/
type SizeClass = 'is-large' | 'is-small';

export type CreateFunctionalComponent<TProps,TState> = (props: TProps) => Component<TProps,TState>; 

export type NumberInputProps = {
  name:string
  onChange:Types.Action1<Types.NameValue>
  placeholder?:string
  value?: number
}

export let NumberInput = (props:NumberInputProps) =>(
  <input className='input' onChange={getTargetInfo('Number.onChange',props.onChange) as any} name={props.name} placeholder={props.placeholder} type='number' defaultValue={props.value as any as string} />
);

export type InputColumnProps = {
  name:string
  placeholder?:string
  defaultValue:string | string[]
  type?:string
  onChange:Types.Action1<Types.NameValue>
  addedClasses?: string
  title?:string
}
// type InputType = React.DetailedHTMLProps<
// let inputb = <select />
// let inputa = <input />
// export let HField = (props: { title: string; label: string; input: React.DetailedReactHTMLElement<{ className: string; }, HTMLElement>; }) =>(
export let HField = <T extends React.ReactElement<any>>(props: { title: string; label: string; input: T }) =>(
  <div className='' title={props.title}>
  <div className='field is-horizontal'>
    <div className='field-label is-normal'>
      <label className='label'>{props.label}</label>
    </div>
    <div className='field-body'>
      <div className='field'>
        <p className='control'>
          {React.cloneElement(props.input,{className:'' + (props.input.props.className || '') + ' input '})}
        </p>
      </div>
    </div>
  </div>
  </div>
)
export type TabLinkProps<T extends string> = {
  name:T
  onClick:Types.Action1<T>
  active: T | undefined
  children: React.ReactNode
  title?:string
}
export let TabLink = <T extends string>(props:TabLinkProps<T>) => (
    <li key={props.name} title={props.title || props.name} className={props.active==props.name?'active':''}><a onClick={() => props.onClick(props.name)} data-name={props.name}>{props.children}</a></li>);

export type TabTextLinkProps<T extends string> = {
  name:T
  onClick:Types.Action1<T>
  active:T | undefined
}

//export let TabL
export let TabTextLink = <T extends string>(props:TabTextLinkProps<T>) => (
    <TabLink name={props.name} active={props.active} onClick={props.onClick}>{props.name}</TabLink>);

export type TabContainerProps<T extends string>  = {
  addedClasses?: string
  children?:React.ReactNode
  stdTabs?:{names:T[],onClick:Types.Action1<T>,active:T}
}
export let TabContainer = <T extends string>(props:TabContainerProps<T>) => (
  <div className={'tabs is-centered is-boxed ' + (props.addedClasses || '')}>
    <ul>
      {
        props.stdTabs == null ? '' : (props.stdTabs.names.map(n => (<TabTextLink name={n} active={props.stdTabs.active} onClick={props.stdTabs.onClick} />)))
      }
    {props.children}
    </ul>
  </div>
);

export interface StatefulProps<TState> {
  state:TState
  onStateChange: Types.Action1<TState>
}
type DiagnosticProps ={
  show:boolean
  value:any
}
export let Diagnostic = (props:DiagnosticProps) => (
  <pre>
    {props.show?JSON.stringify(props.value,undefined,4): ''}
  </pre>
)
type TextLI = {
  key:string
}
export let TextLI = (props:Types.NameValue) => (
  <li key={props.value} className='li ' data-name={props.value}>{props.value}</li>
)

export let Table = (props:{headers:string[], children:React.ReactNode}) => (
  <table className="table">
            <thead>
              <tr>
                {props.headers.map(h =>
                  <th key={h} className='th'>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {props.children}
            </tbody>
          </table>
)

type FoldableListState = {
  isFolded:boolean
}
type FoldableListProps = {
  defaultFold:boolean,
  title:string,
  
  children:React.ReactNode
}
let initState = (props:FoldableListProps) => ({
  isFolded: props.defaultFold
});

export let FoldTarget = (props:{isFolded:boolean, children:React.ReactNode}) => (<React.Fragment>
  {props.isFolded? null : props.children}
</React.Fragment>);

export let FoldMaster = (props:{title:string,isFolded:boolean,onToggle:Types.Action1<boolean>}) =>
{
  let toggle = () => props.onToggle(props.isFolded == false);
  return (<div onClick={toggle}>{<FontAwesomeIcon icon={props.isFolded === true ? faPlus : faMinus} />} {props.title}</div>);
}

// mostly just an example, the html structure not useful in most cases
export let Foldable : CreateFunctionalComponent<FoldableListProps,FoldableListState> = props =>
{
  const component : Component<FoldableListProps,FoldableListState> = new React.Component(props);
  component.state = initState(props);
  let toggle = () => component.setState({isFolded:component.state.isFolded == false});
  component.render = () => {
    return (<div>
      <div onClick={toggle}>{<FontAwesomeIcon icon={component.state.isFolded? faPlus : faMinus} />} {props.title}</div>
      {component.state.isFolded? null : <div>{props.children}</div>}
    </div>);
  }
  return component;
}

export type ComRenderer <TProps,TState> = (props:React.PropsWithChildren<TProps>,currentState:Readonly<TState>, updateState:Types.Action1<TState>) => React.ReactElement<TProps>;

type StatedComponentCreator = <TProps,TState>(initialState:TState,f:Types.Func3<TProps,TState,Types.Action1<TState>,React.ReactElement<TProps>>, 
  fStateObserver?:Types.Action1<TState>) => React.FC<TProps>

// does not account for the possibility that initial state depends on initial props (as in input's defaultValue for instance)
export const createStatedComponent : StatedComponentCreator = <TProps,TState>(initialState:TState,f:ComRenderer<TProps,TState>, 
  fStateObserver?:Types.Action1<TState>) : React.FC<TProps> =>
  (props) =>
    {
    const [state,setState] = React.useState<TState>(initialState);
    return (f(props,state, x => {if(fStateObserver != null) fStateObserver(x);
      setState(x);
    }));
  };

export const createStoredComponent = <TProps,TState>(storage:StorageAccess<TState>) => {
  return (initialState:TState,
  f:Types.Func3<TProps,TState,Types.Action1<TState>,React.ReactElement<TProps>>,
  fStateObserver?:Types.Action1<TState>) =>
  (props:TProps) => {
    let fStateObserver2 = (state:TState) => {
      if(fStateObserver != null){
        fStateObserver(state);
        storage.storeIt(state);
      }
    };
    let component = createStatedComponent(initialState,f,fStateObserver2)(props);
    return component;
  };
};

// export let createStoredComponent = <TProps,TState>(key:string, initialProps:TProps, storage:StorageAccess<TState>) =>
//   (fState:Types.Func1<TProps,TState>, render:ComRenderer<TState>):CreateFunctionalComponent<TProps,TState> => (props:TProps):React.Component<TProps,TState> => {
//   // storage will be updated before component
//   let onChange = (f:Types.Action1<TState>) => (next:TState) => {
//     storage.storeIt(key,next);
//     // update component state
//     f(next);
//   }
//   console.log('component created:' + key);
//   let stcmp = createStatedComponent<TProps,TState>(initialProps);
//   let Component = stcmp(fState,(currentState,onStateChange) => render(currentState,onChange(onStateChange)));
//   return (<Component {...props} />)
// }
// export let FAIcon = props =>(
//   <span className={'icon ' + props.addedClasses}><i className={'fa '+props.icon}></i></span>);
  